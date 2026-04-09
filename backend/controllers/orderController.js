import "dotenv/config";
import Stripe from "stripe";
import { DEFAULT_RESTAURANT_ID } from "../config/db.js";
import foodModel from "../models/foodModel.js";
import orderModel from "../models/orderModel.js";
import paymentModel from "../models/paymentModel.js";
import userModel from "../models/userModel.js";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const hasLiveStripeKey =
  Boolean(stripeSecretKey) && !stripeSecretKey.toLowerCase().includes("placeholder");
const DELIVERY_FEE = 2;

const getUserId = (req) => req.user?.id || req.body.userId;
const getFrontendUrl = (req) =>
  process.env.FRONTEND_URL || req.get("origin") || "http://localhost:5173";

const resolveOrderItems = async (items = []) => {
  const resolvedItems = [];

  for (const item of items) {
    const foodId = item?._id || item?.id;
    const quantity = Number(item?.quantity || 0);

    if (!foodId || quantity <= 0) {
      continue;
    }

    const food = await foodModel.findById(foodId);
    if (!food) {
      throw new Error(`Food not found: ${foodId}`);
    }

    resolvedItems.push({
      _id: food._id,
      name: food.name,
      description: food.description,
      price: food.price,
      image: food.image,
      category: food.category,
      restaurantId: food.restaurantId || DEFAULT_RESTAURANT_ID,
      quantity,
    });
  }

  return resolvedItems;
};

const buildStripeLineItems = (items) =>
  items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(Number(item.price) * 100),
    },
    quantity: item.quantity,
  }));

// placing user order for frontend
const placeOrder = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Please log in again." });
  }

  let createdOrder = null;
  const frontendUrl = getFrontendUrl(req);

  try {
    const orderItems = await resolveOrderItems(req.body.items);
    if (!orderItems.length) {
      return res.status(400).json({ success: false, message: "Order items are required." });
    }

    const subtotal = orderItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0
    );
    const amount = Number((subtotal + DELIVERY_FEE).toFixed(2));
    const restaurantId =
      req.body.restaurantId || orderItems[0]?.restaurantId || DEFAULT_RESTAURANT_ID;

    createdOrder = await new orderModel({
      userId,
      restaurantId,
      items: orderItems,
      amount,
      address: req.body.address,
      payment: false,
    }).save();

    await paymentModel.upsertByOrderId({
      orderId: createdOrder._id,
      userId,
      provider: hasLiveStripeKey ? "stripe" : "mock-stripe",
      sessionId: null,
      status: "pending",
      currency: "usd",
      amount,
    });

    if (!hasLiveStripeKey) {
      const mockSessionUrl = `${frontendUrl}/verify?success=true&orderId=${createdOrder._id}`;
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return res.json({ success: true, session_url: mockSessionUrl });
    }

    const line_items = buildStripeLineItems(orderItems);
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: Math.round(DELIVERY_FEE * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${createdOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${createdOrder._id}`,
    });

    await paymentModel.updateByOrderId(createdOrder._id, {
      sessionId: session.id,
    });
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    if (
      error?.type === "StripeAuthenticationError" ||
      error?.statusCode === 401
    ) {
      const mockSessionUrl = `${frontendUrl}/verify?success=true&orderId=${createdOrder._id}`;
      await paymentModel.updateByOrderId(createdOrder._id, {
        provider: "mock-stripe",
      }).catch(() => null);
      await userModel.findByIdAndUpdate(userId, { cartData: {} }).catch(() => null);
      return res.json({ success: true, session_url: mockSessionUrl });
    }

    if (createdOrder?._id) {
      await paymentModel.deleteByOrderId(createdOrder._id).catch(() => null);
      await orderModel.findByIdAndDelete(createdOrder._id).catch(() => null);
    }

    console.log(error);
    const statusCode = String(error?.message || "").startsWith("Food not found:")
      ? 404
      : 500;
    res.status(statusCode).json({ success: false, message: error.message || "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId } = req.body;
  const success = String(req.body.success);

  try {
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order id is required." });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await paymentModel.updateByOrderId(orderId, { status: "succeeded" }).catch(() => null);
      return res.json({ success: true, message: "Paid" });
    }

    await paymentModel.updateByOrderId(orderId, { status: "failed" }).catch(() => null);
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: false, message: "Not Paid" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Please log in again." });
  }

  try {
    const orders = await orderModel.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Listing orders for admin pannel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "Order id and status are required." });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    await orderModel.findByIdAndUpdate(orderId, {
      status,
    });
    res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const createCheckoutSession = placeOrder;
const verifyPayment = verifyOrder;

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  createCheckoutSession,
  verifyPayment,
};

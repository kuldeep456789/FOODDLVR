import userModel from "../models/userModel.js";

const getUserId = (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized. Please log in again." });
    return null;
  }

  return userId;
};

// add items to user cart
const addToCart = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) {
      return;
    }

    const itemId = req.body.itemId;
    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item id is required." });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const cartData = { ...(userData.cartData || {}) };
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// remove from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) {
      return;
    }

    const itemId = req.body.itemId;
    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item id is required." });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const cartData = { ...(userData.cartData || {}) };
    if ((cartData[itemId] || 0) > 1) {
      cartData[itemId] -= 1;
    } else {
      delete cartData[itemId];
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// fetch user cart data
const getCart = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) {
      return;
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const cartData = userData.cartData || {};
    res.json({ success: true, cartData: cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };

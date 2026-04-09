import express from "express";
import authMiddleware from "../middleware/auth.js";
import requireRole from "../middleware/requireRole.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
} from "../controllers/orderController.js";
import { checkoutRateLimit } from "../middleware/rateLimit.js";
import { validateCheckoutRequest } from "../middleware/validateRequest.js";

const orderRouter = express.Router();

orderRouter.post(
  "/place",
  authMiddleware,
  checkoutRateLimit,
  validateCheckoutRequest,
  placeOrder
);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/status", authMiddleware, requireRole("admin"), updateStatus);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list", authMiddleware, requireRole("admin"), listOrders);

export default orderRouter;

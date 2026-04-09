import express from "express";
import { createCheckoutSession, verifyPayment } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";
import { checkoutRateLimit } from "../middleware/rateLimit.js";
import { validateCheckoutRequest } from "../middleware/validateRequest.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/",
  authMiddleware,
  checkoutRateLimit,
  validateCheckoutRequest,
  createCheckoutSession
);
paymentRouter.post("/verify", verifyPayment);

export default paymentRouter;

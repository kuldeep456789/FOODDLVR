import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { authRateLimit } from "../middleware/rateLimit.js";
import {
  validateLoginRequest,
  validateRegisterRequest,
} from "../middleware/validateRequest.js";

const userRouter = express.Router();

userRouter.post("/register", authRateLimit, validateRegisterRequest, registerUser);
userRouter.post("/login", authRateLimit, validateLoginRequest, loginUser);

export default userRouter;

import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";
import requireRole from "../middleware/requireRole.js";
import { validateFoodRequest } from "../middleware/validateRequest.js";

const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage });

foodRouter.post(
  "/add",
  authMiddleware,
  requireRole("admin"),
  upload.single("image"),
  validateFoodRequest,
  addFood
);
foodRouter.get("/list",listFood);
foodRouter.post("/remove", authMiddleware, requireRole("admin"), removeFood);

export default foodRouter;

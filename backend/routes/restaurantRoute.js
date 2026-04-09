import express from "express";
import {
  getRestaurantById,
  getRestaurantMenu,
  listRestaurants,
} from "../controllers/restaurantController.js";

const restaurantRouter = express.Router();

restaurantRouter.get("/", listRestaurants);
restaurantRouter.get("/:id/menu", getRestaurantMenu);
restaurantRouter.get("/:id", getRestaurantById);

export default restaurantRouter;

import foodModel from "../models/foodModel.js";
import { unlink } from "fs/promises";
import { DEFAULT_RESTAURANT_ID } from "../config/db.js";

const addFood = async (req, res) => {
  try {
    const imageFilename = req.file?.filename;
    if (!imageFilename) {
      return res.status(400).json({ success: false, message: "Food image is required." });
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: imageFilename,
      restaurantId: req.body.restaurantId || DEFAULT_RESTAURANT_ID,
    });

    await food.save();
    res.json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({
      restaurantId: req.query.restaurantId,
      category: req.query.category,
    });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    await unlink(`uploads/${food.image}`).catch(() => null);
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };

import foodModel from "../models/foodModel.js";
import restaurantModel from "../models/restaurantModel.js";

const listRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find();
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getRestaurantMenu = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    const foods = await foodModel.find({
      restaurantId: restaurant._id,
      category: req.query.category,
    });

    res.json({ success: true, restaurant, data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export { getRestaurantById, getRestaurantMenu, listRestaurants };

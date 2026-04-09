import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import SaladShowcase from "./SaladShowcase";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const filteredItems = food_list.filter(
    (item) => category === "All" || item.category === category
  );

  if (category === "Salad") {
    return (
      <div className="food-display food-display--salad" id="food-display">
        <SaladShowcase items={filteredItems.slice(0, 3)} />
      </div>
    );
  }

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {filteredItems.map((item, index) => (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;

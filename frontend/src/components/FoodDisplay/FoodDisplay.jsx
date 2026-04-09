import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, onResetCategory }) => {
  const { food_list } = useContext(StoreContext);
  const filteredItems = food_list.filter(
    (item) => category === "All" || item.category === category
  );
  const isAllCategories = category === "All";
  const sectionTitle = isAllCategories
    ? "Top dishes near you"
    : `${category} dishes near you`;
  const sectionText = isAllCategories
    ? "Browse the dishes people are ordering most right now."
    : `Showing ${filteredItems.length} ${category.toLowerCase()} dish${
        filteredItems.length === 1 ? "" : "es"
      } picked from this menu.`;

  return (
    <div className="food-display" id="food-display">
      <div className="food-display__header">
        <div>
          <p className="food-display__eyebrow">Selected category</p>
          <h2>{sectionTitle}</h2>
          <p className="food-display__text">{sectionText}</p>
        </div>
        {!isAllCategories ? (
          <button
            type="button"
            className="food-display__reset"
            onClick={onResetCategory}
          >
            Show all dishes
          </button>
        ) : null}
      </div>

      {filteredItems.length === 0 ? (
        <div className="food-display__empty">
          <h3>No dishes found for {category}</h3>
          <p>
            Try another filter or switch back to all dishes to explore the full
            menu.
          </p>
          <button type="button" onClick={onResetCategory}>
            View all dishes
          </button>
        </div>
      ) : null}

      <div className="food-display-list">
        {filteredItems.map((item) => (
          <FoodItem
            key={item._id}
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

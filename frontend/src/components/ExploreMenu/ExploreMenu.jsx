import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/frontend_assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  const handleCategoryClick = (menuName) => {
    setCategory((currentCategory) =>
      currentCategory === menuName ? "All" : menuName
    );
  };

  return (
    <section className="explore-menu" id="explore-menu">
      <div className="explore-menu__panel">
        <div className="explore-menu__header">
          <div className="explore-menu__copy">
            <p className="explore-menu__eyebrow">Curated selection</p>
            <h1>Explore our menu</h1>
            <p className="explore-menu__text">
              Choose from a diverse menu featuring a delectable array of
              dishes. Our mission is to satisfy your cravings and elevate your
              dining experience, one delicious meal at a time.
            </p>
          </div>
          <a className="explore-menu__view-all" href="#food-display">
            View All
          </a>
        </div>

        <div className="explore-menu__list" role="list" aria-label="Menu categories">
          {menu_list.map((item) => {
            const isActive = category === item.menu_name;

            return (
              <button
                key={item.menu_name}
                type="button"
                className={`explore-menu__item${isActive ? " is-active" : ""}`}
                onClick={() => handleCategoryClick(item.menu_name)}
                aria-pressed={isActive}
                aria-label={`Filter by ${item.menu_name}`}
              >
                <span className="explore-menu__image-shell">
                  <img src={item.menu_image} alt={item.menu_name} loading="lazy" />
                </span>
                <span className="explore-menu__label">{item.menu_name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreMenu;

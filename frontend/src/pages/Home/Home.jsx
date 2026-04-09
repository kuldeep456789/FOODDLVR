import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import { menu_list } from "../../assets/frontend_assets/assets";

const Home = () => {
  const [category, setCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const allDishesPreview = menu_list[0]?.menu_image;

  const handleCategoryClick = (nextCategory) => {
    setCategory((currentCategory) =>
      currentCategory === nextCategory ? "All" : nextCategory
    );
  };

  return (
    <section
      className={`home-layout${isFilterOpen ? "" : " is-filter-collapsed"}`}
      id="explore-menu"
    >
      <aside
        className="home-filter"
        id="home-filter-panel"
        aria-label="Food filters"
        aria-hidden={!isFilterOpen}
      >
        <div className="home-filter__panel">
          <p className="home-filter__eyebrow">Quick filters</p>
          <h2>Refine menu</h2>
          <p className="home-filter__text">
            Pick a category to instantly filter dishes.
          </p>

          <div className="home-filter__list" role="list">
            <button
              type="button"
              className={`home-filter__item${
                category === "All" ? " is-active" : ""
              }`}
              onClick={() => setCategory("All")}
              aria-pressed={category === "All"}
            >
              <span className="home-filter__item-media" aria-hidden="true">
                {allDishesPreview ? (
                  <img src={allDishesPreview} alt="" loading="lazy" />
                ) : (
                  <span className="home-filter__item-media-fallback">All</span>
                )}
              </span>
              <span className="home-filter__item-copy">
                <span className="home-filter__item-name">All dishes</span>
                <span className="home-filter__item-meta">Everything</span>
              </span>
            </button>

            {menu_list.map((item) => {
              const isActive = category === item.menu_name;
              return (
                <button
                  key={item.menu_name}
                  type="button"
                  className={`home-filter__item${isActive ? " is-active" : ""}`}
                  onClick={() => handleCategoryClick(item.menu_name)}
                  aria-pressed={isActive}
                >
                  <span className="home-filter__item-media" aria-hidden="true">
                    <img src={item.menu_image} alt="" loading="lazy" />
                  </span>
                  <span className="home-filter__item-copy">
                    <span className="home-filter__item-name">{item.menu_name}</span>
                    <span className="home-filter__item-meta">Category</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="home-content">
        <div className="home-content-toolbar">
          <button
            type="button"
            className="home-filter-toggle"
            aria-controls="home-filter-panel"
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen((open) => !open)}
          >
            <span className="home-filter-toggle__label">
              {isFilterOpen ? "Hide filters" : "Show filters"}
            </span>
            <span
              className={`home-filter-toggle__slider${
                isFilterOpen ? " is-on" : ""
              }`}
              aria-hidden="true"
            >
              <span className="home-filter-toggle__thumb" />
            </span>
          </button>
        </div>

        <Header />
        <FoodDisplay category={category} />
      </div>
    </section>
  );
};

export default Home;

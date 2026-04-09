import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./SaladShowcase.css";

const saladHighlights = ["Fresh Catch", "Chef's Pick", "Seasonal Bowl"];

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 21s-6.7-4.35-9.5-8.37C-0.35 8.5 2.1 3.75 6.7 3.75c2.05 0 3.55 1.02 4.55 2.32 1-1.3 2.5-2.32 4.55-2.32 4.6 0 7.05 4.75 4.2 8.88C18.7 16.65 12 21 12 21Z" />
  </svg>
);

const SaladShowcase = ({ items }) => {
  const { addToCart, cartItems, url } = useContext(StoreContext);

  return (
    <section className="salad-showcase" aria-labelledby="salad-showcase-title">
      <div className="salad-showcase__panel">
        <div className="salad-showcase__header">
          <div className="salad-showcase__copy">
            <p className="salad-showcase__eyebrow">Salad spotlight</p>
            <h2 id="salad-showcase-title">Fresh, bold, and beautifully plated</h2>
            <p className="salad-showcase__text">
              A curated set of crisp greens, creamy avocado, and bright dressings
              to match the visual style you shared.
            </p>
          </div>
        </div>

        <div className="salad-showcase__grid">
          {items.map((item, index) => {
            const isInCart = Boolean(cartItems[item._id]);
            const badge = saladHighlights[index % saladHighlights.length];

            return (
              <article className="salad-card" key={item._id}>
                <div className="salad-card__media">
                  <img
                    src={`${url}/images/${item.image}`}
                    alt={item.name}
                    className="salad-card__image"
                    loading="lazy"
                  />
                  <span className="salad-card__price">${item.price}</span>
                </div>

                <div className="salad-card__body">
                  <div className="salad-card__title-row">
                    <h3>{item.name}</h3>
                    <span className="salad-card__badge">{badge}</span>
                  </div>

                  <p className="salad-card__description">{item.description}</p>

                  <div className="salad-card__actions">
                    <button
                      type="button"
                      className="salad-card__bag-button"
                      onClick={() => addToCart(item._id)}
                    >
                      {isInCart ? `In Bag · ${cartItems[item._id]}` : "Add to Bag"}
                    </button>

                    <span className="salad-card__heart" aria-hidden="true">
                      <HeartIcon />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SaladShowcase;

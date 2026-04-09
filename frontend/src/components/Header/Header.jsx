import React, { useEffect, useState } from "react";
import "./Header.css";
import { assets, food_list } from "../../assets/frontend_assets/assets";

const heroSlides = [
  {
    image: assets.header_img,
    alt: "Featured plated dish",
    eyebrow: "Chef's pick",
  },
  {
    image:
      food_list.find((item) => item.category === "Salad")?.image ??
      assets.header_img,
    alt: "Fresh salad bowl",
    eyebrow: "Fresh bowls",
  },
  {
    image:
      food_list.find((item) => item.category === "Pasta")?.image ??
      assets.header_img,
    alt: "Comfort pasta plate",
    eyebrow: "Comfort classics",
  },
];

const Header = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToSlide = (slideIndex) => {
    const nextIndex = (slideIndex + heroSlides.length) % heroSlides.length;
    setActiveSlide(nextIndex);
  };

  const scrollToMenu = () => {
    const menuSection =
      document.getElementById("food-display") ??
      document.getElementById("explore-menu");
    menuSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="header">
      <div className="header-slider" aria-hidden="true">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.alt}
            className={`header-slide${
              index === activeSlide ? " is-active" : ""
            }`}
          >
            <img
              src={slide.image}
              alt=""
              loading={index === activeSlide ? "eager" : "lazy"}
            />
            <div className="header-slide-overlay" />
          </div>
        ))}
      </div>

      <div className="header-contents">
        <p className="header-eyebrow">{heroSlides[activeSlide].eyebrow}</p>
        <h2>Order your favourite food here</h2>
        <p>
          Choose from a diverse menu featuring a detectable array of dishes
          crafted with the finest ingredients and culinary expertise. Our
          mission is to satisfy your cravings and elevate your dining
          experience, one delicious meal at a time.
        </p>
        <button type="button" onClick={scrollToMenu}>
          View Menu
        </button>
      </div>

      <div className="header-slider-controls" aria-label="Hero slider controls">
        <button
          type="button"
          className="header-arrow"
          onClick={() => goToSlide(activeSlide - 1)}
          aria-label="Previous slide"
        >
          ‹
        </button>

        <div className="header-dots">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.alt}
              type="button"
              className={`header-dot${
                index === activeSlide ? " is-active" : ""
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-pressed={index === activeSlide}
            />
          ))}
        </div>

        <button
          type="button"
          className="header-arrow"
          onClick={() => goToSlide(activeSlide + 1)}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Header;

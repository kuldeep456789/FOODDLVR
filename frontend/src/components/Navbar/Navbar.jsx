import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [theme, setTheme] = useState(getInitialTheme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logout Successfully");
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const handleMenuSelection = (nextMenu) => {
    setMenu(nextMenu);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar-shell">
      <div className="navbar">
        <Link className="navbar-brand" to="/" onClick={() => handleMenuSelection("home")}>
          <img src={assets.logo} alt="FoodFlow logo" className="logo" />
        </Link>

        <button
          type="button"
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        <ul className={`navbar-menu${mobileMenuOpen ? " is-open" : ""}`}>
          <li>
            <Link
              to="/"
              onClick={() => handleMenuSelection("home")}
              className={menu === "home" ? "active" : ""}
            >
              Home
            </Link>
          </li>
          <li>
            <a
              href="#food-display"
              onClick={() => handleMenuSelection("menu")}
              className={menu === "menu" ? "active" : ""}
            >
              Menu
            </a>
          </li>
          <li>
            <a
              href="#footer"
              onClick={() => handleMenuSelection("contact-us")}
              className={menu === "contact-us" ? "active" : ""}
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="navbar-right">
          <button
            type="button"
            className="navbar-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <span className="navbar-theme-toggle-icon">
              {theme === "light" ? "☾" : "☀"}
            </span>
            <span className="navbar-theme-toggle-label">
              {theme === "light" ? "Dark" : "Light"}
            </span>
          </button>

          <button type="button" className="navbar-search-button" aria-label="Search">
            <img src={assets.search_icon} alt="" />
          </button>

          <div className="navbar-search-icon">
            <Link to="/cart" className="navbar-cart-link" aria-label="Open cart">
              <img src={assets.basket_icon} alt="" />
            </Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>

          {!token ? (
            <button className="navbar-signin-btn" onClick={() => setShowLogin(true)}>
              Sign In
            </button>
          ) : (
            <div className="navbar-profile">
              <img src={assets.profile_icon} alt="Profile" />
              <ul className="nav-profile-dropdown">
                <li onClick={() => navigate("/myorders")}>
                  <img src={assets.bag_icon} alt="" />
                  <p>Orders</p>
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

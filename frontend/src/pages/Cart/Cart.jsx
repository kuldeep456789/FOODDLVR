import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

const Cart = () => {
  const { food_list, cartItems, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);

  const navigate = useNavigate();
  const cartEntries = food_list.filter((item) => cartItems[item._id] > 0);
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee;

  return (
    <div className="cart">
      <header className="cart-header">
        <p className="cart-header__eyebrow">Review your order</p>
        <div className="cart-header__row">
          <h1>Shopping cart</h1>
          <span className="cart-header__count">
            {cartEntries.length} item{cartEntries.length === 1 ? "" : "s"}
          </span>
        </div>
      </header>

      <section className="cart-items" aria-label="Cart items">
        <div className="cart-table-head cart-grid" aria-hidden="true">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        {cartEntries.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is currently empty.</p>
            <button type="button" onClick={() => navigate("/")}>
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="cart-items-body">
            {cartEntries.map((item) => {
              const quantity = cartItems[item._id];
              const lineTotal = item.price * quantity;

              return (
                <div className="cart-table-row cart-grid" key={item._id}>
                  <div className="cart-item-image-wrap">
                    <img src={`${url}/images/${item.image}`} alt={item.name} />
                  </div>

                  <p className="cart-item-title">{item.name}</p>
                  <p className="cart-item-price">{formatCurrency(item.price)}</p>
                  <p className="cart-item-quantity">{quantity}</p>
                  <p className="cart-item-line-total">{formatCurrency(lineTotal)}</p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id)}
                    className="cart-item-remove"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    ×
                  </button>

                  <div className="cart-item-meta">
                    <span>Price {formatCurrency(item.price)}</span>
                    <span>Qty {quantity}</span>
                    <span>Total {formatCurrency(lineTotal)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-card">
            <div className="cart-total-details">
              <p>Subtotals</p>
              <p>{formatCurrency(subtotal)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{formatCurrency(deliveryFee)}</p>
            </div>
            <hr />
            <div className="cart-total-details cart-total-details--grand">
              <b>Total</b>
              <b>{formatCurrency(total)}</b>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/order")}
            disabled={subtotal === 0}
          >
            Proceed to checkout
          </button>
        </div>

        <div className="cart-promocode">
          <div className="cart-promocode-card">
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button type="button">Apply</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;

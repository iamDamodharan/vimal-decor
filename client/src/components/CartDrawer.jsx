import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { formatPrice } from "../lib/store.js";
import ProductArt from "./ProductArt.jsx";

export default function CartDrawer({ cart, onClose, onUpdate }) {
  const [message, setMessage] = useState("");
  const subtotal = cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  return (
    <div className="cart-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="cart-drawer" aria-label="Shopping bag">
        <header>
          <h2>Your bag <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></h2>
          <button className="icon-button" onClick={onClose} aria-label="Close bag"><X /></button>
        </header>
        {!cart.length ? (
          <div className="cart-empty">
            <ShoppingBag size={32} />
            <p>Nothing tucked away just yet.</p>
            <button className="add-large" onClick={onClose}>Keep exploring</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.handle}>
                  <ProductArt art={item.art} title={item.title} />
                  <div>
                    <Link to={item.path} onClick={onClose}>{item.title}</Link>
                    <strong>{formatPrice(item.price)}</strong>
                    <div className="cart-item-controls">
                      <button aria-label="Remove one" onClick={() => onUpdate(item, item.quantity - 1)}><Minus size={12} /></button>
                      <span>{item.quantity}</span>
                      <button aria-label="Add one" onClick={() => onUpdate(item, item.quantity + 1)}><Plus size={12} /></button>
                      <button className="remove-button" onClick={() => onUpdate(item, 0)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
              <p>Shipping is calculated at checkout.</p>
              <button className="add-large" onClick={() => setMessage("Checkout is a demo interaction; no payment is collected.")}>
                Continue to checkout <ArrowRight size={16} />
              </button>
              {message && <small>{message}</small>}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

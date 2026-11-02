import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import ProductArt from "../components/ProductArt.jsx";
import { formatPrice } from "../lib/store.js";

export default function ProductPage({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <main className="page-width inner-page product-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link><span>/</span><Link to="/collections">Shop</Link><span>/</span><span>{product.title}</span>
      </div>
      <div className="product-detail">
        <ProductArt className="product-detail-art" art={product.art} title={product.title} />
        <div className="product-detail-copy">
          <p className="kicker">{product.category} · Studio edition</p>
          <h1>{product.title}</h1>
          <div className="detail-price">
            {formatPrice(product.price)}
            {Number(product.compareAtPrice) > Number(product.price) && <del>{formatPrice(product.compareAtPrice)}</del>}
          </div>
          <p className="shipping-note">A small-batch piece, packed with care.</p>
          <div className="quantity-row">
            <div className="quantity-picker">
              <button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button>
              <span>{quantity}</span>
              <button aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}><Plus size={14} /></button>
            </div>
            <button className="add-large" onClick={() => onAdd(product, quantity)}>Add to bag <ShoppingBag size={17} /></button>
          </div>
          <div className="detail-description"><h2>A little about it</h2><p>{product.description}</p></div>
          <div className="detail-promise"><Heart size={16} /> Made in small batches with thoughtful materials.</div>
        </div>
      </div>
    </main>
  );
}

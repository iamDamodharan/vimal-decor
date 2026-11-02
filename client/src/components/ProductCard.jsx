import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { formatPrice } from "../lib/store.js";
import ProductArt from "./ProductArt.jsx";

export default function ProductCard({ product, onAdd }) {
  const sale = Number(product.compareAtPrice) > Number(product.price);

  return (
    <article className="product-card">
      <Link to={product.path} className="product-art-link">
        {sale && <span className="product-tag">A little less</span>}
        <ProductArt art={product.art} title={product.title} />
      </Link>
      <div className="product-card-copy">
        <span className="product-category">{product.category}</span>
        <Link to={product.path} className="product-name">{product.title}</Link>
        <div className="price-line">
          <span>{formatPrice(product.price)}</span>
          {sale && <del>{formatPrice(product.compareAtPrice)}</del>}
        </div>
        <button className="add-small" onClick={() => onAdd(product)}>
          Add to bag <Plus size={14} />
        </button>
      </div>
    </article>
  );
}

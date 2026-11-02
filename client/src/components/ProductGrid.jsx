import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, onAdd }) {
  return products.length
    ? (
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.handle} product={product} onAdd={onAdd} />
        ))}
      </div>
    )
    : <p className="empty-copy">A few more pieces are on the way. Try another collection.</p>;
}

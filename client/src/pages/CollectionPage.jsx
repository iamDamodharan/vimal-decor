import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid.jsx";

export default function CollectionPage({ collection, products, onAdd }) {
  const [sort, setSort] = useState("featured");
  const sorted = useMemo(() => {
    const items = [...products];
    if (sort === "low") items.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "high") items.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "name") items.sort((a, b) => a.title.localeCompare(b.title));
    return items;
  }, [products, sort]);

  return (
    <main className="page-width inner-page">
      <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>{collection.title}</span></div>
      <header className={`collection-heading tile-${collection.art}`}>
        <span className="collection-symbol">{collection.symbol}</span>
        <p className="kicker">Made with intention</p>
        <h1>{collection.title}</h1>
        <p>{collection.description}</p>
      </header>
      <div className="listing-toolbar">
        <span>{products.length} pieces to explore</span>
        <label>Sort <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="featured">Featured</option>
          <option value="name">Name</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select></label>
      </div>
      <ProductGrid products={sorted} onAdd={onAdd} />
    </main>
  );
}

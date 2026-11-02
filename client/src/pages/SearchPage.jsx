import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import ProductGrid from "../components/ProductGrid.jsx";

export default function SearchPage({ products, onAdd }) {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [value, setValue] = useState(query);
  const results = products.filter((product) => (
    `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(query.toLowerCase())
  ));

  useEffect(() => setValue(query), [query]);

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <main className="page-width inner-page search-page">
      <p className="kicker">A good place to begin</p>
      <h1>Search the studio</h1>
      <form className="results-search" onSubmit={submitSearch}>
        <Search size={18} />
        <input aria-label="Search items" placeholder="Try “table” or “garden”" value={value} onChange={(event) => setValue(event.target.value)} />
        <button type="submit">Search</button>
      </form>
      <p className="result-count">{query ? `${results.length} pieces for “${query}”` : "A few of our favourite things"}</p>
      <ProductGrid products={query ? results : products.slice(0, 4)} onAdd={onAdd} />
    </main>
  );
}

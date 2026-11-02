import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function AllCollectionsPage({ collections }) {
  return (
    <main className="page-width inner-page">
      <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Everything</span></div>
      <p className="kicker">Take your time</p>
      <h1>All collections</h1>
      <div className="all-collection-grid">
        {collections.map((collection) => (
          <Link key={collection.handle} to={collection.path}>
            <span className={`small-tile-art tile-${collection.art}`}>{collection.symbol}</span>
            <span>{collection.title}</span>
            <ArrowUpRight size={16} />
          </Link>
        ))}
      </div>
    </main>
  );
}

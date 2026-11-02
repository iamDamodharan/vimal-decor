import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Heart } from "lucide-react";
import Hero from "../components/Hero.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

export default function HomePage({ store, onAdd }) {
  const byHandle = new Map(store.products.map((item) => [item.handle, item]));

  return (
    <main>
      <Hero slides={store.slides} />
      <section className="values-row"><span>Small-batch making</span><span>Natural materials</span><span>Made to be kept</span></section>
      <section className="home-section page-width">
        <div className="section-title">
          <div><p className="kicker">Take a look around</p><h2>Find your corner</h2></div>
          <Link to="/collections">All collections <ArrowRight size={15} /></Link>
        </div>
        <div className="collection-tiles">
          {store.collections.map((collection) => (
            <Link className={`collection-tile tile-${collection.art}`} key={collection.handle} to={collection.path}>
              <span className="tile-symbol">{collection.symbol}</span>
              <span>{collection.title}</span>
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      </section>
      {store.sections.map((section) => (
        <section className="home-section page-width" key={section.collectionPath}>
          <div className="section-title">
            <div><p className="kicker">Made slowly, meant to stay</p><h2>{section.title}</h2></div>
            <Link to={section.collectionPath}>See the collection <ArrowRight size={15} /></Link>
          </div>
          <ProductGrid products={section.products.map((handle) => byHandle.get(handle)).filter(Boolean).slice(0, 4)} onAdd={onAdd} />
        </section>
      ))}
      <section className="story-panel page-width">
        <div className="story-stamp"><span>Made<br />nearby</span><Heart size={20} /></div>
        <div>
          <p className="kicker">A small note from us</p>
          <h2>Objects with a little more meaning.</h2>
          <p>We bring considered materials, practical forms and the joy of making together. Each piece is an invitation to slow down and make a home your own.</p>
          <Link to="/pages/our-story">Meet the studio <ArrowRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}

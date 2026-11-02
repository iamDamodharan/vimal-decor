import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CartDrawer from "./components/CartDrawer.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import { loadStore } from "./lib/store.js";
import useCart from "./hooks/useCart.js";
import CrawledSite from "./pages/CrawledSite.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import AllCollectionsPage from "./pages/AllCollectionsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import StoryPage from "./pages/StoryPage.jsx";

export default function App() {
  const [store, setStore] = useState(null);
  const [error, setError] = useState("");
  const cart = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadStore().then(setStore).catch((loadError) => setError(loadError.message));
  }, []);

  if (error) return <div className="status-message">Could not load the demo store: {error}</div>;
  if (!store) return <div className="status-message">Setting out the good things…</div>;
  if (!Array.isArray(store.products) || !Array.isArray(store.collections)) {
    return <CrawledSite data={store} />;
  }

  const currentPath = location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, "");
  const product = store.products.find((item) => item.path === currentPath);
  const collection = store.collections.find((item) => item.path === currentPath);
  const productsByHandle = new Map(store.products.map((item) => [item.handle, item]));

  let page;
  if (currentPath === "/") {
    page = <HomePage store={store} onAdd={cart.addItem} />;
  } else if (product) {
    page = <ProductPage key={product.handle} product={product} onAdd={cart.addItem} />;
  } else if (collection) {
    const collectionProducts = collection.products
      .map((handle) => productsByHandle.get(handle))
      .filter(Boolean);
    page = <CollectionPage key={collection.handle} collection={collection} products={collectionProducts} onAdd={cart.addItem} />;
  } else if (currentPath === "/collections") {
    page = <AllCollectionsPage collections={store.collections} />;
  } else if (currentPath === "/search") {
    page = <SearchPage products={store.products} onAdd={cart.addItem} />;
  } else if (currentPath === "/pages/our-story") {
    page = <StoryPage store={store} />;
  } else {
    page = <NotFoundPage onHome={() => navigate("/")} />;
  }

  return (
    <div className="store-shell">
      <Header store={store} cartCount={cart.itemCount} onOpenCart={() => cart.setIsOpen(true)} />
      {page}
      <Footer store={store} />
      {cart.isOpen && (
        <CartDrawer
          cart={cart.items}
          onClose={() => cart.setIsOpen(false)}
          onUpdate={cart.updateItem}
        />
      )}
    </div>
  );
}

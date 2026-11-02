import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, Sparkles, X } from "lucide-react";

export default function Header({ store, cartCount, onOpenCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setSearchOpen(false);
  }

  return (
    <>
      <div className="announcement"><Sparkles size={14} /> {store.announcement}</div>
      <header className="store-header">
        <div className="header-inner">
          <button
            className="icon-button mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <button
            className="icon-button search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            {searchOpen ? <X /> : <Search />}
          </button>
          <Link className="wordmark" to="/" aria-label={`${store.title} home`}>
            <span className="wordmark-mark"><span /><span /><span /></span>
            <span>{store.title}<small>OBJECTS FOR SLOWER DAYS</small></span>
          </Link>
          <button className="bag-button" onClick={onOpenCart} aria-label={`Open bag, ${cartCount} items`}>
            <ShoppingBag size={19} /><span>Bag</span><b>{cartCount}</b>
          </button>
        </div>
        <nav className={menuOpen ? "store-nav nav-open" : "store-nav"} aria-label="Shop">
          {store.navigation.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
          <Link to="/pages/our-story" onClick={() => setMenuOpen(false)}>Our story</Link>
        </nav>
      </header>
      {searchOpen && (
        <form className="search-panel" role="search" onSubmit={submitSearch}>
          <Search size={18} />
          <input
            autoFocus
            aria-label="Search products"
            placeholder="Search the little things..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      )}
    </>
  );
}

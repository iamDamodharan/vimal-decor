import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowUpRight, Menu, X } from "lucide-react";

async function loadSiteData() {
  try {
    const response = await fetch("/api/site");
    if (!response.ok) throw new Error(`API responded with ${response.status}`);
    return await response.json();
  } catch (apiError) {
    const response = await fetch("/sitemap-data.json");
    if (!response.ok) throw apiError;
    return response.json();
  }
}

function Header({ data }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = data.navigation?.length
    ? data.navigation
    : data.pages.slice(0, 5).map((page) => ({ label: page.title, path: page.path }));

  return (
    <header className="site-header">
      <Link className="brand" to="/">{data.title || "Website replica"}</Link>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={menuOpen ? "navigation navigation-open" : "navigation"} aria-label="Main navigation">
        {links.map((link) => (
          <Link key={`${link.path}-${link.label}`} to={link.path} onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function Footer({ data }) {
  return (
    <footer className="site-footer">
      <span>{data.title || "Website replica"}</span>
      <div className="footer-links">
        {data.footerLinks?.map((link) => (
          <Link key={`${link.path}-${link.label}`} to={link.path}>{link.label}</Link>
        ))}
      </div>
      <a href={data.source || "#"} target="_blank" rel="noreferrer">
        Original source <ArrowUpRight size={14} />
      </a>
    </footer>
  );
}

function PageView({ data }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, "");
  const page = data.pages.find((entry) => entry.path === currentPath);

  useEffect(() => {
    if (!page && location.pathname !== "/") navigate("/", { replace: true });
  }, [page, location.pathname, navigate]);

  if (!page && data.pages.length === 0) {
    return (
      <main className="empty-state">
        <p className="eyebrow">Ready to get started</p>
        <h1>No crawled pages yet</h1>
        <p>Run the crawler with a website URL to populate this replica.</p>
      </main>
    );
  }
  if (!page) return null;
  const isHome = page.path === "/";
  const relatedPages = page.links
    .map((link) => data.pages.find((candidate) => candidate.path === link.path))
    .filter((candidate, index, pages) => candidate && pages.indexOf(candidate) === index && candidate.path !== page.path)
    .slice(0, 6);

  return (
    <main>
      <section className={isHome ? "hero" : "page-heading"}>
        <p className="eyebrow">{isHome ? "A closer look" : page.path.replaceAll("/", " / ").trim()}</p>
        <h1>{page.title}</h1>
        {page.description && <p className="lead">{page.description}</p>}
        {isHome && <a className="scroll-link" href="#page-content">Explore the site <ArrowDown size={16} /></a>}
      </section>

      <section id="page-content" className="content-section">
        <div className="content-copy">
          {page.headings?.length > 0 && (
            <div className="heading-list">
              {page.headings.map((heading, index) => <span key={`${heading}-${index}`}>{heading}</span>)}
            </div>
          )}
          <p className="page-content">{page.content || "Run the crawler with an authorized website URL to populate this page."}</p>
        </div>
        {page.assets?.length > 0 && (
          <div className="asset-grid">
            {page.assets.slice(0, 8).map((asset) => (
              <img key={asset} src={asset} alt="" loading="lazy" />
            ))}
          </div>
        )}
      </section>

      {relatedPages.length > 0 && (
        <section className="related-section">
          <p className="eyebrow">Continue exploring</p>
          <div className="card-grid">
            {relatedPages.map((related) => (
              <Link className="page-card" key={related.path} to={related.path}>
                <span>{related.title}</span><ArrowUpRight size={18} />
                <p>{related.description || related.path}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      {!isHome && <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Go back</button>}
    </main>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSiteData().then(setData).catch((loadError) => setError(loadError.message));
  }, []);

  if (error) return <div className="status-message">Could not load site data: {error}</div>;
  if (!data) return <div className="status-message">Loading site…</div>;

  return (
    <div className="app-shell">
      <Header data={data} />
      <Routes>
        <Route path="*" element={<PageView data={data} />} />
      </Routes>
      <Footer data={data} />
    </div>
  );
}

export default App;

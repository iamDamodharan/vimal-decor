import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function CrawledSite({ data }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, "");
  const page = data.pages?.find((entry) => entry.path === path);

  return (
    <div className="crawled-shell">
      <header className="crawled-header">
        <Link to="/">{data.title || "Site map preview"}</Link>
        <nav aria-label="Site navigation">
          {data.navigation?.map((link) => <Link key={`${link.path}-${link.label}`} to={link.path}>{link.label}</Link>)}
        </nav>
      </header>
      {page ? (
        <main className="crawled-content">
          <p className="kicker">{page.path === "/" ? "Home" : page.path}</p>
          <h1>{page.title}</h1>
          {page.description && <p className="crawled-description">{page.description}</p>}
          {page.headings?.length > 0 && (
            <div className="crawled-headings">
              {page.headings.map((heading, index) => <span key={`${heading}-${index}`}>{heading}</span>)}
            </div>
          )}
          <p className="crawled-copy">{page.content || "No text content was extracted for this page."}</p>
          {page.assets?.length > 0 && (
            <div className="crawled-assets">
              {page.assets.slice(0, 8).map((asset) => <img key={asset} src={asset} alt="" loading="lazy" />)}
            </div>
          )}
          <div className="crawled-links">
            {page.links?.slice(0, 12).map((link) => (
              <Link key={`${link.path}-${link.label}`} to={link.path}>{link.label} <ArrowUpRight size={14} /></Link>
            ))}
          </div>
        </main>
      ) : (
        <main className="crawled-content">
          <p className="kicker">Not found</p>
          <h1>This page is not in the crawl.</h1>
          <button className="story-cta" onClick={() => navigate("/")}>Go to the first page <ArrowRight size={15} /></button>
        </main>
      )}
      <footer className="crawled-footer">
        <span>{data.title || "Site map preview"}</span>
        <div>{data.footerLinks?.map((link) => <Link key={`${link.path}-${link.label}`} to={link.path}>{link.label}</Link>)}</div>
      </footer>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Footer({ store }) {
  return (
    <footer className="store-footer">
      <div className="footer-inner page-width">
        <div className="footer-wordmark">
          <Link to="/">{store.title}</Link>
          <p>Thoughtful everyday objects from a little independent studio.</p>
        </div>
        <div>
          <h2>Wander around</h2>
          {store.navigation.slice(0, 4).map((link) => <Link key={link.path} to={link.path}>{link.label}</Link>)}
        </div>
        <div>
          <h2>A hand if you need one</h2>
          {store.footerLinks.map((link) => <Link key={link.path} to={link.path}>{link.label}</Link>)}
        </div>
        <div className="footer-note">
          <Sparkles size={19} />
          <p>Made in small batches.<br />Sent out with a little care.</p>
        </div>
      </div>
      <div className="footer-bottom page-width">© {new Date().getFullYear()} {store.title} · A fictional demo shop</div>
    </footer>
  );
}

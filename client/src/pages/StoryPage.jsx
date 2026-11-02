import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function StoryPage({ store }) {
  return (
    <main className="page-width inner-page story-page">
      <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Our story</span></div>
      <p className="kicker">An independent little studio</p>
      <h1>Make room for things that feel like you.</h1>
      <p>{store.story}</p>
      <Link to="/collections" className="story-cta">Browse the collections <ArrowRight size={15} /></Link>
    </main>
  );
}

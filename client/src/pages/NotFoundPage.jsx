import { ArrowRight } from "lucide-react";

export default function NotFoundPage({ onHome }) {
  return (
    <main className="page-width inner-page not-found">
      <p className="kicker">Not quite the right turn</p>
      <h1>This page is taking a quiet day.</h1>
      <button className="story-cta" onClick={onHome}>Back to the beginning <ArrowRight size={15} /></button>
    </main>
  );
}

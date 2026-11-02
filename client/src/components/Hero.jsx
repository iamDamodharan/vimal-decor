import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero({ slides }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active];
  if (!slide) return null;

  return (
    <section className={`hero hero-${slide.art}`} aria-label="Featured collection">
      <div className="hero-art" aria-hidden="true">
        <span className="hero-orbit" />
        <span className="hero-pot" />
        <span className="hero-leaf leaf-a" />
        <span className="hero-leaf leaf-b" />
      </div>
      <div className="hero-copy">
        <p className="hero-kicker">{slide.eyebrow}</p>
        <h1>{slide.title}</h1>
        <Link className="hero-link" to={slide.href}>{slide.cta} <ArrowRight size={16} /></Link>
      </div>
      <div className="hero-pagination">
        {slides.map((item, index) => (
          <button
            key={item.title}
            className={index === active ? "hero-dot current-dot" : "hero-dot"}
            aria-label={`Show feature ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  );
}

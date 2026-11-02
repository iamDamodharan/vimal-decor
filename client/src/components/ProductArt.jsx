export default function ProductArt({ art, title, className = "" }) {
  return (
    <div className={`product-art art-${art || "vessel"} ${className}`} role="img" aria-label={`Illustration for ${title}`}>
      <span className="art-sun" />
      <span className="art-vessel" />
      <span className="art-stem art-stem-one" />
      <span className="art-stem art-stem-two" />
      <span className="art-label">{title}</span>
    </div>
  );
}

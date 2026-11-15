const collections = [
  { number: "01", name: "Living", detail: "Comfort for every day" },
  { number: "02", name: "Dining", detail: "Gather around the table" },
  { number: "03", name: "Details", detail: "The finishing touches" },
];

function App() {
  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Vimal Decor home">
          VIMAL<span>DECOR</span>
        </a>
        <a className="nav-link" href="#collections">
          Explore collections <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">A little more you, at home</p>
          <h1>
            Make room for
            <br />
            <em>the good things.</em>
          </h1>
          <p className="intro">
            Thoughtful pieces, warm textures, and little details that make a
            space feel like yours.
          </p>
          <a className="button" href="#collections">
            Find your inspiration <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="hero-art" role="img" aria-label="Warm abstract interior shapes">
          <div className="sun" />
          <div className="arch">
            <div className="arch-inner" />
          </div>
          <div className="table" />
          <div className="vase">
            <div className="stem stem-one" />
            <div className="stem stem-two" />
            <div className="stem stem-three" />
          </div>
          <span className="art-caption">A home that feels like you</span>
        </div>
      </section>

      <section className="collections" id="collections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Start with a feeling</p>
            <h2>Explore the little things.</h2>
          </div>
          <p>Find a fresh idea for every corner of your home.</p>
        </div>
        <div className="collection-grid">
          {collections.map((collection) => (
            <article className="collection-card" key={collection.number}>
              <span className="collection-number">{collection.number}</span>
              <div>
                <h3>{collection.name}</h3>
                <p>{collection.detail}</p>
              </div>
              <span className="card-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>
      <footer>Vimal Decor <span>— made for living</span></footer>
    </main>
  );
}

export default App;

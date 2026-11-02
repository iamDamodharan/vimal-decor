# Mitti & Loom demo shop

A fictional artisan-goods storefront built with React, Vite, React Router, Tailwind CSS, Lucide, Express, and a Cheerio crawler. The demo catalog, product descriptions, and abstract product illustrations are original placeholders; no target site's branding, copy, catalog, or imagery is included.

## Requirements

- Node.js 20 or newer and npm
- Network access when crawling a site you own or have permission to map

## Install

From the repository root:

```bash
npm install
```

## Run the demo

Start the Express API and Vite development server:

```bash
npm run dev
```

- Storefront: <http://localhost:5173>
- API data: <http://localhost:3001/api/site>
- API health: <http://localhost:3001/api/health>

The demo has responsive collection and product pages, search, product sorting, a local cart drawer, quantity controls, and fictional sample data in `client/public/sitemap-data.json`. Checkout is intentionally a non-payment demo interaction.

## Crawl an authorized site

Only crawl a site you own or are authorized to map. Crawling replaces the demo JSON file with extracted data, so make a backup first if you want to keep the demo catalog.

```bash
npm run crawl -- --url=https://your-authorized-domain.example
```

Optional crawl limits:

```bash
npm run crawl -- --url=https://your-authorized-domain.example --max-pages=30 --max-depth=3
```

The crawler stays on the target origin and writes paths, titles, descriptions, headings, page text, internal links, assets, and the first page's navigation/footer links into `client/public/sitemap-data.json`. Defaults are 50 pages, depth 4, a 15-second request timeout, and a 200 ms delay between requests. It uses Cheerio on fetched HTML and does not execute JavaScript; JavaScript-rendered sites may need an authorized browser-based crawler.

When the JSON contains the crawler's generic page structure, the frontend switches to a neutral page-and-link preview. The API serves that data at `/api/site`, `/api/pages`, and `/api/pages/:slug`; the client falls back to the JSON file when the API is unavailable.

## Production

```bash
npm start
```

The root `npm start` script builds the client first and then starts Express, so the storefront is available at <http://localhost:3001/>. The API server listens on port `3001` by default. Configure `PORT` and `CLIENT_ORIGIN` as needed. If you start the server workspace directly before building the frontend, it now returns a clear build instruction instead of Express's generic “Cannot GET /” response.

## Project layout

```text
client/       React demo storefront, Vite configuration, and local data
server/       Express API
scripts/      Authorized-site crawler
```

The repository already had Git history; its existing history was not reinitialized.

The client source is grouped by responsibility:

```text
client/src/
  components/  Shared header, footer, product cards, hero, and cart
  hooks/       Reusable cart state
  lib/         Store data loading and formatting helpers
  pages/       Home, collection, product, search, story, and crawl-preview pages
  App.jsx      Store loading and page selection
```

# Website replica starter

A configurable site-mapping and replica starter built with Node.js, Express, React, Vite, React Router, Tailwind CSS, and Lucide.

> The target URL was not included in the project request. The crawler therefore requires a URL at run time; no target website or target-specific content is hard-coded. Only crawl sites you own or are authorized to access, and follow their terms and crawl policies.

## Requirements

- Node.js 20 or newer and npm
- Network access to the authorized target site

## Install

From the repository root:

```bash
npm install
```

## Crawl a site

```bash
npm run crawl -- --url=https://example.com
```

Optional bounds:

```bash
npm run crawl -- --url=https://example.com --max-pages=30 --max-depth=3
```

The crawler stays on the target origin, ignores query strings and fragments when deduplicating pages, and writes its result to `client/public/sitemap-data.json`. Defaults are 50 pages, depth 4, a 15-second request timeout, and a 200 ms delay between fetched pages. The output contains page paths, titles, descriptions, headings, extracted main text, internal links, image/media URLs, plus navigation and footer links from the first crawled page.

The crawler uses Cheerio against fetched HTML, so it does not execute client-side JavaScript. For JavaScript-rendered sites, a browser-based renderer may be needed. Inspect the generated data and confirm you have permission to reuse site text and assets.

## Run locally

Start the Express API and Vite development server together:

```bash
npm run dev
```

- Frontend: <http://localhost:5173>
- API: <http://localhost:3001/api/site>
- Health check: <http://localhost:3001/api/health>

The frontend requests `/api/site` first and falls back to the public `sitemap-data.json` file if the API is unavailable. The server exposes `/api/pages`, `/api/pages/:slug`, and serves the production frontend after a build.

## Production build

```bash
npm run build
npm start
```

The production server listens on port `3001` by default. Configure `PORT` and `CLIENT_ORIGIN` as needed. Build the client before starting the server so `client/dist` exists.

## Layout

```text
client/       React UI, Vite configuration, and generated public site data
server/       Express API
scripts/      Site crawler
```

## Notes

- Routes are rendered from the paths discovered by the crawler. Unknown paths return users to the home page.
- `client/public/sitemap-data.json` starts as an empty example structure and is replaced by each successful crawl.
- This repository was already initialized as a Git repository; the application scaffold does not reinitialize or rewrite its Git history.

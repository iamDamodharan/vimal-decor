import cors from "cors";
import express from "express";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(serverDirectory, "../..");
const dataPath = path.join(projectDirectory, "client/public/sitemap-data.json");
const clientBuildPath = path.join(projectDirectory, "client/dist");
const app = express();
const port = Number(process.env.PORT ?? 3001);

app.disable("x-powered-by");
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));

async function loadSiteData() {
  const contents = await readFile(dataPath, "utf8");
  return JSON.parse(contents);
}

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/site", async (_request, response, next) => {
  try {
    response.json(await loadSiteData());
  } catch (error) {
    next(error);
  }
});

app.get("/api/pages", async (_request, response, next) => {
  try {
    const data = await loadSiteData();
    response.json(data.pages.map(({ slug, path: pagePath, title, description }) => ({
      slug,
      path: pagePath,
      title,
      description
    })));
  } catch (error) {
    next(error);
  }
});

app.get("/api/pages/:slug(*)", async (request, response, next) => {
  try {
    const requestedPath = `/${request.params.slug ?? ""}`.replace(/\/+$/, "") || "/";
    const data = await loadSiteData();
    const page = data.pages.find((entry) => entry.path === requestedPath);

    if (!page) {
      response.status(404).json({ error: "Page not found" });
      return;
    }

    response.json(page);
  } catch (error) {
    next(error);
  }
});

app.use(express.static(clientBuildPath));
app.get("*", async (_request, response, next) => {
  const indexPath = path.join(clientBuildPath, "index.html");
  try {
    await access(indexPath);
    response.sendFile(indexPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      response.status(503).type("text").send(
        "Frontend build not found. Run `npm start` from the project root to build and serve the app, or run `npm run dev` for local development."
      );
      return;
    }
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "Unable to load site data" });
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});

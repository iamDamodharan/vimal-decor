import cors from "cors";
import express from "express";
import { readFile } from "node:fs/promises";
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
app.get("*", (_request, response, next) => {
  response.sendFile(path.join(clientBuildPath, "index.html"), (error) => {
    if (error) next();
  });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "Unable to load site data" });
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});

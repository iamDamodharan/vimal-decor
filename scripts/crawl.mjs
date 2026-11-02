import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(projectDirectory, "client/public/sitemap-data.json");
const userAgent = "WebsiteReplicaCrawler/1.0 (authorized site mapping)";

function readOption(name, fallback) {
  const argument = process.argv.find((value) => value.startsWith(`--${name}=`));
  return argument ? argument.slice(name.length + 3) : fallback;
}

function normalizePageUrl(value, baseUrl) {
  try {
    const url = new URL(value, baseUrl);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    url.hash = "";
    url.search = "";
    if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
    return url;
  } catch {
    return null;
  }
}

function isHtmlPage(url, origin) {
  if (url.origin !== origin) return false;
  return !/\.(?:avif|css|csv|docx?|eot|gif|ico|jpe?g|js|json|map|mp[34]|pdf|png|svg|txt|webm|webp|woff2?|xlsx?)$/i.test(url.pathname);
}

function getLinks($, baseUrl) {
  return $("a[href]")
    .map((_index, element) => {
      const label = $(element).text().replace(/\s+/g, " ").trim();
      const url = normalizePageUrl($(element).attr("href"), baseUrl);
      if (!url) return null;
      return { label: label || url.pathname, url: url.href, path: url.pathname };
    })
    .get()
    .filter(Boolean);
}

function getSectionLinks($, selector, baseUrl, origin) {
  return $(selector).map((_index, element) => {
    const label = $(element).text().replace(/\s+/g, " ").trim();
    const url = normalizePageUrl($(element).attr("href"), baseUrl);
    if (!label || !url || url.origin !== origin) return null;
    return { label, path: url.pathname };
  }).get().filter(Boolean);
}

function getAssets($, baseUrl) {
  const assets = new Set();
  const addAsset = (value) => {
    try {
      const url = new URL(value, baseUrl);
      if (["http:", "https:"].includes(url.protocol)) assets.add(url.href);
    } catch {
      return;
    }
  };
  $("img[src], source[src], video[src], audio[src]").each((_index, element) => {
    const src = $(element).attr("src");
    if (src) addAsset(src);
    const srcset = $(element).attr("srcset");
    if (srcset) {
      for (const candidate of srcset.split(",")) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url) addAsset(url);
      }
    }
  });
  $("video[poster], meta[property='og:image'], meta[name='twitter:image']").each((_index, element) => {
    const url = $(element).attr("poster") ?? $(element).attr("content");
    if (url) addAsset(url);
  });
  return [...assets];
}

function getPageContent($) {
  const mainContent = $("main, [role='main'], article").first();
  const content = mainContent.length ? mainContent.clone() : $("body").clone();
  content.find("script, style, noscript, nav, footer, header, svg").remove();
  return content.text().replace(/\s+/g, " ").trim();
}

async function fetchPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      headers: { "user-agent": userAgent },
      redirect: "follow",
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return null;
    return { html: await response.text(), url: response.url };
  } finally {
    clearTimeout(timeout);
  }
}

const rawUrl = readOption("url", process.env.TARGET_URL);
if (!rawUrl) {
  console.error("Provide a target URL with --url=https://example.com (or set TARGET_URL).");
  process.exitCode = 1;
} else {
  const maxPages = Number(readOption("max-pages", "50"));
  const maxDepth = Number(readOption("max-depth", "4"));
  if (!Number.isInteger(maxPages) || maxPages < 1 || !Number.isInteger(maxDepth) || maxDepth < 0) {
    throw new Error("--max-pages must be positive and --max-depth must be zero or greater.");
  }

  const startUrl = normalizePageUrl(rawUrl, rawUrl);
  if (!startUrl) throw new Error("Target URL must use HTTP or HTTPS.");
  const origin = startUrl.origin;
  const queue = [{ url: startUrl.href, depth: 0 }];
  const queued = new Set([startUrl.href]);
  const pages = [];
  let siteTitle = startUrl.hostname;
  let sharedNavigation = [];
  let sharedFooterLinks = [];

  while (queue.length && pages.length < maxPages) {
    const current = queue.shift();
    let fetched;
    try {
      fetched = await fetchPage(current.url);
    } catch (error) {
      console.warn(`Skipping ${current.url}: ${error.message}`);
      continue;
    }
    if (!fetched) continue;

    const $ = cheerio.load(fetched.html);
    const finalUrl = normalizePageUrl(fetched.url, startUrl.href);
    if (!finalUrl || !isHtmlPage(finalUrl, origin)) continue;
    const pathName = finalUrl.pathname || "/";
    if (pages.some((page) => page.path === pathName)) continue;

    const title = $("title").first().text().trim() || $("h1").first().text().trim() || pathName;
    const description = $("meta[name='description']").attr("content")?.trim() ?? "";
    const links = getLinks($, finalUrl.href);
    const navigation = getSectionLinks($, "nav a[href]", finalUrl.href, origin);
    const footerLinks = getSectionLinks($, "footer a[href]", finalUrl.href, origin);
    const internalLinks = links.filter((link) => new URL(link.url).origin === origin);

    if (!pages.length) {
      siteTitle = title;
      sharedNavigation = navigation;
      sharedFooterLinks = footerLinks;
    }

    pages.push({
      slug: pathName === "/" ? "home" : pathName.slice(1).replaceAll("/", "--"),
      path: pathName,
      url: finalUrl.href,
      title,
      description,
      headings: $("h1, h2, h3").map((_index, element) => $(element).text().replace(/\s+/g, " ").trim()).get().filter(Boolean),
      content: getPageContent($),
      assets: getAssets($, finalUrl.href),
      links: internalLinks
    });

    if (current.depth < maxDepth) {
      for (const link of links) {
        const linkedUrl = new URL(link.url);
        if (isHtmlPage(linkedUrl, origin) && !queued.has(linkedUrl.href)) {
          queued.add(linkedUrl.href);
          queue.push({ url: linkedUrl.href, depth: current.depth + 1 });
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  const result = {
    source: startUrl.origin,
    title: siteTitle,
    generatedAt: new Date().toISOString(),
    pages,
    navigation: sharedNavigation,
    footerLinks: sharedFooterLinks
  };
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`Saved ${pages.length} pages to ${path.relative(projectDirectory, outputPath)}`);
}

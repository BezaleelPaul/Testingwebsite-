import { readdirSync, readFileSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { createHash } from "node:crypto";

const HOST = "bezaleelpaul.github.io";
const BASE = "/Testingwebsite-/";
const [mode, arg1, arg2, arg3] = process.argv.slice(2);
const failures = [];
const warnings = [];
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function tagsOf(html) {
  return [...html.matchAll(/<[a-z][^>]*>/gi)].map((match) => match[0]);
}

function attr(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return tag.match(new RegExp(`\\b${escaped}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1];
}

function refsOf(html) {
  const refs = [];
  for (const tag of tagsOf(html)) {
    const tagName = tag.match(/^<([a-z]+)/i)?.[1]?.toLowerCase();
    const attrs = {
      a: ["href"], link: ["href"], script: ["src"], img: ["src", "srcset"],
      source: ["src", "srcset"], video: ["src", "poster"], audio: ["src"],
      iframe: ["src"], form: ["action"],
    }[tagName] ?? [];
    for (const name of attrs) {
      const value = attr(tag, name);
      if (!value) continue;
      if (name === "srcset") {
        for (const candidate of value.split(",")) {
          const url = candidate.trim().split(/\\s+/)[0];
          if (url) refs.push({ url, kind: "resource" });
        }
      } else {
        refs.push({ url: value.trim(), kind: tagName === "a" || tagName === "form" ? "navigation" : "resource" });
      }
    }
  }
  return refs;
}

function checkPreviewRef(value) {
  if (/^(#|mailto:|tel:|javascript:|data:|blob:)/i.test(value)) return null;
  let url;
  try { url = new URL(value, `https://${HOST}${BASE}`); }
  catch { return `invalid URL: ${value}`; }
  if (url.hostname === HOST && !(url.pathname === BASE.slice(0, -1) || url.pathname.startsWith(BASE))) {
    return `production-host URL escapes preview basePath: ${value}`;
  }
  if (!/^(https?:)$/.test(url.protocol) && !/^(#|mailto:|tel:|javascript:|data:|blob:)/i.test(value)) {
    return `unexpected URL scheme: ${value}`;
  }
  if (value.startsWith("/") && !value.startsWith("//") && !(value === BASE.slice(0, -1) || value.startsWith(BASE))) {
    return `root-relative URL missing basePath: ${value}`;
  }
  return null;
}

function metaValue(html, attributeName, expectedValue) {
  for (const tag of tagsOf(html)) {
    if (!/^<(meta|link)\\b/i.test(tag)) continue;
    if (attr(tag, attributeName)?.toLowerCase() !== expectedValue.toLowerCase()) continue;
    return attr(tag, "content") ?? attr(tag, "href") ?? null;
  }
  return null;
}

function checkExport(dir, siteUrl, environment) {
  const files = walk(dir);
  const textExtensions = new Set([".html", ".json", ".xml", ".txt"]);
  for (const file of files) {
    const extension = extname(file).toLowerCase();
    if (!textExtensions.has(extension)) continue;
    const content = readFileSync(file, "utf8");
    const label = relative(dir, file);
    if (extension === ".html") {
      for (const ref of refsOf(content)) {
        const issue = checkPreviewRef(ref.url);
        if (issue) fail(`${label}: ${issue}`);
      }
    }
    for (const match of content.matchAll(/https:\\/\\/bezaleelpaul\\.github\\.io(?:\\/[^"'\\s<>)]*)?/g)) {
      try {
        const parsed = new URL(match[0]);
        if (!(parsed.pathname === BASE.slice(0, -1) || parsed.pathname.startsWith(BASE))) {
          fail(`${label}: production URL outside preview path: ${match[0]}`);
        }
      } catch { fail(`${label}: malformed production URL: ${match[0]}`); }
    }
  }

  const indexPath = join(dir, "index.html");
  let home;
  try { home = readFileSync(indexPath, "utf8"); }
  catch { fail(`Missing export homepage: ${indexPath}`); return; }

  const canonical = metaValue(home, "rel", "canonical");
  const ogUrl = metaValue(home, "property", "og:url");
  const robots = metaValue(home, "name", "robots") ?? "";
  if (canonical !== siteUrl) fail(`canonical is "${canonical}", expected "${siteUrl}"`);
  if (ogUrl !== siteUrl) fail(`og:url is "${ogUrl}", expected "${siteUrl}"`);
  if (environment === "preview" && !(/noindex/i.test(robots) && /nofollow/i.test(robots))) {
    fail(`preview robots must include noindex,nofollow; got "${robots}"`);
  }
  if (environment === "production" && /noindex/i.test(robots)) {
    fail(`production must not contain noindex; got "${robots}"`);
  }

  for (const route of ["atlas", "observatory", "projects", "resume"]) {
    const candidates = [join(dir, route, "index.html"), join(dir, `${route}.html`)];
    const found = candidates.find((path) => { try { readFileSync(path); return true; } catch { return false; } });
    console.log(`Export route ${route}/: ${found ? "FOUND" : "MISSING"}`);
  }
}

async function checkLive(siteUrl) {
  const site = new URL(siteUrl);
  if (!site.pathname.endsWith("/")) site.pathname += "/";
  const base = site.href;
  async function get(url) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      return { response, body: await response.text() };
    } catch (error) { fail(`Fetch failed for ${url}: ${error.message}`); return null; }
  }

  const homepage = await get(base);
  if (!homepage) return;
  const { response: homeResponse, body: homeBody } = homepage;
  if (homeResponse.status !== 200) fail(`Homepage returned HTTP ${homeResponse.status}`);
  if (!homeResponse.url.startsWith(base)) fail(`Homepage redirected outside preview: ${homeResponse.url}`);
  if (!/selected work/i.test(homeBody) || !/id=["']projects["']/i.test(homeBody)) {
    fail("Homepage is missing Selected Work or the #projects anchor");
  }

  const homeHash = createHash("sha1").update(homeBody).digest("hex");
  const assets = new Set();
  for (const ref of refsOf(homeBody)) {
    if (ref.kind !== "resource" || /^(#|mailto:|tel:|javascript:|data:|blob:)/i.test(ref.url)) continue;
    try {
      const url = new URL(ref.url, base);
      if (url.origin === site.origin) { url.hash = ""; assets.add(url.href); }
    } catch { fail(`Invalid resource reference: ${ref.url}`); }
  }

  const checked = new Set();
  while (true) {
    const pending = [...assets].filter((url) => !checked.has(url));
    if (!pending.length) break;
    for (const url of pending) {
      checked.add(url);
      const result = await get(url);
      if (!result) continue;
      const contentType = result.response.headers.get("content-type") ?? "";
      if (result.response.status !== 200 || /text\\/html/i.test(contentType)) {
        fail(`Asset returned ${result.response.status} (${contentType}): ${url}`);
        continue;
      }
      if (/text\\/css/i.test(contentType) || url.endsWith(".css")) {
        for (const match of result.body.matchAll(/url\\(\\s*["']?([^"')]+)["']?\\s*\\)/gi)) {
          const raw = match[1].trim();
          if (/^(data:|#)/i.test(raw)) continue;
          try {
            const dependency = new URL(raw, url);
            if (dependency.origin === site.origin) { dependency.hash = ""; assets.add(dependency.href); }
          } catch { fail(`Invalid CSS dependency in ${url}: ${raw}`); }
        }
      }
    }
  }
  console.log(`Live assets checked: ${checked.size}`);

  for (const route of ["atlas/", "observatory/", "projects/", "resume/"]) {
    const result = await get(new URL(route, base).href);
    if (!result) continue;
    const { response, body } = result;
    const title = body.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i)?.[1] ?? "";
    const h1 = body.match(/<h1[^>]*>([\\s\\S]*?)<\\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
    const fallback = createHash("sha1").update(body).digest("hex") === homeHash;
    console.log(`${route}: HTTP ${response.status} | title="${title}" | h1="${h1}" | homepageFallback=${fallback}`);
    if (response.status !== 200) warn(`${route} returned HTTP ${response.status}`);
    else if (fallback) fail(`${route} resolves to the homepage fallback`);
    else if (!title || !h1) warn(`${route} returned 200 but title or h1 is missing; inspect manually`);
  }
}

if (mode === "out") {
  const [dir, siteUrl, environment] = [arg1, arg2, arg3];
  if (!dir || !siteUrl || !["preview", "production"].includes(environment)) {
    console.error("Usage: node scripts/verify-preview.mjs out <dir> <siteUrl> <preview|production>");
    process.exit(2);
  }
  checkExport(dir, siteUrl, environment);
} else if (mode === "live") {
  if (!arg1) { console.error("Usage: node scripts/verify-preview.mjs live <siteUrl>"); process.exit(2); }
  await checkLive(arg1);
} else {
  console.error("Usage:\\n  node scripts/verify-preview.mjs out <dir> <siteUrl> <preview|production>\\n  node scripts/verify-preview.mjs live <siteUrl>");
  process.exit(2);
}
for (const warning of warnings) console.warn(`WARNING: ${warning}`);
if (failures.length) { console.error("\\nFAILURES:\\n" + failures.join("\\n")); process.exit(1); }
console.log("\\nVerification completed: no automated failures.");

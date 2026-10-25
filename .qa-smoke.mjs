import { chromium, request } from "playwright-core";
import { createRequire } from "node:module";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const base = "http://localhost:3100";
const outDir = ".qa-screens";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});

const results = { pages: [], consoleErrors: [], failedRequests: [], brokenImages: [], overflow: [], axe: [], links: [] };
const internalLinks = new Set();

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(450);
  await page.evaluate(async () => {
    const step = Math.max(400, window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(450);
}

async function audit(page, label, { axe = false } = {}) {
  const broken = await page.evaluate(() =>
    [...document.images]
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.getAttribute("src") || img.currentSrc || "unknown"),
  );
  if (broken.length) results.brokenImages.push({ label, sources: broken });
  if (axe) {
    await page.addScriptTag({ content: axeSource });
    const report = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } });
    });
    if (report.violations.length) {
      results.axe.push({
        label,
        violations: report.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.slice(0, 6).map((n) => ({ target: n.target, summary: n.failureSummary })),
        })),
      });
    }
  }
}

async function visit(viewport, label, path, { screenshot = false, axe = false } = {}) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  const failed = [];
  page.on("pageerror", (error) => consoleErrors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(`console: ${message.text()}`);
  });
  page.on("requestfailed", (request) => {
    if (!request.url().includes("favicon")) failed.push(`${request.url()} :: ${request.failure()?.errorText}`);
  });
  const response = await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 45000 });
  await settle(page);
  const status = response?.status() ?? 0;
  const title = await page.title();
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));
  if (overflow.scrollWidth > overflow.clientWidth + 1) {
    results.overflow.push({ label: `${label} ${path}`, ...overflow });
  }
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter(Boolean),
  );
  for (const href of hrefs) {
    if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/api/")) {
      internalLinks.add(href.split("#")[0]);
    }
  }
  await audit(page, `${label} ${path}`, { axe });
  if (screenshot) {
    const file = `${outDir}/${label}-${path.replaceAll("/", "_") || "home"}.png`;
    await page.screenshot({ path: file, fullPage: false });
  }
  results.pages.push({ label, path, status, title, consoleErrors, failed });
  if (consoleErrors.length) results.consoleErrors.push({ label, consoleErrors });
  if (failed.length) results.failedRequests.push({ label, failed });
  await context.close();
}

const desktop = { width: 1440, height: 900 };
const tablet = { width: 768, height: 1024 };
const mobile = { width: 390, height: 844 };

const publicPages = [
  ["/", true],
  ["/collections/bedding", true],
  ["/collections/bestsellers", true],
  ["/collections/new-arrivals", true],
  ["/products/kala-wall-art-set", true],
  ["/inspiration", true],
  ["/faq", false],
  ["/contact", false],
  ["/shipping-returns", false],
  ["/care-guide", false],
  ["/privacy", false],
  ["/terms", false],
  ["/search?q=linen", false],
  ["/cart", true],
  ["/wishlist", false],
  ["/login", false],
  ["/register", false],
  ["/forgot-password", false],
  ["/reset-password", false],
  ["/checkout", true],
  ["/this-does-not-exist", false],
];

for (const [path, shot] of publicPages) {
  await visit(desktop, "desktop", path, { screenshot: shot, axe: ["/", "/products/kala-wall-art-set", "/cart", "/login", "/checkout"].includes(path) });
}

for (const path of ["/", "/collections/bedding", "/products/kala-wall-art-set", "/cart", "/inspiration", "/contact"]) {
  await visit(tablet, "tablet", path, { screenshot: ["/", "/collections/bedding", "/products/kala-wall-art-set"].includes(path) });
}

for (const path of ["/", "/collections/bedding", "/products/kala-wall-art-set", "/cart", "/checkout", "/inspiration", "/contact"]) {
  await visit(mobile, "mobile", path, { screenshot: ["/", "/collections/bedding", "/products/kala-wall-art-set", "/cart", "/checkout"].includes(path) });
}

const api = await request.newContext();
for (const href of [...internalLinks].sort()) {
  const response = await api.get(base + href);
  results.links.push({ href, status: response.status() });
}

await api.dispose();
await browser.close();
writeFileSync(".qa-smoke-report.json", JSON.stringify(results, null, 2));

const linkFails = results.links.filter((l) => l.status >= 400);
const pageFails = results.pages.filter((p) => p.status >= 400 && p.path !== "/this-does-not-exist");
console.log(JSON.stringify({
  pagesChecked: results.pages.length,
  pageFails,
  brokenImages: results.brokenImages,
  overflow: results.overflow,
  consoleErrors: results.consoleErrors,
  failedRequests: results.failedRequests,
  axeViolationGroups: results.axe.map((a) => ({ label: a.label, ids: a.violations.map((v) => `${v.id}:${v.impact}:${v.nodes.length}`) })),
  brokenLinks: linkFails,
  linksChecked: results.links.length,
}, null, 2));


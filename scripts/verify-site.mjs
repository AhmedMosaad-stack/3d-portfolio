// Screenshots the running portfolio at several scroll positions to verify it
// renders (hero scene, sections). Run while `next start` serves :3210.

import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", ".verify");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = "http://localhost:3212";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  const failed = [];
  page.on("requestfailed", (r) => failed.push(r.url()));
  page.on("response", (r) => {
    if (r.status() === 404) failed.push("404 " + r.url());
  });

  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(3500); // preloader + hero assemble

  const positions = [0, 0.22, 0.45, 0.68, 0.92];
  const labels = ["hero", "about", "work", "skills", "contact"];
  for (let i = 0; i < positions.length; i++) {
    await page.evaluate((p) => {
      const h = document.body.scrollHeight - window.innerHeight;
      window.scrollTo(0, h * p);
    }, positions[i]);
    await sleep(1600);
    await page.screenshot({ path: join(OUT, `${i}-${labels[i]}.webp`), type: "webp", quality: 85 });
    console.log(`captured ${labels[i]}`);
  }

  const hasWebGL = await page.evaluate(() => {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  });
  console.log("WebGL available in test browser:", hasWebGL);
  console.log("Console errors:", errors.length ? errors.slice(0, 10) : "none");
  console.log("Failed/404 URLs:", failed.length ? [...new Set(failed)].slice(0, 12) : "none");

  await browser.close();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});

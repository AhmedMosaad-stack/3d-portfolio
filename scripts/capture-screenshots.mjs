// Auto-captures the 5 live project sites into /public/screenshots/<id>.webp
// (spec R14, Phase 4). Uses puppeteer-core driving the system Chrome.
// Run: node scripts/capture-screenshots.mjs

import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "screenshots");

const CHROME =
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const SHOTS = [
  { id: "re-travel", url: "https://re-dashboard-nine.vercel.app/dashboard/overview" },
  { id: "al-saad", url: "https://al-saad-constructions.vercel.app/" },
  { id: "exclusive", url: "https://e-commerce-theta-virid-32.vercel.app/" },
  { id: "el-sherouq", url: "https://hospital-demo-ten.vercel.app/" },
  { id: "social-median", url: "https://my-social-app-kyvc.vercel.app/" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars"],
  });

  for (const shot of SHOTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    try {
      console.log(`→ ${shot.id}: ${shot.url}`);
      await page.goto(shot.url, { waitUntil: "networkidle2", timeout: 60000 });
      await sleep(2500); // let fonts/animations settle
      await page.screenshot({
        path: join(OUT, `${shot.id}.webp`),
        type: "webp",
        quality: 82,
      });
      console.log(`  ✓ saved ${shot.id}.webp`);
    } catch (err) {
      console.error(`  ✗ ${shot.id} failed:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

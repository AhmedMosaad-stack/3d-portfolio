// Real Lighthouse runner for both mobile and desktop, using the Chromium that
// Playwright already installed (no separate Chrome needed).
//
//   1. build + serve a production build:  npm run build && npm start
//   2. in another terminal:               npm run lh            (audits :3000)
//                                         npm run lh -- http://localhost:3002
//
// Prints category scores + Core Web Vitals for each form factor and exits non-zero
// if Performance drops below the threshold (tune THRESHOLD per project).

import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "playwright";

const URL = process.argv[2] || process.env.LH_URL || "http://localhost:3000/";
const THRESHOLD = Number(process.env.LH_MIN ?? 0); // e.g. 90 to fail the build

// Reuse Playwright's Chromium so CI/devs don't need a system Chrome.
process.env.CHROME_PATH = process.env.CHROME_PATH || chromium.executablePath();

const FORM_FACTORS = {
  mobile: {}, // lighthouse default preset is mobile
  desktop: {
    formFactor: "desktop",
    screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
  },
};

const pct = (s) => (s == null ? "n/a" : Math.round(s * 100));

async function run(name, settings) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
  try {
    const res = await lighthouse(
      URL,
      { port: chrome.port, output: "json", logLevel: "error" },
      { extends: "lighthouse:default", settings: { onlyCategories: ["performance", "accessibility", "best-practices", "seo"], ...settings } }
    );
    const c = res.lhr.categories;
    const a = res.lhr.audits;
    console.log(`\n=== ${name.toUpperCase()} (${URL}) ===`);
    console.log(`Performance ${pct(c.performance.score)} | Accessibility ${pct(c.accessibility.score)} | Best-Practices ${pct(c["best-practices"].score)} | SEO ${pct(c.seo.score)}`);
    console.log(`FCP ${a["first-contentful-paint"].displayValue} | LCP ${a["largest-contentful-paint"].displayValue} | TBT ${a["total-blocking-time"].displayValue} | CLS ${a["cumulative-layout-shift"].displayValue} | SI ${a["speed-index"].displayValue}`);
    return pct(c.performance.score);
  } finally {
    await chrome.kill();
  }
}

let worst = 100;
for (const [name, settings] of Object.entries(FORM_FACTORS)) {
  worst = Math.min(worst, await run(name, settings));
}
if (THRESHOLD && worst < THRESHOLD) {
  console.error(`\nPerformance ${worst} < threshold ${THRESHOLD}`);
  process.exit(1);
}

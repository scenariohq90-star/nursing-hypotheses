const path = require("node:path");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");

function loadPlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    const customModule = process.env.MOTION_PLAYWRIGHT_MODULE;
    if (customModule) return require(customModule);
    throw new Error(
      "Install Playwright or set MOTION_PLAYWRIGHT_MODULE to its module directory.",
      { cause: error },
    );
  }
}

const { chromium } = loadPlaywright();

const outputRoot = path.join(__dirname, "output");
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].filter(Boolean);
const chromePath = chromeCandidates.find((candidate) => fsSync.existsSync(candidate));
const motionUrl = "http://127.0.0.1:8085/artifacts/motion-graphic/motion.html";
const mode = process.argv[2] ?? "previews";

async function createBrowser() {
  return chromium.launch({
    headless: true,
    ...(chromePath ? { executablePath: chromePath } : {}),
  });
}

async function preparePage(context, url) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.motionReady === true, null, { timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

async function capturePreviews() {
  await fs.mkdir(path.join(outputRoot, "previews"), { recursive: true });
  const browser = await createBrowser();
  try {
    const context = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1, locale: "ar-SA" });
    for (let scene = 0; scene <= 7; scene += 1) {
      const page = await preparePage(context, `${motionUrl}?scene=${scene}`);
      await page.screenshot({ path: path.join(outputRoot, "previews", `scene-${scene}.png`), fullPage: false });
      await page.close();
    }
    await context.close();
  } finally {
    await browser.close();
  }
}

async function recordMotion() {
  const rawVideoRoot = path.join(outputRoot, "raw");
  await fs.mkdir(rawVideoRoot, { recursive: true });
  const browser = await createBrowser();
  let recordedPath = "";
  try {
    const context = await browser.newContext({
      viewport: { width: 1080, height: 1920 },
      deviceScaleFactor: 1,
      locale: "ar-SA",
      recordVideo: { dir: rawVideoRoot, size: { width: 1080, height: 1920 } },
    });
    const page = await preparePage(context, motionUrl);
    const video = page.video();
    await page.evaluate(() => window.startMotion());
    await page.waitForTimeout(50_400);
    await context.close();
    recordedPath = await video.path();
  } finally {
    await browser.close();
  }
  const target = path.join(outputRoot, "motion-raw.webm");
  await fs.copyFile(recordedPath, target);
  process.stdout.write(`${target}\n`);
}

(async () => {
  if (mode === "previews") await capturePreviews();
  else if (mode === "record") await recordMotion();
  else throw new Error(`Unknown mode: ${mode}`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

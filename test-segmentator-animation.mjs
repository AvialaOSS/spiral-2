import puppeteer from "puppeteer";

const URL = process.env.PLAYGROUND_URL ?? "http://localhost:5176/";

async function getThumbInfo(page) {
  return page.evaluate(() => {
    const thumb = document.querySelector(".aviala-segmentator-thumb");
    if (!thumb) return null;
    const cs = getComputedStyle(thumb);
    const matrix = cs.transform;
    let tx = null;
    if (matrix && matrix !== "none") {
      const m = matrix.match(/matrix\(([^)]+)\)/);
      if (m) tx = parseFloat(m[1].split(",")[4]);
    }
    return {
      transform: cs.transform,
      translateX: tx,
      transition: cs.transition,
      transitionProperty: cs.transitionProperty,
      width: cs.width,
      opacity: cs.opacity,
      dataInstant: thumb.getAttribute("data-instant"),
      inlineTransform: thumb.style.transform,
    };
  });
}

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto(URL, { waitUntil: "networkidle0" });
await page.waitForSelector(".aviala-segmentator-thumb");

console.log("Initial:", await getThumbInfo(page));

const buttons = await page.$$(
  ".aviala-segmentator-group:first-of-type .aviala-segmentator-item"
);
console.log("Buttons:", buttons.length);

// Click B and sample transforms every 16ms for 400ms
await buttons[1].click();
const samplesB = [];
for (let i = 0; i < 25; i++) {
  await new Promise((r) => setTimeout(r, 16));
  const info = await getThumbInfo(page);
  samplesB.push({
    ms: (i + 1) * 16,
    translateX: info?.translateX,
    transform: info?.transform,
  });
}
console.log("Click B samples:", JSON.stringify(samplesB, null, 2));

// Click C
await buttons[2].click();
const samplesC = [];
for (let i = 0; i < 25; i++) {
  await new Promise((r) => setTimeout(r, 16));
  const info = await getThumbInfo(page);
  samplesC.push({
    ms: (i + 1) * 16,
    translateX: info?.translateX,
    transform: info?.transform,
  });
}
console.log("Click C samples:", JSON.stringify(samplesC, null, 2));

const uniqueX = new Set(samplesB.map((s) => s.translateX));
console.log("Unique translateX values during B animation:", [...uniqueX]);
console.log("ANIMATING:", uniqueX.size > 2 ? "YES" : "NO (instant jump)");

await browser.close();

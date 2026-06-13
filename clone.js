const fs = require("fs");
const { chromium } = require("playwright");

const url = process.argv[2];
const outputFile = process.argv[3];

if (!url || !outputFile) {
    console.log("Usage: node clone.js <url> <output_file>");
    process.exit(1);
}

(async () => {
    console.log(`Cloning ${url} to ${outputFile}...`);
    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 120000
    });

    // wait extra for JS and animations to settle
    await page.waitForTimeout(5000);

    // save rendered HTML
    const html = await page.content();

    fs.writeFileSync(outputFile, html);

    console.log(`Website ${url} cloned to ${outputFile}!`);

    await browser.close();
})();
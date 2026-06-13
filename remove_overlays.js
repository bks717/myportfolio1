const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const files = ['index.html', 'personal.html', 'contact.html'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;

    const htmlPath = path.join(__dirname, file);
    let html = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(html);

    // Remove the problematic full-screen overlays that cover the content
    $('div.h-screen.w-screen.fixed').remove();

    fs.writeFileSync(htmlPath, $.html());
    console.log(`Removed full-screen transition overlays from ${file}`);
}

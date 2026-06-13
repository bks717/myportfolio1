const fs = require('fs');
const cheerio = require('cheerio');

const htmlPath = 'index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const $ = cheerio.load(html);

// Remove all script tags
$('script').remove();

// Also remove next.js specific divs if they cause issues, but scripts are usually the culprit
// Next.js hydration errors usually happen because of the scripts.

fs.writeFileSync(htmlPath, $.html());
console.log('Removed all scripts to prevent hydration errors.');

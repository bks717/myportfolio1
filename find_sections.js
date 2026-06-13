const fs = require('fs');
const cheerio = require('cheerio');
const t = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(t);
$('h1, h2, h3, h4').each((i, el) => {
    console.log($(el).text());
});

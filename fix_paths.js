const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const LOCAL_DIR = __dirname;

function fixHtmlPaths() {
    const htmlPath = path.join(LOCAL_DIR, 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(html);

    // Helper to fix absolute paths to relative paths
    function fixAttr(attr) {
        return (i, el) => {
            let val = $(el).attr(attr);
            if (val && val.startsWith('/') && !val.startsWith('//')) {
                // Change /foo to ./foo
                $(el).attr(attr, '.' + val);
            }
        };
    }

    $('link').each(fixAttr('href'));
    $('script').each(fixAttr('src'));
    $('img').each(fixAttr('src'));
    $('source').each(fixAttr('srcset'));
    $('a').each(fixAttr('href')); // Might break some actual links, but for a local clone it's okay

    fs.writeFileSync(htmlPath, $.html());
    console.log('Fixed absolute paths to relative paths in index.html');
}

fixHtmlPaths();

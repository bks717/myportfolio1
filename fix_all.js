const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const LOCAL_DIR = __dirname;
const files = ['index.html', 'personal.html', 'contact.html'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    
    console.log(`Processing paths and links in ${file}...`);
    const htmlPath = path.join(LOCAL_DIR, file);
    let html = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(html);

    // Remove scripts to avoid hydration errors
    $('script').remove();

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
    $('img').each(fixAttr('src'));
    $('source').each(fixAttr('srcset'));

    // Fix navigation links
    $('a').each((i, el) => {
        let href = $(el).attr('href');
        if (href) {
            // Replace absolute language links with relative html links
            if (href === '/en' || href === './en' || href === '/' || href === 'https://radnaabazar.com/en' || href === 'https://radnaabazar.com') {
                $(el).attr('href', './index.html');
            } else if (href === '/en/personal' || href === './en/personal' || href === 'https://radnaabazar.com/en/personal') {
                $(el).attr('href', './personal.html');
            } else if (href === '/en/contact' || href === './en/contact' || href === 'https://radnaabazar.com/en/contact') {
                $(el).attr('href', './contact.html');
            }
        }
    });

    fs.writeFileSync(htmlPath, $.html());
    console.log(`Fixed paths and stripped scripts for ${file}`);
}

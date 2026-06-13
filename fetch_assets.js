const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.radnaabazar.com';
const LOCAL_DIR = __dirname;
const htmlFile = process.argv[2] || 'index.html';

async function downloadFile(url, localPath) {
    try {
        if (fs.existsSync(localPath)) return; // skip existing

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        const dir = path.dirname(localPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const writer = fs.createWriteStream(localPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (err) {
        console.error(`Failed to download ${url}: ${err.message}`);
    }
}

async function processHtml() {
    console.log(`Processing ${htmlFile}...`);
    const htmlPath = path.join(LOCAL_DIR, htmlFile);
    let html = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(html);

    const downloads = [];

    // Find links (CSS, icons)
    $('link').each((i, el) => {
        let href = $(el).attr('href');
        if (href && !href.startsWith('http')) {
            const absoluteUrl = BASE_URL + href;
            // Clean up the URL query params for the local filename
            let localHref = href.split('?')[0];
            const localPath = path.join(LOCAL_DIR, localHref);
            
            downloads.push({ url: absoluteUrl, local: localPath });
        }
    });

    // Find images
    $('img').each((i, el) => {
        let src = $(el).attr('src');
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            const absoluteUrl = BASE_URL + src;
            let localSrc = src.split('?')[0];
            const localPath = path.join(LOCAL_DIR, localSrc);

            downloads.push({ url: absoluteUrl, local: localPath });
        }
    });

    // Deduplicate
    const uniqueDownloads = Array.from(new Set(downloads.map(d => JSON.stringify(d)))).map(d => JSON.parse(d));

    console.log(`Found ${uniqueDownloads.length} assets to download for ${htmlFile}.`);

    for (const d of uniqueDownloads) {
        console.log(`Downloading ${d.url} -> ${d.local}`);
        await downloadFile(d.url, d.local);
    }
    
    console.log(`Finished processing ${htmlFile}.`);
}

processHtml().catch(console.error);

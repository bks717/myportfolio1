const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BASE_URL = 'https://www.radnaabazar.com';
const LOCAL_DIR = __dirname;

async function downloadFile(url, localPath) {
    try {
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

async function findAndDownloadFonts() {
    const cssDir = path.join(LOCAL_DIR, '_next', 'static', 'css');
    const files = fs.readdirSync(cssDir);
    
    const downloads = [];

    for (const file of files) {
        if (!file.endsWith('.css')) continue;
        const filePath = path.join(cssDir, file);
        const css = fs.readFileSync(filePath, 'utf8');
        
        // Match url(/...)
        const regex = /url\((['"]?)(\/[^'"()]+)\1\)/g;
        let match;
        while ((match = regex.exec(css)) !== null) {
            let urlPath = match[2];
            // Remove query params if any
            urlPath = urlPath.split('?')[0];
            
            const absoluteUrl = BASE_URL + urlPath;
            const localFilePath = path.join(LOCAL_DIR, urlPath);
            downloads.push({ url: absoluteUrl, local: localFilePath });
        }
    }

    const uniqueDownloads = Array.from(new Set(downloads.map(d => JSON.stringify(d)))).map(d => JSON.parse(d));
    console.log(`Found ${uniqueDownloads.length} CSS dependencies.`);

    for (const d of uniqueDownloads) {
        console.log(`Downloading ${d.url} ...`);
        await downloadFile(d.url, d.local);
    }
    
    console.log('Fonts downloaded.');
}

findAndDownloadFonts().catch(console.error);

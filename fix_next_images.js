const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');

const BASE_URL = 'https://www.radnaabazar.com';
const LOCAL_DIR = __dirname;
const files = ['index.html', 'personal.html', 'contact.html'];
const IMAGES_DIR = path.join(LOCAL_DIR, 'images');

if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR);
}

async function downloadFile(url, localPath) {
    if (fs.existsSync(localPath)) return;
    try {
        console.log(`Downloading ${url} to ${localPath}`);
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000
        });
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

async function processImages() {
    for (const file of files) {
        if (!fs.existsSync(file)) continue;
        console.log(`Processing images in ${file}...`);
        const htmlPath = path.join(LOCAL_DIR, file);
        let html = fs.readFileSync(htmlPath, 'utf8');
        const $ = cheerio.load(html);

        const imgTasks = [];

        $('img').each((i, el) => {
            let src = $(el).attr('src');
            if (src && src.includes('_next/image?url=')) {
                // Parse the URL parameter
                const urlObj = new URL(src, 'http://localhost');
                let decodedUrl = decodeURIComponent(urlObj.searchParams.get('url'));
                
                let fetchUrl = decodedUrl;
                if (decodedUrl.startsWith('/')) {
                    fetchUrl = BASE_URL + decodedUrl;
                }

                // Generate a safe local filename
                let filename = path.basename(decodedUrl.split('?')[0]);
                // If it's a very long or complex url (like cloudinary), hash it
                if (fetchUrl.includes('cloudinary') || filename.length > 50 || !filename.includes('.')) {
                    const ext = fetchUrl.includes('.png') ? '.png' : fetchUrl.includes('.webp') ? '.webp' : '.jpg';
                    const hash = crypto.createHash('md5').update(fetchUrl).digest('hex').substring(0, 8);
                    filename = `img_${hash}${ext}`;
                }

                const localPath = path.join(IMAGES_DIR, filename);
                const localRelativePath = `./images/${filename}`;

                imgTasks.push({ fetchUrl, localPath, localRelativePath, el });
            }
        });

        // unique downloads
        const uniqueDownloads = Array.from(new Set(imgTasks.map(t => JSON.stringify({ fetchUrl: t.fetchUrl, localPath: t.localPath }))))
                                   .map(t => JSON.parse(t));

        for (const task of uniqueDownloads) {
            await downloadFile(task.fetchUrl, task.localPath);
        }

        // update DOM
        for (const task of imgTasks) {
            $(task.el).attr('src', task.localRelativePath);
            $(task.el).removeAttr('srcset'); // Remove srcset to force it to use the downloaded src
        }

        fs.writeFileSync(htmlPath, $.html());
        console.log(`Finished processing images for ${file}`);
    }
}

processImages().catch(console.error);

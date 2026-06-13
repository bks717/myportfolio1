const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const $ = cheerio.load(html);

// Find the SVG element that contains the specific circle
const svgElement = $('circle[cx="253"]').parent('svg');

if (svgElement.length) {
    svgElement.addClass('circle-spin-animation');

    // Remove any inline styles that might interfere with animation
    svgElement.removeAttr('style');

    const styleTag = `
<style>
@keyframes custom-spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.circle-spin-animation {
    animation: custom-spin 20s linear infinite;
    transform-origin: center;
}
</style>
`;
    // Prevent duplicate style tags
    if (!html.includes('circle-spin-animation {')) {
        $('head').append(styleTag);
    }
    fs.writeFileSync(htmlPath, $.html());
    console.log('Animation added to index.html');
} else {
    console.log('SVG not found in index.html');
}

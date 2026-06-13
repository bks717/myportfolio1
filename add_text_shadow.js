const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = 'body[data-theme="white"] .text-accent { color: var(--theme-accent) !important; }';
const newStr = 'body[data-theme="white"] .text-accent { color: var(--theme-accent) !important; text-shadow: 0 0 15px rgba(200,200,210,0.8), 0 0 30px rgba(150,150,160,0.4) !important; }';

if (html.includes(targetStr)) {
    html = html.replace(targetStr, newStr);
    
    // Also let's give the h1 and h2 tags a tiny silver shade when in white mode
    const moreCss = `
    body[data-theme="white"] h1, body[data-theme="white"] h2, body[data-theme="white"] h3 {
        text-shadow: 0 2px 10px rgba(200, 200, 210, 0.3) !important;
    }
    `;
    html = html.replace('</style>', moreCss + '\n</style>');
    
    fs.writeFileSync('index.html', html);
    console.log('Added text shadow to white theme.');
} else {
    console.log('Target string not found.');
}

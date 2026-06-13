const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove old favicons
html = html.replace(/<link rel="icon"[^>]*>/g, '');
html = html.replace(/<link rel="shortcut icon"[^>]*>/g, '');
html = html.replace(/<link rel="apple-touch-icon"[^>]*>/g, '');

// Insert new SVG favicon right after <head>
if (html.includes('<head>')) {
    html = html.replace('<head>', '<head>\n    <link rel="icon" type="image/svg+xml" href="./favicon.svg">');
} else {
    // If <head> somehow missing, prepend it
    html = '<link rel="icon" type="image/svg+xml" href="./favicon.svg">\n' + html;
}

fs.writeFileSync('index.html', html);
console.log('Favicon successfully updated to SVG!');

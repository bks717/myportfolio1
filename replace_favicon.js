const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<link rel="icon" type="image/svg+xml" href="./favicon.svg">', '<link rel="icon" type="image/png" href="./favicon.png">');

fs.writeFileSync('index.html', html);
console.log('Favicon successfully updated to favicon.png!');

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const classes = new Set();
const matches = html.match(/class=\"([^\"]+)\"/g) || [];
for (const match of matches) {
    const clsList = match.substring(7, match.length - 1).split(/\s+/);
    for (const cls of clsList) {
        if (cls.includes('accent') || cls.includes('primary')) {
            classes.add(cls);
        }
    }
}
console.log('Accent/Primary classes found:', Array.from(classes));

const colors = html.match(/#[0-9a-fA-F]{6}/g) || [];
const uniqueColors = new Set(colors);
console.log('Hex colors found:', Array.from(uniqueColors));

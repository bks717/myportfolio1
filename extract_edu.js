const fs = require('fs');
const t = fs.readFileSync('index.html', 'utf8');
const i = t.indexOf('Education');
if (i !== -1) {
    const start = Math.max(0, i - 1000);
    const end = Math.min(t.length, i + 3000);
    console.log(t.substring(start, end));
} else {
    console.log("Could not find Education text.");
}

const fs = require('fs');
const t = fs.readFileSync('index.html', 'utf8');

const title = '<span class="">Education</span>';
const startIndex = t.indexOf(title);

if (startIndex !== -1) {
    // Find the enclosing section or container
    const endTitle = t.indexOf('</h1>', startIndex);
    const startGrid = t.indexOf('<div class="grid', endTitle);
    
    // We want to find the end of this grid. The grid contains multiple boxes.
    // Let's just dump 4000 characters from startGrid.
    console.log(t.substring(startGrid, startGrid + 6000));
} else {
    console.log("Could not find Education section");
}

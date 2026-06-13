const { execSync } = require('child_process');

console.log("Re-cloning index.html...");
execSync('node clone.js https://www.radnaabazar.com/en index.html', { stdio: 'inherit' });

console.log("Re-cloning personal.html...");
execSync('node clone.js https://www.radnaabazar.com/en/personal personal.html', { stdio: 'inherit' });

console.log("Re-cloning contact.html...");
execSync('node clone.js https://www.radnaabazar.com/en/contact contact.html', { stdio: 'inherit' });

console.log("Running fix_all.js...");
execSync('node fix_all.js', { stdio: 'inherit' });

console.log("Running fix_next_images.js...");
execSync('node fix_next_images.js', { stdio: 'inherit' });

console.log("Running fix_animations.js...");
execSync('node fix_animations.js', { stdio: 'inherit' });

console.log("DONE!");

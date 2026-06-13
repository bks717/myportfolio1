const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replace lift
content = content.replaceAll('hover:-translate-y-2', 'hover:-translate-y-4');

// Replace glow intensity
content = content.replaceAll('hover:shadow-[0_0_20px_rgba(0,255,153,0.3)]', 'hover:shadow-[0_0_40px_rgba(0,255,153,0.6)]');
content = content.replaceAll('group-hover/pin:shadow-[0_0_20px_rgba(0,255,153,0.3)]', 'group-hover/pin:shadow-[0_0_40px_rgba(0,255,153,0.6)]');

// Replace transition duration
content = content.replaceAll('transition-all duration-300', 'transition-all duration-150');

// Also for project items we had a duration-700 from their original code which we can speed up to duration-200
content = content.replaceAll('transition duration-700', 'transition duration-200');

fs.writeFileSync('index.html', content);
console.log('Successfully updated glow, lift, and transition speeds.');

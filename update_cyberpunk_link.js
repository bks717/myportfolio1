const fs = require('fs');

const files = ['index.html'];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        
        // Convert the div to an anchor tag linking to cyberpunk.html
        content = content.replace(/<div id="cyberpunk-mode-dock" onclick="setTheme\('cyberpunk'\)">/g, '<a href="./cyberpunk.html" id="cyberpunk-mode-dock">');
        
        // Find the closing div for that specific dock
        // I know it ends with <span class="cyber-text">Cyberpunk Mode</span>\n</div>
        content = content.replace(/<span class="cyber-text">Cyberpunk Mode<\/span>\s*<\/div>/g, '<span class="cyber-text">Cyberpunk Mode</span></a>');

        fs.writeFileSync(f, content, 'utf8');
        console.log(`Updated cyberpunk toggle link in ${f}`);
    }
});

const fs = require('fs');

const files = ['index.html', 'personal.html', 'contact.html'];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        
        // Remove the cyberpunk button from the theme-switcher-dock
        const cyberpunkBtnRegex = /<button onclick="setTheme\('cyberpunk'\)".*?><\/button>\s*/g;
        if (cyberpunkBtnRegex.test(content)) {
            content = content.replace(cyberpunkBtnRegex, '');
            
            // Add the new cyberpunk dock HTML at the end of the body or right before the script tag
            const cyberDockHTML = `
<style>
  #cyberpunk-mode-dock {
    position: fixed !important;
    bottom: 1.5rem !important;
    left: 1.5rem !important;
    z-index: 99999 !important;
    display: flex !important;
    align-items: center !important;
    gap: 0.75rem !important;
    padding: 0.5rem 1rem !important;
    background-color: rgba(20, 20, 30, 0.5) !important;
    backdrop-filter: blur(12px) !important;
    border-radius: 9999px !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 8px 32px 0 rgba(0,0,0,0.3) !important;
    cursor: pointer !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  #cyberpunk-mode-dock:hover {
    background-color: rgba(20, 20, 30, 0.8) !important;
    border-color: rgba(252, 238, 10, 0.5) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 32px 0 rgba(252, 238, 10, 0.2) !important;
  }
  #cyberpunk-mode-dock .cyber-text {
    color: #fcee0a;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-shadow: 0 0 5px rgba(252, 238, 10, 0.5);
  }
</style>
<div id="cyberpunk-mode-dock" onclick="setTheme('cyberpunk')">
    <div class="theme-btn" style="background-color: #fcee0a !important; box-shadow: 0 0 10px rgba(252,238,10,0.5) !important; pointer-events: none; margin: 0 !important;"></div>
    <span class="cyber-text">Cyberpunk Mode</span>
</div>
`;
            
            // Insert right before the closing body tag or after the theme switcher dock
            if (content.includes('</style>\n<div id="theme-switcher-dock">')) {
                // Find where the theme switcher dock ends
                content = content.replace('</div>\n<script>\n    function setTheme(theme)', '</div>\n' + cyberDockHTML + '\n<script>\n    function setTheme(theme)');
            } else if (content.includes('</body>')) {
                 content = content.replace('</body>', cyberDockHTML + '\n</body>');
            }
            
            fs.writeFileSync(f, content, 'utf8');
            console.log(`Updated ${f}`);
        } else {
            console.log(`Cyberpunk button not found in ${f}`);
        }
    }
});

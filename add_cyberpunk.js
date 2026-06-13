const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const cyberpunkCss = `
    /* Cyberpunk Theme Overrides */
    body[data-theme="cyberpunk"] {
        --theme-accent: #fcee0a;
        --theme-accent-rgb: 252, 238, 10;
    }
    body[data-theme="cyberpunk"] .text-accent { color: var(--theme-accent) !important; }
    body[data-theme="cyberpunk"] .bg-accent { background-color: var(--theme-accent) !important; }
    body[data-theme="cyberpunk"] .border-accent { border-color: var(--theme-accent) !important; }
    body[data-theme="cyberpunk"] .shadow-accent { box-shadow: 0 0 10px var(--theme-accent) !important; }
    
    body[data-theme="cyberpunk"] .hover\\:text-accent:hover { color: var(--theme-accent) !important; }
    body[data-theme="cyberpunk"] .hover\\:bg-accent:hover { background-color: var(--theme-accent) !important; }
    body[data-theme="cyberpunk"] .hover\\:border-accent\\/60:hover { border-color: rgba(var(--theme-accent-rgb), 0.6) !important; }
    body[data-theme="cyberpunk"] .hover\\:bg-accent\\/20:hover { background-color: rgba(var(--theme-accent-rgb), 0.2) !important; }

    body[data-theme="cyberpunk"] .hover\\:shadow-\\[0_0_40px_rgba\\(0\\,255\\,153\\,0\\.6\\)\\]:hover { box-shadow: 0 0 40px rgba(var(--theme-accent-rgb), 0.6) !important; }
    body[data-theme="cyberpunk"] .group\\/pin:hover .group-hover\\/pin\\:shadow-\\[0_0_40px_rgba\\(0\\,255\\,153\\,0\\.6\\)\\] { box-shadow: 0 0 40px rgba(var(--theme-accent-rgb), 0.6) !important; }

    body[data-theme="cyberpunk"] svg circle[stroke="#00ff99"] { stroke: var(--theme-accent) !important; }
    body[data-theme="cyberpunk"] .bg-\\[radial-gradient\\(\\#00ff99_40\\%\\,transparent_60\\%\\)\\] {
        background-image: radial-gradient(var(--theme-accent) 40%,transparent 60%) !important;
    }
    
    body[data-theme="cyberpunk"] #nprogress .bar { background: var(--theme-accent) !important; }
    body[data-theme="cyberpunk"] #nprogress .peg { box-shadow: 0 0 10px var(--theme-accent), 0 0 5px var(--theme-accent) !important; }
    body[data-theme="cyberpunk"] #nprogress .spinner-icon { border-top-color: var(--theme-accent) !important; border-left-color: var(--theme-accent) !important; }

    body[data-theme="cyberpunk"] .bg-\\[\\#00ff99\\] { background-color: var(--theme-accent) !important; }
    body[data-theme="cyberpunk"] .shadow-\\[0_0_10px_\\#00ff99\\] { box-shadow: 0 0 10px var(--theme-accent) !important; }
    body[data-theme="cyberpunk"] meta[name="theme-color"] { content: "#fcee0a"; }
    
    body[data-theme="cyberpunk"] h1, body[data-theme="cyberpunk"] h2, body[data-theme="cyberpunk"] h3 {
        text-shadow: 0 2px 10px rgba(252, 238, 10, 0.4) !important;
    }
    body[data-theme="cyberpunk"] .text-accent {
        text-shadow: 0 0 15px rgba(252, 238, 10, 0.8), 0 0 30px rgba(252, 238, 10, 0.4) !important;
    }
</style>
`;

if (!html.includes('data-theme="cyberpunk"')) {
    html = html.replace('</style>', cyberpunkCss);
    
    const dockEnd = '    <button onclick="setTheme(\'white\')"';
    const newBtn = '    <button onclick="setTheme(\'cyberpunk\')" aria-label="Cyberpunk Theme" class="theme-btn" style="background-color: #fcee0a !important; box-shadow: 0 0 10px rgba(252,238,10,0.5) !important;"></button>\n';
    
    html = html.replace(dockEnd, newBtn + dockEnd);
    fs.writeFileSync('index.html', html);
    console.log('Cyberpunk theme CSS and button injected.');
} else {
    console.log('Cyberpunk theme already exists.');
}

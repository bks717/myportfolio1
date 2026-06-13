const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const themeCss = `
<style id="theme-overrides">
    /* Variables */
    body[data-theme="cyan"] {
        --theme-accent: #00e5ff;
        --theme-accent-rgb: 0, 229, 255;
    }
    body[data-theme="pink"] {
        --theme-accent: #ff00e5;
        --theme-accent-rgb: 255, 0, 229;
    }
    
    /* Base Colors Overrides */
    body[data-theme="cyan"] .text-accent, body[data-theme="pink"] .text-accent { color: var(--theme-accent) !important; }
    body[data-theme="cyan"] .bg-accent, body[data-theme="pink"] .bg-accent { background-color: var(--theme-accent) !important; }
    body[data-theme="cyan"] .border-accent, body[data-theme="pink"] .border-accent { border-color: var(--theme-accent) !important; }
    body[data-theme="cyan"] .shadow-accent, body[data-theme="pink"] .shadow-accent { box-shadow: 0 0 10px var(--theme-accent) !important; }
    
    body[data-theme="cyan"] .hover\\:text-accent:hover, body[data-theme="pink"] .hover\\:text-accent:hover { color: var(--theme-accent) !important; }
    body[data-theme="cyan"] .hover\\:bg-accent:hover, body[data-theme="pink"] .hover\\:bg-accent:hover { background-color: var(--theme-accent) !important; }
    body[data-theme="cyan"] .hover\\:border-accent\\/60:hover, body[data-theme="pink"] .hover\\:border-accent\\/60:hover { border-color: rgba(var(--theme-accent-rgb), 0.6) !important; }
    body[data-theme="cyan"] .hover\\:bg-accent\\/20:hover, body[data-theme="pink"] .hover\\:bg-accent\\/20:hover { background-color: rgba(var(--theme-accent-rgb), 0.2) !important; }

    /* Custom Glow Overrides (for hover:-translate-y-4 hover:shadow-[...]) */
    body[data-theme="cyan"] .hover\\:shadow-\\[0_0_40px_rgba\\(0\\,255\\,153\\,0\\.6\\)\\]:hover { box-shadow: 0 0 40px rgba(var(--theme-accent-rgb), 0.6) !important; }
    body[data-theme="pink"] .hover\\:shadow-\\[0_0_40px_rgba\\(0\\,255\\,153\\,0\\.6\\)\\]:hover { box-shadow: 0 0 40px rgba(var(--theme-accent-rgb), 0.6) !important; }
    
    body[data-theme="cyan"] .group\\/pin:hover .group-hover\\/pin\\:shadow-\\[0_0_40px_rgba\\(0\\,255\\,153\\,0\\.6\\)\\] { box-shadow: 0 0 40px rgba(var(--theme-accent-rgb), 0.6) !important; }
    body[data-theme="pink"] .group\\/pin:hover .group-hover\\/pin\\:shadow-\\[0_0_40px_rgba\\(0\\,255\\,153\\,0\\.6\\)\\] { box-shadow: 0 0 40px rgba(var(--theme-accent-rgb), 0.6) !important; }

    /* SVGs & Specific Inline Colors */
    body[data-theme="cyan"] svg circle[stroke="#00ff99"], body[data-theme="pink"] svg circle[stroke="#00ff99"] { stroke: var(--theme-accent) !important; }
    body[data-theme="cyan"] .bg-\\[radial-gradient\\(\\#00ff99_40\\%\\,transparent_60\\%\\)\\], body[data-theme="pink"] .bg-\\[radial-gradient\\(\\#00ff99_40\\%\\,transparent_60\\%\\)\\] {
        background-image: radial-gradient(var(--theme-accent) 40%,transparent 60%) !important;
    }
    
    /* NProgress */
    body[data-theme="cyan"] #nprogress .bar, body[data-theme="pink"] #nprogress .bar { background: var(--theme-accent) !important; }
    body[data-theme="cyan"] #nprogress .peg, body[data-theme="pink"] #nprogress .peg { box-shadow: 0 0 10px var(--theme-accent), 0 0 5px var(--theme-accent) !important; }
    body[data-theme="cyan"] #nprogress .spinner-icon, body[data-theme="pink"] #nprogress .spinner-icon { border-top-color: var(--theme-accent) !important; border-left-color: var(--theme-accent) !important; }

    /* Fix theme meta color */
    body[data-theme="cyan"] meta[name="theme-color"] { content: "#00e5ff"; }
    body[data-theme="pink"] meta[name="theme-color"] { content: "#ff00e5"; }
</style>
`;

const themeHtml = `
<div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/10 shadow-2xl transition-transform hover:scale-105">
    <button onclick="setTheme('default')" aria-label="Green Theme" class="w-8 h-8 rounded-full bg-[#00ff99] border-2 border-transparent focus:border-white transition-all hover:scale-110 shadow-[0_0_10px_#00ff99]"></button>
    <button onclick="setTheme('cyan')" aria-label="Cyan Theme" class="w-8 h-8 rounded-full bg-[#00e5ff] border-2 border-transparent focus:border-white transition-all hover:scale-110 shadow-[0_0_10px_#00e5ff]"></button>
    <button onclick="setTheme('pink')" aria-label="Pink Theme" class="w-8 h-8 rounded-full bg-[#ff00e5] border-2 border-transparent focus:border-white transition-all hover:scale-110 shadow-[0_0_10px_#ff00e5]"></button>
</div>
<script>
    function setTheme(theme) {
        if (theme === 'default') {
            document.body.removeAttribute('data-theme');
            localStorage.removeItem('preferred-theme');
        } else {
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('preferred-theme', theme);
        }
    }
    
    // Load saved theme on startup
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
</script>
`;

let newHtml = html;

if (!newHtml.includes('id="theme-overrides"')) {
    // Insert CSS before </head>
    newHtml = newHtml.replace('</head>', themeCss + '\n</head>');
    
    // Insert HTML+JS before </body>
    newHtml = newHtml.replace('</body>', themeHtml + '\n</body>');
    
    fs.writeFileSync('index.html', newHtml);
    console.log('Themes injected successfully');
} else {
    console.log('Themes already injected');
}

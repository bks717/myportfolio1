const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIndex = html.indexOf('/* Cyberpunk Theme Overrides */');
const endIndex = html.indexOf('</style>', startIndex);

const newCyberpunkCss = `/* Cyberpunk Theme Overrides */
    body[data-theme="cyberpunk"] {
        --theme-accent: #fcee0a; /* Neon Yellow */
        --theme-accent-rgb: 252, 238, 10;
        --cyber-cyan: #00e5ff;
        --cyber-red: #ff003c;
    }
    
    /* Text Accents with Glitch Shadow */
    body[data-theme="cyberpunk"] .text-accent { 
        color: var(--theme-accent) !important; 
        text-shadow: 2px 2px 0px var(--cyber-red), -2px -2px 0px var(--cyber-cyan) !important;
    }
    body[data-theme="cyberpunk"] .hover\\:text-accent:hover { 
        color: var(--theme-accent) !important; 
        text-shadow: 3px 3px 0px var(--cyber-red), -3px -3px 0px var(--cyber-cyan) !important;
    }

    /* Backgrounds and Borders - Blocky */
    body[data-theme="cyberpunk"] .bg-accent { 
        background-color: var(--theme-accent) !important; 
        color: #000 !important;
        border-radius: 0 !important; 
        clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px) !important;
    }
    body[data-theme="cyberpunk"] .border-accent { 
        border-color: var(--theme-accent) !important; 
        border-radius: 0 !important; 
        box-shadow: 2px 2px 0px var(--cyber-red), -2px -2px 0px var(--cyber-cyan) !important;
    }
    
    body[data-theme="cyberpunk"] .hover\\:bg-accent:hover { 
        background-color: var(--cyber-red) !important; 
        color: #fff !important;
        border-color: var(--cyber-cyan) !important;
        border-radius: 0 !important;
        clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px) !important;
    }

    /* Card Hovers - Solid blocky shadows */
    body[data-theme="cyberpunk"] .hover\\:shadow-\\[0_0_40px_rgba\\(0\\,255\\,153\\,0\\.6\\)\\]:hover { 
        box-shadow: 8px 8px 0px var(--cyber-cyan), -8px -8px 0px var(--cyber-red) !important; 
        transform: translate(-4px, -4px) !important;
        border-radius: 0 !important;
        border: 1px solid var(--theme-accent) !important;
    }
    body[data-theme="cyberpunk"] .group\\/pin:hover .group-hover\\/pin\\:shadow-\\[0_0_40px_rgba\\(0\\,255\\,153\\,0\\.6\\)\\] { 
        box-shadow: 8px 8px 0px var(--cyber-cyan), -8px -8px 0px var(--cyber-red) !important; 
        border-radius: 0 !important;
    }

    /* Image Ring */
    body[data-theme="cyberpunk"] svg circle[stroke="#00ff99"] { 
        stroke: var(--cyber-red) !important; 
        stroke-dasharray: 40 10 20 15 50 5 !important; /* Glitchy dash pattern */
        animation-duration: 2s !important; /* Faster spin */
    }
    
    /* Gradients */
    body[data-theme="cyberpunk"] .bg-\\[radial-gradient\\(\\#00ff99_40\\%\\,transparent_60\\%\\)\\] {
        background-image: radial-gradient(var(--cyber-cyan) 20%, var(--cyber-red) 40%, transparent 60%) !important;
    }
    
    /* Progress Bar */
    body[data-theme="cyberpunk"] #nprogress .bar { background: var(--cyber-red) !important; }
    body[data-theme="cyberpunk"] #nprogress .peg { box-shadow: 0 0 10px var(--cyber-red), 0 0 5px var(--cyber-cyan) !important; }
    body[data-theme="cyberpunk"] #nprogress .spinner-icon { border-top-color: var(--theme-accent) !important; border-left-color: var(--cyber-cyan) !important; border-radius: 0 !important; }

    /* Misc */
    body[data-theme="cyberpunk"] .bg-\\[\\#00ff99\\] { background-color: var(--cyber-red) !important; }
    body[data-theme="cyberpunk"] .shadow-\\[0_0_10px_\\#00ff99\\] { box-shadow: 4px 4px 0px var(--cyber-cyan) !important; border-radius: 0 !important; }
    body[data-theme="cyberpunk"] meta[name="theme-color"] { content: "#ff003c"; }
    
    /* Headings - All caps and glitch */
    body[data-theme="cyberpunk"] h1, body[data-theme="cyberpunk"] h2, body[data-theme="cyberpunk"] h3 {
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        text-shadow: 3px 0px 0px var(--cyber-cyan), -3px 0px 0px var(--cyber-red) !important;
    }
    
    /* Turn rounded corners to sharp corners globally on cards when hovered */
    body[data-theme="cyberpunk"] .rounded-2xl:hover {
        border-radius: 0 !important;
    }
`;

if (startIndex !== -1 && endIndex !== -1) {
    html = html.substring(0, startIndex) + newCyberpunkCss + '\n' + html.substring(endIndex);
    fs.writeFileSync('index.html', html);
    console.log('Advanced Cyberpunk theme injected!');
} else {
    console.log('Could not find existing cyberpunk block.');
}

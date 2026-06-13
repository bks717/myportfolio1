const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const whiteCss = `
    /* White Theme Overrides */
    body[data-theme="white"] {
        --theme-accent: #ffffff;
        --theme-accent-rgb: 255, 255, 255;
    }
    body[data-theme="white"] .text-accent { color: var(--theme-accent) !important; }
    body[data-theme="white"] .bg-accent { background-color: var(--theme-accent) !important; }
    body[data-theme="white"] .border-accent { border-color: var(--theme-accent) !important; }
    body[data-theme="white"] .shadow-accent { box-shadow: 0 0 10px var(--theme-accent) !important; }
    
    body[data-theme="white"] .hover\\:text-accent:hover { color: var(--theme-accent) !important; }
    body[data-theme="white"] .hover\\:bg-accent:hover { background-color: var(--theme-accent) !important; }
    body[data-theme="white"] .hover\\:border-accent\\/60:hover { border-color: rgba(var(--theme-accent-rgb), 0.6) !important; }
    body[data-theme="white"] .hover\\:bg-accent\\/20:hover { background-color: rgba(var(--theme-accent-rgb), 0.2) !important; }

    body[data-theme="white"] .hover\\:shadow-\\[0_0_40px_rgba\\(0\\,255\\,153\\,0\\.6\\)\\]:hover { box-shadow: 0 0 40px rgba(var(--theme-accent-rgb), 0.6) !important; }
    body[data-theme="white"] .group\\/pin:hover .group-hover\\/pin\\:shadow-\\[0_0_40px_rgba\\(0\\,255\\,153\\,0\\.6\\)\\] { box-shadow: 0 0 40px rgba(var(--theme-accent-rgb), 0.6) !important; }

    body[data-theme="white"] svg circle[stroke="#00ff99"] { stroke: var(--theme-accent) !important; }
    body[data-theme="white"] .bg-\\[radial-gradient\\(\\#00ff99_40\\%\\,transparent_60\\%\\)\\] {
        background-image: radial-gradient(var(--theme-accent) 40%,transparent 60%) !important;
    }
    
    body[data-theme="white"] #nprogress .bar { background: var(--theme-accent) !important; }
    body[data-theme="white"] #nprogress .peg { box-shadow: 0 0 10px var(--theme-accent), 0 0 5px var(--theme-accent) !important; }
    body[data-theme="white"] #nprogress .spinner-icon { border-top-color: var(--theme-accent) !important; border-left-color: var(--theme-accent) !important; }

    body[data-theme="white"] .bg-\\[\\#00ff99\\] { background-color: var(--theme-accent) !important; }
    body[data-theme="white"] .shadow-\\[0_0_10px_\\#00ff99\\] { box-shadow: 0 0 10px var(--theme-accent) !important; }
    body[data-theme="white"] meta[name="theme-color"] { content: "#ffffff"; }
</style>
`;

if (!html.includes('data-theme="white"')) {
    html = html.replace('</style>', whiteCss);
    fs.writeFileSync('index.html', html);
    console.log('White theme CSS injected.');
} else {
    console.log('White theme CSS already injected.');
}

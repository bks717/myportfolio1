const fs = require('fs');

const pages = [
    { file: 'index.html', active: 'Professional' },
    { file: 'personal.html', active: 'Personal' },
    { file: 'contact.html', active: 'Contact' }
];

pages.forEach(page => {
    if (fs.existsSync(page.file)) {
        let content = fs.readFileSync(page.file, 'utf8');

        // Extract the floating nav and the mobile toggle block to replace it
        const navStartIdx = content.indexOf('<div class="fixed top-4 left-1/2');
        const scriptTagIdx = content.indexOf('<script', navStartIdx);
        const mobileToggleEndIdx = content.indexOf('</div>', content.indexOf('<!-- Mobile Nav Toggle')) + 6;
        
        if (navStartIdx !== -1) {
            // Because the lengths can vary, let's use regex or substring to find the exact block to replace.
            const endOfMobileToggle = content.indexOf('</g>\n        </svg>\n    </button>\n</div>') + 42;
            
            if(endOfMobileToggle > navStartIdx) {
               const oldNavBlock = content.substring(navStartIdx, endOfMobileToggle);
               
               const activeClass = "px-3 md:px-6 py-1.5 md:py-2 rounded-full border border-accent bg-accent/20 text-accent backdrop-blur-2xl shadow-[0_0_15px_rgba(0,255,153,0.4)] transition-all text-xs md:text-sm font-bold capitalize";
               const inactiveClass = "px-3 md:px-6 py-1.5 md:py-2 rounded-full border border-white/5 text-white/80 hover:text-accent hover:border-accent/50 hover:bg-accent/10 backdrop-blur-xl transition-all text-xs md:text-sm font-semibold capitalize shadow-[0_4px_12px_rgba(0,0,0,0.1)]";

               const liquidNav = `
<div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-wrap justify-center items-center gap-2 p-2 rounded-[2rem] backdrop-blur-2xl bg-white/5 border border-white/20 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] w-[95%] sm:w-auto max-w-3xl">
    <nav class="flex flex-wrap justify-center gap-2">
        <a class="${page.active === 'Professional' ? activeClass : inactiveClass}" href="./index.html">Professional</a>
        <a class="${page.active === 'Personal' ? activeClass : inactiveClass}" href="./personal.html">Personal</a>
        <a class="${page.active === 'Contact' ? activeClass : inactiveClass}" href="./contact.html">Contact</a>
    </nav>
    <div class="hidden sm:block w-px h-6 bg-white/20 mx-1"></div>
    <button class="inline-flex items-center justify-center rounded-full bg-accent/90 text-primary hover:bg-white backdrop-blur-xl transition-all h-8 md:h-9 px-4 text-xs md:text-sm font-bold capitalize shadow-[0_0_10px_rgba(0,255,153,0.3)]">
        English
    </button>
</div>
               `.trim();

               content = content.replace(oldNavBlock, liquidNav);
            }
        }
        
        // Update Cyberpunk Dock for liquid translucency
        content = content.replace(
            /background-color: rgba\(20, 20, 30, 0\.5\) !important;/g,
            'background-color: rgba(255, 255, 255, 0.05) !important;'
        );
        content = content.replace(
            /backdrop-filter: blur\(12px\) !important;/g,
            'backdrop-filter: blur(24px) !important;'
        );
        content = content.replace(
            /border: 1px solid rgba\(255, 255, 255, 0\.1\) !important;/g,
            'border: 1px solid rgba(255, 255, 255, 0.25) !important;'
        );

        fs.writeFileSync(page.file, content, 'utf8');
        console.log(`Updated liquid nav for ${page.file}`);
    }
});

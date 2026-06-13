const fs = require('fs');

const pages = [
    { file: 'index.html', active: 'Professional' },
    { file: 'personal.html', active: 'Personal' },
    { file: 'contact.html', active: 'Contact' }
];

pages.forEach(page => {
    if (fs.existsSync(page.file)) {
        let content = fs.readFileSync(page.file, 'utf8');

        // Find our existing top nav block
        const navStartIdx = content.indexOf('<div class="fixed top-6 left-1/2');
        if (navStartIdx !== -1) {
            const endOfNav = content.indexOf('</button>\n</div>', navStartIdx) + 16;
            
            if (endOfNav > navStartIdx) {
               const oldNavBlock = content.substring(navStartIdx, endOfNav);
               
               const activeBoxStyle = "background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%); box-shadow: rgba(255, 255, 255, 0.2) 0px 1px 2px 0px inset, rgba(0, 0, 0, 0.1) 0px 1px 1px 0px; opacity: 1;";
               const containerStyle = "background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.05) 100%); box-shadow: rgba(0, 0, 0, 0.4) 0px 8px 32px 0px, rgba(255, 255, 255, 0.15) 0px 1px 1px 0px inset, rgba(255, 255, 255, 0.1) 0px 1px 0px 0px;";
               
               const inactiveClass = "relative px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center min-w-[80px] sm:min-w-[100px] text-white/80 hover:text-white hover:scale-105 active:scale-95";
               const activeClass = "relative px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center min-w-[80px] sm:min-w-[100px] text-accent hover:scale-105 active:scale-95";

               const buildLink = (name, link) => {
                   if (page.active === name) {
                       return `<a class="${activeClass}" href="${link}">
        <span class="relative z-10">${name}</span>
        <div class="absolute inset-0 rounded-2xl" style="${activeBoxStyle}"></div>
    </a>`;
                   } else {
                       return `<a class="${inactiveClass}" href="${link}">
        <span class="relative z-10">${name}</span>
    </a>`;
                   }
               };

               const newNav = `
<div class="fixed top-6 left-0 right-0 z-[5000] flex justify-center items-center pointer-events-none" style="opacity: 1; transform: none;">
    <div class="flex items-center justify-center gap-1.5 px-2 py-2 rounded-[2rem] pointer-events-auto backdrop-blur-2xl backdrop-saturate-200 border border-white/30 dark:border-white/20 transition-all duration-300 sm:gap-2 sm:px-4 sm:py-3 w-max" style="${containerStyle}">
        ${buildLink('Professional', './index.html')}
        ${buildLink('Personal', './personal.html')}
        ${buildLink('Contact', './contact.html')}
        
        <div class="w-px h-6 bg-white/20 mx-1 hidden sm:block"></div>
        <button class="relative px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center min-w-[80px] sm:min-w-[100px] text-white/90 hover:text-black hover:bg-white hover:scale-105 active:scale-95">
            <span class="relative z-10">English</span>
        </button>
    </div>
</div>
               `.trim();

               content = content.replace(oldNavBlock, newNav);
            }
        }
        
        // Let's remove the bottom nav from personal.html if we are now providing the top one
        if (page.file === 'personal.html') {
            const bottomNavIdx = content.indexOf('<div class="fixed bottom-6');
            if (bottomNavIdx !== -1) {
                // Find the end of this block
                const endDivs = content.indexOf('</div></div></div><!--$--><!--/$-->', bottomNavIdx);
                if (endDivs !== -1) {
                     // Not completely sure of the structure here, better approach is Regex or let it be
                     // But we can just hide it by injecting hidden class
                     content = content.replace('<div class="fixed bottom-6 left-0 right-0 z-[5000]', '<div class="hidden fixed bottom-6 left-0 right-0 z-[5000]');
                }
            }
        }

        fs.writeFileSync(page.file, content, 'utf8');
        console.log(`Updated premium liquid nav for ${page.file}`);
    }
});

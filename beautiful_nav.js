const fs = require('fs');

const pages = [
    { file: 'index.html', active: 'Professional' },
    { file: 'personal.html', active: 'Personal' },
    { file: 'contact.html', active: 'Contact' }
];

pages.forEach(page => {
    if (fs.existsSync(page.file)) {
        let content = fs.readFileSync(page.file, 'utf8');

        // We find the nav wrapper block to replace it
        const navStartIdx = content.indexOf('<div class="fixed top-4 left-1/2');
        
        if (navStartIdx !== -1) {
            // Find the end of this nav block
            const endOfNav = content.indexOf('</button>\n</div>', navStartIdx) + 16;
            
            if (endOfNav > navStartIdx) {
               const oldNavBlock = content.substring(navStartIdx, endOfNav);
               
               const activeClass = "px-4 sm:px-6 py-2 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-3xl shadow-lg transition-all text-sm font-medium tracking-wide";
               const inactiveClass = "px-4 sm:px-6 py-2 rounded-full border border-transparent text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium tracking-wide";

               // Replace the inner styling of the active class with accent if they wanted accent.
               // Earlier they said: "take color schema from the other nav box below which has only professionala nd personnel" 
               // Wait, the "Peer through my personal life" button has border-accent bg-transparent text-accent. Let's make the active pill use that.
               const activeAccentClass = "px-4 sm:px-6 py-2 rounded-full border border-accent/60 bg-accent/10 text-accent backdrop-blur-3xl shadow-[0_0_15px_rgba(0,255,153,0.15)] transition-all text-sm font-medium tracking-wide";
               const inactiveAccentClass = "px-4 sm:px-6 py-2 rounded-full border border-transparent text-white/70 hover:text-accent hover:bg-white/5 transition-all text-sm font-medium tracking-wide";

               const liquidNav = `
<div class="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex justify-center items-center gap-1 sm:gap-2 p-1.5 rounded-full backdrop-blur-3xl bg-black/30 border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] w-[95%] sm:w-max overflow-x-auto" style="scrollbar-width: none;">
    <nav class="flex items-center gap-1 sm:gap-2">
        <a class="${page.active === 'Professional' ? activeAccentClass : inactiveAccentClass}" href="./index.html">Professional</a>
        <a class="${page.active === 'Personal' ? activeAccentClass : inactiveAccentClass}" href="./personal.html">Personal</a>
        <a class="${page.active === 'Contact' ? activeAccentClass : inactiveAccentClass}" href="./contact.html">Contact</a>
    </nav>
    <div class="w-px h-6 bg-white/20 mx-1 hidden sm:block"></div>
    <button class="hidden sm:inline-flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-black border border-white/20 backdrop-blur-xl transition-all h-9 px-5 text-sm font-semibold tracking-wide">
        English
    </button>
</div>
               `.trim();

               content = content.replace(oldNavBlock, liquidNav);
            }
        }
        
        fs.writeFileSync(page.file, content, 'utf8');
        console.log(`Updated liquid nav for ${page.file}`);
    }
});

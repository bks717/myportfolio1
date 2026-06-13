const fs = require('fs');

const pages = [
    { file: 'index.html', active: 'Professional' },
    { file: 'personal.html', active: 'Personal' },
    { file: 'contact.html', active: 'Contact' }
];

pages.forEach(page => {
    if (fs.existsSync(page.file)) {
        let content = fs.readFileSync(page.file, 'utf8');

        // Extract the existing header and the hamburger menu/nav
        const headerStartIdx = content.indexOf('<header class="fixed top-4');
        const headerEndIdx = content.indexOf('</header>') + 9;
        
        if (headerStartIdx !== -1 && headerEndIdx !== -1) {
            const oldHeader = content.substring(headerStartIdx, headerEndIdx);
            
            // Rebuild the new static header for Krupakara
            const staticHeader = `
<header class="py-8 xl:py-12 text-white">
    <div class="container mx-auto px-4 md:px-0">
        <a href="./index.html" class="inline-block">
            <h1 class="text-4xl font-semibold ">Krupakara <span class="text-accent">.</span></h1>
        </a>
    </div>
</header>
            `.trim();

            // Rebuild the floating nav
            // Define styles for active and inactive based on user request (border border-accent bg-transparent text-accent hover:bg-accent hover:text-primary)
            const activeClass = "px-6 py-2 rounded-full border border-accent bg-transparent text-accent hover:bg-accent hover:text-primary transition-all text-sm font-semibold capitalize";
            const inactiveClass = "px-6 py-2 rounded-full border border-transparent text-white/80 hover:text-accent hover:border-accent/50 hover:bg-white/5 transition-all text-sm font-semibold capitalize";

            const floatingNav = `
<div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] hidden md:flex items-center gap-2 p-2 rounded-full backdrop-blur-xl bg-black/20 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
    <nav class="flex gap-2">
        <a class="${page.active === 'Professional' ? activeClass : inactiveClass}" href="./index.html">Professional</a>
        <a class="${page.active === 'Personal' ? activeClass : inactiveClass}" href="./personal.html">Personal</a>
        <a class="${page.active === 'Contact' ? activeClass : inactiveClass}" href="./contact.html">Contact</a>
    </nav>
    <div class="w-px h-6 bg-white/20 mx-2"></div>
    <button class="inline-flex items-center justify-center rounded-full bg-accent text-primary hover:bg-white transition-colors h-9 px-5 text-sm font-bold capitalize">
        English
    </button>
</div>

<!-- Mobile Nav Toggle (Fixed at top right) -->
<div class="md:hidden fixed top-6 right-6 z-[100]">
    <button type="button" aria-haspopup="dialog" aria-expanded="false" data-state="closed" class="flex justify-center items-center w-12 h-12 rounded-full backdrop-blur-xl bg-black/20 border border-white/10 text-accent">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-[24px]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <g id="Menu_Fries">
                <path d="M20.437,19.937c0.276,0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5l-16.874,0.002c-0.276,-0 -0.5,-0.224 -0.5,-0.5c-0,-0.276 0.224,-0.5 0.5,-0.5l16.874,-0.002Z"></path>
                <path d="M20.437,11.5c0.276,-0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5l-10,0.001c-0.276,-0 -0.5,-0.224 -0.5,-0.5c-0,-0.276 0.224,-0.5 0.5,-0.5l10,-0.001Z"></path>
                <path d="M20.437,3.062c0.276,-0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5l-16.874,0.001c-0.276,-0 -0.5,-0.224 -0.5,-0.5c-0,-0.276 0.224,-0.5 0.5,-0.5l16.874,-0.001Z"></path>
            </g>
        </svg>
    </button>
</div>
            `.trim();

            content = content.replace(oldHeader, staticHeader + '\n' + floatingNav);

            // Also remove the padding we added earlier since we put the static header back
            if (page.file === 'index.html') {
                content = content.replace('pt-32 xl:pt-40', 'xl:pt-8');
            } else if (page.file === 'personal.html') {
                content = content.replace('pt-32 xl:pt-40', '');
            } else if (page.file === 'contact.html') {
                content = content.replace('mt-32 xl:mt-40', '');
            }

            fs.writeFileSync(page.file, content, 'utf8');
            console.log(`Updated ${page.file}`);
        } else {
            console.log(`Could not find header in ${page.file}`);
        }
    }
});

const fs = require('fs');

const updateFile = (file, replacements) => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let originalContent = content;
        
        // Update header translucency
        content = content.replace(
            /backdrop-blur-md bg-black\/40 border border-white\/10/g,
            'backdrop-blur-xl bg-black/10 border border-white/20'
        );
        content = content.replace(
            /hover:bg-black\/50/g,
            'hover:bg-black/20'
        );
        
        // Apply specific spacing fixes
        for (const [search, replace] of replacements) {
            content = content.replace(search, replace);
        }
        
        if (content !== originalContent) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated ${file}`);
        } else {
            console.log(`No changes made to ${file}`);
        }
    }
};

updateFile('index.html', [
    ['<div class="flex flex-col xl:flex-row items-center justify-between xl:pt-8 xl:pb-24">', '<div class="flex flex-col xl:flex-row items-center justify-between pt-32 xl:pt-40 xl:pb-24">']
]);

updateFile('personal.html', [
    ['<div class="h-[30dvh] place-content-center personal-section-enter">', '<div class="h-[30dvh] place-content-center personal-section-enter pt-32 xl:pt-40">']
]);

updateFile('contact.html', [
    ['<div class="max-w-3xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-primary">', '<div class="max-w-3xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-primary mt-32 xl:mt-40">']
]);

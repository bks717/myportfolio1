const fs = require('fs');

const files = ['index.html', 'personal.html', 'contact.html'];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        
        // Remove English Button block from the nav
        // We can match the exact text for English and the separator line before it.
        const englishRegex = /<div class="w-px h-6 bg-white\/20 mx-1 hidden sm:block"><\/div>\s*<button class="relative px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center min-w-\[80px\] sm:min-w-\[100px\] text-white\/90 hover:text-black hover:bg-white hover:scale-105 active:scale-95">\s*<span class="relative z-10">English<\/span>\s*<\/button>/g;
        content = content.replace(englishRegex, '');

        // Remove Facebook link. The Facebook link has the path M504 256C504 119 393 8...
        // Let's remove any <a> tag that contains this path.
        const facebookLinkRegex = /<a[^>]*href="#"[^>]*>.*?M504 256C504 119 393 8 256 8.*?<\/a>/gs;
        content = content.replace(facebookLinkRegex, '');
        
        // Let's do a fallback replace just in case the href was something else, but it was # since I replaced it earlier.
        
        fs.writeFileSync(f, content, 'utf8');
        console.log(`Cleaned up English and Facebook from ${f}`);
    }
});

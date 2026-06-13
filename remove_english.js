const fs = require('fs');

const files = ['index.html', 'personal.html', 'contact.html'];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        
        // Remove the separator
        content = content.replace(/<div class="w-px h-6 bg-white\/20 mx-1 hidden sm:block"><\/div>\s*/g, '');
        
        // Remove the button containing English
        const englishBtnRegex = /<button[^>]*>\s*<span class="relative z-10">English<\/span>\s*<\/button>\s*/g;
        content = content.replace(englishBtnRegex, '');

        fs.writeFileSync(f, content, 'utf8');
        console.log(`Cleaned up English button from ${f}`);
    }
});

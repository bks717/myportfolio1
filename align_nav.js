const fs = require('fs');

const files = ['index.html', 'personal.html', 'contact.html'];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        
        content = content.replace(/<div class="fixed top-0 mt-1 sm:mt-2 /g, '<div class="fixed top-8 xl:top-12 ');

        fs.writeFileSync(f, content, 'utf8');
        console.log(`Updated position for ${f}`);
    }
});

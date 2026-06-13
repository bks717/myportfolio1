const fs = require('fs');

const files = ['index.html', 'personal.html', 'contact.html'];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        
        // Change from top-2 to top-0 and add pt-2 to the inner wrapper if needed, 
        // but let's just make it completely flush to the top or just 1 or 2 px off.
        content = content.replace(/<div class="fixed top-2 /g, '<div class="fixed top-0 mt-1 sm:mt-2 ');

        fs.writeFileSync(f, content, 'utf8');
        console.log(`Updated position to top-0 for ${f}`);
    }
});

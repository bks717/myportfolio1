const fs = require('fs');
const files = ['index.html', 'personal.html', 'contact.html'];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Find the header tag
        // It currently looks something like: <header class="py-8 xl:py-12 text-white "> or <header class="py-8 xl:py-12 text-white">
        // We will replace its class.
        
        content = content.replace(/<header class="py-8 xl:py-12 text-white\s*">/, 
            `<header class="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[100] text-white backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl px-6 py-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-black/50">`);
        
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`${file} not found`);
    }
});

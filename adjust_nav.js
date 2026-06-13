const fs = require('fs');

const files = ['index.html', 'personal.html', 'contact.html'];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        
        // Target the outer container that holds the nav bar and adjust position from top-6 to top-2 or top-4
        // The current outer container looks like: <div class="fixed top-6 left-0 right-0 z-[5000]...
        content = content.replace(/<div class="fixed top-6 /g, '<div class="fixed top-2 ');

        // Target the inner container with rounded-[2rem] and change to rounded-full
        // <div class="flex items-center justify-center gap-1.5 px-2 py-2 rounded-[2rem] pointer-events-auto...
        content = content.replace(/rounded-\[2rem\] pointer-events-auto/g, 'rounded-full pointer-events-auto');
        
        // Optional: also ensure inner buttons are perfectly curvy (they are currently rounded-2xl)
        // class="relative px-4 py-2 rounded-2xl...
        content = content.replace(/rounded-2xl text-xs/g, 'rounded-full text-xs');
        // The background glow box inside active link: <div class="absolute inset-0 rounded-2xl" ...
        content = content.replace(/absolute inset-0 rounded-2xl/g, 'absolute inset-0 rounded-full');

        fs.writeFileSync(f, content, 'utf8');
        console.log(`Updated curves and position for ${f}`);
    }
});

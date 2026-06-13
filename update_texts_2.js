const fs = require('fs');

function updateFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // index.html h1 replacement
    // find <h1 class="h1 mb-6"> and the closing </h1>
    const h1Start = content.indexOf('<h1 class="h1 mb-6">');
    if (h1Start !== -1) {
        const h1End = content.indexOf('</h1>', h1Start);
        if (h1End !== -1) {
            const replacement = `<h1 class="h1 mb-6">Hello Im <br> <span title="Me" class="text-accent relative inline-block group cursor-pointer overflow-hidden"><span class="relative z-10 inline-block transition-colors duration-500 group-hover:text-primary">Bhavani<br>Krupakara S</span><span class="absolute inset-0 bg-accent z-0 transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100" style="transform-origin: left center;"></span></span></h1>`;
            content = content.substring(0, h1Start) + replacement + content.substring(h1End + 5);
        }
    }

    // personal.html h1 replacement
    const h1PersonalStart = content.indexOf('<h1 class="text-4xl  md:text-4xl lg:text-7xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800   :via-white to-white">');
    if (h1PersonalStart !== -1) {
        const h1PersonalEnd = content.indexOf('</h1>', h1PersonalStart);
        if (h1PersonalEnd !== -1) {
            const h1Tag = '<h1 class="text-4xl  md:text-4xl lg:text-7xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800   :via-white to-white">';
            content = content.substring(0, h1PersonalStart) + h1Tag + 'Hello Im <br> Bhavani Krupakara S</h1>' + content.substring(h1PersonalEnd + 5);
        }
    }

    // Global text replacements for Radnaabazar -> Krupakara and Bulgan
    content = content.replace(/Radnaabazar Bulgan/g, 'Bhavani Krupakara S');
    content = content.replace(/Radnaabazar/g, 'Krupakara');
    content = content.replace(/radnaabazar/g, 'krupakara');
    content = content.replace(/Bulgan/g, ''); // Remove stray Bulgan

    // also replace "Ara" with "Bhavani" where appropriate?
    // User only said: "evrywhere it says jsut Radnabazaar chaneg it to Krupakra"
    
    fs.writeFileSync(file, content);
}

['index.html', 'personal.html', 'contact.html'].forEach(updateFile);
console.log("Updated files.");

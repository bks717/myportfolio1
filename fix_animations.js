const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const files = ['index.html', 'personal.html', 'contact.html'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;

    const htmlPath = path.join(__dirname, file);
    let html = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(html);

    // Inject a global fade-in-up animation
    const globalStyle = `
<style>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.stagger-animate {
    animation: fadeInUp 0.8s ease-out forwards;
}
</style>
`;
    if (!html.includes('fadeInUp')) {
        $('head').append(globalStyle);
    }

    // Instead of just setting opacity:1, let's give them the stagger-animate class so they animate in
    $('[style*="opacity: 0"], .opacity-0').each((i, el) => {
        // Remove the inline opacity: 0 and transform
        let style = $(el).attr('style') || '';
        style = style.replace(/opacity:\s*0;?/g, '');
        style = style.replace(/transform:\s*[^;]+;?/g, '');
        $(el).attr('style', style);
        
        $(el).removeClass('opacity-0');
        
        // Add the animation class
        $(el).addClass('stagger-animate');
    });

    // Make sure the circle spins on index.html
    if (file === 'index.html') {
        const svgElement = $('circle[cx="253"]').parent('svg');
        if (svgElement.length) {
            svgElement.addClass('circle-spin-animation');
            svgElement.removeAttr('style');

            const styleTag = `
<style>
@keyframes custom-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.circle-spin-animation {
    animation: custom-spin 20s linear infinite;
    transform-origin: center;
}
</style>`;
            if (!html.includes('circle-spin-animation {')) {
                $('head').append(styleTag);
            }
        }
    }

    fs.writeFileSync(htmlPath, $.html());
    console.log(`Fixed hidden elements and added fade-in animations to ${file}`);
}

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Role Text: Revert the massive scale and make it an aesthetic kicker
html = html.replace(
    '<span class="text-xl" style="font-size: clamp(1.5rem, 3vw, 2.5rem); margin-bottom: 1rem; display: block;">Software Engineer</span>',
    '<span class="text-xl" style="font-size: 1rem; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.5); font-weight: 600; margin-bottom: 1rem; display: block;">Software Engineer</span>'
);

// 2. Name: Revert the H1 scaling, but inject custom HTML to make "Hello Im" smaller and the name massive.
// The original was: <h1 class="h1 mb-6" style="...">Hello Im <br> <span title="Me" class="text-accent relative inline-block group cursor-pointer overflow-hidden"><span class="relative z-10 inline-block transition-colors duration-500 group-hover:text-primary">Bhavani<br>Krupakara</span><span class="absolute inset-0 bg-accent z-0 transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100" style="transform-origin: left center;"></span></span></h1>
html = html.replace(
    '<h1 class="h1 mb-6" style="font-size: clamp(4rem, 8vw, 7rem); line-height: 1.1;">Hello Im <br> <span title="Me" class="text-accent relative inline-block group cursor-pointer overflow-hidden"><span class="relative z-10 inline-block transition-colors duration-500 group-hover:text-primary">Bhavani<br>Krupakara</span>',
    '<h1 class="h1 mb-6" style="line-height: 0.95; display: flex; flex-direction: column; gap: 0.5rem;"><span style="font-size: 2rem; font-weight: 400; color: rgba(255,255,255,0.8);">Hello I\'m</span> <span title="Me" class="text-accent relative inline-block group cursor-pointer overflow-hidden" style="font-size: clamp(5rem, 9vw, 8rem); font-weight: 800; letter-spacing: -0.03em; margin-top: -0.5rem; text-shadow: 0 10px 30px rgba(0,0,0,0.5);"><span class="relative z-10 inline-block transition-colors duration-500 group-hover:text-primary">Bhavani<br>Krupakara</span>'
);

// 3. Description: Revert massive scaling to something sleek.
html = html.replace(
    '<div class="max-w-[500px] mb-9 text-white/80" style="font-size: clamp(1.2rem, 2vw, 1.5rem); max-width: 800px; line-height: 1.6;">',
    '<div class="max-w-[500px] mb-9 text-white/80" style="font-size: 1.1rem; max-width: 500px; line-height: 1.8; color: rgba(255,255,255,0.7); font-weight: 300;">'
);

// 4. CV button: Revert scale
html = html.replace(
    'class="group h-[56px] px-8 border border-accent rounded-full flex items-center justify-center gap-2 text-accent text-sm font-semibold uppercase tracking-[2px] hover:bg-accent hover:text-primary transition-all duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-0 relative z-10" style="transform: scale(1.2); transform-origin: left center;"',
    'class="group h-[56px] px-8 border border-accent rounded-full flex items-center justify-center gap-2 text-accent text-sm font-semibold uppercase tracking-[2px] hover:bg-accent hover:text-primary transition-all duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-0 relative z-10"'
);

// 5. Social icons: Revert scale
html = html.replace(
    '<div class="flex gap-6" style="transform: scale(1.3); transform-origin: left center; margin-left: 2rem;">',
    '<div class="flex gap-6">'
);

// 6. Avatar Container: Move to the right and resize beautifully
html = html.replace(
    '<div class=" w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute" style="width: clamp(350px, 40vw, 650px) !important; height: clamp(350px, 40vw, 650px) !important; margin-left: auto; margin-right: auto; right: 0;"',
    '<div class=" w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute" style="width: clamp(350px, 35vw, 550px) !important; height: clamp(350px, 35vw, 550px) !important; transform: translateX(8%);"'
);

// 7. Avatar SVG ring: Align with container
html = html.replace(
    '<svg\n                                                        class="w-[300px] xl:w-[506px] h-[300px] xl:h-[506px] circle-spin-animation" style="width: clamp(360px, 41vw, 670px) !important; height: clamp(360px, 41vw, 670px) !important; right: -10px;"',
    '<svg\n                                                        class="w-[300px] xl:w-[506px] h-[300px] xl:h-[506px] circle-spin-animation" style="width: clamp(360px, 36vw, 560px) !important; height: clamp(360px, 36vw, 560px) !important; transform: translateX(8%);"'
);

// 8. Stats sizing: Revert
html = html.replace(
    /<span class="text-4xl xl:text-6xl font-extrabold" style="font-size: clamp\(3rem, 5vw, 5rem\);">/g,
    '<span class="text-4xl xl:text-6xl font-extrabold">'
);
html = html.replace(
    /<p class="max-w-\[100px\] leading-snug text-white\/80" style="font-size: 1.25rem; max-width: 150px;">/g,
    '<p class="max-w-[100px] leading-snug text-white/80">'
);
html = html.replace(
    /<p class="max-w-\[150px\] leading-snug text-white\/80" style="font-size: 1.25rem; max-width: 200px;">/g,
    '<p class="max-w-[150px] leading-snug text-white/80">'
);

fs.writeFileSync('index.html', html);
console.log('Hero section refined aesthetically!');

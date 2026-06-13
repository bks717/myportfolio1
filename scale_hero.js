const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Role Text: <span class="text-xl">Software Engineer</span> -> add style
html = html.replace('<span class="text-xl">Software Engineer</span>', '<span class="text-xl" style="font-size: clamp(1.5rem, 3vw, 2.5rem); margin-bottom: 1rem; display: block;">Software Engineer</span>');

// 2. Name: <h1 class="h1 mb-6"> -> add style
html = html.replace('<h1 class="h1 mb-6">', '<h1 class="h1 mb-6" style="font-size: clamp(4rem, 8vw, 7rem); line-height: 1.1;">');

// 3. Description: <div class="max-w-[500px] mb-9 text-white/80"> -> add style
html = html.replace('<div class="max-w-[500px] mb-9 text-white/80">', '<div class="max-w-[500px] mb-9 text-white/80" style="font-size: clamp(1.2rem, 2vw, 1.5rem); max-width: 800px; line-height: 1.6;">');

// 4. CV button
html = html.replace('class="group h-[56px] px-8 border border-accent rounded-full flex items-center justify-center gap-2 text-accent text-sm font-semibold uppercase tracking-[2px] hover:bg-accent hover:text-primary transition-all duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-0 relative z-10"', 'class="group h-[56px] px-8 border border-accent rounded-full flex items-center justify-center gap-2 text-accent text-sm font-semibold uppercase tracking-[2px] hover:bg-accent hover:text-primary transition-all duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-0 relative z-10" style="transform: scale(1.2); transform-origin: left center;"');

// 5. Social icons container
html = html.replace('<div class="mb-8 xl:mb-0">\n                                                    <div class="flex gap-6">', '<div class="mb-8 xl:mb-0">\n                                                    <div class="flex gap-6" style="transform: scale(1.3); transform-origin: left center; margin-left: 2rem;">');
// If formatting is slightly different, let's just do a regex replace
html = html.replace(/<div class="mb-8 xl:mb-0">\s*<div class="flex gap-6">/, '<div class="mb-8 xl:mb-0">\n                                                    <div class="flex gap-6" style="transform: scale(1.3); transform-origin: left center; margin-left: 2rem;">');

// 6. Avatar Container
html = html.replace('<div class=" w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute"', '<div class=" w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute" style="width: clamp(350px, 40vw, 650px) !important; height: clamp(350px, 40vw, 650px) !important; margin-left: auto; margin-right: auto; right: 0;"');

// 7. Avatar SVG ring
html = html.replace(/<svg\s*class="w-\[300px\] xl:w-\[506px\] h-\[300px\] xl:h-\[506px\] circle-spin-animation"/, '<svg\n                                                        class="w-[300px] xl:w-[506px] h-[300px] xl:h-[506px] circle-spin-animation" style="width: clamp(360px, 41vw, 670px) !important; height: clamp(360px, 41vw, 670px) !important; right: -10px;"');

// 8. Stats sizing
html = html.replace(/<span class="text-4xl xl:text-6xl font-extrabold">/g, '<span class="text-4xl xl:text-6xl font-extrabold" style="font-size: clamp(3rem, 5vw, 5rem);">');
html = html.replace(/<p class="max-w-\[100px\] leading-snug text-white\/80\">/g, '<p class="max-w-[100px] leading-snug text-white/80" style="font-size: 1.25rem; max-width: 150px;">');
html = html.replace(/<p class="max-w-\[150px\] leading-snug text-white\/80\">/g, '<p class="max-w-[150px] leading-snug text-white/80" style="font-size: 1.25rem; max-width: 200px;">');


fs.writeFileSync('index.html', html);
console.log('Hero section scaled up successfully!');

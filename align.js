const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Make "Hello I'm" a bit bigger
html = html.replace(
    '<span style="font-size: 2rem; font-weight: 400; color: rgba(255,255,255,0.8);">Hello I\'m</span>',
    '<span style="font-size: 2.75rem; font-weight: 500; color: rgba(255,255,255,0.9);">Hello I\'m</span>'
);

// 2. Fix the Image and Ring alignment.
// Revert the container to original classes but use a simple transform to scale them together perfectly
html = html.replace(
    '<div class=" w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute" style="width: clamp(350px, 35vw, 550px) !important; height: clamp(350px, 35vw, 550px) !important; transform: translateX(8%);"',
    '<div class=" w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute" style="transform: translateX(10%) scale(1.15);"'
);

html = html.replace(
    '<svg\n                                                        class="w-[300px] xl:w-[506px] h-[300px] xl:h-[506px] circle-spin-animation" style="width: clamp(360px, 36vw, 560px) !important; height: clamp(360px, 36vw, 560px) !important; transform: translateX(8%);"',
    '<svg\n                                                        class="w-[300px] xl:w-[506px] h-[300px] xl:h-[506px] circle-spin-animation" style="transform: translateX(10%) scale(1.15);"'
);

fs.writeFileSync('index.html', html);
console.log('Fixed alignment and made Hello Im bigger');

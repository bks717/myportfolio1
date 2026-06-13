const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix container
html = html.replace('<div class=" w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute" style="transform: translateX(10%) scale(1.15);"\n                                                    style="opacity: 1;">', '<div class=" w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute" style="transform: translateX(50px) scale(1.15); opacity: 1;">');

// Fix SVG
html = html.replace('<svg\n                                                        class="w-[300px] xl:w-[506px] h-[300px] xl:h-[506px] circle-spin-animation" style="transform: translateX(10%) scale(1.15);"', '<svg\n                                                        class="w-[300px] xl:w-[506px] h-[300px] xl:h-[506px] circle-spin-animation" style="transform: translateX(50px) scale(1.15);"');

fs.writeFileSync('index.html', html);
console.log('Fixed alignment by using absolute pixels');

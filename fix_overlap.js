const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetBlock = `<div class="order-1 xl:order-none mb-8 xl:mb-0">
                                        <div class="w-full h-full relative">
                                            <div style="opacity: 1; transform: translateX(50px) scale(1.15); transform-origin: center;">
                                                <div class=" w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute" style="opacity: 1;">`;

const replacementBlock = `<div class="order-1 xl:order-none mb-8 xl:mb-0">
                                        <div class="w-full h-full relative">
                                            <div style="opacity: 1; transform: translateX(50px) scale(1.15); transform-origin: center; position: relative; display: flex; align-items: center; justify-content: center; width: max-content; height: max-content;">
                                                <div class=" w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute" style="opacity: 1; top: 50%; left: 50%; transform: translate(-50%, -50%); margin: 0;">`;

html = html.replace(targetBlock, replacementBlock);

fs.writeFileSync('index.html', html);
console.log('Fixed overlapping alignment issue by properly centering the absolute element');

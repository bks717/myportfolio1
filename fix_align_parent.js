const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Target the parent `<div style="opacity: 1;">` inside `<div class="w-full h-full relative">`
// Since there might be multiple `<div style="opacity: 1;">`, I'll match the exact context block.

const targetBlock = `<div class="order-1 xl:order-none mb-8 xl:mb-0">
                                        <div class="w-full h-full relative">
                                            <div style="opacity: 1;">
                                                <div class=" w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute" style="transform: translateX(50px) scale(1.15); opacity: 1;">`;

const replacementBlock = `<div class="order-1 xl:order-none mb-8 xl:mb-0">
                                        <div class="w-full h-full relative">
                                            <div style="opacity: 1; transform: translateX(50px) scale(1.15); transform-origin: center;">
                                                <div class=" w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute" style="opacity: 1;">`;

html = html.replace(targetBlock, replacementBlock);

// 2. Remove the transform from the SVG
html = html.replace('<svg\n                                                        class="w-[300px] xl:w-[506px] h-[300px] xl:h-[506px] circle-spin-animation" style="transform: translateX(50px) scale(1.15);"', '<svg\n                                                        class="w-[300px] xl:w-[506px] h-[300px] xl:h-[506px] circle-spin-animation" style=""');

fs.writeFileSync('index.html', html);
console.log('Fixed alignment by moving transform to parent wrapper');

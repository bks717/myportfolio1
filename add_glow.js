const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Experience boxes
content = content.replaceAll(
    'class="bg-transparent relative text-xl p-[1px] overflow-hidden md:col-span-2 md:row-span-1"', 
    'class="bg-transparent relative text-xl p-[1px] overflow-hidden md:col-span-2 md:row-span-1 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(0,255,153,0.3)] transition-all duration-300 rounded-[1.68rem]"'
);

// Project boxes wrappers
content = content.replaceAll(
    'class="relative group/pin z-50 cursor-pointer"', 
    'class="relative group/pin z-50 cursor-pointer hover:-translate-y-2 transition-all duration-300"'
);

// Project card insides
content = content.replaceAll(
    'class="absolute left-1/2 p-4 top-1/2  flex justify-start items-start  rounded-2xl  shadow-[0_8px_16px_rgb(0_0_0/0.4)] border border-white/[0.1] group-hover/pin:border-white/[0.2] transition duration-700 overflow-hidden"',
    'class="absolute left-1/2 p-4 top-1/2  flex justify-start items-start  rounded-2xl  shadow-[0_8px_16px_rgb(0_0_0/0.4)] border border-white/[0.1] group-hover/pin:border-white/[0.2] group-hover/pin:shadow-[0_0_20px_rgba(0,255,153,0.3)] transition duration-700 overflow-hidden"'
);

fs.writeFileSync('index.html', content);
console.log('Successfully added glow and lift effects to experience and project boxes.');

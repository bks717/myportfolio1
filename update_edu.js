const fs = require('fs');

let t = fs.readFileSync('index.html', 'utf8');
const searchStr = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10">';
const startIndex = t.indexOf(searchStr);

if (startIndex === -1) {
    console.log("Could not find grid");
    process.exit(1);
}

let openDivs = 0;
let i = startIndex;

while (i < t.length) {
    if (t.substring(i, i + 4) === '<div') {
        openDivs++;
        i += 4;
    } else if (t.substring(i, i + 6) === '</div>') {
        openDivs--;
        i += 6;
        if (openDivs === 0) {
            break;
        }
    } else {
        i++;
    }
}

const endIndex = i;

const svgIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" class="size-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9l0 28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5l0-24.6c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"></path></svg>`;

const createBox = (title, fullName, dateStr, score, loc) => `
                            <div class="relative group block p-2 h-full w-full">
                                <div class="rounded-2xl h-full w-full p-6 overflow-hidden bg-[rgb(22,22,29)] border border-white/[0.2] group-hover:border-accent/60 relative z-20 flex flex-col">
                                    <div class="relative z-50 flex flex-col h-full">
                                        <div class="flex flex-col flex-grow h-full">
                                            <div class="min-h-[5rem]">
                                                <h4 class="text-zinc-100 font-bold tracking-wide text-lg">${title}</h4>
                                                ${fullName ? '<div class="text-white/50 text-xs mt-1">' + fullName + '</div>' : ''}
                                            </div>
                                            
                                            <div class="text-white/80 text-sm mt-2">${dateStr}</div>
                                            
                                            <div class="flex-grow my-4"></div>
                                            
                                            <div class="flex flex-col gap-3">
                                                <div class="flex items-center gap-3 justify-end text-accent font-medium">
                                                    ${svgIcon} ${score}
                                                </div>
                                                <p class="text-zinc-400 tracking-wide text-sm text-right">${loc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

const newContent = searchStr + "\n" +
    createBox("The South School", "", "Graduated 2021", "92%", "JP Nagar, Bangalore") + "\n" +
    createBox("VCPUC", "Viajaya Composite PU College", "Graduated 2023", "93.3%", "Jaynagar, Bangalore") + "\n" +
    createBox("RVITM", "RV Institute of Technology and Management", "Currently 4th year", "CGPA 8.88", "JP Nagar, Bangalore") + "\n" +
    "                        </div>";

t = t.substring(0, startIndex) + newContent + t.substring(endIndex);

fs.writeFileSync('index.html', t);
console.log("Updated Education section layout with separated full name and perfect alignment.");

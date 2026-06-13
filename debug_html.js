const fs=require('fs');
const t=fs.readFileSync('index.html','utf8');
const i=t.indexOf('<h1 class="h1 mb-6">');
console.log(t.substring(i, i+1500));

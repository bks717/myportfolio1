const fs = require('fs');

const files = ['index.html', 'personal.html', 'contact.html'];
files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    // find elements that have text "Professional" or "Personal" inside the body but not in the main header
    const bodyContent = content.split('</header>')[1];
    if (bodyContent) {
        let regex = /.{0,50}(Professional|Personal).{0,50}/gi;
        let match;
        console.log(`--- Matches in ${f} ---`);
        let count = 0;
        while ((match = regex.exec(bodyContent)) !== null && count < 5) {
            console.log(match[0].trim());
            count++;
        }
    }
});

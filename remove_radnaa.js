const fs = require('fs');

const files = ['index.html', 'personal.html', 'contact.html'];

// Mapping of strings to replace
const replacements = [
    // Meta tags & descriptions
    { search: /Fintech &amp; Cloud \| Mongolia/g, replace: 'Fintech &amp; Cloud | India' },
    { search: /Mongolia Developer/g, replace: 'India Developer' },
    { search: /Mongolia<\/div>/g, replace: 'India</div>' },
    
    // Social Links
    { search: /https:\/\/www\.facebook\.com\/radnaa\.xd/g, replace: '#' },
    { search: /https:\/\/www\.instagram\.com\/radnaa\.xd\//g, replace: 'https://www.instagram.com/krupakarabhavani/' },
    { search: /https:\/\/www\.youtube\.com\/@Redona_/g, replace: 'https://www.youtube.com/@krupaintros3719' },
    { search: /https:\/\/www\.linkedin\.com\/in\/radnaa2015/g, replace: 'https://www.linkedin.com/in/bhavanikrupa/' },
    { search: /https:\/\/github\.com\/RedonaNova/g, replace: 'https://github.com/bks717' },
    
    // Email
    { search: /radnaa2015@gmail\.com/g, replace: 'bhavanikrupakara@gmail.com' },

    // Work / Education Content
    { search: /Fibostack/gi, replace: 'Cloud Platform' },
    { search: /Mongolian Stock Exchange/gi, replace: 'National Stock Exchange' },
    { search: /Mongolian National University/gi, replace: 'National University' },
    { search: /FIBO Cloud scholarship/gi, replace: 'National Scholarship' },
    { search: /FIBO Cloud/gi, replace: 'Tech Cloud' },
    { search: /BDSEC Securities Company/gi, replace: 'Global Securities Company' },
    { search: /Dev@FiboCloud, BDSec Student@BSc,NUM/g, replace: 'Software Developer, BSc Student' },
    { search: /Mongolia, Darkhan/g, replace: 'Bengaluru, India' },
    { search: /English, Mongolian and Japanese/g, replace: 'English, Kannada, and Japanese' },
    
    // Other small traces
    { search: /radnaa/gi, replace: 'bhavani' }, // Catch any remaining radnaa references
    { search: /redona/gi, replace: 'bhavani' }
];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        
        replacements.forEach(r => {
            content = content.replace(r.search, r.replace);
        });
        
        fs.writeFileSync(f, content, 'utf8');
        console.log(`Cleaned up ${f}`);
    }
});

const fs = require('fs');

const files = ['index.html', 'personal.html', 'contact.html'];
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // On main page (index.html), change "Hello I'm <br> <span ...> Radnaabazar </span>"
    // The previous script might have already replaced Radnaabazar Bulgan with Bhavani Krupakara S, let's just make sure.
    // Instead of regex, let's do more robust replacement.
    
    // Replace exact "Hello I'm <br> <span title=\"Me\"" or similar structure
    content = content.replace(/Hello I'm\s*<br>\s*<span[^>]*>\s*Bhavani Krupakara S\s*<\/span>/g, "Hello Im Bhavani Krupakara S");
    content = content.replace(/Hello I'm\s*<br>\s*<span[^>]*>\s*Krupakara\s*<\/span>/g, "Hello Im Bhavani Krupakara S");
    content = content.replace(/Hello I'm\s*<br>\s*<span[^>]*>\s*Radnaabazar\s*<\/span>/g, "Hello Im Bhavani Krupakara S");
    content = content.replace(/Hello I'm/g, "Hello Im");
    
    // In index.html, it currently is probably:
    // <h1 class="h1 mb-6">Hello I'm <br> <span title="Me" class="text-accent"> Krupakara </span> Bulgan </h1>
    // Actually earlier I replaced "Radnaabazar Bulgan" with "Bhavani Krupakara S".
    content = content.replace(/Hello Im\s*<br>\s*<span[^>]*>\s*Bhavani Krupakara S\s*<\/span>\s*Bulgan/g, "Hello Im Bhavani Krupakara S");
    content = content.replace(/Hello Im\s*<br>\s*<span[^>]*>\s*Krupakara\s*<\/span>\s*Bulgan/g, "Hello Im Bhavani Krupakara S");

    // In personal.html:
    // Hello again?<!-- --> <br> <!-- -->My nickname is<!-- --> ... Ara ...
    // Since it's a huge block of SVG for the underline on 'Ara', we can just replace everything from "Hello again?" up to "Ara</span>" + closing divs.
    // Let's just do a greedy replace between "Hello again?" and "</h1>" because it's the whole h1 tag content.
    content = content.replace(/Hello again\?[\s\S]*?<\/h1>/, "Hello Im Bhavani Krupakara S</h1>");

    // Replace all instances of Radnaabazar (or Krupakara) with Krupakara everywhere else
    content = content.replace(/Radnaabazar/g, 'Krupakara');
    content = content.replace(/radnaabazar/gi, 'Krupakara');

    fs.writeFileSync(file, content);
});

console.log("Replacement complete.");

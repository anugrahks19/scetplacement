const fs = require('fs');

const filePath = process.argv[2];
const newMainContentPath = process.argv[3];

let content = fs.readFileSync(filePath, 'utf8');
const newMainContent = fs.readFileSync(newMainContentPath, 'utf8');

const startTag = '<main class="app-body';
const endTag = '</main>';

let startIndex = content.indexOf(startTag);
if (startIndex === -1) {
    const altStart = '<main class="content-wrapper';
    startIndex = content.indexOf(altStart);
    if (startIndex === -1) {
        console.error('Could not find <main class="app-body" or <main class="content-wrapper" in ' + filePath);
        process.exit(1);
    }
}

let endIndex = content.indexOf(endTag, startIndex);
let replacementEndTag = endTag;

if (endIndex === -1) {
    // Try to find the footer comment
    const footerTag = '<!-- begin::Footer -->';
    endIndex = content.indexOf(footerTag, startIndex);
    if (endIndex !== -1) {
        // If we found the footer, we need to append </main> because it was missing
        replacementEndTag = '</main>\n\n        ' + footerTag;
    } else {
        console.error('Could not find </main> or <!-- begin::Footer --> in ' + filePath);
        process.exit(1);
    }
} else {
    endIndex += endTag.length;
    replacementEndTag = '';
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const newContent = before + newMainContent + replacementEndTag + after;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated ' + filePath);

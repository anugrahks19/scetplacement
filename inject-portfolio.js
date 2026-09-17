const fs = require('fs');
let content = fs.readFileSync('pages/portfolio.html', 'utf8');

// 1. Replace hardcoded grid with empty container
const startGrid = content.indexOf('<!-- Projects Grid -->');
const endGrid = content.indexOf('</main>');
let gridContent = content.substring(startGrid, endGrid);
content = content.replace(gridContent, '<!-- Projects Grid -->\n<div class="row g-4" id="projectsContainer"></div>\n');

// 2. Add IDs to form elements in modal
content = content.replace('<form>', '<form id="projForm">');
content = content.replace('placeholder="e.g. E-Commerce Storefront"', 'id="projTitle" placeholder="e.g. E-Commerce Storefront"');
content = content.replace('<select class="form-select px-3 py-2">', '<select id="projCat" class="form-select px-3 py-2">');
content = content.replace('placeholder="Briefly describe what your project does..."></textarea>', 'id="projDesc" placeholder="Briefly describe what your project does..."></textarea>');
content = content.replace('placeholder="e.g. React, Node.js, MongoDB (comma separated)"', 'id="projTech" placeholder="e.g. React, Node.js, MongoDB (comma separated)"');
content = content.replace('placeholder="https://github.com/...', 'id="projGit" placeholder="https://github.com/...');
content = content.replace('placeholder="https://...', 'id="projLive" placeholder="https://...');
content = content.replace('shadow-sm">Save Project</button>', 'shadow-sm" id="saveProjectBtn">Save Project</button>');

// 3. Inject Script
content = content.replace('</body>', '<script src="../assets/js/portfolio.js"></script>\n</body>');

fs.writeFileSync('pages/portfolio.html', content);
console.log('Portfolio modified successfully');

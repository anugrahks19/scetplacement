const fs = require('fs');
let content = fs.readFileSync('apps/my-applications.html', 'utf8');

// 1. Replace hardcoded tbody
const startTbody = content.indexOf('<tbody>');
const endTbody = content.indexOf('</tbody>') + 8;
let tbodyContent = content.substring(startTbody, endTbody);
content = content.replace(tbodyContent, '<tbody id="applicationsTableBody"></tbody>');

// 2. Add ID to filter select
content = content.replace('<select class="form-select', '<select id="statusFilter" class="form-select');

// 3. Inject Script
content = content.replace('</body>', '<script src="../assets/js/applications.js"></script>\n</body>');

fs.writeFileSync('apps/my-applications.html', content);
console.log('Applications modified successfully');

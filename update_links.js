const fs = require('fs');
const path = require('path');

function processDirectory(directory, depth) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath, depth + 1);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            if (depth === 1) {
                // Files at student/ or faculty/ (e.g. dashboard-student.html)
                content = content.replace(/href="assets\//g, 'href="../assets/');
                content = content.replace(/src="assets\//g, 'src="../assets/');
                content = content.replace(/href="index\.html"/g, 'href="../index.html"');
                // Also update any potential js/ or css/ directly
                content = content.replace(/href="favicon\.ico"/g, 'href="../favicon.ico"');
            } else if (depth === 2) {
                // Files at student/pages/ or faculty/pages/ (e.g. student/pages/assessments.html)
                // Previously, they were at frontend/pages/ so they had ../assets/
                // Now they are at frontend/student/pages/, so they need ../../assets/
                content = content.replace(/href="\.\.\/assets\//g, 'href="../../assets/');
                content = content.replace(/src="\.\.\/assets\//g, 'src="../../assets/');
                content = content.replace(/href="\.\.\/index\.html"/g, 'href="../../index.html"');
                content = content.replace(/href="\.\.\/favicon\.ico"/g, 'href="../../favicon.ico"');
            } else if (depth === 3) {
                 // Deep nested if any
                content = content.replace(/href="\.\.\/\.\.\/assets\//g, 'href="../../../assets/');
                content = content.replace(/src="\.\.\/\.\.\/assets\//g, 'src="../../../assets/');
                content = content.replace(/href="\.\.\/\.\.\/index\.html"/g, 'href="../../../index.html"');
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated ' + fullPath);
            }
        }
    }
}

// Start processing from frontend/student and frontend/faculty with depth 1
processDirectory(path.join(__dirname, 'frontend', 'student'), 1);
processDirectory(path.join(__dirname, 'frontend', 'faculty'), 1);
if (fs.existsSync(path.join(__dirname, 'frontend', 'placement_coordinator'))) {
    processDirectory(path.join(__dirname, 'frontend', 'placement_coordinator'), 1);
}
if (fs.existsSync(path.join(__dirname, 'frontend', 'administrator'))) {
    processDirectory(path.join(__dirname, 'frontend', 'administrator'), 1);
}

console.log('All links updated successfully!');

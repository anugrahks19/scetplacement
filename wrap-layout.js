const fs = require('fs');

try {
    const dash = fs.readFileSync('dashboard-student.html', 'utf8');

    // 1. Extract Prefix and Postfix from Dashboard
    const mainStart = dash.indexOf('<main class="app-body border">');
    const mainEnd = dash.indexOf('</main>', mainStart) + 7;

    let prefix = dash.substring(0, mainStart + '<main class="app-body border">\n'.length);
    let postfix = dash.substring(mainEnd);

    // Fix relative paths in prefix and postfix for depth 1 (e.g. apps/ or pages/)
    function fixPaths(str) {
        return str
            .replace(/href="assets\//g, 'href="../assets/')
            .replace(/src="assets\//g, 'src="../assets/')
            .replace(/href="apps\//g, 'href="../apps/')
            .replace(/href="pages\//g, 'href="../pages/')
            .replace(/href="auth-/g, 'href="../auth-')
            .replace(/href="fintech\//g, 'href="../fintech/')
            .replace(/href="documentation\//g, 'href="../documentation/');
    }

    prefix = fixPaths(prefix);
    postfix = fixPaths(postfix);

    // Function to process a file
    function wrapFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('<aside class="navbar navbar-expand-lg')) {
            console.log('Skipping ' + filePath + ' (already wrapped)');
            return;
        }

        // Extract title
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : 'SCET Placement Cell';
        let newPrefix = prefix.replace(/<title>.*?<\/title>/, '<title>' + title + '</title>');
        
        // Extract custom styles
        let styles = '';
        const styleRegex = /<style>([\s\S]*?)<\/style>/g;
        let match;
        while ((match = styleRegex.exec(content)) !== null) {
            styles += '<style>\n' + match[1] + '\n</style>\n';
        }
        
        // Insert styles into newPrefix just before </head>
        newPrefix = newPrefix.replace('</head>', styles + '</head>');
        
        // Extract main content
        const mStart = content.indexOf('<main');
        if (mStart === -1) return console.log('No <main> in ' + filePath);
        const mContentStart = content.indexOf('>', mStart) + 1;
        const mEnd = content.indexOf('</main>', mContentStart);
        const mainContent = content.substring(mContentStart, mEnd);
        
        // Extract everything between </main> and the first <script> (Offcanvas/Modals)
        const scriptStart = content.indexOf('<script', mEnd);
        let extraModals = '';
        if (scriptStart !== -1) {
            let between = content.substring(mEnd + 7, scriptStart);
            // Remove </div> from app-wrapper if it exists there
            between = between.replace(/<\/div>\s*$/, '');
            extraModals = between;
        }
        
        // Extract custom scripts (ignore bootstrap, app.js, apexcharts CDN)
        let scripts = '';
        const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/g;
        while ((match = scriptRegex.exec(content)) !== null) {
            const s = match[0];
            if (!s.includes('bootstrap.bundle.min.js') && !s.includes('app.js')) {
                scripts += s + '\n';
            }
        }
        
        // Insert extraModals before </body> in postfix, and scripts at the end of body
        let newPostfix = postfix.replace('</body>', extraModals + '\n' + scripts + '\n</body>');
        
        fs.writeFileSync(filePath, newPrefix + mainContent + newPostfix);
        console.log('Successfully wrapped ' + filePath);
    }

    wrapFile('apps/discussion-forums.html');
    wrapFile('pages/my-progress.html');
    wrapFile('events/my-events.html');
    wrapFile('apps/app-inbox.html');
    wrapFile('pages/alumni-connect.html');
    wrapFile('apps/app-filemanager.html');
    wrapFile('pages/offer-letters.html');
    wrapFile('pages/certifications.html');
    wrapFile('pages/strengths-weaknesses.html');
    wrapFile('pages/assessments.html');
} catch (e) {
    console.error(e);
}

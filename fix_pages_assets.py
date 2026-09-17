import os, glob, re

# Fix all HTML files in student/ and faculty/ directories
for folder in ['student', 'faculty']:
    for path in glob.glob(f'{folder}/**/*.html', recursive=True):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Calculate correct depth
        # For student/dashboard-student.html -> depth 1 -> '../'
        # For student/pages/assessments.html -> depth 2 -> '../../'
        depth = path.replace('\\', '/').count('/')
        prefix = '../' * depth
        
        # We need to replace any href="assets/, href="../assets/, href="../../assets/ 
        # with the correct prefix.
        
        # Use regex to replace href="[any number of ../]assets/
        content = re.sub(r'href="(\.\./)*assets/', f'href="{prefix}assets/', content)
        content = re.sub(r'src="(\.\./)*assets/', f'src="{prefix}assets/', content)
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

print('Fixed all asset paths!')

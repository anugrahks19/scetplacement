import os, glob

for path in glob.glob('student/**/*.html', recursive=True):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Calculate depth relative to root
    # e.g. student/dashboard-student.html -> depth 1 -> '../'
    # e.g. student/pages/assessments.html -> depth 2 -> '../../'
    depth = path.replace('\\', '/').count('/')
    prefix = '../' * depth
    
    content = content.replace('href="assets/', f'href="{prefix}assets/')
    content = content.replace('src="assets/', f'src="{prefix}assets/')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print('Fixed asset paths!')

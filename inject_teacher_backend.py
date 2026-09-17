import os, glob

for path in glob.glob('faculty/**/*.html', recursive=True):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'teacher_backend_integration.js' not in content:
        # Calculate depth
        depth = path.replace('\\', '/').count('/')
        prefix = '../' * depth
        
        script_tag = f'\n    <script src="{prefix}assets/js/teacher_backend_integration.js"></script>\n</body>'
        content = content.replace('</body>', script_tag)
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

print('Injected teacher backend integration JS!')

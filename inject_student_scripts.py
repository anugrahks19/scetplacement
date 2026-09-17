import os, glob

# Find all HTML files in the student directory
for path in glob.glob('student/**/*.html', recursive=True):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Calculate depth relative to root
    # e.g. student/dashboard-student.html -> depth 1 -> '../'
    # e.g. student/pages/assessments.html -> depth 2 -> '../../'
    depth = path.replace('\\', '/').count('/')
    prefix = '../' * depth
    
    script_tag = f'<script src="{prefix}assets/js/student_backend_integration.js"></script>'
    
    if 'student_backend_integration.js' not in content:
        # Inject right before </body>
        if '</body>' in content:
            content = content.replace('</body>', f'    {script_tag}\n</body>')
        else:
            # Fallback if no body tag
            content += f'\n{script_tag}'
            
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected into {path}")
    else:
        print(f"Already injected in {path}")

print("Injection complete.")

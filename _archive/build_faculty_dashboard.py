import os
import re
from bs4 import BeautifulSoup
import shutil

print("Starting deep cleanup and rebuild...")

# 1. Delete unwanted directories to save space and remove dead routes
unwanted_dirs = ['hrms', 'fintech', 'crm', 'hospital', 'logistics', 'podcast', 'blog', 'pages/pos']
for d in unwanted_dirs:
    path = os.path.join('d:\\scetplacement-main', d)
    if os.path.exists(path) and os.path.isdir(path):
        shutil.rmtree(path)
        print(f"Removed directory: {d}")

# Load the original template dashboard to guarantee a clean slate
with open('dashboard-faculty.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# --- 2. HEADER CLEANUP (Mega Menus) ---
header_nav = soup.select_one('header nav.navbar ul.navbar-nav')
if header_nav:
    header_nav.clear() # Removes all the mega menus (Classes, Assignments, Performance, etc.)

# --- 3. SIDEBAR REBUILD ---
sidebar = soup.select_one('aside.navbar ul.list-unstyled')
if sidebar:
    sidebar.clear()
    
    # Menu items based on SRS Section 4 (User Spec)
    menu_items = [
        ("Dashboard", "faculty-dashboard.html", "bi-speedometer"),
        ("Question Bank", "faculty-questions.html", "bi-collection"),
        ("AI Question Review", "faculty-ai-review.html", "bi-robot"),
        ("Assessments", "faculty-assessments.html", "bi-journal-check"),
        ("Coding Problems", "faculty-coding.html", "bi-code-slash"),
        ("Debugging Problems", "faculty-debugging.html", "bi-bug"),
        ("Students", "faculty-students.html", "bi-people"),
        ("Analytics & Reports", "faculty-analytics.html", "bi-bar-chart-fill"),
        ("Integrity Review", "faculty-integrity.html", "bi-shield-exclamation"),
        ("Notifications", "faculty-notifications.html", "bi-bell")
    ]
    
    for title, href, icon in menu_items:
        li = soup.new_tag('li')
        li['data-bs-title'] = title
        li['data-bs-toggle'] = "tooltip"
        li['data-bs-custom-class'] = "custom-tooltip"
        
        a = soup.new_tag('a', href=href, **{'class': 'nav-link py-2 px-2 px-lg-4'})
        i = soup.new_tag('i', **{'class': f'bi {icon} fs-4'})
        span = soup.new_tag('span', **{'class': 'd-lg-none ms-2'})
        span.string = title
        
        a.append(i)
        a.append(span)
        li.append(a)
        sidebar.append(li)

# --- 4. MAIN CONTENT CLEANUP & MODIFICATIONS ---

# A. Remove Weather/Temperature from the ToDo list
temp_div = soup.find('div', class_='d-flex align-items-start gap-1')
if temp_div and '31' in temp_div.text and '°C' in temp_div.text:
    temp_div.decompose()
    
# Change "My Todo List" to "Pending AI Reviews"
todo_title = soup.find(string=re.compile("My Todo List", re.I))
if todo_title:
    todo_title.replace_with("Pending AI Reviews")

# B. Clean up Quick Access Grid
# The Quick Access items are usually anchor tags with specific text
unwanted_quick_access = [
    "Grade Assignments", "Student List", "Schedule Class", "Crypto AI", 
    "Kanban", "Invoice", "Hospital", "Logistics", "POS", "Podcast", "Blog"
]

# Find all links that might be Quick Access tiles (they often have class app-label or are within an app-card)
# The screenshot shows text like "Crypto AI", "Kanban". Let's search for any tag containing these texts and remove their parent container.
for text in unwanted_quick_access:
    # Use regex to find text ignoring case and whitespace
    pattern = re.compile(f"\\b{text}\\b", re.I)
    elements = soup.find_all(string=pattern)
    for el in elements:
        try:
            tile = el.parent if el.parent and el.parent.name == 'a' else None
            if not tile and hasattr(el, 'find_parent'):
                tile = el.find_parent('a')
            elif not tile and el.parent and hasattr(el.parent, 'find_parent'):
                tile = el.parent.find_parent('a')
                
            if not tile:
                if hasattr(el, 'find_parent'):
                    tile = el.find_parent('div', class_=re.compile("col-"))
                elif el.parent and hasattr(el.parent, 'find_parent'):
                    tile = el.parent.find_parent('div', class_=re.compile("col-"))
                    
            if tile:
                tile.decompose()
        except AttributeError:
            pass

# Ensure we have a main content area to prepend our selector
# In dashQ, it's usually <main class="main-content"> or directly inside .app-wrapper after header
main_content = soup.select_one('main.main-content') or soup.select_one('.app-wrapper')

# C. Add the Class/Semester/Department Selector at the top of the dashboard widgets
selector_html = """
<div class="container-fluid mb-4 mt-3">
    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
        <div class="row align-items-center g-3">
            <div class="col-12 col-md-auto">
                <h6 class="mb-0 text-muted fw-bold text-uppercase"><i class="bi bi-funnel-fill me-2"></i>Context Filter:</h6>
            </div>
            <div class="col-12 col-md-3">
                <select class="form-select form-select-sm border-0 bg-body-tertiary fw-semibold" id="deptSelector">
                    <option value="cs">Computer Science (CS)</option>
                    <option value="ece">Electronics & Communication (ECE)</option>
                </select>
            </div>
            <div class="col-12 col-md-3">
                <select class="form-select form-select-sm border-0 bg-body-tertiary fw-semibold" id="batchSelector">
                    <option value="cs-24-28">Batch: CS 2024-2028</option>
                    <option value="cs-23-27">Batch: CS 2023-2027</option>
                </select>
            </div>
            <div class="col-12 col-md-3">
                <select class="form-select form-select-sm border-0 bg-body-tertiary fw-semibold" id="semesterSelector">
                    <option value="sem5-2026">Semester 5, 2026 (Active)</option>
                    <option value="sem4-2025">Semester 4, 2025</option>
                </select>
            </div>
        </div>
    </div>
</div>
"""
selector_soup = BeautifulSoup(selector_html, 'html.parser')

# We need to insert this right after the header ends, or inside the container where dashboard widgets start.
# Let's find the first container-fluid inside the main area (after header)
content_containers = soup.find_all('div', class_='container-fluid')
if len(content_containers) > 1:
    # content_containers[0] is usually the header
    content_containers[1].insert(0, selector_soup)
else:
    if main_content:
        main_content.insert(0, selector_soup)

# Save the pristine dashboard
with open('faculty-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

print("Dashboard rebuilt successfully.")

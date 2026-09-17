import os
from bs4 import BeautifulSoup

file_path = r"d:\scet_placement\student\dashboard-student.html"

with open(file_path, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

# 1. Strip Mega Menu
mega_menu = soup.find("nav", class_="navbar")
if mega_menu:
    mega_menu_ul = mega_menu.find("ul", class_="navbar-nav")
    if mega_menu_ul:
        mega_menu_ul.clear() # Removes all <li> inside the mega menu

# 2. Top Bar Redesign
# Clean up left header (notifications and add badges)
left_header = soup.find("div", class_="d-flex gap-2 align-items-center flex-fill")
if left_header:
    # Remove notifications
    notifications_btn = left_header.find("button", {"data-bs-target": "#notifications_drawer"})
    if notifications_btn:
        notifications_btn.decompose()
        
    # Add badges
    badges_html = BeautifulSoup('<div class="ms-3 d-none d-md-flex gap-2"><span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2">Computer Science</span><span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-3 py-2">Batch 2026</span><span class="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-3 py-2">Sem 5</span></div>', "html.parser")
    left_header.append(badges_html)

# Clean up right header (profile and language dropdowns)
right_header = soup.find("div", class_="right-header")
if right_header:
    # Remove settings gear
    settings_btn = right_header.find("button", {"data-bs-target": "#setting_drawer"})
    if settings_btn:
        settings_btn.decompose()
        
    # Clean up profile menu
    profile_menu = right_header.find("div", class_="dropdown-menu")
    if profile_menu:
        # Keep the mb-4 div which has the user profile
        user_profile = profile_menu.find("div", class_="mb-4")
        profile_menu.clear()
        if user_profile:
            profile_menu.append(user_profile)

# Remove right quick action bar
rightbar = soup.find("div", class_="rightbar")
if rightbar:
    rightbar.decompose()
    
# Remove other floating action buttons
offcanvas = soup.find("div", {"id": "setting_drawer"})
if offcanvas:
    offcanvas.decompose()
    
# 3. Sidebar Redesign
sidebar = soup.find("aside")
if sidebar:
    ul = sidebar.find("ul", class_="list-unstyled")
    if ul:
        ul.clear()
        # Add new sidebar links
        student_nav = """
        <li data-bs-title="Dashboard" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip">
            <a class="nav-link py-2 px-2 px-lg-4 active" href="dashboard-student.html" aria-label="Dashboard">
                <i class="bi bi-house fs-5"></i>
                <span class="d-lg-none ms-2">Dashboard</span>
            </a>
        </li>
        <li data-bs-title="Practice (Coding / MCQs)" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip">
            <a class="nav-link py-2 px-2 px-lg-4" href="practice.html" aria-label="Practice">
                <i class="bi bi-code-slash fs-5"></i>
                <span class="d-lg-none ms-2">Practice</span>
            </a>
        </li>
        <li data-bs-title="Assessments" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip">
            <a class="nav-link py-2 px-2 px-lg-4" href="assessments.html" aria-label="Assessments">
                <i class="bi bi-file-earmark-text fs-5"></i>
                <span class="d-lg-none ms-2">Assessments</span>
            </a>
        </li>
        <li data-bs-title="Readiness & Analytics" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip">
            <a class="nav-link py-2 px-2 px-lg-4" href="analytics.html" aria-label="Analytics">
                <i class="bi bi-graph-up fs-5"></i>
                <span class="d-lg-none ms-2">Readiness & Analytics</span>
            </a>
        </li>
        <li data-bs-title="Interventions" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip">
            <a class="nav-link py-2 px-2 px-lg-4" href="interventions.html" aria-label="Interventions">
                <i class="bi bi-bullseye fs-5"></i>
                <span class="d-lg-none ms-2">Interventions</span>
            </a>
        </li>
        """
        ul.append(BeautifulSoup(student_nav, "html.parser"))

with open(file_path, "w", encoding="utf-8") as f:
    f.write(str(soup))
print("Student UI successfully cleaned.")

import os
import glob
from bs4 import BeautifulSoup

student_dir = r"d:\scet_placement\student"

bloat_files = [
    "app-calendar.html", "app-campaigns.html", "app-invoice-builder.html",
    "app-invoice-create.html", "app-kanban.html", "app-todo.html",
    "app-video-call.html", "app-contact.html", "app-filemanager.html",
    "app-inbox.html", "app-ai-chat.html", "app-jobfeeds.html",
    "crypto-ai-dashboard.html", "pos.html", "store-analytics.html",
    "comments.html", "need-help.html", "support-dashboard.html"
]

# 1. Delete Bloat
for root_dir, dirs, files in os.walk(student_dir):
    for f in files:
        if f in bloat_files:
            file_path = os.path.join(root_dir, f)
            os.remove(file_path)
            print(f"Deleted bloat: {file_path}")

# 2. Process Remaining HTML Files
html_files = glob.glob(os.path.join(student_dir, "**/*.html"), recursive=True)

sidebar_html = """
<li data-bs-title="Dashboard" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip">
    <a class="nav-link py-2 px-2 px-lg-4" href="/student/dashboard-student.html" aria-label="Dashboard">
        <i class="bi bi-house fs-5"></i>
        <span class="d-lg-none ms-2">Dashboard</span>
    </a>
</li>
<li data-bs-title="Practice (Coding / MCQs)" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip">
    <a class="nav-link py-2 px-2 px-lg-4" href="/student/pages/interview-prep.html" aria-label="Practice">
        <i class="bi bi-code-slash fs-5"></i>
        <span class="d-lg-none ms-2">Practice</span>
    </a>
</li>
<li data-bs-title="Assessments" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip">
    <a class="nav-link py-2 px-2 px-lg-4" href="/student/pages/assessments.html" aria-label="Assessments">
        <i class="bi bi-file-earmark-text fs-5"></i>
        <span class="d-lg-none ms-2">Assessments</span>
    </a>
</li>
<li data-bs-title="Readiness & Analytics" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip">
    <a class="nav-link py-2 px-2 px-lg-4" href="/student/pages/my-progress.html" aria-label="Analytics">
        <i class="bi bi-graph-up fs-5"></i>
        <span class="d-lg-none ms-2">Readiness & Analytics</span>
    </a>
</li>
<li data-bs-title="Interventions" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip">
    <a class="nav-link py-2 px-2 px-lg-4" href="/student/pages/strengths-weaknesses.html" aria-label="Interventions">
        <i class="bi bi-bullseye fs-5"></i>
        <span class="d-lg-none ms-2">Interventions</span>
    </a>
</li>
<li class="w-100"><span class="border-top d-flex mx-lg-4"></span></li>
<li data-bs-title="My Portfolio" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip">
    <a class="nav-link py-2 px-2 px-lg-4" href="/student/pages/portfolio.html" aria-label="Portfolio">
        <i class="bi bi-briefcase fs-5"></i>
        <span class="d-lg-none ms-2">My Portfolio</span>
    </a>
</li>
"""

badges = '<div class="ms-3 d-none d-md-flex gap-2"><span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2">Computer Science</span><span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-3 py-2">Batch 2026</span><span class="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-3 py-2">Sem 5</span></div>'

for file_path in html_files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")
            
        modified = False
        
        # Strip Mega Menu
        mega_menu = soup.find("nav", class_="navbar")
        if mega_menu:
            mega_menu_ul = mega_menu.find("ul", class_="navbar-nav")
            if mega_menu_ul and len(mega_menu_ul.find_all("li")) > 0:
                mega_menu_ul.clear()
                modified = True
                
        # Clean Left Header
        left_header = soup.find("div", class_="d-flex gap-2 align-items-center flex-fill")
        if left_header:
            notif = left_header.find("button", {"data-bs-target": "#notifications_drawer"})
            if notif:
                notif.decompose()
                modified = True
            
            # Remove old badges if they exist so we don't duplicate
            old_badges = left_header.find_all("div", class_="ms-3 d-none d-md-flex gap-2")
            for ob in old_badges:
                ob.decompose()
                
            left_header.append(BeautifulSoup(badges, "html.parser"))
            modified = True
            
        # Clean Right Header
        right_header = soup.find("div", class_="right-header")
        if right_header:
            set_btn = right_header.find("button", {"data-bs-target": "#setting_drawer"})
            if set_btn:
                set_btn.decompose()
                modified = True
                
            pm = right_header.find("div", class_="dropdown-menu")
            if pm:
                up = pm.find("div", class_="mb-4")
                if up:
                    pm.clear()
                    pm.append(up)
                    modified = True
                    
        # Remove rightbar
        rb = soup.find("div", class_="rightbar")
        if rb:
            rb.decompose()
            modified = True
            
        # Remove offcanvas settings
        oc = soup.find("div", {"id": "setting_drawer"})
        if oc:
            oc.decompose()
            modified = True
            
        # Rebuild Sidebar
        sidebar = soup.find("aside")
        if sidebar:
            ul = sidebar.find("ul", class_="list-unstyled")
            if ul:
                ul.clear()
                ul.append(BeautifulSoup(sidebar_html, "html.parser"))
                modified = True
                
                # Make current page active in sidebar based on filename
                basename = os.path.basename(file_path)
                for a_tag in ul.find_all("a"):
                    if basename in a_tag.get("href", ""):
                        a_tag["class"] = a_tag.get("class", []) + ["active"]
                        
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(str(soup))
            print(f"Cleaned UI for: {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

print("Successfully cleaned all student HTML pages.")

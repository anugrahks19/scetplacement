from bs4 import BeautifulSoup
import os

with open('faculty-dashboard.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Clean up sidebar
sidebar_ul = soup.select_one('aside.navbar ul.list-unstyled')
if sidebar_ul:
    sidebar_ul.clear()
    
    links = [
        ('Dashboard', 'faculty-dashboard.html', 'bi-speedometer'),
        ('Questions', 'faculty-questions.html', 'bi-collection'),
        ('Question Editor', 'faculty-question-editor.html', 'bi-pencil-square'),
        ('Question Review', 'faculty-question-review.html', 'bi-check2-square'),
        ('Assessments', 'faculty-assessments.html', 'bi-journal-check'),
        ('Assessment Builder', 'faculty-assessment-builder.html', 'bi-tools'),
        ('Assessment Results', 'faculty-assessment-results.html', 'bi-bar-chart-fill')
    ]
    
    for title, href, icon in links:
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
        sidebar_ul.append(li)

# Clean up header mega menu
header_nav = soup.select_one('header nav.navbar ul.navbar-nav')
if header_nav:
    header_nav.clear()

html_content = str(soup)

# Write dashboard
with open('faculty-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# Remove the content inside .rightbar for the other pages so they are blank
rightbar = soup.select_one('.rightbar')
if rightbar:
    rightbar.clear()
    h1 = soup.new_tag('h1')
    h1['class'] = 'm-4'
    h1.string = 'Page Content'
    rightbar.append(h1)

empty_html_content = str(soup)

# Write other files
files = [
    ('faculty-questions.html', 'Questions Bank'),
    ('faculty-question-editor.html', 'Question Editor'),
    ('faculty-question-review.html', 'Question Review'),
    ('faculty-assessments.html', 'Assessments'),
    ('faculty-assessment-builder.html', 'Assessment Builder'),
    ('faculty-assessment-results.html', 'Assessment Results')
]

for file, title in files:
    if rightbar:
        h1.string = title
    with open(file, 'w', encoding='utf-8') as f:
        f.write(str(soup))

print("Generated all faculty pages.")

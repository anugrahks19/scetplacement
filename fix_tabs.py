import os

files = [
    r"d:\scet_placement\student\dashboard-student.html",
    r"d:\scet_placement\faculty\dashboard-faculty.html",
    r"d:\scet_placement\student\pages\interview-prep.html"
]

replacements = {
    '<label for="workotab1">Analytics</label>': '<label for="workotab1">Performance Analytics</label>',
    '<label for="workotab2">Support</label>': '<label for="workotab2">Helpdesk</label>',
    '<label for="workotab3">Podcast</label>': '<label for="workotab3">Learning Modules</label>',
    '<label for="workotab4">Server Statistics</label>': '<label for="workotab4">Placement Stats</label>',
    '<label for="workotab5">Upcoming</label>': '<label for="workotab5">Upcoming Drives</label>',
    
    # Leaderboard
    '>$52k<': '>5200 XP<',
    '>$38k<': '>3800 XP<',
    '>$29k<': '>2900 XP<',
    '>$26k<': '>2600 XP<',
    '>$16k<': '>1600 XP<',
    
    # Server Statistics -> Placement Stats data
    '>Subdomains<': '>Active Companies<',
    '>Databases<': '>Total Offers<',
    '>File Usage<': '>Avg Package (LPA)<',
    '>Bandwidth<': '>Assessments<',
    '>Shared IP<': '>Resume Score<',
    '>Email Upcoming Tests<': '>Pending Interviews<'
}

# The Podcast entries:
podcast_replacements = {
    'podcast-dashboard.html': '#',
    '>Podcast DSA &amp; CP<': '>Interview Prep Videos<',
    '>Podcast View Students<': '>View Learning Content<',
    'podcast-card': 'learning-card',
    'podcast-thumb': 'learning-thumb',
    
    # Replace titles
    '>Elevation<': '>System Design<',
    '>The Gary Vee<': '>Advanced Graphs<',
    '>The Daily Show<': '>DBMS Normalization<',
    '>Daily Podcast<': '>OS Scheduling<',
    '>Mindset Mentor<': '>HR Tips<',
    
    '>Steven Furtick<': '>NeetCode<',
    '>Garry Vee<': '>Striver<',
    '>Trevor Noah<': '>Abdul Bari<',
    '>Joel Osteen<': '>Love Babbar<',
    '>Rob Dial<': '>SCET Placement Cell<'
}

for fp in files:
    if os.path.exists(fp):
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for k, v in replacements.items():
            content = content.replace(k, v)
            
        for k, v in podcast_replacements.items():
            content = content.replace(k, v)
            
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {fp}")

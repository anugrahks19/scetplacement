import os
import glob
from bs4 import BeautifulSoup

student_dir = r"d:\scet_placement\student"
html_files = glob.glob(os.path.join(student_dir, "**/*.html"), recursive=True)

irrelevant_tabs = ["Support", "Podcast", "Server Statistics", "Upcoming", "Analytics & Insights", "Campaigns"]

for file_path in html_files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")
            
        modified = False
        
        # Find all inputs for tabs
        inputs = soup.find_all("input", {"name": "tabs"})
        for inp in list(inputs): # use list to safely remove elements while iterating
            inp_id = inp.get("id")
            if not inp_id:
                continue
                
            label = soup.find("label", {"for": inp_id})
            if not label:
                continue
                
            text = label.get_text(strip=True)
            if any(irrel.lower() in text.lower() for irrel in irrelevant_tabs):
                # Find the next sibling that is a div.panel
                panel = label.find_next_sibling("div", class_="panel")
                
                # Decompose all three
                inp.decompose()
                label.decompose()
                if panel:
                    panel.decompose()
                    
                modified = True
                
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(str(soup))
            print(f"Removed bloat tabs in: {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

print("Tab cleanup complete.")

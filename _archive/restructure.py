import os
import shutil
import re

root_dir = r"d:\hahahaha\new hahahaha"
external_dir = os.path.join(root_dir, "external")
html_src_dir = os.path.join(root_dir, "edggeui.com", "dashq", "html")

# Create external directory
if not os.path.exists(external_dir):
    os.makedirs(external_dir)

# CDN folders to move
cdns = [
    "cdnjs.cloudflare.com",
    "cdn-icons-png.flaticon.com",
    "flagcdn.com",
    "about.gitlab.com",
    "{s}.tile.openstreetmap.org"
]

for cdn in cdns:
    src = os.path.join(root_dir, cdn)
    dst = os.path.join(external_dir, cdn)
    if os.path.exists(src):
        shutil.move(src, dst)

# Delete HTTrack root wrapper files before moving the actual ones
httrack_files = [
    "index.html",
    "backblue.gif",
    "fade.gif",
    "cookies.txt",
    "hts-log.txt"
]
for f in httrack_files:
    path = os.path.join(root_dir, f)
    if os.path.exists(path):
        os.remove(path)

# Remove hts-cache directory
hts_cache = os.path.join(root_dir, "hts-cache")
if os.path.exists(hts_cache):
    shutil.rmtree(hts_cache)

# Move contents of edggeui.com/dashq/html to root
for item in os.listdir(html_src_dir):
    src = os.path.join(html_src_dir, item)
    dst = os.path.join(root_dir, item)
    if not os.path.exists(dst):
        shutil.move(src, dst)
    else:
        print(f"Warning: {dst} already exists, skipping move.")

# Now clean up the edggeui.com folder
edggeui_dir = os.path.join(root_dir, "edggeui.com")
if os.path.exists(edggeui_dir):
    shutil.rmtree(edggeui_dir)

# Regex to find relative paths to CDNs
pattern = re.compile(r'((?:\.\./)+)(cdnjs\.cloudflare\.com|cdn-icons-png\.flaticon\.com|flagcdn\.com|about\.gitlab\.com|\{s\}\.tile\.openstreetmap\.org)')

def replace_path(match):
    dots = match.group(1)
    cdn = match.group(2)
    # Count how many '../' there are
    n = dots.count('../')
    # Reduce by 3
    new_n = n - 3
    if new_n <= 0:
        return f"external/{cdn}"
    else:
        return "../" * new_n + f"external/{cdn}"

# Iterate over all .html files in root and subdirectories to replace paths
for root, dirs, files in os.walk(root_dir):
    # Skip the external dir just in case
    if "external" in dirs:
        dirs.remove("external")
        
    for file in files:
        if file.endswith(".html"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            new_content, count = pattern.subn(replace_path, content)
            
            if count > 0:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated {count} links in {file_path}")

print("Restructuring complete.")

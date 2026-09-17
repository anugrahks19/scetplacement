$file = "c:\Antigravity\scet_placement\pages\interview-prep.html"
$content = Get-Content $file -Raw -Encoding utf8

# Fix links that point to the pages directory from within the pages directory
$content = $content -replace 'href="pages/', 'href="'

# Fix links that point to root directory HTML files
$content = $content -replace 'href="index.html"', 'href="../index.html"'
$content = $content -replace 'href="dashboard-student.html"', 'href="../dashboard-student.html"'

Set-Content $file $content -Encoding utf8

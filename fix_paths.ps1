$file = "c:\Antigravity\scet_placement\pages\interview-prep.html"
$content = Get-Content $file -Raw -Encoding utf8
$content = $content -replace '"assets/', '"../assets/'
Set-Content $file $content -Encoding utf8

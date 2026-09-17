$file = "c:\Antigravity\scet_placement\pages\interview-prep.html"
$content = Get-Content $file -Raw -Encoding utf8
$content = $content -replace 'Nemotron 3 Ultra', 'DeepSeek AI'
$content = $content -replace 'Nemotron Error:', 'AI Error:'
Set-Content $file $content -Encoding utf8

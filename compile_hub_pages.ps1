$template = Get-Content "c:\Antigravity\scet_placement\layout_template.txt" -Raw -Encoding utf8

# Ensure apps directory exists
$appsDir = "c:\Antigravity\scet_placement\apps"
if (-Not (Test-Path $appsDir)) {
    New-Item -ItemType Directory -Force -Path $appsDir
}

# 1. Certifications
$certContent = Get-Content "c:\Antigravity\scet_placement\certs_content.txt" -Raw -Encoding utf8
$certHtml = $template -replace '<MAIN_CONTENT_HERE>', $certContent
Set-Content "c:\Antigravity\scet_placement\pages\certifications.html" $certHtml -Encoding utf8

# 2. File Manager
$fileContent = Get-Content "c:\Antigravity\scet_placement\filemanager_content.txt" -Raw -Encoding utf8
$fileHtml = $template -replace '<MAIN_CONTENT_HERE>', $fileContent
Set-Content "c:\Antigravity\scet_placement\apps\app-filemanager.html" $fileHtml -Encoding utf8

# 3. Job Feeds
$jobContent = Get-Content "c:\Antigravity\scet_placement\jobfeeds_content.txt" -Raw -Encoding utf8
$jobHtml = $template -replace '<MAIN_CONTENT_HERE>', $jobContent
Set-Content "c:\Antigravity\scet_placement\apps\app-jobfeeds.html" $jobHtml -Encoding utf8

# 4. My Applications
$appContent = Get-Content "c:\Antigravity\scet_placement\applications_content.txt" -Raw -Encoding utf8
$appHtml = $template -replace '<MAIN_CONTENT_HERE>', $appContent
Set-Content "c:\Antigravity\scet_placement\apps\my-applications.html" $appHtml -Encoding utf8

Write-Output "All 4 hub pages created successfully."

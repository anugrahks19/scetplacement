$template = Get-Content "c:\Antigravity\scet_placement\layout_template.txt" -Raw -Encoding utf8
$assessmentsContent = Get-Content "c:\Antigravity\scet_placement\assessments_content.txt" -Raw -Encoding utf8
$statsContent = Get-Content "c:\Antigravity\scet_placement\stats_content.txt" -Raw -Encoding utf8

$assessmentsHtml = $template -replace '<MAIN_CONTENT_HERE>', $assessmentsContent
$statsHtml = $template -replace '<MAIN_CONTENT_HERE>', $statsContent

Set-Content "c:\Antigravity\scet_placement\pages\assessments.html" $assessmentsHtml -Encoding utf8
Set-Content "c:\Antigravity\scet_placement\pages\strengths-weaknesses.html" $statsHtml -Encoding utf8

Write-Output "Pages created."

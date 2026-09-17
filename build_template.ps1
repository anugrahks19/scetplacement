$html = Get-Content "c:\Antigravity\scet_placement\dashboard-student.html" -Encoding utf8

$start = -1
$end = -1
for ($i = 0; $i -lt $html.Count; $i++) {
    if ($html[$i] -match '<main class="app-body border">') {
        $start = $i
    }
    if ($html[$i] -match '</main>') {
        $end = $i
        break
    }
}

if ($start -ne -1 -and $end -ne -1) {
    # Generate the layout with a placeholder for the main content
    $part1 = $html[0..($start-1)] -join "`n"
    $part2 = $html[($end+1)..($html.Count-1)] -join "`n"
    
    $layout = $part1 + "`n<MAIN_CONTENT_HERE>`n" + $part2
    
    # Replace asset paths for being in a subdirectory
    $layout = $layout -replace '"assets/', '"../assets/'
    $layout = $layout -replace '"pages/', '""'
    $layout = $layout -replace 'href="dashboard-student.html"', 'href="../dashboard-student.html"'
    
    Set-Content "c:\Antigravity\scet_placement\layout_template.txt" $layout -Encoding utf8
    Write-Output "Template created successfully."
} else {
    Write-Output "Failed to find <main> tags."
}

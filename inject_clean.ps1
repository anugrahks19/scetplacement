$file = "c:\Antigravity\scet_placement\pages\interview-prep.html"
$html = Get-Content $file -Encoding utf8

$cleanTail = Get-Content "c:\Antigravity\scet_placement\clean_tail.txt" -Raw -Encoding utf8

$cutIndex = -1
for ($i = 0; $i -lt $html.Count; $i++) {
    if ($html[$i] -match '^</html>$') {
        $cutIndex = $i
        break
    }
}

if ($cutIndex -ne -1) {
    $part1 = $html[0..$cutIndex] -join "`n"
    $finalContent = $part1 + "`n" + $cleanTail
    Set-Content $file $finalContent -Encoding utf8
    Write-Output "Clean injection successful."
} else {
    Write-Output "Failed to find </html>."
}

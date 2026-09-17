$file = "c:\Antigravity\scet_placement\pages\interview-prep.html"
$html = Get-Content $file -Encoding utf8

$newUi = Get-Content "c:\Antigravity\scet_placement\new_ui.html" -Raw -Encoding utf8
$newLogic = Get-Content "c:\Antigravity\scet_placement\new_logic.js" -Raw -Encoding utf8

# Find Modal Body boundaries
$modalStart = -1
$modalEnd = -1
for ($i = 0; $i -lt $html.Count; $i++) {
    if ($html[$i] -match '<div class="modal-body d-flex flex-column align-items-center') {
        $modalStart = $i
    }
    if ($modalStart -ne -1 -and $i -gt $modalStart -and $html[$i] -match '            </div>') {
        if ($html[$i+1] -match '        </div>' -and $html[$i+2] -match '    </div>') {
            $modalEnd = $i
            break
        }
    }
}

# Find Script block boundaries
$scriptStart = -1
$scriptEnd = -1
for ($i = 0; $i -lt $html.Count; $i++) {
    if ($html[$i] -match 'const HF_TOKEN =') {
        $scriptStart = $i - 1 # the <script> line
    }
    if ($scriptStart -ne -1 -and $i -gt $scriptStart -and $html[$i] -match '</script>') {
        $scriptEnd = $i
        break
    }
}

Write-Output "Modal Start: $modalStart, End: $modalEnd"
Write-Output "Script Start: $scriptStart, End: $scriptEnd"

if ($modalStart -ne -1 -and $modalEnd -ne -1 -and $scriptStart -ne -1 -and $scriptEnd -ne -1) {
    
    $part1 = $html[0..($modalStart - 1)] -join "`n"
    $part2 = $html[($modalEnd + 1)..($scriptStart)] -join "`n"
    $part3 = $html[($scriptEnd)..($html.Count - 1)] -join "`n"
    
    $finalContent = $part1 + "`n" + $newUi + "`n" + $part2 + "`n" + $newLogic + "`n" + $part3
    Set-Content $file $finalContent -Encoding utf8
    Write-Output "Injection successful."
} else {
    Write-Output "Failed to find boundaries."
}

$lines = Get-Content c:\Antigravity\scet_placement\pages\interview-prep.html
for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'aiInterviewModal') {
        Write-Output "Line $i: $($lines[$i])"
    }
}

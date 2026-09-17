$file = "c:\Antigravity\scet_placement\pages\interview-prep.html"
$content = Get-Content $file -Raw -Encoding utf8

$startTag = "<!-- begin::Header -->"
$endTag = "</header>"

$startIndex = $content.IndexOf($startTag)
$endIndex = $content.IndexOf($endTag) + $endTag.Length

if ($startIndex -ge 0 -and $endIndex -gt $startIndex) {
    # Extract the header content
    $headerContent = $content.Substring($startIndex, $endIndex - $startIndex)
    Set-Content "c:\Antigravity\scet_placement\nav_backup.html" $headerContent -Encoding utf8
    
    # Remove the header
    $newContent = $content.Remove($startIndex, $endIndex - $startIndex)
    Set-Content $file $newContent -Encoding utf8
    Write-Output "Header removed successfully from interview-prep.html"
} else {
    Write-Output "Header not found!"
}

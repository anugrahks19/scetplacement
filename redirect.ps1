$file = "c:\Antigravity\scet_placement\pages\interview-prep.html"
$content = Get-Content $file -Raw -Encoding utf8
$script = @"
<script>
    // Redirect to index.html on page refresh
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD || (performance.getEntriesByType('navigation').length && performance.getEntriesByType('navigation')[0].type === 'reload')) {
        window.location.href = '../index.html';
    }
</script>
"@
$content = $content -replace '</body>', ($script + "`n</body>")
Set-Content $file $content -Encoding utf8

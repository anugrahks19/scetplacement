$files = @(
    "build_nemotron.ps1",
    "build_premium_ui.ps1",
    "build_pro_ai.ps1",
    "fix_whisper.ps1",
    "test.js",
    "inject_final_ui.ps1",
    "test_or.js",
    "clean_tail.txt",
    "new_logic.js",
    "new_logic2.js",
    "new_logic3.js",
    "pages/interview-prep.html"
)

foreach ($file in $files) {
    $path = "c:\Antigravity\scet_placement\$file"
    if (Test-Path $path) {
        $content = Get-Content $path -Raw -Encoding utf8
        
        # Replace OpenRouter keys
        $content = $content -replace 'sk-or-v1-[a-zA-Z0-9]+', 'YOUR_OPENROUTER_KEY_HERE'
        
        # Replace Hugging Face tokens
        $content = $content -replace 'hf_[a-zA-Z0-9]+', 'YOUR_HUGGINGFACE_TOKEN_HERE'
        
        Set-Content $path $content -Encoding utf8
        Write-Output "Cleaned $file"
    }
}

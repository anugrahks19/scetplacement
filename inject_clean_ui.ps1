$filePath = "c:\Antigravity\scet_placement\pages\interview-prep.html"
$lines = Get-Content -Encoding utf8 $filePath
$beginIdx = -1
$endIdx = -1

for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "<!-- AI Interview Modal -->") { $beginIdx = $i }
    if ($lines[$i] -match "<!-- End AI Interview Modal -->") { $endIdx = $i }
}

if ($beginIdx -ne -1 -and $endIdx -ne -1) {
    $newModal = @"
<!-- AI Interview Modal -->
<div class="modal fade" id="aiInterviewModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen m-0">
        <div class="modal-content border-0" style="background: rgba(248, 250, 252, 0.95); backdrop-filter: blur(20px);">
            
            <!-- Header -->
            <div class="modal-header border-0 px-5 pt-4 pb-0 z-3 position-relative">
                <div class="d-flex align-items-center gap-3">
                    <div class="d-inline-flex align-items-center justify-content-center rounded-3 bg-white shadow-sm p-3 border">
                        <i class="bi bi-mortarboard-fill text-primary fs-3"></i>
                    </div>
                    <div>
                        <h4 class="modal-title fw-bold text-dark mb-0" style="letter-spacing: -0.5px;">SCET Interview Portal</h4>
                        <div class="badge bg-light text-secondary border rounded-pill fw-normal mt-1 px-3">Powered by Nemotron & Deepgram</div>
                    </div>
                </div>
                <button type="button" class="btn-close rounded-circle p-3 bg-white shadow-sm border" data-bs-dismiss="modal" aria-label="Close" onclick="endInterview()"></button>
            </div>

            <div class="modal-body d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden p-0 z-2">
                
                <!-- Clean Pulse Visualizer -->
                <div class="clean-core-container mb-4 d-flex align-items-center justify-content-center">
                    <div id="aiCore" class="clean-core idle">
                        <div class="clean-orb">
                            <i id="aiIcon" class="bi bi-mic-fill text-white fs-1"></i>
                        </div>
                    </div>
                </div>

                <!-- Status -->
                <h4 id="interviewStatus" class="fw-medium text-dark mb-4" style="letter-spacing: -0.5px;">System Ready</h4>

                <!-- Transcript Panel -->
                <div class="transcript-panel bg-white shadow-sm border rounded-4 w-100 p-4 mb-4 mx-auto" style="max-width: 750px; height: 380px;">
                    <div id="transcriptArea" class="d-flex flex-column gap-3 h-100 overflow-auto pe-2 custom-scrollbar">
                        <div class="text-center w-100 mt-auto mb-auto text-secondary small">Start session to begin transcription. Ensure your microphone is allowed.</div>
                    </div>
                </div>

                <!-- Controls -->
                <div class="d-flex gap-3 position-relative z-3 mt-2">
                    <button id="btnStartSession" class="btn btn-primary rounded-pill px-5 py-3 shadow-sm fw-bold fs-5" onclick="startInterviewSession()">
                        <i class="bi bi-play-fill me-2"></i> Initialize Session
                    </button>
                    <button id="btnDoneSpeaking" class="btn btn-dark rounded-pill px-5 py-3 shadow-sm fw-bold fs-5 d-none" onclick="recognition.stop()">
                        <i class="bi bi-check-lg me-2"></i> Finalize Answer
                    </button>
                    <button id="btnEndSession" class="btn btn-outline-danger rounded-pill px-5 py-3 shadow-sm fw-bold fs-5 d-none" onclick="endInterview()">
                        <i class="bi bi-stop-fill me-2"></i> Terminate Session
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- End AI Interview Modal -->
"@

    $newLines = @($lines[0..($beginIdx - 1)]) + $newModal + @($lines[($endIdx + 1)..($lines.Count - 1)])
    Set-Content -Path $filePath -Value $newLines -Encoding utf8
    Write-Output "Successfully updated Modal HTML."
} else {
    Write-Output "Could not find modal block."
}

# Now replace the CSS
$lines = Get-Content -Encoding utf8 $filePath
$beginIdx = -1
$endIdx = -1

for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "<style>") { $beginIdx = $i }
    if ($lines[$i] -match "</style>") { $endIdx = $i }
}

if ($beginIdx -ne -1 -and $endIdx -ne -1) {
    $newCss = @"
<style>
    /* Clean & Minimalistic AI Modal Styles */
    .clean-core-container {
        position: relative;
        width: 120px;
        height: 120px;
    }
    .clean-core {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.5s ease;
    }
    .clean-orb {
        width: 90px;
        height: 90px;
        background: linear-gradient(135deg, #0d6efd, #0dcaf0);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 30px rgba(13, 110, 253, 0.3);
        z-index: 10;
        transition: all 0.3s ease;
    }
    
    /* States */
    .clean-core.idle .clean-orb {
        background: linear-gradient(135deg, #6c757d, #adb5bd);
        box-shadow: 0 10px 30px rgba(108, 117, 125, 0.2);
    }
    .clean-core.listening .clean-orb {
        background: linear-gradient(135deg, #198754, #20c997);
        box-shadow: 0 10px 30px rgba(25, 135, 84, 0.4);
        animation: cleanPulse 2s infinite;
    }
    .clean-core.thinking .clean-orb {
        background: linear-gradient(135deg, #0dcaf0, #0d6efd);
        box-shadow: 0 10px 30px rgba(13, 202, 240, 0.4);
        animation: spinSlow 3s linear infinite;
    }
    .clean-core.speaking .clean-orb {
        background: linear-gradient(135deg, #fd7e14, #ffc107);
        box-shadow: 0 10px 30px rgba(253, 126, 20, 0.4);
        animation: bounceSmall 0.5s alternate infinite ease-in-out;
    }

    @keyframes cleanPulse {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.4); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(25, 135, 84, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
    }
    @keyframes spinSlow {
        100% { transform: rotate(360deg); }
    }
    @keyframes bounceSmall {
        0% { transform: scale(0.95); }
        100% { transform: scale(1.05); }
    }

    .transcript-panel {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
    }
    .chat-bubble {
        max-width: 85%;
        padding: 1rem 1.25rem;
        border-radius: 1rem;
        font-size: 0.95rem;
        line-height: 1.6;
        animation: slideIn 0.3s ease forwards;
        box-shadow: 0 2px 10px rgba(0,0,0,0.03);
    }
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .chat-user {
        align-self: flex-end;
        background: #f8f9fa;
        color: #212529;
        border: 1px solid #e9ecef;
        border-bottom-right-radius: 4px;
    }
    .chat-ai {
        align-self: flex-start;
        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
        color: #166534;
        border: 1px solid #bbf7d0;
        border-bottom-left-radius: 4px;
    }
</style>
"@
    $newLines = @($lines[0..($beginIdx - 1)]) + $newCss + @($lines[($endIdx + 1)..($lines.Count - 1)])
    Set-Content -Path $filePath -Value $newLines -Encoding utf8
    Write-Output "Successfully updated CSS."
} else {
    Write-Output "Could not find style block."
}

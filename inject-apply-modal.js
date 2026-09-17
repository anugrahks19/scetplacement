const fs = require('fs');
const file = 'apps/app-jobfeeds.html';
let content = fs.readFileSync(file, 'utf8');

const applyModalHtml = `
<!-- Apply Processing Modal -->
<div class="modal fade" id="applyProcessingModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true" style="z-index: 1070;">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-body p-4 text-center">
                <div id="applyProcessingSpinner" class="mb-3">
                    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div id="applyProcessingSuccess" class="mb-3 d-none text-success">
                    <i class="bi bi-check-circle-fill" style="font-size: 3rem;"></i>
                </div>
                <h6 id="applyProcessingText" class="fw-bold text-dark mb-0">Fetching resume from File Manager...</h6>
                <p id="applyProcessingSubtext" class="text-secondary small mt-2 mb-0">Please wait while we attach your profile.</p>
            </div>
        </div>
    </div>
</div>
`;

if (!content.includes('id="applyProcessingModal"')) {
    content = content.replace('</body>', applyModalHtml + '\n</body>');
    fs.writeFileSync(file, content);
    console.log('Injected applyProcessingModal');
}

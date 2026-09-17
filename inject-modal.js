const fs = require('fs');
let content = fs.readFileSync('apps/my-applications.html', 'utf8');

const modalHtml = `
<!-- Modal: Application Details -->
<div class="modal fade" id="applicationDetailsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="modal-title fw-bold fs-4">Application Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4">
                <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                    <div id="modalLogo" class="fw-bold rounded-circle d-flex align-items-center justify-content-center fs-3" style="width: 60px; height: 60px;"></div>
                    <div>
                        <h5 id="modalRole" class="fw-bold mb-1"></h5>
                        <p id="modalCompany" class="text-secondary mb-0"></p>
                    </div>
                </div>
                
                <div class="row g-3 mb-4">
                    <div class="col-6">
                        <p class="text-muted small mb-1">Date Applied</p>
                        <p id="modalDate" class="fw-semibold mb-0"></p>
                    </div>
                    <div class="col-6">
                        <p class="text-muted small mb-1">Current Status</p>
                        <span id="modalStatus" class="badge rounded-pill px-3 py-2 border"></span>
                    </div>
                </div>

                <div class="bg-light rounded-4 p-3">
                    <p class="text-muted small mb-2"><i class="bi bi-info-circle me-1"></i> Next Steps</p>
                    <p id="modalNextSteps" class="mb-0 small fw-medium text-dark"></p>
                </div>
            </div>
            <div class="modal-footer border-top-0 pt-0 pb-4 px-4 d-flex justify-content-between">
                <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-outline-danger rounded-pill px-4" id="withdrawBtn">Withdraw Application</button>
            </div>
        </div>
    </div>
</div>
`;

if(!content.includes('id="applicationDetailsModal"')) {
    content = content.replace('</main>', modalHtml + '\n</main>');
    fs.writeFileSync('apps/my-applications.html', content);
    console.log('My Applications modal added successfully');
}

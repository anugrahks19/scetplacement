const fs = require('fs');
let content = fs.readFileSync('apps/app-jobfeeds.html', 'utf8');

// The new detailed modal HTML
const newModalHtml = `
<!-- Job Details Modal -->
<div class="modal fade" id="jobDetailsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-bottom-0 pb-0 pt-4 px-4 bg-light rounded-top-4 position-relative">
                <div class="d-flex align-items-center gap-3 w-100 mb-4 mt-2">
                    <div id="jobModalLogo" class="fw-bold rounded-4 d-flex align-items-center justify-content-center fs-2 bg-white shadow-sm" style="width: 80px; height: 80px;"></div>
                    <div class="flex-grow-1">
                        <h3 id="jobModalRole" class="fw-bold mb-1 text-dark"></h3>
                        <p id="jobModalCompany" class="text-secondary mb-0 fw-medium fs-5"></p>
                    </div>
                    <button type="button" class="btn-close align-self-start position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            </div>
            
            <div class="modal-body p-0">
                <div class="p-4 bg-light border-bottom">
                    <div class="row g-4">
                        <div class="col-sm-3 col-6">
                            <p class="text-muted small mb-1"><i class="bi bi-geo-alt me-1"></i> Location</p>
                            <p id="jobModalLocation" class="fw-bold mb-0 text-dark"></p>
                        </div>
                        <div class="col-sm-3 col-6">
                            <p class="text-muted small mb-1"><i class="bi bi-briefcase me-1"></i> Job Type</p>
                            <p id="jobModalType" class="fw-bold mb-0 text-dark"></p>
                        </div>
                        <div class="col-sm-3 col-6">
                            <p class="text-muted small mb-1"><i class="bi bi-cash me-1"></i> Salary</p>
                            <p id="jobModalSalary" class="fw-bold text-success mb-0"></p>
                        </div>
                        <div class="col-sm-3 col-6">
                            <p class="text-muted small mb-1"><i class="bi bi-clock me-1"></i> Posted</p>
                            <p id="jobModalPosted" class="fw-bold mb-0 text-dark"></p>
                        </div>
                    </div>
                </div>

                <div class="p-4 p-md-5">
                    <h5 class="fw-bold mb-3 text-dark">Role Overview</h5>
                    <p id="jobModalDesc" class="text-secondary mb-4 fs-6" style="line-height: 1.7;"></p>

                    <h5 class="fw-bold mb-3 text-dark">Key Responsibilities</h5>
                    <ul id="jobModalResponsibilities" class="text-secondary mb-4 ms-3" style="line-height: 1.7;"></ul>

                    <h5 class="fw-bold mb-3 text-dark">Requirements</h5>
                    <ul id="jobModalRequirements" class="text-secondary mb-4 ms-3" style="line-height: 1.7;"></ul>
                    
                    <h5 class="fw-bold mb-3 text-dark">Benefits</h5>
                    <ul id="jobModalBenefits" class="text-secondary mb-4 ms-3" style="line-height: 1.7;"></ul>

                    <h5 class="fw-bold mb-3 text-dark">Tech Stack</h5>
                    <div id="jobModalTags" class="d-flex flex-wrap gap-2 mb-2"></div>
                </div>
            </div>
            <div class="modal-footer border-top pt-3 pb-4 px-4 px-md-5 bg-white d-flex justify-content-between sticky-bottom">
                <button class="btn btn-icon btn-light rounded-circle border text-secondary shadow-sm" id="jobModalSaveBtn" style="width: 50px; height: 50px;"><i class="bi bi-bookmark fs-5"></i></button>
                <button type="button" class="btn btn-primary rounded-pill px-5 py-2 fs-5 fw-bold shadow-sm" id="jobModalApplyBtn">Apply Now</button>
            </div>
        </div>
    </div>
</div>
`;

// Replace the old modal block
content = content.replace(/<!-- Job Details Modal -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, newModalHtml.trim());

fs.writeFileSync('apps/app-jobfeeds.html', content);
console.log('Detailed Job Modal injected');

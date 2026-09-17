const fs = require('fs');
let content = fs.readFileSync('apps/app-jobfeeds.html', 'utf8');

const modalHtml = `
<!-- Job Details Modal -->
<div class="modal fade" id="jobDetailsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-bottom-0 pb-0 pt-4 px-4">
                <div class="d-flex align-items-center gap-3 w-100">
                    <div id="jobModalLogo" class="fw-bold rounded-4 d-flex align-items-center justify-content-center fs-3" style="width: 70px; height: 70px;"></div>
                    <div class="flex-grow-1">
                        <h4 id="jobModalRole" class="fw-bold mb-1"></h4>
                        <p id="jobModalCompany" class="text-secondary mb-0 fw-medium"></p>
                    </div>
                    <button type="button" class="btn-close align-self-start" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            </div>
            <div class="modal-body p-4">
                <div class="row g-3 mb-4 bg-light rounded-4 p-3 mx-0 border">
                    <div class="col-sm-4">
                        <p class="text-muted small mb-1"><i class="bi bi-geo-alt me-1"></i> Location</p>
                        <p id="jobModalLocation" class="fw-bold mb-0 text-dark"></p>
                    </div>
                    <div class="col-sm-4 border-start border-end">
                        <p class="text-muted small mb-1"><i class="bi bi-cash me-1"></i> Salary Range</p>
                        <p id="jobModalSalary" class="fw-bold text-success mb-0"></p>
                    </div>
                    <div class="col-sm-4">
                        <p class="text-muted small mb-1"><i class="bi bi-clock me-1"></i> Posted</p>
                        <p id="jobModalPosted" class="fw-bold mb-0 text-dark"></p>
                    </div>
                </div>

                <h6 class="fw-bold mb-3 text-dark">About the Role</h6>
                <p id="jobModalDesc" class="text-secondary mb-4" style="line-height: 1.6;"></p>

                <h6 class="fw-bold mb-3 text-dark">Required Skills</h6>
                <div id="jobModalTags" class="d-flex flex-wrap gap-2 mb-4"></div>
            </div>
            <div class="modal-footer border-top-0 pt-0 pb-4 px-4 d-flex justify-content-between">
                <button class="btn btn-icon btn-light rounded-circle border text-secondary" id="jobModalSaveBtn" style="width: 45px; height: 45px;"><i class="bi bi-bookmark fs-5"></i></button>
                <button type="button" class="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm" id="jobModalApplyBtn">Apply Now</button>
            </div>
        </div>
    </div>
</div>
`;

if(!content.includes('id="jobDetailsModal"')) {
    content = content.replace('</main>', modalHtml + '\n</main>');
    fs.writeFileSync('apps/app-jobfeeds.html', content);
    console.log('Job Details modal added successfully');
}

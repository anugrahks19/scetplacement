const fs = require('fs');

const modalHtml = `
<!-- Custom Confirm Modal -->
<div class="modal fade" id="customConfirmModal" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-body p-4 text-center">
                <div class="text-danger mb-3">
                    <i class="bi bi-exclamation-circle" style="font-size: 3rem;"></i>
                </div>
                <h5 class="fw-bold text-dark mb-3">Are you sure?</h5>
                <p class="text-secondary mb-4">Do you really want to retract this application? This action cannot be undone.</p>
                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-light rounded-pill px-4 fw-medium" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger rounded-pill px-4 fw-bold" id="confirmRetractBtn">Yes, Retract</button>
                </div>
            </div>
        </div>
    </div>
</div>
`;

['apps/app-jobfeeds.html', 'apps/my-applications.html'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('id="customConfirmModal"')) {
        content = content.replace('</body>', modalHtml + '\n</body>');
        fs.writeFileSync(file, content);
        console.log('Injected customConfirmModal into', file);
    }
});

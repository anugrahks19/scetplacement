document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('applicationsTableBody');
    const filterSelect = document.getElementById('statusFilter');

    if(!tableBody) return;

    // Hardcoded initial data
    const defaultApps = [
        {
            id: 'mock1',
            company: 'Nexus Innovations',
            role: 'Frontend React Developer',
            date: 'Sep 15, 2026',
            status: 'Interviewing',
            logoText: 'N',
            logoClass: 'text-primary'
        },
        {
            id: 'mock2',
            company: 'FinTech Solutions',
            role: 'Junior Data Analyst',
            date: 'Sep 12, 2026',
            status: 'In Review',
            logoText: 'F',
            logoClass: 'text-warning'
        },
        {
            id: 'mock3',
            company: 'CyberDefend Corp',
            role: 'Security Analyst Intern',
            date: 'Sep 05, 2026',
            status: 'Rejected',
            logoText: 'C',
            logoClass: 'text-danger'
        }
    ];

    // Read applied jobs from local storage that we saved in Job Feeds
    const localApps = JSON.parse(localStorage.getItem('myApplications')) || [];
    
    // Combine them (local apps first since they are newer)
    const allApps = [...localApps, ...defaultApps];

    function renderApps(filterStatus = 'All Statuses') {
        tableBody.innerHTML = '';
        
        let filteredApps = allApps;
        if(filterStatus !== 'All Statuses') {
            filteredApps = allApps.filter(app => app.status === filterStatus);
        }

        if(filteredApps.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-5 text-muted">No applications found.</td></tr>`;
            return;
        }

        filteredApps.forEach(app => {
            let badgeClass = 'bg-secondary-subtle text-secondary border-secondary';
            if(app.status === 'Interviewing') badgeClass = 'bg-success-subtle text-success border-success';
            if(app.status === 'In Review') badgeClass = 'bg-warning-subtle text-warning border-warning';
            if(app.status === 'Offered') badgeClass = 'bg-primary-subtle text-primary border-primary';

            tableBody.innerHTML += `
                <tr>
                    <td class="px-4 py-3">
                        <div class="d-flex align-items-center gap-3">
                            <div class="${app.logoClass.replace('text-', 'bg-').replace('-subtle','')}-subtle ${app.logoClass} fw-bold rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                ${app.logoText.charAt(0)}
                            </div>
                            <span class="fw-bold text-dark">${app.company}</span>
                        </div>
                    </td>
                    <td class="py-3 text-dark fw-medium">${app.role}</td>
                    <td class="py-3 text-secondary small">${app.date}</td>
                    <td class="py-3">
                        <span class="badge ${badgeClass} border rounded-pill px-3">${app.status}</span>
                    </td>
                    <td class="text-end px-4 py-3">
                        <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="showDetails('${app.id}')">Details</button>
                    </td>
                </tr>
            `;
        });
    }

    window.showDetails = function(appId) {
        const app = allApps.find(a => a.id.toString() === appId.toString());
        if(!app) return;

        // Populate modal data
        document.getElementById('modalLogo').className = `fw-bold rounded-circle d-flex align-items-center justify-content-center fs-3 ${app.logoClass.replace('text-', 'bg-').replace('-subtle','')}-subtle ${app.logoClass}`;
        document.getElementById('modalLogo').innerText = app.logoText.charAt(0);
        document.getElementById('modalRole').innerText = app.role;
        document.getElementById('modalCompany').innerText = app.company;
        document.getElementById('modalDate').innerText = app.date;
        
        const badgeClass = app.status === 'Interviewing' ? 'bg-success-subtle text-success border-success' :
                           app.status === 'In Review' ? 'bg-warning-subtle text-warning border-warning' :
                           app.status === 'Rejected' ? 'bg-secondary-subtle text-secondary border-secondary' :
                           'bg-primary-subtle text-primary border-primary';
                           
        document.getElementById('modalStatus').className = `badge rounded-pill px-3 py-2 border ${badgeClass}`;
        document.getElementById('modalStatus').innerText = app.status;

        // Mock next steps based on status
        let nextSteps = "We are currently reviewing your application and will get back to you soon.";
        if(app.status === 'Interviewing') nextSteps = "Your technical interview is scheduled for next week. Please check your Inbox for the meeting link.";
        if(app.status === 'Rejected') nextSteps = "Unfortunately, we have decided to move forward with other candidates. Thank you for your interest.";
        if(app.status === 'Offered') nextSteps = "Congratulations! Please review the Offer Letters page to accept or decline your offer.";
        
        document.getElementById('modalNextSteps').innerText = nextSteps;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('applicationDetailsModal'));
        modal.show();

        // Handle Withdraw Button
        const withdrawBtn = document.getElementById('withdrawBtn');
        const newWithdrawBtn = withdrawBtn.cloneNode(true);
        withdrawBtn.parentNode.replaceChild(newWithdrawBtn, withdrawBtn);
        
        // Cannot withdraw if rejected or offered
        if (app.status === 'Rejected' || app.status === 'Offered') {
            newWithdrawBtn.innerText = 'Cannot Withdraw';
            newWithdrawBtn.className = 'btn btn-secondary rounded-pill px-4 disabled';
            return;
        }

        newWithdrawBtn.innerText = 'Withdraw Application';
        newWithdrawBtn.className = 'btn btn-outline-danger rounded-pill px-4';

        newWithdrawBtn.addEventListener('click', () => {
            const confirmModal = new bootstrap.Modal(document.getElementById('customConfirmModal'));
            confirmModal.show();
            
            const confirmYesBtn = document.getElementById('confirmRetractBtn');
            const freshConfirmBtn = confirmYesBtn.cloneNode(true);
            confirmYesBtn.parentNode.replaceChild(freshConfirmBtn, confirmYesBtn);
            
            freshConfirmBtn.addEventListener('click', () => {
                let dynamicApps = JSON.parse(localStorage.getItem('myApplications')) || [];
                dynamicApps = dynamicApps.filter(a => a.id.toString() !== appId.toString());
                localStorage.setItem('myApplications', JSON.stringify(dynamicApps));
                
                // Also remove from allApps array so it doesn't render again
                allApps = allApps.filter(a => a.id.toString() !== appId.toString());
                
                confirmModal.hide();
                modal.hide();
                renderApps(filterSelect ? filterSelect.value : 'All');
            });
        });
    };

    if(filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            renderApps(e.target.value);
        });
    }

    renderApps();
});

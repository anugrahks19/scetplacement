
document.addEventListener('DOMContentLoaded', function() {
    const jobs = [
        { id: 1, role: 'Software Engineer', company: 'Google', location: 'Bangalore, India', type: 'Full-time', salary: '₹15L - ₹25L', category: 'Engineering', logo: 'G', color: 'primary', posted: '2 days ago' },
        { id: 2, role: 'Data Analyst', company: 'Amazon', location: 'Hyderabad, India', type: 'Full-time', salary: '₹12L - ₹18L', category: 'Data', logo: 'A', color: 'warning', posted: '3 days ago' },
        { id: 3, role: 'Product Designer', company: 'Microsoft', location: 'Remote', type: 'Contract', salary: '₹10L - ₹15L', category: 'Design', logo: 'M', color: 'success', posted: '1 day ago' },
        { id: 4, role: 'Frontend Developer', company: 'Flipkart', location: 'Bangalore, India', type: 'Full-time', salary: '₹14L - ₹22L', category: 'Engineering', logo: 'F', color: 'info', posted: '5 days ago' },
        { id: 5, role: 'Backend Engineer', company: 'Zomato', location: 'Gurgaon, India', type: 'Full-time', salary: '₹16L - ₹26L', category: 'Engineering', logo: 'Z', color: 'danger', posted: '4 days ago' },
        { id: 6, role: 'Data Scientist', company: 'Swiggy', location: 'Bangalore, India', type: 'Full-time', salary: '₹18L - ₹28L', category: 'Data', logo: 'S', color: 'primary', posted: '1 week ago' },
        { id: 7, role: 'Product Manager', company: 'Cred', location: 'Bangalore, India', type: 'Full-time', salary: '₹20L - ₹30L', category: 'Product', logo: 'C', color: 'dark', posted: '2 weeks ago' },
        { id: 8, role: 'UX Researcher', company: 'Paytm', location: 'Noida, India', type: 'Full-time', salary: '₹12L - ₹16L', category: 'Design', logo: 'P', color: 'secondary', posted: '3 days ago' },
        { id: 9, role: 'Machine Learning Engineer', company: 'Ola', location: 'Bangalore, India', type: 'Full-time', salary: '₹15L - ₹25L', category: 'Engineering', logo: 'O', color: 'success', posted: '2 days ago' },
        { id: 10, role: 'Business Analyst', company: 'MakeMyTrip', location: 'Gurgaon, India', type: 'Full-time', salary: '₹10L - ₹14L', category: 'Data', logo: 'M', color: 'warning', posted: '1 day ago' }
    ];

    const container = document.getElementById('jobsContainer');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    function renderJobs(filterCategory = 'All') {
        if (!container) return;
        container.innerHTML = '';
        const filteredJobs = jobs.filter(job => filterCategory === 'All' || job.category === filterCategory);
        
        if (filteredJobs.length === 0) {
            container.innerHTML = '<div class="text-center p-5 text-muted">No jobs found for this category.</div>';
            return;
        }

        filteredJobs.forEach(job => {
            const card = document.createElement('div');
            card.className = 'card border-0 shadow-sm rounded-4 mb-3';
            card.innerHTML = `
                <div class="card-body p-4">
                    <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="avatar avatar-md rounded-4 bg-${job.color}-subtle text-${job.color} fw-bold d-flex align-items-center justify-content-center fs-4" style="width: 48px; height: 48px;">
                            ${job.logo}
                        </div>
                        <div class="flex-grow-1">
                            <h5 class="fw-bold mb-1">${job.role}</h5>
                            <p class="text-secondary mb-0 small">${job.company} &bull; ${job.location}</p>
                        </div>
                        <div>
                            <button class="btn btn-primary rounded-pill btn-sm px-3 fw-medium" onclick="openJobDetails(${job.id})">Apply</button>
                        </div>
                    </div>
                    <div class="d-flex gap-2 mb-0 flex-wrap">
                        <span class="badge bg-light text-dark border fw-medium px-2 py-1"><i class="bi bi-briefcase me-1"></i>${job.type}</span>
                        <span class="badge bg-light text-dark border fw-medium px-2 py-1"><i class="bi bi-cash-stack me-1"></i>${job.salary}</span>
                        <span class="badge bg-light text-dark border fw-medium px-2 py-1"><i class="bi bi-clock me-1"></i>${job.posted}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderJobs();

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
            filterBtns.forEach(b => b.classList.add('btn-light', 'border'));
            
            e.target.classList.remove('btn-light', 'border');
            e.target.classList.add('active', 'btn-primary');
            
            renderJobs(e.target.dataset.filter);
        });
    });

    window.openJobDetails = function(jobId) {
        const job = jobs.find(j => j.id === jobId);
        if (job) {
            const roleEl = document.getElementById('jobModalRole');
            const compEl = document.getElementById('jobModalCompany');
            const locEl = document.getElementById('jobModalLocation');
            const typeEl = document.getElementById('jobModalType');
            
            if (roleEl) roleEl.textContent = job.role;
            if (compEl) compEl.textContent = job.company;
            if (locEl) locEl.textContent = job.location;
            if (typeEl) typeEl.textContent = job.type;
            
            const logoEl = document.getElementById('jobModalLogo');
            if (logoEl) {
                logoEl.textContent = job.logo;
                logoEl.className = \`fw-bold rounded-4 d-flex align-items-center justify-content-center fs-2 bg-\${job.color}-subtle text-\${job.color} shadow-sm\`;
                logoEl.style.width = '80px';
                logoEl.style.height = '80px';
            }
            
            const modalEl = document.getElementById('jobDetailsModal');
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        }
    };
});


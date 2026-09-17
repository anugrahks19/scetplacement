document.addEventListener('DOMContentLoaded', () => {
    // 1. Mock Database for Alumni
    const mockAlumni = [
        {
            id: 1,
            name: "Rohan Desai",
            role: "Software Development Engineer",
            company: "Amazon",
            gradYear: "Class of 2023",
            img: "1.png",
            skills: ["Java", "AWS", "System Design"],
            isAvailable: true
        },
        {
            id: 2,
            name: "Sneha Patel",
            role: "Data Scientist",
            company: "Microsoft",
            gradYear: "Class of 2022",
            img: "2.png",
            skills: ["Python", "Machine Learning", "Azure"],
            isAvailable: true
        },
        {
            id: 3,
            name: "Karan Shah",
            role: "Product Manager",
            company: "Google",
            gradYear: "Class of 2021",
            img: "3.png",
            skills: ["Agile", "Product Strategy", "UX Design"],
            isAvailable: false
        },
        {
            id: 4,
            name: "Priya Singh",
            role: "Systems Engineer",
            company: "TCS",
            gradYear: "Class of 2024",
            img: "4.png",
            skills: ["C++", "Networking", "Linux"],
            isAvailable: true
        },
        {
            id: 5,
            name: "Amit Kumar",
            role: "Backend Engineer",
            company: "Amazon",
            gradYear: "Class of 2022",
            img: "5.png",
            skills: ["Node.js", "MongoDB", "Microservices"],
            isAvailable: true
        },
        {
            id: 6,
            name: "Neha Gupta",
            role: "Frontend Developer",
            company: "Google",
            gradYear: "Class of 2023",
            img: "6.png",
            skills: ["React", "TypeScript", "TailwindCSS"],
            isAvailable: true
        }
    ];

    const grid = document.getElementById('alumniGrid');

    function renderAlumni(filterCompany = "All Companies", filterRole = "All Roles", searchQuery = "") {
        grid.innerHTML = '';

        const filtered = mockAlumni.filter(a => {
            const matchCompany = filterCompany === "All Companies" || a.company === filterCompany;
            // Simple logic: if filterRole is SDE, it should match 'Software Development Engineer' or 'Backend Engineer'
            let matchRole = true;
            if (filterRole !== "All Roles") {
                if (filterRole === "SDE" && !a.role.includes("Engineer") && !a.role.includes("Developer")) matchRole = false;
                if (filterRole === "Data Scientist" && a.role !== "Data Scientist") matchRole = false;
                if (filterRole === "Product Manager" && a.role !== "Product Manager") matchRole = false;
            }
            const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCompany && matchRole && matchSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-people text-secondary" style="font-size: 3rem;"></i>
                    <h5 class="fw-bold mt-3">No alumni found</h5>
                    <p class="text-secondary">Try adjusting your filters or search query.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(alumni => {
            const col = document.createElement('div');
            col.className = 'col-sm-6 col-md-4 col-xl-3';

            const skillsHtml = alumni.skills.map(s => `<span class="badge bg-body-secondary text-secondary fw-medium rounded-pill px-2 py-1">${s}</span>`).join('');

            col.innerHTML = `
                <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden transform-hover transition-all text-center p-4">
                    <div class="position-relative mx-auto mb-3">
                        <img src="../assets/images/avatar/${alumni.img}" class="rounded-circle shadow-sm" width="90" height="90" style="object-fit: cover;">
                        ${alumni.isAvailable ? '<span class="position-absolute bottom-0 end-0 p-2 bg-success border border-white border-2 rounded-circle" style="transform: translate(-10px, -5px);" data-bs-toggle="tooltip" title="Available for Mentorship"></span>' : '<span class="position-absolute bottom-0 end-0 p-2 bg-secondary border border-white border-2 rounded-circle" style="transform: translate(-10px, -5px);" data-bs-toggle="tooltip" title="Currently Unavailable"></span>'}
                    </div>
                    <h5 class="fw-bold mb-1">${alumni.name}</h5>
                    <div class="text-primary fw-medium small mb-1">${alumni.role}</div>
                    <div class="text-secondary small fw-medium mb-3">@ ${alumni.company} &bull; ${alumni.gradYear}</div>
                    
                    <div class="d-flex flex-wrap justify-content-center gap-1 mb-4">
                        ${skillsHtml}
                    </div>

                    <div class="mt-auto">
                        <button class="btn ${alumni.isAvailable ? 'btn-primary' : 'btn-outline-secondary disabled'} w-100 rounded-pill fw-bold shadow-sm connect-btn" ${!alumni.isAvailable ? 'disabled' : ''}>
                            ${alumni.isAvailable ? 'Connect <i class="bi bi-person-plus ms-1"></i>' : 'Unavailable'}
                        </button>
                    </div>
                </div>
            `;

            if (alumni.isAvailable) {
                const btn = col.querySelector('.connect-btn');
                btn.addEventListener('click', () => {
                    document.getElementById('modalAlumniImg').src = `../assets/images/avatar/${alumni.img}`;
                    document.getElementById('modalAlumniName').innerText = alumni.name;
                    document.getElementById('modalAlumniRole').innerText = `${alumni.role} @ ${alumni.company}`;
                    
                    // Reset modal state
                    document.getElementById('alumniRequestForm').classList.remove('d-none');
                    document.getElementById('requestSuccessState').classList.add('d-none');
                    
                    const modal = new bootstrap.Modal(document.getElementById('alumniActionModal'));
                    modal.show();
                });
            }

            grid.appendChild(col);
        });

        // Initialize tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    }

    // Filter Logic
    const selects = document.querySelectorAll('.form-select');
    const searchInput = document.querySelector('input[type="text"]');

    function applyFilters() {
        const company = selects[0].value;
        const role = selects[1].value;
        const query = searchInput.value;
        renderAlumni(company, role, query);
    }

    selects.forEach(s => s.addEventListener('change', applyFilters));
    searchInput.addEventListener('input', applyFilters);

    // Form Submission Simulation
    const form = document.getElementById('alumniRequestForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('sendRequestBtn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
        btn.disabled = true;
        
        setTimeout(() => {
            form.classList.add('d-none');
            document.getElementById('requestSuccessState').classList.remove('d-none');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1200);
    });

    renderAlumni();
});

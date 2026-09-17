document.addEventListener('DOMContentLoaded', () => {
    const defaultProjects = [
        {
            id: 1,
            title: "AI-Powered Resume Analyzer",
            category: "Machine Learning",
            desc: "An NLP-based tool that parses resumes and ranks them against job descriptions using cosine similarity and BERT embeddings.",
            tech: ["Python", "Flask", "PyTorch"],
            github: "#",
            live: "#",
            bgClass: "bg-primary"
        },
        {
            id: 2,
            title: "E-Commerce Storefront",
            category: "Web App",
            desc: "A full-stack e-commerce platform with a dynamic cart, Stripe payment integration, and an admin dashboard.",
            tech: ["React", "Node.js", "MongoDB"],
            github: "#",
            live: "#",
            bgClass: "bg-info"
        },
        {
            id: 3,
            title: "Fitness Tracker App",
            category: "Mobile App",
            desc: "A cross-platform mobile application to track daily workouts, steps, and calories with interactive charts.",
            tech: ["Flutter", "Firebase", "Dart"],
            github: "#",
            live: "#",
            bgClass: "bg-success"
        }
    ];

    let projects = JSON.parse(localStorage.getItem('studentProjects')) || defaultProjects;

    const container = document.getElementById('projectsContainer');
    const saveBtn = document.getElementById('saveProjectBtn');
    const fileInput = document.getElementById('projCover');
    const coverPreview = document.getElementById('coverPreview');
    let currentCoverImage = null;

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    currentCoverImage = event.target.result;
                    if (coverPreview) {
                        coverPreview.src = currentCoverImage;
                        coverPreview.classList.remove('d-none');
                        document.getElementById('uploadIcon').classList.add('d-none');
                        document.getElementById('uploadText').classList.add('d-none');
                        document.getElementById('uploadSubText').classList.add('d-none');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function renderProjects() {
        if (!container) return;
        container.innerHTML = '';
        
        projects.forEach(p => {
            const badges = p.tech.map(t => `<span class="badge bg-secondary-subtle text-secondary rounded-pill border">${t.trim()}</span>`).join('');
            
            let icon = "bi-briefcase";
            if(p.category.includes("Mobile")) icon = "bi-phone";
            if(p.category.includes("Web")) icon = "bi-globe";
            if(p.category.includes("Machine")) icon = "bi-robot";

            let headerContent = `
                <div class="position-absolute top-0 end-0 m-3 z-3">
                    <button class="btn btn-sm btn-danger rounded-circle shadow-sm" onclick="deleteProject(${p.id})"><i class="bi bi-trash"></i></button>
                </div>
                <div class="position-absolute top-0 start-0 m-3 z-3">
                    <span class="badge bg-white text-dark shadow-sm rounded-pill">${p.category}</span>
                </div>
            `;

            if (p.coverImage) {
                headerContent += `<img src="${p.coverImage}" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt="Cover">`;
            } else {
                headerContent += `<i class="bi ${icon} text-white opacity-50" style="font-size: 5rem;"></i>`;
            }

            container.innerHTML += `
                <div class="col-xl-4 col-md-6">
                    <div class="card h-100 rounded-4 border-0 shadow-sm overflow-hidden project-card transition-all" style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);">
                        <div class="position-relative ${p.bgClass || 'bg-primary'} bg-gradient d-flex align-items-center justify-content-center overflow-hidden" style="height: 180px;">
                            ${headerContent}
                        </div>
                        <div class="card-body p-4 d-flex flex-column">
                            <h5 class="fw-bold mb-2">${p.title}</h5>
                            <p class="text-muted small mb-3 flex-grow-1">${p.desc}</p>
                            
                            <div class="d-flex flex-wrap gap-1 mb-4">
                                ${badges}
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center border-top pt-3">
                                <a href="${p.github}" target="_blank" class="text-decoration-none text-dark fw-bold d-flex align-items-center gap-1"><i class="bi bi-github"></i> Source</a>
                                <a href="${p.live}" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill px-3">View Live</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    window.deleteProject = function(id) {
        if(confirm("Delete this project?")) {
            projects = projects.filter(p => p.id !== id);
            localStorage.setItem('studentProjects', JSON.stringify(projects));
            renderProjects();
        }
    };

    function formatUrl(url) {
        if (!url || url === '#') return '#';
        if (!/^https?:\/\//i.test(url)) {
            return 'https://' + url;
        }
        return url;
    }

    if(saveBtn) {
        saveBtn.addEventListener('click', () => {
            const title = document.getElementById('projTitle').value;
            const cat = document.getElementById('projCat').options[document.getElementById('projCat').selectedIndex].text;
            const desc = document.getElementById('projDesc').value;
            const tech = document.getElementById('projTech').value.split(',');
            let github = document.getElementById('projGit').value;
            let live = document.getElementById('projLive').value;

            if(!title || !desc) return alert('Title and Description are required.');

            github = formatUrl(github);
            live = formatUrl(live);

            const bgClasses = ['bg-primary', 'bg-info', 'bg-success', 'bg-warning', 'bg-danger', 'bg-dark'];
            const randomBg = bgClasses[Math.floor(Math.random() * bgClasses.length)];

            projects.unshift({
                id: Date.now(),
                title,
                category: cat,
                desc,
                tech,
                github,
                live,
                bgClass: randomBg,
                coverImage: currentCoverImage
            });

            localStorage.setItem('studentProjects', JSON.stringify(projects));
            renderProjects();
            
            // Close modal
            document.querySelector('#addProjectModal .btn-close').click();
            document.getElementById('projForm').reset();
            currentCoverImage = null;
            if (coverPreview) {
                coverPreview.src = '';
                coverPreview.classList.add('d-none');
                document.getElementById('uploadIcon').classList.remove('d-none');
                document.getElementById('uploadText').classList.remove('d-none');
                document.getElementById('uploadSubText').classList.remove('d-none');
            }
        });
    }

    renderProjects();
});

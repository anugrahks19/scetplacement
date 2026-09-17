document.addEventListener('DOMContentLoaded', () => {
    // Mock Database
    const mockFiles = [
        { id: 1, name: "Advait_Resume_V1.pdf", type: "pdf", size: "1.2 MB", date: "Sep 10, 2026", folder: "Resumes", icon: "bi-file-earmark-pdf text-danger" },
        { id: 2, name: "Advait_Resume_Tech.pdf", type: "pdf", size: "1.1 MB", date: "Sep 15, 2026", folder: "Resumes", icon: "bi-file-earmark-pdf text-danger" },
        { id: 3, name: "Advait_Resume_Draft.docx", type: "word", size: "800 KB", date: "Sep 01, 2026", folder: "Resumes", icon: "bi-file-earmark-word text-primary" },
        { id: 4, name: "Sem_6_Marksheet.pdf", type: "pdf", size: "2.5 MB", date: "Aug 15, 2026", folder: "Marksheets", icon: "bi-file-earmark-pdf text-danger" },
        { id: 5, name: "Sem_5_Marksheet.pdf", type: "pdf", size: "2.1 MB", date: "Jan 10, 2026", folder: "Marksheets", icon: "bi-file-earmark-pdf text-danger" },
        { id: 6, name: "AWS_Cloud_Practitioner.pdf", type: "pdf", size: "1.8 MB", date: "Jul 20, 2026", folder: "Certificates", icon: "bi-file-earmark-pdf text-danger" },
        { id: 7, name: "Coursera_React.png", type: "image", size: "3.2 MB", date: "Jun 05, 2026", folder: "Certificates", icon: "bi-file-earmark-image text-success" },
        { id: 8, name: "Aadhar_Card.pdf", type: "pdf", size: "500 KB", date: "Jan 01, 2026", folder: "ID Proofs", icon: "bi-file-earmark-pdf text-danger" },
        { id: 9, name: "College_ID.jpg", type: "image", size: "1.1 MB", date: "Aug 01, 2024", folder: "ID Proofs", icon: "bi-file-earmark-image text-success" }
    ];

    let currentFolder = null;
    let viewMode = 'grid'; // 'grid' or 'list'

    const filesGrid = document.getElementById('filesGrid');
    const listTitle = document.getElementById('fileListTitle');

    function renderFiles() {
        filesGrid.innerHTML = '';
        const filtered = currentFolder ? mockFiles.filter(f => f.folder === currentFolder) : mockFiles.slice(0, 8);
        listTitle.innerText = currentFolder ? `${currentFolder} Files` : 'Recent Files';

        if (filtered.length === 0) {
            filesGrid.innerHTML = `
                <div class="col-12 text-center py-5 text-secondary">
                    <i class="bi bi-folder2-open" style="font-size: 3rem;"></i>
                    <p class="mt-3 mb-0">This folder is empty.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(file => {
            const el = document.createElement('div');
            
            if (viewMode === 'grid') {
                el.className = 'col-sm-6 col-md-4 col-xl-3';
                el.innerHTML = `
                    <div class="card border-0 shadow-sm rounded-4 h-100 transform-hover transition-all cursor-pointer p-4 bg-white text-center file-card">
                        <i class="bi ${file.icon} mb-3" style="font-size: 3rem;"></i>
                        <h6 class="fw-bold mb-1 text-truncate w-100" title="${file.name}">${file.name}</h6>
                        <p class="text-secondary small mb-3">${file.size} &bull; ${file.date}</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-sm btn-light rounded-circle shadow-sm" data-bs-toggle="tooltip" title="View"><i class="bi bi-eye"></i></button>
                            <button class="btn btn-sm btn-light rounded-circle shadow-sm" data-bs-toggle="tooltip" title="Download"><i class="bi bi-download"></i></button>
                            <button class="btn btn-sm btn-light rounded-circle shadow-sm text-danger" data-bs-toggle="tooltip" title="Delete"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                `;
            } else {
                el.className = 'col-12';
                el.innerHTML = `
                    <div class="card border-0 shadow-sm rounded-4 transform-hover transition-all cursor-pointer p-3 bg-white file-card d-flex flex-row align-items-center">
                        <i class="bi ${file.icon} fs-2 me-3"></i>
                        <div class="flex-fill min-w-0">
                            <h6 class="fw-bold mb-0 text-truncate">${file.name}</h6>
                            <p class="text-secondary small mb-0">${file.folder}</p>
                        </div>
                        <div class="text-secondary small me-4 d-none d-md-block">${file.size}</div>
                        <div class="text-secondary small me-4 d-none d-lg-block">${file.date}</div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-light rounded-circle shadow-sm"><i class="bi bi-eye"></i></button>
                            <button class="btn btn-sm btn-light rounded-circle shadow-sm"><i class="bi bi-download"></i></button>
                        </div>
                    </div>
                `;
            }

            // View action
            const viewBtns = el.querySelectorAll('.btn-light');
            viewBtns[0].addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('fileViewerIcon').className = `bi ${file.icon}`;
                document.getElementById('fileViewerName').innerText = file.name;
                document.getElementById('fileViewerMeta').innerText = `${file.size} • Uploaded on ${file.date}`;
                const modal = new bootstrap.Modal(document.getElementById('fileViewerModal'));
                modal.show();
            });

            filesGrid.appendChild(el);
        });

        // Initialize tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }

    // Folder Click Logic
    const folders = document.querySelectorAll('.folder-card');
    folders.forEach(folder => {
        folder.addEventListener('click', () => {
            const folderName = folder.getAttribute('data-folder');
            
            // Toggle selection
            if (currentFolder === folderName) {
                currentFolder = null; // deselect
                folder.classList.remove('border', 'border-primary', 'border-2');
            } else {
                currentFolder = folderName;
                folders.forEach(f => f.classList.remove('border', 'border-primary', 'border-2'));
                folder.classList.add('border', 'border-primary', 'border-2');
            }
            
            renderFiles();
        });
    });

    // View Toggle
    const btnGrid = document.getElementById('btnGrid');
    const btnList = document.getElementById('btnList');

    btnGrid.addEventListener('click', () => {
        viewMode = 'grid';
        btnGrid.classList.add('active');
        btnList.classList.remove('active');
        renderFiles();
    });

    btnList.addEventListener('click', () => {
        viewMode = 'list';
        btnList.classList.add('active');
        btnGrid.classList.remove('active');
        renderFiles();
    });

    // Upload Simulation
    document.getElementById('uploadBtn').addEventListener('click', function() {
        const ogHtml = this.innerHTML;
        this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Uploading...';
        this.disabled = true;
        
        setTimeout(() => {
            this.innerHTML = '<i class="bi bi-check-lg me-2"></i>Uploaded';
            this.classList.remove('btn-light', 'text-primary');
            this.classList.add('btn-success', 'text-white');
            
            // Simulate adding a file
            mockFiles.unshift({
                id: Date.now(),
                name: "New_Document.pdf",
                type: "pdf",
                size: "450 KB",
                date: "Just now",
                folder: currentFolder || "Resumes",
                icon: "bi-file-earmark-pdf text-danger"
            });
            renderFiles();
            
            setTimeout(() => {
                this.innerHTML = ogHtml;
                this.disabled = false;
                this.classList.add('btn-light', 'text-primary');
                this.classList.remove('btn-success', 'text-white');
            }, 2000);
        }, 1500);
    });

    renderFiles();
});

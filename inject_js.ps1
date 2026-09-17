$fileJs = @"
        <input type="file" id="hiddenFileInput" class="d-none" multiple>
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                const uploadBtn = document.querySelector('button .bi-cloud-arrow-up').parentElement;
                const fileInput = document.getElementById('hiddenFileInput');
                const searchInput = document.querySelector('input[placeholder="Search files..."]');
                const fileGrid = document.querySelector('.row-cols-2');
                const navLinks = document.querySelectorAll('.custom-nav-pills .nav-link');
                
                uploadBtn.addEventListener('click', () => fileInput.click());
                fileInput.addEventListener('change', (e) => {
                    const files = Array.from(e.target.files);
                    files.forEach(file => {
                        const icon = file.type.includes('image') ? 'bi-file-earmark-image-fill text-info' :
                                     file.name.endsWith('.pdf') ? 'bi-file-earmark-pdf-fill text-danger' : 
                                     'bi-file-earmark-word-fill text-primary';
                        const size = (file.size / 1024 / 1024).toFixed(2) + ' MB';
                        const newCard = document.createElement('div');
                        newCard.className = 'col file-item';
                        newCard.setAttribute('data-category', file.type.includes('image') ? 'Portfolios' : (file.name.endsWith('.pdf') ? 'Resumes' : 'Transcripts'));
                        newCard.innerHTML = `<div class="card border h-100 rounded-4 file-card hover-lift"><div class="card-body p-3 text-center position-relative"><div class="dropdown position-absolute top-0 end-0 mt-2 me-2"><button class="btn btn-sm btn-link text-secondary p-0" data-bs-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></button><ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3"><li><a class="dropdown-item download-btn" href="#"><i class="bi bi-download me-2"></i>Download</a></li><li><a class="dropdown-item share-btn" href="#"><i class="bi bi-share me-2"></i>Share</a></li><li><hr class="dropdown-divider"></li><li><a class="dropdown-item text-danger delete-btn" href="#"><i class="bi bi-trash me-2"></i>Delete</a></li></ul></div><i class="bi ` + icon + `" style="font-size: 3rem;"></i><h6 class="fw-bold mt-3 mb-1 text-truncate file-name" title="` + file.name + `">` + file.name + `</h6><p class="text-secondary small mb-0">` + size + `</p></div></div>`;
                        fileGrid.prepend(newCard);
                    });
                    fileInput.value = '';
                    updateStorage();
                });
                
                fileGrid.addEventListener('click', (e) => {
                    if (e.target.closest('.delete-btn')) {
                        e.preventDefault();
                        if (confirm('Are you sure you want to delete this file?')) {
                            e.target.closest('.col').remove();
                            updateStorage();
                        }
                    }
                    if (e.target.closest('.download-btn')) {
                        e.preventDefault();
                        alert('Downloading file...');
                    }
                    if (e.target.closest('.share-btn')) {
                        e.preventDefault();
                        alert('Share link copied to clipboard!');
                    }
                });
                
                searchInput.addEventListener('input', (e) => {
                    const term = e.target.value.toLowerCase();
                    document.querySelectorAll('.file-item').forEach(col => {
                        const name = col.querySelector('.file-name').innerText.toLowerCase();
                        col.style.display = name.includes(term) ? '' : 'none';
                    });
                });
                
                navLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        navLinks.forEach(l => { l.classList.remove('active', 'fw-bold'); l.classList.add('text-dark'); });
                        link.classList.add('active', 'fw-bold');
                        link.classList.remove('text-dark');
                        const category = link.innerText.trim();
                        document.querySelectorAll('.file-item').forEach(col => {
                            col.style.display = (category === 'All Files' || col.getAttribute('data-category') === category) ? '' : 'none';
                        });
                    });
                });
                
                document.querySelectorAll('.col .file-name').forEach(el => {
                    const col = el.closest('.col');
                    col.classList.add('file-item');
                    const name = el.innerText;
                    if (name.includes('Resume')) col.setAttribute('data-category', 'Resumes');
                    else if (name.includes('Proof') || name.includes('Portfolio')) col.setAttribute('data-category', 'Portfolios');
                    else col.setAttribute('data-category', 'Transcripts');
                });
                
                function updateStorage() {
                    const count = document.querySelectorAll('.file-item').length;
                    const used = 45 + ((count - 4) * 2);
                    document.querySelector('.progress-bar').style.width = Math.min(used, 100) + '%';
                    document.querySelector('.progress-bar').parentElement.nextElementSibling.innerText = Math.min(used, 100) + ' MB / 100 MB Used';
                }
            });
        </script>
</main>
"@

$jobJs = @"
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                const searchInput = document.querySelector('input[placeholder="Search roles or companies..."]');
                searchInput.addEventListener('input', (e) => {
                    const term = e.target.value.toLowerCase();
                    document.querySelectorAll('.job-card').forEach(card => {
                        const text = card.innerText.toLowerCase();
                        card.style.display = text.includes(term) ? '' : 'none';
                    });
                });
                
                document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const icon = btn.querySelector('i');
                        if(icon.classList.contains('bi-bookmark')) {
                            icon.classList.replace('bi-bookmark', 'bi-bookmark-fill');
                            btn.classList.add('text-primary');
                        } else {
                            icon.classList.replace('bi-bookmark-fill', 'bi-bookmark');
                            btn.classList.remove('text-primary');
                        }
                    });
                });
                
                document.querySelectorAll('.btn-primary').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        btn.innerText = 'Applied';
                        btn.classList.replace('btn-primary', 'btn-success');
                        btn.disabled = true;
                        alert('Application submitted successfully!');
                    });
                });
            });
        </script>
</main>
"@

$appJs = @"
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                const filter = document.querySelector('select');
                filter.addEventListener('change', (e) => {
                    const status = e.target.value;
                    document.querySelectorAll('tbody tr').forEach(row => {
                        const rowStatus = row.querySelector('.badge').innerText.trim();
                        if (status === 'All Statuses' || rowStatus === status) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                });
                
                document.querySelectorAll('.btn').forEach(btn => {
                    if (btn.innerText === 'Details') {
                        btn.addEventListener('click', () => alert('Loading application details timeline...'));
                    } else if (btn.innerText === 'Accept Offer') {
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            btn.innerText = 'Offer Accepted!';
                            btn.classList.replace('btn-primary', 'btn-success');
                            btn.disabled = true;
                        });
                    }
                });
            });
        </script>
</main>
"@

$certJs = @"
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('button').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (btn.innerText.includes('Add')) {
                            alert('Opening external certification verification portal...');
                        } else if (btn.querySelector('.bi-download')) {
                            alert('Downloading PDF certificate...');
                        } else if (btn.innerText === 'View') {
                            alert('Verifying credential signature with issuer...');
                        } else if (btn.innerText === 'Continue Course') {
                            alert('Redirecting to CompTIA learning portal...');
                        }
                    });
                });
            });
        </script>
</main>
"@

$f = Get-Content "c:\Antigravity\scet_placement\apps\app-filemanager.html" -Raw -Encoding utf8
$f = $f -replace '</main>', $fileJs
Set-Content "c:\Antigravity\scet_placement\apps\app-filemanager.html" $f -Encoding utf8

$j = Get-Content "c:\Antigravity\scet_placement\apps\app-jobfeeds.html" -Raw -Encoding utf8
$j = $j -replace '</main>', $jobJs
Set-Content "c:\Antigravity\scet_placement\apps\app-jobfeeds.html" $j -Encoding utf8

$a = Get-Content "c:\Antigravity\scet_placement\apps\my-applications.html" -Raw -Encoding utf8
$a = $a -replace '</main>', $appJs
Set-Content "c:\Antigravity\scet_placement\apps\my-applications.html" $a -Encoding utf8

$c = Get-Content "c:\Antigravity\scet_placement\pages\certifications.html" -Raw -Encoding utf8
$c = $c -replace '</main>', $certJs
Set-Content "c:\Antigravity\scet_placement\pages\certifications.html" $c -Encoding utf8

Write-Output "Scripts injected."

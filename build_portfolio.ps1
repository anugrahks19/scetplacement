$filePath = "c:\Antigravity\scet_placement\pages\portfolio.html"
$lines = Get-Content -Encoding utf8 $filePath
$beginIdx = -1
$endIdx = -1
for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "<!-- begin::Content -->") { $beginIdx = $i }
    if ($lines[$i] -match "<!-- begin::Footer -->") { $endIdx = $i; break }
}

if ($beginIdx -ne -1 -and $endIdx -ne -1) {
    $newContent = @"
        <!-- begin::Content -->
        <main class="content-wrapper p-lg-4 p-3" style="min-height: 70vh;">
            
            <!-- Page Header -->
            <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                    <h2 class="fw-bold mb-1">My Projects</h2>
                    <p class="text-muted mb-0">Showcase your best work to recruiters.</p>
                </div>
                <button class="btn btn-primary btn-ripple rounded-pill px-4 shadow-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addProjectModal">
                    <i class="bi bi-plus-lg"></i> Add New Project
                </button>
            </div>

            <!-- Projects Grid -->
            <div class="row g-4">
                
                <!-- Project Card 1 -->
                <div class="col-xl-4 col-md-6">
                    <div class="card h-100 rounded-4 border-0 shadow-sm overflow-hidden project-card transition-all" style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);">
                        <div class="position-relative bg-primary bg-gradient d-flex align-items-center justify-content-center" style="height: 180px;">
                            <i class="bi bi-robot text-white opacity-50" style="font-size: 5rem;"></i>
                            <div class="position-absolute top-0 end-0 m-3">
                                <span class="badge bg-white text-primary rounded-pill">Machine Learning</span>
                            </div>
                        </div>
                        <div class="card-body p-4 d-flex flex-column">
                            <h5 class="fw-bold mb-2">AI-Powered Resume Analyzer</h5>
                            <p class="text-muted small mb-3 flex-grow-1">An NLP-based tool that parses resumes and ranks them against job descriptions using cosine similarity and BERT embeddings.</p>
                            
                            <div class="d-flex flex-wrap gap-1 mb-4">
                                <span class="badge bg-secondary-subtle text-secondary rounded-pill border">Python</span>
                                <span class="badge bg-secondary-subtle text-secondary rounded-pill border">Flask</span>
                                <span class="badge bg-secondary-subtle text-secondary rounded-pill border">PyTorch</span>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center border-top pt-3">
                                <a href="#" class="text-decoration-none text-dark fw-bold d-flex align-items-center gap-1"><i class="bi bi-github"></i> Source</a>
                                <a href="#" class="btn btn-sm btn-outline-primary rounded-pill px-3">View Live</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project Card 2 -->
                <div class="col-xl-4 col-md-6">
                    <div class="card h-100 rounded-4 border-0 shadow-sm overflow-hidden project-card transition-all" style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);">
                        <div class="position-relative bg-info bg-gradient d-flex align-items-center justify-content-center" style="height: 180px;">
                            <i class="bi bi-cart3 text-white opacity-50" style="font-size: 5rem;"></i>
                            <div class="position-absolute top-0 end-0 m-3">
                                <span class="badge bg-white text-info rounded-pill">Web App</span>
                            </div>
                        </div>
                        <div class="card-body p-4 d-flex flex-column">
                            <h5 class="fw-bold mb-2">E-Commerce Storefront</h5>
                            <p class="text-muted small mb-3 flex-grow-1">A full-stack e-commerce platform with a dynamic cart, Stripe payment integration, and an admin dashboard.</p>
                            
                            <div class="d-flex flex-wrap gap-1 mb-4">
                                <span class="badge bg-secondary-subtle text-secondary rounded-pill border">React</span>
                                <span class="badge bg-secondary-subtle text-secondary rounded-pill border">Node.js</span>
                                <span class="badge bg-secondary-subtle text-secondary rounded-pill border">MongoDB</span>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center border-top pt-3">
                                <a href="#" class="text-decoration-none text-dark fw-bold d-flex align-items-center gap-1"><i class="bi bi-github"></i> Source</a>
                                <a href="#" class="btn btn-sm btn-outline-info rounded-pill px-3">View Live</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project Card 3 -->
                <div class="col-xl-4 col-md-6">
                    <div class="card h-100 rounded-4 border-0 shadow-sm overflow-hidden project-card transition-all" style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);">
                        <div class="position-relative bg-success bg-gradient d-flex align-items-center justify-content-center" style="height: 180px;">
                            <i class="bi bi-phone text-white opacity-50" style="font-size: 5rem;"></i>
                            <div class="position-absolute top-0 end-0 m-3">
                                <span class="badge bg-white text-success rounded-pill">Mobile App</span>
                            </div>
                        </div>
                        <div class="card-body p-4 d-flex flex-column">
                            <h5 class="fw-bold mb-2">Fitness Tracker App</h5>
                            <p class="text-muted small mb-3 flex-grow-1">A cross-platform mobile application to track daily workouts, steps, and calories with interactive charts.</p>
                            
                            <div class="d-flex flex-wrap gap-1 mb-4">
                                <span class="badge bg-secondary-subtle text-secondary rounded-pill border">Flutter</span>
                                <span class="badge bg-secondary-subtle text-secondary rounded-pill border">Firebase</span>
                                <span class="badge bg-secondary-subtle text-secondary rounded-pill border">Dart</span>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center border-top pt-3">
                                <a href="#" class="text-decoration-none text-dark fw-bold d-flex align-items-center gap-1"><i class="bi bi-github"></i> Source</a>
                                <a href="#" class="btn btn-sm btn-outline-success rounded-pill px-3">View Live</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </main>

        <!-- Add Project Modal -->
        <div class="modal fade" id="addProjectModal" tabindex="-1" aria-labelledby="addProjectModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content rounded-4 border-0 shadow">
                    <div class="modal-header border-bottom-0 pb-0">
                        <h5 class="modal-title fw-bold fs-4" id="addProjectModalLabel">Add New Project</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form>
                            <div class="mb-4 text-center">
                                <div class="border border-dashed rounded-4 p-5 bg-body-tertiary cursor-pointer transition-all hover-bg-secondary-subtle">
                                    <i class="bi bi-cloud-arrow-up fs-1 text-primary"></i>
                                    <h6 class="mt-2 mb-1">Upload Project Cover</h6>
                                    <p class="text-muted small mb-0">Drag & drop or click to browse</p>
                                </div>
                            </div>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Project Title</label>
                                    <input type="text" class="form-control px-3 py-2" placeholder="e.g. E-Commerce Storefront">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Category</label>
                                    <select class="form-select px-3 py-2">
                                        <option selected>Select Category</option>
                                        <option value="1">Web App</option>
                                        <option value="2">Mobile App</option>
                                        <option value="3">Machine Learning</option>
                                        <option value="4">Data Science</option>
                                        <option value="5">Hardware/IoT</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-semibold">Description</label>
                                    <textarea class="form-control px-3 py-2" rows="3" placeholder="Briefly describe what your project does..."></textarea>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-semibold">Tech Stack</label>
                                    <input type="text" class="form-control px-3 py-2" placeholder="e.g. React, Node.js, MongoDB (comma separated)">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">GitHub Repository URL</label>
                                    <input type="url" class="form-control px-3 py-2" placeholder="https://github.com/...">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Live Demo URL</label>
                                    <input type="url" class="form-control px-3 py-2" placeholder="https://...">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pt-0 pb-4 px-4 d-flex justify-content-between">
                        <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary btn-ripple rounded-pill px-4 shadow-sm">Save Project</button>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .project-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
            }
            .hover-bg-secondary-subtle:hover {
                background-color: var(--bs-secondary-bg-subtle) !important;
            }
            .border-dashed {
                border-style: dashed !important;
                border-width: 2px !important;
            }
            .cursor-pointer {
                cursor: pointer;
            }
            .transition-all {
                transition: all 0.3s ease;
            }
        </style>
"@
    $newLines = @($lines[0..($beginIdx - 1)]) + $newContent + @($lines[$endIdx..($lines.Count - 1)])
    Set-Content -Path $filePath -Value $newLines -Encoding utf8
    Write-Output "Successfully updated portfolio showcase."
} else {
    Write-Output "Could not find begin/end blocks"
}

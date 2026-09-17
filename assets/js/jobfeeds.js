document.addEventListener('DOMContentLoaded', () => {
    const jobsContainer = document.getElementById('jobsContainer');
    const searchInput = document.querySelector('input[placeholder="Search roles or companies..."]');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (!jobsContainer) return;

    const jobDatabase = [
        {
            id: 1,
            role: "Software Engineer (Frontend)",
            company: "Global Tech Corp",
            location: "Remote",
            logo: "G",
            logoClass: "bg-primary-subtle text-primary",
            category: "Engineering",
            type: "Full-Time",
            tags: ["React", "TypeScript", "3-5 Yrs"],
            salary: "$120k - $150k",
            posted: "2 days ago",
            desc: "Join our core product team to build scalable frontend architectures for our enterprise clients. You will be responsible for architecting resilient web components and migrating legacy codebases to modern React standards.",
            responsibilities: [
                "Develop and maintain scalable React applications.",
                "Collaborate with UX designers to implement pixel-perfect UIs.",
                "Optimize application for maximum speed and scalability.",
                "Participate in code reviews and architectural discussions."
            ],
            requirements: [
                "3+ years of professional frontend development experience.",
                "Deep understanding of React.js and its core principles.",
                "Strong proficiency in TypeScript, HTML5, and CSS3.",
                "Experience with modern frontend build pipelines and tools."
            ],
            benefits: [
                "Competitive salary and equity package.",
                "Fully remote work environment with flexible hours.",
                "Comprehensive health, dental, and vision insurance.",
                "$1,000 annual home office stipend."
            ]
        },
        {
            id: 2,
            role: "Product Designer",
            company: "Creative Studio",
            location: "New York, NY",
            logo: "C",
            logoClass: "bg-danger-subtle text-danger",
            category: "Design",
            type: "Hybrid",
            tags: ["Figma", "UI/UX", "Prototyping"],
            salary: "$90k - $120k",
            posted: "5 days ago",
            desc: "We are looking for a creative visionary to lead the redesign of our flagship consumer mobile application. You will own the end-to-end design process from wireframing to high-fidelity prototypes.",
            responsibilities: [
                "Create user-centered designs by understanding business requirements.",
                "Build wireframes, storyboards, user flows, and process flows.",
                "Design UI elements such as navigation menus, search fields, and tabs.",
                "Present and defend design decisions to executive leadership."
            ],
            requirements: [
                "A strong portfolio demonstrating UI/UX design skills.",
                "Expertise in standard UX software such as Figma, Sketch, or InVision.",
                "Solid understanding of user-centered design and testing methodologies.",
                "Basic understanding of HTML/CSS is a plus."
            ],
            benefits: [
                "Hybrid work schedule (2 days in-office).",
                "Unlimited Paid Time Off (PTO).",
                "Annual learning and development budget.",
                "Catered lunches on office days."
            ]
        },
        {
            id: 3,
            role: "Data Analyst Intern",
            company: "DataMinds Inc",
            location: "San Francisco, CA",
            logo: "D",
            logoClass: "bg-success-subtle text-success",
            category: "Data",
            type: "Internship",
            tags: ["SQL", "Tableau", "On-site"],
            salary: "$40/hr",
            posted: "1 week ago",
            desc: "Summer internship program focused on extracting actionable insights from large consumer datasets. You will work directly with our senior data scientists on real-world predictive modeling projects.",
            responsibilities: [
                "Assist in data collection, cleaning, and preprocessing.",
                "Build interactive Tableau dashboards for executive reporting.",
                "Perform ad-hoc SQL queries to answer business questions.",
                "Present findings to the analytics team."
            ],
            requirements: [
                "Currently pursuing a degree in Statistics, Computer Science, or related field.",
                "Familiarity with SQL and relational databases.",
                "Basic understanding of data visualization tools (Tableau, PowerBI).",
                "Strong analytical and problem-solving skills."
            ],
            benefits: [
                "Housing stipend for the duration of the internship.",
                "Mentorship program with senior leaders.",
                "Potential for a full-time return offer.",
                "Free gym membership."
            ]
        },
        {
            id: 4,
            role: "Backend Node.js Developer",
            company: "FinTech Solutions",
            location: "Remote",
            logo: "F",
            logoClass: "bg-warning-subtle text-warning",
            category: "Engineering",
            type: "Contract",
            tags: ["Node.js", "MongoDB", "AWS"],
            salary: "$130k - $160k",
            posted: "12 hours ago",
            desc: "Help us build the next generation of secure, high-throughput financial transaction microservices. You will be working on highly concurrent systems handling millions of daily requests.",
            responsibilities: [
                "Design and implement scalable RESTful APIs.",
                "Integrate third-party financial and payment gateways.",
                "Optimize database queries for high performance.",
                "Implement robust security and data protection measures."
            ],
            requirements: [
                "4+ years of backend development using Node.js.",
                "Extensive experience with MongoDB and aggregate frameworks.",
                "Experience deploying applications to AWS (EC2, Lambda, S3).",
                "Understanding of financial compliance (PCI-DSS) is a major plus."
            ],
            benefits: [
                "100% Remote flexibility.",
                "Contract-to-hire opportunity.",
                "Performance-based quarterly bonuses.",
                "MacBook Pro provided."
            ]
        },
        {
            id: 5,
            role: "Product Manager",
            company: "Nexus Innovations",
            location: "Austin, TX",
            logo: "N",
            logoClass: "bg-info-subtle text-info",
            category: "Product",
            type: "Full-Time",
            tags: ["Agile", "Jira", "B2B"],
            salary: "$140k - $170k",
            posted: "3 days ago",
            desc: "Lead cross-functional teams to deliver enterprise software solutions on time and under budget. You will serve as the bridge between engineering, design, and business stakeholders.",
            responsibilities: [
                "Define product vision, strategy, and roadmap.",
                "Gather and prioritize product and customer requirements.",
                "Work closely with engineering to deliver winning products.",
                "Run beta and pilot programs with early-stage products."
            ],
            requirements: [
                "3+ years of software product management experience.",
                "Proven track record of managing all aspects of a successful product.",
                "Strong technical background with understanding of web development.",
                "Excellent written and verbal communication skills."
            ],
            benefits: [
                "Comprehensive medical, dental, and vision coverage.",
                "401(k) matching up to 5%.",
                "Relocation assistance available.",
                "Generous parental leave."
            ]
        },
        {
            id: 6,
            role: "Machine Learning Engineer",
            company: "AI Dynamics",
            location: "Remote",
            logo: "A",
            logoClass: "bg-dark-subtle text-dark",
            category: "Data",
            type: "Full-Time",
            tags: ["Python", "TensorFlow", "NLP"],
            salary: "$150k - $190k",
            posted: "1 day ago",
            desc: "Develop and deploy large language models for automated customer service integrations. You will be at the cutting edge of applied AI, optimizing inference speeds and fine-tuning open-source models.",
            responsibilities: [
                "Design and train machine learning models for NLP tasks.",
                "Deploy ML models to production environments via APIs.",
                "Evaluate model performance and iterate on architectures.",
                "Stay current with the latest advancements in generative AI."
            ],
            requirements: [
                "MS or PhD in Computer Science, AI, or related field.",
                "Strong programming skills in Python.",
                "Hands-on experience with PyTorch or TensorFlow.",
                "Experience working with HuggingFace transformers."
            ],
            benefits: [
                "Top-tier compensation and equity.",
                "Compute budget for personal research projects.",
                "Fully remote.",
                "Unlimited PTO."
            ]
        },
        {
            id: 7,
            role: "UX Researcher",
            company: "Creative Studio",
            location: "New York, NY",
            logo: "C",
            logoClass: "bg-danger-subtle text-danger",
            category: "Design",
            type: "Part-Time",
            tags: ["User Testing", "Interviews"],
            salary: "$100k - $130k (Prorated)",
            posted: "2 weeks ago",
            desc: "Conduct user interviews and A/B testing to inform our design strategy and product roadmap. You will be the voice of the user in all major product decisions.",
            responsibilities: [
                "Plan and conduct qualitative and quantitative user research.",
                "Analyze user feedback and activity data.",
                "Present actionable insights to stakeholders.",
                "Help build a centralized research repository."
            ],
            requirements: [
                "2+ years of experience in applied product research.",
                "Familiarity with research tools (UserTesting, Maze, Qualtrics).",
                "Ability to translate data into actionable product recommendations.",
                "Degree in HCI, Psychology, or related field."
            ],
            benefits: [
                "Flexible hours.",
                "Remote-first work environment.",
                "Stipend for professional development.",
                "Paid sick leave."
            ]
        },
        {
            id: 8,
            role: "DevOps Engineer",
            company: "Global Tech Corp",
            location: "Seattle, WA",
            logo: "G",
            logoClass: "bg-primary-subtle text-primary",
            category: "Engineering",
            type: "Full-Time",
            tags: ["Docker", "Kubernetes", "CI/CD"],
            salary: "$140k - $180k",
            posted: "4 days ago",
            desc: "Maintain and optimize our cloud infrastructure ensuring 99.99% uptime. You will build automation pipelines and lead the migration toward a fully containerized microservice architecture.",
            responsibilities: [
                "Manage cloud infrastructure on AWS.",
                "Build and maintain CI/CD pipelines.",
                "Monitor system performance and troubleshoot bottlenecks.",
                "Implement Infrastructure as Code using Terraform."
            ],
            requirements: [
                "Solid experience with Linux systems administration.",
                "Proficiency in Docker and Kubernetes.",
                "Experience with CI/CD tools (Jenkins, GitHub Actions).",
                "Strong scripting skills (Bash, Python)."
            ],
            benefits: [
                "Competitive salary and signing bonus.",
                "Comprehensive healthcare.",
                "401(k) matching.",
                "Seattle transit pass."
            ]
        }
    ];

    let appliedJobs = JSON.parse(localStorage.getItem('myApplications')) || [];
    let retractedJobs = JSON.parse(localStorage.getItem('retractedJobs')) || [];

    function renderJobs(filterCategory = 'All', searchTerm = '') {
        jobsContainer.innerHTML = '';
        
        let filteredJobs = jobDatabase.filter(job => {
            const matchesCategory = filterCategory === 'All' || job.category === filterCategory;
            const matchesSearch = job.role.toLowerCase().includes(searchTerm) || job.company.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });

        if(filteredJobs.length === 0) {
            jobsContainer.innerHTML = `<div class="text-center py-5 text-muted"><i class="bi bi-search fs-1"></i><p class="mt-3">No jobs found matching your criteria.</p></div>`;
            return;
        }

        filteredJobs.forEach(job => {
            const isApplied = appliedJobs.some(app => app.role === job.role && app.company === job.company);
            const isRetracted = retractedJobs.some(app => app.role === job.role && app.company === job.company);

            const tagsHtml = job.tags.map(t => `<span class="badge bg-body-secondary text-secondary border-0 rounded-pill px-3 py-2 fw-medium">${t}</span>`).join('');

            const card = document.createElement('div');
            card.className = "card border-0 shadow-sm rounded-4 mb-3 job-card transition-all cursor-pointer";
            card.style.background = "linear-gradient(to right, #ffffff, #fcfcfc)";
            
            // Hover effects
            card.addEventListener('mouseenter', () => card.style.transform = "translateY(-3px)");
            card.addEventListener('mouseleave', () => card.style.transform = "translateY(0)");

            card.innerHTML = `
                <div class="card-body p-4">
                    <div class="row align-items-center">
                        <div class="col-auto">
                            <div class="company-logo ${job.logoClass} rounded-4 d-flex align-items-center justify-content-center fw-bold fs-4" style="width: 65px; height: 65px; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);">
                                ${job.logo}
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 class="fw-bold mb-1 text-dark" style="font-family: 'Inter', sans-serif;">${job.role}</h5>
                                    <p class="text-secondary small fw-medium mb-2">${job.company} &bull; ${job.location}</p>
                                </div>
                                <div class="d-flex align-items-center gap-2">
                                    <button class="btn btn-icon btn-light rounded-circle border-0 text-secondary save-btn" style="width: 40px; height: 40px;"><i class="bi bi-bookmark fs-6"></i></button>
                                </div>
                            </div>
                            
                            <div class="d-flex align-items-center gap-4 mt-2">
                                <span class="text-success fw-semibold small"><i class="bi bi-cash me-1"></i> ${job.salary}</span>
                                <span class="text-muted small"><i class="bi bi-clock me-1"></i> ${job.posted}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Open Modal on Card Click
            card.addEventListener('click', (e) => {
                try {
                    if (e.target.closest('.save-btn')) return; // Ignore if clicking save
                    
                    // Populate Modal
                    document.getElementById('jobModalLogo').className = `fw-bold rounded-4 d-flex align-items-center justify-content-center fs-2 bg-white shadow-sm ${job.logoClass.split(' ')[1]}`;
                    document.getElementById('jobModalLogo').innerText = job.logo;
                    document.getElementById('jobModalRole').innerText = job.role;
                    document.getElementById('jobModalCompany').innerText = job.company;
                    
                    document.getElementById('jobModalLocation').innerText = job.location;
                    document.getElementById('jobModalType').innerText = job.type;
                    document.getElementById('jobModalSalary').innerText = job.salary;
                    document.getElementById('jobModalPosted').innerText = job.posted;
                    
                    document.getElementById('jobModalDesc').innerText = job.desc;
                    document.getElementById('jobModalTags').innerHTML = tagsHtml;

                    // Populate Lists
                    document.getElementById('jobModalResponsibilities').innerHTML = job.responsibilities.map(r => `<li class="mb-2">${r}</li>`).join('');
                    document.getElementById('jobModalRequirements').innerHTML = job.requirements.map(r => `<li class="mb-2">${r}</li>`).join('');
                    document.getElementById('jobModalBenefits').innerHTML = job.benefits.map(b => `<li class="mb-2">${b}</li>`).join('');

                    // We use a function to cleanly set the button state and its single listener
                    function setApplyButtonState(applied, retracted) {
                        // Fetch the current button from DOM so we don't reference a detached node
                        const currentBtn = document.getElementById('jobModalApplyBtn');
                        // Clone to wipe all previous listeners
                        const newBtn = currentBtn.cloneNode(true);
                        currentBtn.parentNode.replaceChild(newBtn, currentBtn);

                        if (retracted) {
                            newBtn.innerHTML = '<del>Apply Now</del> <span class="ms-1 fs-6">(Retracted)</span>';
                            newBtn.className = 'btn btn-secondary rounded-pill px-4 py-2 fw-bold shadow-sm disabled text-white-50';
                            return;
                        }

                        // Check deadline
                        // For mock purposes, jobs with IDs 2 and 4 have passed their deadlines.
                        const isClosed = (job.id === 2 || job.id === 4);
                        
                        if (isClosed) {
                            newBtn.innerText = applied ? 'Cannot Retract (Closed)' : 'Applications Closed';
                            newBtn.className = 'btn btn-secondary rounded-pill px-5 py-2 fw-bold shadow-sm disabled';
                            return; // No listeners attached
                        }
                        
                        if (applied) {
                            newBtn.innerText = 'Retract Application';
                            newBtn.className = 'btn btn-outline-danger rounded-pill px-5 py-2 fw-bold shadow-sm';
                            
                            newBtn.addEventListener('click', () => {
                                const confirmModal = new bootstrap.Modal(document.getElementById('customConfirmModal'));
                                confirmModal.show();

                                const confirmYesBtn = document.getElementById('confirmRetractBtn');
                                
                                // Wipe previous listener on confirm button
                                const freshConfirmBtn = confirmYesBtn.cloneNode(true);
                                confirmYesBtn.parentNode.replaceChild(freshConfirmBtn, confirmYesBtn);

                                freshConfirmBtn.addEventListener('click', () => {
                                    appliedJobs = appliedJobs.filter(app => !(app.role === job.role && app.company === job.company));
                                    localStorage.setItem('myApplications', JSON.stringify(appliedJobs));
                                    
                                    retractedJobs.push({ role: job.role, company: job.company });
                                    localStorage.setItem('retractedJobs', JSON.stringify(retractedJobs));

                                    confirmModal.hide();
                                    setApplyButtonState(false, true);
                                    renderJobs(filterCategory, searchTerm);
                                });
                            });
                        } else {
                            newBtn.innerText = 'Apply Now';
                            newBtn.className = 'btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm';
                            
                            newBtn.addEventListener('click', () => {
                                // Show Animated Processing Modal
                                const processModalEl = document.getElementById('applyProcessingModal');
                                const processModal = new bootstrap.Modal(processModalEl);
                                
                                // Reset state
                                document.getElementById('applyProcessingSpinner').classList.remove('d-none');
                                document.getElementById('applyProcessingSuccess').classList.add('d-none');
                                document.getElementById('applyProcessingText').innerText = 'Fetching resume from File Manager...';
                                document.getElementById('applyProcessingSubtext').innerText = 'Please wait while we securely attach your profile.';
                                
                                processModal.show();

                                // Simulate 2s fetch time
                                setTimeout(() => {
                                    document.getElementById('applyProcessingSpinner').classList.add('d-none');
                                    document.getElementById('applyProcessingSuccess').classList.remove('d-none');
                                    document.getElementById('applyProcessingText').innerText = 'Resume Attached & Submitted!';
                                    document.getElementById('applyProcessingSubtext').innerText = 'Your application has been received successfully.';
                                    
                                    // Apply Logic
                                    const newApp = {
                                        id: Date.now(),
                                        role: job.role,
                                        company: job.company,
                                        location: job.location,
                                        logoText: job.logo,
                                        logoClass: job.logoClass.split(' ')[1],
                                        date: new Date().toLocaleDateString(),
                                        status: 'In Review'
                                    };
                                    
                                    appliedJobs.unshift(newApp);
                                    localStorage.setItem('myApplications', JSON.stringify(appliedJobs));
                                    
                                    setTimeout(() => {
                                        processModal.hide();
                                        setApplyButtonState(true, false);
                                        
                                        const tempBtn = document.getElementById('jobModalApplyBtn');
                                        tempBtn.innerText = 'Applied Successfully!';
                                        tempBtn.className = 'btn btn-success text-white rounded-pill px-5 py-2 fw-bold shadow-sm disabled';
                                        setTimeout(() => setApplyButtonState(true, false), 2000);
                                        
                                        renderJobs(filterCategory, searchTerm);
                                    }, 1500);
                                }, 2000);
                            });
                        }
                    }
                    
                    // Initialize the button state for the currently opened job
                    setApplyButtonState(isApplied, isRetracted);

                    // Handle Modal Save Button
                    const modalSaveBtn = document.getElementById('jobModalSaveBtn');
                    const cardSaveIcon = card.querySelector('.save-btn i');
                    const isSaved = cardSaveIcon.classList.contains('bi-bookmark-fill');
                    
                    if (isSaved) {
                        modalSaveBtn.querySelector('i').className = 'bi bi-bookmark-fill fs-5 text-primary';
                    } else {
                        modalSaveBtn.querySelector('i').className = 'bi bi-bookmark fs-5';
                    }

                    const jobModal = new bootstrap.Modal(document.getElementById('jobDetailsModal'));
                    jobModal.show();
                } catch (err) {
                    alert('Error on click: ' + err.message + '\n' + err.stack);
                }
            });

            // Save Button Logic
            const saveBtn = card.querySelector('.save-btn');
            saveBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Don't open modal
                const icon = saveBtn.querySelector('i');
                if(icon.classList.contains('bi-bookmark')) {
                    icon.classList.replace('bi-bookmark', 'bi-bookmark-fill');
                    saveBtn.classList.add('text-primary');
                } else {
                    icon.classList.replace('bi-bookmark-fill', 'bi-bookmark');
                    saveBtn.classList.remove('text-primary');
                }
            });

            jobsContainer.appendChild(card);
        });
    }

    // Filter Listeners
    let currentCategory = 'All';
    let currentSearch = '';

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.replace('btn-primary', 'btn-light'));
            filterBtns.forEach(b => b.classList.add('border'));
            
            btn.classList.replace('btn-light', 'btn-primary');
            btn.classList.remove('border');
            
            currentCategory = btn.getAttribute('data-filter');
            renderJobs(currentCategory, currentSearch);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            renderJobs(currentCategory, currentSearch);
        });
    }

    // Initial render
    renderJobs();
});

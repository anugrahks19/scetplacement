document.addEventListener('DOMContentLoaded', () => {
    // 1. Mock Database for Events
    const mockEvents = [
        {
            id: 1,
            title: "TCS Ninja Campus Drive",
            type: "Drive",
            company: "Tata Consultancy Services",
            date: "Sep 28, 2026",
            time: "09:00 AM - 05:00 PM",
            venue: "Main Auditorium, SCET",
            desc: "TCS is conducting its annual Ninja Campus Drive for the 2027 batch. The selection process includes an online aptitude test followed by technical and HR interviews. Please bring 2 copies of your resume.",
            agenda: [
                "09:00 AM: Pre-Placement Talk",
                "10:30 AM: Online Aptitude Test",
                "02:00 PM: Technical Interviews (Shortlisted Candidates)"
            ],
            iconClass: "bi bi-briefcase text-primary",
            colorClass: "primary"
        },
        {
            id: 2,
            title: "Amazon SDE Intern PPT",
            type: "PPT",
            company: "Amazon India",
            date: "Oct 05, 2026",
            time: "11:00 AM - 12:30 PM",
            venue: "Virtual (Zoom)",
            desc: "Join Amazon's University Recruiting team for an exclusive Pre-Placement Talk regarding their Summer Internship Program for SDE roles. Learn about their culture, leadership principles, and interview process.",
            agenda: [
                "11:00 AM: Introduction to Amazon Culture",
                "11:30 AM: SDE Role & Expectations",
                "12:00 PM: Live Q&A with Alumni"
            ],
            iconClass: "bi bi-box-seam text-warning",
            colorClass: "warning"
        },
        {
            id: 3,
            title: "Mastering System Design",
            type: "Workshop",
            company: "Placement Cell x Tech Club",
            date: "Oct 12, 2026",
            time: "02:00 PM - 05:00 PM",
            venue: "Lab 4, Computer Science Block",
            desc: "A hands-on workshop on System Design principles tailored for product-based company interviews. We will cover horizontal vs vertical scaling, load balancers, caching strategies, and database sharding.",
            agenda: [
                "02:00 PM: Basics of Scalability",
                "03:00 PM: Deep Dive: Caching & DBs",
                "04:00 PM: Mock System Design (TinyURL)"
            ],
            iconClass: "bi bi-diagram-3 text-info",
            colorClass: "info"
        },
        {
            id: 4,
            title: "Infosys HackWithInfy 2026",
            type: "Hackathon",
            company: "Infosys",
            date: "Nov 01, 2026",
            time: "Starts at 10:00 AM",
            venue: "Online Platform",
            desc: "HackWithInfy is a nationwide coding competition for engineering students. Top performers receive pre-placement interview (PPI) opportunities for Power Programmer and System Engineer Specialist roles.",
            agenda: [
                "Round 1: Online Coding Assessment",
                "Round 2: Grand Finale (Top 100)"
            ],
            iconClass: "bi bi-code-slash text-danger",
            colorClass: "danger"
        }
    ];

    let rsvpEvents = JSON.parse(localStorage.getItem('rsvpEvents')) || [];
    let currentFilter = 'All';

    // 2. Render Function
    const container = document.getElementById('eventsContainer');

    function renderEvents(filter) {
        container.innerHTML = '';
        const filtered = filter === 'All' ? mockEvents : mockEvents.filter(e => e.type === filter);

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-calendar-x text-secondary" style="font-size: 3rem;"></i>
                    <h5 class="fw-bold mt-3">No events found</h5>
                    <p class="text-secondary">There are no upcoming ${filter !== 'All' ? filter : ''} events scheduled at this time.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(event => {
            const isRSVP = rsvpEvents.includes(event.id);

            const card = document.createElement('div');
            card.className = "card border-0 shadow-sm rounded-4 overflow-hidden transition-all cursor-pointer event-card";
            card.innerHTML = `
                <div class="card-body p-0 d-flex flex-column flex-md-row align-items-md-center">
                    <!-- Date Box -->
                    <div class="bg-${event.colorClass}-subtle d-flex flex-column align-items-center justify-content-center p-4" style="min-width: 140px;">
                        <div class="fs-6 fw-bold text-${event.colorClass} text-uppercase tracking-wide">${event.date.split(',')[0].split(' ')[0]}</div>
                        <div class="display-5 fw-bold text-${event.colorClass}">${event.date.split(',')[0].split(' ')[1]}</div>
                    </div>
                    
                    <!-- Content -->
                    <div class="p-4 flex-fill">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-body-secondary text-secondary fw-medium rounded-pill px-3">${event.type}</span>
                            ${isRSVP ? '<span class="badge bg-success-subtle text-success fw-medium rounded-pill px-3"><i class="bi bi-check-circle me-1"></i> RSVP Confirmed</span>' : ''}
                        </div>
                        <h5 class="fw-bold mb-1 text-dark">${event.title}</h5>
                        <div class="text-secondary fw-medium mb-3">${event.company}</div>
                        
                        <div class="d-flex flex-wrap gap-3">
                            <div class="d-flex align-items-center gap-2 text-secondary small">
                                <i class="bi bi-clock"></i> ${event.time}
                            </div>
                            <div class="d-flex align-items-center gap-2 text-secondary small">
                                <i class="bi bi-geo-alt"></i> ${event.venue}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Action -->
                    <div class="p-4 d-flex justify-content-end align-items-center">
                        <button class="btn btn-icon btn-light rounded-circle" style="width: 45px; height: 45px;"><i class="bi bi-chevron-right fs-5"></i></button>
                    </div>
                </div>
            `;

            // Hover effect via CSS classes instead of inline style
            card.addEventListener('mouseenter', () => card.classList.add('shadow-md', 'transform-hover'));
            card.addEventListener('mouseleave', () => card.classList.remove('shadow-md', 'transform-hover'));

            // Click listener
            card.addEventListener('click', () => {
                // Populate Modal
                document.getElementById('eventModalIcon').className = `d-flex align-items-center justify-content-center rounded-3 bg-white shadow-sm text-${event.colorClass}`;
                document.getElementById('eventModalIcon').innerHTML = `<i class="${event.iconClass}"></i>`;
                document.getElementById('eventModalBg').className = `w-100 h-100 position-absolute top-0 start-0 bg-${event.colorClass} opacity-10`;
                
                document.getElementById('eventModalTitle').innerText = event.title;
                document.getElementById('eventModalCompany').innerText = event.company;
                document.getElementById('eventModalDesc').innerText = event.desc;
                document.getElementById('eventModalAgenda').innerHTML = event.agenda.map(a => `<li>${a}</li>`).join('');
                
                document.getElementById('eventModalDate').innerText = event.date;
                document.getElementById('eventModalTime').innerText = event.time;
                document.getElementById('eventModalVenue').innerText = event.venue;

                // Handle RSVP Button State
                const rsvpBtn = document.getElementById('eventRSVPBtn');
                const freshBtn = rsvpBtn.cloneNode(true);
                rsvpBtn.parentNode.replaceChild(freshBtn, rsvpBtn);
                
                if (rsvpEvents.includes(event.id)) {
                    freshBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i> RSVP Confirmed';
                    freshBtn.className = 'btn btn-success rounded-pill px-4 fw-bold shadow-sm';
                    
                    freshBtn.addEventListener('click', () => {
                        // Cancel RSVP
                        rsvpEvents = rsvpEvents.filter(id => id !== event.id);
                        localStorage.setItem('rsvpEvents', JSON.stringify(rsvpEvents));
                        
                        freshBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Canceling...';
                        setTimeout(() => {
                            modal.hide();
                            renderEvents(currentFilter);
                        }, 500);
                    });
                } else {
                    freshBtn.innerHTML = 'RSVP Now';
                    freshBtn.className = `btn btn-${event.colorClass} rounded-pill px-5 fw-bold shadow-sm`;
                    
                    freshBtn.addEventListener('click', () => {
                        // Confirm RSVP
                        rsvpEvents.push(event.id);
                        localStorage.setItem('rsvpEvents', JSON.stringify(rsvpEvents));
                        
                        freshBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Confirming...';
                        freshBtn.disabled = true;
                        
                        setTimeout(() => {
                            freshBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i> Success!';
                            freshBtn.className = 'btn btn-success rounded-pill px-5 fw-bold shadow-sm disabled';
                            
                            setTimeout(() => {
                                modal.hide();
                                renderEvents(currentFilter);
                            }, 1000);
                        }, 1000);
                    });
                }

                const modal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
                modal.show();
            });

            container.appendChild(card);
        });
    }

    // 3. Filter Navigation
    const filterBtns = document.querySelectorAll('#eventFilters .nav-link');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => {
                b.classList.remove('active', 'text-primary');
                b.classList.add('text-secondary');
            });
            const target = e.target;
            target.classList.add('active', 'text-primary');
            target.classList.remove('text-secondary');
            
            currentFilter = target.getAttribute('data-filter');
            renderEvents(currentFilter);
        });
    });

    // Initial Render
    renderEvents('All');
});

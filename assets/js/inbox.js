document.addEventListener('DOMContentLoaded', () => {
    // 1. Mock Database for Inbox
    const mockEmails = [
        {
            id: 1,
            folder: "inbox",
            label: "TPO",
            sender: "Prof. Sharma (TPO Head)",
            subject: "URGENT: Resume Submission Deadline for Microsoft",
            date: "Today, 10:30 AM",
            snippet: "This is to inform all eligible students that the deadline to submit resumes for Microsoft's upcoming drive is...",
            body: "<p>Dear Students,</p><p>This is to inform all eligible students that the deadline to submit resumes for Microsoft's upcoming campus drive is <strong>tomorrow at 5:00 PM</strong>.</p><p>Please ensure your resume follows the standard SCET format and is uploaded to the File Manager. Late submissions will strictly not be entertained.</p><p>Best regards,<br>Prof. Sharma<br>Head of Training and Placement</p>",
            isRead: false,
            starred: false,
            avatarBg: "danger"
        },
        {
            id: 2,
            folder: "inbox",
            label: "Interviews",
            sender: "TCS Recruitment Team",
            subject: "Interview Link: TCS Digital Role",
            date: "Yesterday, 04:15 PM",
            snippet: "Congratulations! You have been shortlisted for the technical interview round for the TCS Digital profile. Please find your link...",
            body: "<p>Hello Candidate,</p><p>Congratulations! You have been shortlisted for the technical interview round for the TCS Digital profile based on your performance in the online assessment.</p><p>Your interview is scheduled for <strong>Sep 25, 2026 at 11:00 AM</strong>.</p><p>Interview Link: <a href='#'>Join Microsoft Teams Meeting</a></p><p>Please join 10 minutes early and ensure you have a stable internet connection.</p><p>Regards,<br>TCS Campus Team</p>",
            isRead: true,
            starred: true,
            avatarBg: "primary"
        },
        {
            id: 3,
            folder: "inbox",
            label: "Company",
            sender: "Placement Cell",
            subject: "Pre-Placement Talk: Amazon India",
            date: "Sep 15, 2026",
            snippet: "Amazon India will be conducting a Pre-Placement Talk on Oct 05. All interested candidates must RSVP...",
            body: "<p>Dear Students,</p><p>Amazon India will be conducting a Pre-Placement Talk for their Summer Internship Program on Oct 05.</p><p>All interested candidates must RSVP via the Events page on the portal. Attendance is mandatory for those who wish to apply.</p><p>Thanks,<br>Placement Cell</p>",
            isRead: true,
            starred: false,
            avatarBg: "warning"
        },
        {
            id: 4,
            folder: "sent",
            label: "",
            sender: "Me",
            subject: "Query regarding TCS Ninja Eligibility",
            date: "Sep 10, 2026",
            snippet: "Respected Sir, I have a doubt regarding the CGPA cutoff for the TCS Ninja profile. My current CGPA is...",
            body: "<p>Respected Sir,</p><p>I have a doubt regarding the CGPA cutoff for the TCS Ninja profile. My current CGPA is 7.2, and the required cutoff is 7.5, but I have a pending re-evaluation result.</p><p>Am I eligible to register?</p><p>Thanks,<br>Advait Patel</p>",
            isRead: true,
            starred: false,
            avatarBg: "secondary"
        }
    ];

    let currentFolder = 'inbox';
    let currentLabel = null;

    const container = document.getElementById('emailListContainer');
    const folderTitle = document.getElementById('currentFolderTitle');
    const messageCount = document.getElementById('messageCount');

    // 2. Render Function
    function renderEmails() {
        container.innerHTML = '';
        
        let filtered = mockEmails;
        if (currentLabel) {
            filtered = mockEmails.filter(e => e.label === currentLabel);
        } else {
            if (currentFolder === 'starred') {
                filtered = mockEmails.filter(e => e.starred);
            } else {
                filtered = mockEmails.filter(e => e.folder === currentFolder);
            }
        }

        messageCount.innerText = `${filtered.length} Messages`;

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="h-100 d-flex flex-column align-items-center justify-content-center text-secondary py-5">
                    <i class="bi bi-inbox fs-1 mb-3"></i>
                    <h5>No messages here</h5>
                    <p class="small">Your ${currentLabel || currentFolder} is empty.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(email => {
            const el = document.createElement('div');
            el.className = `p-3 border-bottom email-item cursor-pointer transition-all ${!email.isRead ? 'bg-primary-subtle bg-opacity-25' : 'bg-white'}`;
            
            // Avatar letter
            const letter = email.sender.charAt(0).toUpperCase();
            
            // Label Badge
            let labelBadge = '';
            if (email.label === 'TPO') labelBadge = '<span class="badge bg-danger-subtle text-danger rounded-pill px-2 py-1 ms-2" style="font-size: 0.65rem;">TPO</span>';
            if (email.label === 'Company') labelBadge = '<span class="badge bg-primary-subtle text-primary rounded-pill px-2 py-1 ms-2" style="font-size: 0.65rem;">COMPANY</span>';
            if (email.label === 'Interviews') labelBadge = '<span class="badge bg-warning-subtle text-warning rounded-pill px-2 py-1 ms-2" style="font-size: 0.65rem;">INTERVIEW</span>';

            el.innerHTML = `
                <div class="d-flex align-items-start gap-3">
                    <div class="d-flex flex-column gap-2 align-items-center mt-1">
                        <div class="rounded-circle bg-${email.avatarBg} text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 40px; height: 40px; font-size: 1.1rem;">
                            ${letter}
                        </div>
                        <i class="bi bi-star${email.starred ? '-fill text-warning' : ' text-secondary'}"></i>
                    </div>
                    <div class="flex-fill min-w-0">
                        <div class="d-flex align-items-center justify-content-between mb-1">
                            <div class="d-flex align-items-center">
                                <h6 class="mb-0 text-truncate ${!email.isRead ? 'fw-bold text-dark' : 'text-secondary fw-medium'}" style="max-width: 200px;">${email.sender}</h6>
                                ${labelBadge}
                            </div>
                            <span class="small ${!email.isRead ? 'fw-bold text-primary' : 'text-secondary'}">${email.date}</span>
                        </div>
                        <h6 class="mb-1 text-truncate ${!email.isRead ? 'fw-bold text-dark' : 'text-dark'}" style="max-width: 100%;">${email.subject}</h6>
                        <p class="mb-0 text-secondary small text-truncate" style="max-width: 100%;">${email.snippet}</p>
                    </div>
                </div>
            `;

            // Hover effects
            el.addEventListener('mouseenter', () => el.classList.add('bg-light'));
            el.addEventListener('mouseleave', () => el.classList.remove('bg-light'));

            // Click listener
            el.addEventListener('click', () => {
                email.isRead = true;
                renderEmails(); // Re-render to remove unread state
                
                // Populate Modal
                document.getElementById('readSubject').innerText = email.subject;
                document.getElementById('readSender').innerText = email.sender;
                document.getElementById('readEmail').innerText = "to me, placements@scet.ac.in";
                document.getElementById('readDate').innerText = email.date;
                document.getElementById('readBody').innerHTML = email.body;
                
                const avatarEl = document.getElementById('readAvatar');
                avatarEl.className = `rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-5 shadow-sm bg-${email.avatarBg}`;
                avatarEl.innerText = letter;

                const readModal = new bootstrap.Modal(document.getElementById('emailReadModal'));
                readModal.show();
            });

            container.appendChild(el);
        });
    }

    // 3. Navigation Logic
    const folderLinks = document.querySelectorAll('#inboxFolders .nav-link');
    folderLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            folderLinks.forEach(l => {
                l.classList.remove('text-primary', 'bg-primary-subtle');
                l.classList.add('text-secondary');
            });
            link.classList.add('text-primary', 'bg-primary-subtle');
            link.classList.remove('text-secondary');

            // Handle data attributes
            if (link.hasAttribute('data-folder')) {
                currentFolder = link.getAttribute('data-folder');
                currentLabel = null;
                folderTitle.innerText = link.innerText.trim();
            } else if (link.hasAttribute('data-label')) {
                currentLabel = link.getAttribute('data-label');
                folderTitle.innerText = `${link.innerText.trim()}`;
            }

            renderEmails();
        });
    });

    // Initial render
    renderEmails();
});

const forumPosts = [
    // --- INTERVIEW EXPERIENCES (10) ---
    {
        id: 1,
        title: "Google L3 Interview Experience (Selected)",
        category: "Interview Experiences",
        badgeClass: "bg-success-subtle text-success",
        snippet: "Hey everyone, I recently cleared the Google L3 software engineering interview in Bangalore. Here is a detailed breakdown of all the rounds including the system design...",
        authorInitials: "AR", authorBg: "bg-primary-subtle text-primary", authorName: "Aarav Reddy",
        time: "2 hours ago", replies: 34, upvotes: 142
    },
    {
        id: 2,
        title: "Amazon SDE Intern Interview (Rejected) - My Mistakes",
        category: "Interview Experiences",
        badgeClass: "bg-success-subtle text-success",
        snippet: "I made it to the final round but unfortunately got rejected. I wanted to share my experience and point out the mistakes I made in the Leadership Principles round so you don't repeat them.",
        authorInitials: "AP", authorBg: "bg-danger-subtle text-danger", authorName: "Ananya Patel",
        time: "3 days ago", replies: 62, upvotes: 188
    },
    {
        id: 3,
        title: "Microsoft SWE New Grad (Offer) - Off-Campus",
        category: "Interview Experiences",
        badgeClass: "bg-success-subtle text-success",
        snippet: "Applied through a referral in August. Went through 1 OA and 3 virtual onsite rounds. The focus was heavily on Trees and Graphs.",
        authorInitials: "KS", authorBg: "bg-info-subtle text-info", authorName: "Karan Singh",
        time: "1 week ago", replies: 45, upvotes: 210
    },
    {
        id: 4,
        title: "Atlassian P6 Frontend Interview Experience",
        category: "Interview Experiences",
        badgeClass: "bg-success-subtle text-success",
        snippet: "Machine coding round was intense. Had to build a mini Trello clone in 90 minutes using plain React without external libraries. Here's how I approached it.",
        authorInitials: "RV", authorBg: "bg-warning-subtle text-warning", authorName: "Riya Verma",
        time: "2 weeks ago", replies: 28, upvotes: 95
    },
    {
        id: 5,
        title: "Goldman Sachs Analyst - Quant Role (Selected)",
        category: "Interview Experiences",
        badgeClass: "bg-success-subtle text-success",
        snippet: "Math heavy! The math assessment was brutal (Probability and Stats). The interviews focused on brain teasers and dynamic programming.",
        authorInitials: "MK", authorBg: "bg-secondary-subtle text-secondary", authorName: "Manish Kumar",
        time: "1 month ago", replies: 12, upvotes: 77
    },
    {
        id: 6,
        title: "TCS Digital / Ninja Interview (Off-Campus)",
        category: "Interview Experiences",
        badgeClass: "bg-success-subtle text-success",
        snippet: "Very standard questions. Mostly OOPs concepts, DBMS queries, and HR questions. Detailed transcript of my technical interview inside.",
        authorInitials: "PJ", authorBg: "bg-primary-subtle text-primary", authorName: "Pooja Joshi",
        time: "3 days ago", replies: 105, upvotes: 134
    },
    {
        id: 7,
        title: "Netflix Senior UI Engineer - Rejected at team match",
        category: "Interview Experiences",
        badgeClass: "bg-success-subtle text-success",
        snippet: "Passed the technical screens (lots of focus on core JS and architecture), but failed the culture fit / team matching stage. Sharing my thoughts.",
        authorInitials: "TG", authorBg: "bg-dark text-white", authorName: "Tarun Gupta",
        time: "5 hours ago", replies: 18, upvotes: 66
    },
    {
        id: 8,
        title: "Stripe Backend Engineer - The API Integration Round",
        category: "Interview Experiences",
        badgeClass: "bg-success-subtle text-success",
        snippet: "Stripe's interview process is so unique. Instead of Leetcode, I had to fix bugs in a large existing codebase and integrate a real API.",
        authorInitials: "LM", authorBg: "bg-danger-subtle text-danger", authorName: "Leena Menon",
        time: "4 days ago", replies: 55, upvotes: 302
    },
    {
        id: 9,
        title: "Uber SDE-2 Interview Experience (Offer)",
        category: "Interview Experiences",
        badgeClass: "bg-success-subtle text-success",
        snippet: "Heavy system design round. We designed a location-tracking system similar to Uber's driver tracking. Detailed system design notes attached.",
        authorInitials: "SR", authorBg: "bg-info-subtle text-info", authorName: "Sanjay Rao",
        time: "2 weeks ago", replies: 89, upvotes: 412
    },
    {
        id: 10,
        title: "Infosys Power Programmer Interview",
        category: "Interview Experiences",
        badgeClass: "bg-success-subtle text-success",
        snippet: "Cleared the hackwithinfy coding round. The interview was mostly focused on my projects, cloud computing basics, and a medium DP problem.",
        authorInitials: "AK", authorBg: "bg-warning-subtle text-warning", authorName: "Amit Kumar",
        time: "1 day ago", replies: 22, upvotes: 58
    },

    // --- CODING CHALLENGES (10) ---
    {
        id: 11,
        title: "How to optimize this React component? (UseMemo vs UseCallback)",
        category: "Coding Challenges",
        badgeClass: "bg-info-subtle text-info",
        snippet: "I'm building a dashboard and I have a large list rendering. I tried wrapping it in useMemo but it's still lagging on re-renders. Can someone look at this snippet?",
        authorInitials: "NS", authorBg: "bg-warning-subtle text-warning", authorName: "Neha Sharma",
        time: "5 hours ago", replies: 12, upvotes: 85
    },
    {
        id: 12,
        title: "Dynamic Programming: Top-Down vs Bottom-Up?",
        category: "Coding Challenges",
        badgeClass: "bg-info-subtle text-info",
        snippet: "I always struggle deciding between memoization and tabulation during interviews. Does the interviewer care which one I use as long as the time complexity is the same?",
        authorInitials: "MD", authorBg: "bg-success-subtle text-success", authorName: "Mohammad Danish",
        time: "2 days ago", replies: 14, upvotes: 34
    },
    {
        id: 13,
        title: "Struggling with Graph Algorithms (Dijkstra vs Bellman Ford)",
        category: "Coding Challenges",
        badgeClass: "bg-info-subtle text-info",
        snippet: "Can someone give a simple real-world analogy to remember when to use which shortest path algorithm?",
        authorInitials: "RJ", authorBg: "bg-primary-subtle text-primary", authorName: "Rohan Joshi",
        time: "1 hour ago", replies: 8, upvotes: 45
    },
    {
        id: 14,
        title: "LeetCode 42: Trapping Rain Water - Best approach?",
        category: "Coding Challenges",
        badgeClass: "bg-info-subtle text-info",
        snippet: "I solved it using O(N) space (two arrays for left/right max). I know there is an O(1) space two-pointer approach but I can't wrap my head around it.",
        authorInitials: "SM", authorBg: "bg-secondary-subtle text-secondary", authorName: "Sneha Mishra",
        time: "6 hours ago", replies: 21, upvotes: 112
    },
    {
        id: 15,
        title: "System Design: How to scale a URL Shortener?",
        category: "Coding Challenges",
        badgeClass: "bg-info-subtle text-info",
        snippet: "If I use Base62 encoding for the short URL, what happens if two concurrent requests generate the same ID before inserting into the DB? How to handle collisions at scale?",
        authorInitials: "DK", authorBg: "bg-danger-subtle text-danger", authorName: "Deepak Kumar",
        time: "1 day ago", replies: 44, upvotes: 275
    },
    {
        id: 16,
        title: "Why does my JavaScript Promise array fail silently?",
        category: "Coding Challenges",
        badgeClass: "bg-info-subtle text-info",
        snippet: "I'm using Promise.all() in a map function, but one of the API calls fails and the entire block catches. How do I let the successful ones resolve?",
        authorInitials: "PL", authorBg: "bg-dark text-white", authorName: "Priya Lal",
        time: "3 hours ago", replies: 15, upvotes: 56
    },
    {
        id: 17,
        title: "SQL Query Optimization - Finding Nth highest salary",
        category: "Coding Challenges",
        badgeClass: "bg-info-subtle text-info",
        snippet: "Everyone uses the DENSE_RANK() window function now. Is the older subquery method with LIMIT/OFFSET still asked in interviews?",
        authorInitials: "VT", authorBg: "bg-info-subtle text-info", authorName: "Varun Teja",
        time: "2 days ago", replies: 30, upvotes: 98
    },
    {
        id: 18,
        title: "Trie vs HashMap for Autocomplete feature?",
        category: "Coding Challenges",
        badgeClass: "bg-info-subtle text-info",
        snippet: "I'm building an autocomplete component for my portfolio. Should I implement a custom Trie structure or just use a basic HashMap/Filter approach in JS?",
        authorInitials: "AG", authorBg: "bg-primary-subtle text-primary", authorName: "Arjun Gupta",
        time: "1 week ago", replies: 18, upvotes: 67
    },
    {
        id: 19,
        title: "Backtracking template that works for 90% of problems",
        category: "Coding Challenges",
        badgeClass: "bg-info-subtle text-info",
        snippet: "Hey guys, I created a mental template that works for Subsets, Permutations, and Combinations. Sharing it here!",
        authorInitials: "NN", authorBg: "bg-success-subtle text-success", authorName: "Nitin Narang",
        time: "3 weeks ago", replies: 120, upvotes: 890
    },
    {
        id: 20,
        title: "Is Competitive Programming necessary for product companies?",
        category: "Coding Challenges",
        badgeClass: "bg-info-subtle text-info",
        snippet: "I'm rated 1200 on Codeforces but I have great development projects. Should I grind CF or focus on Leetcode patterns for interviews?",
        authorInitials: "SK", authorBg: "bg-warning-subtle text-warning", authorName: "Sanya Kapoor",
        time: "4 days ago", replies: 75, upvotes: 145
    },

    // --- RESUME REVIEWS (10) ---
    {
        id: 21,
        title: "Please review my resume for Backend roles!",
        category: "Resume Reviews",
        badgeClass: "bg-danger-subtle text-danger",
        snippet: "Applying for SDE-1 backend roles. I have projects in Node.js and Go. Getting rejected in screening. Any feedback is appreciated!",
        authorInitials: "VK", authorBg: "bg-secondary-subtle text-secondary", authorName: "Vikram Kumar",
        time: "1 day ago", replies: 8, upvotes: 56
    },
    {
        id: 22,
        title: "Roast my Data Science Resume!",
        category: "Resume Reviews",
        badgeClass: "bg-danger-subtle text-danger",
        snippet: "I'm transitioning from Web Dev to Data Science. I've highlighted my Python and ML projects, but I'm worried it still looks too 'frontend-heavy'. Be brutal!",
        authorInitials: "KL", authorBg: "bg-info-subtle text-info", authorName: "Karan Lohia",
        time: "4 days ago", replies: 19, upvotes: 22
    },
    {
        id: 23,
        title: "Can someone review my ATS score? (Frontend Dev)",
        category: "Resume Reviews",
        badgeClass: "bg-danger-subtle text-danger",
        snippet: "I used a fancy Canva template but I heard ATS parsers hate columns. Should I switch back to a standard LaTeX single-column format?",
        authorInitials: "RS", authorBg: "bg-primary-subtle text-primary", authorName: "Rahul Sharma",
        time: "2 hours ago", replies: 14, upvotes: 45
    },
    {
        id: 24,
        title: "How to explain a 2-year gap on resume?",
        category: "Resume Reviews",
        badgeClass: "bg-danger-subtle text-danger",
        snippet: "I took two years off for UPSC prep but I'm now returning to tech. How should I frame this on my resume without it looking like a red flag?",
        authorInitials: "MP", authorBg: "bg-warning-subtle text-warning", authorName: "Meera Patel",
        time: "1 week ago", replies: 32, upvotes: 115
    },
    {
        id: 25,
        title: "Should I include High School marks?",
        category: "Resume Reviews",
        badgeClass: "bg-danger-subtle text-danger",
        snippet: "I'm in my final year of B.Tech. Space is tight on my 1-page resume. Is it safe to remove my 10th and 12th percentages now?",
        authorInitials: "AS", authorBg: "bg-dark text-white", authorName: "Aditya Singh",
        time: "5 hours ago", replies: 28, upvotes: 60
    },
    {
        id: 26,
        title: "Review my UX/UI Portfolio Resume",
        category: "Resume Reviews",
        badgeClass: "bg-danger-subtle text-danger",
        snippet: "I've linked my Behance and Figma prototypes, but I'm struggling with writing the bullet points for my case studies. Looking for a designer's perspective.",
        authorInitials: "NV", authorBg: "bg-success-subtle text-success", authorName: "Nisha Varma",
        time: "2 days ago", replies: 9, upvotes: 41
    },
    {
        id: 27,
        title: "Fake experience on resume vs No experience?",
        category: "Resume Reviews",
        badgeClass: "bg-danger-subtle text-danger",
        snippet: "I see a lot of batchmates putting fake internships. I only have personal projects. Is it better to be honest or pad the resume to pass the initial screening?",
        authorInitials: "TJ", authorBg: "bg-danger-subtle text-danger", authorName: "Tushar Jain",
        time: "3 days ago", replies: 88, upvotes: 215
    },
    {
        id: 28,
        title: "Does putting hobbies actually help?",
        category: "Resume Reviews",
        badgeClass: "bg-danger-subtle text-danger",
        snippet: "I play professional chess and guitar. Does HR actually care about the 'Interests' section or should I use that space for another project?",
        authorInitials: "DP", authorBg: "bg-primary-subtle text-primary", authorName: "Divya Prakash",
        time: "12 hours ago", replies: 41, upvotes: 82
    },
    {
        id: 29,
        title: "Quantifying bullet points without real metrics",
        category: "Resume Reviews",
        badgeClass: "bg-danger-subtle text-danger",
        snippet: "Everyone says 'Increased performance by X%'. How do I quantify my college projects when they have 0 real users?",
        authorInitials: "HK", authorBg: "bg-info-subtle text-info", authorName: "Harsh Kumar",
        time: "6 days ago", replies: 25, upvotes: 130
    },
    {
        id: 30,
        title: "1 Page vs 2 Page resume for freshers?",
        category: "Resume Reviews",
        badgeClass: "bg-danger-subtle text-danger",
        snippet: "I have 4 internships and 6 projects. I can't fit everything on one page without size 8 font. Is a 2-page resume really an instant reject?",
        authorInitials: "AM", authorBg: "bg-secondary-subtle text-secondary", authorName: "Akash Menon",
        time: "1 month ago", replies: 56, upvotes: 177
    },

    // --- ALUMNI ADVICE (10) ---
    {
        id: 31,
        title: "Tips for negotiating salary as a fresher (My Experience)",
        category: "Alumni Advice",
        badgeClass: "bg-primary-subtle text-primary",
        snippet: "Many freshers think they can't negotiate their first offer. I managed to negotiate a 15% increase on my base pay by presenting competitive counter-offers. Here's exactly what I said to HR...",
        authorInitials: "SJ", authorBg: "bg-dark text-white", authorName: "Siddharth Jain",
        time: "2 days ago", replies: 45, upvotes: 210
    },
    {
        id: 32,
        title: "Life after graduation: What I wish I knew",
        category: "Alumni Advice",
        badgeClass: "bg-primary-subtle text-primary",
        snippet: "Graduated in 2023. The transition from college to corporate life is jarring. You have money but no time. Focus on building good habits now.",
        authorInitials: "PR", authorBg: "bg-info-subtle text-info", authorName: "Priyanka Roy",
        time: "1 week ago", replies: 89, upvotes: 450
    },
    {
        id: 33,
        title: "Startups vs MNCs: Where should you start your career?",
        category: "Alumni Advice",
        badgeClass: "bg-primary-subtle text-primary",
        snippet: "I started at a Series-A startup and then moved to a FAANG. The startup gave me incredible ownership, but the MNC gave me structure and scale. Here is a breakdown of pros/cons.",
        authorInitials: "AN", authorBg: "bg-success-subtle text-success", authorName: "Abhinav Nath",
        time: "3 days ago", replies: 67, upvotes: 310
    },
    {
        id: 34,
        title: "How important is CGPA really?",
        category: "Alumni Advice",
        badgeClass: "bg-primary-subtle text-primary",
        snippet: "I graduated with a 6.8 CGPA. It was tough getting the first interview, but after my first job, literally no one has ever asked for my college grades again. Don't stress too much.",
        authorInitials: "GK", authorBg: "bg-warning-subtle text-warning", authorName: "Gaurav Khanna",
        time: "2 weeks ago", replies: 102, upvotes: 520
    },
    {
        id: 35,
        title: "Building an emergency fund from your first paycheck",
        category: "Alumni Advice",
        badgeClass: "bg-primary-subtle text-primary",
        snippet: "Before you buy that iPhone or a car on EMI, please read this. The tech industry has layoffs. Having 6 months of expenses saved saved my mental health last year.",
        authorInitials: "SN", authorBg: "bg-secondary-subtle text-secondary", authorName: "Swati Nanda",
        time: "5 days ago", replies: 44, upvotes: 285
    },
    {
        id: 36,
        title: "Don't ignore soft skills (They get you promoted)",
        category: "Alumni Advice",
        badgeClass: "bg-primary-subtle text-primary",
        snippet: "Coding gets you hired, but communication gets you promoted. Learn how to write good documentation, give concise updates, and push back politely.",
        authorInitials: "VR", authorBg: "bg-primary-subtle text-primary", authorName: "Varun Reddy",
        time: "4 hours ago", replies: 12, upvotes: 95
    },
    {
        id: 37,
        title: "How to transition from QA to SDE?",
        category: "Alumni Advice",
        badgeClass: "bg-primary-subtle text-primary",
        snippet: "I joined as an SDET and transitioned to a core Backend SDE role internally after 1 year. The secret is automating your QA work and taking on small dev tickets.",
        authorInitials: "JM", authorBg: "bg-danger-subtle text-danger", authorName: "Jatin Mishra",
        time: "1 month ago", replies: 31, upvotes: 145
    },
    {
        id: 38,
        title: "The importance of networking internally",
        category: "Alumni Advice",
        badgeClass: "bg-primary-subtle text-primary",
        snippet: "Your manager controls your promotion, but cross-functional teams control your reputation. Make friends with PMs, Designers, and other devs. It opens doors.",
        authorInitials: "LT", authorBg: "bg-info-subtle text-info", authorName: "Lavanya Tripathi",
        time: "2 days ago", replies: 23, upvotes: 110
    },
    {
        id: 39,
        title: "Should you do a Master's degree right after B.Tech?",
        category: "Alumni Advice",
        badgeClass: "bg-primary-subtle text-primary",
        snippet: "I went for MS in US right away, my friend worked for 2 years first. Working first gave him a massive advantage in understanding what he actually wanted to specialize in.",
        authorInitials: "DK", authorBg: "bg-dark text-white", authorName: "Dhruv Kapoor",
        time: "1 week ago", replies: 156, upvotes: 630
    },
    {
        id: 40,
        title: "Dealing with Imposter Syndrome as a Junior Dev",
        category: "Alumni Advice",
        badgeClass: "bg-primary-subtle text-primary",
        snippet: "It's normal to feel like you know nothing. It took me 6 months just to understand my company's codebase. Ask questions, nobody expects you to be a rockstar on day 1.",
        authorInitials: "RC", authorBg: "bg-success-subtle text-success", authorName: "Rishabh Chawla",
        time: "12 hours ago", replies: 88, upvotes: 420
    }
];

from bs4 import BeautifulSoup

with open('faculty-dashboard.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

rightbar = soup.select_one('.rightbar')
if rightbar:
    rightbar.clear()
    
    html = """
    <div class="container-fluid py-4" style="text-align: left;">
        <h2 class="fw-bold mb-4">Faculty Dashboard</h2>
        <div class="row g-4">
            <div class="col-md-4">
                <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
                    <i class="bi bi-collection text-primary fs-1 mb-2"></i>
                    <h3 class="fw-bold mb-1">1,245</h3>
                    <p class="text-muted mb-0">Total Questions</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
                    <i class="bi bi-journal-check text-success fs-1 mb-2"></i>
                    <h3 class="fw-bold mb-1">12</h3>
                    <p class="text-muted mb-0">Active Assessments</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
                    <i class="bi bi-check2-square text-warning fs-1 mb-2"></i>
                    <h3 class="fw-bold mb-1">34</h3>
                    <p class="text-muted mb-0">Pending Reviews</p>
                </div>
            </div>
        </div>
        
        <h4 class="fw-bold mt-5 mb-3">Recent Activity</h4>
        <div class="card border-0 shadow-sm rounded-4 p-4">
            <ul class="list-unstyled mb-0">
                <li class="mb-3 border-bottom pb-2">
                    <i class="bi bi-check-circle-fill text-success me-2"></i> 
                    <strong>AI Generated Question Batch #42</strong> is awaiting your review.
                </li>
                <li class="mb-3 border-bottom pb-2">
                    <i class="bi bi-journal-text text-primary me-2"></i> 
                    <strong>Mid-Term Mock Assessment</strong> has been published.
                </li>
                <li>
                    <i class="bi bi-person-fill text-info me-2"></i> 
                    <strong>Student Analytics</strong> for recent coding challenge updated.
                </li>
            </ul>
        </div>
    </div>
    """
    
    new_content = BeautifulSoup(html, 'html.parser')
    rightbar.append(new_content)

with open('faculty-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

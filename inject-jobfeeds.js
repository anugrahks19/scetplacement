const fs = require('fs');
let content = fs.readFileSync('apps/app-jobfeeds.html', 'utf8');

// 1. Find the bounds of the jobs container
const startGrid = content.indexOf('<div class="row">');
const endGrid = content.indexOf('</main>');
let gridContent = content.substring(startGrid, endGrid);

// 2. Replace with our new container structure
const newStructure = `
<div class="row mb-4">
    <div class="col-12 col-lg-8 mx-auto">
        <div class="d-flex gap-2 overflow-auto pb-2" id="jobFilters">
            <button class="btn btn-primary rounded-pill px-4 filter-btn active" data-filter="All">All</button>
            <button class="btn btn-light border rounded-pill px-4 filter-btn" data-filter="Engineering">Engineering</button>
            <button class="btn btn-light border rounded-pill px-4 filter-btn" data-filter="Design">Design</button>
            <button class="btn btn-light border rounded-pill px-4 filter-btn" data-filter="Data">Data</button>
            <button class="btn btn-light border rounded-pill px-4 filter-btn" data-filter="Product">Product</button>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12 col-lg-8 mx-auto" id="jobsContainer">
        <!-- Jobs will be injected here via JS -->
    </div>
</div>
`;

content = content.replace(gridContent, newStructure + '\n');

// 3. Remove the old inline script and replace with our external script
content = content.replace(/<script>[\s\S]*?<\/script>/, '<script src="../assets/js/jobfeeds.js"></script>');

fs.writeFileSync('apps/app-jobfeeds.html', content);
console.log('Job Feeds HTML updated successfully');

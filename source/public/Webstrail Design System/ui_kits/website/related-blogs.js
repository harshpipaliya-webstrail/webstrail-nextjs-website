const element = document.getElementById('related-blogs');

if (element && !element.children.length) {
    const currentPath = window.location.pathname;
    const arr = [
        {
            label: 'How to reduce dental claim denials',
            url: '/resources/how-to-reduce-dental-claim-denials'
        },
        {
            label: 'How to choose a dental PMS integration partner',
            url: '/resources/how-to-choose-a-dental-pms-integration-partner'
        },
        {
            label: 'Open Dental vs Dentrix vs Eaglesoft: an integration guide',
            url: '/resources/open-dental-vs-dentrix-vs-eaglesoft-integration-guide'
        },
        {
            label: 'What is a DSO (Dental Support Organization) — and how software supports multi-location growth',
            url: '/resources/what-is-a-dso-dental-support-organization'
        },
        {
            label: 'DSO KPI dashboard requirements: what to track across locations',
            url: '/resources/dso-kpi-dashboard-requirements'
        },
        {
            label: 'HIPAA compliance checklist for dental software vendors',
            url: '/resources/hipaa-compliance-checklist-for-dental-software'
        },
        {
            label: 'SOC 2 Type II for dental tech: what it actually means for buyers',
            url: '/resources/soc-2-type-ii-for-dental-tech'
        },
        {
            label: 'Dental revenue-cycle automation: a practical primer',
            url: '/resources/dental-revenue-cycle-automation-primer'
        },
        {
            label: 'Build vs. buy: a custom dental software decision guide',
            url: '/resources/build-vs-buy-dental-software'
        },
        {
            label: 'What it costs to build custom dental practice-management software',
            url: '/resources/cost-to-build-custom-dental-software'
        },
        {
            label: 'Patient-experience software: online scheduling, portals & payments',
            url: '/resources/patient-experience-software-guide'
        },
        {
            label: 'Migrating dental data safely between PMS systems',
            url: '/resources/migrating-dental-data-between-pms-systems'
        }
    ].filter((d) => !currentPath.startsWith(d.url) );
    let content = `<section class="related-blogs prose">
    <h2>Related Blogs</h2>

    <div class="blog-list">`;
    arr.forEach((e) => {
        content += `<div><a href=${e.url}>${e.label}</a></div>`
    })
    content += `</div>
</section>`;
    element.innerHTML = content;
    console.log(window.location.pathname);
} else {
    console.log("Element not found");
}
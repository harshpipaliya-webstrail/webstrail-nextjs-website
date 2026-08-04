const element = document.getElementById('related-case-studies');

if (element && !element.children.length) {
    const currentPath = window.location.pathname;
    const arr = [
        { label: 'AI lead & churn analysis for a dental group', url: '/case-studies/ai-patient-churn-lead-analysis/' },
        { label: 'AI that drafts treatment plans and reads imaging', url: '/case-studies/ai-treatment-planning-imaging/' },
        { label: 'Automated eligibility verification across heterogeneous PMSs', url: '/case-studies/automated-eligibility-verification/' },
        { label: 'Claims tracking + ERA/EOB reconciliation, automated', url: '/case-studies/claims-era-eob-reconciliation/' },
        { label: 'The platform 800+ dental practices run on', url: '/case-studies/dental-coaching-platform/' },
        { label: 'A CRM that turned a decade of dental data into strategy', url: '/case-studies/dental-crm-customer-analytics/' },
        { label: 'A member portal & vendor catalog for a dental GPO', url: '/case-studies/dental-gpo-member-portal/' },
        { label: 'The software a dental membership plan runs on', url: '/case-studies/dental-membership-platform/' },
        { label: 'Reviews & reputation, automated for a dental brand', url: '/case-studies/dental-reviews-reputation-automation/' },
        { label: 'A dental-tech architecture & consulting engagement', url: '/case-studies/dental-tech-architecture-consulting/' },
        { label: "0\u21921: a dental-tech founder's MVP, shipped", url: '/case-studies/dental-tech-founder-mvp/' },
        { label: 'One platform, one revenue view across a multi-location DSO', url: '/case-studies/dso-revenue-cycle-platform/' },
        { label: 'An enterprise RCM & payments platform for dental', url: '/case-studies/enterprise-rcm-payments-platform/' },
        { label: 'A multi-location KPI dashboard on a unified data warehouse', url: '/case-studies/multi-location-kpi-dashboard/' },
        { label: 'Patient payment plans & financing, built in', url: '/case-studies/patient-payment-plans-financing/' },
        { label: 'A patient front door: portal, scheduling & online payments', url: '/case-studies/patient-portal-scheduling-payments/' },
        { label: 'A data-migration engine between practice-management systems', url: '/case-studies/pms-data-migration-engine/' }
    ].filter((d) => !currentPath.startsWith(d.url.slice(0, -1)));

    let content = `<section class="related-blogs prose">
    <h2>Related Case Studies</h2>

    <div class="blog-list">`;
    arr.forEach((e) => {
        content += `<div><a href="${e.url}">${e.label}</a></div>`;
    });
    content += `</div>
</section>`;
    element.innerHTML = content;
}

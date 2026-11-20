/* ------------------------------------------------------------------------------------------
 * REGISTRY OF STATIC CASE STUDIES  (the hand-built pages in public/case-studies/<slug>/index.html)
 *
 * The one place that lists the static case studies. It feeds the /case-studies index, Related
 * Case Studies (same category), and the case-study search on /resources. Dynamic case studies (API)
 * are merged with this list automatically and are shown exactly like these.
 *
 * type    = first tag on the card (the "type" field of an API case study)
 * keyword = second tag on the card (the first of the "keywords" of an API case study); also the
 *           "category" used for Related Case Studies
 *
 * ADD a static case study:    1) add public/case-studies/<slug>/index.html (copy an existing one),
 *                                2) add an entry below, 3) add its card to public/case-studies/index.html.
 * UPDATE a static case study: edit its entry here and keep it in sync with its page.
 * Order here = order on the /case-studies page. An API case study with the same slug as an entry
 * here is ignored (the static page wins).
 * ------------------------------------------------------------------------------------------ */
window.WEBSTRAIL_STATIC_CASE_STUDIES = [
  {
    slug: "dso-revenue-cycle-platform",
    type: "Enterprise / DSO",
    keyword: "Revenue cycle",
    title: "One platform, one revenue view across a multi-location DSO",
    description: "Aggregated RCM with automated insurance verification and ACH posting, plus a KPI dashboard across a 20–25 practice DSO running several different PMSs."
  },
  {
    slug: "enterprise-rcm-payments-platform",
    type: "Enterprise product",
    keyword: "RCM & payments",
    title: "An enterprise RCM & payments platform for dental",
    description: "Multi-tenant SaaS for payments, A/R automation, payment plans, analytics, and practice chaining — taken through SOC 2 and HIPAA certification."
  },
  {
    slug: "dental-coaching-platform",
    type: "Enterprise / Platform",
    keyword: "Practice growth",
    title: "The platform 800+ dental practices run on",
    description: "Replaced fragile spreadsheets with a role-based platform for a national coaching firm — coach revenue, practice assessments, and KPI monitoring under one roof."
  },
  {
    slug: "dental-crm-customer-analytics",
    type: "Platform",
    keyword: "CRM & analytics",
    title: "A CRM that turned a decade of dental data into strategy",
    description: "A shared spreadsheet became a multi-user CRM computing churn, customer lifetime value, and retention — analytics that reshaped how the business is run."
  },
  {
    slug: "dental-membership-platform",
    type: "Platform",
    keyword: "Membership",
    title: "The software a dental membership plan runs on",
    description: "Enrollment, billing, and a member portal for a dental membership and benefits plan — the operating system behind the subscription."
  },
  {
    slug: "automated-eligibility-verification",
    type: "Module",
    keyword: "Revenue cycle",
    title: "Automated eligibility verification across heterogeneous PMSs",
    description: "Real-time insurance eligibility checks written straight back into each location's practice-management system — no more portal hopping at the front desk."
  },
  {
    slug: "claims-era-eob-reconciliation",
    type: "Module",
    keyword: "Revenue cycle",
    title: "Claims tracking + ERA/EOB reconciliation, automated",
    description: "Claim status and amounts by patient and location, with automated payment posting reconciled to the general ledger."
  },
  {
    slug: "multi-location-kpi-dashboard",
    type: "Platform",
    keyword: "Analytics",
    title: "A multi-location KPI dashboard on a unified data warehouse",
    description: "Production, collection, A/R, and new-patient metrics by location, provider, and carrier — drawn from 15+ practice-management systems into one warehouse."
  },
  {
    slug: "ai-treatment-planning-imaging",
    type: "AI module",
    keyword: "Clinical AI",
    title: "AI that drafts treatment plans and reads imaging",
    description: "AI treatment-plan assistance and image processing built inside a dental product — turning clinical data into a faster, more consistent workflow."
  },
  {
    slug: "ai-patient-churn-lead-analysis",
    type: "AI module",
    keyword: "Growth AI",
    title: "AI lead & churn analysis for a dental group",
    description: "Models that flag at-risk patients and surface high-value leads from everyday practice data — so the team acts before patients drift."
  },
  {
    slug: "patient-payment-plans-financing",
    type: "Module",
    keyword: "Payments",
    title: "Patient payment plans & financing, built in",
    description: "Installment plans and financing options embedded directly in the payment flow — more treatment accepted, less revenue left on the table."
  },
  {
    slug: "patient-portal-scheduling-payments",
    type: "Platform",
    keyword: "Patient experience",
    title: "A patient front door: portal, scheduling & online payments",
    description: "Booking, communication, and payments in one place — a patient experience people actually use, integrated with the practice's systems."
  },
  {
    slug: "pms-data-migration-engine",
    type: "One-time project",
    keyword: "Platform",
    title: "A data-migration engine between practice-management systems",
    description: "A custom engine to migrate and clean data across PMS vendors — moving a practice to a new system without downtime or lost history."
  },
  {
    slug: "dental-gpo-member-portal",
    type: "Platform",
    keyword: "GPO",
    title: "A member portal & vendor catalog for a dental GPO",
    description: "A group-purchasing portal with vendor catalogs and the data plumbing behind it — the platform a buying group runs its members on."
  },
  {
    slug: "dental-tech-founder-mvp",
    type: "One-time project",
    keyword: "Founder MVP",
    title: "0→1: a dental-tech founder's MVP, shipped",
    description: "Took a dental-tech idea to a real, usable product in months — no in-house engineering team required to get to market."
  },
  {
    slug: "dental-reviews-reputation-automation",
    type: "Module",
    keyword: "Growth",
    title: "Reviews & reputation, automated for a dental brand",
    description: "Automated review capture and reputation management across locations — turning happy patients into a steady stream of public proof."
  },
  {
    slug: "dental-tech-architecture-consulting",
    type: "Consulting",
    keyword: "Architecture",
    title: "A dental-tech architecture & consulting engagement",
    description: "Strategy, architecture, and integration guidance for a dental company — the technical direction to scale a product without rebuilding it later."
  }
];

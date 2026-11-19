/* ------------------------------------------------------------------------------------------
 * REGISTRY OF STATIC BLOGS  (the hand-built pages in content/blog__<slug>.html)
 *
 * This is the one place that lists the static blogs. It feeds the /blog index, the Related
 * Blogs lists (same category), and the blog search on /resources. Dynamic blogs (Google Sheet)
 * are merged with this list automatically and are shown exactly like these.
 *
 * ADD a static blog:   1) create content/blog__<slug>.html (+ .scripts.json / .styles.html,
 *                         copy an existing one), 2) add an entry below, 3) add its static card to
 *                         content/blog.html if you want it in the server-rendered /blog HTML.
 * UPDATE a static blog: edit its entry here (title / category / description) and keep it in sync
 *                         with its page.
 * Order here = order on the /blog page. A sheet row with the same slug as an entry here is
 * ignored (the static page wins).
 * ------------------------------------------------------------------------------------------ */
window.WEBSTRAIL_STATIC_BLOGS = [
  {
    slug: "how-to-reduce-dental-claim-denials",
    category: "Revenue Cycle",
    title: "How to reduce dental claim denials",
    description: "A practical guide to reducing dental claim denials — the top denial reasons, how to fix them at the source, and where automation cuts your denial rate for good."
  },
  {
    slug: "how-to-choose-a-dental-pms-integration-partner",
    category: "Integrations",
    title: "How to choose a dental PMS integration partner",
    description: "How to choose a dental PMS integration partner — the questions to ask, the red flags to avoid, and what separates a team that ships from one that stalls."
  },
  {
    slug: "open-dental-vs-dentrix-vs-eaglesoft-integration-guide",
    category: "Integrations",
    title: "Open Dental vs Dentrix vs Eaglesoft: an integration guide",
    description: "An engineer's guide to integrating Open Dental, Dentrix, and Eaglesoft — how each exposes data, what's easy, what's hard, and what it means for your build."
  },
  {
    slug: "what-is-a-dso-dental-support-organization",
    category: "DSO",
    title: "What is a DSO (Dental Support Organization) — and how software supports multi-location growth",
    description: "What is a DSO (Dental Support Organization)? A clear explanation of the model, how DSOs grow, and the software that lets a multi-location group run as one business."
  },
  {
    slug: "dso-kpi-dashboard-requirements",
    category: "DSO",
    title: "DSO KPI dashboard requirements: what to track across locations",
    description: "The KPIs a DSO dashboard must track — production, collections, A/R, new patients, and more — and how to build one from many practice-management systems."
  },
  {
    slug: "hipaa-compliance-checklist-for-dental-software",
    category: "Compliance",
    title: "HIPAA compliance checklist for dental software vendors",
    description: "A HIPAA compliance checklist for dental software — the safeguards, BAAs, and engineering practices that keep PHI protected when you build or buy dental applications."
  },
  {
    slug: "soc-2-type-ii-for-dental-tech",
    category: "Compliance",
    title: "SOC 2 Type II for dental tech: what it actually means for buyers",
    description: "What SOC 2 Type II means when you're buying or building dental software — how it differs from Type I and HIPAA, and why it matters for a PHI-handling vendor."
  },
  {
    slug: "dental-revenue-cycle-automation-primer",
    category: "Revenue Cycle",
    title: "Dental revenue-cycle automation: a practical primer",
    description: "A practical primer on dental revenue-cycle automation — what to automate first across eligibility, claims, A/R, and payments, and the ROI of each step."
  },
  {
    slug: "build-vs-buy-dental-software",
    category: "Strategy",
    title: "Build vs. buy: a custom dental software decision guide",
    description: "Build vs. buy for dental software — a decision framework covering cost, control, integration, and time-to-value, so you know when custom beats off-the-shelf."
  },
  {
    slug: "cost-to-build-custom-dental-software",
    category: "Strategy",
    title: "What it costs to build custom dental practice-management software",
    description: "What custom dental software really costs — the factors that drive price, typical ranges by project type, and how build-and-run changes the total cost of ownership."
  },
  {
    slug: "patient-experience-software-guide",
    category: "Patient Experience",
    title: "Patient-experience software: online scheduling, portals & payments",
    description: "A guide to dental patient-experience software — online scheduling, patient portals, communication, and payments — and why PMS integration is what makes it work."
  },
  {
    slug: "migrating-dental-data-between-pms-systems",
    category: "Integrations",
    title: "Migrating dental data safely between PMS systems",
    description: "How to migrate dental practice data safely between PMS systems — planning, mapping, cleaning, validation, and cutover — without downtime or lost patient history."
  }
];

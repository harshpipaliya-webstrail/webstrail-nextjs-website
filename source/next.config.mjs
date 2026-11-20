/** @type {import('next').NextConfig} */
// `output: 'export'` is applied for production builds only (`next build`), which
// emit the static site into `out/`. In development (`next dev`) it is left unset
// so the catch-all `[...slug]` route renders on demand — otherwise Next 14's dev
// server throws a spurious "missing generateStaticParams()" 500 on every dynamic
// route. This does NOT change the production output; `next build` still exports
// the full static site exactly as before.
import { readdirSync, statSync } from 'fs';

const isProd = process.env.NODE_ENV === 'production';

// Slugs of the hand-built static blogs (content/blog__<slug>.html). Used (dev only) so that every
// OTHER /blog/<slug>/ URL is served by the dynamic blog template.
const staticBlogSlugs = (() => {
  try {
    return readdirSync('content')
      .filter((f) => /^blog__.+\.html$/.test(f) && !f.endsWith('.styles.html'))
      .map((f) => f.slice('blog__'.length, -'.html'.length));
  } catch {
    return [];
  }
})();
// Slugs of the hand-built static case studies (public/case-studies/<slug>/index.html).
const staticCaseStudySlugs = (() => {
  try {
    return readdirSync('public/case-studies').filter((d) => statSync('public/case-studies/' + d).isDirectory());
  } catch {
    return [];
  }
})();
const nextConfig = {
  output: isProd ? 'export' : undefined,
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  async redirects() {
    if (isProd) return [];
    return [
      { source: '/blogs', destination: '/blog/', permanent: true },
      { source: '/blogs/', destination: '/blog/', permanent: true },
      { source: '/blogs/:slug', destination: '/blog/:slug/', permanent: true },
      { source: '/blogs/:slug/', destination: '/blog/:slug/', permanent: true },
      {
        source: '/resources/blogs',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/resources/blogs/',
        destination: '/blog/',
        permanent: true,
      },
      {
        source: '/resources/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/resources/:slug/',
        destination: '/blog/:slug/',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Dev only. A /blog/<slug>/ that is neither a static blog nor a blog the API returned (at dev-server
    // start) is served the dynamic blog placeholder, which loads the blog in the browser. Blogs the
    // API knows are rendered on the server like in production. In production the web server does the
    // placeholder fallback (see nginx.conf), because a static export cannot add routes at runtime.
    let knownApiSlugs = [];
    if (!isProd) {
      try {
        const res = await fetch(`${process.env.API_URL || ''}/api/v1/blogs`, { signal: AbortSignal.timeout(3000) });
        const data = await res.json();
        knownApiSlugs = (data.blogs || []).map((x) => x.slug).filter((s) => /^[A-Za-z0-9_-]+$/.test(s));
      } catch { /* API not running: everything non-static uses the placeholder */ }
    }
    const rendered = [...staticBlogSlugs, ...knownApiSlugs];
    // Same idea for case studies: static ones are plain files in public/; any other slug is served
    // by the dynamic case-study page (API ones are rendered on the server, others use the placeholder).
    let knownCaseStudySlugs = [];
    if (!isProd) {
      try {
        const res = await fetch(`${process.env.API_URL || ''}/api/v1/case-studies`, { signal: AbortSignal.timeout(3000) });
        const data = await res.json();
        const rows = Array.isArray(data) ? data : Object.values(data || {}).find(Array.isArray) || [];
        knownCaseStudySlugs = rows.map((x) => x.slug).filter((s) => /^[A-Za-z0-9_-]+$/.test(s));
      } catch { /* API not running */ }
    }
    const renderedCaseStudies = [...staticCaseStudySlugs, ...knownCaseStudySlugs];
    const caseStudySlugRewrite =
      isProd || !renderedCaseStudies.length
        ? []
        : [
            {
              source: `/case-studies/:slug((?!(?:${renderedCaseStudies.join('|')})(?:/|$))[^/]+)/`,
              destination: '/case-studies/_/',
            },
          ];
    const blogSlugRewrite =
      isProd || !rendered.length
        ? []
        : [
            {
              source: `/blog/:slug((?!(?:${rendered.join('|')})(?:/|$))[^/]+)/`,
              destination: '/blog/_/',
            },
          ];
    return {
      beforeFiles: [...blogSlugRewrite, ...caseStudySlugRewrite],
      afterFiles: [
        {
          source: '/case-studies/',
          destination: '/case-studies/index.html',
        },
        // static case-study pages only; every other slug is handled by app/case-studies/[slug]
        ...(staticCaseStudySlugs.length
          ? [
              {
                source: `/case-studies/:slug(${staticCaseStudySlugs.join('|')})/`,
                destination: '/case-studies/:slug/index.html',
              },
            ]
          : []),
      ],
    };
  },
};
export default nextConfig;

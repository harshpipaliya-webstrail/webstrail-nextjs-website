/** @type {import('next').NextConfig} */
// `output: 'export'` is applied for production builds only (`next build`), which
// emit the static site into `out/`. In development (`next dev`) it is left unset
// so the catch-all `[...slug]` route renders on demand — otherwise Next 14's dev
// server throws a spurious "missing generateStaticParams()" 500 on every dynamic
// route. This does NOT change the production output; `next build` still exports
// the full static site exactly as before.
import { readdirSync } from 'fs';

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
        const res = await fetch(process.env.BLOGS_API_URL || 'http://localhost:5500/api/v1/blogs', { signal: AbortSignal.timeout(3000) });
        const data = await res.json();
        knownApiSlugs = (data.blogs || []).map((x) => x.slug).filter((s) => /^[A-Za-z0-9_-]+$/.test(s));
      } catch { /* API not running: everything non-static uses the placeholder */ }
    }
    const rendered = [...staticBlogSlugs, ...knownApiSlugs];
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
      beforeFiles: blogSlugRewrite,
      afterFiles: [
        {
          source: '/case-studies/',
          destination: '/case-studies/index.html',
        },
        {
          source: '/case-studies/:path*/',
          destination: '/case-studies/:path*/index.html',
        },
      ],
    };
  },
};
export default nextConfig;

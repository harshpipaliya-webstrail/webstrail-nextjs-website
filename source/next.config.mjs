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
    // Dev only: every /blog/<slug>/ that is not a static blog page is served the dynamic blog
    // template (the blog is loaded in the browser from the API/sheet and reads the slug from the
    // URL). In production the web server does this (see nginx.conf), because the static export
    // cannot add routes at runtime.
    const blogSlugRewrite =
      isProd || !staticBlogSlugs.length
        ? []
        : [
            {
              source: `/blog/:slug((?!(?:${staticBlogSlugs.join('|')})(?:/|$))[^/]+)/`,
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

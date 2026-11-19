/** @type {import('next').NextConfig} */
// `output: 'export'` is applied for production builds only (`next build`), which
// emit the static site into `out/`. In development (`next dev`) it is left unset
// so the catch-all `[...slug]` route renders on demand — otherwise Next 14's dev
// server throws a spurious "missing generateStaticParams()" 500 on every dynamic
// route. This does NOT change the production output; `next build` still exports
// the full static site exactly as before.
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  output: isProd ? 'export' : undefined,
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  async redirects() {
    if (isProd) return [];
    return [
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
    // Dev only: serve the /blogs/<slug>/ template for ANY slug (the blog is loaded in the browser
    // from the API/sheet and reads the slug from the URL). In production the web server does this
    // (see nginx.conf), because the static export can't add routes at runtime.
    const blogSlugRewrite = isProd
      ? []
      : [{ source: '/blogs/:slug/', destination: '/blogs/_/' }];
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

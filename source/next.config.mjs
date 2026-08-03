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
};
export default nextConfig;

import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

const V = '?v=20260723b';

export const metadata: Metadata = {
  metadataBase: new URL('https://webstrail.com'),
  title: 'Webstrail',
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon.png', type: 'image/png' }],
    apple: '/apple-touch-icon.png',
  },
  authors: [{ name: 'Webstrail' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1280D4',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Design-system CSS (served from public, identical to the static site) */}
        <link rel="stylesheet" href={'/Webstrail%20Design%20System/styles.css' + V} />
        <link rel="stylesheet" href={'/Webstrail%20Design%20System/ui_kits/website/site.css' + V} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet" media="print" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet" media="print" />
        {/* fonts load async (display=swap); flip media once loaded so they never block first paint */}
        <script dangerouslySetInnerHTML={{ __html: "(function(){function f(){document.querySelectorAll('link[media=\"print\"][rel=\"stylesheet\"]').forEach(function(l){l.media='all'})}if(document.readyState!=='loading'){setTimeout(f,0)}else{document.addEventListener('DOMContentLoaded',f)}window.addEventListener('load',f)})();" }} id="fontSwap" />
        {children}
      </body>
    </html>
  );
}

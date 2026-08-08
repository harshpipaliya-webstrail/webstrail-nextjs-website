'use client';
import { useEffect, useRef } from 'react';

type S = { src?: string; code?: string };

export default function PageScripts({ scripts }: { scripts: S[] }) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    // let cancelled = false;
    (async () => {
      for (const s of scripts) {
        // if (cancelled) return;
        await new Promise<void>((resolve) => {
          const el = document.createElement('script');
          if (s.src) {
            el.src = s.src;
            el.onload = () => resolve();
            el.onerror = () => resolve();
            document.body.appendChild(el);
          } else {
            el.text = s.code || '';
            document.body.appendChild(el);
            resolve();
          }
        });
      }
      // if (cancelled) return;
      // Original pages ran these inline at end of <body>; several listen for
      // DOMContentLoaded / load, which already fired — replay them so init runs.
      document.dispatchEvent(new Event('DOMContentLoaded'));
      window.dispatchEvent(new Event('load'));
    })();
    // return () => { cancelled = true; };
  }, [scripts]);
  return null;
}

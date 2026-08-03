// templates/marketing-site/ds-base.js
// One line for consumers to point at this design system.
// In THIS project, base = '../..' resolves to the project root.
// In a CONSUMING project, repoint `base` at the bound _ds/<folder> tree
// relative to this page (e.g. '../_ds/webstrail' one level down).
(() => {
  const base = '../..';
  for (const p of ['styles.css']) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  // Optional: the compiled React component bundle. Safe to load only when
  // React UMD is present on the page (this template is CSS-driven and does
  // not require it). Uncomment if you compose the React primitives here.
  // const s = document.createElement('script');
  // s.src = base + '/_ds_bundle.js';
  // s.onerror = () => console.error('ds-base.js: failed to load ' + s.src +
  //   ' — repoint the base line at the bound _ds/<folder> tree for this page.');
  // document.head.appendChild(s);
})();

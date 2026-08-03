/* ============================================================
   Webstrail — shared scroll-reveal
   Each section/component fades up once as it enters the viewport,
   then stays put (no fade-out — that caused edge-flicker). Reuses
   the .reveal / .is-in styles from site.css. Self-contained: under
   reduced-motion (or no IntersectionObserver) everything stays visible.
   ============================================================ */
(function () {
  "use strict";

  // Respect reduced-motion — site.css keeps .reveal fully visible, so just bail.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Component-level targets to auto-tag on every page type.
  var SELECTOR = [
    // case-study + index + legal
    '.cs-hero .wrap > *',
    '.cs-card:not([hidden])',
    '.csd-hero .wrap > *',
    '.csd-meta', '.csd-article', '.csd-results', '.csd-quote',
    '.csd-cta h2', '.csd-cta p', '.csd-cta .btn',
    '.lg-hero .wrap > *',
    '.lg-body > *',
    // homepage standalone blocks
    '.section-head', '.prose-narrow', '.titem', '.faq2__row', '.sigband__stat',
    '.cred', '.contact-card', '.finale', '.proof__label', '.theme-card'
  ].join(',');

  // Don't AUTO-TAG inside pinned / scroll-scrubbed sections — wrapping a sticky
  // element in a transform would break its pin. (Their own elements aren't .reveal.)
  var SKIP_AUTOTAG = '#problem, #why, #consult, .ostack, [data-intstack], .approach--anim, .prob, .csd-hero, .cs-hero, .lg-hero, .ihero';

  function init() {
    var counter = (typeof WeakMap === 'function') ? new WeakMap() : null;

    // 1) auto-tag component selectors that aren't already reveal and aren't in a pinned section
    var auto = document.querySelectorAll(SELECTOR);
    for (var i = 0; i < auto.length; i++) {
      var el = auto[i];
      if (el.classList.contains('reveal')) continue;
      if (el.closest && el.closest(SKIP_AUTOTAG)) continue;
      el.classList.add('reveal');
      if (counter) {
        var p = el.parentNode, n = counter.get(p) || 0;
        counter.set(p, n + 1);
        var delay = Math.min(n * 60, 240);
        if (delay) el.style.transitionDelay = delay + 'ms';
      }
    }

    // 2) observe EVERY reveal element (pre-tagged + auto) and fade it in ONCE when it
    //    enters the viewport, then stop watching it (no fade-out, no edge-flicker).
    var nodes = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!nodes.length) return;

    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

    nodes.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

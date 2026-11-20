/* Static case-study pages: Related Case Studies = same category (first keyword) first, at most 5,
 * filled with other case studies (static + API). Until the list is ready the page shows a skeleton
 * (CSS keyed on #related-case-studies not having .rb-ready); the server-rendered list is only
 * masked, never edited. If anything fails the original list is simply revealed. */
(function () {
  var C = window.WebstrailCaseStudies;
  var box = document.getElementById('related-case-studies');
  if (!box) return;
  function ready() { box.classList.add('rb-ready'); }
  if (!C) return ready();

  var parts = location.pathname.split('/').filter(Boolean);
  var slug = (parts[parts.indexOf('case-studies') + 1] || '').toLowerCase();
  var cur = C.staticList().filter(function (b) { return b.slug.toLowerCase() === slug; })[0];
  if (!cur) return ready();

  C.loadAll().then(function (all) {
    var list = C.related(all, cur);
    if (!list.length) { box.style.display = 'none'; return; }
    var html = '<section class="related-blogs prose"><h2>Related Case Studies</h2><div class="blog-list">';
    list.forEach(function (b) {
      html += '<div><a href="/case-studies/' + encodeURIComponent(b.slug) + '/">' + C.esc(b.title) + '</a></div>';
    });
    box.innerHTML = html + '</div></section>';
  }).catch(function () { /* keep the original list */ }).then(ready);
})();

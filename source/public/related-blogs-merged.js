/* Static blog pages: Related Blogs = every other blog (static + dynamic) in the same category.
 * Until the list is ready the page shows a skeleton (CSS keyed on #related-blogs not having
 * .rb-ready); the server-rendered list is only masked, never edited. If anything fails the
 * original list is simply revealed. */
(function () {
  var B = window.WebstrailBlogs;
  var box = document.getElementById('related-blogs');
  if (!box) return;
  function ready() { box.classList.add('rb-ready'); }
  if (!B) return ready();

  var parts = location.pathname.split('/').filter(Boolean);
  var slug = (parts[parts.indexOf('blog') + 1] || '').toLowerCase();
  var cur = B.staticList().filter(function (b) { return b.slug.toLowerCase() === slug; })[0];
  if (!cur) return ready();

  B.loadAll().then(function (all) {
    var list = B.related(all, cur);
    if (!list.length) { box.style.display = 'none'; return; }
    var html = '<section class="related-blogs prose"><h2>Related Blogs</h2><div class="blog-list">';
    list.forEach(function (b) {
      html += '<div><a href="/blog/' + encodeURIComponent(b.slug) + '/">' + B.esc(b.title) + '</a></div>';
    });
    box.innerHTML = html + '</div></section>';
  }).catch(function () { /* keep the original list */ }).then(ready);
})();

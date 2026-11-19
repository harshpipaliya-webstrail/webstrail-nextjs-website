/* Shared blogs data loader: /blog index, /blog/<slug>, Related Blogs and /resources search.
 * Dynamic blogs come from the blogs API (local and production URLs below). Static blogs are listed in
 * blogs-static.js and are merged in by loadAll(). */
(function () {
  var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  var API_URL = isLocal
    ? 'http://localhost:5500/api/v1/blogs'
    : 'https://api-webstrail.webstrail.com/api/v1/blogs';

  function fromApi() {
    return fetch(API_URL, { cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error('API ' + res.status);
      return res.json();
    }).then(function (data) {
      if (!data || !Array.isArray(data.blogs)) throw new Error('Unexpected API response');
      return data.blogs;
    });
  }

  function clean(list) {
    return (list || []).filter(function (b) { return b && b.slug && b.title; });
  }

  function load() {
    return fromApi().then(clean);
  }

  // ---- merged list: static blogs (blogs-static.js) first, then API blogs ------------------
  function norm(x) { return String(x || '').trim().toLowerCase(); }
  function staticList() { return (window.WEBSTRAIL_STATIC_BLOGS || []).slice(); }

  // Static blogs + dynamic blogs, de-duplicated by slug (static wins). Never rejects: if the
  // dynamic source is unreachable the static list is still returned.
  function loadAll() {
    var stat = staticList();
    var seen = {};
    stat.forEach(function (b) { seen[norm(b.slug)] = true; });
    return load().catch(function () { return []; }).then(function (dyn) {
      var out = stat.slice();
      dyn.forEach(function (b) {
        var k = norm(b.slug);
        if (seen[k]) return;
        seen[k] = true;
        out.push(b);
      });
      return out;
    });
  }

  // Related blogs for the one being viewed: at most max (default 5). The first max blogs of
  // the same category; if that category has fewer, the remainder is filled with randomly chosen
  // blogs from other categories. The current blog is never included.
  function related(all, cur, max) {
    max = max || 5;
    var cat = norm(cur && cur.category);
    var others = all.filter(function (b) { return norm(b.slug) !== norm(cur && cur.slug); });
    var same = others.filter(function (b) { return cat && norm(b.category) === cat; });
    if (same.length >= max) return same.slice(0, max);
    var rest = others.filter(function (b) { return same.indexOf(b) === -1; });
    for (var i = rest.length - 1; i > 0; i--) {   // Fisher-Yates shuffle
      var j = Math.floor(Math.random() * (i + 1));
      var t = rest[i]; rest[i] = rest[j]; rest[j] = t;
    }
    return same.concat(rest.slice(0, max - same.length));
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  window.WebstrailBlogs = { load: load, loadAll: loadAll, related: related, staticList: staticList, esc: esc };
})();

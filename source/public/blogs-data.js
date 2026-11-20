/* Shared blogs data loader: /blog index, /blog/<slug>, Related Blogs and /resources search.
 * Dynamic blogs come from the blogs API (address from the API_URL environment variable). Static blogs are listed in
 * blogs-static.js and are merged in by loadAll(). */
(function () {
  // API address comes from the API_URL environment variable, served as /api-config.js
  var API_URL = (window.WEBSTRAIL_API_URL || '').replace(/\/+$/, '') + '/api/v1/blogs';

  function fromApi() {
    var ctl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 8000) : null; // never wait forever
    return fetch(API_URL, { cache: 'no-store', signal: ctl ? ctl.signal : undefined }).then(function (res) {
      if (timer) clearTimeout(timer);
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

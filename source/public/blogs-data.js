/* Shared blogs data loader for /blogs and /blogs/<slug>.
 * 1) Calls the blogs API server. 2) Falls back to the published Google Sheet CSV.
 * Configure the two URLs below (only place they live). */
(function () {
  var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  var API_URL = isLocal
    ? 'http://localhost:5500/api/v1/blogs'
    : 'https://api-webstrail.webstrail.com/api/v1/blogs';
  var CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSa4eR2FTFbfqznRokU4Q2aUADm49xqym3Ki8so-C33YZ8tOetqF5oaGwRTVkBIea5Jm2MPfnsMMH-u/pub?output=csv';

  // CSV parser supporting quoted fields, escaped quotes and multi-line cells
  function parseCSV(text) {
    var result = [], row = [], cur = '', inQ = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === '"') {
        if (inQ && text[i + 1] === '"') { cur += '"'; i++; } else { inQ = !inQ; }
      } else if (ch === ',' && !inQ) { row.push(cur); cur = ''; }
      else if (ch === '\n' && !inQ) { row.push(cur); result.push(row); row = []; cur = ''; }
      else if (ch === '\r' && !inQ) { /* ignore */ }
      else { cur += ch; }
    }
    if (cur || row.length > 0) { row.push(cur); result.push(row); }
    return result;
  }

  function fromApi() {
    return fetch(API_URL, { cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error('API ' + res.status);
      return res.json();
    }).then(function (data) {
      if (!data || !Array.isArray(data.blogs)) throw new Error('Unexpected API response');
      return data.blogs;
    });
  }

  function fromSheet() {
    var u = CSV_URL + (CSV_URL.indexOf('?') > -1 ? '&' : '?') + '_=' + Date.now();
    return fetch(u, { cache: 'no-store', credentials: 'omit' })
      .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.text(); })
      .then(function (csv) {
        var rows = parseCSV(csv);
        if (!rows.length) return [];
        var headers = rows[0].map(function (h) { return h.trim().toLowerCase(); });
        return rows.slice(1).map(function (r) {
          var o = {};
          headers.forEach(function (h, i) { o[h] = r[i] ? r[i].trim() : ''; });
          return o;
        });
      });
  }

  function clean(list) {
    return (list || []).filter(function (b) { return b && b.slug && b.title; });
  }

  function load() {
    return fromApi().catch(function (e) {
      console.info('[blogs] API unavailable, using sheet directly:', e.message);
      return fromSheet();
    }).then(clean);
  }

  // ---- merged list: static blogs (blogs-static.js) first, then sheet blogs ------------------
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

  window.WebstrailBlogs = { load: load, loadAll: loadAll, related: related, staticList: staticList, esc: esc, parseCSV: parseCSV };
})();

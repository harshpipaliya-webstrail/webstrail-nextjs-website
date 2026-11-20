/* Shared case-studies data loader: /case-studies index, /case-studies/<slug>, Related Case Studies
 * and the /resources search. Dynamic case studies come from the case-studies API (address from the API_URL environment variable);
 * static ones are listed in case-studies-static.js and merged in by loadAll(). */
(function () {
  // API address comes from the API_URL environment variable, served as /api-config.js
  var API_URL = (window.WEBSTRAIL_API_URL || '').replace(/\/+$/, '') + '/api/v1/case-studies';

  function norm(x) { return String(x || '').trim().toLowerCase(); }

  // The API may name the array differently ("caseStudies", "case_studies", "data", …): take the
  // first array property. Field names are lower-cased (approachTitle -> approachtitle).
  function rowsOf(data) {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      var keys = Object.keys(data);
      for (var i = 0; i < keys.length; i++) if (Array.isArray(data[keys[i]])) return data[keys[i]];
    }
    throw new Error('Unexpected API response');
  }
  function lowerKeys(o) {
    var r = {};
    Object.keys(o || {}).forEach(function (k) { r[k.toLowerCase()] = o[k] == null ? '' : String(o[k]).trim(); });
    return r;
  }
  function firstKeyword(s) { return String(s || '').split(',')[0].trim(); }

  // Card/list fields used everywhere: type (tag 1), keyword (tag 2), title, description.
  function shape(r) {
    r.keyword = firstKeyword(r.keywords);
    return r;
  }

  function fromApi() {
    var ctl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 8000) : null; // never wait forever
    return fetch(API_URL, { cache: 'no-store', signal: ctl ? ctl.signal : undefined }).then(function (res) {
      if (timer) clearTimeout(timer);
      if (!res.ok) throw new Error('API ' + res.status);
      return res.json();
    }).then(function (data) { return rowsOf(data).map(lowerKeys).map(shape); });
  }

  function clean(list) {
    return (list || []).filter(function (b) { return b && b.slug && b.title; });
  }

  // API case studies only (rejects if the API cannot be reached).
  function load() { return fromApi().then(clean); }

  function staticList() { return (window.WEBSTRAIL_STATIC_CASE_STUDIES || []).slice(); }

  // Static + API case studies, de-duplicated by slug (static wins). Never rejects.
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

  // Related case studies: at most max (default 5). The first max of the same category (the first
  // keyword) first; if that category has fewer, the rest is filled with randomly chosen others.
  function related(all, cur, max) {
    max = max || 5;
    var cat = norm(cur && cur.keyword);
    var others = all.filter(function (b) { return norm(b.slug) !== norm(cur && cur.slug); });
    var same = others.filter(function (b) { return cat && norm(b.keyword) === cat; });
    if (same.length >= max) return same.slice(0, max);
    var rest = others.filter(function (b) { return same.indexOf(b) === -1; });
    for (var i = rest.length - 1; i > 0; i--) {
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

  window.WebstrailCaseStudies = { load: load, loadAll: loadAll, related: related, staticList: staticList, esc: esc };
})();

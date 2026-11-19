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

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  window.WebstrailBlogs = { load: load, esc: esc, parseCSV: parseCSV };
})();

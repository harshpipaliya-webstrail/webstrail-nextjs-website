/* /case-studies/<slug> — single case-study view for case studies that come from the API.
 * Built at deploy time into the page HTML (data-ssr="1"); this script only fills the page in the
 * browser for case studies added after the last build (served by the /case-studies/_/ placeholder),
 * or fetches the body if the build could not read the Google Doc. */
(function () {
  if (window.__csDetailInit) return;
  window.__csDetailInit = true;

  var C = window.WebstrailCaseStudies;
  var $ = function (id) { return document.getElementById(id); };
  var esc = C.esc;

  function getSlug() {
    var parts = location.pathname.split('/').filter(Boolean);
    var i = parts.indexOf('case-studies');
    var s = i > -1 ? parts[i + 1] : '';
    try { return decodeURIComponent(s || '').toLowerCase(); } catch (e) { return (s || '').toLowerCase(); }
  }

  // ---- dates (M/D/YYYY or ISO) -------------------------------------------
  function parseDate(s) {
    s = (s || '').trim();
    if (!s) return null;
    var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    var d = m ? new Date(+m[3], +m[1] - 1, +m[2]) : new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  function fmtDate(d) { return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
  function isoDate(d) {
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  // "Name | Role | https://linkedin..." (the URL, if any, is always last)
  function parseAuthor(raw) {
    var parts = String(raw || '').split('|').map(function (p) { return p.trim(); }).filter(Boolean);
    var url = '';
    if (parts.length > 1 && /^(https?:)?\/*(www\.)?[\w-]+(\.[\w-]+)+/i.test(parts[parts.length - 1])) {
      url = parts.pop().replace(/^(https?:)?\/*/i, 'https://');
    }
    return { name: parts[0] || '', role: parts.slice(1).join(', '), url: url };
  }

  // Results text: every number (~75%, 200hrs, ~23$, rs23, 4x, 2→1 …) is wrapped — together with the
  // sign/text joined to it, and a unit word right after it ("200 hrs", "3 days") — in
  // <strong class="csd-num"> (primary blue). Commas, brackets and a final full stop stay outside.
  function highlightNumbers(text) {
    var src = String(text == null ? '' : text);
    var re = /[^\s,;:()]*\d[^\s,;:()]*(?:\s+(?:hrs?|hours?|mins?|minutes?|days?|weeks?|months?|years?|x|k|m|bn|percent)(?!\w))?/gi;
    var out = '', last = 0, m;
    while ((m = re.exec(src))) {
      var core = m[0].replace(/[.!?]+$/, '');
      out += esc(src.slice(last, m.index)) + '<strong class="csd-num">' + esc(core) + '</strong>' + esc(m[0].slice(core.length));
      last = m.index + m[0].length;
    }
    return out + esc(src.slice(last));
  }

  function keywordList(s) {
    return String(s || '').split(',').map(function (k) { return k.trim(); }).filter(Boolean);
  }

  // ---- Google Doc (published) -> clean HTML ------------------------------
  function classStyles(cssText) {
    var map = {};
    var re = /\.([\w-]+)\{([^}]*)\}/g, m;
    while ((m = re.exec(cssText))) {
      var body = m[2];
      map[m[1]] = {
        bold: /font-weight:\s*(700|800|900|bold)/.test(body),
        italic: /font-style:\s*italic/.test(body),
        underline: /text-decoration:\s*underline/.test(body)
      };
    }
    return map;
  }

  function unwrapGoogleUrl(href) {
    try {
      var u = new URL(href, location.href);
      if (/(^|\.)google\.com$/.test(u.hostname) && u.pathname === '/url' && u.searchParams.get('q')) {
        return u.searchParams.get('q');
      }
    } catch (e) { /* ignore */ }
    return href;
  }

  function docToHtml(docHtml) {
    var doc = new DOMParser().parseFromString(docHtml, 'text/html');
    var root = doc.getElementById('contents') || doc.body;
    var css = '';
    doc.querySelectorAll('style').forEach(function (s) { css += s.textContent; });
    var styles = classStyles(css);
    var HEAD = { H1: 'h2', H2: 'h2', H3: 'h3', H4: 'h4', H5: 'h4', H6: 'h4' };
    var KEEP = { P: 1, UL: 1, OL: 1, LI: 1, TABLE: 1, THEAD: 1, TBODY: 1, TR: 1, TD: 1, TH: 1, BLOCKQUOTE: 1, HR: 1 };

    function kids(el) {
      var out = '';
      el.childNodes.forEach(function (n) { out += conv(n); });
      return out;
    }

    function conv(n) {
      if (n.nodeType === 3) return esc(n.nodeValue);
      if (n.nodeType !== 1) return '';
      var tag = n.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return '';
      if (tag === 'BR') return '<br>';
      if (HEAD[tag]) {
        var h = kids(n);
        return h.replace(/<[^>]*>|&nbsp;|\s/g, '') ? '<' + HEAD[tag] + '>' + h + '</' + HEAD[tag] + '>' : '';
      }
      if (tag === 'IMG') {
        var src = n.getAttribute('src') || '';
        return /^(https?:|data:image)/i.test(src) ? '<img src="' + esc(src) + '" alt="' + esc(n.getAttribute('alt') || '') + '" loading="lazy">' : '';
      }
      if (tag === 'A') {
        var href = unwrapGoogleUrl(n.getAttribute('href') || '');
        var inner = kids(n);
        if (!/^(https?:|mailto:|\/)/i.test(href)) return inner;
        return '<a href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>';
      }
      if (tag === 'SPAN' || tag === 'B' || tag === 'I' || tag === 'U' || tag === 'STRONG' || tag === 'EM') {
        var inside = kids(n);
        if (!inside) return '';
        var st = {};
        (n.getAttribute('class') || '').split(/\s+/).forEach(function (c) {
          if (styles[c]) { st.bold = st.bold || styles[c].bold; st.italic = st.italic || styles[c].italic; }
        });
        if (tag === 'B' || tag === 'STRONG') st.bold = true;
        if (tag === 'I' || tag === 'EM') st.italic = true;
        if (st.bold) inside = '<strong>' + inside + '</strong>';
        if (st.italic) inside = '<em>' + inside + '</em>';
        return inside;
      }
      if (KEEP[tag]) {
        var t = tag.toLowerCase();
        if (tag === 'HR') return '<hr>';
        var c = kids(n);
        if (tag === 'P' && !c.replace(/<br>|&nbsp;|\s/g, '')) return '';
        var attrs = '';
        if ((tag === 'TD' || tag === 'TH')) {
          if (n.getAttribute('colspan')) attrs += ' colspan="' + esc(n.getAttribute('colspan')) + '"';
          if (n.getAttribute('rowspan')) attrs += ' rowspan="' + esc(n.getAttribute('rowspan')) + '"';
        }
        return '<' + t + attrs + '>' + c + '</' + t + '>';
      }
      return kids(n);
    }
    return kids(root);
  }


  function renderContent(b) {
    var box = $('cdContent');
    var docUrl = (b.doc || '').trim();
    if (!docUrl) { box.innerHTML = ''; return; }
    var fetchUrl = docUrl.replace(/([?&])embedded=true&?/, '$1').replace(/[?&]$/, '');
    fetchUrl += (fetchUrl.indexOf('?') > -1 ? '&' : '?') + '_=' + Date.now();
    fetch(fetchUrl, { cache: 'no-store', credentials: 'omit' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (html) {
        var out = docToHtml(html);
        if (!out.replace(/<[^>]*>|\s/g, '')) throw new Error('Empty document');
        box.innerHTML = out;
      })
      .catch(function (err) {
        console.warn('[case study] could not read the doc directly, embedding it instead:', err.message);
        var src = docUrl.indexOf('embedded=true') > -1 ? docUrl : docUrl + (docUrl.indexOf('?') > -1 ? '&' : '?') + 'embedded=true';
        box.innerHTML = '<iframe src="' + esc(src) + '" title="' + esc(b.title) + '" loading="lazy"></iframe>';
      });
  }

  function renderPage(b) {
    var kws = keywordList(b.keywords);
    var first = kws[0] || '';

    $('cdApproachTitle').textContent = b.approachtitle || '';
    var ab = $('cdApproachBody');
    ab.innerHTML = '';
    if (b.approachdescription) {
      b.approachdescription.split(/\r?\n+/).forEach(function (para) {
        para = para.trim();
        if (para) { var p = document.createElement('p'); p.textContent = para; ab.appendChild(p); }
      });
    }
    if (!b.approachtitle && !b.approachdescription) $('cdApproach').style.display = 'none';

    $('cdSmall').textContent = b.smalltitle || b.title;
    $('cdEyebrow').textContent = [b.type, first].filter(Boolean).join(' · ');
    $('cdTitle').textContent = b.title;
    $('cdLead').textContent = b.details || b.description || '';
    var res = $('cdResult');
    if (b.result) { res.innerHTML = '<strong style="color:var(--azure-deep)">Results:</strong> ' + highlightNumbers(b.result); }
    else { res.style.display = 'none'; }

    var parts = [];
    var au = parseAuthor(b.author);
    if (au.name) {
      var who = au.url
        ? '<a href="' + esc(au.url) + '" target="_blank" rel="noopener noreferrer" style="color:inherit">' + esc(au.name) + '</a>'
        : esc(au.name);
      parts.push('<span class="byline__author">' + who + (au.role ? ', ' + esc(au.role) : '') + '</span>');
    }
    var pub = parseDate(b.publishedon), upd = parseDate(b.updatedon);
    if (pub) parts.push('Published <time datetime="' + isoDate(pub) + '">' + fmtDate(pub) + '</time>');
    if (upd) parts.push('Updated <time datetime="' + isoDate(upd) + '">' + fmtDate(upd) + '</time>');
    $('cdByline').innerHTML = parts.join(' <span class="dot">·</span> ');
    if (!parts.length) $('cdByline').style.display = 'none';

    var chips = '';
    if (b.type) chips += '<span class="csd-chip">' + esc(b.type) + '</span>';
    kws.forEach(function (k, i) { chips += '<span class="csd-chip' + (i === 0 ? '' : ' csd-chip--soft') + '">' + esc(k) + '</span>'; });
    $('cdChips').innerHTML = chips;

    var cells = [['Client', b.client], ['Type', b.type], ['Focus', b.focus], ['What we did', b.what_we_did]];
    $('cdMeta').innerHTML = cells.map(function (c) { return '<div><dt>' + c[0] + '</dt><dd>' + esc(c[1]) + '</dd></div>'; }).join('');
  }

  function renderRelated(all, current) {
    var list = C.related(all, current);
    var html = '<section class="related-blogs prose"><h2>Related Case Studies</h2><div class="blog-list">';
    list.forEach(function (b) {
      html += '<div><a href="/case-studies/' + encodeURIComponent(b.slug) + '/">' + esc(b.title) + '</a></div>';
    });
    html += '</div></section>';
    $('related-case-studies').innerHTML = list.length ? html : '';
    if (!list.length) $('related-case-studies').style.display = 'none';
  }

  function setMeta(b) {
    document.title = b.title + ' | Webstrail';
    var desc = b.description || b.details || '';
    var m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
    m.content = desc;
    var canon = document.querySelector('link[rel="canonical"]');
    if (!canon) { canon = document.createElement('link'); canon.rel = 'canonical'; document.head.appendChild(canon); }
    canon.href = 'https://webstrail.com/case-studies/' + encodeURIComponent(b.slug) + '/';
  }

  function notFound() {
    document.title = 'Case study not found | Webstrail';
    var robots = document.createElement('meta'); robots.name = 'robots'; robots.content = 'noindex'; document.head.appendChild(robots);
    var main = document.querySelector('main');
    if (main) main.innerHTML = '<section class="section"><div class="wrap cd-notfound"><p class="eyebrow">404</p><h1>Case study not found</h1>' +
      '<p>We couldn’t find that case study. It may have been moved or removed.</p>' +
      '<p><a class="btn btn--brand" href="/case-studies/">Browse all case studies</a></p></div></section>';
  }

  var hero = $('cdHero');
  var prerendered = !!hero && hero.getAttribute('data-ssr') === '1';
  var bodyPrerendered = !!$('cdContent') && $('cdContent').getAttribute('data-ssr') === '1';
  if (prerendered && bodyPrerendered) return;

  var slug = getSlug();
  C.loadAll().then(function (all) {
    var cur = all.filter(function (x) { return x.slug.toLowerCase() === slug; })[0];
    if (!cur) { if (prerendered) return; return notFound(); }
    if (!prerendered) {
      setMeta(cur);
      renderPage(cur);
      renderRelated(all, cur);
    }
    renderContent(cur);
  }).catch(function (err) {
    console.error('[case study] failed to load', err);
    if (!prerendered) notFound();
  });
})();

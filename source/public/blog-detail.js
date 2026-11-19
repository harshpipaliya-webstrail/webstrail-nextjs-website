/* /blog/<slug> — single blog view. Everything is driven by the blogs data (blogs API). */
(function () {
  if (window.__blogDetailInit) return;
  window.__blogDetailInit = true;

  var B = window.WebstrailBlogs;
  var $ = function (id) { return document.getElementById(id); };
  var esc = B.esc;

  function getSlug() {
    var parts = location.pathname.split('/').filter(Boolean);
    var i = parts.indexOf('blog');
    var s = i > -1 ? parts[i + 1] : '';
    try { return decodeURIComponent(s || '').toLowerCase(); } catch (e) { return (s || '').toLowerCase(); }
  }

  // ---- dates -------------------------------------------------------------
  // API dates look like M/D/YYYY; ISO dates are also handled.
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

  // ---- "Name | Role | https://linkedin..." --------------------------------
  function parseUploader(raw) {
    var parts = String(raw || '').split('|').map(function (p) { return p.trim(); }).filter(Boolean);
    var url = '';
    if (parts.length > 1 && /^(https?:)?\/*(www\.)?[\w-]+(\.[\w-]+)+/i.test(parts[parts.length - 1])) {
      url = parts.pop().replace(/^(https?:)?\/*/i, 'https://');
    }
    return { name: parts[0] || '', role: parts.slice(1).join(', '), url: url };
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
    var box = $('bdContent');
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
        // Fallback: embed the published document as-is.
        console.warn('[blog] could not read the doc directly, embedding it instead:', err.message);
        var src = docUrl.indexOf('embedded=true') > -1 ? docUrl : docUrl + (docUrl.indexOf('?') > -1 ? '&' : '?') + 'embedded=true';
        box.innerHTML = '<iframe src="' + esc(src) + '" title="' + esc(b.title) + '" loading="lazy"></iframe>';
      });
  }

  function renderHero(b) {
    var title = b.title;
    $('bdCrumb').textContent = title;
    $('bdCategory').textContent = b.category || '';
    $('bdCategory').style.display = b.category ? '' : 'none';
    $('bdTitle').textContent = title;
    $('bdLede').textContent = b.details || b.description || '';

    var parts = [];
    var up = parseUploader(b.uploadedby);
    if (up.name) {
      var who = up.url
        ? '<a href="' + esc(up.url) + '" target="_blank" rel="noopener noreferrer" style="color:inherit">' + esc(up.name) + '</a>'
        : esc(up.name);
      parts.push('<span class="byline__author">By ' + who + (up.role ? ', ' + esc(up.role) : '') + '</span>');
    }
    var c = parseDate(b.createdon), u = parseDate(b.updatedon);
    if (c) parts.push('Published <time datetime="' + isoDate(c) + '">' + fmtDate(c) + '</time>');
    if (u) parts.push('Updated <time datetime="' + isoDate(u) + '">' + fmtDate(u) + '</time>');
    $('bdByline').innerHTML = parts.join(' <span class="dot">·</span> ');

    if (b.heroimage) {
      var img = document.createElement('img');
      img.className = 'bd-hero-img';
      img.alt = title;
      img.decoding = 'async';
      img.onerror = function () { $('bdVisual').style.display = 'none'; };
      img.src = b.heroimage;
      $('bdImage').appendChild(img);
    } else {
      $('bdVisual').style.display = 'none';
    }
  }

  // Related = every other blog (static + dynamic) in the same category.
  function renderRelated(all, current) {
    var list = B.related(all, current);
    var html = '<section class="related-blogs prose"><h2>Related Blogs</h2><div class="blog-list">';
    list.forEach(function (b) {
      html += '<div><a href="/blog/' + encodeURIComponent(b.slug) + '/">' + esc(b.title) + '</a></div>';
    });
    html += '</div></section>';
    $('related-blogs').innerHTML = list.length ? html : '';
    if (!list.length) $('related-blogs').style.display = 'none';
  }

  function setMeta(b) {
    document.title = b.title + ' | Webstrail';
    var desc = b.description || b.details || '';
    var m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
    m.content = desc;
    var canon = document.querySelector('link[rel="canonical"]');
    if (!canon) { canon = document.createElement('link'); canon.rel = 'canonical'; document.head.appendChild(canon); }
    canon.href = 'https://webstrail.com/blog/' + encodeURIComponent(b.slug) + '/';
  }

  function notFound() {
    document.title = 'Blog not found | Webstrail';
    $('bdHeroGrid').innerHTML = '<div class="bd-notfound"><p class="eyebrow">404</p><h1>Blog not found</h1>' +
      '<p class="lede">We couldn\'t find that blog. It may have been moved or removed.</p>' +
      '<p><a class="btn btn--brand" href="/blog/">Browse all blogs</a></p></div>';
    var art = document.querySelector('.blog-wrapper');
    if (art && art.parentNode) art.parentNode.parentNode.style.display = 'none';
  }

  var slug = getSlug();
  B.loadAll().then(function (all) {
    var cur = all.filter(function (x) { return x.slug.toLowerCase() === slug; })[0];
    if (!cur) return notFound();
    setMeta(cur);
    renderHero(cur);
    renderRelated(all, cur);
    renderContent(cur);
  }).catch(function (err) {
    console.error('[blog] failed to load', err);
    notFound();
  });
})();

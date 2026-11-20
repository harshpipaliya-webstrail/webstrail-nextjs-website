/* /case-studies index.
 * The 17 static cards are in the HTML and always visible. Case studies from the API are added to
 * the SAME grid with identical cards: the first 3 are visible, the rest sit behind "Show more".
 * The build also writes them into the HTML (scripts/inject-case-studies.mjs); this script wires
 * up "Show more" and refreshes the list from the API. While the data is unknown, 3 skeleton cards
 * sit after the static ones. "Showing X of Y case studies" and the button only appear once the
 * API data is known. */
(function () {
  var C = window.WebstrailCaseStudies;
  var grid = document.getElementById('csGrid');
  if (!C || !grid || grid.getAttribute('data-merged')) return;
  grid.setAttribute('data-merged', '1');

  var FIRST = 3;   // API case studies visible right away
  var STEP = 6;    // API case studies revealed per "Show more" click
  var countEl = document.getElementById('csCount');
  var PATH = /^\/case-studies\/([^\/]+)\/?$/;

  var have = {};
  var staticCount = 0;
  Array.prototype.forEach.call(grid.querySelectorAll('a.cs-card:not([data-dyn])'), function (a) {
    var m = (a.getAttribute('href') || '').match(PATH);
    if (m) { have[m[1].toLowerCase()] = true; staticCount++; }
  });

  function dynCards() { return Array.prototype.slice.call(grid.querySelectorAll('a.cs-card[data-dyn]')); }
  function removeSkeletons() {
    Array.prototype.forEach.call(grid.querySelectorAll('.cs-card--skeleton'), function (n) { n.parentNode.removeChild(n); });
  }
  function slugOf(a) { return ((a.getAttribute('href') || '').match(PATH) || [])[1] || ''; }

  function cardHtml(b) {
    return '<a class="cs-card" href="/case-studies/' + encodeURIComponent(b.slug) + '/" data-dyn="1" hidden>' +
      '<div class="cs-card__top"><span class="cs-tag">' + C.esc(b.type) + '</span>' +
      (b.keyword ? '<span class="cs-theme">' + C.esc(b.keyword) + '</span>' : '') + '</div>' +
      '<h3>' + C.esc(b.title) + '</h3>' +
      '<p>' + C.esc(b.description) + '</p>' +
      '<span class="cs-readmore">Read Case Study' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span></a>';
  }

  // (Re)attach counts + "Show more" to whatever API cards are in the grid.
  function wire() {
    var cards = dynCards();
    var wrap = document.getElementById('csShowMore');
    var total = staticCount + cards.length;
    function shown() { return cards.filter(function (c) { return !c.hidden; }).length; }
    function update() {
      if (countEl) countEl.textContent = 'Showing ' + (staticCount + shown()) + ' of ' + total + ' case studies';
      if (wrap) wrap.hidden = shown() >= cards.length;
    }
    if (cards.length > FIRST) {
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.id = 'csShowMore';
        wrap.className = 'cs-showmore';
        wrap.innerHTML = '<button type="button" class="btn btn--lg btn--secondary">Show more</button>';
        grid.parentNode.insertBefore(wrap, countEl || null);
      }
      var btn = wrap.querySelector('button');
      if (!btn.__wired) {
        btn.__wired = true;
        btn.addEventListener('click', function () {
          var n = STEP;
          cards.forEach(function (c) { if (n > 0 && c.hidden) { c.hidden = false; n--; } });
          update();
        });
      }
    } else if (wrap) {
      wrap.parentNode.removeChild(wrap);
      wrap = null;
    }
    if (shown() === 0) cards.slice(0, FIRST).forEach(function (c) { c.hidden = false; });
    update();
  }

  C.load().then(function (dyn) {
    var seen = {};
    var list = dyn.filter(function (b) {
      var k = b.slug.toLowerCase();
      if (have[k] || seen[k]) return false;
      seen[k] = true;
      return true;
    });

    removeSkeletons();
    var current = dynCards().map(slugOf).join('|').toLowerCase();
    var fresh = list.map(function (b) { return b.slug; }).join('|').toLowerCase();
    if (current !== fresh) {
      dynCards().forEach(function (c) { c.parentNode.removeChild(c); });
      if (list.length) grid.insertAdjacentHTML('beforeend', list.map(cardHtml).join(''));
    }
    wire();
  }).catch(function () {
    // The API could not be reached: keep whatever the build rendered (just the static case studies
    // if the build could not reach it either); no skeletons left behind, no count, no button.
    removeSkeletons();
    if (dynCards().length) wire();
  });
})();

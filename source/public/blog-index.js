/* /blog index.
 * The 12 static cards are server-rendered. The blogs from the API are ALSO server-rendered at
 * build time into the same grid (first 3 visible, the rest hidden behind "Show more"; see
 * app/_blog-index.tsx). This script wires up "Show more" and keeps the list fresh: if the API now
 * returns different blogs than the build did, the API blogs are rebuilt. If the build could not
 * reach the API, 3 skeleton cards are in the HTML and are replaced here.
 * "Showing X of Y blogs" and the button only exist once the API data is known. */
(function () {
  var B = window.WebstrailBlogs;
  var grid = document.getElementById('csGrid');
  if (!B || !grid || grid.getAttribute('data-merged')) return;
  grid.setAttribute('data-merged', '1');

  var FIRST = 3;   // API blogs visible right away
  var STEP = 6;    // API blogs revealed per "Show more" click
  var countEl = document.getElementById('csCount');

  var have = {};
  var staticCount = 0;
  Array.prototype.forEach.call(grid.querySelectorAll('a.cs-card:not([data-dyn])'), function (a) {
    var m = (a.getAttribute('href') || '').match(/^\/blog\/([^\/]+)\/?$/);
    if (m) { have[m[1].toLowerCase()] = true; staticCount++; }
  });

  function dynCards() { return Array.prototype.slice.call(grid.querySelectorAll('a.cs-card[data-dyn]')); }
  function removeSkeletons() {
    Array.prototype.forEach.call(grid.querySelectorAll('.cs-card--skeleton'), function (n) { n.parentNode.removeChild(n); });
  }
  function slugOf(a) { return ((a.getAttribute('href') || '').match(/^\/blog\/([^\/]+)\/?$/) || [])[1] || ''; }

  function cardHtml(b) {
    return '<a class="cs-card" href="/blog/' + encodeURIComponent(b.slug) + '/" data-dyn="1" hidden>' +
      '<div class="cs-card__top"><span class="cs-tag">' + B.esc(b.category) + '</span></div>' +
      '<h3>' + B.esc(b.title) + '</h3>' +
      '<p>' + B.esc(b.description) + '</p>' +
      '<span class="cs-readmore">Read Blog ' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></span></a>';
  }

  // (Re)attach counts + "Show more" to whatever API cards are in the grid.
  function wire() {
    var cards = dynCards();
    var wrap = document.getElementById('csShowMore');
    var total = staticCount + cards.length;
    function shown() { return cards.filter(function (c) { return !c.hidden; }).length; }
    function update() {
      if (countEl) countEl.textContent = 'Showing ' + (staticCount + shown()) + ' of ' + total + ' blogs';
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
    // make sure the first FIRST are visible when cards were (re)built
    if (shown() === 0) cards.slice(0, FIRST).forEach(function (c) { c.hidden = false; });
    update();
  }

  B.load().then(function (dyn) {
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
    // The API could not be reached: keep whatever the build rendered (just the static blogs if the
    // build could not reach it either); no skeletons left behind.
    removeSkeletons();
    if (dynCards().length) wire();
  });
})();

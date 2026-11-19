/* /blog index.
 * The 12 static cards are server-rendered and always visible. API blogs are added to the SAME
 * grid with identical cards: the first 3 are shown, the rest sit behind a "Show more" button.
 * While the data loads, 3 skeleton cards sit after the static ones. The "Showing X of Y blogs"
 * line and the button only appear after the data has loaded successfully. */
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
  Array.prototype.forEach.call(grid.querySelectorAll('a.cs-card'), function (a) {
    var m = (a.getAttribute('href') || '').match(/^\/blog\/([^\/]+)\/?$/);
    if (m) { have[m[1].toLowerCase()] = true; staticCount++; }
  });

  function removeSkeletons() {
    Array.prototype.forEach.call(grid.querySelectorAll('.cs-card--skeleton'), function (n) { n.parentNode.removeChild(n); });
  }

  function cardHtml(b) {
    return '<a class="cs-card" href="/blog/' + encodeURIComponent(b.slug) + '/" hidden>' +
      '<div class="cs-card__top"><span class="cs-tag">' + B.esc(b.category) + '</span></div>' +
      '<h3>' + B.esc(b.title) + '</h3>' +
      '<p>' + B.esc(b.description) + '</p>' +
      '<span class="cs-readmore">Read Blog ' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></span></a>';
  }

  // Only the API blogs matter here (static blogs are already on the page).
  B.load().then(function (dyn) {
    var seen = {};
    var list = dyn.filter(function (b) {
      var k = b.slug.toLowerCase();
      if (have[k] || seen[k]) return false;
      seen[k] = true;
      return true;
    });

    removeSkeletons();
    var cards = [];
    if (list.length) {
      grid.insertAdjacentHTML('beforeend', list.map(cardHtml).join(''));
      cards = Array.prototype.slice.call(grid.querySelectorAll('a.cs-card[hidden]'));
    }

    var total = staticCount + cards.length;
    var shown = 0; // API cards visible
    var wrap = null;

    function update() {
      if (countEl) countEl.textContent = 'Showing ' + (staticCount + shown) + ' of ' + total + ' blogs';
      if (wrap) wrap.hidden = shown >= cards.length;
    }
    function reveal(n) {
      var end = Math.min(shown + n, cards.length);
      for (var i = shown; i < end; i++) cards[i].hidden = false;
      shown = end;
      update();
    }

    if (cards.length > FIRST) {
      wrap = document.createElement('div');
      wrap.className = 'cs-showmore';
      wrap.hidden = true;
      wrap.innerHTML = '<button type="button" class="btn btn--lg btn--secondary">Show more</button>';
      wrap.firstChild.addEventListener('click', function () { reveal(STEP); });
      grid.parentNode.insertBefore(wrap, countEl || null);
    }
    reveal(FIRST);
  }).catch(function () {
    // The API could not be reached: just the static blogs, no count, no button.
    removeSkeletons();
  });
})();

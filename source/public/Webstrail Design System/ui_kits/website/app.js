/* Webstrail marketing site — interactions
   Vanilla JS: sticky nav, mobile menu, reveal-on-scroll, work filter, form. */
(function () {
  "use strict";

  /* ---- sticky nav state ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add("is-stuck");
    else nav.classList.remove("is-stuck");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  if (burger) {
    burger.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") menu.classList.remove("is-open");
    });
  }

  /* ---- reveal on scroll ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- work filter ---- */
  var filters = document.getElementById("filters");
  var grid = document.getElementById("workGrid");
  if (filters && grid) {
    var cases = Array.prototype.slice.call(grid.querySelectorAll(".case"));
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      filters.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var f = btn.getAttribute("data-filter");
      cases.forEach(function (card) {
        var seg = card.getAttribute("data-seg");
        var show = f === "all" || seg === f || (f === "dso" && seg === "product");
        // map: DSOs & groups loosely includes platform products
        card.style.display = show ? "" : "none";
      });
    });
  }

  /* ---- discovery-call form (fake submit) ---- */
  var form = document.getElementById("ccForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.querySelector("#f-name").value || "there").split(" ")[0];
      form.innerHTML =
        '<div class="form__ok">' +
        '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>' +
        "<h3>Thanks, " + name + ".</h3>" +
        '<p style="font:var(--text-body-md);color:var(--body);margin-top:8px">We\'ll be in touch within one business day to set up your discovery call.</p>' +
        "</div>";
    });
  }

  /* ---- smooth anchor scroll with nav offset ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN — Navigation, Mobile Menu, Dropdowns, Smooth Scroll
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Mobile Menu Toggle ──────────────────────────────────────────────── */
  var menuBtn  = document.getElementById('menu-btn');
  var mobileNav = document.getElementById('mobile-nav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  /* ── Mobile Accordion Sections ───────────────────────────────────────── */
  var accordionToggles = document.querySelectorAll('.mobile-nav__toggle');
  for (var i = 0; i < accordionToggles.length; i++) {
    accordionToggles[i].addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      var submenu = this.nextElementSibling;
      if (submenu) submenu.classList.toggle('is-open');
    });
  }

  /* ── Desktop Dropdown Menus ──────────────────────────────────────────── */
  var dropdowns = document.querySelectorAll('.site-header__dropdown');
  for (var d = 0; d < dropdowns.length; d++) {
    var trigger = dropdowns[d].querySelector('.site-header__dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var dropdown = this.closest('.site-header__dropdown');
        var isOpen = dropdown.classList.toggle('is-open');
        this.setAttribute('aria-expanded', isOpen);
      });
    }
  }

  /* ── Click Outside to Close ──────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    // Close dropdowns
    var openDropdowns = document.querySelectorAll('.site-header__dropdown.is-open');
    for (var j = 0; j < openDropdowns.length; j++) {
      if (!openDropdowns[j].contains(e.target)) {
        openDropdowns[j].classList.remove('is-open');
        var t = openDropdowns[j].querySelector('.site-header__dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    }
  });

  /* ── Escape Key Handler ──────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      // Close mobile nav
      if (mobileNav && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
      // Close dropdowns
      var openDropdowns = document.querySelectorAll('.site-header__dropdown.is-open');
      for (var k = 0; k < openDropdowns.length; k++) {
        openDropdowns[k].classList.remove('is-open');
        var tr = openDropdowns[k].querySelector('.site-header__dropdown-trigger');
        if (tr) tr.setAttribute('aria-expanded', 'false');
      }
    }
  });

  /* ── Smooth Scroll for Anchor Links ──────────────────────────────────── */
  var anchors = document.querySelectorAll('a[href^="#"]');
  for (var a = 0; a < anchors.length; a++) {
    anchors[a].addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id.length <= 1) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 56;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  }

})();

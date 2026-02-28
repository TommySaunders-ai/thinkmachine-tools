/* ═══════════════════════════════════════════════════════════════════════════
   TEMPLATES — Platform filtering for Social Media Template gallery
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var filterBtns = document.querySelectorAll('.template-filter__btn');
  var cards = document.querySelectorAll('.template-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var platform = btn.getAttribute('data-platform');

      // Update active state
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      // Filter cards
      var visibleCount = 0;
      cards.forEach(function (card) {
        if (platform === 'all' || card.getAttribute('data-platform') === platform) {
          card.hidden = false;
          visibleCount++;
        } else {
          card.hidden = true;
        }
      });

      // Show empty state if nothing matches
      var empty = document.querySelector('.template-gallery__empty');
      if (empty) {
        empty.hidden = visibleCount > 0;
      }
    });
  });
})();

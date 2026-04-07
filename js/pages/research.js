/**
 * research.js — Filter tags to show/hide papers by category,
 * staggered scaleIn entrance animation using IntersectionObserver.
 */

(function () {
  'use strict';

  var observer = null;

  function setupFilters() {
    var tags = document.querySelectorAll('#page-research .filter-tag');
    var cards = document.querySelectorAll('#page-research .paper-card');

    tags.forEach(function (tag) {
      tag.addEventListener('click', function () {
        tags.forEach(function (t) { t.classList.remove('active'); });
        tag.classList.add('active');

        var filter = tag.getAttribute('data-filter');

        cards.forEach(function (card) {
          if (filter === 'all') {
            card.classList.remove('hidden');
          } else {
            var cats = (card.getAttribute('data-category') || '').split(',');
            card.classList.toggle('hidden', cats.indexOf(filter) === -1);
          }
        });

        reanimateVisible();
      });
    });
  }

  function reanimateVisible() {
    var cards = document.querySelectorAll('#page-research .paper-card:not(.hidden)');
    cards.forEach(function (card, i) {
      card.classList.remove('visible');
      card.style.animationDelay = (i * 0.06) + 's';
      void card.offsetHeight;
      card.classList.add('visible');
    });
  }

  function setupScrollAnimations() {
    if (observer) observer.disconnect();
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cards = document.querySelectorAll('#page-research .paper-card');

    if (reducedMotion) {
      cards.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function (card, i) {
      card.style.animationDelay = (i * 0.06) + 's';
      observer.observe(card);
    });
  }

  function init() {
    setupFilters();
    setupScrollAnimations();
  }

  function destroy() {
    if (observer) observer.disconnect();
  }

  if (window.Router) {
    window.Router.register('research', { init: init, destroy: destroy });
  }
})();

/**
 * blog.js — countUp animation for stats, slideUp stagger
 * for blog entries using IntersectionObserver.
 */

(function () {
  'use strict';

  var observer = null;

  function countUp(el, target, duration) {
    var start = 0;
    var startTime = null;
    duration = duration || 1200;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  function animateStats() {
    var statEls = document.querySelectorAll('#page-blog .stat-number');
    statEls.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      countUp(el, target, 1200);
    });
  }

  function setupScrollAnimations() {
    if (observer) observer.disconnect();
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('#page-blog .blog-item');

    if (reducedMotion) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(items).indexOf(entry.target);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, idx * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(function (el) { observer.observe(el); });
  }

  function init() {
    animateStats();
    setupScrollAnimations();
  }

  function destroy() {
    if (observer) observer.disconnect();
  }

  if (window.Router) {
    window.Router.register('blog', { init: init, destroy: destroy });
  }
})();

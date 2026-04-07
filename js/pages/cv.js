/**
 * cv.js — IntersectionObserver-driven timeline animations
 * and skill bar progress fill on scroll.
 */

(function () {
  'use strict';

  var observer = null;

  function animateSkillBars() {
    var bars = document.querySelectorAll('#page-cv .skill-fill');
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(function (bar) { barObserver.observe(bar); });
  }

  function setupScrollAnimations() {
    if (observer) observer.disconnect();
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var items = document.querySelectorAll('#page-cv .timeline-item');
    if (reducedMotion) {
      items.forEach(function (el) { el.classList.add('visible'); });
      animateSkillBars();
      return;
    }

    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(items).indexOf(entry.target);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, idx * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    items.forEach(function (el) { observer.observe(el); });
    animateSkillBars();
  }

  function init() {
    setupScrollAnimations();
  }

  function destroy() {
    if (observer) observer.disconnect();
  }

  if (window.Router) {
    window.Router.register('cv', { init: init, destroy: destroy });
  }
})();

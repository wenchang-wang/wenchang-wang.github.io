/**
 * contact.js — 3D flip card entrance, form ripple effect,
 * simulated submit with particle burst success animation.
 */

(function () {
  'use strict';

  var observer = null;

  function setupCardAnimations() {
    if (observer) observer.disconnect();
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cards = document.querySelectorAll('#page-contact .contact-card');

    if (reducedMotion) {
      cards.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(cards).indexOf(entry.target);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, idx * 120);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach(function (card) { observer.observe(card); });
  }

  function setupRipple() {
    var btn = document.querySelector('#page-contact .submit-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var circle = document.createElement('span');
      circle.className = 'ripple-circle';
      circle.style.left = (e.clientX - rect.left - 10) + 'px';
      circle.style.top = (e.clientY - rect.top - 10) + 'px';
      btn.appendChild(circle);
      setTimeout(function () { circle.remove(); }, 600);
    });
  }

  function createParticleBurst(x, y) {
    var container = document.createElement('div');
    container.className = 'particle-burst';
    container.style.left = x + 'px';
    container.style.top = y + 'px';
    var colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#5865F2', '#eb459e', '#57f287'];
    for (var i = 0; i < 20; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var angle = (Math.PI * 2 / 20) * i;
      var dist = 40 + Math.random() * 60;
      p.style.setProperty('--tx', (Math.cos(angle) * dist) + 'px');
      p.style.setProperty('--ty', (Math.sin(angle) * dist) + 'px');
      p.style.background = colors[i % colors.length];
      container.appendChild(p);
    }
    document.body.appendChild(container);
    setTimeout(function () { container.remove(); }, 1000);
  }

  function setupForm() {
    var form = document.getElementById('contact-form');
    var formEl = document.querySelector('#page-contact .contact-form-section');
    var successEl = document.querySelector('#page-contact .form-success');
    if (!form || !successEl) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('.submit-btn');
      var rect = btn.getBoundingClientRect();
      createParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

      form.style.display = 'none';
      successEl.classList.add('show');
    });
  }

  function init() {
    setupCardAnimations();
    setupRipple();
    setupForm();
  }

  function destroy() {
    if (observer) observer.disconnect();
    var form = document.getElementById('contact-form');
    var successEl = document.querySelector('#page-contact .form-success');
    if (form) form.style.display = '';
    if (successEl) successEl.classList.remove('show');
  }

  if (window.Router) {
    window.Router.register('contact', { init: init, destroy: destroy });
  }
})();

/**
 * contact.js — Terminal-themed contact form with mailto: integration,
 * 3D flip card entrance, and typing animation.
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

  function setupForm() {
    var form = document.getElementById('contact-form');
    var successEl = document.querySelector('#page-contact .form-success');
    if (!form || !successEl) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name  = document.getElementById('c-name').value.trim();
      var email = document.getElementById('c-email').value.trim();
      var msg   = document.getElementById('c-msg').value.trim();
      if (!name || !email || !msg) return;

      var subject = encodeURIComponent('[Website] Message from ' + name);
      var body = encodeURIComponent(
        'From: ' + name + '\n' +
        'Reply-To: ' + email + '\n\n' +
        msg
      );

      window.location.href = 'mailto:wenchangwang@stu.pku.edu.cn?subject=' + subject + '&body=' + body;

      form.style.display = 'none';
      successEl.classList.add('show');
    });
  }

  function init() {
    setupCardAnimations();
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

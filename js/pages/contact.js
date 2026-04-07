/**
 * contact.js — Terminal-themed contact form with direct email via Formsubmit,
 * 3D flip card entrance, and theme-adaptive terminal.
 */

(function () {
  'use strict';

  var ENDPOINT = 'https://formsubmit.co/ajax/wenchangwang@stu.pku.edu.cn';
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

  function removeStatus() {
    var old = document.querySelector('#page-contact .terminal-status');
    if (old) old.remove();
  }

  function addStatus(html) {
    removeStatus();
    var body = document.querySelector('#page-contact .terminal-body');
    if (!body) return;
    var div = document.createElement('div');
    div.className = 'terminal-status';
    div.innerHTML = html;
    body.appendChild(div);
  }

  function setupForm() {
    var form = document.getElementById('contact-form');
    var successEl = document.querySelector('#page-contact .form-success');
    if (!form || !successEl) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl  = document.getElementById('c-name');
      var emailEl = document.getElementById('c-email');
      var msgEl   = document.getElementById('c-msg');
      var name  = nameEl.value.trim();
      var email = emailEl.value.trim();
      var msg   = msgEl.value.trim();
      if (!name || !email || !msg) return;

      var btn = form.querySelector('.terminal-submit');
      var origHTML = btn.innerHTML;
      btn.innerHTML = '<span class="t-prompt">$</span> sending<span class="t-dots"></span>';
      btn.disabled = true;
      removeStatus();

      fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: msg,
          _subject: '[Website] Message from ' + name
        })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          form.style.display = 'none';
          successEl.classList.add('show');
        } else {
          btn.innerHTML = origHTML;
          btn.disabled = false;
          addStatus('<span class="t-prompt t-err">&gt;&gt;</span> <span class="t-err">Error: send failed. Try again.</span>');
        }
      })
      .catch(function () {
        btn.innerHTML = origHTML;
        btn.disabled = false;
        addStatus('<span class="t-prompt t-err">&gt;&gt;</span> <span class="t-err">Network error. Check connection.</span>');
      });
    });
  }

  function init() {
    setupCardAnimations();
    setupForm();
  }

  function destroy() {
    if (observer) observer.disconnect();
    removeStatus();
    var form = document.getElementById('contact-form');
    var successEl = document.querySelector('#page-contact .form-success');
    if (form) form.style.display = '';
    if (successEl) successEl.classList.remove('show');
  }

  if (window.Router) {
    window.Router.register('contact', { init: init, destroy: destroy });
  }
})();

/**
 * router.js — Hash-based SPA router with crossfade transitions.
 * Manages page visibility, active nav links, document title,
 * and calls page-specific init/destroy hooks.
 */

(function () {
  'use strict';

  var SITE_NAME = 'Wenchang Wang';

  var routes = {
    home:     { title: 'Home', titleZh: '\u9996\u9875' },
    cv:       { title: 'CV', titleZh: '\u7b80\u5386' },
    research: { title: 'Research', titleZh: '\u7814\u7a76' },
    blog:     { title: 'Blog', titleZh: '\u535a\u5ba2' },
    contact:  { title: 'Contact', titleZh: '\u8054\u7cfb' }
  };

  var pageHooks = {};
  var currentPage = null;
  var isTransitioning = false;

  function registerPage(name, hooks) {
    pageHooks[name] = hooks;
  }

  function getPageFromHash() {
    var hash = window.location.hash.replace('#', '').split('?')[0];
    return routes[hash] ? hash : 'home';
  }

  function updateTitle(pageName) {
    var route = routes[pageName];
    if (!route) return;
    var lang = (window.I18n && window.I18n.getCurrentLang()) || 'en';
    var pageTitle = lang === 'zh' ? route.titleZh : route.title;
    document.title = pageTitle + ' | ' + SITE_NAME;
  }

  function updateNavLinks(pageName) {
    document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(function (a) {
      var href = a.getAttribute('href');
      var target = href ? href.replace('#', '') : '';
      a.classList.toggle('active', target === pageName);
    });
  }

  function navigate(pageName) {
    if (pageName === currentPage || isTransitioning) return;
    isTransitioning = true;

    var oldEl = currentPage ? document.getElementById('page-' + currentPage) : null;
    var newEl = document.getElementById('page-' + pageName);
    if (!newEl) { isTransitioning = false; return; }

    if (oldEl && currentPage) {
      if (pageHooks[currentPage] && pageHooks[currentPage].destroy) {
        pageHooks[currentPage].destroy();
      }
      oldEl.classList.add('fade-out');

      setTimeout(function () {
        oldEl.classList.remove('active', 'fade-in', 'fade-out');
        showNew();
      }, 200);
    } else {
      showNew();
    }

    function showNew() {
      newEl.classList.add('active');
      void newEl.offsetHeight;
      newEl.classList.add('fade-in');

      currentPage = pageName;
      updateTitle(pageName);
      updateNavLinks(pageName);

      window.scrollTo({ top: 0, behavior: 'instant' });

      if (pageHooks[pageName] && pageHooks[pageName].init) {
        pageHooks[pageName].init();
      }

      setTimeout(function () {
        isTransitioning = false;
      }, 300);
    }
  }

  function onHashChange() {
    navigate(getPageFromHash());
  }

  function init() {
    window.addEventListener('hashchange', onHashChange);

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var hash = link.getAttribute('href').replace('#', '');
      if (routes[hash]) {
        e.preventDefault();
        window.location.hash = hash;
      }
    });

    navigate(getPageFromHash());
  }

  window.Router = {
    register: registerPage,
    navigate: navigate,
    current: function () { return currentPage; }
  };

  if (document.readyState === 'complete') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();

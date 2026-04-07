/**
 * theme.js — Dark/light theme management.
 * Always follows system preference on load. Manual toggle works per session.
 * Icon convention: show the icon you'll switch TO (moon in light, sun in dark).
 */

(function () {
  'use strict';

  var html = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    updateIcons(theme);
  }

  function updateIcons(theme) {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      var sun = btn.querySelector('.icon-sun');
      var moon = btn.querySelector('.icon-moon');
      if (!sun || !moon) return;
      // Show the icon for the mode you'll switch TO
      sun.style.display = theme === 'dark' ? 'block' : 'none';
      moon.style.display = theme === 'dark' ? 'none' : 'block';
    });
  }

  function toggle() {
    var current = html.getAttribute('data-theme') || getSystemTheme();
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  function init() {
    applyTheme(getSystemTheme());

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', toggle);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ThemeManager = { toggle: toggle, apply: applyTheme };
})();

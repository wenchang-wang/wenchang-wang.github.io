/**
 * homepage.js — Pixel-art hero name (two lines), typewriter subtitle,
 * particle canvas start/stop, and scroll-triggered section animations.
 *
 * Each line is rasterized on an offscreen canvas with a bold system font,
 * down-sampled at 2×2 pixel cells, and each filled cell becomes a small
 * colored DOM element that flies in from a random position.
 */

(function () {
  'use strict';

  var nameBuilt = false;
  var typeTimer = null;
  var observer = null;
  var TOKEN_N = 6;

  /* ────────────────────────────────────────
     PIXEL NAME — two-line rasterizer
     ──────────────────────────────────────── */

  /**
   * Rasterize a single text string into pixel blocks inside `parentEl`.
   * Returns the created line wrapper element.
   */
  function rasterLine(text, parentEl, tokenStart) {
    var fontSize = 34;
    var grid     = 2;
    var blk      = 3;
    var gap      = 0.6;
    var step     = blk + gap;
    var threshold = 80;
    var font = '800 ' + fontSize + 'px -apple-system,BlinkMacSystemFont,"PingFang SC","Noto Sans SC","Microsoft YaHei",sans-serif';

    /* offscreen canvas */
    var oc = document.createElement('canvas');
    var ox = oc.getContext('2d');
    ox.font = font;
    var tw = ox.measureText(text).width;
    oc.width  = Math.ceil(tw) + 16;
    oc.height = Math.ceil(fontSize * 1.4);

    ox.font = font;
    ox.fillStyle = '#fff';
    ox.textBaseline = 'top';
    ox.fillText(text, 8, fontSize * 0.1);

    var imgD = ox.getImageData(0, 0, oc.width, oc.height);
    var px   = imgD.data;
    var cols = Math.floor(oc.width  / grid);
    var rows = Math.floor(oc.height / grid);

    /* per-character column edges for token coloring */
    var edges = [8], xAcc = 8;
    for (var ci = 0; ci < text.length; ci++) {
      xAcc += ox.measureText(text[ci]).width;
      edges.push(xAcc);
    }

    function charAt(col) {
      var px2 = col * grid + grid / 2;
      for (var i = edges.length - 2; i >= 0; i--) {
        if (px2 >= edges[i]) return i;
      }
      return 0;
    }

    var charTk = {}, tkI = tokenStart || 0;
    for (var i = 0; i < text.length; i++) {
      if (text[i] !== ' ' && text[i] !== '\u00A0') {
        charTk[i] = tkI % TOKEN_N;
        tkI++;
      }
    }

    /* line wrapper */
    var line = document.createElement('div');
    line.className = 'pixel-line';
    line.style.width    = (cols * step) + 'px';
    line.style.height   = (rows * step) + 'px';
    line.style.position = 'relative';
    line.style.margin   = '0 auto';

    /* sample & emit blocks */
    var frag = document.createDocumentFragment();
    for (var row = 0; row < rows; row++) {
      var r0 = row * grid, r1 = Math.min(r0 + grid, oc.height);
      for (var col = 0; col < cols; col++) {
        var c0 = col * grid, c1 = Math.min(c0 + grid, oc.width);
        var a = 0, cnt = 0;
        for (var py = r0; py < r1; py++) {
          for (var ppx = c0; ppx < c1; ppx++) {
            a += px[(py * oc.width + ppx) * 4 + 3];
            cnt++;
          }
        }
        if (cnt > 0 && a / cnt > threshold) {
          var chi = charAt(col);
          var tk  = charTk[chi];
          if (tk === undefined) continue;

          var sp = document.createElement('span');
          sp.className = 'px-block tk-' + tk;
          var dx = ((Math.random() - 0.5) * 180) | 0;
          var dy = ((Math.random() - 0.5) * 120) | 0;
          sp.style.cssText =
            'left:' + (col * step).toFixed(1) + 'px;' +
            'top:'  + (row * step).toFixed(1) + 'px;' +
            'width:' + blk + 'px;height:' + blk + 'px;' +
            '--dx:' + dx + 'px;--dy:' + dy + 'px;' +
            'animation-delay:' + (Math.random() * 0.5).toFixed(2) + 's';
          frag.appendChild(sp);
        }
      }
    }
    line.appendChild(frag);
    parentEl.appendChild(line);
    return tkI;
  }

  function buildPixelName() {
    if (nameBuilt) return;
    var el = document.querySelector('.hero-name');
    if (!el) return;

    el.innerHTML = '';
    el.classList.add('pixel-name');
    nameBuilt = true;

    var nextTk = rasterLine('Wenchang Wang', el, 0);
    rasterLine('王文长', el, nextTk);
  }

  /* ────────────────────────────────────────
     TYPEWRITER SUBTITLE
     ──────────────────────────────────────── */
  function typeSubtitle() {
    if (typeTimer) clearInterval(typeTimer);
    var el = document.querySelector('.hero-subtitle');
    if (!el) return;

    var lang = (window.I18n && window.I18n.getCurrentLang()) || 'en';
    var dict = window.I18n && window.I18n.data && window.I18n.data[lang];
    var fullText = dict ? dict.hero_subtitle : el.getAttribute('data-full-text') || el.textContent;
    el.setAttribute('data-full-text', fullText);
    el.textContent = '';
    el.style.width = 'auto';
    el.classList.add('typing');

    var idx = 0;
    typeTimer = setInterval(function () {
      if (idx < fullText.length) { el.textContent += fullText[idx]; idx++; }
      else { clearInterval(typeTimer); typeTimer = null; }
    }, 45);
  }

  /* ────────────────────────────────────────
     SCROLL ANIMATIONS
     ──────────────────────────────────────── */
  function setupScrollAnimations() {
    if (observer) observer.disconnect();
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var targets = document.querySelectorAll('#page-home .animate-in');
    if (reduced) {
      targets.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(function () { entry.target.classList.add('visible'); }, parseFloat(delay) * 1000);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ────────────────────────────────────────
     LIFECYCLE
     ──────────────────────────────────────── */
  function init() {
    buildPixelName();
    typeSubtitle();
    setupScrollAnimations();
    if (window.Particles) window.Particles.start();
  }

  function destroy() {
    if (typeTimer) clearInterval(typeTimer);
    if (observer) observer.disconnect();
    if (window.Particles) window.Particles.stop();
  }

  if (window.Router) {
    window.Router.register('home', { init: init, destroy: destroy });
  }

  window.HomepageModule = { retypeSubtitle: typeSubtitle };
})();

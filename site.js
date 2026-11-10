/* Wenchang Wang — shared behaviour: theme, language, note band, opening animation */
(function () {
  'use strict';
  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 8x8 pixel glyphs ---------- */
  var GLYPHS = [
    ['00011100', '00010110', '00010011', '00010000', '00010000', '01110000', '11110000', '01100000'], // eighth note
    ['00111111', '00100001', '00100001', '00100001', '00100001', '11101110', '11101110', '00000000'], // beamed pair
    ['00010000', '00011000', '00010100', '00010000', '00010000', '01110000', '11110000', '01100000']  // flagged note
  ];
  function glyphSVG(g, color) {
    var r = '';
    GLYPHS[g].forEach(function (row, y) {
      for (var x = 0; x < 8; x++) if (row[x] === '1') r += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    });
    return '<svg viewBox="0 0 8 8" shape-rendering="crispEdges" fill="' + color + '" aria-hidden="true">' + r + '</svg>';
  }

  /* ---------- Theme ---------- */
  function setTheme(t) { root.setAttribute('data-theme', t); store.set('theme', t); }
  /* ---------- Language ---------- */
  function setLang(l) {
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l === 'zh' ? 'zh-CN' : 'en');
    store.set('lang', l);
    document.querySelectorAll('[data-act="lang"] .opt').forEach(function (o) { o.classList.toggle('on', o.dataset.v === l); });
    var t = document.querySelector('meta[name="title-' + l + '"]');
    if (t) document.title = t.content;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'theme') setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    if (b.dataset.act === 'lang') setLang(root.getAttribute('data-lang') === 'zh' ? 'en' : 'zh');
  });
  setLang(root.getAttribute('data-lang') || 'en');

  /* ---------- Drifting note band ---------- */
  document.querySelectorAll('.stage canvas').forEach(function (c) {
    var x = c.getContext('2d'), w, h, d = devicePixelRatio || 1;
    var cols = ['#e4572e', '#17a398', '#f3c13a', '#9a8f84'];
    function rs() { w = c.offsetWidth; h = c.offsetHeight; c.width = w * d; c.height = h * d; x.setTransform(d, 0, 0, d, 0, 0); }
    rs(); addEventListener('resize', rs);
    var n = Math.max(6, Math.round(w / 70)), N = [];
    for (var i = 0; i < n; i++) N.push({ x: (i + Math.random() * .6) / n * w, y: 14 + Math.random() * Math.max(10, h - 56), g: i % 3, c: cols[i % 4], s: 3 + (i % 3), v: .15 + Math.random() * .25, p: Math.random() * 6 });
    function draw(t) {
      x.clearRect(0, 0, w, h);
      N.forEach(function (o) {
        if (!still) { o.x += o.v; if (o.x > w + 40) o.x = -40; }
        var y = o.y + Math.sin((t || 0) / 900 + o.p) * 6;
        x.fillStyle = o.c; x.globalAlpha = .8;
        GLYPHS[o.g].forEach(function (r, j) { for (var k = 0; k < 8; k++) if (r[k] === '1') x.fillRect(Math.round(o.x + k * o.s), Math.round(y + j * o.s), o.s, o.s); });
      });
      x.globalAlpha = 1;
      if (!still) requestAnimationFrame(draw);
    }
    draw(0);
  });

  /* ---------- Opening animation (home only) ---------- */
  var el = document.getElementById('intro');
  if (!el) return;
  var hero = document.querySelector('.hero'), stage = document.querySelector('.stage');
  function reveal() { document.body.classList.remove('intro-on'); hero && hero.classList.add('pop'); stage && stage.classList.add('pop'); }

  // Play on a fresh visit or a reload; skip when arriving from another page of this site.
  var navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  var reload = navEntry && navEntry.type === 'reload';
  var internal = false;
  try { internal = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
  if (still || (internal && !reload && !/intro/.test(location.search))) { el.remove(); reveal(); return; }

  var zh = root.getAttribute('data-lang') === 'zh';
  var cv = el.querySelector('canvas'), box = el.querySelector('.box'), tx = el.querySelector('.tx'),
      bar = el.querySelector('.bar b'), pct = el.querySelector('.pct'), notes = el.querySelector('.notes'),
      enter = el.querySelector('.enter'), tip = el.querySelector('.tip');
  enter.textContent = zh ? '▶ 点击进入' : '▶ CLICK TO ENTER';
  tip.textContent = zh ? '点击任意位置 / 按回车键' : 'CLICK ANYWHERE · PRESS ENTER';
  notes.innerHTML = [[0, '#f3c13a'], [1, '#e4572e'], [2, '#17a398'], [0, '#f6f1e7'], [1, '#f3c13a']]
    .map(function (n, i) { return glyphSVG(n[0], n[1]).replace('<svg ', '<svg style="animation-delay:' + (-i * 0.15) + 's" '); }).join('');

  var NAME = 'W.WANG', LOAD_MS = 2000, STEPS = 20, i = 0, step = 0, state = 'loading', timers = [];
  timers.push(setInterval(function () { if (i < NAME.length) tx.textContent = NAME.slice(0, ++i); }, 140));
  timers.push(setInterval(function () {
    step = Math.min(step + 1, STEPS);
    bar.style.width = (step / STEPS * 100) + '%';
    pct.textContent = (zh ? '加载中 ' : 'LOADING ') + Math.round(step / STEPS * 100) + '%';
    if (step === STEPS) ready();
  }, LOAD_MS / STEPS));

  function ready() {
    if (state !== 'loading') return;
    state = 'ready'; timers.forEach(clearInterval);
    tx.textContent = NAME; el.classList.add('ready');
  }

  function go() {
    if (state === 'loading') { ready(); return; }  // first click fast-forwards to the ready screen
    if (state !== 'ready') return;
    state = 'leaving';
    box.style.opacity = 0; tip.style.opacity = 0;
    var W = innerWidth, H = innerHeight, d = devicePixelRatio || 1, x = cv.getContext('2d');
    cv.width = W * d; cv.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
    x.fillStyle = getComputedStyle(el).backgroundColor; x.fillRect(0, 0, W, H);
    el.style.background = 'transparent';
    // pixel dissolve: blocks clear in a ripple from the center, with jitter
    var S = Math.max(28, Math.round(Math.min(W, H) / 18)), cells = [], cx = W / 2, cy = H / 2, maxD = Math.hypot(cx, cy);
    for (var a = 0; a < W; a += S) for (var b = 0; b < H; b += S)
      cells.push({ a: a, b: b, t: Math.hypot(a + S / 2 - cx, b + S / 2 - cy) / maxD * .75 + Math.random() * .25 });
    var T0 = performance.now(), DUR = 700, popped = false;
    function finish() { if (!popped) { popped = true; reveal(); } el.remove(); }
    setTimeout(finish, DUR + 400); // safety net if animation frames are throttled
    (function f(now) {
      var p = (now - T0) / DUR;
      cells.forEach(function (c) { if (!c.gone && c.t <= p) { x.clearRect(c.a, c.b, S, S); c.gone = 1; } });
      if (!popped && p > .35) { popped = true; reveal(); }
      if (p < 1.05) requestAnimationFrame(f); else finish();
    })(T0);
  }
  el.addEventListener('click', go);
  addEventListener('keydown', function (e) { if (el.isConnected && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) { e.preventDefault(); go(); } });
})();

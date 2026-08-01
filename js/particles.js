/**
 * particles.js — Professional HD Pixel Art SVG Soul & Rock Instrument Engine
 * (专业级高清 SVG 8-Bit 像素萨克斯、电吉他、黑胶唱片、麦克风与音符 Canvas 引擎)
 */

(function () {
  'use strict';

  var canvas, ctx, W, H, dpr;
  var animId = null, running = false;

  var floatingItems = [];
  var shockwaves = [];
  var NUM_ITEMS = 55;

  var mx = -9999, my = -9999, mActive = false;

  /* ──────────────────────────────────────────
     HIGH-DEFINITION 8-BIT PIXEL ART SVG DATA URIS
     ────────────────────────────────────────── */

  /* 1. HD Pixel Saxophone SVG (🎷 萨克斯) */
  var SVG_SAX = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="image-rendering:pixelated">
      <path fill="#000000" d="M16 2h6v2h-2v2h2v4h-2v2h2v4h-2v2h-2v2h-2v2h-2v2h-2v2h-4v-2h-2v-4h2v-4h2v2h2v-2h2v-2h2V6h-2V2z"/>
      <path fill="#fbbf24" d="M18 4h2v2h-2zm-2 4h4v2h-4zm-2 4h4v2h-4zm-2 4h4v2h-4zm-2 4h4v2h-4zm-2 4h2v2h-2z"/>
      <path fill="#f59e0b" d="M12 22h4v2h-4zm-4-4h4v2h-4zm-4-4h4v2h-4z"/>
      <circle cx="8" cy="8" r="4" fill="#fbbf24" stroke="#000" stroke-width="1.5"/>
      <rect x="18" y="8" width="2" height="2" fill="#ffffff"/>
      <rect x="18" y="12" width="2" height="2" fill="#ffffff"/>
    </svg>
  `);

  /* 2. HD Pixel Fender Electric Guitar SVG (🎸 芬达电吉他) */
  var SVG_GUITAR = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="image-rendering:pixelated">
      <path fill="#000000" d="M2 2h4v4h2v2h2v2h2v2h2v2h2v2h2v-4h2v-2h2v6h2v6h-2v2h-2v2h-4v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2V6h-2V2z"/>
      <!-- Body Crimson -->
      <path fill="#ef4444" d="M18 16h6v4h-2v2h-2v2h-4v-2h-2v-2h2v-4z"/>
      <path fill="#dc2626" d="M22 12h4v4h-4zm2-6h2v4h-2z"/>
      <!-- Neck Maple -->
      <path fill="#d97706" d="M6 6h8v2H6zm-2-2h4v2H4z"/>
      <!-- Pickguard White -->
      <path fill="#ffffff" d="M18 18h4v3h-2v1h-2z"/>
      <rect x="20" y="17" width="3" height="1" fill="#000000"/>
    </svg>
  `);

  /* 3. HD Pixel Vinyl Record SVG (📻 黑胶唱片) */
  var SVG_VINYL = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="image-rendering:pixelated">
      <circle cx="16" cy="16" r="14" fill="#0f172a" stroke="#000000" stroke-width="2"/>
      <circle cx="16" cy="16" r="11" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <circle cx="16" cy="16" r="8" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
      <circle cx="16" cy="16" r="5" fill="#c084fc" stroke="#000000" stroke-width="1"/>
      <circle cx="16" cy="16" r="1.5" fill="#000000"/>
    </svg>
  `);

  /* 4. HD Pixel Vintage Microphone SVG (🎙️ 复古麦克风) */
  var SVG_MIC = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="image-rendering:pixelated">
      <rect x="11" y="3" width="10" height="12" rx="4" fill="#e2e8f0" stroke="#000000" stroke-width="2"/>
      <line x1="11" y1="7" x2="21" y2="7" stroke="#000000" stroke-width="1.5"/>
      <line x1="11" y1="11" x2="21" y2="11" stroke="#000000" stroke-width="1.5"/>
      <path fill="none" stroke="#64748b" stroke-width="2" d="M8 12a8 8 0 0 0 16 0"/>
      <rect x="15" y="20" width="2" height="6" fill="#475569"/>
      <rect x="10" y="26" width="12" height="3" rx="1" fill="#1e293b" stroke="#000000" stroke-width="1.5"/>
    </svg>
  `);

  /* 5. HD Pixel Single Music Note SVG ♪ */
  var SVG_NOTE1 = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="image-rendering:pixelated">
      <path fill="#38bdf8" d="M12 2h8v4h-6v10a4 4 0 1 1-4-4h2V2z" stroke="#000000" stroke-width="1.5"/>
    </svg>
  `);

  /* 6. HD Pixel Double Music Note SVG ♫ */
  var SVG_NOTE2 = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="image-rendering:pixelated">
      <path fill="#4ade80" d="M4 4h16v4H10v8a3 3 0 1 1-3-3h3V8H4z" stroke="#000000" stroke-width="1.5"/>
      <circle cx="17" cy="17" r="3" fill="#4ade80" stroke="#000000" stroke-width="1.5"/>
    </svg>
  `);

  var loadedImages = [];

  function loadSVGImages(callback) {
    var sources = [SVG_SAX, SVG_GUITAR, SVG_VINYL, SVG_MIC, SVG_NOTE1, SVG_NOTE2];
    var count = 0;
    loadedImages = [];

    sources.forEach(function (src, idx) {
      var img = new Image();
      img.onload = function () {
        count++;
        if (count === sources.length && callback) callback();
      };
      img.src = src;
      loadedImages.push(img);
    });
  }

  function getPalette() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      bg: isDark ? '#060810' : '#fafbfc',
      gold: isDark ? '#fbbf24' : '#d97706',
      gridColor: isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.025)'
    };
  }

  function createFloatingItem() {
    if (loadedImages.length === 0) return null;
    var imgIdx = Math.floor(Math.random() * loadedImages.length);
    var img = loadedImages[imgIdx];
    var sizes = [34, 38, 42, 46];
    var size = sizes[Math.floor(Math.random() * sizes.length)];

    return {
      x: Math.random() * (W || 800),
      y: H + Math.random() * 200,
      vy: -0.6 - Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.4,
      img: img,
      size: size,
      alpha: 0.55 + Math.random() * 0.4
    };
  }

  function resize() {
    canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    dpr = window.devicePixelRatio || 1;
    var r = canvas.parentElement.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    seed();
  }

  function seed() {
    floatingItems = [];
    shockwaves = [];
    for (var i = 0; i < NUM_ITEMS; i++) {
      var item = createFloatingItem();
      if (item) {
        item.y = Math.random() * H;
        floatingItems.push(item);
      }
    }
  }

  function spawnBurst(x, y) {
    var pal = getPalette();
    shockwaves.push({
      x: x, y: y,
      r: 4, maxR: 130,
      color: pal.gold, life: 1.0
    });

    for (var n = 0; n < 6; n++) {
      var item = createFloatingItem();
      if (item) {
        item.x = x + (Math.random() - 0.5) * 60;
        item.y = y + (Math.random() - 0.5) * 60;
        item.vy = -1.5 - Math.random() * 1.8;
        floatingItems.push(item);
      }
    }
  }

  function tick() {
    for (var i = floatingItems.length - 1; i >= 0; i--) {
      var it = floatingItems[i];
      it.x += it.vx;
      it.y += it.vy;

      /* Cursor Fluid Magnetism */
      if (mActive) {
        var dx = mx - it.x;
        var dy = my - it.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220 && dist > 1) {
          var force = (220 - dist) / 220 * 0.35;
          it.vx += (dx / dist) * force * 0.1;
          it.vy += (dy / dist) * force * 0.1;
        }
      }

      it.vx *= 0.98;

      /* Reset when drifting off top */
      if (it.y < -80) {
        var newItem = createFloatingItem();
        if (newItem) floatingItems[i] = newItem;
      }
    }

    /* Shockwaves */
    for (var s = shockwaves.length - 1; s >= 0; s--) {
      var sw = shockwaves[s];
      sw.r += 5.5;
      sw.life = 1 - (sw.r / sw.maxR);
      if (sw.r >= sw.maxR) shockwaves.splice(s, 1);
    }
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    var pal = getPalette();

    /* 1. Background Grid Lines */
    ctx.strokeStyle = pal.gridColor;
    ctx.lineWidth = 1;
    for (var x = 0; x < W; x += 36) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (var y = 0; y < H; y += 36) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    /* 2. Draw Shockwaves */
    for (var s = 0; s < shockwaves.length; s++) {
      var sw = shockwaves[s];
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = Math.max(0, sw.life * 0.7);
      ctx.strokeRect(sw.x - sw.r, sw.y - sw.r, sw.r * 2, sw.r * 2);
    }
    ctx.globalAlpha = 1;

    /* 3. Draw Floating HD Pre-Rendered Pixel Art SVG Icons */
    for (var i = 0; i < floatingItems.length; i++) {
      var it = floatingItems[i];
      if (!it.img) continue;

      ctx.globalAlpha = it.alpha;
      ctx.drawImage(it.img, it.x - it.size / 2, it.y - it.size / 2, it.size, it.size);
    }
    ctx.globalAlpha = 1;
  }

  function loop() {
    if (!running) return;
    tick(); draw();
    animId = requestAnimationFrame(loop);
  }

  function onMove(e) {
    if (!canvas) return;
    var r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
    mActive = true;
  }

  function onLeave() {
    mActive = false;
  }

  function onClick(e) {
    if (!canvas) return;
    var r = canvas.getBoundingClientRect();
    spawnBurst(e.clientX - r.left, e.clientY - r.top);
  }

  function start() {
    resize(); if (!canvas) return;
    running = true;

    loadSVGImages(function () {
      seed();
      loop();
    });

    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);
  }

  function stop() {
    running = false;
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseleave', onLeave);
    if (canvas) canvas.removeEventListener('click', onClick);
  }

  window.Particles = { start: start, stop: stop, burst: spawnBurst };
})();

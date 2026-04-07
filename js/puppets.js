/**
 * puppets.js — Sidebar sausage mascots with physics interactions.
 *
 * Three minimal horizontal capsule creatures peek from the left screen edge.
 * - No arms/mouth — just a rounded sausage body + two big eyes
 * - "Neck stretch" effect: sausage extends further when mouse is nearby
 * - Hover directly on one → it shyly hides behind the edge
 * - Hiding puppet bumps neighbors → spring-based collision bounce
 * - Squash/stretch deformation during movement
 * - Random blink & gentle wobble for liveliness
 * - Hidden on mobile (CSS handles display:none)
 */

(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* ── Character palette ── */
  var DEFS = [
    { color: '#FF6B6B', wobble: 2.3 },
    { color: '#4ECDC4', wobble: 1.7 },
    { color: '#FFE66D', wobble: 2.9 }
  ];

  /* ── SVG metrics (horizontal capsule) ── */
  var SW = 80, SH = 30;
  var CAP_RX = (SH - 2) / 2;
  var EYES = [
    { cx: 56, cy: 15 },
    { cx: 68, cy: 15 }
  ];
  var EYE_R = 5.5, PUPIL_R = 3, PUPIL_MAX = EYE_R * 0.4;

  /* ── Positioning thresholds ── */
  var PEEK_X    = -36;
  var CURIOUS_X = -14;
  var HIDE_X    = -74;
  var OFF_X     = -90;
  var GAP_Y     = 40;

  /* ── Physics ── */
  var SPRING     = 0.065;
  var DAMP       = 0.78;
  var BUMP_FORCE = 12;
  var HIDE_SEC   = 2.2;
  var CURIOUS_R  = 220;

  /* ── Runtime state ── */
  var worldEl, puppets = [];
  var mx = -999, my = -999;
  var rafId = null, t = 0, entered = false;

  /* SVG helper */
  function sv(tag, a) {
    var e = document.createElementNS(NS, tag);
    for (var k in a) e.setAttribute(k, a[k]);
    return e;
  }

  /* ── Build one sausage SVG ── */
  function makeSVG(def) {
    var svg = sv('svg', {
      viewBox: '0 0 ' + SW + ' ' + SH,
      width: SW, height: SH,
      style: 'overflow:visible;display:block'
    });

    var bodyRect = sv('rect', {
      x: 0, y: 1, width: SW, height: SH - 2,
      rx: CAP_RX, ry: CAP_RX, fill: def.color
    });
    svg.appendChild(bodyRect);

    var pupils = [], scleras = [];
    EYES.forEach(function (eye) {
      var sc = sv('ellipse', {
        cx: eye.cx, cy: eye.cy, rx: EYE_R, ry: EYE_R, fill: '#fff'
      });
      svg.appendChild(sc);
      scleras.push(sc);

      var pu = sv('circle', { cx: eye.cx, cy: eye.cy, r: PUPIL_R, fill: '#2a2a2a' });
      svg.appendChild(pu);
      pupils.push(pu);

      svg.appendChild(sv('circle', {
        cx: eye.cx - 1.5, cy: eye.cy - 2, r: 1.6,
        fill: '#fff', opacity: '0.82'
      }));
    });

    return { svg: svg, body: bodyRect, pupils: pupils, scleras: scleras };
  }

  /* ── Build all three ── */
  function build() {
    worldEl = document.getElementById('puppet-world');
    if (!worldEl) return;
    worldEl.innerHTML = '';
    puppets = [];

    var vh = window.innerHeight;
    var total = (DEFS.length - 1) * GAP_Y;
    var y0 = (vh - total) / 2;

    DEFS.forEach(function (def, i) {
      var parts = makeSVG(def);
      var wrap = document.createElement('div');
      wrap.className = 'puppet-wrap';
      wrap.appendChild(parts.svg);
      worldEl.appendChild(wrap);

      var baseY = y0 + i * GAP_Y;

      var p = {
        el: wrap,
        body: parts.body,
        pupils: parts.pupils,
        scleras: parts.scleras,
        x: OFF_X, targetX: OFF_X,
        baseY: baseY, y: baseY, vy: 0,
        wobbleSpd: def.wobble,
        wobblePhi: Math.random() * 6.28,
        blinkIn: 2 + Math.random() * 3,
        blinkOpen: true,
        hiding: false,
        hideTimer: 0,
        curious: false,
        pox: [0, 0], poy: [0, 0]
      };

      wrap.style.left = OFF_X + 'px';
      wrap.style.top = baseY + 'px';

      (function (idx) {
        wrap.addEventListener('mouseenter', function () { startHide(idx); });
      })(i);

      puppets.push(p);
    });
  }

  /* ── Staggered entrance ── */
  function enter() {
    if (entered) return;
    entered = true;
    puppets.forEach(function (p, i) {
      setTimeout(function () { p.targetX = PEEK_X; }, 250 + i * 200);
    });
  }

  /* ── Shy hide ── */
  function startHide(idx) {
    var p = puppets[idx];
    if (p.hiding) return;
    p.hiding = true;
    p.curious = false;
    p.targetX = HIDE_X;
    p.hideTimer = HIDE_SEC;

    for (var j = 0; j < puppets.length; j++) {
      if (j === idx) continue;
      var q = puppets[j];
      if (Math.abs(p.y - q.y) < GAP_Y + 20) {
        q.vy += (q.y > p.y ? 1 : -1) * BUMP_FORCE;
      }
    }
  }

  /* ── Physics tick ── */
  function tick(dt) {
    t += dt;

    for (var i = 0; i < puppets.length; i++) {
      var p = puppets[i];

      /* Curiosity detection (mouse nearby but not on puppet) */
      if (!p.hiding && entered) {
        var r = p.el.getBoundingClientRect();
        var cx = r.left + r.width * 0.7;
        var cy = r.top + r.height / 2;
        var dx = mx - cx, dy = my - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var wasCurious = p.curious;
        p.curious = dist < CURIOUS_R && dist > 50;
        if (!p.curious && !p.hiding) p.targetX = PEEK_X;
        else if (p.curious) p.targetX = CURIOUS_X;
      }

      /* Smooth X slide */
      p.x += (p.targetX - p.x) * 0.08;

      /* Y spring back to base */
      p.vy += (p.baseY - p.y) * SPRING;
      p.vy *= DAMP;
      p.y += p.vy;

      /* Pair-wise collision */
      for (var j = i + 1; j < puppets.length; j++) {
        var q = puppets[j];
        var sep = p.y - q.y;
        var absSep = Math.abs(sep);
        if (absSep < 30 && absSep > 0.5) {
          var push = (30 - absSep) * 0.14;
          var sign = sep < 0 ? -1 : 1;
          p.vy += sign * push;
          q.vy -= sign * push;
        }
      }

      /* Hide timer → re-peek */
      if (p.hiding) {
        p.hideTimer -= dt;
        if (p.hideTimer <= 0) {
          p.hiding = false;
          p.targetX = PEEK_X;
        }
      }

      /* Blink */
      p.blinkIn -= dt;
      if (p.blinkIn <= 0 && p.blinkOpen) {
        p.blinkOpen = false;
        p.blinkIn = 0.11;
      } else if (p.blinkIn <= 0 && !p.blinkOpen) {
        p.blinkOpen = true;
        p.blinkIn = 2.5 + Math.random() * 4;
      }

      /* Eye tracking (lerped) */
      var rect = p.el.getBoundingClientRect();
      EYES.forEach(function (eye, ei) {
        var ex = rect.left + eye.cx;
        var ey = rect.top + eye.cy;
        var edx = mx - ex, edy = my - ey;
        var ang = Math.atan2(edy, edx);
        var d = Math.min(Math.sqrt(edx * edx + edy * edy) / 280, 1);
        var tx = Math.cos(ang) * PUPIL_MAX * d;
        var ty = Math.sin(ang) * PUPIL_MAX * d;
        p.pox[ei] += (tx - p.pox[ei]) * 0.12;
        p.poy[ei] += (ty - p.poy[ei]) * 0.12;
      });
    }
  }

  /* ── Render ── */
  function render() {
    for (var i = 0; i < puppets.length; i++) {
      var p = puppets[i];

      var wob = Math.sin(t * p.wobbleSpd + p.wobblePhi) * 1.2;

      /* Squash/stretch from Y velocity */
      var vAbs = Math.abs(p.vy);
      var stretchY = 1 + vAbs * 0.014;
      var squashX  = 1 / stretchY;

      p.el.style.left = p.x.toFixed(1) + 'px';
      p.el.style.top  = (p.y + wob).toFixed(1) + 'px';
      p.el.style.transform =
        'scaleX(' + squashX.toFixed(3) + ') scaleY(' + stretchY.toFixed(3) + ')';
      p.el.style.transformOrigin = 'right center';

      /* Blink */
      var sry = p.blinkOpen ? EYE_R : 0.8;
      var pr  = p.blinkOpen ? PUPIL_R : 0.2;

      EYES.forEach(function (eye, ei) {
        p.pupils[ei].setAttribute('cx', (eye.cx + p.pox[ei]).toFixed(2));
        p.pupils[ei].setAttribute('cy', (eye.cy + p.poy[ei]).toFixed(2));
        p.pupils[ei].setAttribute('r', pr.toFixed(2));
        p.scleras[ei].setAttribute('ry', sry.toFixed(2));
      });
    }
  }

  /* ── Loop ── */
  var prev = 0;
  function loop(ts) {
    var dt = Math.min((ts - prev) / 1000, 0.06);
    prev = ts;
    tick(dt);
    render();
    rafId = requestAnimationFrame(loop);
  }

  function onMouse(e) { mx = e.clientX; my = e.clientY; }

  var rTimer;
  function onResize() {
    clearTimeout(rTimer);
    rTimer = setTimeout(function () {
      var vh = window.innerHeight;
      var total = (puppets.length - 1) * GAP_Y;
      var y0 = (vh - total) / 2;
      puppets.forEach(function (p, i) { p.baseY = y0 + i * GAP_Y; });
    }, 200);
  }

  function checkRoute() {
    if (!worldEl) return;
    var h = location.hash || '#home';
    var onHome = h === '#home' || h === '#' || h === '';
    worldEl.style.display = onHome ? 'none' : '';
  }

  function init() {
    if (window.innerWidth <= 768) return;
    build();
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    document.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('resize', onResize);
    prev = performance.now();
    rafId = requestAnimationFrame(loop);
    setTimeout(enter, 600);
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onMouse);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('hashchange', checkRoute);
  }

  if (document.readyState === 'complete') init();
  else document.addEventListener('DOMContentLoaded', init);

  window.Puppets = { init: init, destroy: destroy, rebuild: build };
})();

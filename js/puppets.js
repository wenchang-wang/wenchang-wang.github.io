/**
 * puppets.js — Sidebar pixel-art mascots with physics interactions.
 *
 * Three blocky pixel creatures peek from the left screen edge.
 * - Stepped-corner pixelated body (no rounded corners)
 * - Square eyes with pixel-style blink
 * - "Neck stretch" effect: body extends when mouse is nearby
 * - Hover directly on one → it shyly hides behind the edge
 * - Hiding puppet bumps neighbors → spring-based collision bounce
 * - Random blink & gentle wobble for liveliness
 * - Hidden on mobile & homepage
 */

(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  var DEFS = [
    { color: '#FF6B6B', wobble: 2.3 },
    { color: '#4ECDC4', wobble: 1.7 },
    { color: '#FFE66D', wobble: 2.9 }
  ];

  var SW = 80, SH = 30;
  var PX = 4;

  var EYES = [
    { cx: 56, cy: 15 },
    { cx: 68, cy: 15 }
  ];
  var SC_W = 8, SC_H = 8;
  var PU_W = 4, PU_H = 4;
  var PUPIL_MAX = 2;

  var PEEK_X    = -36;
  var CURIOUS_X = -14;
  var HIDE_X    = -74;
  var OFF_X     = -90;
  var GAP_Y     = 40;

  var SPRING     = 0.065;
  var DAMP       = 0.78;
  var BUMP_FORCE = 12;
  var HIDE_SEC   = 2.2;
  var CURIOUS_R  = 220;

  var worldEl, puppets = [];
  var mx = -999, my = -999;
  var rafId = null, t = 0, entered = false;

  function sv(tag, a) {
    var e = document.createElementNS(NS, tag);
    for (var k in a) e.setAttribute(k, a[k]);
    return e;
  }

  function makeSVG(def) {
    var svg = sv('svg', {
      viewBox: '0 0 ' + SW + ' ' + SH,
      width: SW, height: SH,
      style: 'overflow:visible;display:block;image-rendering:pixelated'
    });

    var bodyPath = sv('path', {
      d: 'M8,1 H72 V5 H76 V9 H80 V21 H76 V25 H72 V29 H8 V25 H4 V21 H0 V9 H4 V5 H8 Z',
      fill: def.color
    });
    svg.appendChild(bodyPath);

    var shadowPath = sv('path', {
      d: 'M72,5 H76 V9 H80 V21 H76 V25 H72 V29 H8 V25 H4 V21',
      fill: 'rgba(0,0,0,0.12)',
      'fill-rule': 'evenodd'
    });
    svg.appendChild(shadowPath);

    var pupils = [], scleras = [], highlights = [];
    EYES.forEach(function (eye) {
      var sc = sv('rect', {
        x: eye.cx - SC_W / 2, y: eye.cy - SC_H / 2,
        width: SC_W, height: SC_H, fill: '#fff'
      });
      svg.appendChild(sc);
      scleras.push(sc);

      var pu = sv('rect', {
        x: eye.cx - PU_W / 2, y: eye.cy - PU_H / 2,
        width: PU_W, height: PU_H, fill: '#2a2a2a'
      });
      svg.appendChild(pu);
      pupils.push(pu);

      var hl = sv('rect', {
        x: eye.cx - SC_W / 2, y: eye.cy - SC_H / 2,
        width: 3, height: 3, fill: '#fff', opacity: '0.85'
      });
      svg.appendChild(hl);
      highlights.push(hl);
    });

    return { svg: svg, body: bodyPath, pupils: pupils, scleras: scleras, highlights: highlights };
  }

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
        highlights: parts.highlights,
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

  function enter() {
    if (entered) return;
    entered = true;
    puppets.forEach(function (p, i) {
      setTimeout(function () { p.targetX = PEEK_X; }, 250 + i * 200);
    });
  }

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

  function tick(dt) {
    t += dt;

    for (var i = 0; i < puppets.length; i++) {
      var p = puppets[i];

      if (!p.hiding && entered) {
        var r = p.el.getBoundingClientRect();
        var cx = r.left + r.width * 0.7;
        var cy = r.top + r.height / 2;
        var dx = mx - cx, dy = my - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        p.curious = dist < CURIOUS_R && dist > 50;
        if (!p.curious && !p.hiding) p.targetX = PEEK_X;
        else if (p.curious) p.targetX = CURIOUS_X;
      }

      p.x += (p.targetX - p.x) * 0.08;

      p.vy += (p.baseY - p.y) * SPRING;
      p.vy *= DAMP;
      p.y += p.vy;

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

      if (p.hiding) {
        p.hideTimer -= dt;
        if (p.hideTimer <= 0) {
          p.hiding = false;
          p.targetX = PEEK_X;
        }
      }

      p.blinkIn -= dt;
      if (p.blinkIn <= 0 && p.blinkOpen) {
        p.blinkOpen = false;
        p.blinkIn = 0.11;
      } else if (p.blinkIn <= 0 && !p.blinkOpen) {
        p.blinkOpen = true;
        p.blinkIn = 2.5 + Math.random() * 4;
      }

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

  function render() {
    for (var i = 0; i < puppets.length; i++) {
      var p = puppets[i];

      var wob = Math.sin(t * p.wobbleSpd + p.wobblePhi) * 1.2;

      var vAbs = Math.abs(p.vy);
      var stretchY = 1 + vAbs * 0.014;
      var squashX  = 1 / stretchY;

      p.el.style.left = p.x.toFixed(1) + 'px';
      p.el.style.top  = (p.y + wob).toFixed(1) + 'px';
      p.el.style.transform =
        'scaleX(' + squashX.toFixed(3) + ') scaleY(' + stretchY.toFixed(3) + ')';
      p.el.style.transformOrigin = 'right center';

      EYES.forEach(function (eye, ei) {
        var bx = eye.cx - PU_W / 2 + p.pox[ei];
        var by = eye.cy - PU_H / 2 + p.poy[ei];
        p.pupils[ei].setAttribute('x', bx.toFixed(1));
        p.pupils[ei].setAttribute('y', by.toFixed(1));

        if (p.blinkOpen) {
          p.scleras[ei].setAttribute('height', SC_H);
          p.scleras[ei].setAttribute('y', eye.cy - SC_H / 2);
          p.pupils[ei].style.display = '';
          p.highlights[ei].style.display = '';
        } else {
          p.scleras[ei].setAttribute('height', 2);
          p.scleras[ei].setAttribute('y', eye.cy - 1);
          p.pupils[ei].style.display = 'none';
          p.highlights[ei].style.display = 'none';
        }
      });
    }
  }

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

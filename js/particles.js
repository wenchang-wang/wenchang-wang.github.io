/**
 * particles.js — Pixel-style hero canvas.
 *
 *  1. Small colored square blocks drifting, bouncing away from cursor
 *  2. Five snake creatures wander, seek & eat blocks, grow colored tails
 *  3. The snake nearest to the cursor follows it (desktop mouse / mobile touch)
 *  4. Theme-adaptive token colors
 */

(function () {
  'use strict';

  var canvas, ctx, W, H, dpr;
  var animId = null, running = false;

  /* ── palette ── */
  function pal() {
    var dk = document.documentElement.getAttribute('data-theme') === 'dark';
    return dk
      ? ['#ff7b72', '#79c0ff', '#d2a8ff', '#7ee787', '#ffa657', '#a5d6ff']
      : ['#cf222e', '#0550ae', '#8250df', '#116329', '#953800', '#0a3069'];
  }

  /* ════════════════════════════════════════
     PARTICLES
     ════════════════════════════════════════ */
  var P_N = 65;
  var P_SZ = [4, 5, 6, 7];
  var particles = [];

  function mkP() {
    var c = pal();
    return {
      x: Math.random() * (W || 800),
      y: Math.random() * (H || 600),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      sz: P_SZ[(Math.random() * P_SZ.length) | 0],
      color: c[(Math.random() * c.length) | 0],
      alpha: 0.28 + Math.random() * 0.38,
      alive: true, respawn: 0
    };
  }

  /* ════════════════════════════════════════
     SNAKES — 5 creatures
     ════════════════════════════════════════ */
  var S_DEFS = [
    { color: '#FF6B6B', spd: 1.15 },
    { color: '#4ECDC4', spd: 1.0  },
    { color: '#FFE66D', spd: 1.25 },
    { color: '#FF9F43', spd: 0.95 },
    { color: '#A29BFE', spd: 1.1  }
  ];
  var S_INIT   = 8;
  var S_MAX    = 22;
  var S_HEAD   = 10;
  var S_SEG    = 7;
  var S_EAT_R  = 15;
  var S_FOLLOW = 0.28;
  var snakes   = [];
  var snakeGo  = false;

  function mkSnake(def, idx) {
    var x0 = -50 - idx * 60;
    var y0 = (H || 500) * (0.18 + idx * 0.16);
    var segs = [];
    for (var i = 0; i < S_INIT; i++)
      segs.push({ x: x0 - i * 9, y: y0, color: def.color });
    return {
      hx: x0, hy: y0, segs: segs,
      ang: 0, tAng: Math.random() * 6.28,
      spd: def.spd + (Math.random() - 0.5) * 0.15,
      base: def.color, hColor: def.color,
      flash: 0, wt: 1 + Math.random() * 2,
      entered: false
    };
  }

  /* ════════════════════════════════════════
     MOUSE / TOUCH
     ════════════════════════════════════════ */
  var mx = -9e3, my = -9e3, mActive = false;
  var REPEL_R = 110, REPEL_F = 3.8;

  function nearestSnakeIdx() {
    var best = -1, bd = Infinity;
    for (var i = 0; i < snakes.length; i++) {
      var dx = snakes[i].hx - mx, dy = snakes[i].hy - my;
      var d2 = dx * dx + dy * dy;
      if (d2 < bd) { bd = d2; best = i; }
    }
    return best;
  }

  /* ════════════════════════════════════════
     SETUP
     ════════════════════════════════════════ */
  function resize() {
    canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    dpr = window.devicePixelRatio || 1;
    var r = canvas.parentElement.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    particles = [];
    for (var i = 0; i < P_N; i++) particles.push(mkP());
    snakes = [];
    for (var j = 0; j < S_DEFS.length; j++) snakes.push(mkSnake(S_DEFS[j], j));
    snakeGo = false;
    setTimeout(function () { snakeGo = true; }, 800);
  }

  /* ════════════════════════════════════════
     UPDATE
     ════════════════════════════════════════ */
  function tickParticles() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (!p.alive) {
        p.respawn -= 1 / 60;
        if (p.respawn <= 0) {
          var n = mkP(); p.x = n.x; p.y = n.y;
          p.vx = n.vx; p.vy = n.vy; p.sz = n.sz;
          p.color = n.color; p.alpha = n.alpha; p.alive = true;
        }
        continue;
      }
      var dx = p.x - mx, dy = p.y - my;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < REPEL_R && d > 1) {
        var f = (REPEL_R - d) / REPEL_R * REPEL_F;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }
      p.vx *= 0.955; p.vy *= 0.955;
      if (Math.abs(p.vx) < 0.03) p.vx += (Math.random() - 0.5) * 0.06;
      if (Math.abs(p.vy) < 0.03) p.vy += (Math.random() - 0.5) * 0.06;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) { p.x = 0; p.vx *= -0.7; }
      if (p.x > W) { p.x = W; p.vx *= -0.7; }
      if (p.y < 0) { p.y = 0; p.vy *= -0.7; }
      if (p.y > H) { p.y = H; p.vy *= -0.7; }
    }
  }

  function tickSnakes() {
    if (!snakeGo) return;
    var follower = mActive ? nearestSnakeIdx() : -1;

    for (var s = 0; s < snakes.length; s++) {
      var k = snakes[s];

      /* entrance */
      if (!k.entered) { k.tAng = 0; if (k.hx > 80) k.entered = true; }

      if (s === follower && k.entered) {
        /* ── follow cursor ── */
        k.tAng = Math.atan2(my - k.hy, mx - k.hx);
      } else if (k.entered) {
        /* ── wander + seek food ── */
        k.wt -= 1 / 60;
        if (k.wt <= 0) {
          k.tAng += (Math.random() - 0.5) * 2.2;
          k.wt = 1.5 + Math.random() * 3;
        }
        var bestD = 160, bestP = null;
        for (var i = 0; i < particles.length; i++) {
          if (!particles[i].alive) continue;
          var pdx = particles[i].x - k.hx, pdy = particles[i].y - k.hy;
          var pd = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pd < bestD) { bestD = pd; bestP = particles[i]; }
        }
        if (bestP) k.tAng = Math.atan2(bestP.y - k.hy, bestP.x - k.hx);
      }

      /* edge avoidance */
      var m = 50;
      if (k.hx < m) k.tAng = 0;
      else if (k.hx > W - m) k.tAng = Math.PI;
      if (k.hy < m) k.tAng = Math.PI * 0.5;
      else if (k.hy > H - m) k.tAng = -Math.PI * 0.5;

      /* smooth turn — follower turns faster */
      var turnRate = (s === follower) ? 0.10 : 0.055;
      var da = k.tAng - k.ang;
      while (da > Math.PI) da -= 6.2832;
      while (da < -Math.PI) da += 6.2832;
      k.ang += da * turnRate;

      /* move */
      var speed = (s === follower) ? k.spd * 1.35 : k.spd;
      k.hx += Math.cos(k.ang) * speed;
      k.hy += Math.sin(k.ang) * speed;

      /* segments follow */
      var ldr = { x: k.hx, y: k.hy };
      for (var j = 0; j < k.segs.length; j++) {
        var sg = k.segs[j];
        var ff = Math.max(0.10, S_FOLLOW - j * 0.012);
        sg.x += (ldr.x - sg.x) * ff;
        sg.y += (ldr.y - sg.y) * ff;
        ldr = sg;
      }

      /* eat */
      for (var i = 0; i < particles.length; i++) {
        var pp = particles[i];
        if (!pp.alive) continue;
        var ex = pp.x - k.hx, ey = pp.y - k.hy;
        if (ex * ex + ey * ey < S_EAT_R * S_EAT_R) {
          pp.alive = false;
          pp.respawn = 2.5 + Math.random() * 2;
          if (k.segs.length < S_MAX) {
            var tail = k.segs[k.segs.length - 1];
            k.segs.push({ x: tail.x, y: tail.y, color: pp.color });
          }
          k.flash = 0.35; k.hColor = pp.color;
          break;
        }
      }
      if (k.flash > 0) k.flash -= 1 / 60; else k.hColor = k.base;
    }
  }

  /* ════════════════════════════════════════
     DRAW
     ════════════════════════════════════════ */
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (!p.alive) continue;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x - p.sz / 2), Math.round(p.y - p.sz / 2), p.sz, p.sz);
    }
    ctx.globalAlpha = 1;

    for (var s = 0; s < snakes.length; s++) {
      var k = snakes[s];
      for (var j = k.segs.length - 1; j >= 0; j--) {
        var sg = k.segs[j];
        ctx.globalAlpha = 0.32 + (1 - j / k.segs.length) * 0.58;
        ctx.fillStyle = sg.color;
        ctx.fillRect(Math.round(sg.x - S_SEG / 2), Math.round(sg.y - S_SEG / 2), S_SEG, S_SEG);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = k.hColor;
      var hh = S_HEAD / 2;
      ctx.fillRect(Math.round(k.hx - hh), Math.round(k.hy - hh), S_HEAD, S_HEAD);

      var ca = Math.cos(k.ang), sa = Math.sin(k.ang);
      var perp = 3, fwd = 2.2;
      var px1 = -sa * perp, py1 = ca * perp;
      var fx = ca * fwd, fy = sa * fwd;
      ctx.fillStyle = '#fff';
      ctx.fillRect(Math.round(k.hx + px1 + fx - 1.5), Math.round(k.hy + py1 + fy - 1.5), 3, 3);
      ctx.fillRect(Math.round(k.hx - px1 + fx - 1.5), Math.round(k.hy - py1 + fy - 1.5), 3, 3);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(Math.round(k.hx + px1 + fx * 1.5 - 0.5), Math.round(k.hy + py1 + fy * 1.5 - 0.5), 2, 2);
      ctx.fillRect(Math.round(k.hx - px1 + fx * 1.5 - 0.5), Math.round(k.hy - py1 + fy * 1.5 - 0.5), 2, 2);
    }
  }

  /* ════════════════════════════════════════
     LOOP & EVENTS
     ════════════════════════════════════════ */
  function loop() {
    if (!running) return;
    tickParticles(); tickSnakes(); draw();
    animId = requestAnimationFrame(loop);
  }

  function canvasXY(clientX, clientY) {
    if (!canvas) return;
    var r = canvas.getBoundingClientRect();
    mx = clientX - r.left; my = clientY - r.top;
  }

  function onMove(e)  { canvasXY(e.clientX, e.clientY); mActive = true; }
  function onLeave()  { mx = -9e3; my = -9e3; mActive = false; }
  function onTouchS(e) { var t = e.touches[0]; canvasXY(t.clientX, t.clientY); mActive = true; }
  function onTouchM(e) { var t = e.touches[0]; canvasXY(t.clientX, t.clientY); }
  function onTouchE()  { mActive = false; mx = -9e3; my = -9e3; }

  function start() {
    resize(); if (!canvas) return;
    seed(); running = true; loop();
    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('touchstart', onTouchS, { passive: true });
    document.addEventListener('touchmove',  onTouchM, { passive: true });
    document.addEventListener('touchend',   onTouchE);
    window.addEventListener('resize', resize);
  }

  function stop() {
    running = false;
    if (animId) cancelAnimationFrame(animId);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseleave', onLeave);
    document.removeEventListener('touchstart', onTouchS);
    document.removeEventListener('touchmove',  onTouchM);
    document.removeEventListener('touchend',   onTouchE);
    window.removeEventListener('resize', resize);
  }

  window.Particles = { start: start, stop: stop };
})();

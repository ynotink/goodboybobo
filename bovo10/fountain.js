/* Good Boy Bobo — fountain water on a map scene (Vet Visit, levels 26-30).
   Soft falling highlights run down the fountain's water curtains, and small rings ripple out and fade in the basin.
   Drawn on a canvas inside the scene's art box, so it scrolls with the painting and stays aligned to the fountain.
   Runs only while the fountain is on screen (stops completely when scrolled away); never takes taps. */
window.FountainFX = function (S, cfg) {
  const cv = document.createElement('canvas');
  cv.className = 'ffx';
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2';
  S.art.insertBefore(cv, S.fx);
  const g = cv.getContext('2d');
  const RM = matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // watch only the fountain's own area, so it pauses as soon as the fountain itself leaves the screen
  const probe = document.createElement('div');
  const [bx0, by0, bx1, by1] = cfg.box;
  probe.style.cssText = `position:absolute;left:${bx0 * 100}%;top:${by0 * 100}%;width:${(bx1 - bx0) * 100}%;height:${(by1 - by0) * 100}%;pointer-events:none`;
  S.art.appendChild(probe);
  let on = false, raf = 0, last = 0, drops = [], rings = [], nextRing = 0, W = 0, H = 0;
  const R = (a, b) => a + Math.random() * (b - a);
  function fit() {
    const dpr = Math.min(2.5, devicePixelRatio || 1);
    const w = Math.round(S.art.clientWidth * dpr), h = Math.round(S.art.clientHeight * dpr);
    if (w !== cv.width || h !== cv.height) { cv.width = w; cv.height = h }
    W = cv.width; H = cv.height;
  }
  function spawnDrop() {
    const c = cfg.curtains[Math.floor(Math.random() * cfg.curtains.length)];
    // more highlights near the curtain's outer edges, where the painted water is brightest
    let u = Math.random(); u = u < .5 ? Math.pow(u * 2, .7) / 2 : 1 - Math.pow((1 - u) * 2, .7) / 2;
    drops.push({ c, x: c.x0 + (c.x1 - c.x0) * u, t: 0, dur: R(.42, .62), len: R(.18, .32), a: R(.45, .8) });
  }
  function spawnRing(x) {
    const b = cfg.basin;
    rings.push({ x: x != null ? x : R(b.x0, b.x1), y: b.y + R(-b.dy, b.dy), t: 0, dur: R(1.0, 1.5), r: R(.012, .022), a: R(.35, .55) });
  }
  function draw(now) {
    raf = requestAnimationFrame(draw);
    const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
    fit(); g.clearRect(0, 0, W, H);
    // falling highlights: thin bright streaks that speed up as they fall and fade near the bottom
    while (drops.length < cfg.drops) spawnDrop();
    g.lineCap = 'round';
    for (const d of drops) {
      d.t += dt / d.dur;
      const c = d.c, p = d.t * d.t;                                        // gravity: accelerating fall
      const y = (c.y0 + (c.y1 - c.y0) * p) * H, x = (d.x + (c.lean || 0) * p) * W;
      const L = (c.y1 - c.y0) * H * d.len;
      const fade = Math.min(1, d.t * 5) * Math.min(1, (1 - d.t) * 4);
      const gr = g.createLinearGradient(x, y - L, x, y);
      gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, `rgba(255,255,255,${d.a * fade})`);
      g.strokeStyle = gr; g.lineWidth = Math.max(1, W * .0022);
      g.beginPath(); g.moveTo(x, y - L); g.lineTo(x, y); g.stroke();
      if (d.t >= 1 && c.toBasin && Math.random() < .35) spawnRing(d.x + (c.lean || 0));   // lands in the basin: a ring
    }
    drops = drops.filter(d => d.t < 1);
    // ripples: thin flat rings that widen and fade
    if (now > nextRing) { spawnRing(); nextRing = now + R(380, 720) }
    for (const r of rings) {
      r.t += dt / r.dur;
      const k = 1 - Math.pow(1 - r.t, 2), rx = r.r * W * (.25 + k), ry = rx * cfg.basin.flat;
      const a = r.a * (1 - r.t) * Math.min(1, r.t * 6);
      g.strokeStyle = `rgba(235,250,255,${a})`; g.lineWidth = Math.max(1, W * .0016);
      g.beginPath(); g.ellipse(r.x * W, r.y * H, rx, ry, 0, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = `rgba(255,255,255,${a * .5})`;
      g.beginPath(); g.ellipse(r.x * W, r.y * H, rx * .62, ry * .62, 0, 0, Math.PI * 2); g.stroke();
    }
    rings = rings.filter(r => r.t < 1);
  }
  function start() { if (on || RM) return; on = true; last = 0; raf = requestAnimationFrame(draw) }
  function stop() { if (!on) return; on = false; cancelAnimationFrame(raf); raf = 0; drops = []; rings = []; g.clearRect(0, 0, cv.width, cv.height) }
  const io = new IntersectionObserver(es => { for (const e of es) e.isIntersecting && !document.hidden ? start() : stop() }, { threshold: 0 });
  io.observe(probe);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else io.unobserve(probe), io.observe(probe) });
  return { start, stop, get running() { return on } };
};

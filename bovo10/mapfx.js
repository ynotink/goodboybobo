/* Good Boy Bobo — small map motions drawn on top of each painted panel (no video).
   One canvas per effect, inside the panel's art box: it scrolls, scales and clips exactly like the painting,
   sits under the level markers (which keep all taps), and only runs while its own landmark is on screen.
   Coordinates are fractions of the panel picture (0-1). Effect types:
     streaks  short slanted rain lines that fade before the ground          (rain at the entrance)
     glow     a warm light that slowly breathes, with a little spill around   (campfire, lanterns)
     ember    one tiny spark that rises and fades, with a quiet gap between   (campfire)
     glint    one cool highlight that travels along a short path, clipped     (ice, glass)
   Every moving element fades in and out over its lifetime so it never pops. Pauses when the app is hidden,
   skips new elements while the map is being flung, honours reduced motion. */
(function () {
  const RM = matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const R = (a, b) => a + Math.random() * (b - a);
  const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
  const life = t => ease(t / .25) * ease((1 - t) / .25);                 // soft in, soft out
  let fling = false;                                                    // map moving fast: no new elements
  window.MapFXScroll = v => { fling = v };
  function clipTo(g, W, H, c) {                                         // c: {ellipse:[cx,cy,rx,ry]} or {rect:[x0,y0,x1,y1]}
    if (!c) return;
    g.beginPath();
    if (c.ellipse) { const [x, y, rx, ry] = c.ellipse; g.ellipse(x * W, y * H, rx * W, ry * H, 0, 0, Math.PI * 2) }
    else { const [x0, y0, x1, y1] = c.rect; g.rect(x0 * W, y0 * H, (x1 - x0) * W, (y1 - y0) * H) }
    g.clip();
  }
  const TYPES = {
    streaks(o) {                                                        // o: zones [[x0,y0,x1,y1]], count, slant, speed
      const items = [];
      return (g, W, H, dt) => {
        if (!fling) while (items.length < o.count) {
          const z = o.zones[Math.floor(Math.random() * o.zones.length)];
          items.push({ z, x: R(z[0], z[2]), t: -R(0, .6), dur: R(.4, .6), len: R(.028, .045) });
        }
        g.lineCap = 'round'; g.lineWidth = Math.max(1.2, W * .0026);
        for (const s of items) {
          s.t += dt / s.dur; if (s.t < 0) continue;
          const z = s.z, y = (z[1] + (z[3] - z[1]) * s.t) * H, x = (s.x + o.slant * s.t * (z[3] - z[1])) * W;
          const L = s.len * H, a = (o.alpha || .5) * life(s.t);
          const gr = g.createLinearGradient(x - o.slant * L, y - L, x, y);
          gr.addColorStop(0, 'rgba(225,235,250,0)'); gr.addColorStop(.6, `rgba(235,242,255,${a * .7})`); gr.addColorStop(1, `rgba(250,252,255,${a})`);
          g.strokeStyle = gr; g.beginPath(); g.moveTo(x - o.slant * L, y - L); g.lineTo(x, y); g.stroke();
        }
        for (let i = items.length - 1; i >= 0; i--) if (items[i].t >= 1) items.splice(i, 1);
      };
    },
    glow(o) {                                                           // o: at [x,y], r, color [r,g,b], min, max, period
      let t = Math.random() * 10;
      return (g, W, H, dt) => {
        t += dt;
        const k = .5 + .5 * (Math.sin(t * 2 * Math.PI / o.period) * .6 + Math.sin(t * 2 * Math.PI / (o.period * .37) + 1.7) * .4);
        const a = o.min + (o.max - o.min) * k, [r, gg, b] = o.color, x = o.at[0] * W, y = o.at[1] * H, rad = o.r * W;
        const gr = g.createRadialGradient(x, y, 0, x, y, rad);
        gr.addColorStop(0, `rgba(${r},${gg},${b},${a})`); gr.addColorStop(.45, `rgba(${r},${gg},${b},${a * .45})`); gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
        g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.beginPath();
        g.ellipse(x, y, rad, rad * (o.flat || 1), 0, 0, Math.PI * 2); g.fill(); g.globalCompositeOperation = 'source-over';
      };
    },
    ember(o) {                                                          // o: from [x,y], rise, drift, gap [min,max] s
      let e = null, wait = R(.5, 2);
      return (g, W, H, dt) => {
        if (!e) { wait -= dt; if (wait <= 0 && !fling) e = { t: 0, dur: R(1.6, 2.3), sway: R(-1, 1) }; if (!e) return }
        e.t += dt / e.dur;
        const t = e.t, x = (o.from[0] + o.drift * t + .006 * e.sway * Math.sin(t * 7)) * W, y = (o.from[1] - o.rise * ease(t)) * H;
        const a = life(t) * (.75 + .25 * Math.sin(t * 40)), rad = Math.max(1.2, W * .0035);
        const gr = g.createRadialGradient(x, y, 0, x, y, rad * 3);
        gr.addColorStop(0, `rgba(255,236,170,${a})`); gr.addColorStop(.35, `rgba(255,150,50,${a * .8})`); gr.addColorStop(1, 'rgba(255,110,30,0)');
        g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad * 3, 0, Math.PI * 2); g.fill(); g.globalCompositeOperation = 'source-over';
        if (e.t >= 1) { e = null; wait = R(o.gap[0], o.gap[1]) }
      };
    },
    glint(o) {                                                          // o: path [[x,y],...], clip, gap [min,max], dur
      let gl = null, wait = R(.5, 2.5);
      const P = o.path;
      const at = t => {                                                 // smooth point along the path, t 0-1
        const f = t * (P.length - 1), i = Math.min(P.length - 2, Math.floor(f)), u = f - i;
        return [P[i][0] + (P[i + 1][0] - P[i][0]) * u, P[i][1] + (P[i + 1][1] - P[i][1]) * u];
      };
      return (g, W, H, dt) => {
        if (!gl) { wait -= dt; if (wait <= 0 && !fling) gl = { t: 0 }; if (!gl) return }
        gl.t += dt / o.dur;
        const [x, y] = at(ease(gl.t)), a = life(gl.t) * (o.alpha || .7), len = (o.len || .045) * W;
        const [x2, y2] = at(Math.min(1, ease(gl.t) + .04)), ang = Math.atan2((y2 - y) * H, (x2 - x) * W);
        g.save(); clipTo(g, W, H, o.clip); g.translate(x * W, y * H); g.rotate(ang);
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, len);
        gr.addColorStop(0, `rgba(255,255,255,${a})`); gr.addColorStop(.3, `rgba(220,240,255,${a * .55})`); gr.addColorStop(1, 'rgba(200,230,255,0)');
        g.fillStyle = gr; g.save(); g.scale(1, .22); g.beginPath(); g.arc(0, 0, len, 0, Math.PI * 2); g.fill(); g.restore();
        const sr = len * .32, sg = g.createRadialGradient(0, 0, 0, 0, 0, sr);              // small bright sparkle at its head
        sg.addColorStop(0, `rgba(255,255,255,${a})`); sg.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = sg; g.beginPath(); g.arc(0, 0, sr, 0, Math.PI * 2); g.fill();
        g.strokeStyle = `rgba(255,255,255,${a * .8})`; g.lineWidth = Math.max(1, len * .03); g.beginPath();
        g.moveTo(-sr * 1.3, 0); g.lineTo(sr * 1.3, 0); g.moveTo(0, -sr * 1.3); g.lineTo(0, sr * 1.3); g.stroke(); g.restore();
        if (gl.t >= 1) { gl = null; wait = R(o.gap[0], o.gap[1]) }
      };
    }
  };
  // one effect on one panel. box = the landmark's area (it runs only while that area is on screen)
  window.MapFX = function (S, spec) {
    if (RM) return null;
    const cv = document.createElement('canvas');
    cv.className = 'mfx';
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2';
    S.art.insertBefore(cv, S.fx);
    const g = cv.getContext('2d');
    const probe = document.createElement('div'), [bx0, by0, bx1, by1] = spec.box;
    probe.style.cssText = `position:absolute;left:${bx0 * 100}%;top:${by0 * 100}%;width:${(bx1 - bx0) * 100}%;height:${(by1 - by0) * 100}%;pointer-events:none`;
    S.art.appendChild(probe);
    const parts = spec.fx.map(f => TYPES[f.type](f));
    let on = false, raf = 0, last = 0, seen = false;
    function frame(now) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
      const dpr = Math.min(2.5, devicePixelRatio || 1), w = Math.round(S.art.clientWidth * dpr), h = Math.round(S.art.clientHeight * dpr);
      if (w !== cv.width || h !== cv.height) { cv.width = w; cv.height = h }
      g.clearRect(0, 0, cv.width, cv.height);
      g.save(); clipTo(g, cv.width, cv.height, spec.clip);
      for (const p of parts) p(g, cv.width, cv.height, dt);
      g.restore();
    }
    const start = () => { if (on) return; on = true; last = 0; raf = requestAnimationFrame(frame) };
    const stop = () => { if (!on) return; on = false; cancelAnimationFrame(raf); raf = 0; g.clearRect(0, 0, cv.width, cv.height) };
    const io = new IntersectionObserver(es => { for (const e of es) { seen = e.isIntersecting; seen && !document.hidden ? start() : stop() } });
    io.observe(probe);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : seen && start());
    return { start, stop, get running() { return on } };
  };
})();

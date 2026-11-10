// HoopLife rig: the ninja eyes, the Pulse H ball and the wordmark, all in one SVG.
// Every scene builds its own copy and poses it from t, so scenes join frame to frame.
window.W = {
  EYE: [60, 56, 74, 60, 86, 64, 98, 72],
  SEAM: [42, 42, 64, 76, 64, 124, 42, 158],
  // Word units: cap height 100. Placed at (98,890) x1.4 on the 1080x1920 stage.
  GLYPHS: [
    [0, 'M0,0 V100 M52,0 V100 M0,50 H52'],
    [80, 'M42,0 A42,50 0 1 0 42.01,0'],
    [330, 'M0,100 V0 H26 A26,26 0 0 1 26,52 H0'],
    [410, 'M0,0 V100 H46'],
    [484, 'M0,0 V100'],
    [512, 'M46,0 H0 V100 M0,50 H38'],
    [586, 'M46,0 H0 V100 H46 M0,50 H38'],
  ],
  WORD: { x: 98, y: 890, k: 1.4, ballX: 443.8, ballY: 960, ballS: 0.84 },
  rig(kit, id) {
    const W0 = window.W;
    const letters = W0.GLYPHS.map((g, i) => '<path class="' + id + '-l" pathLength="1" transform="translate(' + g[0] + ',0)" d="' + g[1] + '"/>').join('');
    const svg = '<svg class="art" viewBox="0 0 1080 1920">' +
      '<g class="' + id + '-word" transform="translate(' + W0.WORD.x + ' ' + W0.WORD.y + ') scale(' + W0.WORD.k + ')" style="fill:none;stroke:var(--main);stroke-width:9;stroke-linecap:round;stroke-linejoin:round">' + letters + '</g>' +
      '<g class="' + id + '-mark" style="fill:none;stroke-linecap:round;stroke-linejoin:round">' +
        '<circle class="' + id + '-ring" pathLength="1" cx="100" cy="100" r="84" transform="rotate(-90 100 100)" style="stroke:var(--main)"/>' +
        '<g class="' + id + '-eyes"><path class="' + id + '-seamL" style="stroke:var(--main)"/><path class="' + id + '-seamR" style="stroke:var(--main)"/></g>' +
        '<path class="' + id + '-inkH" pathLength="1" d="M16,100 H58 M184,100 H142" style="stroke:var(--main)"/>' +
        '<path class="' + id + '-inkV" pathLength="1" d="M100,16 V60 M100,184 V140" style="stroke:var(--main)"/>' +
        '<polyline class="' + id + '-pulse" pathLength="1" points="58,100 81,100 90,72 100,128 110,100 142,100" style="stroke:var(--accent)"/>' +
      '</g></svg>';
    const root = kit.h('<div class="ground"><div class="glow ' + id + '-glow"></div>' + svg + '<div class="vig"></div></div>');
    kit.stage.append(root);
    const q = (s) => root.querySelector(s);
    return {
      root, glow: q('.' + id + '-glow'), word: q('.' + id + '-word'), letters: Array.from(root.querySelectorAll('.' + id + '-l')),
      mark: q('.' + id + '-mark'), ring: q('.' + id + '-ring'), eyes: q('.' + id + '-eyes'),
      seamL: q('.' + id + '-seamL'), seamR: q('.' + id + '-seamR'), pulse: q('.' + id + '-pulse'),
      inkH: q('.' + id + '-inkH'), inkV: q('.' + id + '-inkV'),
    };
  },
  // p: { cx, cy, s, m (0 eyes .. 1 seams), blink (1 open), eyeOp, ring, pulse, beat, sw, glow, letters:[0..1 x7] }
  pose(R, p) {
    const W0 = window.W, lerp = (a, b, x) => a + (b - a) * x;
    R.mark.setAttribute('transform', 'translate(' + p.cx.toFixed(2) + ' ' + p.cy.toFixed(2) + ') scale(' + p.s.toFixed(4) + ') translate(-100 -100)');
    const pts = W0.EYE.map((e, i) => lerp(e, W0.SEAM[i], p.m));
    const d = (P) => 'M' + P[0] + ',' + P[1] + ' C' + P[2] + ',' + P[3] + ' ' + P[4] + ',' + P[5] + ' ' + P[6] + ',' + P[7];
    const mir = pts.map((v, i) => (i % 2 ? v : 200 - v));
    R.seamL.setAttribute('d', d(pts.map((v) => v.toFixed(2))));
    R.seamR.setAttribute('d', d(mir.map((v) => v.toFixed(2))));
    const sw = lerp(9, p.sw, p.m);
    R.seamL.style.strokeWidth = sw; R.seamR.style.strokeWidth = sw;
    const ey = lerp(64, 100, p.m);
    R.eyes.setAttribute('transform', 'translate(0 ' + ey + ') scale(1 ' + p.blink.toFixed(3) + ') translate(0 ' + (-ey) + ')');
    R.eyes.style.opacity = p.eyeOp;
    R.ring.style.strokeWidth = p.sw; R.ring.style.strokeDasharray = '1'; R.ring.style.strokeDashoffset = (1 - p.ring).toFixed(4);
    R.ring.style.opacity = p.ring > 0.001 ? 1 : 0;
    // The basketball's vertical and horizontal seams grow in behind the ring as it closes.
    const ink = Math.max(0, Math.min(1, (p.ring - 0.35) / 0.65));
    [R.inkH, R.inkV].forEach((el) => { el.style.strokeWidth = p.sw; el.style.strokeDasharray = '1'; el.style.strokeDashoffset = (1 - ink).toFixed(4); el.style.opacity = ink > 0.001 ? 1 : 0; });
    R.pulse.style.strokeWidth = p.sw; R.pulse.style.strokeDasharray = '1'; R.pulse.style.strokeDashoffset = (1 - p.pulse).toFixed(4);
    R.pulse.style.opacity = p.pulse > 0.001 ? 1 : 0;
    R.pulse.style.transformBox = 'fill-box'; R.pulse.style.transformOrigin = 'center';
    R.pulse.style.transform = 'scaleY(' + p.beat.toFixed(3) + ')';
    R.letters.forEach((el, i) => { const v = p.letters[i] || 0; el.style.strokeDasharray = '1'; el.style.strokeDashoffset = (1 - v).toFixed(4); el.style.opacity = v > 0.001 ? 1 : 0; });
    const gx = p.cx, gy = p.cy + (ey - 100) * p.s;
    R.glow.style.transform = 'translate(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px) scale(' + (p.s / 4.2).toFixed(3) + ')';
    R.glow.style.opacity = p.glow;
  },
  // A single blink: 1 open, dips to 0.08 and back over 0.28 s.
  blink(t, at) { const x = (t - at) / 0.28; if (x <= 0 || x >= 1) return 1; return 1 - 0.92 * Math.sin(Math.PI * x); },
  // Heartbeat: two quick lifts of the pulse.
  beat(t, at) { const x = t - at; if (x < 0 || x > 0.9) return 1; return 1 + 0.4 * Math.exp(-x * 4) * Math.max(0, Math.sin(x * 14)); },
  none: [0, 0, 0, 0, 0, 0, 0],
  // The ninja: cloth mask with an angled brow opening, two eyes, red headband. Same 200-unit grid as the ball,
  // so a fully squinted eye lies exactly where the rig's slit (and later the seam) begins.
  ninja(kit, id) {
    const eye = (side) => {
      const tf = side < 0 ? 'translate(79 64) rotate(22.8)' : 'translate(121 64) scale(-1 1) rotate(22.8)';
      const c = id + '-clip' + (side < 0 ? 'L' : 'R');
      return '<g class="' + id + '-eye" transform="' + tf + '">' +
        '<clipPath id="' + c + '"><path d="M-22,0 Q-6,-15 22,-4 Q6,12 -22,0 Z"/></clipPath>' +
        '<g clip-path="url(#' + c + ')">' +
          '<rect x="-26" y="-20" width="52" height="34" style="fill:color-mix(in srgb, var(--second) 86%, var(--ground))"/>' +
          '<path d="M-24,-2 Q-6,-16 24,-6 L24,-20 L-24,-20 Z" style="fill:color-mix(in srgb, var(--ground) 35%, transparent)"/>' +
          '<g class="' + id + '-iris"><circle r="9" style="fill:color-mix(in srgb, var(--second) 22%, var(--ground));stroke:var(--accent);stroke-width:1.3"/>' +
            '<circle r="4.6" style="fill:var(--ground)"/><circle cx="3" cy="-3.4" r="1.9" style="fill:var(--main)"/></g>' +
          '<rect class="' + id + '-lidT" x="-26" y="-40" width="52" height="40" style="fill:var(--open)"/>' +
          '<rect class="' + id + '-lidB" x="-26" y="0" width="52" height="40" style="fill:var(--open)"/>' +
        '</g>' +
        '<path d="M-22,0 Q-6,-15 22,-4" style="fill:none;stroke:var(--ground);stroke-width:2.6;stroke-linecap:round"/></g>';
    };
    const folds = [[-60, 28, 260, 30], [-40, 112, 240, 106], [-80, 150, 280, 160], [-100, -10, 300, -24]].map((f) =>
      '<path d="M' + f[0] + ',' + f[1] + ' Q100,' + (f[1] + 18) + ' ' + f[2] + ',' + f[3] + '" style="fill:none;stroke:var(--fold);stroke-width:3"/>').join('');
    const svg = '<svg class="art" viewBox="0 0 1080 1920"><g class="' + id + '-ninja">' +
      '<rect x="-800" y="-1000" width="1800" height="2200" style="fill:var(--cloth)"/>' + folds +
      '<g class="' + id + '-band"><rect x="-800" y="2" width="1800" height="20" style="fill:var(--accent)"/><rect x="-800" y="4" width="1800" height="3" style="fill:color-mix(in srgb, var(--main) 30%, var(--accent))"/></g>' +
      '<path class="' + id + '-opening" d="M30,40 L93,58 Q100,62 107,58 L170,40 L174,64 Q162,92 100,95 Q38,92 26,64 Z" style="fill:var(--open)"/>' +
      eye(-1) + eye(1) + '</g></svg>';
    const root = kit.h('<div class="ninja">' + svg + '</div>');
    kit.stage.append(root);
    return { root, g: root.querySelector('.' + id + '-ninja'), iris: Array.from(root.querySelectorAll('.' + id + '-iris')),
      lidT: Array.from(root.querySelectorAll('.' + id + '-lidT')), lidB: Array.from(root.querySelectorAll('.' + id + '-lidB')) };
  },
  // p: { cx, cy, s, op, open (0 shut .. 1 open), squint (0 .. 1 slit), look (iris x, eye units) }
  poseNinja(N, p) {
    const lerp = (a, b, x) => a + (b - a) * x;
    N.g.setAttribute('transform', 'translate(' + p.cx.toFixed(2) + ' ' + p.cy.toFixed(2) + ') scale(' + p.s.toFixed(4) + ') translate(-100 -100)');
    N.root.style.opacity = p.op;
    const top = lerp(lerp(3, -16, p.open), -4.5, p.squint), bot = lerp(12, 4.5, p.squint);
    N.lidT.forEach((el) => el.setAttribute('transform', 'translate(0 ' + top.toFixed(2) + ')'));
    N.lidB.forEach((el) => el.setAttribute('transform', 'translate(0 ' + bot.toFixed(2) + ')'));
    N.iris.forEach((el, i) => el.setAttribute('transform', 'translate(' + (i ? -p.look : p.look).toFixed(2) + ' -1)'));
  },
};
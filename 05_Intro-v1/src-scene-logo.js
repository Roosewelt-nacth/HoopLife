const { seg, eio, eo, lerp } = kit;
kit.scene('logo', {
  init(kit) {
    this.R = W.rig(kit, 'logo');
    this.R.root.append(kit.h('<div class="words logo-words" style="top:1110px"><p class="sub logo-sub">Community · Chennai</p></div>'));
    this.svg = this.R.root.querySelector('svg');
    this.sub = this.R.root.querySelector('.logo-sub');
  },
  render(t) {
    // The ball shrinks into the second O while the letters draw in after it.
    const go = eio(seg(t, 0, 1.0));
    const L = W.GLYPHS.map((g, i) => eo(seg(t, 0.55 + i * 0.09, 1.2 + i * 0.09)));
    W.pose(this.R, {
      cx: lerp(540, W.WORD.ballX, go), cy: 960, s: lerp(4.048, W.WORD.ballS, go), m: 1,
      blink: 1, eyeOp: 1, ring: 1, pulse: 1, beat: W.beat(t, 2.3), sw: lerp(12, 15, go),
      glow: lerp(0.35, 0.18, go), letters: L,
    });
    const drift = 1 + 0.015 * eio(seg(t, 1.0, 3.5));
    this.svg.style.transformOrigin = '540px 960px';
    this.svg.style.transform = 'scale(' + drift.toFixed(4) + ')';
    const a = eo(seg(t, 1.5, 2.1));
    this.sub.style.opacity = a;
    this.sub.style.transform = 'translateY(' + lerp(26, 0, a).toFixed(1) + 'px)';
  },
});
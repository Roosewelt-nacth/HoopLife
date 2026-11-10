const { seg, eio, eo, ei, lerp } = kit;
kit.scene('outro', {
  init(kit) {
    this.R = W.rig(kit, 'outro');
    this.R.root.append(kit.h('<div><div class="words outro-words" style="top:1110px"><p class="sub outro-sub">Community · Chennai</p></div><div class="words outro-end" style="top:1090px"><p class="handle outro-handle">@hooplife.community</p></div></div>'));
    this.svg = this.R.root.querySelector('svg');
    this.sub = this.R.root.querySelector('.outro-sub');
    this.handle = this.R.root.querySelector('.outro-handle');
  },
  render(t) {
    // Reverse of the intro: letters go, the ball returns, its seams fold back into eyes, the camera pulls away.
    const L = W.GLYPHS.map((g, i) => 1 - ei(seg(t, 0.05 + (6 - i) * 0.05, 0.55 + (6 - i) * 0.05)));
    const back = eio(seg(t, 0.4, 1.3));
    const m = 1 - eio(seg(t, 1.3, 2.0));
    const away = eio(seg(t, 1.8, 3.5));
    const s = lerp(lerp(W.WORD.ballS, 3.6, back), 1.5, away) * (1 - 0.01 * seg(t, 3.5, 4));
    W.pose(this.R, {
      cx: lerp(W.WORD.ballX, 540, back), cy: 960 + 36 * s * (1 - m), s, m,
      blink: W.blink(t, 2.75), eyeOp: 1,
      ring: 1 - eio(seg(t, 1.05, 1.6)), pulse: 1 - eio(seg(t, 0.95, 1.4)), beat: 1, sw: lerp(15, 12, back),
      glow: lerp(0.18, 0.85, 1 - m), letters: L,
    });
    const drift = lerp(1.015, 1, eio(seg(t, 0, 1.3)));
    this.svg.style.transformOrigin = '540px 960px';
    this.svg.style.transform = 'scale(' + drift.toFixed(4) + ')';
    this.sub.style.opacity = 1 - ei(seg(t, 0, 0.45));
    const h = eo(seg(t, 2.4, 3.0));
    this.handle.style.opacity = h;
    this.handle.style.transform = 'translateY(' + lerp(24, 0, h).toFixed(1) + 'px)';
  },
});
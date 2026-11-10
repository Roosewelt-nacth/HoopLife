const { seg, eio, eo, lerp } = kit;
kit.scene('reveal', {
  init(kit) { this.R = W.rig(kit, 'reveal'); },
  render(t) {
    // The eye slits stretch and bend into the two side seams; the ball draws round them; the pulse beats.
    const m = eio(seg(t, 0.15, 1.1));
    const s = lerp(4.2, 4.0, eio(seg(t, 0, 1.3))) * (1 + 0.012 * eio(seg(t, 1.3, 3)));
    W.pose(this.R, {
      cx: 540, cy: 960 + 36 * 4.2 * (1 - m), s, m,
      blink: 1, eyeOp: 1,
      ring: eio(seg(t, 0.7, 1.6)), pulse: eo(seg(t, 1.4, 1.9)), beat: W.beat(t, 2.05), sw: 12,
      glow: lerp(1, 0.35, m), letters: W.none,
    });
  },
});
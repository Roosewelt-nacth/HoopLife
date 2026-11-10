const { seg, eio, eo, lerp } = kit;
kit.scene('eyes', {
  init(kit) { this.R = W.rig(kit, 'eyes'); },
  render(t) {
    // The camera pushes in on the eyes; they are already open at frame 0 for the thumbnail.
    const push = eio(seg(t, 0.1, 2.6));
    const s = lerp(2.4, 4.2, push);
    const breathe = 1 + 0.012 * Math.sin(t * 2.1);
    W.pose(this.R, {
      cx: 540, cy: 960 + 36 * s, s: s * breathe, m: 0,
      blink: W.blink(t, 1.95), eyeOp: lerp(0.75, 1, eo(seg(t, 0, 0.6))),
      ring: 0, pulse: 0, beat: 1, sw: 12, glow: lerp(0.4, 1, eo(seg(t, 0, 1.4))), letters: W.none,
    });
  },
});
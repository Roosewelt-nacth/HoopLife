kit.score(function (S, T) {
  S.program('pad', 'pad', { rev: 0.7 }); S.program('bass', 'bass', { gain: -2 }); S.program('keys', 'ep', { rev: 0.5 });
  // The dark: a low hum under the eyes.
  S.chord('pad', ['A1', 'E2'], { t: 0, dur: 3.2, vel: 26 });
  S.fx('click', T.eyes + 2.0, { vel: 40 });
  // The eyes stretch into seams; the ring swells in; the heartbeat lands.
  S.fx('whoosh', T.reveal + 0.15, { dur: 0.9, vel: 50 });
  S.fx('revswell', T.reveal + 1.6, { dur: 0.9, vel: 46 });
  S.chord('pad', ['A2', 'E3', 'C4'], { t: T.reveal + 0.6, dur: 2.6, vel: 40 });
  S.drum('kick', { t: T.reveal + 2.16, vel: 96 }); S.drum('kick', { t: T.reveal + 2.6, vel: 80 });
  S.note('bass', 'A1', { t: T.reveal + 2.16, dur: 0.8, vel: 70 });
  // The wordmark draws in, one soft tick a letter, then the second heartbeat and the full chord.
  for (let i = 0; i < 7; i++) S.fx('tick', T.logo + 0.7 + i * 0.09, { vel: 30 });
  S.drum('kick', { t: T.logo + 2.41, vel: 104 }); S.drum('kick', { t: T.logo + 2.86, vel: 86 });
  S.chord('keys', ['A3', 'C4', 'E4', 'G4'], { t: T.logo + 2.41, dur: 2.4, vel: 58 });
  S.chord('pad', ['F2', 'C3', 'A3'], { t: T.logo + 2.41, dur: 3.2, vel: 44 });
  S.note('bass', 'F1', { t: T.logo + 2.41, dur: 1.2, vel: 80 });
  // Outro: the pull away, one blink, the handle.
  S.fx('whoosh', T.outro + 1.8, { dur: 1.4, vel: 44, into: 1 });
  S.fx('click', T.outro + 2.8, { vel: 40 });
  S.chord('pad', ['A1', 'E2', 'A2'], { t: T.outro + 1.2, dur: 3, vel: 34 });
  S.fx('chime', T.outro + 2.45, { vel: 46 });
  S.master({ gain: -6, fadeOut: 1.0 });
});
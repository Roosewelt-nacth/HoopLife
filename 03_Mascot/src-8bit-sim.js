  // ---------- teams and archetypes: original characters whose play-styles are inspired by pro archetypes (no real players) ----------
  // ratings 0..1: spd speed, three, mid, fin finishing, dunk, blk block, stl steal, pas passing, reb rebound
  var TEAMS = [
    { name: "Team Ninja", col: "#2F5D3A", trim: "#D8B36A", ink: "#F3EAD8", base: 0x2f5d3a, trimHex: 0xd8b36a, dot: "#6E9A58" },
    { name: "Rivals", col: "#C2683F", trim: "#F3EAD8", ink: "#F3EAD8", base: 0xc2683f, trimHex: 0xf3ead8, dot: "#C2683F" }
  ];
  var ROSTER = [
    [{ name: "Ninja", ninja: true, num: "01", pos: "PG", style: "Mascot. Every move in the book, plus the vanish", skin: 0xf2c9a8, r: { spd: 0.95, three: 0.82, mid: 0.8, fin: 0.9, dunk: 0.85, blk: 0.4, stl: 0.85, pas: 0.85, reb: 0.4 } },
     { name: "Splash", num: "30", pos: "SG", style: "Deep-range shooter, quick release, runs off screens", skin: 0xc68a62, hair: "buzz", sleeve: -1, r: { spd: 0.86, three: 0.95, mid: 0.85, fin: 0.6, dunk: 0.2, blk: 0.2, stl: 0.5, pas: 0.75, reb: 0.35 }, scale: 0.97 },
     { name: "Atlas", num: "23", pos: "SF", style: "Point forward. Powerful drives, chase-down blocks", skin: 0x5a3626, hair: "band", beard: true, r: { spd: 0.82, three: 0.6, mid: 0.7, fin: 0.92, dunk: 0.95, blk: 0.7, stl: 0.6, pas: 0.85, reb: 0.7 }, scale: 1.08 },
     { name: "Euro", num: "7", pos: "SF", style: "Crafty slasher. Euro steps and floaters", skin: 0xe9b995, hair: "bun", hairColor: 0x6b4423, r: { spd: 0.84, three: 0.62, mid: 0.72, fin: 0.88, dunk: 0.5, blk: 0.35, stl: 0.55, pas: 0.7, reb: 0.5 }, scale: 1.02 },
     { name: "Tower", num: "34", pos: "C", style: "Rim-running big. Screens, lobs, hooks, blocks", skin: 0x8d5a3b, hair: "afro", r: { spd: 0.7, three: 0.25, mid: 0.55, fin: 0.9, dunk: 0.95, blk: 0.92, stl: 0.35, pas: 0.55, reb: 0.95 }, scale: 1.16 }],
    [{ name: "Flash", num: "3", pos: "PG", style: "Blur in transition, pull-up threes", skin: 0xa8704c, hair: "cap", r: { spd: 0.96, three: 0.8, mid: 0.75, fin: 0.82, dunk: 0.4, blk: 0.2, stl: 0.75, pas: 0.85, reb: 0.3 }, scale: 0.96 },
     { name: "Deadeye", num: "11", pos: "SG", style: "Catch-and-shoot sniper", skin: 0xf0c8a5, hair: "short", hairColor: 0x2a1d14, r: { spd: 0.8, three: 0.9, mid: 0.82, fin: 0.6, dunk: 0.2, blk: 0.25, stl: 0.5, pas: 0.65, reb: 0.35 } },
     { name: "Lock", num: "2", pos: "SF", style: "Lockdown defender, pick-pocket hands", skin: 0x6b4330, hair: "buzz", r: { spd: 0.85, three: 0.55, mid: 0.65, fin: 0.7, dunk: 0.6, blk: 0.6, stl: 0.92, pas: 0.6, reb: 0.55 }, scale: 1.05 },
     { name: "Titan", num: "6", pos: "PF", style: "Bruising power forward, posterizer", skin: 0xd59b74, hair: "band", hairColor: 0x2a1d14, beard: true, r: { spd: 0.76, three: 0.45, mid: 0.65, fin: 0.9, dunk: 0.92, blk: 0.7, stl: 0.45, pas: 0.6, reb: 0.8 }, scale: 1.1 },
     { name: "Anchor", num: "21", pos: "C", style: "Paint protector, soft hook shot", skin: 0x4a2c1f, hair: "short", r: { spd: 0.66, three: 0.2, mid: 0.6, fin: 0.86, dunk: 0.85, blk: 0.95, stl: 0.35, pas: 0.55, reb: 0.95 }, scale: 1.18 }]
  ];
  // offensive spots (lx, lz from the attacking hoop) by roster index: PG top, shooter wing, forward wing, slasher corner, big block
  var OFF_SPOTS = [[0, 7.8], [-5.4, 4.9], [5.4, 4.9], [6.1, 0.9], [-2.2, 1.5]];
  var ZONE_SPOTS = [[-2.4, 5.4], [2.4, 5.4], [-4.3, 1.8], [4.3, 1.8], [0, 1.4]];
  var players = [];
  ROSTER.forEach(function (list, ti) {
    list.forEach(function (r, i) {
      var f = { root: { scale: { x: r.scale || 1 }, visible: true } };
      players.push({ f: f, team: ti, idx: i, name: r.name, ninja: !!r.ninja, r: r.r, look: r, pos: new V3(), vel: new V3(), yaw: ti ? Math.PI : 0, jy: 0, phase: rand() * 6, state: "run", t: 0, stagger: 0, cool: 0, hidden: 0, celebrate: 0, pose: null, poseT: 0, sprint: false });
      var li = document.createElement("li"); li.innerHTML = "<b>" + r.num + "</b><div>" + r.name + " · " + r.pos + "</div><span>" + r.style + "</span>"; document.getElementById("r" + ti).appendChild(li);
    });
  });
  var ninja = players[0];
  function team(t) { return players.filter(function (p) { return p.team === t; }); }
  function mate(t, i) { return players[t * 5 + i]; }
  function opp(p) { return players[(1 - p.team) * 5 + p.idx]; }

  // ---------- smoke (pixel puffs) ----------
  var puffs = [];
  function smoke(at) { for (var k = 0; k < 12; k++) puffs.push({ x: at.x + (rand() - 0.5) * 0.6, z: at.z + (rand() - 0.5) * 0.6, y: 0.3 + rand() * 1.4, vx: (rand() - 0.5) * 1.2, vz: (rand() - 0.5) * 1.6, vy: 0.5 + rand(), life: 1 }); sfx("vanish"); }
  // ---------- game state ----------
  var G = { score: [0, 0], poss: 0, phase: "advance", shot: 24, mode: "watch", cam: "bird", def: ["man", "man"], over: 0, dead: 0, capT: 0, play: null, fast: 0, combo: [], comboText: [], screen: null };
  var ball = { pos: new V3(), vel: new V3(), mode: "held", holder: null, side: 1, phase: 0, move: null, flight: null };
  function caption(txt, hold) { G.capT = hold || 2.6; var el = document.getElementById("caption"); el.textContent = txt; el.style.opacity = 1; }
  function setPlay(txt) { document.getElementById("playTag").textContent = txt; }
  function ui() { document.getElementById("s0").textContent = G.score[0]; document.getElementById("s1").textContent = G.score[1]; document.getElementById("possDot").style.background = TEAMS[G.poss].dot; document.getElementById("shotClock").textContent = Math.ceil(Math.max(0, G.shot)); }
  function giveBall(p, how) {
    var changed = p.team !== G.poss;
    ball.mode = "held"; ball.holder = p; ball.flight = null; ball.move = null; ball.side = 1;
    if (changed) { G.poss = p.team; G.shot = 24; G.play = null; G.screen = null; G.comboText = []; G.phase = "advance"; G.fast = (how === "steal" || how === "rebound") ? 4 : 0; setPlay(G.fast ? "Fast break" : "Bring it up"); }
    if (how === "pass" || how === "rebound-off") { /* keep phase */ }
    if (p.ninja && G.mode === "watch") planNinja();
    ui();
  }
  function inbound(t) {
    var defended = attackHoop(1 - t), s = outDir(1 - t);
    players.forEach(function (p) { p.state = "run"; p.jy = 0; p.hidden = 0; p.pose = null; });
    var pg = mate(t, 0); pg.pos.set(1.6, 0, defended.z - s * 1.6);
    G.poss = t; G.phase = "advance"; G.shot = 24; G.play = null; G.screen = null; G.fast = 0; G.comboText = [];
    ball.mode = "held"; ball.holder = pg; ball.move = null; ball.flight = null; if (pg.ninja && G.mode === "watch") planNinja();
    setPlay("Bring it up"); ui();
  }
  function newGame() {
    G.score = [0, 0]; G.over = 0; G.dead = 0; document.getElementById("banner").hidden = true;
    players.forEach(function (p) { var s = p.team === 0 ? 1 : -1, sp = OFF_SPOTS[p.idx]; p.pos.set(sp[0] * 0.7, 0, s * (1.2 + p.idx * 0.6)); p.vel.set(0, 0, 0); });
    inbound(0); mate(0, 0).pos.set(0, 0, 1.2); caption("Tip-off at the park", 2);
  }

  // ---------- moves ----------
  var MOVES = ["cross", "btb", "legs", "spin", "hesi", "step"], MOVE_NAME = { cross: "Crossover", btb: "Behind-the-back", legs: "Between the legs", spin: "Spin move", hesi: "Hesitation", step: "Step-back" };
  function planNinja() { G.combo = [pick(MOVES), pick(MOVES)]; if (G.combo[0] === G.combo[1]) G.combo[1] = MOVES[(MOVES.indexOf(G.combo[0]) + 2) % 6]; G.ninjaFinish = pick(["dunk", "dunk", "step3", "fade", "euro"]); G.comboText = []; }
  function startMove(p, type) {
    if (ball.holder !== p || ball.move) return false;
    var dur = { cross: 0.42, btb: 0.5, legs: 0.45, spin: 0.6, hesi: 0.55, step: 0.4 }[type];
    ball.move = { type: type, t: 0, dur: dur, s0: ball.side };
    var d = opp(p); if (d && d2(d.pos, p.pos) < 2.6) d.stagger = 0.7 + p.r.spd * 0.4;
    if (type === "step") p.stepBack = 0.32;
    if (p.ninja || rand() < 0.4) { G.comboText.push(MOVE_NAME[type]); caption((p.ninja ? "" : p.name + ": ") + G.comboText.join("  →  "), 1.6); }
    return true;
  }

  // ---------- shots, passes, dunks, blocks, steals ----------
  function hoopOf(p) { return attackHoop(p.team); }
  function hoop0(p) { return hoopOf(p).clone().setY(0); }
  function rimDist(p) { return d2(p.pos, hoopOf(p)); }
  function isThree(p) { var h = hoopOf(p); return d2(p.pos, h) > ARC + 0.05 || (Math.abs(p.pos.x) > CORNER && Math.abs(p.pos.z - h.z) < 3.2); }
  function nearestDef(p) { var best = null, bd = 1e9; players.forEach(function (q) { if (q.team !== p.team && q.hidden <= 0) { var d = d2(q.pos, p.pos); if (d < bd) { bd = d; best = q; } } }); return { p: best, d: bd }; }
  function handPoint(p, up) { var f = new V3(Math.sin(p.yaw), 0, Math.cos(p.yaw)), s = p.f.root.scale.x; return p.pos.clone().addScaledVector(f, 0.18).setY(p.jy + (up ? 1.55 : 0.9) * s); }
  function shoot(p, kind) {
    if (ball.holder !== p || p.state === "shoot" || p.state === "dunk") return;
    if (!kind) { var rd = rimDist(p); kind = isThree(p) ? "three" : rd < 2 ? "layup" : rd < 4 ? (p.idx === 4 ? "hook" : "floater") : "pull"; }
    p.state = "shoot"; p.t = 0; p.shotKind = kind; ball.move = null;
  }
  var SHOT_NAME = { three: "Three", step3: "Step-back three", pull: "Pull-up jumper", fade: "Fadeaway", floater: "Floater", hook: "Hook shot", layup: "Lay-up", euro: "Euro-step lay-up", dunk: "DUNK!", oop: "Alley-oop!", cas: "Catch-and-shoot three", putback: "Put-back" };
  function release(p) {
    var kind = p.shotKind, dist = rimDist(p), d = nearestDef(p), R = p.r, three = isThree(p);
    var base = { three: 0.38 * (0.6 + R.three * 0.6), step3: 0.42 * (0.6 + R.three * 0.6), cas: 0.42 * (0.6 + R.three * 0.6), pull: 0.44 * (0.6 + R.mid * 0.5), fade: 0.42 * (0.6 + R.mid * 0.5), floater: 0.5 * (0.6 + R.fin * 0.5), hook: 0.55 * (0.6 + R.fin * 0.5), layup: 0.62 * (0.6 + R.fin * 0.5), euro: 0.66 * (0.6 + R.fin * 0.5), putback: 0.6 }[kind] || 0.45;
    var contest = d.d < 1.1 ? (kind === "fade" || kind === "step3" ? 0.85 : 0.65) : d.d < 1.8 ? 0.88 : 1;
    var prob = clamp(base * contest + (p.ninja ? 0.08 : 0), 0.05, 0.95);
    // blocks on close-range shots
    if (!three && d.p && d.d < 1.3 && kind !== "fade" && rand() < d.p.r.blk * 0.28) {
      d.p.pose = "block"; d.p.poseT = 0.6; ball.mode = "loose"; ball.holder = null; ball.pos.copy(handPoint(p, true)); ball.vel.set((rand() - 0.5) * 4, 2.5, outDir(p.team) * (3 + rand() * 2));
      caption("Blocked by " + d.p.name + "!", 1.8); p.state = "follow"; p.t = 0; return;
    }
    var make = rand() < prob, from = handPoint(p, true), h = hoopOf(p), to = h.clone().add(new V3(0, 0.12, 0));
    if (!make) to.add(new V3((rand() - 0.5) * 0.5, 0.05, outDir(p.team) * 0.22));
    ball.mode = "shot"; ball.holder = null; ball.move = null;
    ball.flight = { from: from, to: to, t: 0, T: 0.75 + dist * 0.05, h: (kind === "floater" ? 2.2 : 1.4) + dist * 0.16, make: make, shooter: p, pts: three ? 3 : 2, kind: kind, hoop: h };
    p.state = "follow"; p.t = 0;
  }
  function pass(p, to, lob) {
    if (ball.holder !== p || !to || to === p) return;
    ball.mode = "pass"; ball.holder = null; ball.move = null;
    ball.flight = { from: handPoint(p, false), target: to, t: 0, T: (lob ? 0.75 : 0.38) + d2(p.pos, to.pos) * 0.028, h: lob ? 1.6 : 0.35, lob: lob, passer: p };
    if (lob) { to.state = "oop"; to.t = 0; }
  }
  function bestOpen(p, preferShooter) {
    var best = null, bs = -1e9;
    team(p.team).forEach(function (q) { if (q === p || q.hidden > 0) return; var open = nearestDef(q).d, s = open * 1.2 + (preferShooter ? q.r.three * 2 * (isThree(q) ? 1 : 0.3) : 0) - d2(q.pos, p.pos) * 0.05; if (s > bs) { bs = s; best = q; } });
    return best;
  }
  function startDunk(p, kind) { if (ball.holder !== p) return; p.state = "dunk"; p.t = 0; p.dunkFrom = p.pos.clone(); p.dunkKind = kind || "dunk"; ball.move = null; }
  function vanish(p) {
    if (p.cool > 0 || p.hidden > 0) return;
    p.cool = G.mode === "play" ? 6 : 16; smoke(p.pos); p.hidden = 0.45;
    var h = ball.holder;
    if (h && h.team !== p.team && d2(h.pos, p.pos) < 7) { p.vanishTo = h.pos.clone().add(new V3(Math.sin(h.yaw) * 0.7, 0, Math.cos(h.yaw) * 0.7)); p.vanishSteal = h; }
    else if (ball.holder === p) { var dir = hoop0(p).sub(p.pos).setY(0).normalize(); p.vanishTo = p.pos.clone().addScaledVector(dir, Math.min(3, rimDist(p) - 1)); p.vanishSteal = null; }
    else { p.vanishTo = p.pos.clone(); p.vanishSteal = null; }
    caption("Ninja vanish", 1.4);
  }
  function trySteal(p) {
    var h = ball.holder; if (!h || h.team === p.team || d2(h.pos, p.pos) > 1.25 || ball.move) return;
    if (rand() < (p.ninja ? 0.55 : 0.18 + p.r.stl * 0.3)) { looseBall(h.pos.clone().setY(0.6), new V3(p.pos.x - h.pos.x, 2, p.pos.z - h.pos.z).multiplyScalar(1.2)); caption(p.name + " pokes it loose", 1.6); }
  }
  function looseBall(at, vel) { ball.mode = "loose"; ball.holder = null; ball.move = null; ball.flight = null; ball.pos.copy(at); ball.vel.copy(vel); }
  function scored(f) {
    var t = f.shooter.team; G.score[t] += f.pts;
    var lead = G.comboText.length ? G.comboText.join("  →  ") + "  →  " : "", play = G.play && G.play !== "iso" && G.play !== "ninja" ? PLAY_NAME[G.play] + "  →  " : "";
    caption(play + lead + f.shooter.name + ": " + (SHOT_NAME[f.kind] || "Bucket") + "  +" + f.pts, 3); G.comboText = [];
    nets[t].t = 1; team(t).forEach(function (q) { q.celebrate = 1.0; }); ui();
    if (G.score[t] >= 21) { G.over = 5; document.getElementById("bannerText").innerHTML = TEAMS[t].name.toUpperCase() + " WIN " + G.score[0] + "–" + G.score[1] + "<small>NEW GAME IN A MOMENT</small>"; document.getElementById("banner").hidden = false; }
    G.dead = 1.4; G.nextPoss = 1 - t; G.phase = "dead";
  }

  // ---------- plays ----------
  var PLAY_NAME = { pnr: "Pick & roll", kick: "Drive & kick", post: "Post-up", swing: "Swing it", iso: "Isolation", ninja: "Ninja iso", fast: "Fast break" };
  function choosePlay(t) {
    var h = ball.holder;
    if (h && h.ninja && G.mode === "watch") return "ninja";
    var r = rand(); return r < 0.32 ? "pnr" : r < 0.55 ? "kick" : r < 0.72 ? "post" : r < 0.86 ? "swing" : "iso";
  }

  // ---------- input ----------
  var keys = {}, stick = { x: 0, y: 0 }, sprintBtn = false;
  window.addEventListener("keydown", function (e) { if (G.mode !== "play") return; var k = e.key.toLowerCase(); if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].indexOf(k) >= 0) e.preventDefault(); if (!keys[k]) act(k); keys[k] = true; });
  window.addEventListener("keyup", function (e) { keys[e.key.toLowerCase()] = false; });
  var moveIdx = 0;
  function act(k) {
    if (G.dead > 0 || G.over > 0) return;
    if (k === " ") { if (ball.holder === ninja) { var rd = rimDist(ninja); if (rd < 2.2) startDunk(ninja); else shoot(ninja, isThree(ninja) ? "three" : rd < 4 ? "floater" : "pull"); } else if (ball.mode === "shot" && ball.flight && ball.flight.shooter.team !== 0 && d2(ninja.pos, ball.flight.shooter.pos) < 1.6) { ninja.pose = "block"; ninja.poseT = 0.6; } else trySteal(ninja); }
    if (k === "e") { if (ball.holder === ninja) pass(ninja, bestOpen(ninja, true)); else if (ball.holder && ball.holder.team === 0) pass(ball.holder, ninja); }
    if (k === "q") { if (startMove(ninja, MOVES[moveIdx % 6])) moveIdx++; }
    if (k === "r") { if (ball.holder === ninja) { G.play = "pnr"; G.screen = { by: mate(0, 4), t: 0, set: false }; setPlay(PLAY_NAME.pnr); caption("Tower, come set a screen", 1.4); } }
    if (k === "f") vanish(ninja);
  }
  [["b-shoot", " "], ["b-pass", "e"], ["b-move", "q"], ["b-screen", "r"], ["b-vanish", "f"]].forEach(function (b) { document.getElementById(b[0]).addEventListener("pointerdown", function (e) { e.preventDefault(); act(b[1]); }); });
  (function () { var sb = document.getElementById("b-sprint"); sb.addEventListener("pointerdown", function () { sprintBtn = true; }); ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { sb.addEventListener(ev, function () { sprintBtn = false; }); }); })();
  (function () {
    var el = document.getElementById("stick"), knob = document.getElementById("knob"), id = null;
    function mv(e) { var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 2 - 1, y = (e.clientY - r.top) / r.height * 2 - 1, m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; } stick.x = x; stick.y = y; knob.style.transform = "translate(" + x * 38 + "px," + y * 38 + "px)"; }
    el.addEventListener("pointerdown", function (e) { id = e.pointerId; el.setPointerCapture(id); mv(e); });
    el.addEventListener("pointermove", function (e) { if (e.pointerId === id) mv(e); });
    function up() { id = null; stick.x = stick.y = 0; knob.style.transform = ""; } el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
  })();
  function inputDir() {
    var x = (keys["d"] || keys["arrowright"] ? 1 : 0) - (keys["a"] || keys["arrowleft"] ? 1 : 0) + stick.x, y = (keys["s"] || keys["arrowdown"] ? 1 : 0) - (keys["w"] || keys["arrowup"] ? 1 : 0) + stick.y;
    var v = new V3(y, 0, x); if (v.length() > 1) v.normalize(); return v;
  }
  // ---------- AI ----------
  function offSpot(p) { var s = OFF_SPOTS[p.idx]; return spotFor(p.team, s[0], s[1]); }
  function think(p, dt) {
    var off = p.team === G.poss, h = ball.holder, sp = (3.4 + p.r.spd * 1.6), tgt, face = null;
    if (G.dead > 0 || G.over > 0) { return { target: off ? spotFor(1 - p.team, OFF_SPOTS[p.idx][0] * 0.6, 4 + p.idx) : offSpot(p), speed: sp * 0.6 }; }
    if (ball.mode === "loose") {
      var order = players.slice().sort(function (a, b) { return d2(a.pos, ball.pos) - d2(b.pos, ball.pos); });
      if (order.indexOf(p) < 4 || p.idx === 4) return { target: ball.pos.clone().setY(0), speed: sp * 1.05 };
      return { target: off ? offSpot(p) : offSpot(opp(p)).lerp(attackHoop(1 - p.team).clone().setY(0), 0.3), speed: sp * 0.8 };
    }
    if (ball.mode === "shot" && ball.flight) {
      var hz = ball.flight.hoop.clone().setY(0), lane = new V3((p.idx - 2) * 1.2, 0, outDir(ball.flight.shooter.team) * (1.2 + (p.idx % 2) * 0.8));
      if (p.idx >= 2 || !off) return { target: hz.add(lane), speed: sp * 0.9 };
      return { target: p.pos.clone(), speed: 0 };
    }
    if (off) return thinkOffense(p, dt, sp);
    return thinkDefense(p, dt, sp);
  }
  function thinkOffense(p, dt, sp) {
    var h = ball.holder, hoop = hoopOf(p), H0 = hoop.clone().setY(0), s = outDir(p.team);
    var inFront = (p.pos.z - hoop.z) * s < 13.2;   // in the attacking half
    // fast break lanes
    if (G.fast > 0 && h !== p) { var lanes = [[0, 6], [-4.6, 2.4], [4.6, 2.4], [-2, 7], [1.5, 9]]; return { target: spotFor(p.team, lanes[p.idx][0], lanes[p.idx][1]), speed: sp * 1.15 }; }
    if (h === p) return handler(p, dt, sp, hoop, H0, inFront);
    // pick and roll: the screener's job
    if (G.screen && G.screen.by === p) {
      var sc = G.screen, hdl = ball.holder; if (!hdl) return { target: offSpot(p), speed: sp };
      sc.t += dt;
      if (!sc.set) { var d = opp(hdl), side = d ? d.pos.clone().sub(hdl.pos).setY(0) : new V3(0, 0, -s); if (side.length() < 0.1) side.set(0, 0, -s); side.normalize(); var spot = hdl.pos.clone().addScaledVector(side, 0.75).add(new V3(side.z * 0.5, 0, -side.x * 0.5));
        if (d2(p.pos, spot) < 0.35 || sc.t > 2.4) { sc.set = true; sc.t = 0; caption(p.name + " sets the screen", 1.2); } p.pose = "screen"; p.poseT = 0.2; return { target: spot, speed: sp * 1.05 }; }
      if (sc.t < 0.9) { p.pose = "screen"; p.poseT = 0.2; return { target: p.pos.clone(), speed: 0 }; }
      sc.rolling = true; return { target: H0.clone().add(new V3(0.6, 0, s * 1.0)), speed: sp * 1.1 };
    }
    // shooters relocate, others hold spots, occasional cuts
    p.cutT = (p.cutT || 2 + rand() * 4) - dt; if (p.cutT <= 0) { p.cut = !p.cut; p.cutT = p.cut ? 1.3 : 3 + rand() * 4; }
    if (p.cut && p.idx !== 0 && !(G.play === "kick" && p.r.three > 0.8)) return { target: H0.clone().add(new V3((p.idx % 2 ? -1 : 1) * 1.2, 0, s * 1.6)), speed: sp };
    if (G.play === "post" && p.idx === 4) return { target: spotFor(p.team, -2.0, 1.6), speed: sp };
    return { target: offSpot(p), speed: sp * 0.85 };
  }
  function handler(p, dt, sp, hoop, H0, inFront) {
    var s = outDir(p.team), rd = rimDist(p), D = nearestDef(p), R = p.r;
    if (p.state === "dunk" || p.state === "shoot") return { target: p.pos.clone(), speed: 0 };
    if (p.stepBack > 0) { p.stepBack -= dt; return { target: p.pos.clone().add(p.pos.clone().sub(H0).setY(0).normalize().multiplyScalar(2)), speed: 5.2 }; }
    if (ball.move && ball.move.type === "hesi") return { target: p.pos.clone(), speed: 0.4 };
    // bring it up
    if (G.phase === "advance") {
      if (G.fast > 0) { if (rd < 2.2) { if (R.dunk > 0.6 && D.d > 0.9) startDunk(p); else shoot(p, "layup"); } setPlay(PLAY_NAME.fast); return { target: H0.clone().add(new V3(0, 0, s * 0.7)), speed: sp * 1.1 }; }
      var top = spotFor(p.team, 0, 7.8);
      if (d2(p.pos, top) < 1.4 || (inFront && d2(p.pos, H0) < 9)) { G.phase = "set"; G.play = choosePlay(p.team); G.playT = 0; setPlay(PLAY_NAME[G.play]); if (G.play === "pnr") G.screen = { by: mate(p.team, 4), t: 0, set: false }; if (G.play === "post") pass(p, mate(p.team, 4)); }
      if (p.ninja && G.mode === "watch" && !ball.move && G.combo.length && rand() < dt * 0.8) startMove(p, G.combo.shift());
      return { target: top, speed: sp * 0.95 };
    }
    G.playT = (G.playT || 0) + dt;
    p.decide = (p.decide || 0) - dt;
    // ninja iso: combo then the planned finish
    if (G.play === "ninja" && G.playT > 9 && !ball.move) { if (rimDist(p) < 2.4) startDunk(p); else shoot(p); }
    if (G.play === "ninja") {
      if (G.combo.length && !ball.move && p.decide <= 0) { startMove(p, G.combo.shift()); p.decide = 0.7; return { target: H0.clone().add(new V3(0, 0, s * 1.0)), speed: sp }; }
      if (!G.combo.length && !ball.move) {
        if (G.ninjaFinish === "step3") { if (isThree(p) && D.d < 2.4) { if (startMove(p, "step")) G.ninjaFinish = "shoot3"; } else if (isThree(p)) shoot(p, "three"); else return { target: p.pos.clone().add(p.pos.clone().sub(H0).setY(0).normalize().multiplyScalar(2)), speed: sp }; }
        else if (G.ninjaFinish === "shoot3") { if (!(p.stepBack > 0)) shoot(p, "step3"); }
        else if (G.ninjaFinish === "fade" && rd < 4.6) shoot(p, "fade");
        else if (G.ninjaFinish === "euro" && rd < 2.6) shoot(p, "euro");
        else if (rd < 2.1) startDunk(p);
      }
      return { target: H0.clone().add(new V3(0, 0, s * 0.9)), speed: sp * (ball.move ? 1.2 : 1) };
    }
    // everybody else
    if (p.decide <= 0) {
      p.decide = 0.45 + rand() * 0.6;
      var open = D.d, lane = D.p && d2(D.p.pos, hoop) < rd && open < 1.3;
      if (G.play === "pnr" && G.screen && G.screen.rolling) {
        var roller = G.screen.by; if (d2(roller.pos, hoop) < 2.6 && nearestDef(roller).d > 1.0 && rand() < 0.7) { pass(p, roller, roller.r.dunk > 0.7); G.screen = null; return { target: p.pos.clone(), speed: 0 }; }
      }
      if (rd < 2.0) { if (R.dunk > 0.7 && open > 0.8) startDunk(p); else shoot(p, p.idx === 4 ? "hook" : rand() < R.fin * 0.5 ? "euro" : "layup"); }
      else if (rd < 4.0 && open > 1.1 && rand() < 0.45) shoot(p, p.idx >= 3 ? "hook" : "floater");
      else if (!isThree(p) && rd < 5.8 && open > 1.4 && rand() < 0.3 + R.mid * 0.2) shoot(p, open < 1.8 ? "fade" : "pull");
      else if (isThree(p) && open > 1.5 && rand() < R.three * 0.55) shoot(p, "three");
      else if ((G.play === "kick" && rd < 4.5 && open < 1.6) || (lane && rand() < 0.6) || (G.play === "swing" && G.playT < 4)) { var tgt = bestOpen(p, G.play === "kick"); if (tgt) { pass(p, tgt); if (G.play === "swing") G.playT += 1; } }
      else if (!ball.move && open < 2 && rand() < 0.45) startMove(p, pick(MOVES));
    }
    if (G.play === "pnr" && G.screen && !G.screen.set) return { target: p.pos.clone(), speed: 0.6 };
    if (G.play === "swing" && G.playT < 4) return { target: offSpot(p), speed: sp * 0.8 };
    return { target: H0.clone().add(new V3(0, 0, s * 1.0)), speed: sp * 0.92 };
  }
  function thinkDefense(p, dt, sp) {
    var h = ball.holder, defHoop = attackHoop(1 - p.team), D0 = defHoop.clone().setY(0), s = outDir(1 - p.team), man = opp(p), face = null, tgt;
    var zone = G.def[p.team] === "zone" && G.phase === "set";
    if (zone) { var z = ZONE_SPOTS[p.idx], shift = ball.pos.x * 0.3, sz = clamp((ball.pos.z - defHoop.z) * s * 0.15, 0, 1.2); tgt = new V3(z[0] + shift, 0, defHoop.z + s * (z[1] + sz)); var nearBall = ball.holder && d2(ball.holder.pos, tgt) < 2.6; if (nearBall) tgt.lerp(ball.holder.pos, 0.45); face = ball.pos; }
    else { var gap = man === h ? 0.9 : 1.4; tgt = man.pos.clone().add(D0.clone().sub(man.pos).setY(0).normalize().multiplyScalar(gap)); face = man.pos;
      // help defence: if the ball handler is driving close to the rim, the nearest off-ball defender helps
      if (h && h.team !== p.team && man !== h && d2(h.pos, defHoop) < 3.4 && p.idx === helper(p.team, h)) tgt.lerp(h.pos, 0.6);
      // switch screens: the screener's defender steps up
    }
    if (h && h.team !== p.team && d2(p.pos, h.pos) < 1.1 && !ball.move && rand() < dt * (0.05 + p.r.stl * 0.12)) trySteal(p);
    if (p.ninja && G.mode === "watch" && h && h.team !== p.team && p.cool <= 0 && G.phase === "set" && d2(p.pos, h.pos) < 4 && rand() < dt * 0.06) vanish(p);
    var run = p.stagger > 0 ? 0.35 : (G.fast > 0 ? 1.12 : 0.95);
    return { target: tgt, speed: sp * run, face: face };
  }
  function helper(t, hdl) { var best = -1, bd = 1e9; team(t).forEach(function (q) { if (opp(q) === hdl) return; var d = d2(q.pos, hdl.pos); if (d < bd) { bd = d; best = q.idx; } }); return best; }

  // ---------- simulation ----------
  function step(dt) {
    if (G.over > 0) { G.over -= dt; if (G.over <= 0) newGame(); }
    if (G.capT > 0) { G.capT -= dt; if (G.capT <= 0) document.getElementById("caption").style.opacity = 0.4; }
    if (G.fast > 0) { G.fast -= dt; if (G.fast <= 0 && G.phase === "advance") setPlay("Bring it up"); }
    if (G.dead > 0) { G.dead -= dt; if (G.dead <= 0 && G.over <= 0) { inbound(G.nextPoss); caption(TEAMS[G.nextPoss].name + " inbound", 1.2); } }
    else if (ball.mode === "held" || ball.mode === "pass") { G.shot -= dt; if (G.shot <= 0) { caption("Shot clock violation", 1.8); G.dead = 1.0; G.nextPoss = 1 - G.poss; G.phase = "dead"; ball.mode = "dead"; ball.holder = null; ball.vel.set(0, 2, 0); } }
    players.forEach(function (p) {
      p.cool = Math.max(0, p.cool - dt); p.stagger = Math.max(0, p.stagger - dt); p.celebrate = Math.max(0, p.celebrate - dt); p.poseT = Math.max(0, p.poseT - dt); if (p.poseT <= 0) p.pose = null;
      if (p.hidden > 0) { p.hidden -= dt; if (p.hidden <= 0) { p.pos.copy(p.vanishTo); smoke(p.pos); if (p.vanishSteal && ball.holder === p.vanishSteal) { if (rand() < 0.6 || G.mode === "play") { giveBall(p, "steal"); caption("Ninja vanish steal!", 2.2); } else caption("Ninja vanish, but " + p.vanishSteal.name + " protects it", 1.8); } } p.f.root.visible = p.hidden <= 0; return; }
      p.f.root.visible = true;
      if (p.state === "dunk") { dunkStep(p, dt); return; }
      if (p.state === "oop") { p.t += dt; p.jy = Math.sin(Math.PI * clamp(p.t / 1.1, 0, 1)) * 1.6; if (p.t > 1.1) { p.state = "run"; p.jy = 0; } }
      if (p.state === "shoot") { p.t += dt; var hop = { layup: 0.6, euro: 0.6, floater: 0.45, fade: 0.5, step3: 0.45, three: 0.4, cas: 0.4, hook: 0.35, pull: 0.45 }[p.shotKind] || 0.4; p.jy = Math.sin(Math.PI * clamp(p.t / 0.7, 0, 1)) * hop; p.yaw = Math.atan2(hoopOf(p).x - p.pos.x, hoopOf(p).z - p.pos.z);
        if (p.shotKind === "fade") p.pos.addScaledVector(p.pos.clone().sub(hoop0(p)).setY(0).normalize(), dt * 1.2);
        if (p.shotKind === "euro" && p.t < 0.35) p.pos.x += dt * 2.4 * (p.pos.x > 0 ? -1 : 1);
        if (p.t >= 0.32 && ball.holder === p) release(p); if (p.t >= 0.7) { p.state = "run"; p.jy = 0; } return; }
      if (p.state === "follow") { p.t += dt; if (p.t > 0.45) p.state = "run"; }
      var plan;
      if (p === ninja && G.mode === "play") {
        var dir = inputDir(), spr = keys["shift"] || sprintBtn; plan = { target: p.pos.clone().addScaledVector(dir, 2), speed: dir.length() * (spr ? 6.2 : 4.9) };
        if (G.phase === "advance" && ball.holder === p && (p.pos.z - hoopOf(p).z) * outDir(0) < 9) { G.phase = "set"; G.play = "iso"; setPlay("Your call"); }
      } else plan = think(p, dt);
      var to = plan.target.clone().sub(p.pos).setY(0), dist = to.length(), want = dist > 0.08 ? to.normalize().multiplyScalar(Math.min(plan.speed, dist * 4)) : new V3();
      p.vel.lerp(want, clamp(dt * 7, 0, 1)); p.pos.addScaledVector(p.vel, dt);
      p.pos.x = clamp(p.pos.x, -HALFW - 0.6, HALFW + 0.6); p.pos.z = clamp(p.pos.z, -HALFL - 0.6, HALFL + 0.6);
      var v = p.vel.length();
      if (plan.face && G.phase !== "advance") p.yaw = lerpAngle(p.yaw, Math.atan2(plan.face.x - p.pos.x, plan.face.z - p.pos.z), dt * 8);
      else if (v > 0.3) p.yaw = lerpAngle(p.yaw, Math.atan2(p.vel.x, p.vel.z), dt * 10);
      p.phase += dt * (4 + v * 3.1);
      if (p.state !== "oop") p.jy = p.celebrate > 0 ? Math.abs(Math.sin(p.celebrate * 9)) * 0.3 : p.pose === "block" ? Math.sin(Math.PI * clamp(1 - p.poseT / 0.6, 0, 1)) * 0.8 : 0;
    });
    for (var a = 0; a < players.length; a++) for (var b = a + 1; b < players.length; b++) { var A = players[a], B = players[b]; if (A.hidden > 0 || B.hidden > 0) continue; var dx = B.pos.x - A.pos.x, dz = B.pos.z - A.pos.z, dd = Math.hypot(dx, dz), min = 0.58 * (A.f.root.scale.x + B.f.root.scale.x) / 2; if (dd > 0 && dd < min) { var push = (min - dd) / 2; dx /= dd; dz /= dd; A.pos.x -= dx * push; A.pos.z -= dz * push; B.pos.x += dx * push; B.pos.z += dz * push; } }
    stepBall(dt); ui();
  }
  function dunkStep(p, dt) {
    p.t += dt / 1.0; var k = p.t, H0 = hoop0(p), under = H0.clone().add(new V3(0, 0, outDir(p.team) * 0.5));
    p.pos.lerpVectors(p.dunkFrom, under, ease(k / 0.55)); p.jy = Math.sin(Math.PI * clamp(k / 0.9, 0, 1)) * 1.6; p.yaw = Math.atan2(H0.x - p.pos.x, H0.z - p.pos.z);
    if (k >= 0.5 && ball.holder === p) { ball.mode = "shot"; ball.holder = null; ball.flight = { from: handPoint(p, true), to: hoopOf(p).clone().add(new V3(0, 0.05, 0)), t: 0, T: 0.12, h: 0.05, make: true, shooter: p, pts: 2, kind: p.dunkKind, hoop: hoopOf(p) }; }
    if (k >= 1) { p.state = "run"; p.jy = 0; }
  }
  function stepBall(dt) {
    var p = ball.holder;
    if (ball.mode === "held" && p) {
      var f = new V3(Math.sin(p.yaw), 0, Math.cos(p.yaw)), r = new V3(Math.cos(p.yaw), 0, -Math.sin(p.yaw)), sc = p.f.root.scale.x;
      ball.phase += dt * Math.PI * 2 * 2.3;
      var side = ball.side, low = 0, behind = 0, fwd = 0.2, k;
      if (ball.move) {
        ball.move.t += dt; k = clamp(ball.move.t / ball.move.dur, 0, 1); var mt = ball.move.type;
        if (mt === "cross") { side = ball.move.s0 * Math.cos(Math.PI * ease(k)); low = Math.sin(Math.PI * k); }
        else if (mt === "btb") { side = ball.move.s0 * Math.cos(Math.PI * ease(k)); behind = Math.sin(Math.PI * ease(k)); low = 0.5; }
        else if (mt === "legs") { side = ball.move.s0 * Math.cos(Math.PI * ease(k)); fwd = 0.2 - 0.25 * Math.sin(Math.PI * k); low = 1; }
        else if (mt === "spin") { p.yaw += dt * Math.PI * 2 / ball.move.dur; }
        else if (mt === "hesi") { low = 0.6 * Math.sin(Math.PI * k); }
        if (k >= 1) { if (mt === "cross" || mt === "btb" || mt === "legs") ball.side = -ball.move.s0; ball.move = null; }
      }
      if (p.state === "shoot" || p.state === "dunk") ball.pos.copy(handPoint(p, true));
      else { var hg = 0.12 + (0.6 * sc - 0.12) * Math.abs(Math.cos(ball.phase)) * (1 - 0.6 * low); ball.pos.copy(p.pos).addScaledVector(r, side * 0.34 * sc).addScaledVector(f, (fwd - behind * 0.5) * sc).setY(hg + p.jy * 0.5); }
    } else if ((ball.mode === "shot" || ball.mode === "pass") && ball.flight) {
      var fl = ball.flight; fl.t += dt / fl.T; var k2 = clamp(fl.t, 0, 1);
      var to = fl.target ? (fl.lob ? hoopOf(fl.target).clone().add(new V3(0, 0.3, outDir(fl.target.team) * 0.4)) : handPoint(fl.target, false)) : fl.to;
      ball.pos.lerpVectors(fl.from, to, k2); ball.pos.y += Math.sin(Math.PI * k2) * fl.h;
      if (fl.target && !fl.lob) { var thief = players.find(function (q) { return q.team !== fl.target.team && q.hidden <= 0 && d2(q.pos, ball.pos) < 0.45 && rand() < 0.03 + q.r.stl * 0.04; }); if (thief) { giveBall(thief, "steal"); caption(thief.name + " picks off the pass", 1.6); return; } }
      if (k2 >= 1) {
        if (fl.target) {
          if (fl.lob) { var rc = fl.target; ball.mode = "held"; ball.holder = rc; rc.state = "run"; ball.mode = "shot"; ball.holder = null; ball.flight = { from: ball.pos.clone(), to: hoopOf(rc).clone().add(new V3(0, 0.05, 0)), t: 0, T: 0.14, h: 0.02, make: rand() < 0.85, shooter: rc, pts: 2, kind: "oop", hoop: hoopOf(rc) }; caption(fl.passer.name + " lobs it up…", 0.8); }
          else { giveBall(fl.target, "pass"); if (G.play === "kick" && isThree(fl.target) && nearestDef(fl.target).d > 1.3 && fl.target.r.three > 0.6 && !(fl.target === ninja && G.mode === "play")) shoot(fl.target, "cas"); }
        }
        else if (fl.make) { ball.mode = "swish"; ball.vel.set(0, -1.5, 0); ball.pos.copy(fl.hoop); scored(fl); }
        else { looseBall(ball.pos.clone(), new V3((rand() - 0.5) * 3, 2.6 + rand(), outDir(fl.shooter.team) * (2 + rand() * 2.5))); caption("Off the rim", 1.0); }
      }
    } else if (ball.mode === "swish" || ball.mode === "loose" || ball.mode === "dead") {
      ball.vel.y -= 9.8 * dt; ball.pos.addScaledVector(ball.vel, dt);
      if (ball.pos.y < 0.2) { ball.pos.y = 0.2; ball.vel.y = Math.abs(ball.vel.y) * 0.6; ball.vel.x *= 0.85; ball.vel.z *= 0.85; if (ball.mode === "swish") ball.mode = "dead"; }
      if (Math.abs(ball.pos.x) > HALFW + 0.5) { ball.pos.x = Math.sign(ball.pos.x) * (HALFW + 0.5); ball.vel.x *= -0.5; }
      if (Math.abs(ball.pos.z) > HALFL + 0.5) { ball.pos.z = Math.sign(ball.pos.z) * (HALFL + 0.5); ball.vel.z *= -0.5; }
      if (ball.mode === "loose" && ball.pos.y < 1.4) {
        var grab = players.find(function (q) { return q.hidden <= 0 && d2(q.pos, ball.pos) < 0.4 + q.r.reb * 0.15; });
        if (grab) { var offReb = grab.team === G.poss; giveBall(grab, offReb ? "rebound-off" : "rebound"); caption(grab.name + (offReb ? " offensive board" : " grabs the board"), 1.3);
          if (offReb && rimDist(grab) < 2.2 && grab.r.reb > 0.7) shoot(grab, "putback"); else if (offReb) { G.phase = "set"; G.play = choosePlay(grab.team); setPlay(PLAY_NAME[G.play]); } }
      }
    }
  }


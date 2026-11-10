# HoopLife Community: brand, merch and mascot kit

Brand, merch and mascot work for **HoopLife Community**, the basketball community led by **Lawrance** ([@lawrance_hooplife](https://www.instagram.com/lawrance_hooplife/)) in Chennai.

**Live showcase (for review):** https://roosewelt-nacth.github.io/HoopLife/
Every design below opens in the browser. The 3D pages can be turned, and the games can be played.

> Status: **for approval by Lawrance.** Each section ends with what needs his sign-off.

---

## 1. Brand basics

| Item | Decision |
|---|---|
| Name | HoopLife Community |
| Instagram handle | @hooplife.community (was free on 10 Nov 2026; claim it before launch) |
| Base | Chennai, all levels |
| Voice | English + Tanglish, premium and clean |
| Colours | Court Black `#0B0B0C`, Hoop Red `#D7262E`, Trophy Gold `#C9A24A`, Chalk White `#F4F4F2` |
| Slogans | **One Court. One Family.** (tag) · Passion. Purpose. Hoops. (from Lawrance's bio) |
| Approvals | Lawrance approves every design before it is used |

Details: [`00_Brand-Research/brand-decisions.md`](00_Brand-Research/brand-decisions.md) · style notes on Lawrance's page: [`00_Brand-Research/lawrance-style-notes.md`](00_Brand-Research/lawrance-style-notes.md)

---

## 2. Logo: the Pulse H (basketball version B1)

**The idea:** a basketball whose two curved side seams and middle line form an **H**. The middle line is a **red heartbeat** (Hoop + **Life**). B1 adds the vertical and horizontal seams, so it reads clearly as a basketball and not a tennis ball. The heartbeat breaks through the vertical seam.

- One red element only (the heartbeat). Everything else is black or white.
- Custom monoline wordmark. The ball replaces the second O in HOOP.
- Approved direction: **B1**. Files: [`01_Logos/CHECKPOINT-v2-Basketball-B1/files`](01_Logos/CHECKPOINT-v2-Basketball-B1/files) (icon + wordmark, dark / light / transparent SVG).

**How we got here** (all rounds are in `01_Logos/`, and each opens on the showcase):

| Round | Direction | Outcome |
|---|---|---|
| 1 | Masked ninja, HL monogram, court badge | Ninja chosen to explore |
| 2 | Realistic ninja ball family | Too "kiddish" |
| 3 | Shot-clock block letters | Felt like a copy of a reference |
| 4 | **Pulse H** (original idea) | Approved as premium, saved as checkpoint v1 |
| 5 | Ninja added into the mark | Too clumsy. The ninja lives in motion instead |
| 6 | Refinements (weight, spacing, line hierarchy, solid icon) | Options for later |
| 7 | **Basketball seams B1 / B2** | **B1 approved**, saved as checkpoint v2 |

**Protect it:** use ™ from day one. File a trademark with IP India (ipindia.gov.in) in Lawrance's name, Class 41 (sports and events) and Class 25 (clothing). Run the trademark search first.

✅ *Approval: B1 as the official logo.*

---

## 3. Intro and outro video

- Built in Claude's animation tool (private link, owner only): https://claude.ai/artifact/HrjqwpkRsEtFF3aSSU2Z9v
- Story: two ninja eye slits open in the dark, the camera pushes in, the slits stretch into the B1 seams, the ring and seams draw in, the red heartbeat beats twice, and HOOPLIFE writes itself in. The outro reverses it and ends on @hooplife.community.
- Vertical 1080 × 1920 (Reels, Shorts, Status), about 13.5 s, with an original score.
- **To share it:** open the link and choose **Export → MP4**, then add the file to `docs/media/`. The animation page itself can't be made public from GitHub.

✅ *Approval: intro and outro look and timing.*

---

## 4. Merch

### 4.1 Mini-basketball keychain (current)
Showcase page: *Ball keychain*. Source: [`02_Merch/keychain-ball`](02_Merch/keychain-ball)

- 40 mm ball with the B1 seams engraved, **HOOPLIFE** hero panel and **EST. 2026** (the usual ball-brand layout: one wordmark per panel, never across a seam).
- **Jersey jock tag** (approved v4): 44 × 16 mm woven label with the B1 mark slot, a court with gold arcs and the heartbeat as the half-court line, ONE COURT · ONE FAMILY, HOOPLIFE, a scoreboard-style member number, and EST. 2026. Design: [`jock-tag/jock-tag-v4.svg`](02_Merch/keychain-ball/jock-tag/jock-tag-v4.svg)
- **Ticket card** packaging: ADMIT ONE · SEC HL · ROW 26 · SEAT 01.
- Six colourways with hex codes: Court Orange, Midnight Pulse, Chalk Court, Hoop Red, Trophy Gold, Blacktop.
- **Print file:** [`print/hooplife_ball_keychain_40mm.stl`](02_Merch/keychain-ball/print/hooplife_ball_keychain_40mm.stl) (about 41 MB). How to print: [`print/PRINT-NOTES.md`](02_Merch/keychain-ball/print/PRINT-NOTES.md). Regenerate with `python make_stl.py`.
- "In someone's hand" mode: add a hand photo on the page and place the ball in it.

### 4.2 Disc keychain (earlier option)
Showcase page: *Disc keychain*. A 45 mm enamel disc with chrome, gold and black-nickel finishes. Kept for comparison.

### 4.3 Brick-built ninja collectible (merch only)
Showcase page: *Brick Ninja*. Source: [`02_Merch/brick-ninja`](02_Merch/brick-ninja)

- Built from stud bricks, plates, slopes and printed tiles: peaked hood, mask tile (black or red), printed face, torso print with the red sash line and 01, a B1 ball, and a 6 × 6 display plate with a HOOPLIFE tile.
- Views: assembled, exploded parts, in the window box. Includes a full parts list for manufacturer quotes.
- Sold as an original HoopLife brick collectible, **not** as a LEGO product (LEGO is a trademark of the LEGO Group). Used for merch only, not in the games or intro.

✅ *Approval: keychain colourway for the first drop, jock tag v4, brick ninja for a limited run.*

---

## 5. Mascot: the HoopLife Ninja

- **3D figure** (vinyl-toy stand-in with a pointed hood and cowl mask): showcase page *Ninja figure*. Source: [`03_Mascot/HoopLife-Ninja-Figure.html`](03_Mascot/HoopLife-Ninja-Figure.html)
- **Sculpt package** for the final model by a 3D artist or an image-to-3D tool: [`03_Mascot/sculpt-package`](03_Mascot/sculpt-package): turnaround sheet, [`CHARACTER-BRIEF.md`](03_Mascot/CHARACTER-BRIEF.md) and [`PROMPTS.md`](03_Mascot/sculpt-package/PROMPTS.md).
- Original character. No real person's likeness, no existing character's mask.

✅ *Approval: the mascot direction before the sculpted model is ordered.*

---

## 6. Games (content and community engagement)

All games run in the browser, with no install. **Watch** mode plays itself (good for screen-recorded reels). **Play** mode lets you control the Ninja with the keyboard or touch.

| Game | What it is | Source |
|---|---|---|
| **Ninja Court 5v5 (3D)** | Full court with Funko-style figures. Cherry blossom park, lakeside sunset or **graffiti street**. Pick-and-roll, fast breaks, man or zone defence, 24 s shot clock, every move from crossovers to alley-oops. Bird's-eye, broadcast, baseline, follow and free cameras | [`03_Mascot/HoopLife-Court-5v5.html`](03_Mascot/HoopLife-Court-5v5.html) |
| **Ninja Court 8-Bit** | Side-view arcade version of the same game with realistic pixel athletes. Street graffiti, blossom and lake scenes, chiptune sound | [`03_Mascot/HoopLife-Court-8bit.html`](03_Mascot/HoopLife-Court-8bit.html) (built from `src-8bit-template.html` + `src-8bit-sim.js`) |
| Ninja Court 3v3 | The first street 3v3 version | [`03_Mascot/HoopLife-Court.html`](03_Mascot/HoopLife-Court.html) |

Players are **original characters** whose play-styles are inspired by pro archetypes (sharpshooter, point forward, rim-running big, and so on). No real players' names or likenesses are used.

**Keyboard:** WASD / arrows to move · Shift to sprint · Space to shoot or block · E to pass · Q for a dribble move · R to call a screen · F for the ninja vanish.

✅ *Approval: which game to feature on Instagram, and the scene for the launch reel.*

---

## 7. Repo map

```
00_Brand-Research/   brand decisions and notes on Lawrance's style
01_Logos/            every logo round; CHECKPOINT-v1-PulseH and CHECKPOINT-v2-Basketball-B1 are the approved states
02_Merch/            keychains (disc, ball + jock tag + print files), brick ninja
03_Mascot/           ninja figure, sculpt package, the games
docs/                the public showcase site (GitHub Pages), built by tools/build-site.ps1
tools/               scripts
```

**Update the showcase** after changing a design:
```
powershell -ExecutionPolicy Bypass -File tools/build-site.ps1
git add -A
git commit -m "Update showcase"
git push
```

**Run locally:** open any `.html` file in Chrome or Edge, or run `python -m http.server 8765` and visit `http://localhost:8765/docs/`.

---

## 8. Next steps (after approval)

1. Claim @hooplife.community and set up the Instagram profile (bio, icon, highlights).
2. Turn the existing WhatsApp group into the HoopLife Community.
3. Launch post and a 2-week content plan, using the intro and game clips.
4. File the trademark.
5. Order merch samples (keychain + jock tag first).
6. Sponsor pitch deck.

---

*Prepared for HoopLife Community, November 2026.*

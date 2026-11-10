# HoopLife Ball Keychain v3: print notes

## Ball: `hooplife_ball_keychain_40mm.stl`
Millimetres, Z up, logo faces -Y (front). About 41 MB.

| Panel | What is on it | Depth |
|---|---|---|
| Front | B1 logo seams + heartbeat | 0.8 mm seams, 1.0 mm heartbeat |
| Left upper (hero) | HOOPLIFE wordmark | 0.4 mm |
| Right upper | EST. 2026 | 0.4 mm |
| Back | Full basketball seams | 0.8 mm |
| Top | Loop with a 3 mm hole for a jump ring | |

Layout follows the usual ball-brand convention: one bold wordmark on one panel, never across a seam, with small secondary text on the panel below.

**How to make it**
1. **Resin print (best detail):** fill the seams and text with paint (see colourways), then wipe the surface.
2. **Multi-colour FDM (AMS/MMU):** colour-paint the grooves in the slicer.
3. **Production run:** send the STL plus the colourway codes to a PU/PVC mini-ball supplier. They pad-print the branding instead of engraving it.

## Jersey jock tag
22 × 34 mm woven label (made by a woven-label supplier).
- **Front:** full court in tone-on-tone thread, gold 3-point arc at the baseline end, raised (3D) B1 mark in the centre circle, HOOPLIFE under the baseline. Only the heartbeat is red.
- **Back:** ONE COURT. ONE FAMILY., the heartbeat, and the member number.
- Hung on a woven ribbon with gold edge stripes, a metal crimp and a D-ring.
- Tag colours follow the ball colourway (see the mockup).

## Ticket card (packaging)
A game-ticket card: B1 mark + HOOPLIFE + ADMIT ONE at the top, the keychain in the middle, and a tear-off stub with SEC HL · ROW 26 · SEAT 01 and the member number.

## Colourways
| Name | Ball | Seams | Heartbeat | Print |
|---|---|---|---|---|
| Court Orange | #C8581F | #1B1411 | #FFFFFF | #1B1411 |
| Midnight Pulse | #141417 | #D9D9DC | #D7262E | #D9D9DC |
| Chalk Court | #EEEBE3 | #141416 | #D7262E | #141416 |
| Hoop Red | #B3151D | #121214 | #FFFFFF | #121214 |
| Trophy Gold | #C29A44 | #17140F | #D7262E | #17140F |
| Blacktop | #1A1A1D | #E8702A | #FFFFFF | #E8702A |

Change size or depths at the top of `make_stl.py`, then run `python make_stl.py`.

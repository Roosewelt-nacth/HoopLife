# HoopLife Ball Keychain: print notes

**File:** `hooplife_ball_keychain_40mm.stl` (millimetres, Z up, logo faces -Y / front)

| Item | Value |
|---|---|
| Ball | 40 mm diameter |
| Seams | Engraved 0.8 mm deep, about 1.4 mm wide |
| Heartbeat | Engraved 1.0 mm deep, about 1.9 mm wide (front only) |
| Back | Full basketball seams |
| Loop | Printed on top, 3 mm hole for a jump ring |

## Recommended ways to make it
1. **Resin print (best detail):** print in one colour, then fill the seams with black paint and the heartbeat with red (or white on the orange version). Wipe the surface clean.
2. **Multi-colour FDM (Bambu/Prusa with AMS/MMU):** use the slicer's colour-painting tool to paint the grooves in the seam and heartbeat colours.
3. **Single-colour FDM:** print with the loop up and tree supports. 0.12 mm layers keep the grooves crisp.

## Colourways (from the mockup)
| Name | Ball | Seams | Heartbeat |
|---|---|---|---|
| Court Orange | #C4561C | #1A1210 | #F4F4F2 |
| Midnight | #18181B | #E9E9EB | #D7262E |
| Chalk White | #ECEAE4 | #121214 | #D7262E |
| Hoop Red | #B0141C | #111113 | #F4F4F2 |
| Trophy Gold | #C49A3E | #141414 | #D7262E |

To change the size or groove depth, edit the numbers at the top of `make_stl.py` and run `python make_stl.py`.

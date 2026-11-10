"""HoopLife ball keychain: writes a print-ready binary STL (Z up, millimetres).

40 mm ball with the B1 logo seams engraved 0.8 mm deep and the heartbeat 1.0 mm deep on the front,
full basketball seams on the back, and a loop on top for a jump ring.
Uses the same logo-to-sphere mapping as HoopLife-Ball-Keychain.html.

Run:  python make_stl.py
"""
import os
import struct
import numpy as np

R = 20.0                    # ball radius, mm
SEAM_W, PULSE_W = 6.0, 8.0  # logo units (200-unit grid, ball edge = radius 84)
SEAM_D, PULSE_D = 0.8, 1.0  # groove depths, mm
NLAT, NLON = 450, 900
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "print")


def bezier(p, n=60):
    t = np.linspace(0, 1, n)[:, None]
    p = np.array(p, float).reshape(4, 2)
    return (1 - t) ** 3 * p[0] + 3 * t * (1 - t) ** 2 * p[1] + 3 * t ** 2 * (1 - t) * p[2] + t ** 3 * p[3]


SIDES = [bezier([42, 42, 64, 76, 64, 124, 42, 158]), bezier([158, 42, 136, 76, 136, 124, 158, 158])]
FRONT = SIDES + [np.array(s, float) for s in ([[16, 100], [58, 100]], [[142, 100], [184, 100]], [[100, 16], [100, 60]], [[100, 140], [100, 184]])]
BACK = SIDES + [np.array(s, float) for s in ([[4, 100], [196, 100]], [[100, 4], [100, 196]])]
PULSE = [np.array([[58, 100], [81, 100], [90, 72], [100, 128], [110, 100], [142, 100]], float)]


def dist(pts, polys):
    """Distance from each 2D point to the nearest segment of any polyline."""
    best = np.full(len(pts), np.inf)
    for poly in polys:
        a, b = poly[:-1], poly[1:]
        for i in range(len(a)):
            ab = b[i] - a[i]
            t = np.clip(((pts - a[i]) @ ab) / max(ab @ ab, 1e-9), 0, 1)
            d = np.linalg.norm(pts - (a[i] + t[:, None] * ab), axis=1)
            best = np.minimum(best, d)
    return best


def groove(d, w, depth):
    """Rounded groove profile: full depth in the middle, easing to 0 at the edge."""
    x = np.clip(d / (w / 2), 0, 1)
    return depth * (1 - x ** 2) ** 0.5 * (x < 1)


TEXT_D = 0.4  # engraved branding depth, mm
FONT = r"C:\Windows\Fonts\arialbd.ttf"


def hero_image():
    """HOOPLIFE in the brand's monoline letters (plain O's), white on black, 1024 x 256."""
    from PIL import Image, ImageDraw
    img = Image.new("L", (1024, 256), 0)
    d = ImageDraw.Draw(img)
    k = 900 / 620
    ox, oy = (1024 - 606 * k) / 2, (256 - 100 * k) / 2
    w = int(15 * k)
    P = lambda X, Y: (ox + X * k, oy + Y * k)
    def ln(*pts):
        d.line([P(*p) for p in pts], fill=255, width=w, joint="curve")
        for p in (pts[0], pts[-1]):
            cx, cy = P(*p); d.ellipse([cx - w / 2, cy - w / 2, cx + w / 2, cy + w / 2], fill=255)
    hw = w / 2  # Pillow draws outlines inside the box, so grow the box by half a stroke to centre it on the path

    def oval(x0):
        a, b = P(x0, 0), P(x0 + 84, 100); d.ellipse([a[0] - hw, a[1] - hw, b[0] + hw, b[1] + hw], outline=255, width=w)
    ln((0, 0), (0, 100)); ln((52, 0), (52, 100)); ln((0, 50), (52, 50))
    oval(80); oval(192)
    ln((304, 100), (304, 0), (330, 0)); ln((330, 52), (304, 52))
    a, b = P(304, 0), P(356, 52); d.arc([a[0] - hw, a[1] - hw, b[0] + hw, b[1] + hw], -90, 90, fill=255, width=w)
    ln((384, 0), (384, 100), (430, 100)); ln((458, 0), (458, 100))
    ln((532, 0), (486, 0), (486, 100)); ln((486, 50), (524, 50))
    ln((606, 0), (560, 0), (560, 100), (606, 100)); ln((560, 50), (598, 50))
    return np.asarray(img, float) / 255


def line_image(text, size, spacing):
    from PIL import Image, ImageDraw, ImageFont
    img = Image.new("L", (1024, 128), 0)
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT, size)
    widths = [d.textlength(ch, font=f) for ch in text]
    total = sum(widths) + spacing * (len(text) - 1)
    x = (1024 - total) / 2
    for ch, cw in zip(text, widths):
        d.text((x, 66), ch, font=f, fill=255, anchor="lm"); x += cw + spacing
    return np.asarray(img, float) / 255


def branding():
    return [(hero_image(), 19, -1, 34), (line_image("EST. 2026", 92, 18), 15, 1, 24)]


def decal(dirs, img, lat_deg, side, half_deg):
    """Gnomonic projection of a flat image onto the ball around a centre direction (matches the web mockup)."""
    la = np.radians(lat_deg)
    c = np.array([side * np.cos(la), np.sin(la), 0.0])
    n = np.array([-c[1] * c[0], 1 - c[1] ** 2, -c[1] * c[2]]); n /= np.linalg.norm(n)
    r = np.cross(-c, n)
    h, w = img.shape
    tw = np.tan(np.radians(half_deg)); th = tw * h / w
    dot = dirs @ c
    ok = dot > np.cos(np.radians(half_deg * 1.4))
    out = np.zeros(len(dirs))
    a = (dirs[ok] @ r) / dot[ok]; b = (dirs[ok] @ n) / dot[ok]
    px = np.round((a / tw * 0.5 + 0.5) * w).astype(int); py = np.round((0.5 - b / th * 0.5) * h).astype(int)
    inside = (px >= 0) & (py >= 0) & (px < w) & (py < h)
    idx = np.flatnonzero(ok)[inside]
    out[idx] = img[py[inside], px[inside]]
    return out


def ball():
    th = np.linspace(0, np.pi, NLAT + 1)
    ph = np.linspace(0, 2 * np.pi, NLON, endpoint=False)
    T, P = np.meshgrid(th, ph, indexing="ij")
    # y up, z toward the viewer (same axes as the web mockup)
    x, y, z = -np.cos(P) * np.sin(T), np.cos(T), np.sin(P) * np.sin(T)
    x, y, z = x.ravel(), y.ravel(), z.ravel()
    front = z >= 0
    ang = np.arccos(np.clip(np.abs(z), 0, 1))
    rho = np.hypot(x, y)
    rho[rho < 1e-9] = 1e-9
    r = 84 * (0.7 * np.sin(ang) + 0.3 * ang / (np.pi / 2))
    lx = np.where(front, x, -x) / rho
    uv = np.stack([100 + r * lx, 100 - r * y / rho], axis=1)
    disp = np.zeros(len(x))
    f, b = front, ~front
    disp[f] = np.maximum(groove(dist(uv[f], FRONT), SEAM_W, SEAM_D), groove(dist(uv[f], PULSE), PULSE_W, PULSE_D))
    disp[b] = groove(dist(uv[b], BACK), SEAM_W, SEAM_D)
    # Panel branding, engraved 0.4 mm (same panels as the web mockup).
    dirs = np.stack([x, y, z], axis=1)
    ink = np.zeros(len(x))
    for img, lat, side, half in branding():
        ink = np.maximum(ink, decal(dirs, img, lat, side, half))
    disp = np.maximum(disp, ink * TEXT_D)
    rad = R - disp
    V = np.stack([x * rad, y * rad, z * rad], axis=1)
    F = []
    for i in range(NLAT):
        for j in range(NLON):
            a = i * NLON + j
            bq = i * NLON + (j + 1) % NLON
            c = (i + 1) * NLON + j
            d = (i + 1) * NLON + (j + 1) % NLON
            if i != 0:
                F.append((a, bq, c))
            if i != NLAT - 1:
                F.append((bq, d, c))
    return V, np.array(F)


def torus(cx, cy, cz, major=2.6, minor=1.1, nu=64, nv=24):
    """Loop in the x-y plane (faces the front), centred above the ball."""
    u = np.linspace(0, 2 * np.pi, nu, endpoint=False)
    v = np.linspace(0, 2 * np.pi, nv, endpoint=False)
    U, Vv = np.meshgrid(u, v, indexing="ij")
    x = (major + minor * np.cos(Vv)) * np.cos(U) + cx
    y = (major + minor * np.cos(Vv)) * np.sin(U) + cy
    z = minor * np.sin(Vv) + cz
    V = np.stack([x.ravel(), y.ravel(), z.ravel()], axis=1)
    F = []
    for i in range(nu):
        for j in range(nv):
            a = i * nv + j
            b = ((i + 1) % nu) * nv + j
            c = i * nv + (j + 1) % nv
            d = ((i + 1) % nu) * nv + (j + 1) % nv
            F += [(a, b, d), (a, d, c)]
    return V, np.array(F)


def write_stl(path, V, F):
    tri = V[F]
    n = np.cross(tri[:, 1] - tri[:, 0], tri[:, 2] - tri[:, 0])
    n /= np.linalg.norm(n, axis=1, keepdims=True) + 1e-12
    with open(path, "wb") as fh:
        fh.write(b"HoopLife ball keychain 40mm".ljust(80, b" "))
        fh.write(struct.pack("<I", len(F)))
        rec = np.zeros(len(F), dtype=[("n", "<f4", 3), ("v", "<f4", 9), ("a", "<u2")])
        rec["n"] = n
        rec["v"] = tri.reshape(-1, 9)
        fh.write(rec.tobytes())


SLOGANS = {"passion-purpose-hoops": ["PASSION.", "PURPOSE.", "HOOPS."],
           "one-court-one-family": ["ONE", "COURT.", "ONE", "FAMILY."],
           "chennai-runs-here": ["CHENNAI", "RUNS", "HERE."]}


def write_tag_svgs():
    """Laser-engraving artwork for a 20 x 34 mm stainless dog tag (front per slogan + one back)."""
    def shell(inner):
        return ('<svg xmlns="http://www.w3.org/2000/svg" width="20mm" height="34mm" viewBox="0 0 20 34">'
                '<rect x="0.25" y="0.25" width="19.5" height="33.5" rx="3.2" fill="none" stroke="#999" stroke-width="0.1"/>'
                '<circle cx="10" cy="2.8" r="1.3" fill="none" stroke="#999" stroke-width="0.1"/>' + inner + '</svg>')
    font = 'font-family="Archivo Black, Arial Black, sans-serif" font-weight="900" text-anchor="middle"'
    for name, lines in SLOGANS.items():
        size = 2.6 if len(lines) > 3 else 2.75
        top = 11.2 - (len(lines) - 3) * 1.2
        txt = "".join(f'<text x="10" y="{top + i * (size + 0.35):.2f}" font-size="{size}" {font} fill="#000">{t}</text>' for i, t in enumerate(lines))
        py = top + len(lines) * (size + 0.35) + 1.2
        pulse = (f'<polyline points="4.3,{py} 7.6,{py} 8.8,{py - 1.7:.2f} 10.2,{py + 1.7:.2f} 11.4,{py} 15.7,{py}" '
                 'fill="none" stroke="#D7262E" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>')
        foot = '<text x="10" y="30.6" font-size="1.3" font-family="JetBrains Mono, Consolas, monospace" letter-spacing="0.3" text-anchor="middle" fill="#000">HOOPLIFE</text>'
        with open(os.path.join(OUT, f"dogtag-front_{name}.svg"), "w", encoding="utf-8") as fh:
            fh.write(shell(txt + pulse + foot))
    back = ('<text x="10" y="17" font-size="1.55" ' + font + ' fill="#000">@hooplife.community</text>'
            '<text x="10" y="19.6" font-size="1.15" font-family="JetBrains Mono, Consolas, monospace" text-anchor="middle" fill="#000">CHENNAI · EST. 2026</text>')
    with open(os.path.join(OUT, "dogtag-back.svg"), "w", encoding="utf-8") as fh:
        fh.write(shell(back))


def main():
    os.makedirs(OUT, exist_ok=True)
    Vb, Fb = ball()
    Vt, Ft = torus(0, R + 1.9, 0)
    V = np.vstack([Vb, Vt])
    F = np.vstack([Fb, Ft + len(Vb)])
    # y-up (web) to z-up (slicers): (x, y, z) -> (x, -z, y), keeps the logo facing -Y (front in most slicers)
    V = np.stack([V[:, 0], -V[:, 2], V[:, 1]], axis=1)
    path = os.path.join(OUT, "hooplife_ball_keychain_40mm.stl")
    write_stl(path, V, F)
    print(f"Wrote {path}: {len(F):,} triangles, {os.path.getsize(path) / 1e6:.1f} MB")


if __name__ == "__main__":
    main()

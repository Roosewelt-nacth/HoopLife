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
NLAT, NLON = 300, 600
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

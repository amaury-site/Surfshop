import numpy as np
from scipy.interpolate import PchipInterpolator
from PIL import Image, ImageDraw
from glb import mat, Part
from geo import loft, tube, catmull, frames, ellipsoid, box, ground, superellipsoid, ellipse_sec

ACCENT = {"combi-32": (0.22, 0.74, 0.97), "combi-43": (0.04, 0.52, 1.0), "combi-54": (0.98, 0.45, 0.09), "shorty-22": (0.13, 0.83, 0.74)}
NEO = np.array([0.060, 0.065, 0.075])
GRAY = np.array([0.55, 0.57, 0.60])


def sstep(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def mix(base, acc, w):
    return base[None, None, :] * (1 - w[..., None]) + np.asarray(acc)[None, None, :] * w[..., None]


def torso(name, stations, accent, material, zip_back=True, n=56, panels=True, collar_from=None, hem=None):
    """stations : liste (y, rx, rz)."""
    ys, rx, rz = np.array(stations).T
    t = np.linspace(0, 1, 60)
    yy = np.interp(t, np.linspace(0, 1, len(ys)), np.linspace(ys[0], ys[-1], len(ys))) if False else np.linspace(ys[0], ys[-1], 60)
    fx = PchipInterpolator(ys, rx)(yy)
    fz = PchipInterpolator(ys, rz)(yy)
    sec, th = ellipse_sec(fx, fz, n)
    cen = np.stack([np.zeros_like(yy), yy, np.zeros_like(yy)], 1)
    A = np.tile([1.0, 0, 0], (60, 1))
    B = np.tile([0.0, 0, 1], (60, 1))
    TH = th[None, :].repeat(60, 0)
    Y = yy[:, None].repeat(n, 1)
    w = np.zeros_like(TH)
    if panels:
        side = sstep(np.abs(np.cos(TH)), 0.80, 0.90)
        yband = sstep(Y, ys[0] + 0.10, ys[0] + 0.16) * (1 - sstep(Y, ys[-1] - 0.18, ys[-1] - 0.10))
        w = side * yband
    col = mix(NEO, accent, w)
    if zip_back:
        zb = 1 - sstep(np.abs(np.arctan2(np.sin(TH + np.pi / 2), np.cos(TH + np.pi / 2))), 0.03, 0.07)
        zb = zb * sstep(Y, ys[0] + 0.12, ys[0] + 0.16) * (1 - sstep(Y, ys[-1] - 0.04, ys[-1] - 0.01))
        col = col * (1 - zb[..., None]) + GRAY[None, None, :] * zb[..., None]
    if collar_from is not None:
        c = sstep(Y, collar_from, collar_from + 0.012)
        col = col * (1 - c[..., None]) + np.asarray(accent)[None, None, :] * 0.35 * c[..., None] + col * 0.0
    if hem is not None:  # bandeau bas (bord élastique)
        h = 1 - sstep(Y, ys[0] + hem, ys[0] + hem + 0.012)
        col = col * (1 - h[..., None]) + (np.asarray(accent)[None, None, :] * 0.5) * h[..., None]
    return loft(name, cen, A, B, sec, material, colors=col)


def limb(name, pts, radii, rz_ratio, accent, material, cut=1.0, cuff=0.07, n=36, outward=1.0, stripe=True, n_st=40):
    path = catmull(pts, n_st)
    k = max(2, int(len(path) * cut))
    path = path[:k]
    s = np.linspace(0, 1, len(path))
    r = np.interp(s * cut, np.linspace(0, 1, len(radii)), radii)
    T, A, B = frames(path, ref=(1, 0, 0))
    sec, th = ellipse_sec(r, r * rz_ratio, n)
    TH = th[None, :].repeat(len(path), 0)
    S_ = s[:, None].repeat(n, 1)
    w = np.zeros_like(TH)
    if stripe:
        side = sstep(outward * np.cos(TH), 0.78, 0.9)
        w = side * sstep(S_ * cut, 0.12, 0.2) * (1 - sstep(S_ * cut, 0.85, 0.9))
    col = mix(NEO, accent, w)
    if cuff:
        c = sstep(S_, 1 - cuff, 1 - cuff + 0.015)
        col = col * (1 - c[..., None]) + (np.asarray(accent)[None, None, :] * 0.5) * c[..., None]
    return loft(name, path, A, B, sec, material, colors=col)


def build_suit(key):
    acc = ACCENT[key]
    hood = key == "combi-54"
    short = key == "shorty-22"
    stations = [(0.80, .170, .108), (0.95, .176, .110), (1.10, .152, .096), (1.25, .170, .104), (1.37, .186, .102), (1.44, .180, .086), (1.485, .085, .068), (1.525, .066, .060)]
    if hood:
        stations[-2:] = [(1.485, .105, .090), (1.53, .090, .082)]
    parts = [torso("torse", stations, acc, "neo", collar_from=1.50)]
    for sgn in (-1, 1):
        arm = [(sgn * .150, 1.415, 0.0), (sgn * .215, 1.34, .005), (sgn * .30, 1.17, .03), (sgn * .385, .95, .10)]
        parts.append(limb(f"bras{sgn}", arm, [.066, .062, .050, .036], .95, acc, "neo", cut=0.30 if short else 1.0, cuff=0.08, outward=sgn, stripe=not short))
        leg = [(sgn * .075, 1.0, 0.0), (sgn * .088, .84, 0.0), (sgn * .105, .48, .015), (sgn * .115, .07, 0.0)]
        parts.append(limb(f"jambe{sgn}", leg, [.088, .100, .072, .052], .95, acc, "neo", cut=0.46 if short else 1.0, cuff=0.07, outward=sgn, stripe=not short))
    if hood:
        def opening(c):
            return (c[:, 2] > 0.03) & ((c[:, 0] / .066) ** 2 + ((c[:, 1] - 1.665) / .085) ** 2 < 1.0)
        h = ellipsoid("cagoule", (0, 1.655, -0.005), (.106, .134, .122), "neo", 40, 26, drop=opening)
        v = h.v
        d = np.sqrt((v[:, 0] / .076) ** 2 + ((v[:, 1] - 1.665) / .098) ** 2)
        ring = (v[:, 2] > 0.0) * (1 - sstep(d, 1.0, 1.22))
        col = NEO[None, :] * (1 - ring[:, None]) + np.asarray(acc)[None, :] * ring[:, None]
        h.colors = col.astype(np.float32)
        parts.append(h)
    ground(parts)
    return parts, {"neo": mat((1, 1, 1), 0.0, 0.92, double=True)}


def build_topuv():
    acc = (0.40, 0.66, 0.99)
    navy = np.array([0.06, 0.12, 0.26])
    global NEO
    old = NEO
    NEO = navy
    try:
        stations = [(0.92, .160, .102), (1.10, .152, .096), (1.25, .170, .104), (1.37, .186, .102), (1.44, .180, .086), (1.485, .085, .068), (1.515, .070, .062)]
        parts = [torso("torse", stations, acc, "lycra", panels=True, collar_from=1.495, hem=0.03)]
        for sgn in (-1, 1):
            arm = [(sgn * .150, 1.415, 0.0), (sgn * .215, 1.34, .005), (sgn * .30, 1.17, .03), (sgn * .385, .95, .10)]
            parts.append(limb(f"bras{sgn}", arm, [.064, .060, .050, .036], .95, acc, "lycra", cut=1.0, cuff=0.07, outward=sgn))
    finally:
        NEO = old
    ground(parts, y0=0.0)
    return parts, {"lycra": mat((1, 1, 1), 0.0, 0.62, double=True)}


def short_texture():
    W = H = 1024
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    top, bot = np.array([46, 196, 210]), np.array([16, 150, 190])
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=tuple(int(x) for x in top * (1 - t) + bot * t))
    rng = np.random.default_rng(7)
    ink = (10, 22, 32)
    def palm(cx, base, h):
        d.line([(cx, base), (cx + 6, base - h)], fill=ink, width=max(5, int(h / 28)))
        top_ = (cx + 6, base - h)
        for ang in (-170, -145, -118, -90, -62, -35, -10):
            a = np.radians(ang)
            ln = h * 0.55
            mid = (top_[0] + np.cos(a) * ln * .55, top_[1] + np.sin(a) * ln * .55 - ln * .15)
            end = (top_[0] + np.cos(a) * ln, top_[1] + np.sin(a) * ln * .45 + ln * .42)
            d.line([top_, mid, end], fill=ink, width=max(4, int(h / 40)), joint="curve")
    for cx in range(40, W, 150):
        palm(cx + int(rng.integers(-20, 20)), int(H * 0.88) - int(rng.integers(0, 40)), int(rng.integers(230, 330)))
    d.rectangle([0, int(H * .88), W, H], fill=(14, 20, 28))
    d.rectangle([0, int(H * .88), W, int(H * .895)], fill=(240, 240, 240))
    return img


def build_boardshort():
    parts = []
    tex = short_texture()
    # bassin (uni), puis deux jambes imprimées
    stations = [(0.80, .190, .120), (0.90, .188, .118), (1.00, .176, .112), (1.04, .174, .110)]
    ys, rx, rz = np.array(stations).T
    yy = np.linspace(ys[0], ys[-1], 24)
    sec, th = ellipse_sec(PchipInterpolator(ys, rx)(yy), PchipInterpolator(ys, rz)(yy), 56)
    cen = np.stack([np.zeros_like(yy), yy, np.zeros_like(yy)], 1)
    parts.append(loft("bassin", cen, np.tile([1.0, 0, 0], (24, 1)), np.tile([0.0, 0, 1], (24, 1)), sec, "aqua"))
    # ceinture élastique
    ys2 = np.linspace(0.995, 1.06, 8)
    sec2, _ = ellipse_sec(np.full(8, .180), np.full(8, .116), 56)
    parts.append(loft("ceinture", np.stack([np.zeros(8), ys2, np.zeros(8)], 1), np.tile([1.0, 0, 0], (8, 1)), np.tile([0.0, 0, 1], (8, 1)), sec2, "band", caps=False))
    for sgn in (-1, 1):
        path = np.array([[sgn * .095, 0.88, 0], [sgn * .105, 0.74, 0.0], [sgn * .115, 0.52, 0.0]])
        pth = catmull(path, 24)
        r = np.interp(np.linspace(0, 1, 24), [0, 1], [.112, .128])
        T, A, B = frames(pth, ref=(1, 0, 0))
        sec3, _ = ellipse_sec(r, r * 0.92, 40)
        parts.append(loft(f"jambe{sgn}", pth, A, B, sec3, "print"))
        # cordons
    for sgn in (-1, 1):
        cord = np.array([[sgn * .02, 1.00, .122], [sgn * .03, .93, .13], [sgn * .045, .86, .128]])
        parts.append(tube(f"cordon{sgn}", catmull(cord, 12), .004, "band", n=10))
    parts.append(tube("noeud", catmull(np.array([[-.03, 1.0, .122], [0, 1.01, .128], [.03, 1.0, .122]]), 10), .006, "band", n=10))
    ground(parts)
    mats = {"aqua": mat((0.022, 0.46, 0.60), 0.0, 0.7, double=True),
            "band": mat((0.08, 0.10, 0.13), 0.0, 0.75, double=True),
            "print": mat((1, 1, 1), 0.0, 0.7, texture=tex, double=True)}
    return parts, mats

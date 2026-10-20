import numpy as np
from PIL import Image, ImageDraw, ImageFont
from glb import mat, Part
from geo import loft, tube, catmull, frames, superellipsoid, box, ground, ellipse_sec, transform, rot_y, rot_x

FONT = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"


def build_leash():
    """Leash compétition 6 ft (1,83 m) enroulé en spirale posée au sol, avec cuvette de cheville et rail saver."""
    turns, pts = 3.0, 260
    phi = np.linspace(0, turns * 2 * np.pi, pts)
    r = 0.070 + 0.052 * phi / (turns * 2 * np.pi)
    path = np.stack([r * np.cos(phi), np.full(pts, 0.0045), r * np.sin(phi)], 1)
    length = np.linalg.norm(np.diff(path, axis=0), axis=1).sum()
    parts = [tube("cordon", path, 0.0036, "cord", n=14, ref=(0, 1, 0))]
    start, end = path[0], path[-1]
    # cuvette de cheville : sangle large, bouclée (extérieur de la spirale)
    c = end + np.array([0.0, 0.0, 0.0])
    dirn = (path[-1] - path[-2]); dirn /= np.linalg.norm(dirn)
    rad_out = np.array([np.cos(phi[-1]), 0, np.sin(phi[-1])])
    cen = c + rad_out * 0.045 + dirn * 0.01
    ang = np.linspace(0, 2 * np.pi, 60, endpoint=False)
    ring = np.stack([cen[0] + 0.045 * np.cos(ang), np.full(60, 0.032), cen[2] + 0.045 * np.sin(ang)], 1)
    ring = np.vstack([ring, ring[:1]])
    T, A, B = frames(ring, ref=(0, 1, 0))
    th = np.linspace(0, 2 * np.pi, 24, endpoint=False)
    sec = np.stack([0.031 * np.sin(th), 0.0035 * np.cos(th)], 1)[None].repeat(len(ring), 0)
    # section : axe 1 = radial (A), axe 2 = hauteur (B)
    cuff_loop = loft("cuvette", ring, np.tile([0, 1.0, 0], (len(ring), 1)), np.cross(T, np.tile([0, 1.0, 0], (len(ring), 1))), sec, "cuff", caps=False)
    parts.append(cuff_loop)
    pad = superellipsoid("coussin", (cen[0] + 0.045, 0.032, cen[2]), (0.012, 0.033, 0.04), "cuff_pad", 0.35, 0.35, 28, 16)
    parts.append(pad)
    # rail saver côté nez de planche : sangle + émerillon inox
    s0 = start
    parts.append(superellipsoid("emerillon", (s0[0], 0.0075, s0[2]), (0.010, 0.0065, 0.0065), "steel", 0.6, 0.6, 20, 12))
    loop_ang = np.linspace(0, 2 * np.pi, 40, endpoint=False)
    sl = np.stack([s0[0] - 0.02 + 0.016 * np.cos(loop_ang), np.full(40, 0.0045), s0[2] + 0.014 * np.sin(loop_ang)], 1)
    parts.append(tube("rail_saver", np.vstack([sl, sl[:1]]), 0.0035, "cuff", n=10, ref=(0, 1, 0)))
    parts.append(superellipsoid("velcro", (s0[0] - 0.045, 0.0045, s0[2]), (0.018, 0.0055, 0.011), "cuff_pad", 0.4, 0.4, 20, 12))
    ground(parts)
    mats = {"cord": mat((0.93, 0.95, 0.97), 0.0, 0.35),
            "cuff": mat((0.07, 0.08, 0.10), 0.0, 0.8),
            "cuff_pad": mat((0.03, 0.34, 1.0), 0.0, 0.8),
            "steel": mat((0.78, 0.80, 0.83), 1.0, 0.28)}
    return parts, mats, length


def wax_label():
    W, H = 1024, 640
    img = Image.new("RGB", (W, H), (232, 178, 40))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([34, 34, W - 34, H - 34], radius=46, outline=(120, 76, 8), width=8)
    f1, f2, f3 = (ImageFont.truetype(FONT, s) for s in (240, 64, 44))
    d.text((W // 2, 250), "AURA", font=f1, fill=(86, 52, 6), anchor="mm")
    d.text((W // 2, 420), "WAX BIO", font=f2, fill=(86, 52, 6), anchor="mm")
    d.text((W // 2, 505), "cire d'abeille et résine de pin", font=f3, fill=(110, 70, 10), anchor="mm")
    return img


def comb_texture():
    img = Image.new("RGB", (512, 256), (196, 150, 92))
    d = ImageDraw.Draw(img)
    for y in range(0, 256, 5):
        c = 196 + int(12 * np.sin(y * .7)) - 10
        d.line([(0, y), (512, y)], fill=(c, c - 46, c - 104))
    return img


def build_wax():
    parts = []
    # pain de wax 9,0 x 6,0 x 2,2 cm aux angles arrondis
    parts.append(superellipsoid("pain", (-0.058, 0.0115, 0.0), (0.045, 0.030, 0.0115), "wax", 0.28, 0.28, 48, 28))
    # étiquette posée sur la face supérieure
    lab = box("etiquette", (-0.058, 0.0233, 0.0), (0.074, 0.0004, 0.046), "label")
    # UV de l'étiquette (boîte à faces séparées) : on les écrase sur la face du dessus
    top = np.where(np.abs(lab.v[:, 1] - (0.0233 + 0.0002)) < 1e-6)[0]
    uv = np.zeros((len(lab.v), 2), np.float32)
    for i in range(len(lab.v)):
        uv[i] = [(lab.v[i, 0] + 0.058 + 0.037) / 0.074, (lab.v[i, 2] + 0.023) / 0.046]
    lab.uv = uv
    parts.append(lab)
    # peigne en bambou : plaque + dents
    parts.append(box("peigne", (0.058, 0.003, 0.0165), (0.100, 0.006, 0.0075), "bamboo"))
    for k in range(24):
        x = 0.058 - 0.0485 + k * (0.097 / 23)
        parts.append(box(f"dent{k}", (x, 0.003, -0.0025), (0.0017, 0.006, 0.0325), "bamboo"))
    for p in parts:
        if p.name.startswith(("peigne", "dent")):
            p.uv = np.stack([(p.v[:, 0] - 0.0) * 8, p.v[:, 2] * 8], 1).astype(np.float32)
    ground(parts)
    mats = {"wax": mat((0.93, 0.66, 0.12), 0.0, 0.55),
            "label": mat((1, 1, 1), 0.0, 0.6, texture=wax_label()),
            "bamboo": mat((1, 1, 1), 0.0, 0.7, texture=comb_texture())}
    return parts, mats

import numpy as np
from scipy.interpolate import PchipInterpolator
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from glb import mat
from geo import loft, ground, transform, rot_y, tube, box
from geo import frames

FONT = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
INCH = 0.0254

SPECS = {
    # longueur (m), largeur max, épaisseur max, rocker nez / queue, points de contour (t, demi-largeur relative), t du point large
    "board-long-9": dict(L=2.743, W=0.572, T=0.070, rn=0.130, rt=0.045,
        outline=[(0, .0), (.012, .26), (.05, .50), (.14, .74), (.3, .93), (.48, 1), (.64, .975), (.8, .86), (.91, .66), (.97, .38), (.993, .16), (1, 0)]),
    "board-mid-7": dict(L=2.134, W=0.540, T=0.064, rn=0.090, rt=0.040,
        outline=[(0, .0), (.012, .28), (.06, .55), (.16, .79), (.32, .96), (.5, 1), (.66, .95), (.82, .78), (.92, .55), (.975, .3), (.995, .12), (1, 0)]),
    "board-short-511": dict(L=1.803, W=0.484, T=0.060, rn=0.085, rt=0.040,
        outline=[(0, .0), (.01, .30), (.05, .58), (.14, .80), (.3, .965), (.46, 1), (.62, .95), (.78, .78), (.9, .5), (.97, .24), (.995, .09), (1, 0)]),
}
THICK = [(0, .10), (.08, .40), (.25, .85), (.45, 1), (.65, .88), (.85, .52), (.96, .24), (1, .10)]


def cosspace(n):
    s = np.linspace(0, 1, n)
    return 0.5 - 0.5 * np.cos(np.pi * s)


def board_funcs(sp):
    wf = PchipInterpolator(*zip(*sp["outline"]))
    tf = PchipInterpolator(*zip(*THICK))
    def width(t): return 0.5 * sp["W"] * np.clip(wf(t), 0, None)
    def thick(t): return sp["T"] * tf(t)
    def rocker(t):
        t = np.asarray(t, float)
        nose = sp["rn"] * np.clip((t - 0.45) / 0.55, 0, 1) ** 2.2
        tail = sp["rt"] * np.clip((0.45 - t) / 0.45, 0, 1) ** 2.0
        return nose + tail
    return width, thick, rocker


def sec_points(hw, th, n=64, rail=2.3):
    """Section d'une planche : dessus bombé, dessous presque plat, rails arrondis. Renvoie (n, 2) = (z, y)."""
    half = n // 2
    u = -np.cos(np.linspace(0, np.pi, half, endpoint=True))  # -1 -> 1, dense aux rails
    shape = np.clip(1 - np.abs(u) ** rail, 0, 1) ** (1 / rail)
    top = 0.58 * th * shape
    bot = -0.42 * th * shape ** 1.15
    z_top, z_bot = u * hw, u[::-1] * hw
    pts_top = np.stack([z_top, top], -1)
    pts_bot = np.stack([z_bot, bot[::-1]], -1)
    return np.vstack([pts_top, pts_bot[1:-1] if False else pts_bot])


def board_texture(kind):
    W, H = 1024, 2048
    img = Image.new("RGB", (W, H), (240, 240, 240))
    d = ImageDraw.Draw(img)
    # u (horizontal) : 0..0.5 dessus (centre .25), 0.5..1 dessous (centre .75) ; v (vertical) : 0 queue -> 1 nez
    def vy(t): return int(t * H)
    def ux(u): return int(u * W)
    top_c, bot_c = ux(.25), ux(.75)
    if kind == "board-long-9":
        base, wood, wood2, tint = (239, 230, 208), (176, 120, 70), (140, 92, 52), (214, 196, 160)
        d.rectangle([0, 0, W, H], fill=base)
        for cx in (top_c, bot_c):
            for off, w in ((-95, 7), (0, 11), (95, 7)):  # 3 lattes de bois
                d.rectangle([cx + off - w, 0, cx + off + w, H], fill=wood if off == 0 else wood2)
        for cx in (top_c, bot_c):  # bandes de rails
            pass
        for x0 in (0, ux(.5)):
            d.rectangle([x0, 0, x0 + 44, H], fill=tint)
            d.rectangle([x0 + ux(.5) - 44, 0, x0 + ux(.5), H], fill=tint)
        d.rectangle([0, vy(.955), W, H], fill=wood2)  # bout de nez en bois
        logo_col, logo_pos = (84, 58, 36), .27
    elif kind == "board-mid-7":
        base, blue = (245, 243, 236), (10, 132, 255)
        d.rectangle([0, 0, W, H], fill=base)
        for x0 in (0, ux(.5)):
            d.rectangle([x0, 0, x0 + 70, H], fill=blue)
            d.rectangle([x0 + ux(.5) - 70, 0, x0 + ux(.5), H], fill=blue)
        for cx in (top_c, bot_c):
            d.rectangle([cx - 8, 0, cx + 8, H], fill=(160, 112, 70))
        d.rectangle([0, vy(.94), W, H], fill=(225, 232, 240))
        logo_col, logo_pos = (10, 132, 255), .22
    else:  # shortboard carbone
        base, carbon, orange = (250, 250, 248), (24, 26, 30), (249, 115, 22)
        d.rectangle([0, 0, W, H], fill=base)
        for x0 in (0, ux(.5)):
            d.rectangle([x0, 0, x0 + 56, H], fill=carbon)
            d.rectangle([x0 + ux(.5) - 56, 0, x0 + ux(.5), H], fill=carbon)
        for cx in (top_c, bot_c):
            d.rectangle([cx - 5, 0, cx + 5, H], fill=(190, 190, 186))
        # patch carbone sur le nez (dessous) + pad de queue noir (dessus)
        d.rectangle([ux(.5) + 70, vy(.62), W - 70, vy(.99)], fill=carbon)
        d.rounded_rectangle([top_c - 230, vy(.035), top_c + 230, vy(.27)], radius=40, fill=(30, 32, 38))
        d.rectangle([top_c - 230, vy(.035), top_c + 230, vy(.045)], fill=orange)
        d.polygon([(bot_c - 150, vy(.0)), (bot_c + 150, vy(.0)), (bot_c + 120, vy(.24)), (bot_c - 120, vy(.24))], fill=orange)
        logo_col, logo_pos = (250, 250, 248), .62
    # logo AURA le long de la planche (dessous, pour tous ; dessus pour les modèles clairs)
    font = ImageFont.truetype(FONT, 190)
    txt = Image.new("RGBA", (700, 240), (0, 0, 0, 0))
    ImageDraw.Draw(txt).text((350, 120), "AURA", font=font, fill=logo_col + (255,), anchor="mm")
    txt = txt.rotate(90, expand=True).transpose(Image.FLIP_LEFT_RIGHT)
    cy = vy(logo_pos)
    if kind != "board-short-511":
        img.paste(txt, (top_c - txt.width // 2, cy - txt.height // 2), txt)
    img.paste(txt, (bot_c - txt.width // 2, vy(.5) - txt.height // 2), txt)
    # légère variation pour éviter l'aspect plastique plat
    img = img.filter(ImageFilter.GaussianBlur(0.8))
    return img


def build_board(key):
    sp = SPECS[key]
    width, thick, rocker = board_funcs(sp)
    S, N = 120, 64
    t = cosspace(S)
    L = sp["L"]
    centers, A, B, secs = [], [], [], []
    for ti in t:
        hw = max(float(width(ti)), 0.0015)
        th = max(float(thick(ti)), 0.004)
        pts = sec_points(hw, th, N)
        centers.append([(ti - 0.5) * L, float(rocker(ti)) + 0.001, 0.0])
        A.append([0, 0, 1])  # axe 1 de section = largeur (z)
        B.append([0, 1, 0])  # axe 2 = épaisseur (y)
        secs.append(pts)
    deck = loft(key, centers, A, B, np.array(secs), "board", uv_scale=(1, 1))
    parts = [deck]
    tex = board_texture(key)
    # --- ailerons ---
    def bottom_y(ti, zoff=0.0):
        hw = max(float(width(ti)), 1e-3)
        u = min(abs(zoff) / hw, 0.999)
        shape = (1 - u ** 2.3) ** (1 / 2.3)
        return float(rocker(ti)) + 0.001 - 0.42 * float(thick(ti)) * shape ** 1.15

    def fin(name, ti, zoff, H, base_chord, th, sweep, toe=0.0, mname="fin"):
        n = 18
        s = np.linspace(0, 1, n)
        by = bottom_y(ti, zoff) + 0.012
        chord = base_chord * (1 - 0.88 * s ** 1.4) + 0.006
        thk = th * (1 - 0.55 * s) + 0.0016
        cx = (ti - 0.5) * L - sweep * H * s ** 1.6
        cen = np.stack([cx, by - H * s, np.full(n, zoff)], 1)
        th_ = np.linspace(0, 2 * np.pi, 24, endpoint=False)
        sec = np.stack([0.5 * chord[:, None] * np.cos(th_)[None] - 0.0, 0.5 * thk[:, None] * np.sin(th_)[None]], -1)
        # profil pointu au bord de fuite : on tire le point arrière
        sec[..., 0] = np.where(sec[..., 0] < 0, sec[..., 0] * 1.25, sec[..., 0])
        a = np.tile([1, 0, 0], (n, 1)).astype(float)
        b = np.tile([0, 0, 1], (n, 1)).astype(float)
        p = loft(name, cen, a, b, sec, mname, caps=True)
        if toe:
            c0 = np.array([(ti - 0.5) * L, 0, zoff])
            p.v = ((p.v - c0) @ rot_y(toe).T + c0).astype(np.float32)
        return p

    if key == "board-long-9":
        parts.append(fin("aileron-central", 0.075, 0.0, 0.21, 0.19, 0.012, 0.55))
    elif key == "board-mid-7":
        parts.append(fin("aileron-central", 0.075, 0.0, 0.17, 0.15, 0.011, 0.5))
        for sgn in (-1, 1):
            parts.append(fin(f"aileron-lat-{sgn}", 0.19, sgn * 0.17, 0.095, 0.095, 0.009, 0.45, toe=-sgn * 0.05))
    else:
        parts.append(fin("aileron-central", 0.085, 0.0, 0.115, 0.115, 0.009, 0.5))
        for sgn in (-1, 1):
            parts.append(fin(f"aileron-lat-{sgn}", 0.165, sgn * 0.155, 0.125, 0.12, 0.009, 0.5, toe=-sgn * 0.06))
    ground(parts)
    materials = {
        "board": mat((1, 1, 1), 0.0, 0.22, texture=tex, double=False),
        "fin": mat((0.10, 0.11, 0.13), 0.1, 0.45),
    }
    return parts, materials

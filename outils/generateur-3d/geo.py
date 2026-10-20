"""Briques géométriques : loft (sections le long d'un chemin), splines, ellipsoïdes, transformations."""
import numpy as np
from glb import Part


def norm(v):
    n = np.linalg.norm(v, axis=-1, keepdims=True)
    n[n < 1e-12] = 1
    return v / n


def catmull(points, n=40):
    """Spline de Catmull-Rom passant par les points ; renvoie n échantillons."""
    P = np.asarray(points, float)
    P = np.vstack([2 * P[0] - P[1], P, 2 * P[-1] - P[-2]])
    seg = len(P) - 3
    out = []
    for s in np.linspace(0, seg, n):
        i = min(int(s), seg - 1)
        t = s - i
        p0, p1, p2, p3 = P[i], P[i + 1], P[i + 2], P[i + 3]
        out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t ** 2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    return np.array(out)


def frames(path, ref=(0, 0, 1)):
    """Repères (tangente, A, B) le long d'un chemin, A stable par rapport à ref."""
    path = np.asarray(path, float)
    T = norm(np.gradient(path, axis=0))
    ref = np.asarray(ref, float)
    A = np.empty_like(T)
    for i, t in enumerate(T):
        r = ref if abs(np.dot(ref, t)) < 0.95 else np.array([1.0, 0, 0])
        a = r - np.dot(r, t) * t
        A[i] = a / np.linalg.norm(a)
    B = np.cross(T, A)
    return T, A, B


def loft(name, centers, A, B, sec, material, n_ring=None, caps=False, uv_scale=(1, 1), colors=None, flip=False, smooth=True):
    """sec : (S, N, 2) coordonnées de section par station ; centers/A/B : (S, 3)."""
    centers, A, B, sec = map(lambda x: np.asarray(x, float), (centers, A, B, sec))
    S, N, _ = sec.shape
    ring = centers[:, None, :] + sec[..., 0, None] * A[:, None, :] + sec[..., 1, None] * B[:, None, :]
    ring = np.concatenate([ring, ring[:, :1]], axis=1)  # couture dupliquée pour les UV
    v = ring.reshape(-1, 3)
    jj, ii = np.meshgrid(np.arange(N + 1), np.arange(S))
    uv = np.stack([jj / N * uv_scale[0], ii / max(S - 1, 1) * uv_scale[1]], -1).reshape(-1, 2)
    faces = []
    for i in range(S - 1):
        for j in range(N):
            a, b = i * (N + 1) + j, i * (N + 1) + j + 1
            c, d = (i + 1) * (N + 1) + j, (i + 1) * (N + 1) + j + 1
            faces += [[a, b, d], [a, d, c]]
    faces = np.array(faces)
    col = None
    if colors is not None:
        col = np.concatenate([colors, colors[:, :1]], axis=1).reshape(-1, colors.shape[-1])
    parts_v, parts_f, parts_uv, parts_c = [v], [faces], [uv], [col]
    if caps:
        for end, i in (("start", 0), ("end", S - 1)):
            c = ring[i, :N].mean(axis=0)
            base = 0
            parts_v.append(np.vstack([c, ring[i, :N]]))
            parts_uv.append(np.full((N + 1, 2), 0.5))
            if col is not None:
                parts_c.append(np.vstack([col[i * (N + 1)], col[i * (N + 1):i * (N + 1) + N]]))
            fan = [[base, base + 1 + k, base + 1 + (k + 1) % N] if end == "end" else [base, base + 1 + (k + 1) % N, base + 1 + k] for k in range(N)]
            parts_f.append(np.array(fan))
    # offsets des faces
    off, F = 0, []
    for vv, ff in zip(parts_v, parts_f):
        F.append(ff + off)
        off += len(vv)
    V = np.vstack(parts_v)
    UV = np.vstack(parts_uv)
    C = np.vstack(parts_c) if col is not None else None
    F = np.vstack(F)
    # orientation : les normales doivent pointer vers l'extérieur des sections
    fn = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    mid = V[F].mean(axis=1)
    st = np.repeat(np.arange(S), N + 1)
    sc = centers[st[np.minimum(F[:, 0], S * (N + 1) - 1)]] if True else None
    out = ((fn * (mid - sc)).sum(axis=1)).mean()
    if (out < 0) != flip:
        F = F[:, ::-1]
    return Part(name, V, F, material, uv=UV, colors=C, smooth=smooth)


def ellipse_sec(rx, rz, n=40, shift=(0.0, 0.0)):
    """Sections elliptiques : rx, rz tableaux (S,) -> (S, n, 2)."""
    th = np.linspace(0, 2 * np.pi, n, endpoint=False)
    rx, rz = np.asarray(rx, float), np.asarray(rz, float)
    return np.stack([rx[:, None] * np.cos(th)[None] + shift[0], rz[:, None] * np.sin(th)[None] + shift[1]], -1), th


def tube(name, path, radius, material, n=20, caps=True, ref=(0, 0, 1), colors=None, rz=None):
    path = np.asarray(path, float)
    T, A, B = frames(path, ref)
    r = np.broadcast_to(np.asarray(radius, float), (len(path),))
    rzz = r if rz is None else np.broadcast_to(np.asarray(rz, float), (len(path),))
    sec, th = ellipse_sec(r, rzz, n)
    return loft(name, path, A, B, sec, material, caps=caps, colors=colors)


def superellipsoid(name, center, size, material, e1=0.25, e2=0.25, nu=48, nv=24):
    """Boîte à angles arrondis (exposants proches de 0 = boîte)."""
    a, b, c = size
    v = np.linspace(-np.pi / 2, np.pi / 2, nv)
    u = np.linspace(-np.pi, np.pi, nu + 1)
    U, V = np.meshgrid(u, v)
    f = lambda w, m: np.sign(w) * np.abs(w) ** m
    x = a * f(np.cos(V), e1) * f(np.cos(U), e2)
    z = b * f(np.cos(V), e1) * f(np.sin(U), e2)
    y = c * f(np.sin(V), e1)
    P = np.stack([x, y, z], -1) + np.asarray(center)
    verts = P.reshape(-1, 3)
    uv = np.stack([(U / (2 * np.pi) + .5), (V / np.pi + .5)], -1).reshape(-1, 2)
    faces = []
    for i in range(nv - 1):
        for j in range(nu):
            a_, b_ = i * (nu + 1) + j, i * (nu + 1) + j + 1
            c_, d_ = (i + 1) * (nu + 1) + j, (i + 1) * (nu + 1) + j + 1
            faces += [[a_, d_, b_], [a_, c_, d_]]
    p = Part(name, verts, np.array(faces), material, uv=uv)
    fn = np.cross(p.v[p.f[:, 1]] - p.v[p.f[:, 0]], p.v[p.f[:, 2]] - p.v[p.f[:, 0]])
    if (fn * (p.v[p.f].mean(1) - np.asarray(center))).sum(1).mean() < 0:
        p.f = p.f[:, ::-1].copy()
    return p


def ellipsoid(name, center, radii, material, nu=40, nv=24, drop=None):
    """drop(centroides) -> masque booléen des faces à retirer (ex. ouverture de cagoule)."""
    p = superellipsoid(name, center, radii, material, 1.0, 1.0, nu, nv)
    if drop is not None:
        m = drop(p.v[p.f].mean(axis=1))
        p.f = p.f[~m]
    return p


def box(name, center, size, material, rough_edge=0.0):
    x, y, z = np.asarray(size, float) / 2
    c = np.asarray(center, float)
    V = np.array([[sx * x, sy * y, sz * z] for sx in (-1, 1) for sy in (-1, 1) for sz in (-1, 1)]) + c
    quads = [[0, 1, 3, 2], [4, 6, 7, 5], [0, 4, 5, 1], [2, 3, 7, 6], [0, 2, 6, 4], [1, 5, 7, 3]]
    verts, faces = [], []
    for q in quads:
        base = len(verts)
        verts += [V[i] for i in q]
        faces += [[base, base + 1, base + 2], [base, base + 2, base + 3]]
    p = Part(name, verts, np.array(faces), material, smooth=False)
    fn = np.cross(p.v[p.f[:, 1]] - p.v[p.f[:, 0]], p.v[p.f[:, 2]] - p.v[p.f[:, 0]])
    if (fn * (p.v[p.f].mean(1) - c)).sum(1).mean() < 0:
        p.f = p.f[:, ::-1].copy()
    return p


def transform(part, R=None, t=(0, 0, 0), s=1.0):
    v = part.v.astype(float) * s
    if R is not None:
        v = v @ np.asarray(R).T
    part.v = (v + np.asarray(t)).astype(np.float32)
    return part


def rot_y(a):
    c, s = np.cos(a), np.sin(a)
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])


def rot_z(a):
    c, s = np.cos(a), np.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])


def rot_x(a):
    c, s = np.cos(a), np.sin(a)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])


def ground(parts, y0=0.0):
    ymin = min(p.v[:, 1].min() for p in parts)
    for p in parts:
        p.v[:, 1] += y0 - ymin
    return parts

"""Petit écrivain glTF 2.0 binaire (.glb) : maillages, matériaux PBR, textures PNG, couleurs de sommets."""
import io, json, struct
import numpy as np
from PIL import Image


class Part:
    def __init__(self, name, v, f, material, uv=None, colors=None, smooth=True):
        self.name = name
        self.v = np.asarray(v, dtype=np.float32)
        self.f = np.asarray(f, dtype=np.uint32)
        self.material = material
        self.uv = None if uv is None else np.asarray(uv, dtype=np.float32)
        self.colors = None if colors is None else np.asarray(colors, dtype=np.float32)
        self.smooth = smooth

    def normals(self):
        v, f = self.v.astype(np.float64), self.f
        fn = np.cross(v[f[:, 1]] - v[f[:, 0]], v[f[:, 2]] - v[f[:, 0]])  # aire pondérée
        if self.smooth:  # soude les sommets confondus (coutures UV) pour un ombrage continu
            key = np.round(v * 1e5).astype(np.int64)
            _, inv = np.unique(key, axis=0, return_inverse=True)
            inv = inv.reshape(-1)
            acc = np.zeros((inv.max() + 1, 3))
            for k in range(3):
                np.add.at(acc, inv[f[:, k]], fn)
            n = acc[inv]
        else:
            n = np.zeros_like(v)
            for k in range(3):
                np.add.at(n, f[:, k], fn)
        ln = np.linalg.norm(n, axis=1, keepdims=True)
        bad = (ln < 1e-12).reshape(-1)
        ln[bad] = 1
        n = n / ln
        n[bad] = (0.0, 1.0, 0.0)  # sommets inutilisés (ex. ouverture de cagoule)
        return n.astype(np.float32)


def mat(color, metal=0.0, rough=0.6, texture=None, double=False, emissive=None, alpha=None):
    return dict(color=color, metal=metal, rough=rough, texture=texture, double=double, emissive=emissive, alpha=alpha)


def write_glb(path, parts, materials):
    """parts : liste de Part ; materials : dict nom -> mat(...)."""
    bin_chunks, views, accessors = [], [], []

    def add_view(data, target=None):
        pad = (-sum(len(c) for c in bin_chunks)) % 4
        if pad:
            bin_chunks.append(b"\0" * pad)
        offset = sum(len(c) for c in bin_chunks)
        bin_chunks.append(data)
        views.append({"buffer": 0, "byteOffset": offset, "byteLength": len(data), **({"target": target} if target else {})})
        return len(views) - 1

    def add_acc(arr, ctype, atype, target, minmax=False):
        vi = add_view(arr.tobytes(), target)
        a = {"bufferView": vi, "componentType": ctype, "count": int(len(arr)), "type": atype}
        if minmax:
            a["min"] = [float(x) for x in arr.min(axis=0)]
            a["max"] = [float(x) for x in arr.max(axis=0)]
        accessors.append(a)
        return len(accessors) - 1

    mat_names = list(materials)
    gl_mats, images, textures = [], [], []
    for name in mat_names:
        m = materials[name]
        pbr = {"baseColorFactor": list(m["color"]) + [1.0] if len(m["color"]) == 3 else list(m["color"]),
               "metallicFactor": m["metal"], "roughnessFactor": m["rough"]}
        if m["texture"] is not None:
            buf = io.BytesIO()
            m["texture"].convert("RGB").save(buf, "JPEG", quality=88)
            vi = add_view(buf.getvalue())
            images.append({"bufferView": vi, "mimeType": "image/jpeg"})
            textures.append({"source": len(images) - 1, "sampler": 0})
            pbr["baseColorTexture"] = {"index": len(textures) - 1}
            pbr["baseColorFactor"] = [1, 1, 1, 1]
        g = {"name": name, "pbrMetallicRoughness": pbr, "doubleSided": bool(m["double"])}
        if m["emissive"]:
            g["emissiveFactor"] = list(m["emissive"])
        gl_mats.append(g)

    meshes, nodes = [], []
    for p in parts:
        attrs = {"POSITION": add_acc(p.v, 5126, "VEC3", 34962, True),
                 "NORMAL": add_acc(p.normals(), 5126, "VEC3", 34962)}
        if p.uv is not None:
            attrs["TEXCOORD_0"] = add_acc(p.uv, 5126, "VEC2", 34962)
        if p.colors is not None:
            attrs["COLOR_0"] = add_acc(p.colors, 5126, "VEC4" if p.colors.shape[1] == 4 else "VEC3", 34962)
        idx = add_acc(p.f.reshape(-1), 5125, "SCALAR", 34963)
        meshes.append({"name": p.name, "primitives": [{"attributes": attrs, "indices": idx, "material": mat_names.index(p.material)}]})
        nodes.append({"name": p.name, "mesh": len(meshes) - 1})

    doc = {"asset": {"version": "2.0", "generator": "AURA SURF generateur 3D"},
           "scene": 0, "scenes": [{"nodes": list(range(len(nodes)))}], "nodes": nodes, "meshes": meshes,
           "materials": gl_mats, "accessors": accessors, "bufferViews": views,
           "buffers": [{"byteLength": sum(len(c) for c in bin_chunks) + ((-sum(len(c) for c in bin_chunks)) % 4)}]}
    if images:
        doc["images"], doc["textures"] = images, textures
        doc["samplers"] = [{"magFilter": 9729, "minFilter": 9987, "wrapS": 10497, "wrapT": 10497}]
    js = json.dumps(doc, separators=(",", ":")).encode()
    js += b" " * ((-len(js)) % 4)
    binary = b"".join(bin_chunks)
    binary += b"\0" * ((-len(binary)) % 4)
    total = 12 + 8 + len(js) + 8 + len(binary)
    with open(path, "wb") as fh:
        fh.write(struct.pack("<4sII", b"glTF", 2, total))
        fh.write(struct.pack("<I4s", len(js), b"JSON") + js)
        fh.write(struct.pack("<I4s", len(binary), b"BIN\0") + binary)
    return total

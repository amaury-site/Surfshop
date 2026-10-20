"""Génère les 11 modèles 3D .glb du catalogue AURA SURF (échelle réelle, en mètres, posés sur le sol).

Usage :  python3 make_all.py [dossier_de_sortie]      (par défaut : ../../assets/models)
Dépendances : numpy, scipy, pillow.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import numpy as np
from glb import write_glb
import boards, garments, accessories

out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..", "..", "assets", "models")
os.makedirs(out, exist_ok=True)

jobs = {}
for k in boards.SPECS:
    jobs[k] = lambda k=k: boards.build_board(k)
for k in ("combi-32", "combi-43", "combi-54", "shorty-22"):
    jobs[k] = lambda k=k: garments.build_suit(k)
jobs["top-uv"] = garments.build_topuv
jobs["boardshort"] = garments.build_boardshort
jobs["leash"] = lambda: accessories.build_leash()[:2]
jobs["wax"] = accessories.build_wax

for name, fn in jobs.items():
    parts, mats = fn()
    size = write_glb(os.path.join(out, name + ".glb"), parts, mats)
    v = np.vstack([p.v for p in parts])
    dims = v.max(0) - v.min(0)
    print(f"{name:16s} {size / 1024:6.0f} ko   L x H x l = {dims[0]:.2f} x {dims[1]:.2f} x {dims[2]:.2f} m   y_min = {v[:, 1].min():.3f}")

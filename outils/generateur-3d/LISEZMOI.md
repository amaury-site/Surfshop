# Générateur des modèles 3D

Ces scripts créent les 11 fichiers `.glb` du dossier `assets/models/` (échelle réelle, en mètres, posés sur le sol).

```bash
pip install numpy scipy pillow
python3 outils/generateur-3d/make_all.py        # écrit dans assets/models/
```

- `boards.py` : les 3 planches (contour, épaisseur, rocker, ailerons, décor).
- `garments.py` : combinaisons, top UV, boardshort.
- `accessories.py` : leash et wax.
- `glb.py` / `geo.py` : écriture glTF et géométrie.

Pour utiliser un vrai scan ou un modèle fait sous Blender, remplacez simplement le `.glb` correspondant dans `assets/models/` (même nom, moins de 5 Mo, à l'échelle réelle en mètres).

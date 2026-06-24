#!/usr/bin/env python3
"""Regenera sm/md/lg+flat contain — BR SPORT 60012.102 (5881 y 28918)."""
from __future__ import annotations

import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[2] / "control_central" / "tools"
sys.path.insert(0, str(TOOLS))

from protocolo_imagenes_cerrar_gap import DEFAULT_ORIGEN, generar_y_subir, load_source_image  # noqa: E402
from subir_miniaturas_supabase import read_config  # noqa: E402

NOMBRES = [
    "60012-102-5881-15745.jpg",
    "60012-102-5881-89692.jpg",
    "60012-102-5881-98514.jpg",
    "60012-102-28918-106784.jpg",
    "60012-102-28918-106758.jpg",
    "60012-102-28918-15745.jpg",
]
WORK = Path(__file__).resolve().parent.parent / "docs" / "evidencia" / "regen_60012_102"


def main() -> None:
    base, key = read_config()
    WORK.mkdir(parents=True, exist_ok=True)

    for nombre in NOMBRES:
        src = load_source_image(nombre, base)
        if src is None:
            print(f"SKIP {nombre} — sin origen en {DEFAULT_ORIGEN} ni flat Storage", flush=True)
            continue
        with src:
            print(f"{nombre}: origen {src.size[0]}x{src.size[1]}", flush=True)
            row = generar_y_subir(nombre, src, base, key, WORK)
            if not (row.get("sm") and row.get("lg")):
                raise SystemExit(f"FAIL upload {nombre}: {row}")
            print(f"  OK sm/md/lg/flat", flush=True)

    print("DONE — Ctrl+Shift+R /cadena/vista BR SPORT ref 60012.102", flush=True)


if __name__ == "__main__":
    main()

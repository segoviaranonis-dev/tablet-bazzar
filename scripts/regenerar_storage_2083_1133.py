#!/usr/bin/env python3
"""Regenera sm/md/lg contain + sube Storage — MOLEKINHA 2083.1133."""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

TOOLS = Path(__file__).resolve().parents[2] / "control_central" / "tools"
sys.path.insert(0, str(TOOLS))

from subir_miniaturas_supabase import BUCKET, headers, read_config, subir_archivo, subir_flat  # noqa: E402

NOMBRE = "2083-1133-13488-16072.jpg"
ORIGEN = Path(r"C:\Users\hecto\Documents\Prg_locales\proyectos\imagenes") / NOMBRE
WORK = Path(__file__).resolve().parent.parent / "docs" / "evidencia" / "regen_2083_1133"
TIERS = {"sm": 200, "md": 400, "lg": 800}


def resize_contain(src: Image.Image, size: int) -> Image.Image:
    img = src.convert("RGB")
    img.thumbnail((size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    ox = (size - img.width) // 2
    oy = (size - img.height) // 2
    canvas.paste(img, (ox, oy))
    return canvas


def measure_margins(im: Image.Image) -> tuple[int | None, int | None]:
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    left = next((x for x in range(w) if any(px[x, y] != (255, 255, 255) for y in range(h))), None)
    right = next((x for x in range(w - 1, -1, -1) if any(px[x, y] != (255, 255, 255) for y in range(h))), None)
    return left, (w - 1 - right if right is not None else None)


def main() -> None:
    if not ORIGEN.exists():
        raise SystemExit(f"Origen no encontrado: {ORIGEN}")

    src = Image.open(ORIGEN)
    print(f"Origen: {ORIGEN} -> {src.size[0]}x{src.size[1]}", flush=True)

    WORK.mkdir(parents=True, exist_ok=True)
    paths: dict[str, Path] = {}
    for tier, px in TIERS.items():
        out = WORK / tier / NOMBRE
        out.parent.mkdir(parents=True, exist_ok=True)
        contained = resize_contain(src, px)
        contained.save(out, format="JPEG", quality=88, optimize=True)
        paths[tier] = out
        ml, mr = measure_margins(contained)
        print(f"  {tier}: {out} ({out.stat().st_size} bytes) ml={ml} mr={mr}", flush=True)

    flat = WORK / "flat" / NOMBRE
    flat.parent.mkdir(parents=True, exist_ok=True)
    src.convert("RGB").save(flat, format="JPEG", quality=92, optimize=True)
    paths["flat"] = flat
    print(f"  flat: {flat} ({flat.stat().st_size} bytes)", flush=True)

    base, key = read_config()
    for tier in ("sm", "md", "lg"):
        res = subir_archivo(paths[tier], base, key, BUCKET, tier)
        print(f"  {tier} upload: {'OK' if res.success else 'FAIL'} {res.error or ''}", flush=True)
        if not res.success:
            raise SystemExit(1)

    flat_ok = subir_flat(paths["flat"], base, key).success
    print(f"  flat upload: {'OK' if flat_ok else 'FAIL'}", flush=True)
    if not flat_ok:
        raise SystemExit(1)

    print("DONE — Ctrl+Shift+R en /cadena/vista?marca=MOLEKINHA&cliente_id=2900", flush=True)


if __name__ == "__main__":
    main()

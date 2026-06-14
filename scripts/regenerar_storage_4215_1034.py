#!/usr/bin/env python3
"""Regenera sm/md/lg contain + sube Storage — caso 4215.1034 únicamente."""
from __future__ import annotations

import io
import sys
from pathlib import Path

from PIL import Image

TOOLS = Path(__file__).resolve().parents[2] / "control_central" / "tools"
sys.path.insert(0, str(TOOLS))

from subir_miniaturas_supabase import BUCKET, headers, read_config, subir_archivo  # noqa: E402

NOMBRE = "4215-1034-28458-98904.jpg"
ORIGEN = Path(r"C:\Users\hecto\Documents\Prg_locales\proyectos\imagenes") / NOMBRE
WORK = Path(__file__).resolve().parent.parent / "docs" / "evidencia" / "regen_4215"
TIERS = {"sm": 200, "md": 400, "lg": 800}


def resize_contain(src: Image.Image, size: int) -> Image.Image:
    img = src.convert("RGB")
    img.thumbnail((size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    ox = (size - img.width) // 2
    oy = (size - img.height) // 2
    canvas.paste(img, (ox, oy))
    return canvas


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
        resize_contain(src, px).save(out, format="JPEG", quality=88, optimize=True)
        paths[tier] = out
        print(f"  {tier}: {out} ({out.stat().st_size} bytes)", flush=True)

    # flat = lg quality on root path
    flat = WORK / "flat" / NOMBRE
    flat.parent.mkdir(parents=True, exist_ok=True)
    src.convert("RGB").save(flat, format="JPEG", quality=92, optimize=True)
    paths["flat"] = flat

    base, key = read_config()
    for tier, path in paths.items():
        size = tier if tier != "flat" else "sm"  # upload path uses tier folder
        if tier == "flat":
            # subir a raíz productos/
            import mimetypes
            from urllib.parse import quote
            import requests

            url = f"{base}/storage/v1/object/{BUCKET}/{quote(NOMBRE, safe='')}"
            data = path.read_bytes()
            r = requests.post(
                url,
                headers=headers(key, {"Content-Type": mimetypes.guess_type(NOMBRE)[0] or "image/jpeg", "x-upsert": "true"}),
                data=data,
                timeout=120,
            )
            print(f"  flat upload: HTTP {r.status_code}", flush=True)
            if r.status_code not in (200, 201):
                print(r.text[:300], flush=True)
        else:
            res = subir_archivo(path, base, key, BUCKET, tier)
            print(f"  {tier} upload: {'OK' if res.success else 'FAIL'} {res.error or ''}", flush=True)

    print("DONE — recarga /cadena/vista con Ctrl+Shift+R", flush=True)


if __name__ == "__main__":
    main()

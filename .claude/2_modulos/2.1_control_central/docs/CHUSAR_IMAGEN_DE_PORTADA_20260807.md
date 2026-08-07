# CHUSAR — Imagen de portada (marca · protocolo holding)

**Código:** `2.01.04.024`  
**Fecha:** 2026-08-07  
**Keyword Director:** **imagen de portada**  
**Padre:** [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](./LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) (`2.01.04.021`)  
**Uso Bazzar:** `2.5.1.24`

---

## 0 · Situación real (metodología clara)

| Pregunta | Respuesta |
|----------|-----------|
| **¿Qué cambió?** | Existe un tipo de imagen **portada de marca** (banner) con el **mismo pipeline** que producto: flat + sm/md/lg → Supabase → URL pública → helper en **todas** las apps. |
| **¿Por qué?** | No meter PNG de 15–30 MB solo en `bazzar-web/`. Una sola verdad en Storage; Bazzar / RIMEC Web / Report consumen igual. |
| **¿Qué hace Andrés / Cursor?** | Keyword **imagen de portada** → script + helpers; no copiar archivos a `public/` de una sola app. |
| **¿Qué queda igual?** | Fotos de **producto/SKU** siguen §2–§4 de la Ley (cuadrado contain + blanco). Portada **no** usa canvas cuadrado. |
| **¿Git / DB / WhatsApp?** | Código + docs sí. DB no. Zip: Héctor. |
| **¿Sin programar?** | Pasá a Cursor: «**imagen de portada** — carpeta con PNG de marcas en `bazzar-web/`» + **Documenta** si querés memoria. |

---

## 1 · Keyword

| Frase exacta | Acción |
|--------------|--------|
| **imagen de portada** | Ejecutar pipeline §2 · actualizar helpers siameses · UI que consuma URL Storage · Documenta si el Director lo pide |

**No confundir con:** **Importar imágenes** (SKU producto L-R-M-C / L_color).

---

## 2 · Pipeline (igual espíritu que producto)

**Script:** `control_central/tools/subir_portadas_marca_batch.py`

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
python tools\subir_portadas_marca_batch.py --carpeta "C:\Users\hecto\Nexus_Core\bazzar-web"
```

| Paso | Igual que producto | Diferencia portada |
|------|--------------------|--------------------|
| 1 Generar tiers | flat + sm + md + lg | Anchos 2400 / 1920 / 1200 / 640 **sin** canvas cuadrado blanco |
| 2 Subir bucket `productos` | `x-upsert` + JPEG 85% | Prefijo **`portada/`** |
| 3 Verificar HEAD | 4 tiers PASS | Misma regla: 0 FAIL |
| 4 Evidencia JSON | `ot/en_curso/` | `EVIDENCIA-PORTADAS-MARCA-*.json` |

### Storage

```
productos/portada/{stem}.jpg          ← flat
productos/portada/sm/{stem}.jpg
productos/portada/md/{stem}.jpg
productos/portada/lg/{stem}.jpg
```

### Stem canónico (2026-08-07)

| Archivo origen | Stem | Marca UI |
|----------------|------|----------|
| vizzano.png | vizzano | VIZZANO |
| moleca.png | moleca | MOLECA |
| molekinha.png | molekinha | MOLEKINHA |
| molekinho.png | molekinho | MOLEKINHO |
| modare.png | modare | MODARE |
| activitta.png | actvitta | ACTVITTA |
| beira-rio.png | beira-rio | BEIRA RIO |
| br-sport.png | br-sport | BR SPORT |

**Lote 2026-08-07:** **8/8 PASS** · evidencia `ot/en_curso/EVIDENCIA-PORTADAS-MARCA-20260807-114651.json`

---

## 3 · Consumo en apps (siamese)

| App | Helper |
|-----|--------|
| Bazzar Web | `bazzar-web/lib/imagen-portada.ts` + `components/ImagenPortada.tsx` |
| RIMEC Web | `rimec-web/lib/imagen-portada.ts` |
| Report | `report/src/lib/imagen-portada.ts` |

**Prohibido:** servir solo desde `bazzar-web/public` o PNG sueltos en la raíz del repo como fuente de prod.

**UI:** marco `overflow: hidden` + `object-fit: cover|contain` · `data-portada-frame="imagen-de-portada"`.

---

## 4 · Relación con Ley Universal

- Misma **inserción** (generar · subir · verificar · URL pública).  
- Misma **regla multi-app**.  
- **Excepción tipográfica:** portada = banner panorámico (no thumbnail de zapato). Crop cuadrado blanco **destruiría** la imagen de marca → **prohibido** aplicar §3 canvas 200×200 a portadas.

---

**Documenta 2026-08-07 — keyword imagen de portada · 8/8 Storage · helpers siameses.**

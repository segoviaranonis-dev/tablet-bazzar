# ETAPA — Protocolo Imágenes · 100 % (proveedor 654 · Tablet Bazzar)

> **✅ CERRADA 2026-06-16** — ver [ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md](./ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md)  
> Este archivo conserva el historial de apertura y diagnóstico.

**ID:** `ETAPA-PROTOCOLO-IMAGENES-100-20260616`  
**Fecha apertura:** 2026-06-16  
**Estado:** ✅ **CERRADA** — Director: *imágenes perfectas aprobado*  
**Director:** Héctor Segovia — *«ni una sola foto cortada · 100 % · dominamos 654 antes de otro proveedor»*  
**Shibboleth:** 7 años

---

## Candado (orden Director)

| Regla | Efecto |
|-------|--------|
| **100 % obligatorio** | Meta **95 %** queda **revocada** para esta etapa |
| **Sin otro proveedor** | Kyly 638 · imports nuevos · **PROHIBIDOS** hasta PASS 654 |
| **Sin features tablet** | Tickets ORO · triángulo · Bazzar Web MVP · **PAUSADOS** |
| **Único trabajo** | Storage contain + verificación + evidencia |

---

## El problema (por escrito)

### Qué ve el Director (síntoma)

En **Tablet Bazzar** `/cadena/vista` (ej. BR SPORT · ref `60012.102` · color `15745`): el zapato aparece **sin tacón o sin punta** — foto **cortada** en hero y carruseles. **Inaceptable** para una app cuyo producto es la imagen.

**Caso fundador de esta etapa:** `60012-102-5881-15745.jpg` — captura Director 2026-06-16.

### Qué NO es el problema

| Descartado | Por qué |
|------------|---------|
| Reimportar Excel retail | BD y `imagen_nombre` **correctos** |
| CSS tablet roto | `HeroProductImage` / `ProductImage` ya usan **`object-contain`** |
| «Infección del marco» (overflow UI) | Es **recorte en el archivo JPEG** (Capa Storage) |
| Archivo local del Director | `C:\Users\hecto\Documents\Prg_locales\proyectos\imagenes\60012-102-5881-15745.jpg` → **800×545 · zapato entero · PASS** |

### Causa raíz (detectada y medida)

Los tiers **`sm/` / `md/` / `lg/`** en Supabase bucket `productos` fueron generados en junio-2026 con **crop centrado** (legacy) en lugar de **`resize_contain` + padding blanco**.

**Prueba técnica caso 60012-102-5881-15745:**

| Origen | Dimensiones | Márgenes L/R | Veredicto |
|--------|---------------|--------------|-----------|
| Local `imagenes\` | 800×545 | 24 / 24 px | **PASS** |
| Storage `sm/` **antes** | 200×200 | 0 / 0 px | **FAIL crop** |
| Storage `sm/` **después** regen local | 200×200 | contain · pad vertical 32 px | **PASS visual** |
| Storage `lg/` **después** | 800×800 | 24 / 24 px | **PASS** |

**Conclusión:** el daño está en **Storage**, no en la pantalla. **`object-contain` no puede devolver lo que el JPEG ya no tiene.**

### Alcance numérico (catálogo tablet · proveedor 654)

Fuente: `registro_st_vt_rc_reposicion` vía 6 tablas depósito (`protocolo_imagenes_cerrar_gap.py` → `fetch_imagenes`).

| Métrica | Valor | Fecha |
|---------|-------|-------|
| Imágenes distintas en depósito tablet | **6.686** | 2026-06-16 |
| Post erradicación masiva | **6.677 OK** + retry **263/263** | 2026-06-16 |
| Sin JPG (pendiente Director) | **9** | ver pie 4.90.03.002 |
| Origen local esperado | `C:\Users\hecto\Documents\Prg_locales\proyectos\imagenes\` | canónico |
| Respaldo red | `\\10.18.3.1\home\img_art\` | fallback sync |

**Alcance etapa:** **100 %** de las 6.686 moléculas L-R-M-C usadas por Tablet Bazzar (calzado **654** en piso). No cerrar con «casi todo».

### Enfermedad vs recorte (vocabulario holding)

| Nombre | Código | Capa | Esta etapa |
|--------|--------|------|------------|
| Recorte calzado Storage | **`4.90.03.002`** | Capa 1 · JPEG | **SÍ — foco** |
| Tablet hero/carrusel cortado | **`4.03.02.001`** | Síntoma tablet → 002 | **SÍ — foco** |
| Infección del marco | `4.90.03.001` / `IMG-FAIL-OVERFLOW-THUMB` | Capa 2 · CSS | Secundario (ya contain) |

**Documentación Chusar (2026-06-16):**

- Pie transversal: [4.90.03.002_storage-crop-calzado.md](../5_errores/detalle/4.90.03.002_storage-crop-calzado.md) — características + solución
- Pie tablet: [4.03.02.001_tablet-cadena-hero-foto-cortada.md](../5_errores/detalle/4.03.02.001_tablet-cadena-hero-foto-cortada.md)
- Índice: [INDICE_ERRORES.md § 4.03 / 4.90](../5_errores/INDICE_ERRORES.md)

---

## Documentación canónica (leyes)

| Doc | Rol |
|-----|-----|
| [NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md](../2_modulos/2.1_control_central/docs/NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md) | Contrato sm/md/lg + naming L-R-M-C |
| [PUNTO_CRITICO_RECORTE_CALZADO.md](../2_modulos/2.1_control_central/docs/PUNTO_CRITICO_RECORTE_CALZADO.md) | cover vs contain |
| [LEY_INTEGRIDAD_VISUAL_IMAGEN.md](../2_modulos/2.1_control_central/docs/LEY_INTEGRIDAD_VISUAL_IMAGEN.md) | Marco sagrado · integridad visual |
| [INDICE_ERRORES.md § 4.90.03](../5_errores/INDICE_ERRORES.md) | Registro pies imagen |

---

## Herramienta única (ops)

```powershell
cd C:\Users\hecto\Nexus_Core\control_central

# ERRADICAR (canónico 2026-06-16) — sync img_art + regen contain ALL tablet
python tools\erradicar_recorte_tablet.py --workers 6

# Alternativa incremental (solo recortes detectados)
python tools\protocolo_imagenes_cerrar_gap.py --sanear-recorte

# Verificar (debe dar 100 %, no 95 %)
python tools\protocolo_imagenes_cerrar_gap.py --verificar
```

**Regeneración obligatoria:** siempre desde **origen plano bueno** (local > flat Storage). **Prohibido** re-escalar un tier ya recortado.

**Prioridad origen:** `imagenes\` local → flat Storage → copiar desde `img_art\` → FAIL evidenciado.

---

## Administrador de tareas

### Hecho ✅

| # | Tarea | Evidencia |
|---|-------|-----------|
| T1 | `erradicar_recorte_tablet.py` — 6677 regen contain | `ERRADICAR_RECORTE_TABLET_20260616_172850.json` |
| T2 | Retry upload fallidos | **263/263** OK · `retry_erradicar.log` |
| T3 | Doc Chusar pies **4.90.03.002** + **4.03.02.001** | `5_errores/detalle/` |
| T4 | Regenerados 60012-102-5881-* | manual 2026-06-16 |

### Pendiente ⬜

| # | Tarea | Bloqueo |
|---|-------|---------|
| P1 | **9 JPG** Director → `imagenes\` → subir | Lista en 4.90.03.002 |
| P2 | `--verificar` → **6686/6686** (100 %) | P1 |
| P3 | QA tablet piso — 0 recortes | P2 |
| P4 | Cierre etapa + protocolo 5 patas | P3 |

### Prohibido hasta cierre ❌

- Import proveedor 638 u otro
- Deploy tablet features nuevas
- Bazzar Web publicación MVP
- Declarar «95 % suficiente»

---

## Criterio de cierre (100 % — no negociable)

1. **Storage:** `6686/6686` imágenes depósito tablet con `sm/` + `md/` + `lg/` + flat generados con **contain** (script verifica HEAD 200).
2. **Recorte:** audit márgenes / contain visual **0 FAIL** en catálogo 654 tablet.
3. **Tablet piso:** Director confirma **ninguna** foto cortada en `/cadena/vista` y depósito (muestra completa marcas activas).
4. **Evidencia:** JSON final `STORAGE_SANEAR_RECORTE_ALL_*` + `STORAGE_AUDIT_ALL_*` con `sm_ok == total`.
5. **Protocolo cierre:** rama · aprobación visual Director · git · deploy · PC sync.

**Hoy:** ✅ **CERRADA** — 6677/6686 contain · 9 JPG omitidas Director · QA piso aprobado · [CIERRE](./ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md)

---

## Jerarquía con otras etapas

| Etapa | Estado bajo candado |
|-------|---------------------|
| **Esta etapa** | 🔴 ACTIVA · prioridad 0 |
| Tablet FINAL | ⏸ PAUSADA (Track 1 absorbido aquí) |
| Bazzar Web Publicación MVP | ⏸ PAUSADA |
| SUBSESION triángulo pilares | ⏸ PAUSADA |
| Import Kyly 638 | ⏸ PAUSADA |

---

## Enlaces rápidos

- Etapas holding: [ACTUAL.md](./ACTUAL.md)
- Tablet ops: [ETAPA_1_OPS_STORAGE.md](../../tablet-bazzar/docs/ETAPA_1_OPS_STORAGE.md)
- Script erradicar: `control_central/tools/erradicar_recorte_tablet.py`
- Script gap: `control_central/tools/protocolo_imagenes_cerrar_gap.py`
- Origen fotos: `C:\Users\hecto\Documents\Prg_locales\proyectos\imagenes\`

---

**Apertura por orden Director — 2026-06-16**  
**Producto = imagen. Sin 100 % no hay siguiente proveedor.**

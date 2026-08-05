# Reglas por proveedor — índice (importación pilares)

**Código:** `3.02.00.010`  
**Activado:** Documentación Chusar · 2026-06-16  
**Contexto:** Primera importación **multi-proveedor** con reglas propias por origen (no solo Beira Rio calzado).

---

## Mapa rápido

| Excel / negocio | `tipo_v2.id_tipo` | Proveedor negocio | Doc reglas | Motor Retail |
|-----------------|-------------------|-------------------|------------|--------------|
| `1` · `654` · calzado | **1** CALZADOS | Beira Rio **654** | [REGLAS_PROVEEDOR_654.md](./REGLAS_PROVEEDOR_654.md) | ✅ producción |
| `2` · `638` · confecciones | **2** CONFECCIONES | Kyly **638** | [REGLAS_PROVEEDOR_638.md](./REGLAS_PROVEEDOR_638.md) | ✅ import OK (8.370 filas) |

**No confundir:** columna Excel `TIPO_V2=654` ≠ `tipo_v2_id=2`. El **654** en retail histórico = **calzado**; confecciones = **2** o **638** en Excel.

---

## Leyes transversales (todos los proveedores)

| Ley | Dónde |
|-----|--------|
| **Grada abierta 638** (`am_talle` · Carlos · 638≠654) | [PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md](./PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md) · **3.02.00.638** |
| **Precios por proveedor** (654 L+R+M · 638 L+Talle · faja) | [DETERMINACION_PRECIOS_PROVEEDOR.md](./DETERMINACION_PRECIOS_PROVEEDOR.md) |
| **FK numérico siempre** (Director 2026-06-16) | [LEY_FK_NUMERICO_RETAIL.md](./LEY_FK_NUMERICO_RETAIL.md) |
| Motor compartido pilares · no inverso · alta ciega retail | `.cursor/rules/politicas-importacion-pilares.mdc` |
| FK canónicas `{pilar}_id` · nomenclatura P0 | `control_central/docs/RIMEC_NOMENCLATURA_PILARES.md` |
| Confecciones semántica K / `{linea}K` | [CONFECCIONES_TIPO_V2_2.md](./CONFECCIONES_TIPO_V2_2.md) |
| Código import Retail | `control_central/modules/balance_tiendas_retail/fk_resolve.py` |

Cada proveedor **extiende** estas leyes; no las reemplaza.

---

## Plantilla por proveedor (Documenta)

Cada `REGLAS_PROVEEDOR_*.md` debe tener:

1. Identidad (`proveedor_importacion`, marcas, `tipo_v2_id`)
2. Pilares — qué existe en origen vs sintético Nexus
3. Excel — columnas, parseo, valores prohibidos
4. Alta perezosa vs herencia jerárquica
5. Grada / talle (curva calzado vs talle ropa)
6. Imágenes (tiers, path, pilares en filename)
7. Enriquecimiento posterior (Administrador `/pilares`, Motor)
8. Excepciones y anti-patrones

---

**Estado Chusar (2026-06-16 — import producción)**

| Ítem | Estado |
|------|--------|
| Ley triplete + FK | ✅ |
| Import mixto Excel | ✅ 50.979 filas · 654+638 aislados |
| Etapa | ✅ [ETAPA_IMPORT_MULTI_PROVEEDOR_PAUSADA.md](../../4_etapas/ETAPA_IMPORT_MULTI_PROVEEDOR_PAUSADA.md) |
| Ficha **654** | 🟡 listado Director |
| Ficha **638** | 🟡 import OK · faja/motor precios pendiente |
| BD | ✅ migraciones 116 + 117 |
| Motor precios 638 | ❌ pendiente |

---

**Shibboleth:** 7 años

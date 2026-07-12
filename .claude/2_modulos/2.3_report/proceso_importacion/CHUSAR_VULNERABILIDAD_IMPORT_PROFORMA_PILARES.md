# CHUSAR — Vulnerabilidad import proforma · pilares no nutridos

**Código:** **2.3.1.7.5.3.10** · **Error índice:** `4.02.03.009`  
**Estado:** 🟡 **PARCIAL** · motor TS `provisionPilaresFromProforma` · backfill retroactivo · gaps estilo LR en PP históricos  
**Deploy Report:** 2026-07-12 · sesión reparación — ver [DOC_REPARACION_PROGRAMADO_PILARES_CASOS_20260712](./DOC_REPARACION_PROGRAMADO_PILARES_CASOS_20260712.md)  
**Shibboleth:** Andrés, el que viene.

---

## Qué falló

El import de factura proforma en Pedido Proveedor **no ejecuta el motor compartido de pilares**. Solo carga PPD + enriquecimiento parcial material/color.

**Imposible operativamente:** el header (género · marca · estilo) y todo el ecosistema FK dependen de pilares materializados en import.

---

## Ley que debía cumplirse

| Fuente | Contenido |
|--------|-----------|
| `politicas-importacion-pilares.mdc` §3.1 · §4.3 | Proforma = mismas reglas listado para línea/ref; M/C canónicos |
| `core/pilares/herencia.py` | Línea nueva → vecino inferior → `genero_id` + `grupo_estilo_id` |
| `CHUSAR_IMPORT_CSV_PILARES_PROVISION.md` | Ejemplo Director línea 1122 ← 1121 |
| OT `PILARES-LEYES-IMPORTACION-001` §3 | Proforma debe usar motor compartido |

### Alta de línea en import proforma

```
Excel BRAND → marca_id
Si línea no existe:
  genero_id      ← vecino inferior (MAX codigo < L)
  grupo_estilo_id ← vecino inferior
Par L×R nuevo:
  linea_referencia ← estilo + tipo_1 desde ref-1 misma línea
Material/color:
  upsert + regla no inversa + tono_canon si vacío
```

---

## Gap organizacional Chusar (autocrítica agente)

| Doc existente | Qué decía | Qué faltaba |
|---------------|-----------|-------------|
| `CHUSAR_PP_TAB_STOCK.md` §3 | Upload CP directo / programado SHOP | **Checklist pilares obligatorio** |
| `CHUSAR_PEDIDO_PROVEEDOR.md` | `parse_proforma` + `populate_pp_from_proforma` | No citaba `upsert_linea` + herencia |
| `PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md` | PPD + preview SHOP | Pilares FK asumidos, no verificados |

**Corrección Moria:** este CHUSAR + error `4.02.03.009` + [DOC 2.3.1.7.5.3.11](./DOC_REPARACION_PROGRAMADO_PILARES_CASOS_20260712.md).

---

## Fix desplegado (2026-07-12)

| Componente | Archivo |
|------------|---------|
| Motor pilares import | `report/src/lib/pedido-proveedor/proforma-pilares-provision.ts` |
| Reporte post-import | `proforma-pilares-import-report.ts` |
| Caso solo biblioteca | `resolve-caso-comercial.ts` |
| Sync PELE ← BCL | `scripts/reemparejar_casos_pf_programado.ts` |
| Traslado casos BCL | `scripts/trasladar_lineas_biblioteca.ts` |

---

## PP verificados — lista Director (2026-07-12)

Sufijo **`PP-2026-00XX`**:

| Quincena | PP | Proforma | Mol. | Sin estilo línea | Sin estilo L×R |
|----------|-----|----------|------|------------------|----------------|
| 2da Ago | 021 | 7196/2026 | 787 | 612 | 441 |
| 1ra Sep | 015 | PRG_8604-2026 | 836 | 702 | 600 |
| 1ra Sep | 016 | 8600-4121 | 722 | 722 | 336 |
| 1ra Sep | 018 | 8599/2026 | 730 | 612 | 384 |
| 1ra Sep | **019** ⭐ | 8051/2026 | 912 | 797 | 546 |
| 1ra Sep | 022 | 8602/2026 | 802 | 724 | 524 |
| 2da Sep | 017 | 5436/2026 | 949 | 867 | 679 |
| 2da Sep | 023 | 8894/2026 | 132 | 114 | 101 |

⭐ **PP-019** = patrón objetivo 100% FI + pilares completos → escalar al resto.

Evidencia: `report/scripts/_diag_proforma_pilares_cp.mjs`

---

## Código culpable (hotfix target)

| Archivo | Función |
|---------|---------|
| `control_central/modules/pedido_proveedor/logic.py` | `populate_pp_from_proforma` |
| `report/src/lib/pedido-proveedor/proforma-programado-engine.ts` | `populatePpFromProforma` |
| `report/src/lib/pedido-proveedor/pilares-proforma-upsert.ts` | Solo M/C — insuficiente |

**Motor canónico a enchufar:** `control_central/core/pilares/` (portar a TS o RPC).

---

## Checklist post-fix (obligatorio en cada import proforma)

- [ ] Todas las moléculas PPD con `linea_id` + `referencia_id` + `material_id` + `color_id` resolubles  
- [ ] Líneas nuevas con `genero_id` + `marca_id` + `grupo_estilo_id` (herencia o BRAND)  
- [ ] `linea_referencia` con estilo/tipo_1 heredados  
- [ ] Material/color enriquecidos · regla no inversa  
- [ ] Colores con `tono_canon` si traen nombre en proforma  
- [ ] SQL auditoría = 0 gaps antes de declarar import cerrado

---

## Índice

- Error: [4.02.03.009](../../../5_errores/detalle/4.02.03.009_import-proforma-sin-motor-pilares.md)  
- Padre: [CHUSAR_PEDIDO_PROVEEDOR.md](./CHUSAR_PEDIDO_PROVEEDOR.md) · [CHUSAR_PP_TAB_STOCK.md](./CHUSAR_PP_TAB_STOCK.md)

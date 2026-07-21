# CHUSAR — Cirugía IC · Excel == BD (Pedido proveedor)

**Código:** **2.3.1.7.5.3.5.5**  
**Decisión Director:** 2026-07-21  
**Estado:** 🟢 **CANÓNICO** — receteo cabeceras IC sin bandeja ni re-aprobación  
**Shibboleth:** Andrés, el que viene.

**Padre:** [CHUSAR_ADMIN_IC_CHUSA_SIMPLE_20260721](./CHUSAR_ADMIN_IC_CHUSA_SIMPLE_20260721.md) (**2.3.1.7.5.3.5.4**) · [PROTOCOLO_CHUSA_ADMIN_IC_LOTE](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md)

**Caso piloto:** PP-2026-0017 · `pedido_proveedor.id = 26` · Excel `IC-5436.xlsx` · **98/98 match** · deploy Report `c74df5e` + Vercel `Cu8yH6UAd`

---

## Qué decirle al agente (orden tipo)

Usá **una frase** con estos **4 datos** (faltante → el agente pregunta):

```
Cirugía IC Excel == BD en PP-[número o id]
Excel: [ruta completa .xlsx]
Sin digitación · mantener DIGITADO
```

**Ejemplo real (PP-17):**

> Cirugía IC Excel == BD en PP-17 (PP-2026-0017)  
> Excel: `C:\Users\hecto\Downloads\ANDRES-1807\0839-7932-38\IC-5436.xlsx`  
> Sin digitación · mantener DIGITADO

**Variantes válidas:** «receteo IC desde Excel», «Excel == IC PP-17», «sincronizar IC cabecera con Excel».

**No decir** si querés solo documentación: no mezclar con «borrá todas las IC y recargá» (Opción B destructiva — evitar salvo orden explícita).

---

## Qué hace la cirugía (Opción A — precisión)

| Paso | Acción |
|------|--------|
| 1 | Lee Excel ERP (columnas canónicas abajo) |
| 2 | Compara fila a fila por **`Nº de I-C`** → `IC-2026-####` (4 dígitos) |
| 3 | **UPDATE** cabeceras que difieren (cliente · marca · pares · montos · D1–D4 · LP · plazo) |
| 4 | **UPDATE** `intencion_compra_pedido.nro_pedido_fabrica` desde `N° PEDIDO` |
| 5 | **Desasignar + DELETE** IC en BD que **no** están en Excel |
| 6 | **INSERT + puente** IC que están en Excel pero **no** en BD → estado **`DIGITADO`** directo |
| 7 | Recalcular `pares_comprometidos` del PP |
| 8 | **No toca** PPD / stock / proforma / FI (salvo FI ya existentes — ver riesgos) |

**Sin pasar por:** bandeja · autorización · digitación UI.

---

## Qué NO hace

| Excluido | Motivo |
|----------|--------|
| `COD.VEND` Excel → `id_vendedor` | Legacy vs BD · constraint `chk_vendedor_rol` |
| Regenerar proforma / alinear Chusa IC↔PF | Capa aparte · usuario alinea en Admin IC (v4) |
| Borrar las 98 IC y recrear todas | Innecesario · más riesgo trazabilidad |
| Cambiar stock `_shop` en PPD | Cirugía solo cabecera IC |

---

## Excel requerido — columnas

Export ERP tipo **IC-5436** (misma plantilla lote 0839/5436):

| Columna Excel | Campo BD |
|---------------|----------|
| `Nº de I-C` | `numero_registro` (normalizar `IC-2026-418` → `IC-2026-0418`) |
| `COD.CLIENTE` | `id_cliente` |
| `COD.MARCA` | `id_marca` |
| `CANT  ` | `cantidad_total_pares` |
| `IMPORTE` / `IMP.NETO` | `monto_bruto` / `monto_neto` |
| `D1`–`D4` | `descuento_1`–`4` |
| `LIST.PREC` | `listado_precio_id` (LPN/LPC02/LPC03/LPC04) |
| `N° PEDIDO` | `intencion_compra_pedido.nro_pedido_fabrica` |
| `PLAZO` | `id_plazo` (mapa legacy → `plazo_v2`) |
| `EMBARQUE` | `quincena_arribo_id` (solo INSERT IC nueva) |

---

## Scripts Report

| Script | Uso |
|--------|-----|
| `scripts/cirugia_ic5436_pp26.mjs` | Piloto PP-26 · parametrizar `PP_ID`, `PRECIO_EVENTO_ID`, ruta Excel |
| `scripts/_compare_ic5436_excel_vs_pp26.mjs` | Verificación post-cirugía · debe dar **match_ok = filas Excel · diffs 0** |

**Flujo agente:**

```bash
cd report
node scripts/cirugia_ic5436_pp26.mjs --dry-run
node scripts/cirugia_ic5436_pp26.mjs --apply
node scripts/_compare_ic5436_excel_vs_pp26.mjs
```

Para **otro PP:** copiar script · cambiar `PP_ID`, `PRECIO_EVENTO_ID` (puente IC o evento listado), ruta Excel · renombrar compare.

---

## Precondiciones BD

| Check | Regla |
|-------|--------|
| PP `estado` | `ABIERTO` (editable) |
| FI existentes | **Ideal 0** antes de cirugía · si hay FI, evaluar borrado/regeneración aparte |
| `precio_evento_id` | Fijar el del puente (ej. 45 PP-17) en UPDATE/INSERT |
| Pares totales | Dry-run debe cerrar: `pares_comprometidos` post = suma Excel |

---

## Resultado PP-17 (evidencia 2026-07-21)

| Métrica | Antes | Después |
|---------|-------|---------|
| IC vinculadas | 99 | **98** |
| Match Excel | 94/98 | **98/98** |
| Pares | 9068 | **9068** |
| `nro_pedido_fabrica = "1"` | 87 IC | **0** (restaurados desde Excel) |
| IC sobrantes BD | 0494 · 0495 | eliminadas |
| IC faltante | 0418 | creada DIGITADO |

**Admin IC post-cirugía:** IC **98** · PF **78** (contadores v4) — diferencia IC≠PF es **stock/caso**, no error de cirugía.

---

## UI Admin IC v4 + deploy (misma sesión)

| Entrega | Detalle |
|---------|---------|
| Contadores | IC y PF **totales** independientes (no «40 emparejadas») |
| Orden grilla | Cliente → cod.marca → cantidad |
| Deploy git | `c74df5e` |
| Deploy Vercel prod | `vercel deploy --prod` · `Cu8yH6UAd` · https://rimec-report.vercel.app |

Doc UI: [CHUSAR_ADMIN_IC_CHUSA_SIMPLE_20260721](./CHUSAR_ADMIN_IC_CHUSA_SIMPLE_20260721.md)

---

## Riesgos

| Nivel | Qué |
|-------|-----|
| 🟡 MEDIO | Escritura transaccional BD prod · siempre `--dry-run` primero |
| 🟢 Bajo | Stock PPD intacto |
| 🟡 | IC nuevas: vendedor heredado de IC mismo cliente en PP (no Excel) |
| 🔴 | Borrar 99 IC + recarga total — **no** usar salvo orden explícita |

---

## Checklist operador (varios PP)

1. Export Excel ERP con **`Nº de I-C`** en cada fila  
2. Orden al agente (frase § arriba) + **número PP** + **ruta Excel**  
3. Agente: dry-run → Director OK → `--apply` → compare 0 diffs  
4. Refrescar Admin IC · alinear manual IC↔PF si contadores distintos  
5. Generar FI lote cuando N1+N2 Chusa OK  

---

**Documenta 2026-07-21 — Cirugía Excel == IC · receteo PP PROGRAMADO · Director.**

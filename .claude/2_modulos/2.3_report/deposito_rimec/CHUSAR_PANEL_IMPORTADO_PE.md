# CHUSAR — Panel importado PE · Report + RIMEC Web

**Padre:** [CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md](./CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md) · **DOS MADRES:** [CHUSAR_DOS_MADRES_GESTION_COMPRA.md](../gestion_compra/CHUSAR_DOS_MADRES_GESTION_COMPRA.md)  
**Batch canónico:** `csv's/stock's/sdrm0831.csv`  
**Ratificado:** Director · 2026-07-05  
**Shibboleth:** Chayanne el mejor

---

## 1 · Alcance puente (violación documentada)

| Capa | Objeto | Rol |
|------|--------|-----|
| **Staging** | `stock_pronta_entrega_rimec` | Import CSV · auditoría batch |
| **Vidriera** | `v_stock_rimec` | Catálogo RIMEC Web · venta |
| **Destino** | `pedido_proveedor_detalle` | Post-recursos · `quincena_desc = 'Pronta entrega'` |

**Alerta arquitectura (obligatoria en UI Report):** banner fijo *Hiedra Venenosa · violación temporal · una tabla dos usos* hasta migración a PPD.

---

## 2 · Tres depósitos operativos

| Código | Columna CSV | Regla import |
|--------|-------------|--------------|
| **D1** | `S00_D1` | Insert solo si cantidad **> 0** |
| **DEP2** | `S00_DEP2` | Idem |
| **D3** | `S00_D3` | Idem |

**1 fila CSV → hasta 3 filas BD** (una por depósito con stock).  
**Omitir** depósitos con cantidad 0 — no crear fila vacía.

**Columna discriminadora obligatoria:** `deposito_codigo` — **debe viajar al CSV de factura** como argumento de origen físico.

---

## 3 · Ramo · `tipo_v2_id`

| Prefijo código | `tipo_v2_id` | UI |
|----------------|:------------:|-----|
| **654** | **1** | Calzado |
| **638** | **2** | Confecciones |

Panel Report y RIMEC Web: **toggle ágil** Calzado ↔ Confecciones (misma lógica hub Bazzar).

KPIs panel (paridad Bazzar import):

```
👟 CALZADO      · sum(cantidad) WHERE tipo_v2_id = 1
👕 CONFECCIONES · sum(cantidad) WHERE tipo_v2_id = 2
🛒 0 vendido · de N importadas
📅 Import {fecha} · {batch_label}
```

---

## 4 · Rutas Report

| Ruta | Rol |
|------|-----|
| `/deposito-rimec` | Hub 2 tarjetas |
| `/deposito-rimec/importado` | **Panel control** PE · grilla + KPIs + filtro depósito + tipo_v2 |
| `/api/deposito-rimec/importado/productos` | Grilla operativa |
| `/api/deposito-rimec/stock-importado` | Resumen + `por_deposito[]` |

Query params: `?deposito=D1|DEP2|D3` · `?batch=sdrm0831` · `?tipo_v2=1|2` *(planificado)*.

---

## 5 · RIMEC Web

- Fuente lectura: **`v_stock_rimec`** (filas PE · MIG-134).
- **Todas** las mercaderías con `cajas_disponibles > 0` visibles en catálogo.
- Discriminador tarjeta: `quincena_desc` contiene **Pronta entrega** + shell verde *(puente)* · destino: solo argumento quincena en PPD.
- Filtros: **Origen** (Tránsito / PE) + **`tipo_v2`** *(planificado)*.
- **`deposito_nombre`** / `deposito_codigo` en fila vista → argumento CSV factura.

---

## 6 · Columnas clave agente

| Columna | Tabla/vista | Uso |
|---------|-------------|-----|
| `deposito_codigo` | staging | D1 · DEP2 · D3 · **CSV factura** |
| `tipo_v2_id` | staging | 1 calzado · 2 conf |
| `batch_label` | staging | `sdrm0831` |
| `cantidad` | staging | Stock importado |
| `precio_unitario_gs` | staging | LPN Gs |
| `origen_tipo` | `v_stock_rimec` | Puente: `PRONTA_ENTREGA` |
| `quincena_desc` | vista / PP futuro | `'Pronta entrega · {deposito}'` |

---

## 7 · Checklist implementación

| # | Punto | Doc | Datos | UI Report | RIMEC Web |
|---|-------|:---:|:-----:|:---------:|:---------:|
| 1 | Batch sdrm0831 cargado | ✅ | ✅ | — | — |
| 2 | 3 depósitos · omitir qty 0 | ✅ | ✅ | ⏳ filtro depósito | — |
| 3 | `v_stock_rimec` catálogo | ✅ | ✅ | banner | ✅ |
| 4 | Alerta violación arquitectura | ✅ | — | 🟡 banner básico | — |
| 5 | KPI calzado / confecciones | ✅ | ✅ API | ❌ cards Bazzar | ❌ |
| 6 | Toggle `tipo_v2` 1/2 | ✅ | ✅ col | ❌ | ❌ |
| 7 | `deposito_codigo` → CSV FI | ✅ | ✅ | ⏳ | ⏳ carrito |
| 8 | Migración → PPD único | ✅ | ❌ | — | — |

---

## 8 · Import

```powershell
cd control_central
python scripts/import_rimec_pronta_entrega_csv.py "..\csv's\stock's\sdrm0831.csv"
```

---

**Integrado:** especificación panel Director 2026-07-05.

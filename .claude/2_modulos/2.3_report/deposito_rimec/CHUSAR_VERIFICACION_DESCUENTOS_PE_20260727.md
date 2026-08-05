# CHUSAR — Verificación y revisión asignación descuentos PE

**Código:** **2.3.1.10.1.4.3**  
**Par:** **2.3.1.10.1.4** (Asignación dictador) · **2.2.1.26** (Web)  
**Fecha:** 2026-07-27  
**Keyword:** Documentación Chusar  
**App:** Report `/stock-pronta-entrega` · pestaña **Resumen asignación**  
**Batch referencia:** `pe-import-1784921538902-sdrm1021`  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Problema

El módulo de asignación dictaba % por filtro, pero **no había herramienta clara** para verificar que todo quedó bien. Mostrar mezcla de % históricos (`25% (1) · 10% (18)`) confundía. Casos especiales (**Botas 30%** vs cerrado normal **25%**) no se distinguían en el resumen.

## 2 · Solución — Verificación + panel Revisar

Inspiración UX: **Biblioteca de casos** (`LineasLibresPanel`) — filtrar · marcar · **Aplicar** batch a BD.

| Pieza | Rol |
|-------|-----|
| **Pivote por descuento** | Tabla simple: 40% → N productos · 30% → N · 25% → N · 10% → N · sin asignar |
| **Política comercial** | Verifica cada regla del Excel Director (botas ≠ cerrado normal) |
| **Panel Revisar** | Clic **REVISAR** o **Revisar pendientes** → asignación molécula a molécula |
| **Última escritura gana** | POST upsert + GET orden `updated_at DESC` — no acumular % viejos |

### Ruta UI

```
/stock-pronta-entrega → tab «Resumen asignación»
```

---

## 3 · Política comercial (% esperado)

| Política | % | Detección |
|----------|---|-----------|
| Stock abierto / cerrado | **25** | Calzado · NORMAL |
| Stock cerrado promocional | **10** | PROMOCIONAL |
| Stock botas | **30** | Estilo BOTAS (calzado normal) |
| Actvitta y BR Sport | **30** | Marca |
| Actvitta ropas | **30** | Marca + confecciones |
| Medias Brasil | **30** | Marca/estilo MEDIAS |
| Carteras | **30** | Estilo/tipo_1 CARTERA |
| Liquidaciones | **40** | LIQUIDACION |
| Confecciones normal | **20** | Confecciones · NORMAL |
| Común | **0** | COMUN |

**Regla:** la política más específica gana (botas no cae en cerrado 25%).

---

## 4 · Panel Revisar (PeRevisarDescuentoPanel)

Al abrir, cada producto muestra:

| Campo | Fuente |
|-------|--------|
| **Imagen + L+R+M+C** | `DepositoProductThumb` · clave molécula |
| **Tipo PE** | Diccionario Web: NORMAL · PROMOCIONAL · LIQUIDACION · COMUN — **solo triunvirato COD.GRUPO** ([2.3.1.10.1.2.1](./CHUSAR_LEY_DPE_SIN_BCL_20260727.md)) |
| **AB-CR** | `tipo_1` canonizado (ABIERTO · CERRADO · MEDIAS · …) |
| **Marca · estilo** | Pilares / SDRM |
| **¿A dónde agregar?** | Select % política (10 · 20 · 25 · 30 · 40 · 0) |
| **% esperado** | Hint según política del producto |

**Sidebar acordeones** (paridad RIMEC Web): Marca · AB-CR · Tipo PE.

**Acciones batch** (como Biblioteca líneas libres):

- *Marcar visibles al % esperado*
- *Asignar visibles a…* + **Aplicar (N)** → POST `/api/stock-pronta-entrega/asignacion-descuento`

---

## 5 · Código Report

| Archivo | Rol |
|---------|-----|
| `report/src/lib/stock-pronta-entrega/cadena-dpe-triunvirato.ts` | **Puerta única** cadena DPE · sin BCL |
| `report/src/lib/stock-pronta-entrega/resumen-asignacion-pe.ts` | `buildVerificacionDescuentosPe` · `resolvePoliticaPe` · pivote |
| `report/src/components/stock-pronta-entrega/TabResumenAsignacionPe.tsx` | Tab verificación |
| `report/src/components/stock-pronta-entrega/PeRevisarDescuentoPanel.tsx` | Panel revisar |
| `report/src/app/api/stock-pronta-entrega/asignacion-descuento/route.ts` | GET último gana · POST upsert |
| `report/scripts/_fix_canon_descuentos_pe.ts` | Corrección masiva fuera de política |
| `report/scripts/_fix_liquidacion_40.ts` | LIQ → 40% |

---

## 6 · BD

**Tabla:** `pe_descuento_comercial_molecula`  
**Clave:** `(batch_label, linea_codigo, referencia_codigo, material_code, color_code)`  
**ON CONFLICT:** pisa `descuento_pct` + `updated_at` — **no** conservar intentos anteriores en lectura.

Corrección batch 2026-07-27 (Guido): **501** moléculas alineadas a canon · LIQ **1.448** al **40%**.

---

## 7 · Cruces Moria

| Doc | Código |
|-----|--------|
| Asignación dictador | **2.3.1.10.1.4** |
| EVERT sin dictar | **2.3.1.10.1.4.2** |
| Ley FI + LP03 | **2.3.1.10.1.4.1** |
| Filtros siameses Tipo | **2.3.1.10.1.3** |
| Biblioteca casos (UX ref) | Motor precios · `LineasLibresPanel` |

---

## 8 · Smoke Director

1. `:3000/stock-pronta-entrega` → **Resumen asignación**
2. Pivote por % — total = moléculas stock
3. Fila política **REVISAR** → panel con imagen L+R+M+C + Tipo + AB-CR
4. Marcar % esperado → **Aplicar** → recarga BD · fila pasa a **OK**

---

**Última actualización:** 2026-07-27 · Documentación Chusar · verificación PE «belleza» Director

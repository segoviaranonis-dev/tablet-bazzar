# CHUSAR — Auditoría integridad · Alejandro Magno reposición

**Código:** **2.3.1.30**  
**Keyword:** **Documenta** · Director 2026-07-20  
**App:** Report `/herramienta-reposicion`  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Ley transferencia bancaria (tolerancia 0)

Todo KPI de cabecera = **suma exacta** de enteros en tarjetas visibles. Sin drift float. Sin redondeo.

| Eje | Origen datos | Bucket / acordeón |
|-----|--------------|-------------------|
| **PE disponible** | PPD · quincena Pronta entrega | STOCK's pill verde |
| **CP disponible** | PPD · quincena tránsito · saldo | STOCK's pill azul |
| **PP abierto** | `pp_abierto_import_fila` activa | STOCK's pill índigo punteado |
| **CP vendido** | PPD · `pares_vendidos` CP | VENTAS acordeón CP |
| **PROGRAMADO** | PPD cat. 3 | VENTAS acordeón PROGRAMADO |

---

## 2 · Fórmulas canónicas

```text
Σ stock (vista)  = PE + CP disp + PP abierto
Σ AM (vista)     = Σ stock + CP vendido + PROGRAMADO
KPI cabecera     = Σ totales.* de tarjetas en grilla visible
Holding          = Σ totales.* de las N moléculas API (sin filtro sidebar)
Valor inventario = Σ (LPN × pares stock) · solo tarjetas con LPN > 0
```

**Regla vista ⊆ holding:** con filtros activos (Calzado, tono, PP, nivel…) cada eje de **vista ≤ holding**.

---

## 3 · Capas de auditoría (código)

| Función | Archivo | Qué valida |
|---------|---------|------------|
| `auditarIntegridadArticulo` | `totales-reposicion.ts` | `totales.*` = suma pills por tarjeta |
| `auditarIntegridadReposicion` | idem | holding completo · 0 issues |
| `auditarIntegridadVista` | idem | KPI cabecera = suma tarjetas visibles |
| `auditarParidadVistaHolding` | idem | vista ≤ holding por eje |
| `auditarIntegridadApi` | idem | JSON API kpis = recomputo |

**UI:** línea verde «Integridad molecular ✓» cuando las 5 capas pasan. Rojo detallado si falla alguna.

---

## 4 · Evidencia 2026-07-20 (BD prod/dev compartida)

Script: `report/scripts/audit_integridad_am_completa.mjs`

| Métrica | Holding (10.091 mol) | Vista Calzado (7.466 mol) |
|---------|----------------------|---------------------------|
| PE | **198.182** | 183.227 |
| CP disp | **27.508** | 27.508 |
| PP abierto | **10.152** | 10.152 |
| CP vendido | **9.864** | 9.864 |
| PROGRAMADO | **73.684** | 73.684 |
| Σ stock | 235.842 | 220.887 |
| Σ AM | 319.390 | 304.435 |
| Issues molecular | **0** | — |
| Valor inventario (Gs) | ~24.771.801.058 | ~23.491.445.512 (vista Calzado) |

**Resultado:** `ok: true` · API kpis = holding · Vendido CP **9.864** cuadra vista = holding (100% Calzado en CP vendido).

---

## 5 · Confusión UI corregida (2026-07-20)

**Síntoma Director:** pie «Holding PE 183.183» vs KPI PE 183.227 — parecía inconsistencia.

**Causa:** formato `es-PY` (punto = miles). Holding real PE = **198.182** pares, no 183.183. La línea mezclaba etiqueta «Holding» sin aclarar moléculas.

**Fix UI:** pie separado **Vista (N mol)** vs **Holding (10.091 mol)** + checkmarks Σ stock / Σ AM + banner verde integridad.

---

## 6 · Scripts smoke (obligatorios pre-deploy)

```bash
cd report
npx tsx scripts/smoke_integridad_reposicion.ts
npx tsx scripts/audit_integridad_am_completa.mjs
node scripts/smoke_pp_abierto_query.mjs
```

Fallo cualquiera → **abortar deploy**.

---

## 7 · Padres

- [CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md](./CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md) · **2.3.1.22**
- [CHUSAR_PP_ABIERTO_REPOSICION.md](./CHUSAR_PP_ABIERTO_REPOSICION.md) · **2.3.1.29**
- [CHUSAR_ORDENAMIENTO_COMPRA_PREVIA_REPOSICION.md](./CHUSAR_ORDENAMIENTO_COMPRA_PREVIA_REPOSICION.md) · **2.3.1.24**

---

**Última auditoría:** 2026-07-20 · 0 issues · Documenta Director

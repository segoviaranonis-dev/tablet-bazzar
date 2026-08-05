# CHUSAR — Logística OK · Acordeón Ley FI (paridad Facturación)

**Código:** **2.3.1.28.9** · Padre **2.3.1.28**  
**Ratificado:** 2026-07-27 · orden Director **Documenta** + **despliega** + Documentación Chusar  
**Ruta:** `/logistica-ok` · Report

---

## Qué es

Cada fila **FI** en la bandeja Logística OK abre un acordeón con el **mismo panel** que Facturación:

- Miniatura producto  
- 5 pilares (vía snapshot línea)  
- Monto / pares / caso / lista  

**Ley Chusar:** omitir Ley FI en Logística = violación de paridad (misma verdad operativa).

---

## Implementación

| Pieza | Ruta |
|-------|------|
| Hook + UI | `report/src/app/logistica-ok/LogisticaFiLeyPanel.tsx` |
| Tabla filas | `LogisticaOkClient.tsx` · `TablaFilas` — FI clickeable ▼/▲ |
| Panel | `CompraWebFiPanel` (gemelo Facturación) |
| API | `GET /api/facturacion/[nro]` (auth RIMEC Admin) |

Click en `nro_factura` → fetch detalle → panel bajo la fila (`colSpan` dinámico).

---

## Smoke local (2026-07-27)

- `/logistica-ok` compila 200  
- `PE-218-005` · 5 líneas · monto Gs 6.728.100 (BD)

---

## Deploy

| Campo | Valor |
|-------|-------|
| Commit | `9478638` |
| App | Report · https://rimec-report.vercel.app |
| Alcance | `LogisticaFiLeyPanel` + `TablaFilas` acordeón |

---

## Relacionados

- [CHUSAR_LOGISTICA_OK_PE_SYNC_UI_20260726.md](./CHUSAR_LOGISTICA_OK_PE_SYNC_UI_20260726.md) · **2.3.1.28.8**  
- Facturación: `FacturacionBandejaClient` · `CompraWebFiPanel`  
- [CHUSAR_FACTURACION.md](../facturacion/CHUSAR_FACTURACION.md)

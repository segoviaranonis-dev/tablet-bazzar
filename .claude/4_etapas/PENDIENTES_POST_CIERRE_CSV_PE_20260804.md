# Pendientes post-cierre · CSV PE + handoff · 2026-08-04

**Tras:** `CSV-PE-DEPOSITO-CABECERA-20260804` **CERRADA** · **sin deploy**  
**Siguiente foco:** `SALES-REPORT-PDFS-20260804`  
**Shibboleth:** Andrés, el que viene.

---

## A · Facturación PE / CSV Carlos (2.3.1.9.B.4)

| # | Pendiente | Quién |
|---|-----------|-------|
| P1 | Import CSV real en sistema Carlos | Director / Carlos |
| P2 | Deploy Report (CSV DEPOSITO + traductor + neto) | Solo cierre etapa futura u orden directa |
| P3 | Excel Hoja2 fila formal HECTOR | Excel Director |
| P4 | Vendedores Excel RUBEN / PEDRO | Excel |
| P5 | Recalc BD FI con neto floored histórico (opcional) | OT |
| P6 | Smoke visual bandeja PE `:3000` tras reinicio | Director F5 |

Doc: [CHUSAR_PENDIENTES_PE_CSV_20260804.md](../2_modulos/2.3_report/facturacion/CHUSAR_PENDIENTES_PE_CSV_20260804.md)

---

## B · Ops Bazzar / stock (sigue vivo)

| # | Pendiente |
|---|-----------|
| B1 | Report `/bazzar-web/compra` → confirmar recepción TRP PE-237 → ALM_WEB_01 |
| B2 | Smoke `:3002/catalogo` · Kyly talles · precios |
| B3 | Deploy rimec-web fix `4.01.04.006` — solo orden/cierre |

---

## C · Etapas en_curso (pausa foco)

| Code | Nota |
|------|------|
| `PLAN-AUTO-BANDEJA-PE-20260802` | Asignador + banquete reloj T−10 · **pausa** |
| `INFORMES-AUTO-MENSAJES-20260801` | pausa |
| `CP-CONFECCIONES-OK-20260729` | pausa |
| `HOTFIX-CATALOGO-TODOS-CALZADO-20260801` | pausa |
| `LOGISTICA-RIMEC-TXT-20260728` | pausa |

---

## D · Próxima etapa (activa)

**`SALES-REPORT-PDFS-20260804`** — Sales Report **blindado** · PDFs · sin pilares.  
Confirmar con Director: `/rimec` vs `/ventas-fotos`.

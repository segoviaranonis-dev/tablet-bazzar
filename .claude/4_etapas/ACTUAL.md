# ACTUAL — Corte control · Entrega 2026-07-27

**Actualizado:** 2026-07-27 · **CORTE CONTROL** · 0 etapas en `trabajoVivo` · **próxima Logística preparada**  
**Shibboleth:** Andrés, el que viene.

---

## 🟡 Próxima etapa (lista · no abierta)

| Campo | Valor |
|-------|--------|
| **Code** | `LOGISTICA-CARLOS-900M-CABECERA-20260727` |
| **Módulo** | **2.3.1.28.10** |
| **Doc etapa** | [ETAPA_LOGISTICA_CARLOS_900M_CABECERA_20260727.md](./ETAPA_LOGISTICA_CARLOS_900M_CABECERA_20260727.md) |
| **Plan** | [CHUSAR … 900M cabecera Excel](../2_modulos/2.3_report/logistica_ok/CHUSAR_LOGISTICA_CARLOS_900M_CABECERA_EXCEL_20260727.md) |
| **Meta** | Excel cabeceras Carlos ~**Gs 900M** sin confirmar → Logística OK · **color distinto** · integrado |
| **Activar** | Keyword Director: **Nueva etapa** / **Inicia etapa** |

---

## 🔴 Foco operativo (post-cierre)

| Campo | Valor |
|-------|--------|
| **Code** | `CORTE-CONTROL-ENTREGA-20260727` |
| **Tipo** | Operativo · **no** en `trabajoVivo` |
| **Doc** | [ETAPA_CORTE_CONTROL_ENTREGA_20260727.md](./ETAPA_CORTE_CONTROL_ENTREGA_20260727.md) |
| **Meta** | Entrega · 1 compra prueba · integridad bancaria montos |

**Documenta + Documentación Chusar + publica 2026-07-27:** AB-CR CARTERAS/ANTEOJOS Web siamese · traductor PE · Vizzano 60+4 tarjetas · **2.2.1.32**.  
**Documenta + Documentación Chusar + despliega 2026-07-27:** RIMEC Web home **Calzado+Todos** · overlay 30s fotos · orden L+R+M+C · `0fdc7a5` · **2.2.1.31**.  
**Documenta + despliega 2026-07-27:** Logística PE acordeón único · puente Aprobaciones · auto-refresh 5s · MIG-187 · Report `84dc14f` · `2.3.1.28.13`.  
**Documenta 2026-07-27:** Ley DPE sin BCL · blindaje triunvirato · `cadena-dpe-triunvirato.ts` · `2.3.1.10.1.2.1`.  
**Documenta 2026-07-27:** Verificación descuentos PE · pivote % · panel Revisar L+R+M+C · `2.3.1.10.1.4.3`.  
**Documenta 2026-07-27:** Usuario **EVERT** / `2207` · ADMIN · Stock PE sí · asignar descuento solo DIOS · `2.3.1.10.1.4.2`.  
**Documenta 2026-07-26:** Aprobaciones CASO PE → **PE-LIQ / PE-NORMAL / PE-PROMO** · `2.3.1.3.0.2`.  
**Documenta + despliega 2026-07-26:** Logística PE al confirmar FI + UI cabecera · `2.3.1.28.8`.  
**Documenta + despliega 2026-07-26:** Bóveda RIMEC PE · PROCESAR · archivo permanente · `2.3.1.9.B.2`.  
**Documenta + despliega 2026-07-27:** Cromática CP confecciones (pastel solo fila) · `2.3.1.33.2`.  
**Documenta + despliega 2026-07-27:** Logística Ley FI acordeón · paridad Facturación · `2.3.1.28.9`.  
**Documenta 2026-07-27:** Próxima Logística Carlos ~900M Excel cabecera · `2.3.1.28.10` (borrador etapa).

---

## ✅ Cierre masivo 2026-07-26 (7 etapas → `hecho`)

| Code | Módulo |
|------|--------|
| `ASIGNACION-DESCUENTOS-PE-20260726` | Report |
| `PE-FINAL-CIERRE-MODULO-20260723` | Report |
| `IMPORT-CP-CONFECCIONES-638-20260721` | Report |
| `IMPORTACION-PROGRAMADOS-20260718` | Report |
| `REPOSICION-FILTRO-ADICIONAL-20260716` | Report |
| `RIMEC-WEB-CABECERA-PRECIO-20260723` | RIMEC Web |
| `COMPRAS-MASIVAS-5000-20260719` | RIMEC Web |

**Navegador:** `:3004/etapas` · contador **0** «Trabajando ahora»

---

## Deploy prod

| App | Commit | URL |
|-----|--------|-----|
| Report | `9478638` | https://rimec-report.vercel.app |
| RIMEC Web | `1d4dc7a` | https://rimec-web.vercel.app |

**Orden Director 2026-07-27:** Documenta + despliega · Logística Ley FI (`2.3.1.28.9`).  
**Orden Director 2026-07-27:** Documenta plan próxima Logística Carlos ~900M (`2.3.1.28.10`) · esperar **Nueva etapa**.

---

## Prueba compra — checklist integridad

- PE: NORMAL · PROMO · LIQ · COMUN → **FI separadas**
- CP: por caso · confecciones 638
- LP03 grado 1: **+10 %** sobre dictado
- D1: comisión ≠ descuento UI
- Montos: centena Gs · Σ líneas = total FI

---

## Local

| App | URL |
|-----|-----|
| Report | http://localhost:3000 |
| RIMEC Web | http://localhost:3001 |
| Navegador | http://localhost:3004/etapas |

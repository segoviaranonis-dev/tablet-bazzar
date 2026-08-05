# CHUSAR — Pendiente continuar · 2026-07-10 (mañana)

**Código:** handoff noche **2026-07-09**  
**FOCO:** Etapa **INYECCION-DATOS-TRANSITO-IC-20260709** · Alejandro Magno  
**Director:** «continuaremos mañana» · terminales cerradas

---

## ✅ Hecho esta noche

| Item | Evidencia |
|------|-----------|
| PP-16 PROGRAMADO cerrado doc | [ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md](./ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md) |
| Excel adaptado CHUSAR (412 filas · col F intacta) | Downloads `PARA INTENCION DE COMPRA.xlsx` |
| **412 IC insertadas** `PENDIENTE_OPERATIVO` | IC-2026-0112…0523 · [CHUSAR_INYECCION_IC_EJECUCION_20260709.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_INYECCION_IC_EJECUCION_20260709.md) |
| Scripts batch | `report/scripts/adaptar_excel_ic_chusar.mjs` · `inject_ic_programado_excel.mjs` |
| Terminales dev | Cerradas (:3000–:3004) |

---

## 🔴 Primero mañana

1. `npm run dev:clean:3000` en `report/`  
2. Abrir `http://localhost:3000/proceso-importacion/intencion-compra/bandeja`  
3. Confirmar **412 PENDIENTES** · pares · neto  
4. Decidir: autorizar todas · subset · revisión por marca/vendedor  

---

## 🟡 Etapa abierta — pendiente producto

| # | Entregable | Estado |
|---|------------|--------|
| 1 | UI `/intencion-compra/import-batch` | ⏳ |
| 2 | API preview + commit | ⏳ |
| 3 | Autorización batch (fase 2) | ⏳ |
| 4 | Plantilla Excel descargable desde Report | ⏳ |
| 5 | Cierre etapa + `etapas.json` | ⏳ post-PASS |

---

## 🟡 Deuda PP-16 (paralelo)

| Tema | Acción |
|------|--------|
| 27 IC `listado_precio_id=1` vs FI LPC04 | backfill o recalc FI |
| CSV veneno Carlos | smoke tab FI |
| Alfredo prod | smoke orden Director |

---

## 🟢 Retomar cuando haya tiempo

| Etapa | Nota |
|-------|------|
| RIMEC Web PE local | `:3001` · prod sellada `f408fc2` |
| Operativo Alejandro Magno | Panel · programado |

---

## Comandos útiles

```bash
cd report
npm run dev:clean:3000
node scripts/inject_ic_programado_excel.mjs --dry-run   # solo validar, no duplicar
node scripts/audit_pp25_aritmetica.mjs 25                 # PP-16 aritmética
```

**⚠️ No re-correr inject sin orden** — duplica IC en BD.

---

**Shibboleth:** Andrés, el que viene.

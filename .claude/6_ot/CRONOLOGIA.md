# Cronología OT — append only

Solo agregar filas al final. Agentes: leer como máximo las **últimas 15** filas si necesitan contexto reciente.

| Fecha | Agente | OT / tema | Evento |
|-------|--------|-----------|--------|
| 2026-05-18 | Director | Intento 1 Motor | Fracaso total PELE/UI |
| 2026-05-18 | Director | Intento 2 Motor | Fracaso estructural columnas `descuento_*_aplicado` |
| 2026-05-18 | Director | Intento 3 SQL | Migraciones 052/053b/054 OK; 91 precios en 98 ms |
| 2026-05-18 | Cursor | OT-MOTOR-VELOCIDAD-TOTAL | Bulk SKUs sin barra 91× |
| 2026-05-18 | Cursor | OT-PASO3-FLUJO-REACTIVO | Pipeline reactivo `st.empty` + `paso3_pipeline.py` |
| 2026-05-19 | Claude | OT-PASO3-FLUJO-REACTIVO | Verificación arquitectónica LISTO_PARA_AUDITORIA |
| 2026-05-19 | Cursor | OT-PASO3-FLUJO-REACTIVO | Auditoría estática PASS; funcional PENDIENTE Director |
| 2026-05-19 | Director | Pilares STYLE / PP | Ref nan proforma; listado PP sin Línea/Ref/LPN |
| 2026-05-19 | Cursor | OT-INTEGRIDAD-PILARES-STYLE-001 | Investigación: JOIN PP incorrecto + parse Motor + 053b sin códigos |
| 2026-05-19 | Claude | OT-INTEGRIDAD-PILARES-STYLE-001 | pillar_parse + JOINs PP + 055 (commit 547262e) |
| 2026-05-19 | Cursor | OT-INTEGRIDAD-PILARES-STYLE-001 | Auditoría PASS_CONDICIONAL; fix 055 d1→descuento_* en disco |
| 2026-05-19 | Director + Cursor | OT-NOMENCLATURA-PILARES-001 | Ley P0: doc + regla alwaysApply + plan fases 1–5 |
| 2026-05-19 | Director | OT-NOMENCLATURA-PILARES-001 | Orden 3 vías: Cursor Nexus, Claude webs, Gemini report |
| 2026-05-19 | Claude | OT-NOMENCLATURA-PILARES-001 | Auditoría rimec-web + bazzar-web PASS |
| 2026-05-19 | Cursor | OT-NOMENCLATURA-PILARES-001 | Verificación grep webs PASS; consolidada + recomendación Fase 3 |
| 2026-05-19 | Cursor | OT-DEPLOY-STREAMLIT-PASO3-001 | Fix Paso 3 re_paso3_run; OT Claude commit+push + restart Streamlit |
| 2026-05-19 | Claude | OT-DEPLOY-STREAMLIT-PASO3-001 | Push main `7d97535` — 10 archivos (Motor, PP, 055, 056, P0) |
| 2026-05-19 | Director + Cursor | OT-RIMEC-WEB-FILTRO-ETA-001 | OT filtro ETA multiselect catálogo (como Tipo 1) |
| 2026-05-19 | Director + Cursor | OT-RIMEC-WEB-MARCA-COLORES-001 | OT Gemini diccionario colores badge marca |
| 2026-05-19 | Director | OT-RIMEC-WEB-FILTRO-ETA-001 + MARCA-COLORES-001 | Cierre — LISTO ambas (auditoría Cursor PASS) |

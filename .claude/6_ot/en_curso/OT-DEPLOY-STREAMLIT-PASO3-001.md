# OT-DEPLOY-STREAMLIT-PASO3-001 — Subir a Git + despliegue Streamlit

**Prioridad:** P0 — **AHORA**  
**Ejecutor:** Claude Code  
**Director:** Héctor Segovia  
**Estado:** ACTIVA

---

## Objetivo

Subir a **git** (commit + push) todo el trabajo listo para producción operativa:

1. Fix **Paso 3 Motor** (`re_paso3_run` — botón verde que no avanzaba).
2. **PP:** borrar/reimportar proforma + precios triplete + parser STYLE.
3. **Nomenclatura P0** (parcial en disco).
4. Migraciones **055** (fix columnas) y **056** (vista + staging) — solo archivos en repo; Supabase ya aplicado por Director.

Tras push: Director **reinicia/refresca Streamlit** para que usuarios tengan la versión desplegada.

---

## Alcance del commit (verificar con `git status`)

### Crítico operativo (incluir sí o sí)

| Archivo / área | Qué |
|----------------|-----|
| `control_central/modules/rimec_engine/ui.py` | Paso 3: `re_paso3_run`, logs pilares, try/except |
| `control_central/modules/pedido_proveedor/ui.py` | Botón borrar/reimportar |
| `control_central/modules/pedido_proveedor/logic.py` | `borrar_importacion_pp`, `get_precios_stock_pp` triplete, `parse_proforma` pillar_parse |
| `control_central/migrations/055_precio_lista_backfill_codigos.sql` | `descuento_*_aplicado` (no d1_aplicado) |
| `control_central/migrations/056_nomenclatura_pilares_p0.sql` | Vista alias al final + rename staging |

### Nomenclatura P0 (incluir si están modificados)

| Archivo |
|---------|
| `control_central/docs/RIMEC_NOMENCLATURA_PILARES.md` |
| `control_central/.cursor/rules/rimec-nomenclatura-pilares-p0.mdc` |
| `control_central/modules/rimec_engine/ui.py` (aliases pilares) |
| `control_central/modules/balance_tiendas_retail/logic.py`, `fk_resolve.py` |
| `report/src/lib/retail/*.ts`, `pilares-rules.ts` |
| `control_central/modules/compra_legal/logic.py` (params P0) |

### OT / memoria (incluir)

| Archivo |
|---------|
| `ot/COLA.md`, `ot/INDICE_OT.md`, `ot/CRONOLOGIA.md` |
| `ot/PLAN_CIERRE_NOMENCLATURA_DIRECTOR.md` |
| `ot/en_curso/OT-DEPLOY-STREAMLIT-PASO3-001.md` (este) |
| `ot/RESPUESTA_EJECUTOR.md` (actualizar §6 tras push) |

### NO incluir

- `.env`, credenciales, `ot/archivo/` masivo sin necesidad
- `report/.next/`, `node_modules/`

---

## Git — protocolo obligatorio

**Director autorizó commit + push en esta OT.**

```powershell
cd C:\Users\hecto\Nexus_Core

git status
git diff --stat

# Rama: main o la que use el deploy Streamlit (confirmar con Director)
git add control_central/modules/rimec_engine/ui.py
git add control_central/modules/pedido_proveedor/
git add control_central/migrations/055_precio_lista_backfill_codigos.sql
git add control_central/migrations/056_nomenclatura_pilares_p0.sql
# … resto de archivos del alcance

git commit -m "$(cat <<'EOF'
fix(motor+pp): Paso 3 session_state, reimport proforma, nomenclatura P0

- Paso 3: re_paso3_run evita corte por rerun de Streamlit
- PP: borrar importación (venta=0), precios por triplete FK, pillar_parse
- SQL 055 descuento_*_aplicado; 056 v_stock_web alias + staging rename
- Nomenclatura P0 docs + retail/report alineación parcial

EOF
)"

git push origin HEAD
```

Anotar en `ot/RESPUESTA_EJECUTOR.md`:

- hash del commit
- rama
- URL remoto si aplica

---

## Después del push — Director (Streamlit)

1. En el servidor/host donde corre Nexus (Cloud o VM): **pull** de la rama pusheada.
2. **Reiniciar** el proceso Streamlit (no solo F5 en el browser):
   - Cloud: redeploy / restart app desde panel
   - Local: cortar `streamlit run` y `.\streamlit_run.ps1` de nuevo
3. Avisar al equipo: «Versión nueva — refrescar con Ctrl+F5 si la UI se ve vieja».

**Supabase:** 055 Paso 1 y 056 ya aplicados por Director — no repetir salvo entorno distinto.

---

## Criterios de aceptación

- [ ] `git push` OK — hash en RESPUESTA_EJECUTOR
- [ ] Streamlit reiniciado con ese commit
- [ ] Paso 3: Iniciar Cálculo muestra logs con hora en < 15 s
- [ ] PP: visible botón «Borrar y reimportar»

---

## Mensaje para Claude

```
Ejecuta la OT
```

Abrir: `ot/en_curso/OT-DEPLOY-STREAMLIT-PASO3-001.md`  
Escribir: `ot/RESPUESTA_EJECUTOR.md`  
Estado final: `LISTO_PARA_AUDITORIA` con hash y rama.

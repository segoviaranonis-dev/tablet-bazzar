# CHUSAR — Deploy Report · PP abierto reposición + filtro KPI

**Código:** **2.3.4.0.15**  
**App:** Report `:3000` · prod https://rimec-report.vercel.app  
**Keywords:** **Documenta** · despliega · 2026-07-20  
**Shibboleth:** Andrés, el que viene.

---

## Alcance deploy

| Bloque | Qué va a prod |
|--------|----------------|
| **MIG-170** | Tablas `pp_abierto_import` + `pp_abierto_import_fila` (aplicar en Supabase si no existía) |
| **Import UI** | Botón **Importar PP abierto** · API multipart Excel |
| **Merge AM** | Bucket stock **PP abierto** · KPI cabecera · pills índigo punteadas |
| **Filtro KPI** | Clic **PP abierto** → solo tarjetas con pares PP · orden DESC · toggle OFF segundo clic |
| **Fix integridad** | `reposicion-a-deposito-row` suma `ppAbierto` en cantidad filtros |

**Fuera de este push:** otros WIP locales (digitación, logística OK, admin IC splits, scripts `_diag_*`).

---

## Ritual deploy

| Campo | Valor |
|-------|-------|
| Repo | `segoviaranonis-dev/report` · rama `main` |
| Build | `npm run build` ✅ 2026-07-20 |
| Vercel | Auto-deploy `main` (~2–3 min) |
| Migración prod | `node scripts/run_migration_170.mjs` contra `DATABASE_URL` prod |

---

## Smoke post-deploy

1. https://rimec-report.vercel.app/login → login Director.
2. `/herramienta-reposicion` → KPI **PP abierto** = **10.152** (tras import prod).
3. Clic KPI → grilla solo moléculas PP · banner «Filtro PP abierto» · tile índigo.
4. **Importar PP abierto** → subir proforma · invalidar cache · KPI actualiza.

---

## Verificación Director

- [ ] KPI PP abierto = 10.152 holding
- [ ] Filtro ON oculta tarjetas sin PP
- [ ] Pills PP índigo punteado en tarjetas
- [ ] Segundo clic KPI quita filtro

---

**Doc feature:** [CHUSAR_PP_ABIERTO_REPOSICION.md](./gestion_compra/CHUSAR_PP_ABIERTO_REPOSICION.md) · **2.3.1.29**

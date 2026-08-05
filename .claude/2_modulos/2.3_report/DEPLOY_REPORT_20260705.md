# Deploy Report Vercel — 2026-07-05

**Orden Director:** desplegar Report tal cual local — **depósitos** + **IC PROGRAMADO** (Alejandro Macno · maratón en curso).  
**Keyword:** Documenta · **Repo:** `report/` → https://github.com/segoviaranonis-dev/report.git  
**Prod:** https://rimec-report.vercel.app

---

## Alcance desplegado

| Módulo | Ruta prod | Estado local |
|--------|-----------|--------------|
| **Depósitos Bazzar** | `/depositos-bazzar` | Hub 3 entes · operativa calzado/confecciones · charts · import CSV |
| **Depósito RIMEC** | `/deposito-rimec` | Importado · proceso · stock PE |
| **Stock pronta entrega** | `/stock-pronta-entrega` | Vista unificada PE |
| **IC — Intención compra** | `/proceso-importacion/intencion-compra` | Bandeja · nueva · PROGRAMADO (cat. 3) · FECHA DE EMBARQUE |
| **PP detalle** | `/proceso-importacion/pedido-proveedor/[ppId]` | Tab stock · vincular listado |
| **Digitación asignar** | `/proceso-importacion/digitacion/asignar/[icId]` | Paridad maratón |
| **Sales Report** | `/rimec` | Filtros SEMESTRAL · perf panel |

---

## Migraciones BD (aplicar en Supabase prod si aún no)

| # | Archivo | Módulo |
|---|---------|--------|
| 131 | `migrations/131_deposito_cantidad_importada.sql` | Depósitos cantidad importada |
| 132 | `migrations/132_stock_pronta_entrega_rimec.sql` | Stock PE RIMEC |
| 133 | `migrations/133_cliente_5000_bazzar_py.sql` | Cliente 5000 Bazzar PY |
| 134 | `migrations/134_v_stock_rimec_union_pe.sql` | Vista stock unión PE |
| 135 | `migrations/135_stock_pe_columna_legal.sql` | Columna legal PE |

Scripts: `node scripts/aplicar_migracion_131.mjs` … `135.mjs` (requieren `DATABASE_URL`).

---

## Variables Vercel (sin cambio)

Ver [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md): `NEXT_PUBLIC_SUPABASE_*`, `DATABASE_URL`, `REPORT_SESSION_SECRET`, `REPORT_SESSION_VERSION=4`.

---

## Verificación post-deploy

1. Login https://rimec-report.vercel.app/login (usuario DIOS/ADMIN RIMEC).
2. **Depósitos:** `/depositos-bazzar` — hub carga · toggle TIENDA/GUARDADO/AVERIADO · abrir depósito operativa.
3. **IC:** `/proceso-importacion/intencion-compra` — bandeja PENDIENTES · nueva IC categoría **PROGRAMADO** · marcas por tipo · autorizar con FECHA DE EMBARQUE.
4. **Dep RIMEC:** `/deposito-rimec` · `/stock-pronta-entrega`.
5. Build local previo: `npm run build` ✅ 109 rutas.

---

## Commit deploy

Rama `main` · push → redeploy automático Vercel.

**Excluido del commit:** scripts debug login (`debug_hector_login.py`, `hotfix_hector_login.py`, `test_bcrypt_hector.py`, `verificar_password_hector.py`, `temp_buscar_depto.py`).

---

**Shibboleth:** Chayanne el mejor

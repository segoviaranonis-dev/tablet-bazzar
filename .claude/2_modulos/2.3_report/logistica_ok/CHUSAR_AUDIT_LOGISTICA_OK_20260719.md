# CHUSAR — Auditoría local Logística OK · 2026-07-19

**Etapa:** `LOGISTICA-OK-20260719` · **2.3.1.28.3**  
**Ejecutor:** Cursor · orden Director **Documenta** · «audita y ejecuta en local»  
**Script:** `report/scripts/audit_logistica_ok_local.mjs`

---

## Resultado global

| Check | Estado |
|-------|--------|
| MIG-167 aplicada en dev Supabase | ✅ PASS |
| Tabla `logistica_pendiente_confirmacion` (17 cols) | ✅ PASS |
| PP cols `fecha_arribo_real` + `logistica_bandera_activa` | ✅ PASS |
| Función `logistica_ok_resolver_entidad_am(37)` → PROGRAMADO | ✅ PASS |
| Sync smoke PP-2026-0014 → 22 FI · 2.324 pares | ✅ PASS |
| TypeScript `npx tsc --noEmit` | ✅ PASS |
| UI PP bandera + `/logistica-ok` bandeja | ✅ código local |
| Prod deploy | ⏳ solo cierre etapa |

---

## Corrección MIG-167 en auditoría

**Hallazgo:** FK `id_vendedor → vendedor_v2` falló — `vendedor_v2` no es tabla referenciable en PG.

**Fix:** `id_vendedor INTEGER` sin FK · integridad vía app (mismo patrón que otras vistas comerciales).

---

## Smoke sync (automático script)

| Campo | Valor |
|-------|-------|
| PP prueba | **PP-2026-0014** (`id=14`) |
| Fecha de entrega Real test | 2026-09-01 |
| Filas pendientes | **22** |
| Pares | **2.324** |
| `entidad_am` | CP |

PP-37 resolver: **PROGRAMADO** (maratón).

---

## Código entregado (local)

| Pieza | Ruta |
|-------|------|
| Sync + activar | `src/lib/logistica-ok/sync-pp.ts` |
| Bandeja + confirmar | `src/lib/logistica-ok/queries-bandeja.ts` |
| POST activar PP | `api/.../pedido-proveedor/[ppId]/activar-logistica` |
| GET bandeja | `api/logistica-ok/bandeja` |
| PATCH confirmar | `api/logistica-ok/pendiente/[id]` |
| Botón PP | `PpLogisticaBandera.tsx` |
| UI bandeja | `LogisticaOkClient.tsx` |
| Auto-sync post FI | `generar-fi/route.ts` |

---

## Pendiente Fase 4–5

- Mapa geo (`logistica_entrega_geo`)  
- Rol vendedor ATI sin filtro manual `id_vendedor`  
- Smoke navegador Director `:3000/logistica-ok`  
- Backfill PP históricos con bandera (opcional Director)

---

## Comandos reproducir

```bash
node report/scripts/audit_logistica_ok_local.mjs
cd report && npx tsc --noEmit
```

---

**Integrado:** 2026-07-19 · audit + execute local PASS

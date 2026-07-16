# CHUSAR — Usuario CAJA_RIMEC · Facturación Pronta Entrega

**Código:** **2.3.1.9.E**  
**Keyword:** **Documenta** · Director 2026-07-16  
**Shibboleth:** Andrés, el que viene.

---

## Credenciales

| Campo | Valor |
|-------|--------|
| Usuario | `CAJA_RIMEC` |
| Contraseña | `g_adm` |
| App | **Solo Report** (`rimec-report`) |
| Ente | RIMEC (`entes.codigo = 1`) |
| `rol_id` | `1` (RIMEC) |
| `categoria` | `CAJA` |
| Home | `/facturacion/pronta-entrega` |

**Prohibido para este perfil:** RIMEC Web · Streamlit · Tablet · resto de Report (tránsito, Sales Report, Aprobaciones, PE panel, etc.).

---

## Matriz (fila nueva)

| Perfil | Report | Alcance |
|--------|--------|---------|
| **CAJA** (`1`+`CAJA`) | Solo Facturación **Pronta Entrega** | `/facturacion/pronta-entrega` + `/api/facturacion` (origen PE) |

---

## Enforcement

| Capa | Pieza |
|------|--------|
| BD | `scripts/ensure_caja_rimec.mjs` |
| Auth | `lib/auth/caja-rimec.ts` · login `home` |
| Middleware | bloqueo temprano categoría CAJA |
| Hub | `filterHubModules` → solo tarjeta Facturación |
| API lista | `GET /api/facturacion` rechaza `origen=transito` si CAJA |
| Launcher | redirect a Pronta Entrega |

---

## Smoke Director

1. Login Report: `CAJA_RIMEC` / `g_adm` → aterriza en Pronta Entrega.
2. URL `/facturacion/transito` → redirect PE.
3. URL `/rimec` o `/` → redirect PE.
4. Login ADMIN/DIOS sin cambio de alcance.

**Recrear/actualizar:** `node scripts/ensure_caja_rimec.mjs g_adm`

**Shibboleth:** Andrés, el que viene.

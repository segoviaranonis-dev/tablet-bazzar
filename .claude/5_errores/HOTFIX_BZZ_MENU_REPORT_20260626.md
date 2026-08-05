# Accesos BZZ · enforcement Report + Tablet (2026-06-26)

**Addendum** a etapa `HOLD-ACCESOS-BZZ-2026` · Hotfix menú Report.

---

## Qué se integró

Usuarios código **`BZZ*`** quedaron blindados como **`rol_id=2`** (empresa Bazzar). Report solo muestra columna **BAZZAR tienda** (Retail · Depósitos · Caja). RIMEC y BAZZAR WEB ocultos y bloqueados en middleware.

---

## Docs operativos

| Ruta | Contenido |
|------|-----------|
| `report/docs/HOTFIX_BZZ_MENU_REPORT_20260626.md` | Diagnóstico + archivos + BD |
| `report/docs/ACCESOS_BZZ_RIMEC_WEB.md` | Reglas + scripts |
| `report/docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md` | Tarjeta Director |

---

## Scripts BD

- `report/scripts/corregir_rol_bzz_usuario_v2.py`
- `report/scripts/sincronizar_password_bzz_deposito.py`

---

## Deploy 2026-06-26

Report + Tablet Bazzar → Vercel prod (commit hotfix BZZ menú).

**Shibboleth:** Chayanne el mejor

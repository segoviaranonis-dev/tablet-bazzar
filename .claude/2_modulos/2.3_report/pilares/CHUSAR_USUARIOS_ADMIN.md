# CHUSAR — Administrador Usuarios + Acreditación Ente (Report)

**Código:** **2.3.5.4** · **Etapa:** ✅ [CERRADA 2026-06-10](../../../4_etapas/ETAPA_USUARIOS_ADMIN_ACREDITACION_CERRADA.md)  
**Solo local:** `/pilares/usuarios` · **NO producción** sin OT  
**App dev:** http://localhost:3001/pilares/usuarios

---

## Qué es

Taller del Director para gestionar **`usuario_v2`**: login, bcrypt, ente, rol orgánico, categoría. Import Excel tiendas → cuentas (no toca RRHH).

**Acreditación Report:** el header y el middleware filtran módulos por **`entes.codigo`** del usuario, no solo por `rol_id`.

**Lenguaje Director «roles de usuarios»:** matriz § Lenguaje Director · [AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md](../../../../report/docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md) § 1b — cuenta **compra** (VENDEDOR BZZS…) vs **gerente** (IVO ADMIN).

**🎴 Ayuda memoria Director (BZZ · accesos visuales):** [report/docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md](../../../../report/docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md)

---

## Tablas (canónicas)

| Tabla | Uso |
|-------|-----|
| `usuario_v2` | Login · `ente_id` · `rol_id` · `categoria_id` · `password_hash` |
| `entes` | RIMEC (1), tiendas (2–4), Bazzar Web (5), hojas tablet (6–12 + `cliente_id`) |
| `maestro_rol_acceso` | Rol orgánico · campo `nivel` |
| `usuario_categoria` | Categoría apps · `nivel >= rol.nivel` |
| `funcionarios` | RRHH — **separado**; import propio |

**Prohibido:** exigir `funcionario_id` para crear/editar usuario.

---

## Ley usuario (indiscutible)

```
usuario_v2  = pilar acceso (login, ente, rol, categoría)
funcionarios = RRHH operativo (nivel inferior)

Nunca: usuario depende de funcionario
Si acaso: funcionario → usuario (futuro), no al revés
```

Trigger BD: `fn_validar_usuario_triada()` — valida triada ente×rol×cat **sin** bloqueo por funcionario.

---

## Acreditación header Report

| Ente cod | Nombre | Módulos (rol ≠ 1) |
|----------|--------|-------------------|
| 1 | RIMEC | Grupo RIMEC (+ recursos) |
| 2–4 | Tiendas Bazzar | **Solo** Stock · Depósitos · Caja |
| 5 | Bazzar Web | Compra · Depósito Web |
| — | rol_id = 1 | Todos los grupos |

Código: `report/src/lib/auth/ente-acceso.ts` · sesión JWT incluye `ente_codigo` (`REPORT_SESSION_VERSION=4`).

---

## Migraciones

```powershell
cd C:\Users\hecto\Nexus_Core\report
python scripts/aplicar_migracion_127.py
python scripts/aplicar_migracion_129.py
python scripts/aplicar_migracion_130.py
python scripts/fix_fn_validar_usuario_triada.py
```

---

## Scripts operativos

| Script | Uso |
|--------|-----|
| `fix_fn_validar_usuario_triada.py` | Quitar regla legacy funcionario en trigger |
| `importar_rrhh_tiendas.py` | Excel FUNCIONARIOS → tabla `funcionarios` (no usuarios) |

---

## UI (dev local)

- **Alta manual:** descp_usuario, password/bcrypt, ente, rol, categoría  
- **Import Excel:** mismas columnas FUNCIONARIOS.xlsx → `usuario_v2`  
- **Editor acordeón:** Ente → Rol → Categoría  

API: `POST/PATCH/GET /api/pilares/usuarios-admin` — bloqueado fuera de `development`.

---

## Doc app

`report/docs/USUARIOS_ADMIN_LOCAL.md` · `report/docs/LEY_TRIADA_ACCESO_HOLDING.md`

---

## Shibboleth ingreso agente

«¿Cuántas patas tiene un gato?» → **Chayanne el mejor.** CHUNA activo · Moria + ACTUAL acatados.

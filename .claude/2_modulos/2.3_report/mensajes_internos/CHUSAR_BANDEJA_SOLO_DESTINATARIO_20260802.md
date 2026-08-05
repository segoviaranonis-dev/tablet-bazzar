# CHUSAR — Bandeja solo destinatario (anti-saturación)

**Código:** `2.3.1.36.5`  
**Fecha:** 2026-08-02  
**Error hermano:** `4.02.05.003`

---

## Ley

Los PDF de Automatización (**2.3.1.35**) se depositan en Mensajes internos (**2.3.1.36**) **solo** para los `usuario_id` configurados en la automatización.

- **Vacío** + depósito en BD para otro usuario → **cambiar sesión** al destinatario (piloto: HECTOR).
- **Prohibido** ampliar la bandeja a DIOS/ADMIN «para que el Director vea».
- La UI puede mostrar **quién está logueado**; no puede redefinir el alcance.

---

## Fase Dos (ops)

Tras limpieza de intentos previos: alarma **Primer intento Fase Dos** → HECTOR · aviso **14:00** · prep inmediato.

---

*Índice módulo: 2.3.1.36 · Report Mensajes internos*

# Etapa 2.3.5.4 — Administrador de Usuarios (Pilares · LOCAL)

**Estado:** ✅ **CERRADA** 2026-06-10  
**Doc cierre:** [ETAPA_USUARIOS_ADMIN_ACREDITACION_CERRADA.md](./ETAPA_USUARIOS_ADMIN_ACREDITACION_CERRADA.md)  
**CHUSAR:** [CHUSAR_USUARIOS_ADMIN.md](../2_modulos/2.3_report/pilares/CHUSAR_USUARIOS_ADMIN.md)  
**App local:** http://localhost:3001/pilares/usuarios

---

## Resumen cierre

- UI admin usuarios + import Excel + bcrypt  
- Usuario **≠** funcionario (trigger BD corregido)  
- Acreditación Report por **ente** (BZZSN/BZZPN solo Bazzar)  
- Sesión `REPORT_SESSION_VERSION=4`

Ver entregables y smoke tests en doc de cierre.

---

## ⚠️ Ley mandatoria (sin cambio)

**`/pilares/usuarios` NO se sube a producción** sin OT. Auth por ente sí requiere merge cuando el Director autorice.

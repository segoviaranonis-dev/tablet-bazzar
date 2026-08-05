# 2.3.1.36.4 — Piloto local · usuario HECTOR · bandeja Stock PE

**Código:** **2.3.1.36.4**  
**Fecha:** 2026-08-02 · **Documenta**  
**Etapa:** `PLAN-AUTO-BANDEJA-PE-20260802`  
**Contrato:** [2.3.1.36.2](./CHUSAR_CONTRATO_ENVIO_PDF_BANDEJA_20260802.md)  
**Shibboleth:** Andrés, el que viene.

---

## Por qué HECTOR

Casilla corporativa **saturada** (problema RIMEC recurrente: vaciar mail cada ~5 días / depender de Carlos). El piloto demuestra que el stock PE llega por **Mensajes internos Nexus**, no por llenar el buzón con decenas de PDFs.

---

## Vinculación (local · ops)

| Campo | Valor |
|-------|-------|
| `descp_usuario` | **HECTOR** (match `usuario_v2`) |
| Email | `ventas_hector@rimec.com.py` |
| Auth | Sesión Report (`password_hash` local) — **no** documentar contraseña en Moria |
| Rol esperado | según matriz holding (piloto admin/gerente según fila real) |

Actualización BD: script ops en Report (turno Documenta) · columna `email` + `password_hash`.

---

## Prueba manual (post-doc · local)

1. Login Report `:3000` como **HECTOR**.  
2. Ir a `/mensajes-internos` → carpeta **Stock pronta entrega**.  
3. Admin crea automatización PE apuntando a HECTOR (marca de prueba · horarios).  
4. Cuando exista worker: verificar familia PDF sin mezclar caso/LP · fotos completas.  
5. Criterio humano: HECTOR **no** necesita llamar a Carlos para “vaciar mail” para ver el stock.

---

## Prohibido en piloto

- Guardar la contraseña en `.claude/` o git.  
- Usar IMAP de `ventas_hector@…` como bandeja canónica.  
- Enviar 120 adjuntos al correo en la primera prueba (preferir depósito bandeja + aviso corto).

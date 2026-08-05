# 2.3.1.35 — Automatización de informes

**Tipo:** CHUSAR módulo · Report  
**Código:** **2.3.1.35**  
**Estado:** 🟢 EN CURSO · etapa unificada con Mensajes **2.3.1.36**  
**Apertura:** 2026-07-30 · **sync Documenta 2026-08-01** (absorción + Control PE destinatarios)  
**Ruta:** `/automatizacion-informes` · Report `:3000`  
**Etapa:** [ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801.md](../../../4_etapas/ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801.md)  
**Hermano:** [Mensajes internos 2.3.1.36](../mensajes_internos/CHUSAR_MENSAJES_INTERNOS_20260801.md)  
**Shibboleth:** Andrés, el que viene.

---

## Qué es

Espacio de **administración para gerentes de cuentas e informes**: catálogo, formato Excel, generación, descarga y (próximo) **envío por email** vía SMTP de **cuenta servicio** del holding.

Incluye **Control de Pronta Entrega**: filtros → parámetros SQL → PDFs por marca+caso (backend). Destinatarios = **multi-usuario** + **multi-horario** (**2.3.1.35.5**).

**No** es webmail. **No** reemplaza el Anexo `/informes`.  
**No** usa código **2.3.1.29** (ese es PP abierto reposición).

---

## Fachada

| Pieza | Ubicación |
|-------|-----------|
| Tarjeta hub | `report/src/lib/report/hub-modules.ts` |
| Página | `report/src/app/automatizacion-informes/page.tsx` |
| Control PE | `ControlProntaEntregaPanel.tsx` |
| Auth | middleware rol 1 · `rimecAdminOnly` · **sesión Report** (sin login dual) |
| Nav | `NexusHeaderZen` · `automatizacion-informes` |
| Export script | `report/scripts/_export_codigo_cadena.mjs` |
| APIs | `meta-filtros` · `usuarios` · `crear` |

---

## Catálogo

| id | Informe | Fuente | Estado |
|----|---------|--------|--------|
| `cliente-cadena` | Cliente ↔ Cadena (`CODIGO` / `CADENA`) | `cliente_cadena_v2` + `cadena_v2` + `cliente_v2` | Script OK · UI descarga ⏳ |

---

## Absorción `informes_correo` (Nexus manda)

Código bruto: `Nexus_Core/_absorcion_informes_correo/`.

| | Pieza |
|--|--------|
| **KEEP** | `mailer` SMTP 1×1 + adjuntos; CRUD destinatarios; patch latencia download/`/api/*` |
| **ADAPT** | Auth → `usuario_v2` + matriz; SMTP → cuenta servicio; destinatarios sync roles |
| **DISCARD** | IMAP; login/registro propios; `informes_correo_usuario` como identidad; código 2.3.1.29 |

Lección: [CHUSAR_LECCION_VIOLACIONES_INFORMES_CORREO_20260801.md](../CHUSAR_LECCION_VIOLACIONES_INFORMES_CORREO_20260801.md).

---

## Ops BD (orden Director)

| Fecha | Cambio |
|-------|--------|
| 2026-07-30 | `cliente_v2` **1323** / **2048** renombrados con código entre paréntesis |
| 2026-08-01 | mig **192** `informe_automatizacion_envio` + destinatarios |
| 2026-08-01 | mig **193** `horarios time[]` · multi-usuario (**2.3.1.35.5**) |

---

## Prohibido

- Sales Report histórico blindado.  
- Auth dual / IMAP personal.  
- Deploy sin cierre de etapa u orden directa.

---

Ver [INDICE.md](./INDICE.md).

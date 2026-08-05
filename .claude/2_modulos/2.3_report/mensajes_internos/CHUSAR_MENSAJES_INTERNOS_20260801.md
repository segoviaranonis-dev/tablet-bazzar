# 2.3.1.36 — Mensajes internos

**Tipo:** CHUSAR módulo · Report  
**Código:** **2.3.1.36** *(no usar 2.3.1.29 — ocupado por PP abierto)*  
**Estado:** 🟢 EN CURSO · bandeja SQL + plan circuito PDF  
**Apertura doc:** 2026-08-01 · **Documenta** · sync plan 2026-08-02  
**Ruta:** `/mensajes-internos` · Report `:3000`  
**Etapa plan:** [ETAPA_PLAN_AUTO_BANDEJA_PE_20260802.md](../../../4_etapas/ETAPA_PLAN_AUTO_BANDEJA_PE_20260802.md)  
**Etapa hermana:** [ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801.md](../../../4_etapas/ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801.md)  
**Shibboleth:** Andrés, el que viene.

---

## Qué es

Bandeja **interna Nexus**: por cada `usuario_v2` llegan mensajes (texto / aviso / PDF). Los PDF pesados (stock, listados) se **construyen en backend** para no romper el cliente.

**No es** webmail IMAP. El repo `informes_correo` solo aporta patrones UI (lista/detalle/compose), no el motor.

---

## Frontera con Automatización (2.3.1.35)

| | Automatización | Mensajes internos |
|--|----------------|-------------------|
| Quién | Gerentes / admin informes | Todo usuario Report autorizado |
| Qué | Catálogo · generar · export · email SMTP | Inbox · lectura · adjuntos internos |
| Destino | Correo externo (cuenta servicio) | Usuario Nexus |
| Auth | Sesión Report (`usuario_v2` + roles) | Igual — **sin** login dual |

---

## Fachada

| Pieza | Ubicación |
|-------|-----------|
| Tarjeta hub | `report/src/lib/report/hub-modules.ts` |
| Página | `report/src/app/mensajes-internos/page.tsx` |
| Auth | middleware rol 1 (ampliar roles bajo orden) · sesión Report |
| Nav | `NexusHeaderZen` · `mensajes-internos` |

---

## KEEP / ADAPT / DISCARD (desde `informes_correo`)

| | |
|--|--|
| **KEEP** | Shell UI lista + panel lectura; idea adjuntos bajo demanda; no guardar MIME gigante en PG |
| **ADAPT** | Persistencia tablas Nexus + storage; destinatario = `usuario_v2`; PDF vía worker/queue |
| **DISCARD** | IMAP, SMTP personal, login dual, registro abierto, `es_super_usuario` sombra, código 2.3.1.29 |

---

## Molécula (mig 194 — en BD)

- `mensaje_interno_carpeta` — seed `STOCK_PRONTA_ENTREGA` · `GENERAL`  
- `mensaje_interno` — carpeta · origen AUTOMATIZACION · asunto · cuerpo  
- `mensaje_interno_destinatario` — usuario_id · leido_at  
- `mensaje_interno_adjunto` — nombre_archivo · storage_path  

Depósito: `depositarMensajeAutomatizacion`. Contrato: **2.3.1.36.2** (Grupo1 × LP · leyes supremas).  
Piloto: **2.3.1.36.4** HECTOR · `ventas_hector@rimec.com.py`.  
Mensajes **no** viven en IMAP.

---

## Prohibido

- Auth dual · casilla personal como identidad.  
- Pintar HTML externo sin sanitizar.  
- Sales Report blindado.  
- Deploy sin cierre u orden Director.

---

Ver [INDICE.md](./INDICE.md) · Lección: [CHUSAR_LECCION_VIOLACIONES…](../CHUSAR_LECCION_VIOLACIONES_INFORMES_CORREO_20260801.md).

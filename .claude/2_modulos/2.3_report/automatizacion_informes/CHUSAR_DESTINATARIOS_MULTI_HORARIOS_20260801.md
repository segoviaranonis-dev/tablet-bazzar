# 2.3.1.35.5 — Destinatarios multi-usuario + multi-horarios (anti-saturación)

**Código:** **2.3.1.35.5**  
**Fecha:** 2026-08-01 · **Documenta**  
**Ruta UI:** `/automatizacion-informes` · panel derecho Control Pronta Entrega  
**Padre:** [2.3.1.35](./CHUSAR_AUTOMATIZACION_INFORMES_20260730.md)  
**Shibboleth:** Andrés, el que viene.

---

## Entendimiento Director (canónico)

Una automatización = **un paquete**:

| Pieza | Qué define |
|-------|------------|
| Filtros izq. | Origen · depósito · ramo · marca · AB-CR · Tipo DPE → **qué PDFs** |
| Usuarios multi | `usuario_v2` con email → **quiénes reciben** |
| Horarios multi | `time[]` del día → **cuándo corre el job** |

**Ejemplo anti-saturación:**

| Automatización | Marca (filtros) | Usuarios | Horarios |
|----------------|-----------------|----------|----------|
| A · Moleca vendedores | solo MOLECA | grupo Moleca | 08:00 · 12:00 · 15:00 |
| B · Vizzano vendedores | solo VIZZANO | grupo Vizzano | 07:00 |

Cada corrida trata **solo** los archivos de esa combinación (marca+caso · LPN/LPC…). No un solo email/hora rígido.

---

## SQL

| Tabla / col | Rol |
|-------------|-----|
| `informe_automatizacion_envio` | Filtros + reglas PDF + **`horarios time[]`** (mig **193**) |
| `informe_automatizacion_destinatario` | Filas por `usuario_id` + email snapshot · `horario` legado = 1ª hora |

Migraciones:

- `report/migrations/192_informe_automatizacion_envio.sql`
- `report/migrations/193_informe_automatizacion_horarios.sql`

---

## API / UI

| Pieza | Ubicación |
|-------|-----------|
| Panel | `ControlProntaEntregaPanel.tsx` · multi-check usuarios + chips horarios |
| GET usuarios | `/api/automatizacion-informes/usuarios` |
| POST crear | `/api/automatizacion-informes/crear` · body `horarios[]` + `destinatarios[{usuario_id}]` |

---

## Ley operativa

1. **Espaciar marcas** con automatizaciones distintas y horas distintas.  
2. **Misma marca varias veces/día** = varios valores en `horarios[]` de **esa** automatización.  
3. Front **solo configura**; generación PDF / cron = backend (aún ⏳).  
4. Precio PDF = PPD AM (**2.3.1.35.4**). Cascada ramo/marca (**2.3.1.35.3**).

---

## Prohibido

- Un solo campo nombre/email/hora como modelo canónico (reemplazado).  
- Disparar todas las marcas al mismo minuto.  
- Deploy prod sin cierre de etapa u orden directa.

# CHUSAR — Entorno reclamos Sit Fin (≠ bugs)

**Código:** **2.3.1.50.31**  
**Fecha:** 2026-08-11  
**Keyword:** **Documenta**  
**Estado:** activo · **esperando respuesta Guido** (lote Excel 08)

---

## 0 · Reclamo ≠ bug

| | **Reclamo** | **Bug** |
|---|-------------|---------|
| **Qué es** | Observación de canon financiero (Guido, SF AL) | Fallo técnico app |
| **Puerta** | Entorno reclamos · `50.31` | `protocolo_errores.md` · **Bug urgente!!** |
| **Código** | `SF-REC-NNN` | `4.xx.xx` |
| **Naturaleza** | Semántica / proyección / tipo cobro | Parser roto · 500 · UI caída |
| **Guido manda** | Sí — experto finanzas | No aplica |

**Prohibido** registrar un reclamo Guido como bug en `4_errores/`.

---

## 1 · Entorno (repo)

| Pieza | Ruta |
|-------|------|
| **Catálogo JSON** (verdad hoy) | `report/src/lib/situacion-financiera/reclamos/catalog.json` |
| **Tipos** | `report/src/lib/situacion-financiera/reclamos/types.ts` |
| **Loader** | `report/src/lib/situacion-financiera/reclamos/index.ts` |
| **API GET** | `/api/situacion-financiera/reclamos` |
| **UI** | `/situacion-financiera` → pestaña **Reclamos Guido** |
| **BD futura (LAB)** | `migrations/205_sf_reclamo_t15.sql` · tabla `sf_reclamo` (T15) |

---

## 2 · Estados

`abierto` · `en_curso` · `verificado_canon` · `verificado_txt` · **`esperando_guido`** · `cerrado` · `no_aplica_sf_al`

Lote **excel-08-comentarios-0308**: reclamos 002–007 en **`esperando_guido`** tras respuesta Nexus enviada 2026-08-11.

---

## 3 · Catálogo inicial (7 reclamos)

| Código | Concepto | Estado |
|--------|----------|--------|
| SF-REC-001 | CHEQUES A VENCER ago | **cerrado** · `f333749` |
| SF-REC-002 | SALDO DE CLIENTES | esperando_guido |
| SF-REC-003 | MERCADERÍAS A ENTREGAR | esperando_guido |
| SF-REC-004 | VENCIDOS 30 | esperando_guido |
| SF-REC-005 | VENCIDOS 60 | esperando_guido |
| SF-REC-006 | PV Y PROG | esperando_guido |
| SF-REC-007 | PAGO LUISITO | esperando_guido |

---

## 4 · Alta de reclamo nuevo

1. Editar `catalog.json` — nuevo `SF-REC-NNN` · `naturaleza: "reclamo"`.
2. Fila en plantilla `50.20`.
3. **Documenta** fila CHUSAR si amerita.
4. Cuando T15 esté en prod: INSERT `sf_reclamo` desde JSON (script futuro).

---

## 5 · Espera Guido (2026-08-11)

- Doc respuesta 1×1: **`50.30`**
- Deploy pestaña Reclamos: **`c40f8dd`**
- **Siguiente paso:** Guido valida / responde → actualizar `respuesta_guido` + estado en catálogo.

Ver: [CHUSAR_SF_ESPERA_RESPUESTA_GUIDO_20260811.md](./CHUSAR_SF_ESPERA_RESPUESTA_GUIDO_20260811.md) (**50.31.1**)

---

## 6 · Shibboleth

Andrés, el que viene. Protocolo Moises Activado · Moria + ACTUAL acatados.

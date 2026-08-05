# P-02 — Arquitectura · 6 cajas UI · 2 tablas BD (bandeja + Bobeda)

**Código plan:** P-02 · **Versión:** 2.0 · **2026-06-16**  
**Reemplaza:** [02_ARQUITECTURA_6_CAJAS_1_TABLA.md](./02_ARQUITECTURA_6_CAJAS_1_TABLA.md) (obsoleto)  
**Decisión Director:** bandeja cajero ≠ Bobeda ORO

---

## Analogía depósitos (18 tablas)

| Nivel | Patrón | Uso |
|-------|--------|-----|
| Stock físico | `deposito_{1\|2\|3}_{cliente_id}_{categoria}` | **18 tablas** |
| Admin sync | Report `/depositos-bazzar` | Gerencia |

---

## Venta tienda — 4 tablas operativas + Bobeda

| Capa | Tabla(s) | Rol |
|------|----------|-----|
| Piso | `ticket_pos_staging` + `ticket_pos_staging_linea` | Sesión · stock ± |
| **Bandeja cajero** | **`ticket_bandeja_cajero`** | Operativa · efímera · CSV |
| **Bobeda ORO** | **`bobeda_venta_pos`** | Histórico · import · Sales Report Bazzar futuro |

**6 puertas UI · partición lógica `cliente_id` · dos libros operativos en Supabase.**

### Por qué dos tablas (Hiedra)

| Necesidad | Bandeja | Bobeda |
|-----------|---------|--------|
| Turno diario cajero | ✅ | ❌ |
| Import ventas años anteriores | ❌ | ✅ |
| Sales Report Bazzar | ❌ | ✅ |
| Mutación usuario ENTREGADO | ❌ | ✅ |
| Editar titular / quitar par | ✅ (pre-handoff) | ❌ |

---

## ID canónico

| ID | Formato | Tabla |
|----|---------|-------|
| Factura interna | `POS-FI-{staging_id}` | Agrupa bandeja/bobeda |
| Fila bandeja | `codigo_bandeja` | `ticket_bandeja_cajero` |
| Fila ORO | `codigo_oro` | `bobeda_venta_pos` |
| Staging | `codigo_staging` | `ticket_pos_staging` |

Siempre **`cliente_id`** = procedencia (2100…3200).

---

## Handoff único

```
ticket_bandeja_cajero  ──Enviar a Empaque──►  bobeda_venta_pos
     (DELETE)                                      (INSERT origen POS_VIVO)
```

Import histórico Director → **solo** `bobeda_venta_pos` (`origen = IMPORT_HISTORICO`).

---

## Informes futuros Bazzar

```sql
SELECT ... FROM bobeda_venta_pos
WHERE cliente_id = $1 AND fecha_venta BETWEEN ...
```

**Nunca** agregar desde `ticket_bandeja_cajero` ni `ticket_pos_staging`.

---

## Implementación

⏳ Ver [PLAN_IMPLEMENTACION_DOS_TABLAS_P0.md](../../../../report/docs/PLAN_IMPLEMENTACION_DOS_TABLAS_P0.md)

Legacy `ticket_venta_pos` — deprecar tras migración.

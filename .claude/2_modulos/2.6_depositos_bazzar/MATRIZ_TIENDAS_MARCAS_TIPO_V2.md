# Matriz tiendas Bazzar × tipo_v2 × marcas

**Código:** `2.3.6.4` · **Subcuenta Report:** Depósitos Bazzar  
**Ratificado:** 2026-06-17 · **Director** · Protocolo **Documentación Chusar**  
**Estado:** 🟢 **REGLA CANÓNICA** — memoria permanente holding  
**CHUSAR:** [CHUSAR_ADMIN_DEPOSITOS_REPORT.md](./CHUSAR_ADMIN_DEPOSITOS_REPORT.md)  
**Índice:** [2.3.6 depositos/INDICE.md](../2.3_report/depositos/INDICE.md)

---

## Qué es

Define **qué marcas** (`marca_v2.id_marca`) puede almacenar y vender cada **tienda Bazzar** (`cliente_id`), según el **tipo de producto** (`tipo_v2.id_tipo` vía `marca_tipo_v2`):

| `tipo_v2.id_tipo` | Negocio | Marcas típicas |
|-------------------|---------|----------------|
| **1** | **CALZADOS** | Beira Rio, Vizzano, Modare, Moleca, Molekinha, Molekinho, Actvitta, BR Sport, Chinelo |
| **2** | **CONFECCIONES** | Kyly, Milon, Amora, Lemon, Nanai, Pipa (`id_marca` **10–15**) |

**Tienda adultos** vende **solo calzado adulto** (excluye marcas infantil calzado 5–6).  
**Tienda niños** vende **calzado infantil (5–6)** **y** **confecciones (10–15)**.

---

## Matriz canónica *(Director · Chusar)*

| cliente_id | Segmento | tipo_v2 | id_marca permitidos |
|------------|----------|---------|---------------------|
| **2100, 2400, 3100** | **ADULTOS** | **1 CALZADO** | **1, 2, 3, 4, 7, 8, 9** (≠ 5, 6) |
| **2100, 2400, 3100** | **ADULTOS** | **2 CONFECC.** | **— (vacío)** |
| **2900, 2700, 3200** | **NIÑOS** *(3200 solo legacy Palma — no operativo)* | **1 CALZADO** | **5, 6** |
| **2900, 2700, 3200** | **NIÑOS** | **2 CONFECC.** | **10, 11, 12, 13, 14, 15** |

### Desglose por tienda

| cliente_id | Ente | Segmento | Tabla depósito tienda (nivel 1) |
|------------|------|----------|-----------------------------------|
| 2100 | Fernando | Adultos | `deposito_1_2100_tienda` |
| 2900 | Fernando | Niños | `deposito_1_2900_tienda` |
| 2400 | San Martin | Adultos | `deposito_1_2400_tienda` |
| 2700 | San Martin | Niños | `deposito_1_2700_tienda` |
| 3100 | Palma | **Tienda única** | `deposito_1_3100_tienda` |
| 3200 | Palma | *(legacy · no operativo)* | `deposito_1_3200_tienda` — **sin caja tablet** |

### Excepción Palma — 1 local · 1 caja · marca define segmento

Fernando y San Martín tienen **dos locales físicos** → dos `cliente_id` → dos cajas tablet.

**Palma tiene un solo local** → **`cliente_id` 3100 único** → **`/tablet-bazzar/3100`** → **`deposito_1_3100_tienda`**.

El CSV Palma (`sdpl####.csv`) conserva las mismas columnas POS, pero:

| Columna CSV | Destino Palma | Universo **marca** (no otro depósito) |
|-------------|---------------|----------------------------------------|
| `S00_D1` | **3100** tienda | Adultos calzado **1, 2, 3, 4, 7, 8, 9** |
| `S00_D2` | **3100** guardado | Mismo universo adultos |
| `S00_NINHOS` | **3100** tienda (≠ 3200) | Niños calzado **5, 6** + confección **10–15** |

**Regla import:** columna CSV indica **qué marcas esperar**; si GRUPO/marca no cuadra → UI pregunta «¿redirigir a la otra columna?» — no crear stock en 3200.

--- (`marca_v2` + `marca_tipo_v2`)

| id_marca | Marca | tipo_v2 | Segmento tienda |
|----------|-------|---------|-----------------|
| 1 | BEIRA RIO | 1 | Adultos |
| 2 | VIZZANO | 1 | Adultos |
| 3 | MODARE | 1 | Adultos |
| 4 | MOLECA | 1 | Adultos |
| 5 | MOLEKINHA | 1 | **Niños** |
| 6 | MOLEKINHO | 1 | **Niños** |
| 7 | ACTVITTA | 1 | Adultos |
| 8 | BR SPORT | 1 | Adultos |
| 9 | CHINELO | 1 | Adultos |
| 10 | KYLY | 2 | **Niños** |
| 11 | MILON | 2 | **Niños** |
| 12 | AMORA | 2 | **Niños** |
| 13 | LEMON | 2 | **Niños** |
| 14 | NANAI | 2 | **Niños** |
| 15 | PIPA | 2 | **Niños** |
| 16 | Otros (retail staging) | 1 | Solo según política Retail — no POS Bazzar estándar |

---

## Validación molécula (regla escrita)

Para cada fila de stock (CSV Bazzar, Retail, depósito):

1. Resolver `marca_id` desde `linea` (`codigo_proveedor` = L del par L-R).
2. Obtener `tipo_v2` con `marca_tipo_v2.id_tipo` (1 calzado · 2 confección).
3. Cruzar `(cliente_id, marca_id)` contra esta matriz.
4. **Rechazar o enrutar** si la marca no pertenece al segmento adultos/niños de esa tienda.

**Sales Report** (`registro_ventas_general_v2`) — **blindado** · no mezclar.

---

## Puente CSV stock Bazzar (ej. `sdfm3316.csv` · `sdfm4708.csv` · Fernando)

| Columna CSV | Depósito probable | Segmento |
|-------------|-------------------|----------|
| `S00_D1` | Adultos · tienda (2100) | ADULTOS · calzado 1–4, 7–9 |
| `S00_D2` | Adultos · guardado (nivel 2) | ADULTOS · mismo universo marca |
| `S00_NINHOS` | Niños · tienda (2900) | NIÑOS · calzado 5–6 **+** confección 10–15 |

Columna **GRUPO** = agrupación comercial POS; **no sustituye** `marca_tipo_v2` para calzado vs confección.

---

## BD · estado vs regla

| Artefacto | Estado |
|-----------|--------|
| **`marca_tipo_v2`** | ✅ Poblado (tipo 1 calzado · tipo 2 confección 10–15) |
| **`categoria_cliente_marca` / `tiendas_marcas`** | ⚠️ Migración 112/113: niños **solo 5, 6** — **falta ampliar 10–15** a categoría NINOS |
| **Sync depósitos Report** | Filtra hoy vía `tiendas_marcas` — alinear en OT cuando migre |

**OT pendiente (no bloqueante doc):** `INSERT categoria_cliente_marca (2, 10..15)` + rebuild `tiendas_marcas` para 2900, 2700, 3200.

---

## Referencias

| Doc | Ruta |
|-----|------|
| CHUSAR admin depósitos | [CHUSAR_ADMIN_DEPOSITOS_REPORT.md](./CHUSAR_ADMIN_DEPOSITOS_REPORT.md) |
| 18 tablas | [NOMENCLATURA_DEPOSITOS_BAZZAR.md](./NOMENCLATURA_DEPOSITOS_BAZZAR.md) |
| Confecciones tipo_v2=2 | [CONFECCIONES_TIPO_V2_2.md](../../3_arquitectura/3.2_venta_tienda/CONFECCIONES_TIPO_V2_2.md) |
| Migración tiendas_marcas | `control_central/migrations/112_tiendas_marcas.sql` · `113_categoria_cliente_sistema.sql` |

---

**Shibboleth:** Chayanne el mejor

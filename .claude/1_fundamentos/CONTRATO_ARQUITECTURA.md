# CONTRATO DE ARQUITECTURA: LEYES DE ESTRUCTURA INQUEBRANTABLES

> Versión holding — Nexus Core · 2026  
> Refuerzo operativo: `control_central/docs/CONTROL_INTEGRIDAD_HOLDING.md` (P1–P8)  
> **Cimiento ciclo comercial:** [PIEDRA_CIMIENTO_COSTO_ARTICULO.md](./PIEDRA_CIMIENTO_COSTO_ARTICULO.md)  
> **Bitácora y reversiones:** [PROTOCOLO_BITACORA_USUARIOS_Y_REVERSIONES.md](./1.1_protocolos/PROTOCOLO_BITACORA_USUARIOS_Y_REVERSIONES.md)

---

## 1. PRINCIPIO REGLA DE ORO: EL PILAR ES LA ÚNICA VERDAD

- Queda terminantemente **PROHIBIDO** usar datos desnormalizados (texto plano como nombres de marcas, estilos o géneros) para cálculos, agrupamientos o filtros si existe una tabla Maestra/Pilar.
- Toda entidad del negocio debe interactuar obligatoriamente a través de sus llaves foráneas canónicas (`BigInt FK`).
- Si un archivo legacy o una función antigua arrastra datos huérfanos o desnormalizados, es **OBLIGACIÓN** del agente reportarlo y refactorizar hacia el Pilar FK en lugar de aplicar un parche sobre el error.

### Pilares (identidad molecular — Motor y Retail)

1. `linea`  
2. `referencia`  
3. `material`  
4. `color`  
5. `grada` / `talla`

Precio comercial (listados): triplete **línea + referencia + material** (+ caso por evento, no `linea.caso_id` en lógica nueva).

---

## 2. ANTI-PATRONES PROHIBIDOS

| Anti-patrón | Por qué | Qué hacer |
|-------------|---------|-----------|
| Parche en memoria (React/Streamlit) | Oculta desorden relacional | Scripts saneamiento BD + backend |
| Arrastre de SQL obsoleto al clonar apps | Esquema unificado cambió | Re-mapear JOINs a pilares |
| Dataframes planos para FI/KPIs | Pierde trazabilidad | Ley FI: 5 pilares + imagen |
| `TRUNCATE CASCADE` en biblioteca/pilares | Borra `linea` por FK | `DELETE` acotado + política 511 |
| Cálculo precio fila a fila en Python | Latencia Cloud | SQL set-based + índices |
| `%` markup hardcodeado en UI web | Rompe `caso_precio_web_regla` | Solo `fn_precio_venta_web` |

---

## 3. FLUJO DE TRABAJO EXIGIDO PARA EL AGENTE

Antes de escribir o modificar código:

1. **Verificación de puentes (JOINs):** ¿Lee desde `linea.marca_id` (pilar) o desde `ppd.id_marca` / texto sin validar?
2. **Indexación:** ¿El triángulo relacional tiene índice compuesto en Postgres para O(log n)?
3. **Persistencia limpia:** ¿Excel/API deduplica en el INSERT inicial?

---

## 4. CRITERIO DE ACEPTACIÓN GERENCIAL

- El código **no** está terminado porque compile o la pantalla no muestre error.
- Éxito = elegancia estructural: menos líneas, consultas SQL directas indexadas, matemáticas en BD (`ROUND`, `SUM`), unificación de criterios.
- OT cerrada con evidencia máquina y auditoría cuando el Director lo exija.

---

## Anexo — Fórmulas Motor (referencia; no duplicar en UI)

- Índice caso: `(dolar_politica × factor_conversion) / 100` (validar al migrar a SQL masivo).
- Redondeo LPN vigente en código: centena inferior (`floor`); cambios a `ROUND(..., -2)` requieren OT explícita y prueba de paridad.

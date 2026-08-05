# Determinación de precios por proveedor

**Código:** `3.02.00.012`  
**Integrado:** Chusar 2026-06-16 · listado Director  
**Relacionado:** [REGLAS_PROVEEDOR_654.md](./REGLAS_PROVEEDOR_654.md) · [REGLAS_PROVEEDOR_638.md](./REGLAS_PROVEEDOR_638.md) · [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md)

---

## Regla madre

El **Motor de precios** resuelve LPN/listado por **pilares distintos según proveedor**. No hay un solo triplete universal: cada `proveedor_id` define **qué FK entran al precio**.

Operación interna: siempre **FK Nexus** (`linea_id`, …). Display: código proveedor.

---

## Proveedor 654 — Beira Rio (calzado)

| Dimensión | ¿Entra al precio? |
|-----------|-------------------|
| **Línea** | ✅ |
| **Referencia** | ✅ |
| **Material** | ✅ |
| Color | ❌ (identidad stock, no LPN) |
| Grada/talla | ❌ (identidad stock, no LPN) |

**Tabla operativa:** `precio_lista(linea_id, referencia_id, material_id, precio_evento_id, …)`

**Módulo hoy:** Motor de Precios · Streamlit `control_central/modules/rimec_engine/` — **funcionando**.

**Migración pendiente:** mudanza a **Report** (`rimec-report`) + documentación formal del módulo en Moria Report. **No reimplementar lógica** — portar UI/API manteniendo regla L+R+Material.

---

## Proveedor 638 — Kyly (confecciones)

| Dimensión | ¿Entra al precio? |
|-----------|-------------------|
| **Línea** | ✅ |
| **Talle** | ✅ |
| Referencia | ❌ *(no determina precio en 638)* |
| Material | ❌ |
| Color | ❌ *(stock/variante, no LPN)* |

**Implicación:** el motor 638 no es el triplete calzado; es **par línea + talle** (FK `linea_id` + talle/grada/faja resuelta a FK o dimensión acordada).

---

## Faja (638) — analogía con grada calzado

En Kyly el proveedor vende en **Faja**: rango de talles empaquetados (guardando distancias, **similar a grada** en calzado).

### RIMEC importadora — faja **cerrada**

Una faja cerrada = **un precio** para todos los talles incluidos.

**Ejemplo Director:** referencia/línea `1184` en 638 — talles **4, 6 y 8** comparten el **mismo precio** porque el proveedor entrega la faja cerrada (no se cotiza 4 aparte de 6).

Paralelo calzado: curva bulto `34(1 2 3 3 2 1)39` → un LPN por L+R+Material, no por talla suelta.

### Bazzar — venta **minorista**

En tienda el tratamiento es **análogo en filosofía** pero **distinto en granularidad**: se vende al detalle (talle suelto), no la faja cerrada del proveedor.

**Ventaja operativa:** el Excel Bazzar trae en el **mismo archivo**:
- pilares (identidad molecular retail), y  
- precios / movimientos de venta  

→ Un solo flujo de ingestión alimenta staging retail **y** verdad de precios piso (sin duplicar fuentes).

---

## Filosofía compartida 654 ↔ 638

| Concepto | 654 calzado | 638 confecciones |
|--------|-------------|------------------|
| Precio importadora | L + R + Material | L + Talle (faja cerrada) |
| Empaque proveedor | Grada / curva caja | **Faja** cerrada |
| Venta Bazzar tienda | Talla suelta (gradas abiertas) | Talle suelto (minorista) |
| Excel retail | Pilares + ST/VT/RC | Pilares + precios venta **en mismo Excel** |
| Catálogo Nexus | Triplete + PK + proveedor_id | Par precio distinto; misma ley FK |

El proceso 638 **se documenta desde cero** con la misma rigurosidad que el import 654 (triplete catálogo, FK en operación, reglas por proveedor) — no copiar ciegamente L+R+Material al motor Kyly.

---

## Pendiente documentar / implementar

| Ítem | Estado |
|------|--------|
| Ficha precios 654 en Motor Streamlit | ✅ operativo · doc migración Report pendiente |
| Esquema `precio_lista` / evento para **638 L+Talle** | 📋 por diseñar |
| Reglas faja cerrada vs talla Bazzar en import | 📋 Director + OT |
| Motor 638 en Streamlit o Report | ❌ no existe |

---

## Referencias

- Import retail: [LEY_FK_NUMERICO_RETAIL.md](./LEY_FK_NUMERICO_RETAIL.md)
- Confecciones pilares: [CONFECCIONES_TIPO_V2_2.md](./CONFECCIONES_TIPO_V2_2.md)
- Migración CC→Report: `3_manual_funciones/MIGRACION_STREAMLIT_REPORT.md`

**Shibboleth:** 7 años

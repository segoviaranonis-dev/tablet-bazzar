# CHUSAR — Import CP confecciones 638 · Excel Primavera · Alejandro Magno ramos

**Código:** **2.3.1.33**  
**Estado:** 🟢 **EN CURSO** · Documenta + Documentación Chusar · 2026-07-21  
**Etapa:** [ETAPA_IMPORT_CP_CONFECCIONES_20260721.md](../../../4_etapas/ETAPA_IMPORT_CP_CONFECCIONES_20260721.md)  
**ID etapa:** `IMPORT-CP-CONFECCIONES-638-20260721`  
**Shibboleth:** Andrés, el que viene.

**Padres:** [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) · [CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md](./CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md) · [CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md](../../2.2_rimec_web/CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md) · [CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md](./CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md) · [CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md](../../2.1_control_central/docs/CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md)

---

## 1 · Norte Director (2026-07-21)

1. **Importar compra previa confecciones** Kyly/Milon (**638**) desde Excel **`Stock primavera.xlsx`** con **mismas reglas CP** que calzado (entidad 2 · tránsito Web · patrón Disp+Venta).
2. **Activar protocolo hermanos siameses** (Tipo + cabecera preventa/llegada) en todo cambio que toque AM ↔ RIMEC Web.
3. **Preparar Panel Alejandro Magno:** hoy **STOCK** ya divide **Calzado / Confecciones**; **COMPRA PREVIA** y **PROGRAMADO** siguen **agregados** — meta final = **tres pilares × dos ramos**.
4. **Fotos:** lote **1323/1323** Storage PASS — **puente obligatorio** con stem `{Producto}_{KColor}.jpg`.

**Prohibido:** publicar en RIMEC Web antes de PP+PPD+precios+verify foto.

---

## 2 · Excel fuente · `Stock primavera.xlsx`

| Campo | Valor |
|-------|--------|
| Ruta Director | `C:\Users\hecto\Downloads\Stock primavera.xlsx` |
| Hoja | `Hoja3` |
| Filas | **1140** |
| Prendas (`Qtde.`) | **4988** |
| **KYLY** | **3131** prendas · **75** líneas |
| **MILON** | **1857** prendas · **42** líneas |
| Proveedor | **638** (todas las filas) |
| Temporada | **PR/26** |
| SKU únicos (L+color+talla) | **986** |
| Pares imagen (L+color) | **~448** |

### 2.1 · Mapa columnas → Nexus

| Excel | Nexus / CP |
|-------|------------|
| **MARCA** | `marca_v2` · KYLY / MILON |
| **Producto** | `linea.codigo_proveedor` (638) |
| **Mat** (`K1001773`) | material Kyly |
| **KColor** / **Color** | `color` · strip `K` |
| **Tam** | grada abierta 638 · **1 fila = 1 talle** |
| **Qtde.** | prendas PPD / IC |
| **LPN / LPC03** | motor precios |
| **Precio** | costo fábrica USD |
| **Pedido Externo** | `pedido_proveedor.nro_pedido_externo` |
| **C.Cliente** | `276-2-stock` (100% filas) |
| **Descripción** (J) | **Estilo 638** → `grupo_estilo_id` + `referencia.descripcion` + `ppd.descp_material` |
| **Grupo** (F) | COD.GRUPO 10 díg. → marca · género · AB-CR |

Doc pilares/filtros: [CHUSAR_CP638_PILARES_FILTROS_WEB.md](./CHUSAR_CP638_PILARES_FILTROS_WEB.md) · **2.3.1.33.1**

### 2.2 · Preventa Carlos — decisión Director (2026-07-21)

**Un solo número:** **`4092`** (`pedido_proveedor.nro_pedido_externo`) — no usar códigos largos col **AF** (`028430358…`) en UI ni filtros.

| Campo | Origen Excel |
|-------|--------------|
| Preventa | **4092** (asignación Carlos · no está en celda) |
| Subtítulo tarjeta fila 1 | col **J** `Descripción` (BLUSA, CONJ FEM…) → `ppd.descp_material` |
| Subtítulo tarjeta fila 2 | col **M** nombre color → `ppd.descp_color` |
| Filtro filas import | col **AF** `Pedido Externo` (solo inclusión fila · no mostrar en UI) |

### 2.3 · Siete lotes AF en Excel (+ hueco)

| `Pedido Externo` (AF) | Prendas | Nota |
|----------------------|--------:|------|
| 028430358836 … 028430360240 | 4528 importadas | **1 PP** id 49 |
| *(vacío)* | **460** | **101 filas** Milon — pendiente Director |

### 2.4 · Estado import (2026-07-21 noche)

| Check | Estado |
|-------|--------|
| PP-49 · IC-0824/0825 | ✅ |
| PPD 919 · saldo 4528 · `precio_lpn` | ✅ |
| MIG-169 grada+LPN · MIG-170 `numero_preventa` | ✅ |
| Web `:3001` badge 4092 + 2da Sep. | ✅ |
| Web subtítulo col J+M | ✅ backfill 919 filas |
| **Pilares filtros Web** · COD.GRUPO + col J estilo | ✅ **919/919** · doc **2.3.1.33.1** · 2026-07-23 |
| Smoke precios/fotos/tallas | ⏳ |
| Panel AM split CP | ⏳ **2.3.1.11** |

**Pendientes día:** [PENDIENTES_INICIO_DIA_20260722.md](../../../4_etapas/PENDIENTES_INICIO_DIA_20260722.md)

### 2.5 · Imágenes (hoy)

| Check | Estado |
|-------|--------|
| Carpeta origen | `Z:\hector\imagen 07-07-26\Kyly Primavera 26\Fotos` |
| Storage batch | **1323/1323** PASS · evidencia `IMPORT_BATCH_8a2eeaa_20260721_133154.json` |
| Stem | `1001773_0001.jpg` ↔ Excel `Producto=1001773` + `KColor=K0001` |
| Maestro local | `...\imagenes\maestro_imagenes.txt` |

---

## 3 · Panel Alejandro Magno · datos actuales (prod · captura 2026-07-21)

**Ruta:** `/rimec?mundo=panel-control` · API `queries-resumen.ts` · UI `MundoPanelControl.tsx`

### 3.1 · Tres pilares (entidades)

| Pilar | `categoria_id` | RIMEC Web | Ramo calzado/confecciones en tarjeta |
|-------|:--:|:--:|---|
| **STOCK · Pronta entrega** | 1 | ✅ | ✅ **Dos bloques** (`PeRamoBlock` 👟 / 👕) |
| **COMPRA PREVIA · Tránsito** | 2 | ✅ | ❌ **Un solo bloque agregado** (hoy ~100% calzado histórico) |
| **PROGRAMADO** | 3 | ❌ | ❌ **Un solo bloque agregado** |

### 3.2 · Snapshot KPI (prod)

**STOCK**

| Ramo | Inicial | Saldo | Vendido | Productos | Monto Gs |
|------|--------:|------:|--------:|----------:|---------:|
| Calzado | 183.299 | 183.227 | 72 | 5.040 | ~23.031 M |
| Confecciones | 14.955 | 14.955 | 0 | 2.625 | ~1.282 M |

**COMPRA PREVIA** *(agregado · incluye confecciones futuras en mismo bucket)*

| Métrica | Valor |
|---------|------:|
| Pares inicial | 39.104 |
| Saldo | 27.472 |
| Vendido | 11.632 |
| Productos | 839 |
| Pedidos PP | 4 |
| Ejecución | 29,7% |

**PROGRAMADO**

| Métrica | Valor |
|---------|------:|
| Pares inicial | 73.684 |
| Saldo | 7.932 |
| Vendido | 65.752 |
| Productos | 6.583 |
| Pedidos PP | 9 |

### 3.3 · Meta UI (Director · caja roja CP)

Replicar patrón **STOCK** en **COMPRA PREVIA**:

```text
COMPRA PREVIA
  ├── 👟 Calzado      (tipo_v2_id=1 · proveedor 654)
  └── 👕 Confecciones (tipo_v2_id=2 · proveedor 638)
```

**Fase posterior:** mismo split en **PROGRAMADO** → AM «completo».

**Código ancla hoy:** `EntidadActivoResumen.ramos` solo se llena en PE (`getStockProntaEntregaResumen`). CP usa `getCompraPreviaEstadisticasWeb` sin segregación — **deuda 2.3.1.33**.

---

## 4 · Header · triángulo · administrador pilares

**Doc arquitectura:** [TRIANGULO_HEADER_PILARES.md](../../../3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md)

| Vértice | Tabla | Editado en |
|---------|-------|------------|
| **Género** | `linea.genero_id` | Report **`/pilares`** · pestaña Líneas |
| **Marca** | `linea.marca_id` | `/pilares` |
| **Estilo** | `linea_referencia.grupo_estilo_id` | `/pilares` · L×R |
| **Tipo 1** | `linea_referencia.tipo_1_id` | `/pilares` · L×R |
| **TONO** | `color_tono_estandar` | [CHUSAR_EDITOR_TONO.md](../pilares/CHUSAR_EDITOR_TONO.md) |

**Stack grilla AM (sellado):** `PanelControlGrillaStack` → `PanelControlTrianguloHeader` → `TrianguloHeaderDeposito` · ley **2.3.1.20**.

**Confecciones 638:** ref sintética **`K`** en L×R · filtros **Tipo** = CALZADO/CONFECCIONES (`tipo_v2_id`) · **no** mezclar chips 654 en catálogo 638.

---

## 5 · Hermanos siameses (YMS) — protocolo activo

| Capa | Regla | Doc |
|------|-------|-----|
| Filtro **Tipo** | Fix Web ⇒ mismo turno AM (y viceversa) | `2.2.1.18` |
| Cabecera **Nº preventa Carlos** | `nro_pedido_externo` siamese AM · Panel · Web · PDF | `2.3.1.31` |
| Cabecera **Llegada** | `quincena_arribo_id` 1–24 | FECHA_DE_EMBARQUE |
| KPI CP Panel | = Estadísticas RIMEC Web | CHUSAR_PANEL_CONTROL_COMPRA_PREVIA |

**Al importar confecciones CP:** cada PP debe llevar preventa alineada al Excel §2.2.

---

## 6 · Flujo operativo (orden)

| # | Paso | Responsable | Estado |
|---|------|-------------|--------|
| 1 | Cerrar hueco **460 prendas** sin Pedido Externo | Director | ⏳ |
| 2 | Registrar **IC CP** · PATRICIA/ALFREDO | Director | ✅ IC-0824/0825 |
| 3 | Motor/listas **LPN/LPC03** | Ops | ✅ por fila Excel |
| 4 | Import proforma → **PP-49** cat. **2** · preventa **4092** | Report | ✅ |
| 5 | PPD grada abierta 638 · pilares L+color | Motor 638 | ✅ |
| 6 | Verify fotos + molécula `v_stock_rimec` | Script | ⏳ smoke |
| 7 | **API/UI** ramos CP calzado/confecciones Panel | Cursor | ⏳ |
| 8 | Smoke `:3000` panel + `:3001` CP confecciones | Director | ⏳ |
| 9 | **Cierra etapa** + JSON :3004 | Protocolo | ⏳ |

---

## 7 · Focos abiertos (no jugar con RIMEC Web)

| # | Gate | Riesgo |
|---|------|--------|
| 1 | IC + preventa siamese | 🔴 |
| 2 | No mezclar programado (cat.3) | 🔴 |
| 3 | No reglas 654 (curvas/guiones) en 638 | 🔴 |
| 4 | Web solo post-PPD tránsito | 🟡 |
| 5 | Panel CP split ramos (código) | 🟡 |
| 6 | PROGRAMADO split (fase 2) | ⏳ |
| 7 | Sales Report blindado | 🔴 no tocar |

---

## 8 · Scripts ops

| Script | Uso |
|--------|-----|
| `report/scripts/analisis_stock_primavera_kyly.py` | Re-scan Excel vs maestro |
| `control_central/tools/subir_carpeta_import_batch.py` | Fotos 638 (cerrado PASS) |
| `report/scripts/reimport_pp49_primavera_638.mts` | Reimport PP-49 Excel Carlos · **2026-08-02** |
| `report/scripts/generar_informe_import_cp638.mts` | PDF+TXT informe funcionario |

---

## 9 · Reimport PP-49 (2026-08-02)

Borrado 919 artículos erróneos + reimport **`Stock primavera (1).xlsx`** → 919 SKUs · 4528 prendas.

Doc: [CHUSAR_REIMPORT_CP638_PP49_20260802.md](./CHUSAR_REIMPORT_CP638_PP49_20260802.md) · **2.3.1.33.3**  
Gradas: [PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md](../../../3_arquitectura/3.2_venta_tienda/PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md) · **3.02.00.638**

**Orden:** Director · Documenta · Documentación Chusar · 2026-07-21

# CHUSAR — Estadísticas de Stock · módulo LOCAL Bazzar Web

**Código:** **2.5.1.7**  
**Fecha:** 2026-08-02 (cierre Documenta · v2.4)  
**Keyword Director:** **estadisticas de Stock** · **Documenta** · Documentación Chusar  
**App:** Bazzar Web **solo** `http://localhost:3002`  
**Ruta UI:** `/auditoria-local` · Nav: **Estadísticas**  
**API:** `GET /api/auditoria-local`  
**Shibboleth:** Andrés, el que viene.

**Padres:** [2.5.1.8](./CHUSAR_ADECUACION_BAZZAR_RIMEC_AUDITORIA_SENIOR_20260802.md) · [3.02.00.638](../../3_arquitectura/3.2_venta_tienda/PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md) · [2.5.1.5 NIIF imágenes](./CHUSAR_MOTOR_PRECIO_IMAGENES_NIIF_20260801.md)

---

## 1 · Decisión del Director

| Qué | Cómo |
|-----|------|
| Nombre | **Estadísticas de Stock** (módulo de auditoría/estadística tienda) |
| Dónde vive | Bazzar Web nav «Estadísticas» (junto a Catálogo) |
| Entorno | **Solo local / development** · **prohibido deploy Vercel prod** |
| Qué NO es | No es Report `/bazzar-web/auditoria-integridad` (**2.5.1.6**) |
| Ramos | Pestañas **Calzado 654** / **Confecciones 638** — peras ≠ manzanas |
| Fotos | Botón **Sin fotos / Con fotos** — miniaturas NIIF opcionales |
| Roadmap F1+ | **[2.5.1.8](./CHUSAR_ADECUACION_BAZZAR_RIMEC_AUDITORIA_SENIOR_20260802.md)** |

---

## 2 · Qué audita (tres capas + grada)

1. **Depósito** — `INGRESO_COMPRA` confirmado `ALM_WEB_01` (`almacen_id = 1`)  
2. **Stock Sano** — `stock_sano_deposito` con `precio_venta > 0`  
3. **Catálogo web** — `v_stock_web` estado SANO · `stock_web > 0` · `precio_web > 0`  
4. **Detalle molecular** — pilares + color/estilo · grada según ramo  

### Dos juicios (no mezclar)

| Flag | Significado |
|------|-------------|
| `ok_stock` | Dep ↔ Web (y sano) coinciden en modelos / pares-prendas |
| `ok_grada_638` | Confecciones tienen grada PPD (`am_talle` / TC Tallas F9) |
| `ok` | `ok_stock` **y** `ok_grada_638` |

Banner típico: *PASS stock · FAIL grada* solo si falta match PPD; stock ALM puede cuadrar igual.

---

## 3 · UI canónica (v2.4 — “quedo perfecto”)

### 3.1 Cabecera módulo

- Título: **Estadísticas de Stock**  
- Botón **Sin fotos / Con fotos** (toggle)  
- Botón **Actualizar** (re-fetch API)  
- Badge **Solo local · no deploy**

### 3.2 Calzado 654

- Acordeón por **marca** · chip **medias/ropa** (MOLEKINHA/MOLEKINHO) dentro de Calzado.  
- Grupos por **firma de curva del modelo** (no unión frankenstein de toda la marca).  
- Tabla: [Foto?] · Modelo · Color · Estilo · Mat · filas **Web/Dep** por talle · Tot · Precio · OK.  
- Orden tallas: **etiqueta numérica** (35…43).

### 3.3 Confecciones 638

- Canónico: grada Carlos PPD / F9 (`am_talle` · `1(1)1` · `P(1)P`).  
- **Cabecera grada por marca** horizontal.  
- **Orden Director (inviolable):**  
  `1 · 2 · 3` → `P · M · G · GG` → `4 · 6 · 8` → `10 · 12 · 14 · 16`  
  Implementación: `sortTalle638Key` en `grada638.ts`.  
- Tabla: [Foto?] · Modelo · Color · Estilo · filas **Web/Dep** · columnas por talle · Tot · OK.  
- **Cantidad por celda** = prendas ALM del modelo repartidas entre talles PPD del modelo  
  (ALM no trae desglose `am_talle`; Σ celdas = Tot Web/Dep).  
- **Prohibido** pintar `cantidad_pares` PPD en celdas (rompe aritmética vs ALM 56).  
- **Prohibido** usar `talla_codigo` 34–39 ALM como talle ropa.  
- Total marca: Σ columnas + Web/Dep · badge Σ.

### 3.4 Fotos miniaturas (toggle)

| Estado | Comportamiento |
|--------|----------------|
| **Sin fotos** (default) | Tabla densa sin columna Foto |
| **Con fotos** | Columna Foto 48×48 · `ProductImage` NIIF (`sm`) |

Fuentes: `lib/product-image.ts` · stems 654 L-R-M-C · stems 638 Excel color (`K9010`).  
Ley: `2.01.04.021` · doc **2.5.1.5**.

### 3.5 Estilo (COALESCE)

```
COALESCE(
  v_stock_web.descp_grupo_estilo,
  linea_referencia.descp_grupo_estilo,
  grupo_estilo_v2.descp_grupo_estilo,
  '(sin estilo)'
)
```

---

## 4 · Semántica de datos 638 (lección operativa)

| Fuente | Rol |
|--------|-----|
| **ALM / `v_stock_web`** | Stock cuantitativo Dep↔Web (tienda Bazzar) |
| **PPD** (`pedido_proveedor_detalle`) | Grada canónica `am_talle` + `grada` Carlos (F9 TC Tallas) |
| Match | Preferir L+R+color; fallback L (estructura de talles) |
| Reimport PP-49 | Excel **Hoja2** · col Total · script `reimport_pp49_primavera_638.mts` · doc **2.3.1.33.3** |

---

## 5 · Blindaje no-deploy

| Capa | Regla |
|------|--------|
| `isAuditoriaLocalEnabled()` | prod off · development on |
| `middleware.ts` | 404 prod en `/auditoria-local` y `/api/auditoria-local` |
| Page / Nav | `notFound()` / link solo si enabled |
| Env | `DATABASE_URL` en `bazzar-web/.env.local` |

---

## 6 · Código (mapa)

| Pieza | Ruta |
|-------|------|
| Gate | `bazzar-web/lib/auditoria-local/enabled.ts` |
| API + cruce | `lib/auditoria-local/queries.ts` |
| Tipos | `lib/auditoria-local/types.ts` |
| Medias 654 | `lib/auditoria-local/medias654.ts` |
| Orden/parser 638 | `lib/auditoria-local/grada638.ts` |
| UI | `app/(public)/auditoria-local/AuditoriaLocalClient.tsx` |
| Page | `app/(public)/auditoria-local/page.tsx` |
| Route API | `app/api/auditoria-local/route.ts` |
| Nav | `components/Header.tsx` · label **Estadísticas** |
| Imagen | `components/ProductImage.tsx` · `lib/product-image.ts` |

---

## 7 · Smoke cierre Documenta (2026-08-02)

| Check | Resultado |
|-------|-----------|
| API | 200 |
| Totales Dep/Web | 108 modelos · 1745 pares/prendas |
| Calzado | 99 · 1641 · `ok_stock` |
| Confecciones | 13 · 104 · `ok_stock` · `ok_grada_638` vía PPD |
| Orden KYLY | `1 \| P \| 4 \| 6 \| 8 \| 10…` |
| Orden MILON | `1 \| 2 \| P \| M \| G` |
| Σ celdas = Tot | KYLY 56=56 · MILON 48=48 |
| Medias 654 | MOLEKINHA · MOLEKINHO |
| Toggle fotos | Botón Sin/Con fotos · columna opcional |
| Deploy | **No** |

---

## 8 · Norma anti-mediocridad (este módulo)

Entrega de estadísticas de stock **no** se cierra con solo agregados Dep/Sano/Web.

Obligatorio: ramos separados · pilares · grada por ramo · aritmética Σ=Tot · orden 638 Director · shibboleth + 💰 COSTO.

Detalle: **2.5.1.8**.

---

## 9 · Relación

| Código | Rol |
|--------|-----|
| **2.5.1.6** | Report integridad — distinto |
| **2.5.1.8** | Gaps Bazzar↔RIMEC · roadmap F0–F4 |
| **2.5.1.9 / 3.02.00.638** | Protocolo grada abierta holding |
| **2.5.1.10** | Grada siamese catálogo + Depósito Web (esta UI = base) |
| **4.05.03.002** | Error histórico FAIL grada sin am_talle (mitigado con PPD) |
| **2.3.1.33.3** | Reimport PP-49 Hoja2 |

**Índice:** [INDICE.md](./INDICE.md) · Portal `:3004/modulos/bazzar-web` · slug `auditoria-local-stock-bazzar-20260802`

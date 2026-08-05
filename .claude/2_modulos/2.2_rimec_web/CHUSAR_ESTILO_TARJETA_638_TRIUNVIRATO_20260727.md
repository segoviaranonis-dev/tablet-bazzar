# CHUSAR — Estilo tarjeta 638 · triunvirato grupo 1 · CP col J + PE ULT-PREC-

**Código:** **2.2.1.29** · **Fecha:** 2026-07-27  
**Keyword:** Documentación Chusar · deploy solución  
**Estado:** 🟢 **CERRADO** — Web deploy · BD backfill local · **638 ONLY**

---

## Problema Director (siamese)

Fila 2 tarjeta confecciones `:3001` mostraba datos **incorrectos**:

| Síntoma | Causa |
|---------|--------|
| `1000004` · código línea | Fallback a `descp_material` hash `K{linea}` |
| `VERANO · PRETO` | Fallback a `descp_tipo_1` (temporada AB-CR) |
| `CONFECCIONES · PRETO` | Bucket ramo `grupo_estilo_id=9000` — **no** es estilo filtro ESTILO |

**Error:** `4.01.04.004` · índice `5_errores/INDICE_ERRORES.md`

---

## Regla de oro — 638 ≠ 654 (agua y aceite)

| | **654 Calzado** | **638 Confecciones** |
|---|-----------------|----------------------|
| Detector | `tipo_v2_id=1` · `isConfecciones638Lote()` **false** | `tipo_v2_id=2` · `isConfecciones638Lote()` **true** |
| Subtítulo tarjeta | `descp_material · descp_color` (material Napa, etc.) | `estilo638Tarjeta · descp_color` |
| Estilo sidebar | `grupo_estilo` pilares calzado | **CP col J** · **PE ULT-PREC-** |
| Prohibido | Aplicar `estilo638Tarjeta` en calzado | Usar lógica 654 (tonos por talle, `N col.`, cajas) |

**Gate código:** toda rama estilo tarjeta va tras `isConfecciones638Lote(p)` o `esConf` en `CatalogPanelOrigen` / `CatalogoGrid` Lightbox.

---

## Triunvirato grupo 1 — fuente estilo 638

Doc padre: [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](../2.3_report/deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md)

| # | Archivo | Campo estilo prenda | Clave |
|---|---------|---------------------|-------|
| CP | `Stock primavera.xlsx` | **Col J · Descripción** | `linea` producto |
| PE | `Stock valorizado *.xlsx` hoja *Stock rimec* | **Col `ULT-PREC-`** | **`COD-COLOR`** (= `linea_codigo` Kyly) |
| PE | `sdrm1021.csv` | *(solo stock/saldos — no estilo)* | — |
| PE | `sdrm0849.xlsx` | COD.GRUPO → temporada/cadena — **no** BLUSA/CAMISETA | — |

**Genéricos rechazados en UI** (`ESTILOS_638_GENERICOS`): `CONFECCIONES`, `CALZADO`, `SIN ESTILO`, `REF K`, códigos `K\d+`, códigos numéricos puros.

Valores válidos filtro ESTILO (ej.): BLUSA · CAMISETA · CICLISTA · CONJ FEM · LEGGING · CALCA · PANTALON…

---

## Solución deployada

### RIMEC Web (`rimec-web`)

| Archivo | Cambio |
|---------|--------|
| `lib/confeccionesCatalogo.ts` | `estilo638Tarjeta()` · `ESTILOS_638_GENERICOS` · `subtitulo638Tarjeta()` |
| `lib/catalogoEnrich.ts` | Enrich pilares + promover `descp_material` humano si estilo genérico |
| `lib/catalogoPaginado.ts` | Siempre `enrichCatalogoRows` (estilo 638 no saltaba) |
| `app/CatalogoGrid.tsx` | Lightbox 638 usa `subtitulo638Tarjeta` |
| `components/catalog/CatalogPanelOrigen.tsx` | *(ya usaba subtitulo638)* |

### Report / BD (local ejecutado 2026-07-27)

| Script | Resultado |
|--------|-----------|
| `report/scripts/backfill_pe638_estilo_valorizado.mts` | `ref=1640` · `lr=1644` · `ppd=6104` |

Re-ejecutar tras nuevo valorizado:

```bash
cd report && npx tsx scripts/backfill_pe638_estilo_valorizado.mts [ruta.xlsx]
```

Paridad Report PE UI: `report/src/lib/stock-pronta-entrega/pe-filtro-pilar-638.ts` (`estilo638Comercial`).

---

## Robustez

| Capa | Nivel |
|------|-------|
| **Aislamiento 654** | 🟢 Alto — solo ramas `isConfecciones638Lote` / `tipo_v2_id===2` |
| **Datos PE** | 🟡 Medio — depende backfill valorizado; líneas nuevas sin Excel → estilo vacío hasta script |
| **Datos CP** | 🟢 Alto — col J + `backfill_estilo_j_cp638.mts` |
| **UI fallback** | 🟢 — si no hay estilo humano, muestra solo color (nunca ramo CONFECCIONES) |
| **Re-import PE** | 🟡 — re-correr backfill valorizado si PPD vuelve a `K{linea}` |

---

## Smoke

`http://localhost:3001/?origen_tipo=TODOS&ramo_tipo=CONFECCIONES`

- Kyly `1000004` → **`CALCA · PRETO`** (no CONFECCIONES / VERANO / 1000004)
- Calzado `:3001?ramo_tipo=CALZADO` → **sin cambio** (material · color 654)

---

## Referencias

- [CHUSAR_CP638_PILARES_FILTROS_WEB.md](../2.3_report/gestion_compra/CHUSAR_CP638_PILARES_FILTROS_WEB.md) · col J CP
- [CHUSAR_CONFECCIONES_REGLAS_PROPIAS_638.md](./CHUSAR_CONFECCIONES_REGLAS_PROPIAS_638.md)
- [CONFECCIONES_638_VS_CALZADO_654.md](../../../rimec-web/docs/CONFECCIONES_638_VS_CALZADO_654.md)
- [4.01.04.004](../../5_errores/detalle/4.01.04.004_rimec-web-638-estilo-tarjeta-siamese.md)

**Shibboleth:** Andrés, el que viene.

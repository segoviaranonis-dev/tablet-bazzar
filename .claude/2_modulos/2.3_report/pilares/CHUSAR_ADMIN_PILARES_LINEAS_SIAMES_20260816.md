# CHUSAR — Admin Líneas · siameses Dimensiones∥Molécula

**Código:** **2.3.5.5.3**  
**Fecha:** 2026-08-16  
**Keyword:** **Documenta** · **aplica el protocolo hermanos siameses**  
**Padres:** maestro **2.2.1.44** · mapeo **2.2.1.52** · AP L×R **2.3.5.5.1**  
**App:** Report `:3000` `/pilares/lineas`  
**🆕 MOISES post-20260807 · 2026-08-16**

---

## 0 · Orden Director

El filtro pills de marca/género **no alcanza**: grilla cortada a 500, Ctrl+F no encuentra **5831**, banner **Failed to fetch**.  
Instalar **el mismo panel dual DIMENSIONES ∥ MOLÉCULA** (hermano W / AP L×R) con lo mapeado.

---

## 1 · Error verificado

| Síntoma | Causa | Fix |
|---------|--------|-----|
| Failed to fetch | GET `/api/pilares/lineas` hacía **en paralelo** listado 500 + resumen agregado de todas las líneas + filtros; timeout / abort al cambiar pills | Grilla **sin** resumen; resumen en fetch aparte `resumen=1` · `AbortController` · no tratar abort como error |
| 5831 no aparece | Limit 500 + orden código; 1768 coincidencias; **no había Buscar** | Campo Buscar siamese (`q`) · LIKE código/descripcion/marca · exacto primero |

---

## 2 · Hermano AL

| Sigla | Superficie | UI |
|-------|------------|-----|
| **W** | rimec-web catálogo | `CatalogoFiltrosSidebar` |
| **AP** | `/pilares/linea-referencia` | `PilaresLrFiltrosSidebar` |
| **AL** | `/pilares/lineas` | **mismo** `PilaresLrFiltrosSidebar` |

Universo AL = tabla `linea` (pilar 1). Stock/Depósito/Tipo/AB-CR/estilo/L-R acotan por EXISTS (SDRM PE, CP `registro_st_vt_rc_reposicion`, `linea_referencia`).

---

## 3 · Cómo hallar 5831

1. `/pilares/lineas?tipo_v2_id=1`  
2. Dimensiones → **Buscar** `5831`  
3. Marca del pilar (hoy Moleca vs grupo Molekinho) editable en la fila.

---

## 4 · Andrés

**Qué:** filtros de líneas = panel dual, no pills. Buscar manda.  
**Qué no:** Ctrl+F sobre 500 filas.  
**Zip:** Héctor. Sync OPS→Andrés OFF.

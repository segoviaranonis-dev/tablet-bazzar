# CHUSAR — Biblioteca cadena comercial Carlos · PE RIMEC

**Subcuenta:** **2.3.1.9.B.1** · padre [2.3.1.9 Facturación](./INDICE.md)  
**Fecha:** 2026-07-24  
**Keyword Director:** Documenta  
**Estado:** 🟡 **ANÁLISIS + SEED** — biblioteca JSON generada · motor PE pendiente  
**Etapa viva:** `PE-FINAL-CIERRE-MODULO-20260723` · **2.3.1.9.B.FINAL**

---

## 1 · Objetivo

Un **solo diccionario canónico** para el filtro comercial del stock **Pronta Entrega** RIMEC, independiente del Excel Carlos, que permita:

1. Identificar cada `COD.GRUPO` (10 dígitos) con precisión.
2. Agrupar facturación / comisión vendedor: **1 FI = 1 cadena × caso × marca × PP** (R-FI-2).
3. Manejar PE sin mezclar con CP/tránsito ni con ramos excluidos.

**Cadena PE unificada (3 valores):**

| Valor Nexus (BD) | Etiqueta UI | Significado comercial |
|------------------|-------------|----------------------|
| `REGULAR` | **NORMAL** | Precio lista estándar (D1 4 %) |
| `PROMOCIONAL` | **PROMOCIONAL** | Promo / campaña (D1 2 %) |
| `LIQUIDACION` | **LIQUIDACION** | Salida / liquidación (D1 2 %) |

Doc palabra reservada: [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](../deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md) (**grupo uno**).

---

## 2 · Punto 1 — Carteras **fuera** del filtro

**Regla:** `CARTERAS` / `CARTERA` **no** entra al diccionario unificado de cadena comercial PE.

| Fuente | Evidencia |
|--------|-----------|
| `cod-grupo-decode.ts` | Calzado d23=`03` → `tipo_1=CARTERAS` |
| `sdrm0849.xlsx` | TIPO0=`CARTERAS` · **212** filas |
| `Stock valorizado 07-07-26.xlsx` | Tipo 1/11/2=`CARTERA` · **202** filas c/u |

**Acción:** módulo / filtro **propio** (reconstrucción sólida). El import PE y la FI **excluyen** `excluir_carteras=true` en biblioteca.

En seed JSON: **10** de **133** grupos marcados `excluir_carteras`.

---

## 3 · Diccionario por proveedor (filtro Director)

### 654 — Calzados

| Campo Excel (Stock valorizado) | Rol | Valores observados |
|-------------------------------|-----|-------------------|
| **Tipo 1** | Forma (AB-CR) | ABIERTO · CERRADO · VERANO · INVIERNO · *(excl. CARTERA)* |
| **Tipo 2** | **Cadena comercial** | **NORMAL** · **PROMOCIONAL** · **LIQUIDACION** · Normas!! *(raro)* |

**COD.GRUPO — dígitos 5-6 (pos 45):** `01`=REGULAR · `02`=PROMOCIONAL · `04`=LIQUIDACION  
Código: `rimec-web/lib/pilares/codGrupoCadena.ts` · `report/src/lib/pilares/cod-grupo-decode.ts` (`CALZ_D45_CADENA`).

**Nota:** Promo+Liquidación simultáneo = **caso raro** → FI separada (R-FI-2).

### 638 — Confecciones (Kyly y marcas 10–15)

| Campo Excel | Rol | Valores observados |
|-------------|-----|-------------------|
| **Tipo 1** | Temporada | VERANO · INVIERNO |
| **Tipo 11** | Género | FEMENINO · MASCULINO |
| **Tipo 2** | **Estilo / cadena** | **ACTUAL** · **ANTERIOR** · **LIQUIDACION** · PROMOCIONAL *(vía d67=03)* |

**COD.GRUPO — dígitos 7-8 (pos 67):** `01`=ACTUAL · `02`=ANTERIOR · `03`=PROMOCIONAL · `04`=LIQUIDACION  
Mapeo a cadena PE: ACTUAL/ANTERIOR → `REGULAR` salvo d67=03/04.

---

## 4 · Archivos analizados (2026-07-24)

| Archivo | Rol | Filas | Columnas clave |
|---------|-----|-------|----------------|
| `csv's/stock's/sdrm1021.csv` | **Principal PE** | 12 070 | `CODIGO ARTICULO` · `COD.GRUPO` · LPN · depósitos |
| `Downloads/sdrm0849 (1).xlsx` | **Traductor Carlos** | 12 121 | `TIPO0` · `TIPO1` · `TIPO2` · `COD.GRUPO` · `MARCA` |
| `Downloads/Stock valorizado 07-07-26.xlsx` (hoja *Stock rimec*) | **Complemento etiquetas** | 12 167 | `Cod. Art. Carlos.` · `Marca2` · `Tipo 1` · `Tipo 11` · `Tipo 2` |

### Cruce artículos

- Formato Carlos: principal `638.103752` (punto) vs valorizado `638-124953` (guión) → normalizar a `{prov}-{cod}` antes de join.
- `COD.GRUPO`: **133** valores únicos · alineados entre sdrm1021 y sdrm0849.
- Distribución cadena (decoder dígitos, sin carteras): **REGULAR 67** · **LIQUIDACION 34** · **PROMOCIONAL 22** grupos.

### Distribución artículos (sdrm1021)

| Cadena PE | Artículos |
|-----------|-----------|
| REGULAR | 9 646 |
| LIQUIDACION | 1 711 |
| PROMOCIONAL | 650 |

Proveedor: **638** 6 202 · **654** 5 844 arts.

---

## 5 · Biblioteca generada (seed)

| Artefacto | Ruta |
|-----------|------|
| **Seed JSON (133 grupos)** | `report/src/lib/pe/biblioteca-cadena-carlos.seed.json` |
| **Script análisis** | `report/scripts/_analisis_biblioteca_carlos_pe.py` |
| **Output crudo** | `report/scripts/_output_carlos_cadena_pe.json` |

Cada fila seed:

```json
{
  "cod_grupo": "0201040000",
  "cadena_pe": "LIQUIDACION",
  "excluir_carteras": false,
  "articulos": 237,
  "tipo0_moda": "ABIERTO",
  "tipo1_moda": "LIQUIDACION",
  "tipo2_moda": "NADA",
  "marca_moda": "MODARE"
}
```

**Fuente de verdad operativa:** dígitos `COD.GRUPO` (MIG-171 · `grupo_digito_mapa`). Labels Excel = control; conflicto → **gana dígito** (`decodeCodGrupo`).

---

## 6 · Uso en facturación PE

```
COD.GRUPO (artículo PE)
    → biblioteca / decodeCodGrupo
    → cadena_pe ∈ { REGULAR, PROMOCIONAL, LIQUIDACION }
    → excluir si carteras
    → FI = PP × marca × caso × cadena_pe
    → comisión vendedor por agrupación estándar
```

Paridad runtime existente: `etiquetaCelulaFi` · `cadenaComercialFi` · `v_stock_pe_rimec.es_promo/es_liquidacion/cadena_comercial`.

---

## 7 · Pendiente implementación

| # | Tarea | Índice |
|---|-------|--------|
| 1 | Tabla BD `biblioteca_cadena_carlos` (133 filas + version) | PE final |
| 2 | Normalizador art `638.103752` ↔ `638-103752` en import | 2.3.1.33 |
| 3 | Excluir carteras en filtros catálogo PE + confirmar FI | 2.2.1.21 |
| 4 | UI filtro único cadena PE (3 valores) derivado de biblioteca | Web |
| 5 | Smoke: grupo → FI → comisión Enrique/PVR | 2.3.1.9.B.FINAL |

---

## 8 · Referencias

- `report/src/lib/pilares/cod-grupo-decode.ts`
- `rimec-web/lib/pilares/codGrupoCadena.ts`
- `.claude/3_arquitectura/3.2_venta_tienda/REGLAS_PROVEEDOR_654.md`
- `.claude/3_arquitectura/3.2_venta_tienda/REGLAS_PROVEEDOR_638.md`
- [CHUSAR_CSV_VENTAS_PE_CARLOS.md](./CHUSAR_CSV_VENTAS_PE_CARLOS.md)

**Orden Director:** Documenta · biblioteca cadena Carlos PE · 2026-07-24.

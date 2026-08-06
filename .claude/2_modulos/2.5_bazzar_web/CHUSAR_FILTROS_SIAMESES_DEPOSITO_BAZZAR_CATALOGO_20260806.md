# CHUSAR — Filtros siameses Depósito Web ↔ Bazzar tienda

**Código:** **2.5.1.20**  
**Fecha:** 2026-08-06  
**Keyword:** **Documenta** · Protocolo Chusar Activado · **aplica el protocolo hermanos siameses**  
**Padre:** [CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md](../2.2_rimec_web/CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md) (**2.2.1.44**)  
**Cascada:** [CHUSAR_CASCADA_FILTROS_CATALOGO_20260805.md](../2.2_rimec_web/CHUSAR_CASCADA_FILTROS_CATALOGO_20260805.md) (**2.2.1.42**)  
**Instalación PE/AB-CR:** [CHUSAR_PROTOCOLO_INSTALACION_FILTROS_PE_ABCR.md](../2.2_rimec_web/CHUSAR_PROTOCOLO_INSTALACION_FILTROS_PE_ABCR.md) (**2.2.1.47**)  
**Shibboleth:** Andrés, el que viene.

---

## 0 · Norte Director

Aplicar **con severidad** la cascada dimensión → molécula y el protocolo hermanos siameses en:

| Hermano | App · ruta | Rol |
|---------|------------|-----|
| **DW** | Report `:3000` `/bazzar-web/deposito-web` | Depósito ALM_WEB_01 (stock que alimenta la tienda) |
| **BZ** | Bazzar Web `:3002` `/catalogo` | Tienda pública |

**Ley:** cuando los artículos pasen de Depósito → tienda, los filtros deben comportarse **idénticos** (misma cascada, mismas dims, misma molécula). Bazzar puede no tener artículos aún: la UI de filtros debe estar lista (chips vacíos ≠ chips rotos).

---

## 1 · Qué se instaló (local · verificado)

### 1.1 Depósito Web (Report)

| Pieza | Antes | Después |
|-------|-------|---------|
| `tipo_1` / `tipo_1_id` | `NULL` forzados en SQL | JOIN `linea_referencia` + `tipo_1` |
| `cod_grupo` / `sdrm_tipo1` | Ausentes | Lateral `v_stock_pe_rimec` por L+R (ESCOLAR d45) |
| Cascada selecciones | Solo al cambiar ramo | Dimensión (AB-CR/Marca/Tipo/Género) limpia molécula; Estilo→Línea→Material→Color |
| Helper | — | `report/src/lib/depositos/operativa-cascada.ts` |

**Smoke** `scripts/_smoke_deposito_abcr_cascada.ts` (2026-08-06):

| Check | Resultado |
|-------|-----------|
| Filas ingreso ALM | **930** |
| Con `tipo_1_id` | **930 / 930** |
| Con `cod_grupo` | **926** |
| AB-CR opciones | CARTERAS −1 · LENTES −2 · MEDIAS · ABIERTO · CERRADO · **ESCOLAR −8** · … |
| Filtro CERRADO (id=2) | **577** filas |
| Filtro ABIERTO (id=1) | **274** filas |
| Cascada marca→líneas | **13** vs universo **101** |

HTTP UI: `GET /bazzar-web/deposito-web` → **200**.

### 1.2 Bazzar Web tienda (`:3002`)

| Pieza | Antes | Después |
|-------|-------|---------|
| Molécula | Solo Estilo + Color (Color = universo) | Estilo → **Línea** → **Material** → Color |
| Género | Ausente en sidebar | Dimensión Género (vacío sin stock = “Sin opciones”) |
| Facetas | Merge parcial / universo | **Replace** leave-one-out `facetas-cascada.ts` |
| Cascada UI | Débil | Dimensión limpia molécula; Estilo limpia Línea+Mat+Color |

HTTP: `GET /catalogo` → **200** · UI contiene Dimensiones · Molécula · Línea · Material · Cascada.

**Nota canal:** Tipo comercial en tienda sigue ley ALM (`stock_sano_caso` · `filtro-tipo-canonico`) — no diccionario COD.GRUPO PE. AB-CR/ESCOLAR en tienda se suman cuando el stock vendible traiga tipología (misma fuente DW).

---

## 2 · Archivos ancla

```
report/src/lib/bazzar-web/deposito-web/deposito-web-rows.ts
report/src/lib/depositos/operativa-cascada.ts
report/src/components/herramienta-reposicion/ReposicionFiltrosSidebar.tsx
report/scripts/_smoke_deposito_abcr_cascada.ts
bazzar-web/lib/catalogo/facetas-cascada.ts
bazzar-web/app/(public)/catalogo/FiltrosCatalogo.tsx
bazzar-web/app/(public)/catalogo/page.tsx
```

---

## 3 · Checklist siamese DW ↔ BZ (obligatorio al tocar filtros)

- [ ] Dimensión acota facetas molécula (replace, no universo ~841)  
- [ ] Orden molécula Estilo→Línea→Material→Color  
- [ ] Toggle dimensión limpia selecciones molécula  
- [ ] AB-CR en DW con `tipo_1` real + ESCOLAR si hay `cod_grupo`  
- [ ] Fix en DW → mismo turno alinear BZ (o deuda + orden Director)  
- [ ] Smoke depósito + `http://localhost:3002/catalogo`  

---

## 4 · Anti-patrones

1. Volver a `NULL::text AS tipo_1` en depósito.  
2. Pasar `todosColores` de universo a la sidebar Bazzar.  
3. Instalar ESCOLAR como estilo de molécula.  
4. Deploy prod rimec-web / bazzar sin cierre etapa u orden directa.

---

## 5 · Estado

| Ámbito | Estado |
|--------|--------|
| Código local DW + BZ | ✅ Culminado |
| Smoke local | ✅ PASS |
| Documentación Moria | ✅ este CHUSAR **2.5.1.20** |
| Deploy prod | ✅ **Orden Director 2026-08-06** · Protocolo Chusar Activado · Report + Bazzar Web |

### 5.1 Deploy (evidencia)

| App | Repo | Commit | Prod |
|-----|------|--------|------|
| **Report** (Depósito Web) | `segoviaranonis-dev/report` · `rimec-report` | `f4585ec` (cadena `eb04701`→`b7698e1`→`f4585ec`) | ✅ Ready · https://rimec-report.vercel.app/bazzar-web/deposito-web → 200 |
| **Bazzar Web** (catálogo) | `segoviaranonis-dev/bazzar-web` | `bb478cb` (filtros `067e3d0` + tsconfig) | ✅ Ready · https://www.bazzar.com.py/catalogo → 200 · Molécula |

**Anti-patrón §4.4:** deploy autorizado por **pedido directo** del Director (*documenta y despliega*).

**Orden Director:** Perfecto y hermoso · Documenta · despliega · Protocolo Chusar Activado · 2026-08-06.

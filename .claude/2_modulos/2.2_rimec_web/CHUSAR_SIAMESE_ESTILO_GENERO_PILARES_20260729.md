# CHUSAR — Siamese Estilo + Género desde Administrador de Pilares

**Código:** **2.2.1.35**  
**Par Report:** **2.3.1.10.1.6** · AM + DPE  
**Marco:** [TRIANGULO_HEADER_PILARES.md](../../3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md) · R1 + R3 enmendado  
**Fecha:** 2026-07-29 · **Keyword:** Documenta  
**Shibboleth:** Andrés, el que viene.

---

## Norte (Director)

Estilos y géneros de **Calzado (654)** y **Confecciones (638)** vienen **directo** del Administrador de Pilares (`/pilares`). Son **FK**. Prohibido cable cruzado mediocre (DISTINCT stock · merge entre ramos).

```
/pilares (verdad)
   → grupo_estilo_v2 ∩ ESTILOS_POR_TIPO_V2
   → genero
        ↓ misma lista
   Alejandro Magno · DPE · RIMEC Web
```

---

## Ley siamese

| Regla | Detalle |
|-------|---------|
| **Fuente lista** | Maestras pilares por `tipo_v2` (1=654 · 2=638) |
| **Aplicar filtro** | FK en filas stock (`grupo_estilo_id` · `genero_id`) |
| **Calzado** | Incluye TENIS · excluye PIJAMA/LEGGING/… |
| **Confecciones** | Solo estilos whitelist 638 |
| **Prohibido** | Faceta estilo/género = distinct stock · `mergeFacet` acumular ramos |

---

## Implementación

| App | Pieza |
|-----|--------|
| Report | `GET /api/pilares/maestras-filtro` · `buildOperativaOpciones(..., trianguloMaestras)` · StockPe + AM |
| Web | `lib/pilares/loadMaestrasTriangulo.ts` · `catalogoMetaRpc` · `CatalogoClient` reemplazo estilos/géneros |

Whitelist canónica: `report/src/lib/pilares/constants.ts` · espejo Web `rimec-web/lib/pilares/estilosPorTipoV2.ts`.

---

## Smoke

1. Web Calzado+Todos → Estilo lista con **TENIS** · sin PIJAMA.  
2. Cambiar a Confecciones → sin TENIS/BOTAS.  
3. AM + DPE mismo criterio al elegir ramo.  
4. Elegir TENIS filtra stock por `grupo_estilo_id` FK.

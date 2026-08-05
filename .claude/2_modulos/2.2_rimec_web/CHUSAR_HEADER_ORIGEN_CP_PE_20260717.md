# CHUSAR — Header origen Compra previa / Pronta entrega

**Subcuenta:** **2.2.1.13**  
**Padre:** `2.2.1` Catálogo · [INDICE.md](./INDICE.md)  
**Fecha:** 2026-07-17 · **Documenta** + **despliega** (Director)  
**App:** http://localhost:3001 · prod https://rimec.com.py / https://rimec-web.vercel.app  
**Código:** `rimec-web/app/components/Header.tsx`

---

## Qué cambió (orden Director)

**Eliminado** del header (mega menú género):

- Damas · Niñas · Niños · Caballeros · Catálogo

**Sustituido por** dos botones centrales:

| Botón | URL | Activo si |
|-------|-----|-----------|
| 🚢 Compra previa | `origen_tipo=CP` (+ `ramo_tipo`) | `origen_tipo=CP` |
| 📦 Pronta entrega | `origen_tipo=PRONTA_ENTREGA` | `origen_tipo` contiene PRONTA |

---

## Proceso de venta — regla de URL

Al cambiar CP ↔ PE **no se borran** filtros compartidos de la query (marca, estilo, línea, tipo, género, tonos, buscar, familias, etc.). Solo mutan origen / ramo / quincenas (CP) / depósito (PE).

Así el vendedor puede filtrar, activar venta, y saltar CP↔PE sin perder el contexto de búsqueda.

Flujo intacto:

```
Activar venta → cliente + plazo + lista → precios en grilla → + cajas → carrito → confirmar
```

Piezas: `DialogoActivacion` · `store/sesionVenta` · `SesionSyncProvider` · `CatalogPanelOrigen` · `/carrito`.

---

## Layout catálogo alineado (mismo día)

| Zona | Contenido |
|------|-----------|
| **Header** | CP \| PE (origen) |
| **Cabecera catálogo** | Conteos · Limpiar · Extender · acordeón **Tono** |
| **Sidebar** | **Dimensiones** (Stock fechas CP · PE · Depósito · Categoría · AB-CR · Marca · Tipo · Género) + **Molécula** (Estilo → Línea → Material → Color) |
| **Grilla** | Orden A→Z línea + referencia · carga completa del filtro |

Detalle filtros: [CHUSAR_CATALOGO_CABECERA_FILTROS.md](./CHUSAR_CATALOGO_CABECERA_FILTROS.md) · sidebar `CatalogoFiltrosSidebar.tsx`.

---

## Deploy

Orden Director **despliega** / **despliega nuevamente** 2026-07-17 · commits `3e57fa7` (header) · `a8f425d` (precios confecciones + PE origen) → Vercel prod.

Corte consolidado: [CHUSAR_CORTE_20260717_HEADER_PRECIOS_PE.md](./CHUSAR_CORTE_20260717_HEADER_PRECIOS_PE.md)

**Shibboleth:** Andrés, el que viene.

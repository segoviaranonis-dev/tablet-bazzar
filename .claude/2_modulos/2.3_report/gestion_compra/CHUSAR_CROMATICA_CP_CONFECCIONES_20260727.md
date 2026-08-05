# CHUSAR — Cromática CP/Programado · calzado vs confecciones

**Código:** **2.3.1.33.2** · Padre **2.3.1.33** (Import CP confecciones 638)  
**Ratificado:** 2026-07-27 · orden Director **Documenta** + **despliega** + Documentación Chusar  
**Siamese:** Report Pedido proveedor / AM · RIMEC Web catálogo CP

---

## Qué es

Distinción visual **por fila / lote**, no por quincena entera:

| Ramo | Color |
|------|--------|
| **Confecciones** (638 · Kyly/Milon · `tipo_v2_id=2`) | **Amarillo pastel** (`amber-50` / `yellow-50` · misma familia LIQ oro) |
| **Calzado** | Sky / azul (dato duro histórico) |

**Ley Director (2026-07-27):** si una quincena mezcla calzado + confecciones, **solo** la fila confecciones se pinta. El acordeón de quincena permanece blanco/neutro.

---

## Dónde aplica

| Superficie | Comportamiento |
|------------|----------------|
| Pedido proveedor hub | `PpRow` amarillo si Kyly/Milon o proforma `638-*` · quincena **sin** fondo amarillo |
| Alejandro Magno pills | `tipo_v2_id=2` → pill + texto quincena ámbar |
| Catálogo Web CP | Acordeón lote + chip dato duro + panel origen |

PE (pronta entrega) **no** usa esta paleta (sigue verde / shells comerciales).

---

## Código canónico

| App | Helper | UI |
|-----|--------|-----|
| Report | `report/src/lib/pedido-proveedor/cromaticaCpConfecciones.ts` | `PedidoProveedorHubClient.tsx` · `DatoDuroCpFilas` · `ReposicionArticuloCard` |
| Web | `rimec-web/lib/cromaticaCpConfecciones.ts` | `DatoDuroCpFilas` · `CatalogLotesAcordeon` · `CatalogPanelOrigen` |

Heurística PP hub: `ppMarcasOProformaConfecciones({ marcas, numero_proforma })`.

---

## Relacionados

- [CHUSAR_IMPORT_CP_CONFECCIONES_638_AM.md](./CHUSAR_IMPORT_CP_CONFECCIONES_638_AM.md) · **2.3.1.33**  
- [CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md](./CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md) · **2.3.1.31**  
- Shells LIQ oro: `rimec-web/lib/catalogoShellLatidos.ts` (familia visual, no confundir con caso LIQ)

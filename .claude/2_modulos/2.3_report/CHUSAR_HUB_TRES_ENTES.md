# CHUSAR — Hub Report · tres entes

**Código etapa:** 2.3.0 (organización índice) · **Cierre:** 2026-06-18  
**Palabra clave:** Documentación Chusar · integrado post-cierre hub

---

## Regla

Report = **tres entes operativos** + recursos doc aparte. Prohibido mezclar Retail con RIMEC ni Bazzar Web con tiendas físicas en un solo acordeón.

| Grupo | Código navegador | App Report `:3000` |
|-------|------------------|---------------------|
| RIMEC | 2.3.1.* | `group: "rimec"` |
| BAZZAR tiendas | 2.3.2.* | `group: "bazzar"` |
| BAZZAR WEB | 2.3.3.* | `group: "bazzar-web"` |

---

## Fuentes únicas

1. **App desplegada:** `report/src/lib/report/hub-modules.ts`  
2. **Navegador Moria:** `nexus-navegador-holding/config/arbol-modulos.json`  
3. **Doc app:** `report/docs/HUB_INDEX_GRUPOS.md`

Alta de módulo → actualizar las tres; no duplicar listas en `page.tsx` ni header.

**Acreditación ente (2026-06-10):** usuarios tienda (ente cod 2–4) solo ven grupo `bazzar` en header — ver [CHUSAR_USUARIOS_ADMIN.md](../2.3_report/pilares/CHUSAR_USUARIOS_ADMIN.md) · `report/src/lib/auth/ente-acceso.ts`.

---

## Proceso importación (2.3.1.7)

Hub RIMEC incluye tarjeta **Proceso de importación** (`/proceso-importacion`). Subárbol Moria:

- 2.3.1.7.1 Motor precios  
- 2.3.1.7.2 Importación Excel (Paso 0 en curso)

≠ Motor precio WEB (`/bazzar-web/motor-precio` · grupo 2.3.3).

---

**Etapa cerrada:** [ETAPA_REPORT_HUB_TRES_ENTES_CERRADA.md](../../4_etapas/ETAPA_REPORT_HUB_TRES_ENTES_CERRADA.md)

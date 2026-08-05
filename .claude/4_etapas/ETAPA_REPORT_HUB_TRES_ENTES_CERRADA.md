# ETAPA CERRADA — Hub Report tres entes · 2.3.0

**ID:** `ETAPA-230-HUB-TRES-ENTES-20260618`  
**Cierre:** 2026-06-18 · **Director:** Chusar · protocolo Chusar  
**Estado:** ✅ **CERRADA**  
**Deploy:** https://report-rimec.vercel.app/  
**Shibboleth:** Chayanne el mejor

---

## Entregable

Índice Report y header zen separan **tres entes** — nunca mezclados en un solo acordeón:

| Código Moria | Ente | Módulos |
|--------------|------|---------|
| **2.3.1** | RIMEC | Ventas · Ventas+Fotos · Aprobaciones · Pilares · RRHH · Proceso importación |
| **2.3.2** | BAZZAR | Stock/Retail · Depósitos · Tablet |
| **2.3.3** | BAZZAR WEB | Compra · Depósito Web · Precio WEB · Stock Sano |

Recursos documentales (Anexo) fuera de los tres entes operativos.

---

## Código (Report)

| Archivo | Rol |
|---------|-----|
| `report/src/lib/report/hub-modules.ts` | Fuente única · `group` + roles |
| `report/src/app/page.tsx` | Acordeones hub |
| `report/src/components/report/NexusHeaderZen.tsx` | Header 3 columnas |
| `report/docs/HUB_INDEX_GRUPOS.md` | Doc app |

---

## Navegador Moria (3004)

| Archivo | Rol |
|---------|-----|
| `nexus-navegador-holding/config/arbol-modulos.json` | Árbol 2.3.1 / 2.3.2 / 2.3.3 anidado |
| Retail movido a **2.3.2.0** (no bajo RIMEC) |

Doc: [CHUSAR_HUB_TRES_ENTES.md](../2_modulos/2.3_report/CHUSAR_HUB_TRES_ENTES.md)

---

## Validación

- [x] `localhost:3000` — 3 acordeones + header 3 columnas
- [x] `localhost:3004/modulos/report` — 3 tarjetas grupo + sidebar anidado
- [x] `npm run build` Report OK
- [x] Push `main` → Vercel

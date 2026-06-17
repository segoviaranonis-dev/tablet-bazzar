# Tablet Bazzar — Documentación técnica

**App:** PWA POS para vendedores en tiendas Bazzar  
**Repo:** `tablet-bazzar/`  
**Puerto dev:** 3002  
**Deploy:** https://tablet-bazzar.vercel.app ✅

---

## Qué es

Ejecutor de venta en tienda física. **Report** administra y monitorea; **Tablet** consume el depósito local de cada tienda con UI táctil.

| Rol | Proyecto |
|-----|----------|
| Vendedor / SU en piso | `tablet-bazzar/` |
| Dirección / sync depósitos | `report/` (acordeón Bazzar) |

---

## Documentos de esta carpeta

| Documento | Contenido |
|-----------|-----------|
| [COMO_EJECUTAR.md](./COMO_EJECUTAR.md) | Entorno, `.env.local`, dev, build |
| [MODOS_VISTA.md](./MODOS_VISTA.md) | Panel y rutas |
| [MODULO_DEPOSITO_HEADER_PILARES.md](./MODULO_DEPOSITO_HEADER_PILARES.md) | Header pilares `/deposito` |
| [CADENA_CONSECUTIVA.md](./CADENA_CONSECUTIVA.md) | Modo cadena |
| [TRIANGULO_HEADER_PILARES.md](./TRIANGULO_HEADER_PILARES.md) | JOIN pilares cadena |
| [ETAPA_4_TICKET_BOTON.md](./ETAPA_4_TICKET_BOTON.md) | **Sub-sesión activa** — tikeCT / Ticket ORO |

---

## Documentación holding (`.claude/`)

| Documento | Ruta |
|-----------|------|
| Índice módulo 2.4 | `.claude/2_modulos/2.4_tablet_bazzar/INDICE.md` |
| **Etapa CERRADA** | `.claude/4_etapas/ETAPA_TABLET_FINAL_CERRADA.md` |
| **Tickets ABIERTO** | `.claude/4_etapas/SUBSESION_TABLET_TICKETS_20260617.md` |
| Chusar depósito header | `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_HEADER_PILARES.md` |

---

## Estado al 2026-06-17

| Área | Estado |
|------|--------|
| Etapa FINAL | ✅ CERRADA |
| Ventas `/cadena` | ✅ |
| Depósito grid + header pilares | ✅ |
| Tickets ORO | ⏳ sub-sesión activa |
| Deploy Vercel | ✅ |

Evidencia: [evidencia/CIERRE_ETAPA_TABLET_FINAL_20260617.json](./evidencia/CIERRE_ETAPA_TABLET_FINAL_20260617.json)

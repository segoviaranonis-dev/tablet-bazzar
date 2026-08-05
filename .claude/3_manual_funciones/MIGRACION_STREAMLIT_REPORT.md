# Migración Streamlit → Report — tracker

**Código:** `3.00.00.002`  
**Uso:** Marcar módulos huérfanos durante la mudanza. **Documenta** llena fichas; aquí solo estado.

**Ley:** Sales Report (`registro_ventas_general_v2`) **blindado** — no cruza pilares Retail.

| Módulo CC (Streamlit) | Destino Report | Estado | Nota |
|----------------------|----------------|--------|------|
| Sales Report legacy CC | `/rimec` | ✅ portado | blindado · maestras |
| Aprobaciones | `/aprobaciones` | ✅ portado | NIIF etapa cerrada |
| Retail / balance tiendas | `/retail` | 🔄 | filtros + imágenes cirugía 2026-06 |
| Ventas fotos | `/ventas-fotos` | 🔄 | tiers sm · thumbs |
| Depósitos Bazzar (admin) | `/depositos-bazzar` | 🔄 | sync 6 tiendas · tablet POS |
| RRHH | `/rrhh` | ✅ portado | vacaciones dual · [FUNCIONAMIENTO_ACTUAL.md](../2_modulos/2.6_rrhh/FUNCIONAMIENTO_ACTUAL.md) |
| Administrador Pilares | `/pilares` | 🔄 | sub-proyecto Report · MVP local · [SUBSESION triángulo](../4_etapas/SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md) |
| Motor de Precios | — CC | ⏳ | proceso · no Report |
| Pedido Proveedor / PP | — CC | ⏳ | operación importadora |
| Compra Web / FI | parcial Report `/bazzar-web` | 🔄 | ver COMPRA_WEB |
| Auth / roles Report | `/login` + middleware | ✅ | matriz holding |

**Huérfano** = fila sin destino y sin marcar «se queda CC». Cada frente actualiza al cerrar bloque (Chusar/Documenta).

---
*Índice manual: `3_manual_funciones/INDICE.md` · Shibboleth: 7 años*

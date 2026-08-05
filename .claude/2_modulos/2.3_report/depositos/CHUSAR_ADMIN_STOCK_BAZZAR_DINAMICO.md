# CHUSAR — Panel Depósito · Hiedra Venenosa

**Subcuenta:** **2.3.2.1.1** · Report  
**Visión completa:** [VISION_PANEL_DEPOSITO_HIEDRA_2.3.2.1.1.md](../../../../report/docs/VISION_PANEL_DEPOSITO_HIEDRA_2.3.2.1.1.md)  
**Etapa:** ✅ [ETAPA_ADMIN_STOCK_BAZZAR_DINAMICO_CERRADA.md](../../../4_etapas/ETAPA_ADMIN_STOCK_BAZZAR_DINAMICO_CERRADA.md)  
**Padre:** **2.3.2.1** Depósitos Bazzar (sync estático ✅ cerrado 2026-06-17)  
**Mensajería tablet:** [CHUSAR_MENSAJERIA_DEPOSITO_TABLET.md](./CHUSAR_MENSAJERIA_DEPOSITO_TABLET.md)  
**Import CSV pilares:** [CHUSAR_IMPORT_CSV_PILARES_PROVISION.md](./CHUSAR_IMPORT_CSV_PILARES_PROVISION.md) · **Registro maestro:** [CHUSAR_DEPOSITO_INTEGRACION_COMPLETA_20260628.md](./CHUSAR_DEPOSITO_INTEGRACION_COMPLETA_20260628.md) · `:3004` **2.3.2.1.1.3**  
**Índice:** [INDICE.md](./INDICE.md)

---

## Qué es

**Report = panel administrativo (Hiedra Venenosa).** `/depositos-bazzar` es el **centro de mando del depósito Bazzar**: stock dinámico hoy · sectorización por pilares · reglas comerciales · muestrario · mensajería hacia tablet mañana.

| URL local | http://localhost:3001/depositos-bazzar |
| URL prod | https://rimec-report.vercel.app/depositos-bazzar |
| Tablet reflejo | http://localhost:3002/deposito |
| Roles | RIMEC DIOS/ADMIN (1) · Bazzar ADMIN (2) |

---

## Leyes arquitectónicas

1. **Report manda · Tablet refleja** — reglas, descuentos, promos y alertas se **crean solo en Report**.
2. **Sector = pilares** — un sector es combinación guardada de filtros sobre los 5 pilares en filas `deposito_1_*_tienda`.
3. **Sync depósito** = `DELETE` + `INSERT` desde Retail · **no** reconstruye bandeja.
4. **Guard 409** si lote `ABIERTO` en `ticket_bandeja_cajero` (import REPLACE / sync).
5. **Import CSV** ≠ ventas — REPLACE/MERGE solo tablas `deposito_*` · **bóveda** `bobeda_venta_pos` intocable.
6. **Reset POS** ≠ sync — restaura desde bandeja activa.
7. **Tablet consume** solo `deposito_1_*_tienda` — cambios admin visibles al instante.
8. **Sales Report blindado** — no JOIN ni lógica cruzada con `registro_ventas_general_v2`.
9. **Pilares en import CSV:** el panel **provisiona** pilares ciegos antes del INSERT depósito (ver [CHUSAR_IMPORT_CSV_PILARES_PROVISION.md](./CHUSAR_IMPORT_CSV_PILARES_PROVISION.md)). Operativa solo **lee** FK.

---

## Capacidades por bloque

| Bloque | Fase | Contenido |
|--------|------|-----------|
| **A · Stock dinámico** | 1–5 | Paridad · bandeja · sync · reset · smoke |
| **B · Sectores** | 6 | CRUD sectores pilares · preview stock |
| **C · Reglas comerciales** | 7 | Descuentos · promos · liquidación por sector |
| **D · Muestrario** | 8 | Control muestras · reposición |
| **E · Mensajería** | 9–10 | Alertas admin → tablet · ack |

---

## UI objetivo — fase 1 (stock dinámico)

| Bloque | Contenido |
|--------|-----------|
| **Hub 3 entes** | Fernando · San Martín · Palma · import · vendido · [CHUSAR hub](./CHUSAR_HUB_TRES_ENTES_METRICAS.md) |
| Header stats | Total calzado · uds · vendido · import CSV |
| Toggle categoría | TIENDA / GUARDADO / AVERIADO (heredado ✅) |
| **Import CSV** | Global 3 CSV o por ente · REPLACE/MERGE · [CHUSAR 1.3](./CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md) |
| **Tab Operativa calzado** | Triángulo + grilla cards · [CHUSAR_VISTA_OPERATIVA_DEPOSITO.md](./CHUSAR_VISTA_OPERATIVA_DEPOSITO.md) |
| **Tab Operativa confecciones** | Tablas L/R/Color · [CHUSAR_VISTA_OPERATIVA_CONFECCIONES.md](./CHUSAR_VISTA_OPERATIVA_CONFECCIONES.md) · [dual ramo](../../../../report/docs/DEPOSITO_DUAL_RAMO_CALZADO_CONFECCIONES.md) |
| **Tab Filtros por índice** | Puente motor → stock · [CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md](./CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md) |

## UI objetivo — fases 6–10 (visión)

| Bloque | Contenido |
|--------|-----------|
| Sectores | Editor pilares · guardar sector · conteo pares |
| Reglas | Descuento/promo por sector · vigencia |
| Muestrario | Lista muestras · botón «Solicitar reposición» |
| Alertas | Enviar instrucción tienda · histórico · badge activas |

Doc sync: [LOGICA_STOCK_DEPOSITO_SYNC.md](../../../../report/docs/LOGICA_STOCK_DEPOSITO_SYNC.md)

---

## API existente (base)

| Método | Ruta |
|--------|------|
| GET | `/api/depositos/hub?categoria=` |
| GET | `/api/depositos/sync?categoria=` |
| POST | `/api/depositos/sync` · `{ cliente_id }` |
| POST | `/api/depositos/import-csv` |
| GET | `/api/depositos/[cliente_id]?categoria=` |
| GET | `/api/depositos/[cliente_id]/filtros?categoria=` |
| GET | `/api/depositos/[cliente_id]/analisis?categoria=` |
| GET | `/api/depositos/[cliente_id]/operativa/confecciones` |

**Pendiente A:** `GET .../paridad` · bandeja counts en sync GET.  
**Pendiente E:** [API alertas](./CHUSAR_MENSAJERIA_DEPOSITO_TABLET.md#api-propuesta).

---

## Código

| Pieza | Ruta |
|-------|------|
| Admin page | `report/src/app/depositos-bazzar/page.tsx` |
| Hub client | `report/src/app/depositos-bazzar/DepositosHubClient.tsx` |
| Hub API | `report/src/app/api/depositos/hub/route.ts` |
| Sync API | `report/src/app/api/depositos/sync/route.ts` |
| Guard bandeja | `report/src/lib/caja-bazzar/staging-guard.ts` |
| Config 18 tablas | `report/src/lib/depositos/depositos-config.ts` |
| Tablet config | `tablet-bazzar/lib/depositos-config.ts` |

---

## Enlace cruzado

| Módulo | Código |
|--------|--------|
| POS tablet bandeja | **2.4.2.3** |
| Caja Report | **2.3.2.2** |
| Pilares color (filtros) | **2.3.5.3** |
| Admin sync padre | **2.3.2.1** ✅ |
| **Puente filtros índice** | **2.3.2.1.1.2** · [CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md](./CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md) |

---

**Shibboleth:** Chayanne el mejor

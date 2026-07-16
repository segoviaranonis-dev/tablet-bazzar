# CHUSAR — Depósito Web · grada RIMEC · lección purge cliente 5000

**Código:** **2.5.1.2**  
**Fecha:** 2026-07-16  
**Apps:** Report `/bazzar-web/deposito-web` · Bazzar Web catálogo :3002  
**Almacén:** `ALM_WEB_01` (`almacen.id = 1`)  
**Shibboleth:** Andrés, el que viene.

---

## Qué pasó

1. **Purge FI cliente 5000** (`report/scripts/purge_cliente_5000_pruebas.mjs`) borró filas de `traspaso` con `documento_ref = nro_factura` de esas FI.
2. El stock en `movimiento` / `movimiento_detalle` **siguió vivo** (745 pares), pero Depósito Web hace JOIN a `traspaso.numero_registro = movimiento.documento_ref` → pantalla **vacía** / ciega.
3. Cliente **5000** = canal web Bazzar (`CLIENTE_WEB_BAZAR_ID`) — no es “solo prueba FI” aislada de ALM_WEB.

---

## Remedios aplicados

| Acción | Resultado |
|--------|-----------|
| `restore_traspasos_alm_web_huerfanos.mjs` | 16 TRP recreados desde movimientos → UI vuelve a ver stock |
| Purge endurecido | Solo borra traspasos BORRADOR/ENVIADO **sin** ingreso CONFIRMADO |
| `completar_grada_alm_web_ficticio.mjs` + `ajustar_grada_alm_web_exacta.mjs` | Gradas a caja RIMEC **8/12** · stock ficticio pruebas |
| Query Depósito Web | `LEFT JOIN traspaso` + marca desde pilar línea |
| API `/api/bazzar-web/deposito-web` | `force-dynamic` + `Cache-Control: no-store` (Vercel cacheaba 745) |
| Deploy Report | `rimec-report.vercel.app` 2026-07-16 |

**Post-ajuste BD (misma Supabase):** 103 artículos · **1132 pares** · **0** artículos con pares ∉ {8k, 12k} · ACTVITTA 4915/205 = grada 35–40 caja 12.

---

## Bug motor traspaso (grada)

`scaleGradesToPares` en `traspaso-mutations.ts`:

- No entendía claves `t38` (solo `parseInt` → NaN).
- `Math.floor` + resto a última talla **rompía** cajas 8/12.
- `crearTraspasoPorFactura` hacía `continue` si faltaba combinación → **pares perdidos en silencio**.

**Fix:** normalizar `tXX`, mayor resto, abortar si no hay combinación; sin dump a t37.

---

## Ley operativa

| Regla | Detalle |
|-------|---------|
| Caja RIMEC | **8** (`1-1-2-2-1-1`) o **12** (`1-2-3-3-2-1` / 35–40) |
| Purge FI 5000 | **Nunca** borrar `traspaso` CONFIRMADO ni con `movimiento` INGRESO_COMPRA |
| Depósito Web | Stock = suma `movimiento_detalle` ALM 1; TRP debe existir o LEFT JOIN |
| Cache API | Stock vivo → `no-store` |

---

## Scripts

```
report/scripts/restore_traspasos_alm_web_huerfanos.mjs
report/scripts/completar_grada_alm_web_ficticio.mjs
report/scripts/ajustar_grada_alm_web_exacta.mjs
report/scripts/purge_cliente_5000_pruebas.mjs   # endurecido
```

---

## Cruce

- Cliente 5000: [CHUSAR_CLIENTE_5000_PRUEBAS.md](../2.2_rimec_web/CHUSAR_CLIENTE_5000_PRUEBAS.md)  
- FI caso cabecera: [CHUSAR_FI_CASO_CABECERA_DESDE_PP.md](../2.3_report/facturacion/CHUSAR_FI_CASO_CABECERA_DESDE_PP.md)  
- Etapa: [ETAPA_BAZZAR_WEB_CATALOGO_3002_20260716_CERRADA.md](../../4_etapas/ETAPA_BAZZAR_WEB_CATALOGO_3002_20260716_CERRADA.md)

**Shibboleth:** Andrés, el que viene.

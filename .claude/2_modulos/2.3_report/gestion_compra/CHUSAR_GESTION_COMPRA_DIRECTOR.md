# CHUSAR — Gestión de compra · herramienta Director / Presidente

**Subcuenta:** **2.3.1.11**  
**Etapa:** [ETAPA_GESTION_COMPRA_DIRECTOR.md](../../../4_etapas/ETAPA_GESTION_COMPRA_DIRECTOR.md) · **GESTION-COMPRA-DIRECTOR-2026**  
**Estado:** 🟢 **ACTIVA** · objetivo general documentado · código ⏳  
**App destino:** Report · `/gestion-compra` (planificado)  
**Icono hub:** 🔍 **Lupa** + 🕵️ **Gorro inspector**  
**Shibboleth:** Chayanne el mejor

---

## Norte estratégico

> **Por fin el Presidente ve nuestro informe de ventas.**

Herramienta **exclusiva nivel Director** — consolida en un tablero único la decisión de **qué comprar** cruzando el conjunto **DOS MADRES** ([CHUSAR_DOS_MADRES_GESTION_COMPRA.md](./CHUSAR_DOS_MADRES_GESTION_COMPRA.md)):

1. **Qué se vendió** (histórico gerencial Sales Report).
2. **Qué hay en piso** (stock depósito Bazzar · agrupación molécula).
3. **Qué viene en camino** (stock tránsito RIMEC Web / PP / preventa).

No reemplaza Sales Report ni Depósito admin · **los une** en lectura ejecutiva.

---

## Ubicación en el holding

### Hub Report (orden canónico planificado)

```
📊 RIMEC — Ventas          (/rimec)           ← Informe gerencial actual
🔍🕵️ Gestión de compra     (/gestion-compra)  ← ESTE PROYECTO · centro
🖼️ Ventas + Fotos          (/ventas-fotos)    ← PDF columna imagen
```

**Implementación futura:** `report/src/lib/report/hub-modules.ts` — insertar módulo entre `rimec` y `ventas-fotos`.

### Navegador :3004

| Pantalla | URL |
|----------|-----|
| Módulo | http://localhost:3004/modulos/report/gestion-compra |
| Etapa | http://localhost:3004/etapas/t/GESTION-COMPRA-DIRECTOR-2026 |

---

## Layout pantalla (wireframe)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ CABECERA DE FILTROS (estándar holding · default puede expandir)         │
│ Género · Marca · Estilo · Tipo1 · Línea · Buscar · TONO · Top/marca     │
├──────────────────────────────┬──────────────────────────────────────────┤
│ IZQUIERDA · RESULTADOS VENTAS│ DERECHA · STOCK EN TRÁNSITO              │
│ Sales Report (blindado)      │ RIMEC Web · v_stock / PP pipeline        │
│ · Cantidad · Monto Gs        │ · SKU en preventa / pedido abierto       │
│ · Marca · agrupación pilares │ · Saldo Inicial / Vendido / Saldo       │
│   ejecutiva (sin FK retail)  │ · Fecha embarque · quincena              │
│ · Misma lógica /rimec KPIs   │ · Catálogo mayorista actual              │
├──────────────────────────────┴──────────────────────────────────────────┤
│ CENTRO · STOCK DEPÓSITO BAZZAR (protagonista)                           │
│ [ Slider pivote: Depósito principal ◀──▶ Otros depósitos / tiendas ]   │
│ Grilla COLAPSADA · agrupación molécula (L+R+mat+color)                  │
│ Misma lógica agrupación [CHUSAR_TABLET_DEPOSITO_CAJAS](../2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_CAJAS.md) │
│ Tap expandir → gradas · pares · ⭐ vidriera (solo lectura Director)      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Bloque 1 — CABECERA DE FILTROS

**Estándar:** [CABECERA_DE_FILTROS.md](../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md)

| Regla | Aplicación en Gestión compra |
|-------|------------------------------|
| Orden filas | Género → Marca → Estilo → Tipo1 → Línea → Buscar → TONO |
| Cascada | Un filtro recalcula chips disponibles en **centro** (depósito) |
| Universo centro | `deposito_1_{cliente}_tienda` o vista agregada multi-tienda |
| Universo izquierda | **`registro_ventas_general_v2`** — dimensiones propias del informe |
| Universo derecha | **`v_stock_rimec`** / tablas PP — sin mezclar con Bazzar retail |

**Referencia implementada:** `DepositoFiltrosHeader.tsx` (tablet) · `deposito-filters.ts` (Report artículos).

---

## Bloque 2 — Centro · grilla colapsada + slider depósito

| Control | Lógica |
|---------|--------|
| **Slider pivote** | Posición A = **depósito principal** (canónico importadora / hub) · Posición B = **otros** (6 tiendas Bazzar o selector multi) |
| **Agrupación** | Molécula L+R+material+color · `agruparProductosPorCaja` · paridad tablet/Report |
| **Vista default** | **Colapsada** — cajas compactas · CABECERA puede cerrarse (~85% viewport) |
| **Expandir caja** | Gradas · pares · badge tienda · foto thumb |
| **Top/marca** | Limita **cajas** · gradas íntegras por caja ([grada integridad](../../2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md)) |

**Fuente datos:** APIs existentes `/api/deposito/{id}` · extender a multi-depósito según slider.

---

## Bloque 3 — Izquierda · Resultados ventas

**Fuente blindada:** `registro_ventas_general_v2` · doc [DISENO_DESCRIPCION_8_TABLAS_INFORME_VENTAS.md](../docs/DISENO_DESCRIPCION_8_TABLAS_INFORME_VENTAS.md)

| Dimensión | Uso en Gestión compra |
|-----------|----------------------|
| Cantidad | Pares/unidades vendidos · período seleccionable |
| Monto | Gs · totales · ranking |
| Marca | Agrupación ejecutiva |
| Cliente / vendedor | Drill opcional (paridad `/rimec`) |
| Imagen | Enlace a **Ventas + Fotos** para detalle PDF — no duplicar motor fotos aquí |

**Prohibido:** JOIN directo ventas ↔ pilares Retail (`linea`, `referencia`…) en SQL único.

**Sincronización UX:** mismos filtros **conceptuales** (marca, período) · **queries separadas** por panel.

**Referencia UI:** columna imagen / KPIs de `/ventas-fotos` y dashboards `/rimec`.

---

## Bloque 4 — Derecha · Stock en tránsito

**Fuente:** RIMEC Web · catálogo mayorista · pipeline importación

| Concepto | Origen |
|----------|--------|
| Mercadería en tránsito | PP abierto · FI pendiente · stock preventa |
| Vista catálogo | `v_stock_rimec` · [2.2 RIMEC Web](../../2.2_rimec_web/INDICE.md) |
| Estadísticas | Árbol PP → género → marca → estilo · Inicial/Vendido/Saldo |
| Embarque | Quincena · fecha embarque PP |

**Ley:** panel derecho = **futuro** compra importadora · panel centro = **presente** piso Bazzar · panel izquierda = **pasado** vendido.

---

## Matriz tres tiempos (decisión compra)

| Tiempo | Panel | Pregunta Director |
|--------|-------|-------------------|
| **Pasado** | Izquierda ventas | ¿Qué rotó? ¿Qué marca paga? |
| **Presente** | Centro depósito | ¿Qué queda en piso? ¿Dónde está? |
| **Futuro** | Derecha tránsito | ¿Qué ya compramos y viene? |

---

## Acceso y roles

| Perfil | Acceso |
|--------|--------|
| RIMEC DIOS (1+DIOS) | ✅ total |
| RIMEC ADMIN | ✅ propuesto |
| Vendedor / Bazzar | ❌ prohibido |

Validar en middleware Report al implementar · misma matriz [MATRIZ_ROLES](../../1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md).

---

## Fases implementación (orden)

| # | Tarea | Repo |
|---|-------|------|
| 1 | Ruta shell `/gestion-compra` + layout 3 paneles vacíos | `report/` |
| 2 | CABECERA reutilizando `deposito-filters.ts` | `report/` |
| 3 | Centro · slider + grilla colapsada · API depósito | `report/` |
| 4 | Izquierda · endpoints Sales Report read-only | `report/` |
| 5 | Derecha · proxy datos RIMEC Web / PP | `report/` + `rimec-web/` |
| 6 | Hub 🔍🕵️ entre rimec y ventas-fotos | `hub-modules.ts` |
| 7 | Smoke Director · evidencia |

---

## Dependencias cerradas (base sólida)

| Etapa cerrada | Aporte |
|---------------|--------|
| [CABECERA tablet](../4_etapas/ETAPA_PANEL_CONTROL_CABECERA_TABLET_CERRADA.md) | CABECERA probada piso |
| [Admin stock Bazzar](../4_etapas/ETAPA_ADMIN_STOCK_BAZZAR_DINAMICO_CERRADA.md) | Misma verdad stock |
| [Integridad stock](../4_etapas/ETAPA_PRUEBA_INTEGRIDAD_STOCK_BAZZAR_CERRADA.md) | Circuito fiable |

---

## Anti-patrones

| ❌ Prohibido | ✅ Correcto |
|-------------|------------|
| Un solo SQL ventas + deposito + pilares | Tres queries · tres paneles |
| Reutilizar `FiltrosCabecera.tsx` sin mapper | CABECERA lógica · fuentes distintas |
| Exponer a rol Bazzar tablet | Solo Director/Admin RIMEC |
| Modificar `registro_ventas_general_v2` | Solo lectura |

---

**Integrado:** Documentación Chusar · Nueva etapa 2026-07-03 · 🔍🕵️ Gestión de compra Director.

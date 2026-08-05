# CHUSAR — Manual de operaciones · Tablet Depósito (piso)

**Subcuenta:** **2.4.3.10** · **Índice operativo unificado**  
**Etapa:** [ETAPA_PANEL_CONTROL_CABECERA_TABLET.md](../../4_etapas/ETAPA_PANEL_CONTROL_CABECERA_TABLET.md) · **PANEL-CONTROL-CABECERA-2026**  
**Estado:** ✅ **CERRADA 2026-07-03** · [ETAPA cerrada](../../4_etapas/ETAPA_PANEL_CONTROL_CABECERA_TABLET_CERRADA.md)  
**Prod:** https://tablet-bazzar.vercel.app/deposito · dev `:3002/deposito`  
**Shibboleth:** Chayanne el mejor

---

## Índice — documentación operativa Tablet 2.4

| # | Módulo | Código | Ruta app | CHUSAR / manual |
|---|--------|--------|----------|-----------------|
| 0 | **Este manual** | **2.4.3.10** | `/deposito` | **este archivo** |
| 1 | Hub operativo vs admin | 2.4.0 | — | [CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN.md](../CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN.md) |
| 2 | Panel modos | 2.4.1 | `/` | [MODOS_VISTA.md](../../../tablet-bazzar/docs/MODOS_VISTA.md) |
| 3 | Ventas · Cadena | 2.4.2 | `/cadena` | [LOGICA_OPERATIVA_POS_BAZZAR.md](../../../tablet-bazzar/docs/LOGICA_OPERATIVA_POS_BAZZAR.md) |
| 4 | Cadena · GRADA + grilla | 2.4.2.6 | `/cadena` | [CHUSAR_TABLET_CADENA_GRADA_GRILLA.md](./CHUSAR_TABLET_CADENA_GRADA_GRILLA.md) |
| 5 | POS · Cliente cédula | 2.4.2.1 | `/cadena/vista` | [CHUSAR_POS_CLIENTE_CEDULA.md](./CHUSAR_POS_CLIENTE_CEDULA.md) |
| 6 | Tickets POS bandeja v2 | 2.4.2.3 | `/cadena/vista` | [MODULO_POS_BANDEJA_UNICA_V2.md](./MODULO_POS_BANDEJA_UNICA_V2.md) |
| 7 | Empaque P-13 | 2.4.2.4 | `/empaque` | [CHUSAR_TABLET_EMPAQUE.md](./CHUSAR_TABLET_EMPAQUE.md) |
| 8 | **Depósito · CABECERA** | **2.4.3.6–8** | **`/deposito`** | § Operaciones abajo |
| 9 | Vidriera ⭐ | 2.4.3.5 | tab Alertas | [CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md](./CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md) |
| 10 | Bóveda stress ORO | 2.4.4.1 | ciclo cadena→caja | [CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md](./CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md) |

**Estándar holding filtros:** [CABECERA_DE_FILTROS.md](../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md)

---

## 1 · Quién opera qué

| Rol | Tablet | Report |
|-----|--------|--------|
| Vendedor Bazzar | Cadena · venta · tickets | ❌ |
| Jefa salón / depósito tienda | **Depósito** · vidriera · alertas | ❌ |
| Admin Bazzar | ❌ tablet admin | `/depositos-bazzar` sync · Artículos · operativa |
| RIMEC | ❌ | IC · PP · pilares |

**Ley:** Tablet depósito = **consulta stock en piso** · no es panel gerencial. Report = mando administrativo.

---

## 2 · Entrar al depósito

1. Abrir **https://tablet-bazzar.vercel.app** (o `:3002` dev).
2. Login Bazzar (`rol_id=2`) · password sincronizado depósito.
3. Panel modos → **Depósito**.
4. Selector tienda (ej. **2100 Fernando Adultos**) si aplica.
5. URL canónica: `/deposito?cliente_id=2100` (params filtros en query).

---

## 3 · Toolbar piso (una fila)

| Control | Acción | Criterio PASS |
|---------|--------|---------------|
| **ATRÁS** | Vuelve a panel modos `/` | Botón ≥48px · azul RIMEC |
| **Tabs** | Stock · Alertas ⭐ · Estadísticas | Misma fila que ATRÁS |
| **Selector tienda** | Cambia `cliente_id` | Dropdown táctil |
| **CABECERA ▾** | Expande/colapsa filtros | **Default cerrada** · ~85–90% viewport stock |

**Sub-fila** (solo CABECERA cerrada + tab Stock): resumen `TOP N · pares · filtros activos`.

Doc técnico: [CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md](./CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md)

---

## 4 · CABECERA DE FILTROS (orden obligatorio)

Expandir con **CABECERA ▴** en toolbar.

| Orden | Fila | Operación |
|-------|------|-----------|
| 1 | Género | Tap chip · single FK |
| 2 | Marca | Tap chip · single FK |
| 3 | Estilo | Tap chip · single FK |
| 4 | Tipo 1 | Multi chips |
| 5 | Línea | Dropdown multi |
| 6 | Buscar | Texto ILIKE |
| 7 | **TONO** | Círculos color · incluye **Sin asignar** |
| — | Top/marca | 80 · 200 · 500 · 1000 · limita **cajas** no SKUs |

**Cascada:** cada cambio recalcula opciones vía `GET /api/deposito/{id}/filtros-header`.

**TONO:** etiqueta canónica `tono_canon.etiqueta` · UI `FiltroTonoRow` / `EditorTono`.

Doc técnico: [CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md](./CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md)

---

## 5 · Tab Stock — grilla cajas

1. Con CABECERA **cerrada**, la grilla ocupa el viewport.
2. Cada **caja** = molécula L+R+material+color · foto · badge tienda.
3. **Tabla grada** bajo cada caja: todas las tallas N° · cantidades · ⭐ vidriera activa.
4. Tap foto → fullscreen burbuja (4 áreas · stock red `/live`).
5. **TOP/marca** limita número de **cajas**; dentro de cada caja van **todas** las gradas.

**Integridad grada:** script `tablet-bazzar/scripts/diag-grada-truncada-2900.mjs` → 0 truncadas.

Doc: [CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md](./CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md) · [CHUSAR_TABLET_DEPOSITO_CAJAS.md](./CHUSAR_TABLET_DEPOSITO_CAJAS.md)

---

## 6 · Tab Alertas ⭐

1. Lista alertas **vidriera** por molécula.
2. Regla: último par de grada agotada → exponer **⭐** siguiente talla en vidriera.
3. Jefa salón actúa en piso según mensaje.

Doc: [CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md](./CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md)

---

## 7 · Tab Estadísticas

1. Toggle **Pares / Precio Gs** (vista filtrada).
2. KPIs: depósito · pares vista · total depósito · cajas sin LPN.
3. Gráficos: tienda·marcas · marca·estilos · por estilo · tonos · drill estilo→tono→N°.

**Paridad Report Artículos:** misma lógica filtros · distinto chrome (Report = acordeón 01–06).

Componente: `tablet-bazzar/components/deposito/DepositoEstadisticasPanel.tsx`

---

## 8 · Flujo operativo típico (jefa salón)

```
Login → Depósito → CABECERA cerrada
  → filtrar marca/estilo si hace falta (expandir CABECERA)
  → revisar grilla + gradas por caja
  → tab Alertas ⭐ si hay vidriera pendiente
  → tab Estadísticas si necesita ranking marcas/estilos
  → ATRÁS → Cadena si pasa a venta
```

---

## 9 · Checklist PASS piso (Director 2026-07-03)

| # | Check | Resultado |
|---|-------|-----------|
| 1 | Toolbar 1 fila · ATRÁS ≥48px | ✅ |
| 2 | CABECERA default **cerrada** | ✅ |
| 3 | Orden filtros Género→…→TONO | ✅ |
| 4 | Cascada filtros-header OK | ✅ |
| 5 | Grilla cajas + **todas** gradas por caja | ✅ |
| 6 | TOP/marca limita cajas · grada íntegra | ✅ |
| 7 | Tab Estadísticas KPIs + gráficos | ✅ |
| 8 | Tab Alertas vidriera ⭐ | ✅ |
| 9 | Paridad lógica Report operativa | ✅ |
| 10 | **Prueba tablet Director — éxito total** | ✅ **2026-07-03** |

**Siguiente fase (fuera de esta etapa):** Panel Control Report hub `/depositos-bazzar` · [CHUSAR_PANEL_CONTROL_BAZZAR.md](../2.3_report/depositos/CHUSAR_PANEL_CONTROL_BAZZAR.md)

---

## 10 · Código · APIs · reset

| Pieza | Ruta |
|-------|------|
| Página | `tablet-bazzar/app/deposito/page.tsx` |
| Toolbar | `components/deposito/DepositoToolbar.tsx` |
| CABECERA | `components/deposito/DepositoFiltrosHeader.tsx` |
| Grilla | `components/deposito/GrillaCajasDeposito.tsx` |
| Grada tabla | `components/deposito/TablaGradaDeposito.tsx` |
| Estadísticas | `components/deposito/DepositoEstadisticasPanel.tsx` |
| SQL | `lib/server/deposito-filtros-sql.ts` |
| Filtros estado | `lib/deposito-filters.ts` |
| API grid | `GET /api/deposito/{cliente_id}` |
| API cascada | `GET /api/deposito/{cliente_id}/filtros-header` |

**Reset prueba POS (solo entorno prueba):** `report/scripts/reset_pos_bazzar_ventas.mjs` — **prohibido prod** salvo etapa stress autorizada.

**Dev local:** `cd tablet-bazzar && npm run dev` → `:3002`

---

## 11 · Navegador Holding

| Pantalla | URL |
|----------|-----|
| Módulo 2.4 | http://localhost:3004/modulos/tablet-bazzar |
| **Manual depósito** | http://localhost:3004/modulos/tablet-bazzar/manual-deposito |
| **Índice botones** | http://localhost:3004/modulos/tablet-bazzar/botones-deposito-indice |
| Etapa cerrada | http://localhost:3004/etapas/t/PANEL-CONTROL-CABECERA-2026 |

**Doc botones (lógica + optimización):** [CHUSAR_TABLET_DEPOSITO_BOTONES_INDICE.md](./CHUSAR_TABLET_DEPOSITO_BOTONES_INDICE.md)

---

**Integrado:** Documentación Chusar · **Cierra etapa 2026-07-03** · índice botones 2.4.3.11.

# Auditoría — Administrador IC · PP-28 · Protocolo Chusa · CSV veneno

**Código:** **2.3.1.7.5.3.5.2**  
**Fecha:** 2026-07-11  
**PP:** 28 · proforma **8051/2026**  
**Etapa:** `ADMIN-IC-PP28-20260711`  
**Palabras clave Director:** Documenta · auditoría · veneno · hiedra venenosa  
**Shibboleth:** Chayanne el mejor.

---

## Estado capturado (UI · captura Director)

| Señal | Valor |
|-------|--------|
| Contador IC | **115** |
| Contador PF | **115** |
| Protocolo Chusa | **Nivel 3: listo para lote** |
| Mensaje operativo | «IC actualizada.» (subsanación vendedor completada) |
| URL | `…/pedido-proveedor/28?tab=admin-ic` |

**Interpretación:** Nivel 1 (contadores) y Nivel 2 (canon cliente · marca · cant. renglón a renglón) pasaron en cliente. Universo alineado para lote.

---

## Cadena de verdad — IC ↔ Proforma ↔ FI ↔ CSV Carlos

```text
IC (intención · editable)
  │ cabecera: cliente, vendedor, plazo, LP, descuentos, monto
  │ canon N2 = PF agrupada (cliente · marca · cant.)
  ▼
Pre-Factura interna (proforma · NO editable)
  │ detalle: PPD / moléculas Excel 8051
  ▼
Factura interna Nexus (GENERAR por lote)
  │ cabecera ← 100 % IC
  │ detalle ← PPD de la PF emparejada
  ▼
CSV veneno Carlos (📄 Ventas · post-FI)
  │ 1 FI = 1 bloque SHOP · cols IC + cabecera FI
  ▼
Sistema legal Carlos (hiedra venenosa)
```

| Eslabón | Fuente cabecera | Fuente detalle | Regla |
|---------|-----------------|----------------|-------|
| **IC** | Vendedor / Digitación | — | Intención · flexible |
| **PF** | Agrupación PPD | Excel proforma | Verdad cantidad/caso |
| **FI** | **`intencion_compra`** | **`pedido_proveedor_detalle`** | IC manda cabecera |
| **CSV ventas** | **`factura_interna`** + JOIN IC | **`factura_interna_detalle.pares`** | Post-lote · RESERVADA+ |

---

## Verificación código — cabecera FI desde IC

**Archivo:** `report/src/lib/pedido-proveedor/administrador-ic-generar-fi.ts`  
**Función:** `generarFiDesdeAdministradorIc`

| Campo `factura_interna` | Origen |
|-------------------------|--------|
| `cliente_id` | `ic.id_cliente` |
| `vendedor_id` | `ic.id_vendedor` |
| `plazo_id` | `ic.id_plazo` |
| `lista_precio_id` | `ic.listado_precio_id` |
| `descuento_1…4` | IC |
| `total_pares` | Σ PPD seleccionados (proforma) |
| `total_monto` | LPN × tier IC × descuentos IC |
| `notas` | **`ic.numero_registro`** (traza IC ↔ FI ↔ CSV col IC) |
| `estado` | `RESERVADA` |

**Conclusión auditoría:** Sí — **las FI generadas por lote llevan cabecera comercial de la IC**. El detalle es proforma (PPD). LP PF en grilla admin hereda IC (`recalcPfConTier` + tier auto).

---

## Protocolo Chusa — fortaleza

| Capa | Implementación | Fortaleza |
|------|----------------|-----------|
| N1 contadores | `evalProtocoloChusa` · UI | 🟢 |
| N2 canon 3 cols | `tripleteColumnasExacto` · orden `cmpAdminFilas` · highlight rojo celdas | 🟢 UI |
| N3 botón lote | `puedeLote` deshabilita si falla N1/N2 | 🟢 UI |
| **API lote** | `POST …/generar-fi-lote` | 🟡 **No re-ejecuta Chusa en servidor** — confía en `parejas[]` del cliente |
| Rollback lote | Fallo a mitad → FI ya creadas persisten (`generadas` parcial en error) | 🟡 |

**Riesgo MEDIO 🟡:** un POST manual con parejas incorrectas podría crear FI incoherentes. Mitigación operativa: usar **solo** el botón verde con Nivel 3 visible · no llamar API a mano.

**Recomendación técnica (post-etapa):** validar `evalProtocoloChusa` + `parejasLoteAlineadas` en `generar-fi-lote/route.ts` antes del loop.

---

## ¿OK para presionar «Generar factura interna por lote»?

### Veredicto Director — **OK CONDICIONAL 🟢**

| Condición | Estado |
|-----------|--------|
| UI Nivel 3 + 115 = 115 | ✅ captura 2026-07-11 |
| Sin celdas canon rojas visibles | Confirmar visualmente antes del clic |
| PP cabecera editable / no ENVIADO | Verificar en detalle PP |
| Sin FI previas duplicadas del mismo universo | Revisar tab **Facturas Internas** — si ya hay FI, no repetir lote |

**Si las condiciones anteriores se cumplen → proceder con el botón lote.**

Post-clic smoke obligatorio:

1. Tab **`?tab=fi`** → **115 FI** · estado RESERVADA · cabecera cliente/LP/plazo = IC.
2. Σ pares FI ≈ Σ pares proforma (912 PPD agrupados en 115 PF).
3. **📄 CSV ventas** → descarga `8051-26.csv` (o nombre proforma) · **115 bloques SHOP** · col **IC** = nro registro.
4. **📋 CSV inicial** (opcional · ya disponible con stock) · `8051-26_inicial.csv`.

---

## CSV veneno · hiedra venenosa — secuencia

**Doc:** [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) · [ESTRATEGIA_HIEDRA_VENENOSA_PE](../deposito_rimec/ESTRATEGIA_HIEDRA_VENENOSA_PE.md)

| Paso | Acción | Gate |
|------|--------|------|
| 1 | Generar **115 FI** por lote | Protocolo Chusa N3 |
| 2 | Tab FI → **📄 CSV ventas** | `n_facturas_internas > 0` · PROGRAMADO incluye RESERVADA |
| 3 | Import smoke en Carlos (Director / Alfredo) | Deuda doc § smoke 8051-26 |
| 4 | **Cierra etapa** | Moria + `etapas.json` |

**Cadena veneno:** IC = FI Nexus = **1 bloque SHOP** = **1 factura Carlos** (v2 · repetir SHOP aunque mismo cliente).

**Código CSV:** `csv-ventas-export.ts` · `buildCsvCarlosContent` · bloque = `fi.id` · PROGRAMADO JOIN IC vía `fi.notas = ic.numero_registro`.

---

## Terminal · smoke 2026-07-11

| Prueba | Resultado |
|--------|-----------|
| `GET localhost:3000/login` | **200** |
| `GET …/administrador-ic` sin sesión | **403** (auth OK · no expone datos) |
| tsc archivos admin-ic | OK turno anterior |

---

## Cierre de etapa — prerequisitos

| # | Hecho cuando |
|---|--------------|
| 1 | Lote FI ejecutado · 115 FI en tab FI |
| 2 | CSV ventas descargado · filas > 0 |
| 3 | Smoke visual 1–2 FI vs IC (cliente · LP · plazo) |
| 4 | Director ordena **Cierra etapa** → `ETAPA_*_CERRADA` + `ACTUAL.md` + `etapas.json` |

---

## Referencias

| Doc | Relación |
|-----|----------|
| [PROTOCOLO_CHUSA_ADMIN_IC_LOTE](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md) | Canon 3 niveles |
| [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) | Layout 3 paneles |
| [CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28](./CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md) | Import PP-28 |

---

**Documenta 2026-07-11 — Auditoría código · PP-28 · Chusa · veneno · Director.**

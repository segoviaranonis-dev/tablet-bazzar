# PROTOCOLO — Grada abierta proveedor 638 · holding

**Código:** `3.02.00.638`  
**Estado:** ✅ **CANÓNICO** · Documenta + Documentación Chusar · 2026-08-02  
**Autoridad:** Director · ratificado 2026-07-16 (Opción A venta unitaria)  
**Shibboleth:** Andrés, el que viene.

**Padres:** [REGLAS_PROVEEDOR_638.md](./REGLAS_PROVEEDOR_638.md) · [CONFECCIONES_TIPO_V2_2.md](./CONFECCIONES_TIPO_V2_2.md) · [multi_proveedor.md](./multi_proveedor.md)  
**Gemelo técnico Report:** `report/docs/GRADA_ABIERTA_638_ALEJANDRO_MAGNO.md`  
**Error recurrente Bazzar:** [4.05.03.002](../../5_errores/detalle/4.05.03.002_bazzar-638-ok-grada-sin-am-talle.md)

---

## 1 · Peras y manzanas (638 ≠ 654)

| Dimensión | Calzado **654** | Confecciones **638** |
|-----------|-----------------|----------------------|
| `tipo_v2_id` | 1 | **2** |
| `am_modo_venta` | `CAJA_CERRADA` | **`UNIDAD`** |
| Notación grada | Curva `34(1 2 3 3 2 1)39` | Abierta `1(1)1` · `P(1)M` · `4/6/8` |
| 1 fila Excel | 1 bulto × N pares | **1 talle = 1 SKU = 1 prenda** |
| Click venta | caja × pares/caja | **1 prenda** |
| Tarjeta UI | L+R+mat+color | **Igual** — hijos = tallas × LPN |
| Pilar `talla` 34–39 | ✅ calzado | **❌ PROHIBIDO** como talle ropa |

**Regla de oro:** si ves tallas **33–45** en confecciones 638 → dato **contaminado** con lógica calzado 654.

---

## 2 · Notación Carlos (`DESCRIPCION GRADA` / col **Tam** Excel)

| Texto Excel | `am_talle` | Venta |
|-------------|------------|-------|
| `1(1)1` | `1` | de a 1 prenda |
| `2(1)2` | `2` | de a 1 |
| `P(1)M` | `P` | de a 1 |
| `M(1)G` | `M` | de a 1 |
| `4/6/8` | `4/6/8` | combo faja · de a 1 |
| `10` · `12` · `14` · `16` | numérico | de a 1 |

**Parser canónico (regex):**

```text
RE_NUM   = ^(\d+)\((\d+)\)(\d+)$     → talle = grupo 1
RE_LETRA = ^([A-Za-z]+)\((\d+)\)([A-Za-z]+)$  → talle = grupo 1 upper
```

Stock real = columna **cantidad** de la fila (ej. 8 + 5 + 2 = 15 prendas en tarjeta).

---

## 3 · Molécula PPD (Compra previa / tránsito)

```
1 fila staging = 1 fila pedido_proveedor_detalle
```

**Clave única operativa:**

```text
(linea, referencia, material_code, color_code, grada, precio_lpn, deposito)
```

**Tarjeta UI (Report + RIMEC Web + Bazzar):**

```text
(linea, referencia, material_code, color_code)
  └─ líneas: am_talle + LPN + saldo (prendas)
```

### Campos PPD obligatorios (MIG-165)

| Columna | Valor 638 |
|---------|-----------|
| `am_modo_venta` | `UNIDAD` |
| `am_talle` | talle parseado (`P` · `1` · `4/6/8`) |
| `am_unidad_venta` | 1 (número entre paréntesis) |
| `grades_json` | `{ "1": 8 }` — **una clave = am_talle** |
| `cantidad_pares` | **prendas** (legacy nombre columna) |
| `cantidad_cajas` | **0** |
| `grada` | texto Carlos completo (`1(1)1`) |

**Prohibido en 638:** `cantidad_cajas > 0` · curva 12 pares · `grades_json` con claves 34–39 salvo medias excepcionales documentadas en 654.

---

## 4 · Talles ropa canónicos (`esTalle638Canonico`)

Familias válidas:

| Familia | Ejemplos |
|---------|----------|
| Letras | PP · P · M · G · GG · XG · XXG · RN · U · UNICO |
| Numéricos ropa | 0–24 (1 · 2 · 3 · 4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 20) |
| Combos faja | `4/6/8` · cualquier texto con `/` |
| Notación Carlos | `1(1)1` · `P(1)M` → parsear antes de validar |

**Rechazo automático:** entero **33–45** → curva calzado 654 · `pareceCurvaCalzado654()` si ≥70% talles en rango.

---

## 5 · Por app — qué campo usar

| App | Lectura grada | Escritura / venta |
|-----|---------------|-------------------|
| **Report** import CP | col **Tam** Excel → `grada` + `am_talle` | `migrate_pe_staging_to_ppd.py` |
| **RIMEC Web** catálogo | `ppd.am_talle` · `grades_json` | `gradaAbierta638.ts` · lightbox talla×precio |
| **Bazzar Web** catálogo | `v_stock_web` + **`am_talle`** + **`precio_lpn`→precio_web por talle** | **NO** `talla_codigo` pilar 654 · **NO** un precio aplastado si PPD tiene multi-LPN (`4.05.03.004`) |
| **Bazzar** auditoría local | `ok_grada_638` separado de `ok_stock` | `grada638.ts` |
| **Tablet** POS | talle suelto minorista | distinto granularidad · misma semántica UNIDAD |

---

## 6 · Error recurrente Bazzar Web

### Síntoma

- Auditoría `:3002/auditoria-local` pestaña **Confecciones 638**: banner *PASS stock · FAIL grada 638*
- Catálogo pinta tallas **34–39** en ropa Kyly/Milon
- `ok_stock=true` pero `ok_grada_638=false`

### Causa raíz

Import **ALM_WEB** (retail Bazzar) propagó **`talla_codigo`** del pilar calzado (654) sin poblar **`am_talle`** ni `grades_json` estilo Carlos.

### Fix operativo (pendiente F1 roadmap 2.5.1.8)

1. Backfill `am_talle` desde `grada` Carlos en filas 638 existentes.
2. Vista `v_stock_web` debe exponer **`am_talle`** para `tipo_v2_id=2`.
3. UI Bazzar: rama 638 → `parseGradaAbierta638` · **nunca** grilla curva 654.
4. Validar con auditoría local hasta `ok_grada_638=true`.

Doc auditoría: [CHUSAR_AUDITORIA_LOCAL_STOCK_BAZZAR_WEB_20260802.md](../../2_modulos/2.5_bazzar_web/CHUSAR_AUDITORIA_LOCAL_STOCK_BAZZAR_WEB_20260802.md)

---

## 7 · Código fuente (paridad obligatoria)

| Pieza | Ruta |
|-------|------|
| Parser Report | `report/src/lib/deposito-rimec/grada-abierta-638.ts` |
| Parser RIMEC Web | `rimec-web/lib/gradaAbierta638.ts` |
| Parser Bazzar auditoría | `bazzar-web/lib/auditoria-local/grada638.ts` |
| Doc delta 654 vs 638 | `rimec-web/docs/CONFECCIONES_638_VS_CALZADO_654.md` |
| Import PPD | `control_central/scripts/migrate_pe_staging_to_ppd.py` |
| Reimport CP Excel Carlos | `report/scripts/reimport_pp49_primavera_638.mts` |
| Agrupación tarjeta Report | `report/src/lib/deposito-rimec/agrupar-pe-importadora.ts` |
| Venta PE confecciones Web | `rimec-web/lib/prontaEntregaVenta.ts` |

**Regla paridad:** cualquier cambio en parser 638 → replicar en **Report + RIMEC Web + Bazzar** (tres archivos).

---

## 8 · Ejemplo pivot (línea 13751 · ref K0452)

| LPN | Grada Carlos | `am_talle` | Prendas |
|-----|--------------|------------|--------:|
| 89900 | `1(1)1` | 1 | 8 |
| 89900 | `2(1)2` | 2 | 5 |
| 89900 | `3(1)3` | 3 | 2 |
| 108800 | `4(1)4` | 4 | 7 |
| **Total tarjeta** | | | **27** |

---

## 9 · Checklist agente (antes de tocar 638)

1. ¿`tipo_v2_id === 2`? Si no → **abortar** rama 638.
2. ¿Excel col Tam es Carlos? → parsear `am_talle` antes de FK.
3. ¿UI muestra 34–39 en confecciones? → bug contaminación 654.
4. ¿Bazzar auditoría? → revisar **`ok_grada_638`**, no solo stock.
5. ¿Deploy? → regla CHUSAR deploy solo cierre etapa.

---

## 10 · Relación imports recientes

| Evento | Doc |
|--------|-----|
| Import CP PP-49 primavera | [CHUSAR_REIMPORT_CP638_PP49_20260802.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_REIMPORT_CP638_PP49_20260802.md) · **2.3.1.33.3** |
| Etapa catálogo CP 638 | [ETAPA_CP_CONFECCIONES_OK_20260729.md](../../4_etapas/ETAPA_CP_CONFECCIONES_OK_20260729.md) |
| Reglas proveedor | [REGLAS_PROVEEDOR_638.md](./REGLAS_PROVEEDOR_638.md) §4 actualizado |

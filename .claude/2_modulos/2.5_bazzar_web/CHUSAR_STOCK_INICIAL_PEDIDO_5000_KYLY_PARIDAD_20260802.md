# CHUSAR — Stock inicial Bazzar · pedido cliente 5000 · paridad Kyly

**Código:** **2.5.1.15**  
**Fecha:** 2026-08-02  
**Keyword:** Documenta · ejecuta  
**Shibboleth:** Andrés, el que viene.

---

## Pedido = stock inicial tienda

| Campo | Valor (BD · sesión `id_usuario=1`) |
|-------|-------------------------------------|
| Cliente | **5000** · Bazzar.py |
| Origen | RIMEC Web · **Pronta entrega** |
| Ítems carrito | **207** líneas · **~208 ud** |
| Kyly | 24 ud · grada abierta `1(1)1` · `4(1)4` · `8(1)8` · `12(1)12` · `14(1)14` |
| Milon | 11 ud (misma regla 638) |
| Calzado mix | ACTVITTA · VIZZANO · MOLECA · MODARE · BEIRA RIO · BR SPORT · etc. |
| Pedido / FI | ✅ **237** · 12 FI `PE-237-001`…`012` · PVR-2026-371142 |
| TRP Enviar Web | ✅ **12/12** ENVIADO (2026-08-02 noche · **2.5.1.16**) |
| ALM / Compra Web | ⏳ pendiente mañana |
| Destino | `ALM_WEB_01` vía Compra Web (post TRP) |

UI carrito puede mostrar «Total pares» distinto si mezcla ppc; **verdad operativa** = `carrito_item` + PE `saldo`/ud.

---

## Ley Kyly · 100% igual compra · distinto packing UI

| | **RIMEC Web** | **Bazzar Web** |
|--|---------------|----------------|
| Qué se compra | Misma molécula L+R+M+C+talle · mismo precio caso/LPN | **Igual** (llega por Compra Web desde FI 5000) |
| Unidad venta | **1 prenda** (`am_modo_venta=UNIDAD`) | **1 prenda** (caja **abierta** · qty por talle) |
| Grada | Carlos `1(1)1` / `P(1)M` / `4/6/8` | Remap PPD `am_talle` · **prohibido** 34–39 zapato |
| Caja cerrada 8/12 | **No** aplica a 638 | **No** aplica a 638 |
| Calzado 654 | Caja cerrada en CP; PE ud/pares según vista | Caja **abierta** en tienda (pares por talle) |

Protocolo: `3.02.00.638` · catálogo Bazzar `2.5.1.11`.

**Frase Director:** comprar Kyly igual en ambos canales; RIMEC = grada/unidad mayorista; Bazzar = misma mercadería en **caja abierta** para filtros/precios tienda.

---

## Pipeline (ejecutar en orden)

1. ~~RIMEC Web carrito 5000 → VALIDAR → confirmar~~ ✅ (PG `confirmar_carrito_5000_pg.mjs`)  
2. ~~FI CONFIRMADAS~~ ✅ 12 FI PE-237  
3. ~~Enviar Web Bazar~~ ✅ 12/12 TRP (**2.5.1.16** · fix `4.05.03.003`)  
4. `/bazzar-web/compra` → **Confirmar recepción** → `INGRESO_COMPRA` ALM 1 + Stock Sano + precios WEB ⏳  
5. Smoke `:3002/catalogo` filtros + precios · Kyly talles abiertos ⏳

---

## Fix motor Compra Web (mismo turno · ejecuta)

**Bug:** `gradesJsonSoloTallas` / `tallaKeyToNum` solo 20–55 → Kyly `1(1)1` / `P` **no** generaba `traspaso_detalle` → Enviar Web fallaba.

**Cambio:**

| Archivo | Qué |
|---------|-----|
| `grades-json-canonical.ts` | `gradesJsonTallasTraspaso` + `isGradesTallaKeyAbierta638` |
| `traspaso-mutations.ts` | `gradaAbierta638ToTallas` · `scaleGradesAbierta638` · `extractTallasFromFiRow` híbrido |

**Smoke:** `npx tsx report/scripts/_smoke_extract_tallas_638.mts` → **PASS**

---

## Scripts

```
report/scripts/_analizar_carrito_bazzar_inicial.mjs
report/scripts/_smoke_extract_tallas_638.mts
report/scripts/_check_bazzar_ready_compra.mjs
```

**Shibboleth:** Andrés, el que viene.

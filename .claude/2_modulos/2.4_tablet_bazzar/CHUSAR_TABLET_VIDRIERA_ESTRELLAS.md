# CHUSAR — Tablet · Vidriera · Estrellas por caja

**Subcuenta:** **2.4.3.5** · Alerta 1 · Tablet `/deposito`  
**Usuario piso:** **Jefa de salón** — identifica **faltantes vidriera** (cambio grada escaparate)  
**Padre:** [CHUSAR_TABLET_DEPOSITO_CAJAS.md](./CHUSAR_TABLET_DEPOSITO_CAJAS.md) · **2.4.3.4**  
**Cierre:** [ETAPA_DEPOSITO_SALON_VIDRIERA_CERRADA.md](../../4_etapas/ETAPA_DEPOSITO_SALON_VIDRIERA_CERRADA.md)  
**Mensajería Report:** [CHUSAR_MENSAJERIA_DEPOSITO_TABLET.md](../2.3_report/depositos/CHUSAR_MENSAJERIA_DEPOSITO_TABLET.md)  
**Estado:** ✅ **CERRADA** — 2026-06-27 · prod tablet + report

---

## Jefa de salón — faltantes vidriera

La jefa **no recorre el depósito** contando tallas: abre tablet → **Depósito** → pestaña **Alertas · vidriera ⭐**.

| Señal | Significado | Qué hacer |
|-------|-------------|-----------|
| Badge naranja en tab Alertas | Hay faltantes vidriera | Entrar a la lista |
| Fila roja «último par 35 vendido · exponer ⭐ 36» | Escaparate sigue en 35 pero piso ya no tiene 35 | Cambiar muestra a grada indicada |
| ⭐ en tab Stock (columna grada) | Talla que **debe** estar en vidriera ahora | Cruzar con escaparate físico |
| ⭐⭐⭐ Caja cerrada | Último par de la importadora vendido | Retirar de vidriera · fin ciclo |

**Faltante vidriera** ≠ falta de caja completa: la caja puede tener pares en otras gradas; solo hay que **rotar la estrella** en el escaparate.

## Qué es

**Ciclo cerrado importadora → piso → vidriera → venta → siguiente grada → liquidación.**

Una **estrella ⭐** por **molécula** (L+R+material+color = una caja). La estrella marca la **grada expuesta en vidriera**. Cuando se vende el **último par** de esa grada, salta **Alerta 1** con la grada siguiente a exponer. Si no quedan pares, **caja cerrada** ⭐⭐⭐.

| Pestaña | Ruta UI | Rol |
|---------|---------|-----|
| **Stock · cajas** | `/deposito` tab stock | Grilla + ⭐ en columna vidriera activa |
| **Alertas · vidriera** | `/deposito` tab alertas | Bandeja Alerta 1 (cambio grada) |

---

## Ley de estrella (Director)

### Una estrella por caja

```
linea_codigo_proveedor + referencia_codigo_proveedor + material_code + color_code
→ exactamente UNA columna ⭐ en la tabla grada
```

### Ancla inicial (primera estrella)

| Cohorte | cliente_id | Ancla | Sucesión después del ancla |
|---------|------------|-------|---------------------------|
| **Adultos** | 2100 · 2400 · 3100 | **35** | 36 → 37 → 38 → 39 → 34 |
| **Niños** | 2900 · 2700 · 3200 | Primera presente en orden **32 · 30 · 23 · 25 · 27 · 29** | resto numérico ascendente |

Si la caja adultos **no trae 35**, se usa la primera ancla niños presente; luego el resto de gradas numéricas.

### Vidriera activa (estrella visible)

Primera grada del **orden de sucesión** con `stock > 0`.

Ejemplo adultos: hay 35 → ⭐35. Se vende último 35 → ⭐ pasa a 36 si hay stock.

### Alerta 1 · VIDRIERA_CAMBIO

Dispara cuando:

1. Existe al menos un par en la caja (`totalPares > 0`).
2. Alguna grada **anterior** en el orden de sucesión quedó en **0**.
3. La vidriera activa es la **siguiente** grada con stock.

Mensaje: `Último par {agotada} vendido · exponer ⭐ {siguiente}`.

### Caja cerrada · celebración

Cuando `totalPares === 0` → banner **⭐⭐⭐ Caja cerrada** en la tarjeta stock (círculo importadora liquidado). No infla la bandeja alertas con histórico.

---

## Mapa de sucesión (adultos · curva típica)

```text
⭐35 → 36 → 37 → 38 → 39 → 34 → (sin pares) → ⭐⭐⭐ cerrada
```

## Mapa de sucesión (niños)

```text
⭐32 → 30 → 23 → 25 → 27 → 29 → … otras gradas … → ⭐⭐⭐ cerrada
```

---

## Código

| Pieza | Ruta |
|-------|------|
| Motor estrellas + alertas | `tablet-bazzar/lib/depositos/vidriera-estrellas.ts` |
| Pestañas stock / alertas | `tablet-bazzar/app/deposito/page.tsx` |
| Grilla + ⭐ columna | `GrillaCajasDeposito.tsx` · `TablaGradaDeposito.tsx` |
| Bandeja alertas | `TabAlertasDeposito.tsx` |

### API exportada

```typescript
cohorteVidrieraPorClienteId(clienteId)
buildOrdenSucesionVidriera(tallas, cohorte)
analizarVidrieraCaja({ moleculeKey, clienteId, tallas, stock })
listarAlertasVidriera(cajas, clienteId)
```

---

## Futuro (Report fase 10)

Tipo `VIDRIERA` en `deposito_alerta` · disparo en **confirm ticket POS** (server) · ack tablet. Hoy v1 = **cálculo en vivo** desde stock depósito sync.

---

## Smoke

```bash
cd tablet-bazzar && npm run dev
/deposito → tab Stock: ⭐ en 35 (adultos)
/deposito → tab Alertas: cajas con grada ancla agotada y stock en siguiente
```

Cliente **2100** Fernando Adultos · **2900** Fernando Niños.

---

**Documenta — orden Director — 2026-06-27**

# P-01 — Visión · Hiedra venenosa · Puerta chica

**Código plan:** P-01 · **Navegador:** 2.3.2.2

---

## Qué NO estamos construyendo

- **Sales Report RIMEC** — importadora · Excel · `registro_ventas_general_v2` — **blindado**.
- Informe de ventas importador — **después** — “ahí se toca el dinero”.

---

## Qué SÍ estamos construyendo

- **Informe / operación ventas Bazzar tienda** — **todavía no existe como producto cerrado**.
- Entrada por la **puerta chica**: venta física en 6 tiendas.

---

## Hiedra venenosa (resumen)

| Fase | Retail tienda |
|------|----------------|
| 1 Infiltración | Tablet **Depósito + Venta + Empaque** + caja Report ← **aquí** |
| 2 Dependencia | Facturación CSV · analytics · operación dual |
| 3 Reemplazo | Manual = backup |
| 4 Absorción | Bazzar absorbida · luego puente importador |

Doc: `.claude/1_fundamentos/1.3_politicas/fundamentos_estrategicos.md`

---

## Decisión deploy

Caja vive en **Report** (Vercel compartido). Split a app independiente **solo si** caja 24/7 lo exige.

---

## ORO acumulado

Cada COBRAR = fila en **`ticket_venta_pos`** = mina para informes Bazzar futuros (vendedor, tienda, molécula, cliente, hora).

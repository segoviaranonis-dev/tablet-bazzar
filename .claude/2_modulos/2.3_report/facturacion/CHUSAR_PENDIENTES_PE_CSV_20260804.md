# CHUSAR — Pendientes facturación PE / CSV Carlos · corte 2026-08-04

**Código:** **2.3.1.9.B.4** · **Documenta** + protocolo Chusar · Director 2026-08-04  
**Etapa:** `CSV-PE-DEPOSITO-CABECERA-20260804` **CERRADA** · sin deploy · [CERRADA](../../../4_etapas/ETAPA_CSV_PE_DEPOSITO_CABECERA_20260804_CERRADA.md)  
**Unificado:** [PENDIENTES_POST_CIERRE_CSV_PE_20260804.md](../../../4_etapas/PENDIENTES_POST_CIERRE_CSV_PE_20260804.md)  
**Padre:** [CHUSAR_FACTURACION_PRONTA_ENTREGA.md](./CHUSAR_FACTURACION_PRONTA_ENTREGA.md)

---

## Cerrado en local (no prod)

| # | Tema | Doc / error | Estado local |
|---|------|-------------|--------------|
| 1 | Colisión `fi.vendedor_id` usuario↔`vendedor_v2` (Guido↔Patricia id 19) | `4.02.04.004` · helper `vendedor-fi-display.ts` | 🟢 |
| 2 | HECTOR en diccionario Carlos → código **90** | **2.3.1.9.F** | 🟢 |
| 3 | Caso PE enriquecido `· REGULAR\|PROMOCIONAL\|LIQUIDACION` | confirmar + backfill | 🟢 |
| 4 | Neto post-descuento **sin** centena (`88695` no `88600`) | `precioNetoCascada` | 🟢 |
| 5 | CSV PE col **DEPOSITO** cabecera (formato Director) | **2.3.1.9.B.3** | 🟢 |

---

## Pendiente Director / piso

| # | Ítem | Bloqueo |
|---|------|---------|
| P1 | Smoke **import** CSV en sistema Carlos (veneno real) | Humano Carlos |
| P2 | Deploy **Report** prod | Solo cierre etapa u orden directa |
| P3 | Excel Hoja2 fila formal HECTOR (hoy JSON canon EXTRA) | Excel Director |
| P4 | Vendedores Excel pendientes RUBEN / PEDRO | Excel |
| P5 | Recalc BD de FI con neto floored histórico (CSV ya corrige al export) | OT opcional |
| P6 | Validar visual bandeja PE tras reinicio Report | Director F5 |

---

## Prohibiciones ratificadas

1. **No** cambiar nombres/orden/cantidad de columnas del CSV Carlos.  
2. **DEPOSITO** = cabecera una vez · **no** tres columnas de cantidad.  
3. Deploy prod Report/rimec-web **solo** cierre etapa u orden directa.

---

**Relacionados:** [CHUSAR_CSV_PE_DEPOSITO_CABECERA_20260804.md](./CHUSAR_CSV_PE_DEPOSITO_CABECERA_20260804.md) · [CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md](./CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md) · [CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md](../motor_precios/CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md) (lista sí · neto post-desc **no**)

# HECHO HISTÓRICO — Falla crítica · pérdida de ingresos vendedor Enrique

**Código:** `2.2.1.23`  
**Fecha del hecho:** 2026-07-24  
**Clasificación:** 🔴 **FALLA CRÍTICA OPERATIVA** — primera del holding con **pérdida de ingresos de una persona** atribuida a ineficiencia interna  
**Keyword:** **Documenta** (Director · tipografía «docuemnta»)  
**Testigo / afectado:** Enrique · `id_usuario=18` · `id_vendedor=8` · RIMEC Web PE  
**Error catálogo:** `4.01.07.005`

---

## Declaración (hecho, no opinión)

El **24 de julio de 2026**, el vendedor **Enrique** reportó que **los zapatos ya no aparecen** en su canal de venta (Pronta entrega / RIMEC Web).

El Director registró este evento como **hecho histórico**: es la **primera falla crítica** en la que la **ineficiencia del equipo / sistema** provocó que **una persona dejara de percibir ingresos** que de otro modo hubiera cerrado ese día.

No es un “bug de UI” abstracto. Es un **daño comercial a un vendedor real**.

---

## Cadena del día (contexto causal)

Antes del reporte «zapatos no aparecen», el mismo día acumuló:

| # | Hecho | Código |
|---|--------|--------|
| 1 | Botón «Editar descuentos» ausente en carrito PE | `4.01.07.003` |
| 2 | Enrique no pudo cerrar venta por UI → bypass script → pedido EVOLUTION luego **eliminado** + reintegro | operativo |
| 3 | Aprobaciones «Sin grada» por `gradas_fmt` vacío | `4.01.07.004` |
| 4 | Import PE Vercel `spawn python ENOENT` | `4.02.04.001` |
| 5 | Purge / import `sdrm1021` · confusión modal 0 p · `:3000` zombie | `4.02.04.002`–`003` |
| 6 | Simulación interna PVR-891496 (cliente 5000) — no sustituye venta real de Enrique | `2.2.1.22` |
| 7 | **Enrique: zapatos ya no aparecen → ingresos perdidos** | **`4.01.07.005` · este doc** |

La acumulación de fricción (descuento, confirm, import, reverso) **impidió o degradó** la capacidad de Enrique de vender calzado PE con normalidad.

---

## Evidencia técnica al momento del registro (2026-07-24 noche)

| Capa | Hallazgo |
|------|----------|
| BD `v_stock_pe_rimec` calzado PP 55/57/58 | **5838** filas · **168923** cajas/pares disp. |
| Marcas top PE | MOLECA, VIZZANO, BEIRA RIO, MODARE, MOLEKINHA… **presentes en BD** |
| Confecciones PP 56 | 6202 filas · 14892 (sigue visible en stock) |
| Pedido prueba sim | PVR-2026-891496 (217) PENDIENTE · 5000 — **no** es el pedido comercial de Enrique |

**Conclusión dual (obligatoria en el registro):**

1. **Hecho humano:** Enrique no pudo vender zapatos como debía → **pérdida de ingresos**.  
2. **Hecho sistema:** el stock de calzado **sí existe en BD** al auditar; si la UI no lo muestra, es **falla de superficie / catálogo / prod / cache / filtros**, no “depósito vacío”. Ambas verdades conviven: el daño al vendedor es real aunque el dato duro de stock no esté en cero.

---

## Responsabilidad holding

- La falla se asume como **nuestra** (proceso + herramienta + coordinación del día), no del vendedor.
- Queda como **precedente histórico** para priorizar: **ingreso del vendedor > experimento interno > simulación > documentación a destiempo**.
- Cualquier hotfix posterior **no borra** este hecho: solo mitiga el daño futuro.

---

## Acciones pendientes (fuera de este registro)

1. Diagnosticar por qué Enrique **no ve** calzado en su pantalla (prod vs local, origen PE, filtros, cache, sellado prod).  
2. Restaurar visibilidad / venta sin pedirle a Enrique que “reinicie” como solución.  
3. Decidir destino del pedido prueba 217 (purge o dejar).  
4. Deploy hotfix descuentos PE solo con **cierre etapa u orden directa**.

---

## Referencias

- `CHUSAR_PE_DESCUENTO_GRADA_IMPORT_ERRORES_20260724.md` (`2.2.1.22`)
- Detalle error: `4.01.07.005_hecho-historico-enrique-zapatos-ingresos.md`
- Cliente pruebas: `2.2.1.0.9` (sim ≠ venta real Enrique)

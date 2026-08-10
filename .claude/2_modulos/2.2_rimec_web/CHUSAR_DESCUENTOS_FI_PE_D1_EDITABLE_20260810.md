# CHUSAR — Descuentos FI PE · D1–D4 siempre editables

**Código:** **2.2.1.51**  
**Fecha:** 2026-08-10  
**Keyword:** **Documenta** · **Bug urgente** · **Protocolo Chusar Activado**  
**Error:** `4.01.04.010`  
**🆕 MOISES post-20260807**

---

## 0 · Situación real (qué / cómo / Andrés)

| Pregunta | Respuesta |
|----------|-----------|
| **¿Qué cambió?** | En el modal **Guardar descuento** (carrito PE), D1–D4 son **siempre editables**. LPC03 ya no bloquea el 10%. |
| **¿Por qué?** | El sistema imponía “D1 = 10% fijo” por LP. El Director: el usuario (Guido / vendedor) **siempre controla** los %; la sugerencia Guido no es candado. |
| **¿Qué hace Andrés / Cursor?** | Abrir carrito PE → Asignar descuento FI → editar D1 (ej. 5) → Guardar. No debe quedar gris/bloqueado. |
| **¿Qué queda igual?** | Si FI está vacía, el motor **sugiere** D1=10 + D2=dictado Report. Comisión 2%/4% sigue sin ser descuento comercial. |
| **¿Git / DB / WhatsApp?** | Código rimec-web + docs. DB no. Zip: Héctor. |

---

## 1 · Bug

| Campo | Valor |
|-------|--------|
| App | RIMEC Web |
| Pantalla | Carrito · modal FACTURA INTERNA · PRONTA ENTREGA |
| Síntoma | D1 disabled en LPC03 (“10% fijo”) |
| Usuario prueba | patricia / castulo |

---

## 2 · Fix

| Archivo | Cambio |
|---------|--------|
| `components/EditorDescuentosFi.tsx` | Sin `disabled` en D1 · sin useEffect que fuerza `10` · texto “sugerencia” no “fijo” |
| `lib/resolverDescuentosFiPe.ts` | LPC03: sugiere 10+dictado solo si vacío; **no pisa** D1 si el usuario ya puso % |

---

## 3 · Smoke

`npx tsx scripts/_smoke_descuento_comercial_vs_comision.ts` · incluye caso `D1=5` no vuelve a 10.  
`npx tsx scripts/_smoke_f5_descuento_preautorizado.ts` · PASS.

**Prod:** orden «despliega» + Protocolo Chusar Activado 2026-08-10.

---

**Documenta 2026-08-10 — Bug urgente · D1 editable · usuario controla cascada.**

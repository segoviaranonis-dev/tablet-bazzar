# CHUSAR — Admin L×R · STOCK Todos / Compra previa / Pronta entrega

**Código:** **2.3.5.19**  
**Fecha:** 2026-08-17  
**Keyword:** Documenta + **despliega** (Director)  
**App:** Report `:3000` / prod `https://rimec-report.vercel.app`  
**Ruta:** `/pilares/linea-referencia`  
**Padres:** **2.3.5.12** (PE=SDRM) · **2.3.5.15** (fotos Admin LR)  
**Nota índice:** el borrador de plan usó `2.3.5.17`; ese código ya era PE Operativa — este nodo es **2.3.5.19**.  
**Commit Report:** `15aa4f7`  
**Prod:** https://rimec-report.vercel.app · READY `dpl_AorHwhBz8J1EWczTr96AowHbdBsW`  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**🆕 MOISES · 2026-08-17**

---

## Intención Director (colores)

| Botón | Universo | Foto |
|-------|----------|------|
| **Todos** | Toda la maestra `linea` × `linea_referencia` | Opcional |
| **Compra previa** | Solo L×R en **CP tránsito = RIMEC Web** (`v_stock_rimec`, pares > 0) | **Obligatoria** — no debería faltar miniatura |
| **Pronta entrega** | Solo L×R con **coincidencia SDRM** (PE ∩ stock qty>0) | Ley 654/638 |

Maestra = verdad de FKs. CP/PE/SDRM = solo **scope** de edición (**2.3.5.12**).

---

## Causa del fallo visible

En Compra previa, filas **2361-205 / 2361-208** mostraban cámara aunque Web tenía foto: thumb **654** solo miraba retail → PPD, **no** `v_stock_rimec`.

---

## Ley

1. **Todos** — sin filtro `origenTipo`.  
2. **CP** — `EXISTS v_stock_rimec` · pares > 0 · match 654 L+R / 638 por línea.  
3. **Thumb 654** — retail → PPD → **`v_stock_rimec`** (`imagen_url` y/o material+color).  
4. **PE** — sin cambio: PE ∩ SDRM (**2.3.5.12**).  
5. No ocultar filas CP “sin foto”: si falta thumb, es bug de resolución o hueco Storage.

---

## Ejecutado

| Archivo | Cambio |
|---------|--------|
| `report/src/lib/pilares/queries.ts` | Fallback CP thumb 654 · `sqlExisteImagenRetail` OR `v_stock_rimec` · comentario scope CP |
| `PilaresLrFiltrosSidebar.tsx` | Hint Compra previa (scope RIMEC Web) |
| `scripts/_smoke_lr_stock_cp_pe_scopes.ts` | Smoke 2361-205/208 + PE + Todos≥CP/PE |

**Smoke:** `PASS_LR_STOCK_CP_PE` · `PASS_LR_PE_DEPOSITO`

---

## Smoke Director (prod)

1. Compra previa + buscar `2361` → refs 205/208 con miniatura (no cámara).  
2. Pronta entrega → solo universo SDRM.  
3. Todos → maestra completa.

---

## Relacionados

- **2.3.5.12** PE=SDRM · **2.3.5.15** fotos PPD · **2.3.5.10** thumb 638 por línea

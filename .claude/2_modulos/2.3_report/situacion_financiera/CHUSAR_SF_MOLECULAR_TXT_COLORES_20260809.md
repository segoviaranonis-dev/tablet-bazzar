# CHUSAR — Sit Fin · detalle molecular TXT + colores TXT/manual

**Código:** **2.3.1.50.7**  
**Fecha:** 2026-08-09  
**Keyword:** **Documenta** · **publica**  
**App:** `report/` · ruta `/situacion-financiera` · pestaña **Excel AL 03-08**  
**🆕 MOISES post-20260807 · 2026-08-09**

---

## 0 · Orden Director

1. Cada renglón con respaldo debe abrirse en acordeón hasta la **unidad de Gs** documentada en **TXT limpio**.  
2. Pintar distinto lo que viene de **TXT** vs **carga manual**.  
3. Documentar y publicar.

---

## 1 · Qué es (en claro)

En la planilla Sit Fin (réplica Excel AL), Héctor hace clic en ▸ de una fila (ej. **CHEQUES A VENCER**) y baja:

**Mes → día de vencimiento → banco → cada cheque**

En el último nivel se ve la **línea limpia del TXT** del ERP (listado de cheques a vencer), no un número inventado.

Lo mismo aplica (con su árbol) a clientes/facturas, aging y PV/PROG cuando hay staging/TXT.

---

## 2 · Colores (leyenda en UI)

| Color | Significado | Ejemplos |
|-------|-------------|----------|
| **Verde** `#C6EFCE` | Respaldo **TXT limpio** (AUTO Guido) | Cheques, saldo clientes, vencidos/aging, PV y PROG / mercadería |
| **Naranja** `#FCE4D6` | **Carga manual** (Excel / tipado) | Bancos, proveedores, gastos despacho, previsión gastos, préstamo, Bazzar |
| **Lila** `#E2D5F1` | Pendiente cablear | Pago Luisito (cuadro Guido) |
| **Amarillo** `#FFFF00` | Calculado | Saldo disponible del mes |

---

## 3 · Cuándo es manual

Manual = **no sale de un TXT del ERP** en el intake del corte. Se carga en la planilla (o queda 0 hasta tiparlo):

- Saldos bancos (Continental, Itaú, Bancoop, GNB, BNF) Gs/USD  
- Pagos Bazzar  
- Pago a proveedores · gastos despacho · previsión gastos operativos · préstamo bancario  
- Reserva / fondos USD si vienen solo de Excel  

**No son manuales:** cheques a vencer, CxC/facturas, aging, PV Y PROG.

---

## 4 · Archivos código

| Pieza | Ruta |
|-------|------|
| Pestaña Excel + colores | `SitFinExcelAlTab.tsx` |
| Acordeón multi-nivel | `MolAccordion.tsx` |
| Claves + origen TXT/manual | `mol-key.ts` · `origenRespaldo()` |
| Árbol molecular (JSON) | `molecular-al-0308.json` |
| Generador desde TXT | `scripts/situacion-financiera/_gen_molecular_al.py` |
| Parser cheques enriquecido | `pipeline/parsers.py` · `Linea_Limpia`, emitente, banco nombre |
| API | `/api/situacion-financiera/molecular?key=` |

---

## 5 · Cómo regenerar el árbol (LAB)

```text
cd report\scripts\situacion-financiera
python _gen_molecular_al.py
```

Lee TXTs de `intake/corte-AL-03-08-26/*CHEQUES*.txt` (+ staging clientes/PV) y escribe `src/lib/situacion-financiera/molecular-al-0308.json`.

---

## 6 · Para Andrés

1. Login Report ADMIN → Situación financiera → pestaña **Excel AL 03-08**.  
2. Ver leyenda verde/naranja.  
3. Abrir ▸ **CHEQUES A VENCER** → día → banco → cheque → línea verde = TXT.  
4. No tocar prod sin orden Héctor.  
5. Zip Moises lo arma Héctor.

---

## 7 · Publicación

Orden **publica** 2026-08-09 → commit Report + `vercel --prod` (ver deploy **2.3.1.50.7.D**).

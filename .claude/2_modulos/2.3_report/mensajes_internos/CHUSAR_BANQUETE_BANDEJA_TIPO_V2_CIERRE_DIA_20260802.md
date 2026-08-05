# 2.3.1.36.6 — Banquete PE · bandeja tipo_v2 · cierre de día

**Código:** **2.3.1.36.6**  
**Fecha:** 2026-08-02 · noche · **Documenta** (cierre día · continúa mañana)  
**Padre:** Mensajes **2.3.1.36** · Espíritu cocina **2.3.1.35.11** · Plan `PLAN-AUTO-BANDEJA-PE-20260802`  
**App:** `report` · `/mensajes-internos` · `PdfCandyAccordions.tsx` · `run-envio.ts`  
**Shibboleth:** Andrés, el que viene.

---

## Hecho hoy (local · sin deploy prod)

### Cocina banquete HECTOR

| Campo | Valor |
|-------|--------|
| Destinatario | HECTOR · `ventas_hector@rimec.com.py` |
| Mensaje unificado | **#21** · carpeta `STOCK_PRONTA_ENTREGA` |
| Total PDF | **408** |
| CALZADO | **273** = 91 grupos × LPN+LPC03+LPC04 |
| CONFECCIONES | **135** = 45 grupos × LPN+LPC03+LPC04 |
| Tiempo corrida | ~**95 min** (fotos = cuello) |
| Script | `report/scripts/_regen_banquete_hector_133x3.ts` |
| Path archivo | `{CALZADO\|CONFECCIONES}/{LPN\|LPC03\|LPC04}/…pdf` |
| `LPS_ORDEN` | `LPN` · `LPC03` · `LPC04` |

Intentos previos (msg 18/19/20) borrados o fusionados en **#21**.

### UI bandeja

```
PDFS · PRONTA ENTREGA
  PDF · CALZADO | CONFECCIONES     ← tipo_v2 (colapsado al abrir)
    PDF · LPN | LPC03 | LPC04
      Marca → Abierto · Cerrado · Carteras · …
        botón = pares (abre PDF)
```

| Mejora | Detalle |
|--------|---------|
| Subtotales | Cada acordeón: **N PDF** + **suma pares** |
| Default | Todo **colapsado** al abrir el mensaje |
| Cromática | Pastel NIIF RIMEC · cabecera `#e8f1f8` · texto `#002B4E` · sin navy sólido |

---

## Pendiente mañana (continuar)

| # | Ítem | Notas |
|---|------|--------|
| 1 | **Asignador** | Qué subset de grupos/marcas/LP ve cada usuario · cocina sigue generando todo para Director |
| 2 | Enganchar banquete al **reloj / prep T−10** | Hoy fue corrida manual local · no automatización horaria del banquete completo |
| 3 | Smoke Director | Abrir PDF calzado + confecciones · verificar fotos/precios en muestra |
| 4 | Deploy prod | **Prohibido** hasta cierre etapa u orden directa |
| 5 | Documentar asignador (cuando exista) | Keyword **Documenta** |

---

## No pendiente de cocina

- Generar otra vez los 408 PDF salvo regeneración pedida.  
- Mezclar Sales Report / pilares.  
- Push Vercel sin orden.

---

## Referencias

- [CHUSAR_ESPIRITU_GENERADOR_133…](../automatizacion_informes/CHUSAR_ESPIRITU_GENERADOR_133_LPN_LPC03_LPC04_20260802.md) **2.3.1.35.11**  
- [CHUSAR_PDF_ESPEJO_LPC03…](../automatizacion_informes/CHUSAR_PDF_ESPEJO_LPC03_GRUPO1_20260802.md) **2.3.1.35.10**  
- [ETAPA_PLAN_AUTO_BANDEJA_PE_20260802.md](../../../4_etapas/ETAPA_PLAN_AUTO_BANDEJA_PE_20260802.md)  
- NIIF: `.claude/1_fundamentos/1.3_politicas/niif_estandar_visual.md`

**Orden Director:** Documenta · todo lo pendiente · cerrando el día · 2026-08-02.

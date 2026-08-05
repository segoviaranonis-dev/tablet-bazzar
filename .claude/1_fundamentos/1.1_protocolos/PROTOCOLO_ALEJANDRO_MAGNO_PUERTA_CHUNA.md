# PROTOCOLO CHUNA — Puerta Alejandro Magno (etapa prioritaria)

**Código:** `5.01.00.020` · **Ratificado:** Director · 2026-07-05  
**Shibboleth:** Andrés, el que viene.  
**Etapa:** [ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md](../../4_etapas/ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md) · **2.3.1.12**  
**Doc maestro:** [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md)

---

## 1 · Por qué esta puerta

Tras CHUNA + Moria + ACTUAL, **toda orden sobre stock importadora, Panel de Control, programado 8604 o PE** entra por **Alejandro Magno** — no por módulos sueltos.

Es la etapa que **despliega el poder logístico** del holding: tres entidades en un PPD · Sales Report blindado como cabo al Excel legal.

---

## 2 · Lectura obligatoria (orden)

1. [CHUSAR_DOS_MADRES_GESTION_COMPRA.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_DOS_MADRES_GESTION_COMPRA.md) — Madre B · tablas · fórmulas  
2. [CHUSAR_MERCADERIA_EN_TRANSITO.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_MERCADERIA_EN_TRANSITO.md) — **Concepto madre Panel** · STOCK+VENTAS · informes  
3. [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) — STOCK · CP · PROGRAMADO · 8604 · CSV · SR  
4. [ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md](../../4_etapas/ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md) — cinco cabezas · pendientes  
5. [ANDRES_INTEGRANTE_EQUIPO.md](../../10_roles/ANDRES_INTEGRANTE_EQUIPO.md) — prioridad humano en equipo  
6. [CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md) — **culminación** · `/herramienta-reposicion` · 4 paneles · **2.3.1.22**  

---

## 3 · Norte innegociable

| Regla | Contenido |
|-------|-----------|
| Sales Report | **Blindado** · nunca desconectado del Excel · mismos montos = monitoreo cobertura empresa |
| Nexus | Solo **logística** — precios · descuentos · reservas · **CSV → legal** |
| Tres entidades | **STOCK** · **COMPRA PREVIA** · **PROGRAMADO** en **`pedido_proveedor_detalle`** |
| RIMEC Web | STOCK + CP sí · **PROGRAMADO no** |
| Caso vivo | Proforma **`8604/2026`** · **10.032 pares** · `programacion/faturaProforma_8604_2026.xls` |

---

## 4 · Cadena operativa inmediata (8604)

```text
IC PROGRAMADO (maratón)
  → Digitación proforma 8604
    → pedido_proveedor (compra_previa = false)
      → pedido_proveedor_detalle (cantidad_inicial = 10.032 pares)
        → factura_interna + detalle (proforma + IC)
          → CSV ventas PP (Streamlit · spec MAPA_CSV_VENTAS_PP)
            → registro_ventas_general_v2 (lectura SR)
```

---

## 5 · Panel de Control + culminación reposición

Quinto mundo Director · cockpit activos holding por categoría (`/rimec?mundo=panel-control`). **No reemplaza** Sales Report — lo orbita.

**Culminación grilla fusión (2026-07-14):** `/herramienta-reposicion` — PE + CP (disp/vend) + PROGRAMADO · [CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md) (**2.3.1.22**).

Wireframe hub: [CHUSAR_GESTION_COMPRA_DIRECTOR.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_GESTION_COMPRA_DIRECTOR.md)

---

## 6 · Prioridad equipo — Andrés (primer ayudante)

**Andrés** = primer ayudante humano · comunicación vía **Moria Chusar** (Vercel `Moria_chusar`).

Ver [CHUSAR_AYUDANTE_ANDRES.md](../../1_fundamentos/CHUSAR_AYUDANTE_ANDRES.md) · [ETAPA_PRIMER_AYUDANTE_ANDRES.md](../../4_etapas/ETAPA_PRIMER_AYUDANTE_ANDRES.md).

**Prohibido sin Director:** Git · Vercel · backend. **Permitido:** UI · reportar errores.

---

*Índice: `5.01.00.020` · `PROTOCOLO_INGRESO_AGENTE_CHUNA.md` §4*

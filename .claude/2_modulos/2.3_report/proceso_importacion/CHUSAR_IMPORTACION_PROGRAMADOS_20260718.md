# CHUSAR — Importación de programados

**Subcuenta:** **2.3.1.27**  
**Etapa:** [ETAPA_IMPORTACION_PROGRAMADOS_20260718.md](../../../4_etapas/ETAPA_IMPORTACION_PROGRAMADOS_20260718.md) · `IMPORTACION-PROGRAMADOS-20260718`  
**Apertura:** 2026-07-18 · Director **Nueva etapa** + **Documenta**  
**Estado:** 🟢 **EN CURSO**  
**Shibboleth:** Andrés, el que viene.

---

## Qué es

Importación y nutrición del canal **PROGRAMADO** (Alejandro Magno · `categoria_id=3` en PPD): Excel / IC → stock programado → FI · visible en Report (`/stock-programado`, reposición AM, proceso importación).

**No es** Compra previa (tránsito PP) ni Pronta entrega (depósito local). Tres entidades, un PPD.

---

## Norte de la etapa

1. **Registrar** alcance operativo (qué Excel, qué PP, qué lote).  
2. **Documentar** el flujo canónico (este CHUSAR + protocolo existente).  
3. Ejecutar import / smoke cuando el Director dé el lote.  
4. Cerrar etapa solo con protocolo completo (`Cierra etapa` + `etapas.json`).

---

## Flujo (referencia)

```
Excel / IC PROGRAMADO
  → Preview SHOP↔IC
  → Import → PPD (categoria_id=3) + FI RESERVADA
  → Panel Report /stock-programado + reposición (acordeón PROGRAMADO)
  → Ventas FI / estrategia
```

Detalle protocolo: [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md)  
Estrategia panel: [CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md](../gestion_compra/CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md)  
Tres entidades: [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](../gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md)

---

## Apps / URLs

| Ambiente | URL |
|----------|-----|
| Local hub | http://localhost:3000/proceso-importacion |
| Local programado | http://localhost:3000/stock-programado |
| Local reposición | http://localhost:3000/herramienta-reposicion |
| Prod Report | https://rimec-report.vercel.app |

---

## Pendiente Director (próximo turno)

- Completar **tabla lote** en [CHUSAR_MARATON_PROFORMAS_PROGRAMADO_20260718.md](./CHUSAR_MARATON_PROFORMAS_PROGRAMADO_20260718.md) (PP · Excel · ICs · pares).  
- Confirmar orden: preview → import → Admin IC → smoke `/stock-programado`.  
- Primer archivo Excel + `ppId` para arrancar maratón.

## Pendiente técnico (documentado · no bloquea maratón)

| Ítem | Nota |
|------|------|
| RIMEC Web hotfix paginación catálogo | Local OK · prod pendiente deploy Director |
| Header mega menú + sessionStorage | Filtros fantasma marca/estilo en URL |
| Reposición filtro adicional **2.3.1.26** | Pausada |

---

## Relacionado

| Doc | Nota |
|-----|------|
| [ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md](../../../4_etapas/ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md) | Caso cerrado PP-16 |
| [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) | CSV ventas PROGRAMADO |
| [CHUSAR_MARATON_PROFORMAS_PROGRAMADO_20260718.md](./CHUSAR_MARATON_PROFORMAS_PROGRAMADO_20260718.md) | **Maratón proformas** · checklist Cursor · tabla lote |
| Índice | [INDICE.md](./INDICE.md) · **2.3.1.7** |

---

**Documentación Chusar:** 2026-07-18 · Cursor · «nueva etapa … importa[ción] de programados … documenta»

# CHUSAR — Auditoría integridad · estilo siamese (LR + PE)

**Código:** **2.5.1.6.1**  
**Fecha:** 2026-08-12 · **Keyword:** Documenta · despliega · foco Director  
**Ruta:** `/bazzar-web/auditoria-integridad` · pestaña Estadística · **Por estilo**  
**Padres:** **2.5.1.6** · siamese estilo **2.2.1.35** · filtros DW **2.5.1.20**

---

## Síntoma

Por estilo solo mostraba `(sin estilo)` y `OTROS` aunque por marca PASS y sin huecos.

## Causa

`estadistica.ts` leía `linea.grupo_estilo_id` crudo. En ALM_WEB el estilo comercial vive en **`linea_referencia.grupo_estilo_id`** y, si ALM quedó en OTROS, manda **PE** (`v_stock_pe_rimec`) — misma ley que Depósito Web.

## Fix (local → prod)

`report/src/lib/bazzar-web/auditoria-integridad/estadistica.ts`:

1. JOIN `linea_referencia` + `grupo_estilo_v2` (LR primero, luego línea)  
2. Rechazar `OTROS` / `SIN ESTILO` / `(SIN ESTILO)` como valor primario  
3. Fallback lateral PE (estilo no genérico)

## Smoke

- BD: top estilos → TENIS · TACO ALTO · CHATITA…  
- UI: hard refresh `:3000/bazzar-web/auditoria-integridad` → Por estilo con nombres reales

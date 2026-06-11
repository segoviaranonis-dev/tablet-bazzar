# OT-RIMEC-WEB-TARJETAS-MULTI-ORIGEN-001 — Catálogo multi-origen

**Prioridad:** MÁXIMA  
**Director:** Héctor Segovia  
**Estado:** HOTFIX catálogo vacío — ejecutar SQL 061

---

## Modelo mental (confirmado)

**TARJETA = SKU + ORIGEN + metadata**

| Origen | Hoy | Badge |
|--------|-----|-------|
| TRÁNSITO_PP | PP + ETA | tránsito · 🚢 15-06 |
| STOCK_LOCAL (futuro) | depósito + clasificación | stock local |

Frontend: `catalogoOrigen.ts`, `agruparTarjetasCatalogo.ts`, `CatalogoGrid.tsx`  
SQL pilares: `057_eta_catalogo`, `058_clasificacion_deposito`, `059_v_stock_rimec_origen_tipo`

---

## Por qué no se ve ninguna tarjeta (causa raíz)

La migración **059** dejó la vista así:

```sql
WHERE pp.estado IN ('aprobado', 'cerrado')  -- ❌ catálogo queda en 0 filas
```

El catálogo web **siempre** usó tránsito con pedidos:

```sql
WHERE pp.estado = ANY (ARRAY['ABIERTO', 'ENVIADO'])
  AND saldo_pares > 0
```

(Ver `scripts/fix_v_stock_rimec.py`.)

El `UPDATE ... estado = 'aprobado'` **no arregla** el catálogo; empeora si antes estaban ABIERTO.

---

## HOTFIX — ejecutar YA en Supabase

Archivo: **`control_central/migrations/061_fix_v_stock_rimec_estados_catalogo.sql`**

Verificación:

```sql
SELECT pp_estado, COUNT(*) FROM v_stock_rimec GROUP BY pp_estado;
SELECT COUNT(*) AS filas FROM v_stock_rimec;
SELECT COUNT(DISTINCT eta) AS etas FROM v_stock_rimec WHERE eta IS NOT NULL;
```

**PASS:** `filas` > 0 con PP en ABIERTO/ENVIADO.

---

## Probar UI

1. **http://localhost:3001** (rimec-web) — **no** :3000 (report)
2. URL sin filtros agresivos: quitar `?eta_fechas=...` si el catálogo sigue vacío
3. Mismo SKU, dos ETAs → dos tarjetas (paletas distintas)

---

## Preguntas respondidas para el Director (Cursor → Claude)

| Pregunta | Respuesta |
|----------|-----------|
| ¿Frontend listo? | Sí, agrupación multi-origen implementada |
| ¿Por qué 0 tarjetas? | Vista 059 con estados equivocados + posible puerto 3000 |
| ¿Aprobar PP en SQL? | No para catálogo; usar ABIERTO/ENVIADO |
| ¿Qué ejecutar? | **061** en Supabase, luego refresh :3001 |

---

## Copiar a Claude Code

```
MÁXIMA PRIORIDAD — OT-RIMEC-WEB-TARJETAS-MULTI-ORIGEN-001

1) Ejecutar en Supabase: control_central/migrations/061_fix_v_stock_rimec_estados_catalogo.sql
2) Verificar: SELECT COUNT(*) FROM v_stock_rimec;  -- debe ser > 0
3) NO dejar PP solo en 'aprobado' para catálogo; revertir a ABIERTO/ENVIADO si hace falta
4) Probar http://localhost:3001
5) Evidencia en ot/RIMEC-WEB-TARJETAS-MULTI-ORIGEN-001-EVIDENCIA.md
```

---

## Cierre

- [ ] 061 aplicada
- [ ] `COUNT(*) FROM v_stock_rimec` > 0
- [ ] Tarjetas visibles en :3001
- [ ] Multi-ETA verificado

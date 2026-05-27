# Evidencia OT-RIMEC-WEB-TARJETAS-MULTI-ORIGEN-001

**Fecha:** _  
**Ejecutor:** _

## SQL post-061

```sql
SELECT COUNT(*) AS filas_vista FROM v_stock_rimec;
SELECT pp_estado, COUNT(*) FROM v_stock_rimec GROUP BY pp_estado;
SELECT COUNT(DISTINCT eta) AS etas FROM v_stock_rimec WHERE eta IS NOT NULL;
```

| Métrica | Valor |
|---------|-------|
| filas_vista | |
| etas distintas | |

## UI localhost:3001

- [ ] Tarjetas visibles
- [ ] Badge tránsito + ETA
- [ ] Dos ETAs → dos tarjetas mismo SKU

## Veredicto

- [ ] PASS
- [ ] FAIL

# DEPLOY · Corte control entrega 2026-07-26

**Orden Director:** desplegar todo · integridad bancaria · entrega 2026-07-27

---

## Apps

| App | Repo / carpeta | Prod URL |
|-----|----------------|----------|
| **Report** | `report/` | https://rimec-report.vercel.app |
| **RIMEC Web** | `rimec-web/` | https://rimec-web.vercel.app |

---

## Alcance deploy

### Report
- Logística OK · Listado FI · Hiedra PE · PP cierre
- AM siamese · filtros operativa
- Asignación descuentos PE (UI base)

### RIMEC Web
- Ley TODOS **2.2.1.28** · paginación exclude
- 3/3 hermanos siameses · badges PRO/PROMO/LIQ
- Cabecera precio teclado↔slider

---

## Smokes post-deploy

```powershell
cd report
npx tsx scripts/siamese_paridad_pe_report_web.mts --run-audit
node scripts/_audit_integridad_bancaria_pe255.mjs

cd ..\rimec-web
node scripts/_audit_marca_vizzano_coteo.mjs
node scripts/_smoke_multiselect_siames_web.mjs
```

---

## Prueba compra única (integridad montos)

1. Web `:3001` — carrito CP + PE con descuentos N/P/LIQ/COMUN según ley FI
2. Aprobaciones — blanco vs sombra si editó vendedor
3. Verificar `total_monto` FI = Σ líneas (triple entry)
4. Mañana entrega operativa

---

## MIG prod

Verificar MIG **167–184** aplicadas en Supabase prod.

---

**Corte:** [ETAPA_CORTE_CONTROL_ENTREGA_20260726_CERRADA.md](../../4_etapas/ETAPA_CORTE_CONTROL_ENTREGA_20260726_CERRADA.md)

# CHUSAR — Deploy Report · Listado motor FI (2026-07-26)

**Código:** **2.3.1.7.5.3.14.D** · **Producto:** Report · **Build:** ✅ local  
**Doc funcional:** [CHUSAR_LISTADO_MOTOR_FI_PP.md](./CHUSAR_LISTADO_MOTOR_FI_PP.md)

---

## Alcance del deploy

| Incluye | Excluye |
|---------|---------|
| Selector listado motor por FI | rimec-web |
| Precio 0 sin match `precio_lista` | Migraciones Supabase |
| Reporte montos + sync Logística OK | Tablet / Bazzar |
| Cobertura % informativa en dropdown | Botón impositor tier (ya fuera tab FI) |

---

## Checklist pre-push

- [x] `npm run build` — exit 0 (2026-07-26)
- [x] `_test_listado_motor_cero_pp38.mts` — PV001 #27 → 0 · PV002 #2 parcial
- [ ] Director confirma restaurar PV001 piloto si aplica
- [ ] Commit solo `report/` (+ Moria si este doc va en mismo commit)

---

## Comandos (cuando Director ordene)

```powershell
cd C:\Users\hecto\Nexus_Core\report
npm run build
npx tsx scripts/_test_listado_motor_cero_pp38.mts 38 3424 2
```

Git (ejemplo — **no ejecutar sin orden**):

```powershell
cd C:\Users\hecto\Nexus_Core
git add report/
git commit -m "Report: listado motor por FI · precio 0 sin match · reporte Logística"
git push origin main
```

Post-push Vercel Report + smoke:

```text
/proceso-importacion/pedido-proveedor/38?tab=fi
PATCH listado-motor → 200 + report.skus_sin_match coherente
```

---

## Navegador holding post-deploy

1. `nexus-navegador-holding/config/productos.json` → `report.ultimoDeployActivo: true`
2. Verificar `:3004/modulos` badge NEW en nodo **2.3.1.7.5.3.14**
3. Si cierre etapa: `etapas.json` según protocolo

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| FI a Gs. 0 por evento sin cobertura | Dropdown muestra % · reporte explícito |
| PV001 piloto alterado en local | Restaurar IC #45 + resync antes prod |
| PATCH lento | Aceptable v1 · batch SQL futuro |

---

**Puerta:** cierre etapa **o** orden directa Director — `5.01.00.020`

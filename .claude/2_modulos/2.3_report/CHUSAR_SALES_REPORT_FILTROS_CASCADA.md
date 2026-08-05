# CHUSAR — Sales Report · filtros cascada (`/rimec`)

**Código Moria:** **2.3.1.1** (Sales Report web inmersivo)  
**App:** Report `:3000/rimec` · prod `rimec-report.vercel.app/rimec`  
**Versión sellada:** `SALES_REPORT_WEB_VERSION` — **1.0.3** (2026-07-24)  
**Error índice:** **4.02.02.005** — detalle [4.02.02.005_sales-report-filtros-cascada-categorias.md](../../5_errores/detalle/4.02.02.005_sales-report-filtros-cascada-categorias.md)

**Shibboleth:** Andrés, el que viene.

---

## Cuándo leer este CHUSAR

- Director dice **Bug urgente!!** en Sales Report / filtros / categorías PROGRAMADO.
- Director dice: **«verifica los errores anteriores para no cometer los mismos»** → ejecutar § Checklist agente **antes** de editar código.
- Cualquier cambio en `ImmersiveClient`, `ImmersiveFiltersPanel`, `encajar-filtros-cascada`, `full-snapshot`.

**Sales Report histórico blindado:** `registro_ventas_general_v2` — **prohibido** mezclar con pilares Retail.

---

## Arquitectura filtros (resumen)

```
Usuario togglea categorías → filtros.categoria_ids (ids reales categoria_v2)
        ↓ Sincronizar (ref anclada al click)
POST /api/rimec/full-snapshot  body.categoria_ids
        ↓ mergeSnapshotFilters + buildPivotSql
KPIs + cascada (distinct categorías OMITE filtro cat → siempre lista 3 nombres)
        ↓ respuesta
encajarFiltrosTrasSyncUsuario(fConsulta, cascada) — NO pisa categorías del usuario
```

**Trampa:** la cascada **siempre** devuelve las 3 categorías del dominio pivot; eso **no** significa que el informe use las 3 — la verdad está en `filtros.categoria_ids` enviado al SQL.

---

## Errores conocidos (no repetir)

| ID | Señal | No volver a |
|----|-------|-------------|
| E1 | 1 cat → vuelven 3 tras sync | Regla `>= 2` en encaje |
| E2 | Selección salta sola | `useEffect` encaje en `[snapshot]` |
| E3 | Datos default tras sync manual | Prefetch pisa snapshot si `userConsultoRef` false |
| E4 | API con filtros viejos | `consultar` sin ref sync / sin `setFiltrosSync` |
| E5 | `#1, #2 +1` · sin pulse | ids `[1,2,3]` vs BD · comparación sin `Number()` |
| E6 | Solo «+ Agregar» visible | UI oculta activas cuando ids no matchean cascada |

**Diagnóstico rápido E5:** resumen `#n` = ids en estado no encontrados en `cascada.categorias`.

---

## Checklist agente — «verificar errores anteriores»

Ejecutar **en orden** antes de proponer fix:

1. ☐ Leer solo título **4.02.02.005** en `5_errores/INDICE_ERRORES.md` → abrir detalle si síntoma coincide.
2. ☐ `cd report && npm run audit:encajar-filtros` → debe pasar **19 casos**.
3. ☐ Confirmar badge prod **`v1.0.3`** (o superior) — si sigue `1.0.0` → deploy `4.02.02.003`.
4. ☐ Reproducir: solo PROGRAMADO → 2× Sincronizar → pulse solo PROGRAMADO · resumen sin `#`.
5. ☐ Si falla: inspeccionar Network POST body `categoria_ids` vs pills UI (DevTools).
6. ☐ Hotfix mínimo en archivos canónicos (§ abajo) — **no** refactor paralelo Streamlit.
7. ☐ Bump `SALES_REPORT_WEB_VERSION` patch si cambia comportamiento UI.
8. ☐ Documentar error **nuevo** solo si síntoma distinto (nuevo `4.02.02.NNN`).

---

## Archivos canónicos

| Ruta report | Función |
|-------------|---------|
| `src/app/rimec/ImmersiveClient.tsx` | Prefetch · consultar · ref · normalizeCascada |
| `src/app/rimec/components/ImmersiveFiltersPanel.tsx` | Pills categoría · pulse seleccionadas |
| `src/modules/sales-report/categoria-id-utils.ts` | Normalización ids · remap legacy |
| `src/modules/sales-report/encajar-filtros-cascada.ts` | Encaje post-cascada |
| `src/modules/sales-report/constants.ts` | `CATEGORIA_VENTA_CALZADOS_IDS` · versión web |
| `src/app/api/rimec/full-snapshot/route.ts` | merge filtros body |
| `src/lib/rimec/cascade-domains.ts` | distinct categorías (omite filtro cat) |
| `scripts/audit_encajar_filtros.mts` | Smoke lógica encaje |

---

## Comandos

```bash
# Auditoría lógica (obligatoria post-cambio)
cd report && npm run audit:encajar-filtros

# Dev local
cd report && npm run dev:3000
# → http://localhost:3000/rimec
```

---

## Commits referencia (2026-07-24)

`5415a05` · `83a2680` · `394d612` · `622f564`

---

*Índice Report: [INDICE.md](./INDICE.md) · Errores: [INDICE_ERRORES.md](../../5_errores/INDICE_ERRORES.md)*

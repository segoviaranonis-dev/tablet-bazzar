# CHUSAR — UX «Por favor aguarde» · Proceso importación Report

**Código:** **2.3.1.7.0.1** · **Padre:** [CHUSAR_CICLO_IMPORTACION_REPORT.md](./CHUSAR_CICLO_IMPORTACION_REPORT.md)  
**Estado:** 🟢 **ACTIVO** — ley obligatoria UI  
**Componente:** `report/src/components/report/ProcesoImportacionWaitOverlay.tsx`

---

## Ley (Director)

Todo proceso de **importación / procesamiento** en Report que tarde **> ~300 ms** debe mostrar feedback explícito al usuario. **Prohibido** dejar pantalla quieta sin indicar que el sistema trabaja.

Texto mínimo visible: **«Por favor aguarde…»** + título del proceso + detalle opcional.

El usuario **siempre tiene control**: sabe qué pasa, cuánto tarda (orden de magnitud en hint), y que no debe re-clicar.

---

## Cuándo aplica

| Ámbito | Ejemplos |
|--------|----------|
| **2.3.1.7.2** Importación precios | Carga Excel, Memoria, Preview audit, Conversión SQL, Cierre |
| **2.3.1.7.3** IC | Bandeja, crear IC, transiciones |
| **2.3.1.7.4–5** Digitación / PP | Guardados, proforma, vínculos listado |
| Cualquier **POST** pesado del ciclo | Excel, SQL batch, Supabase >1s |

No aplica a navegación instantánea o toggles locales.

---

## Implementación Report

```tsx
import { ProcesoImportacionWaitOverlay } from "@/components/report/ProcesoImportacionWaitOverlay";

<ProcesoImportacionWaitOverlay
  open={procesando}
  title="Convirtiendo precio_lista…"
  detail="CP PRUEBA · evento #27"
  hint="SQL indexado — unos segundos"
/>
```

- **Overlay bloqueante** (`fixed`, `z-[100]`, spinner, `aria-busy`).
- Botón disparador: texto **«…»** mientras `open` (ej. «Convirtiendo…»).
- Paridad Streamlit: latido consola en imports CLI (`import_heartbeat.py`) — distinto canal, misma intención.

---

## Mapa Importación precios (7.2)

| Paso | Overlay cuando |
|------|----------------|
| 0 Carga | `POST eventos/carga` |
| 1 Memoria | carga evento + `POST vincular-biblioteca` |
| 2 Preview | `GET preview-audit` |
| 3 Conversión | `POST calcular` |
| 4 Cierre | `POST cerrar` |

Wrapper Paso 0: `Paso0ProcessingOverlay` (usa componente común).

---

## Checklist auditoría (Cursor)

- [ ] ¿Hay `fetch` POST/GET lento sin overlay?
- [ ] ¿El botón queda disabled + label progreso?
- [ ] ¿Error visible si falla (no solo consola)?
- [ ] ¿Estados BD válidos (`precio_evento.estado` ∈ borrador \| validado \| cerrado)?

---

## Referencias

- [CHUSAR_IMPORTACION_PRECIOS.md](./CHUSAR_IMPORTACION_PRECIOS.md)
- `control_central/.cursor/rules/ux-celebration.mdc` (Streamlit — toast/globos post-guardado)
- `control_central/.cursor/rules/import-heartbeat.mdc` (CLI 60s)

---

**Shibboleth:** Chayanne el mejor

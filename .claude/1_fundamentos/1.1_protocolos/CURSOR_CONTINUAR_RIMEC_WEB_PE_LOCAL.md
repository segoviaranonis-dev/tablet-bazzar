# CURSOR CONTINUAR — RIMEC Web PE + CP (local)

**Etapa:** `RIMEC-WEB-PE-LOCAL-20260706` · **2.2**  
**Pausa:** 2026-07-09 noche · Director: «continuaremos mañana»  
**Prod:** congelada `f408fc2` — **sin** Git/Vercel hasta cierre etapa  
**Puertos dev:** `:3001` RIMEC Web · `:3000` Report Aprobaciones · `:3004` Navegador

---

## Arranque mañana (orden sugerido)

```powershell
cd C:\Users\hecto\Nexus_Core\rimec-web; npm run dev          # :3001
cd C:\Users\hecto\Nexus_Core\report; npm run dev:3000       # :3000
cd C:\Users\hecto\Nexus_Core\nexus-navegador-holding; npm run dev  # :3004
```

Shibboleth: **Andrés, el que viene.**

---

## Entregado (código + doc local)

| # | Tema | Doc |
|---|------|-----|
| 1 | CABECERA DE FILTROS · TONO · pills | [CHUSAR_CATALOGO_CABECERA_FILTROS.md](../2_modulos/2.2_rimec_web/CHUSAR_CATALOGO_CABECERA_FILTROS.md) · **2.2.1.1** |
| 2 | Carrito PE validar/confirmar · MIG-138–141 | [CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md](../2_modulos/2.2_rimec_web/CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md) · **2.2.4.0.1** |
| 3 | Badge PE Aprobaciones | [CHUSAR_APROBACIONES_PE_BADGE.md](../2_modulos/2.1_control_central/modules/aprobacion_pedidos/CHUSAR_APROBACIONES_PE_BADGE.md) |
| 4 | PROMOCIONAL LPC03 UI local | [CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md](../2_modulos/2.2_rimec_web/CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md) |
| 5 | Imágenes NIIF PE (código) | [CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md](../2_modulos/2.2_rimec_web/CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md) |

**Hotfix catálogo TONO:** `v_stock_rimec` **no** expone `color_tono_canon` → enrich en `lib/catalogoEnrich.ts` desde pilar `color`.

---

## Pendiente mañana (checklist Director)

### Catálogo `:3001`

- [ ] Smoke visual CABECERA — 6 puntos en [CHUSAR_CATALOGO_CABECERA §Smoke](../2_modulos/2.2_rimec_web/CHUSAR_CATALOGO_CABECERA_FILTROS.md)
- [ ] `:3004/modulos/rimec-web/catalogo/cabecera-filtros` — badge NEW visible
- [ ] Opcional SQL: migración vista con `color_tono_canon` denormalizado (Claude Code)

### Carrito PE

- [ ] Flujo completo: agregar PE → VALIDAR → CONFIRMAR → FI en Aprobaciones
- [ ] Rechazar duplicado **PVR-2026-390121** o **PVR-2026-936272** (incidente 2026-07-08)
- [ ] Deuda RPC: token one-shot al inicio de `confirmar_pedido_web` (Claude Code)

### Otros local

- [ ] Lightbox modal **4232·409** NIIF PE — smoke Director
- [ ] PROMO **7401·102** — MIG-145 Supabase + smoke badge PROMO
- [ ] `npm run build` rimec-web PASS antes de plantear cierre etapa

---

## Criterio cierre etapa (no hacer hoy)

Ver [ETAPA_RIMEC_WEB_PE_LOCAL_20260706.md](../4_etapas/ETAPA_RIMEC_WEB_PE_LOCAL_20260706.md) § Criterio cierre → **Cierra etapa** + `etapas.json` + deploy solo con orden Director.

---

## Terminales — cierre 2026-07-09 noche

Puertos **3000 · 3001 · 3002 · 3004** liberados por Cursor al pausar sesión.

---

**Documenta:** 2026-07-09 · orden Director «documenta todo lo pendiente · cierra terminales · continuaremos mañana»

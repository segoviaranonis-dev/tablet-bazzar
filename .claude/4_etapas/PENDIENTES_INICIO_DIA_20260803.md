# PENDIENTES — inicio día 2026-08-03

**Código:** **4.00.00.003**  
**Keyword:** **Documenta** · 2026-08-02 noche (handoff stock 5000)  
**Shibboleth:** Andrés, el que viene.

**Handoff:** [ACTUAL.md](./ACTUAL.md) · [2.5.1.16](../2_modulos/2.5_bazzar_web/CHUSAR_HANDOFF_STOCK_5000_TRP_638_CIERRE_DIA_20260802.md)

---

## 0 · Primer foco mañana — Compra Web (stock Bazzar)

| # | Acción | Estado / nota |
|---|--------|---------------|
| 1 | `/bazzar-web/compra` confirmar recepción TRP **PE-237-001…012** | ⏳ ALM vacío post-purge |
| 2 | Verificar INGRESO + Stock Sano + precios WEB | ALM_WEB_01 |
| 3 | Smoke `:3002/catalogo` Kyly abierta + filtros | local luego prod |
| 4 | Reiniciar Report `:3000` si UI Facturación vieja | código `traspaso-mutations` |

Pedido: **237** · cliente **5000** · 12 FI · 12 TRP ENVIADO · ~1718 pares.

---

## 1 · Hecho ayer (no repetir)

| Tema | Evidencia |
|------|-----------|
| Purge ALM fase 1 CERRADA | **2.5.1.13** |
| Header/filtros Bazzar prod | **2.5.1.14** · `8864b1e` |
| Paridad Kyly + extract TRP 638 | **2.5.1.15** |
| Confirmar carrito 5000 (PG) | PVR-2026-371142 · FI PE-237 |
| Token carrito 30 min | `carrito_token_vigente` |
| Fix combinación talla 638 | **4.05.03.003** RESUELTO · **2.5.1.16** |
| Enviar Web 12/12 | `_enviar_pe237_bazar.mts` |
| Banquete HECTOR 408 PDF | **2.3.1.36.6** |
| Reimport PP-49 Hoja2 | 986 SKUs · 4988 prendas |
| Protocolo grada 638 | **3.02.00.638** |

---

## 2 · Banquete / bandeja PE (`PLAN-AUTO-BANDEJA-PE-20260802`)

| # | Pendiente | Prioridad |
|---|-----------|-----------|
| 1 | Asignador — qué ve cada usuario | 🟡 |
| 2 | Enganchar banquete al reloj / prep T−10 | 🟡 |
| 3 | Smoke Director PDF calzado + confecciones | 🟡 |
| 4 | Deploy prod | ⏳ solo cierre u orden |

---

## 3 · CP confecciones 638 (`CP-CONFECCIONES-OK-20260729`)

Ruta: http://localhost:3001/?origen_tipo=TRÁNSITO_PP&ramo_tipo=CONFECCIONES

| # | Pendiente | Prioridad |
|---|-----------|-----------|
| 1 | Motor precios — 4 líneas Milon sin caso | 🔴 |
| 2 | Imágenes tarjetas CP | 🔴 |
| 3 | Precio visible tarjetas / lightbox | 🔴 |
| 4 | Lightbox parpadeo color | 🟡 |
| 5 | Pill Todos CP+PE confecciones | 🟡 |
| 6 | Carrito CP → aprobaciones smoke | 🟡 |
| 7 | Deploy prod RIMEC Web | ⏳ solo cierre u orden |

---

## 4 · Bazzar ops residual

| # | Pendiente | Nota |
|---|-----------|------|
| 1 | `ok_grada_638` en ALM_WEB | **4.05.03.002** · post stock |
| 2 | Prod catálogo post Compra Web | www.bazzar.com.py |

---

## 5 · Etapas en pausa

| Code | Próximo hito |
|------|--------------|
| `INFORMES-AUTO-MENSAJES-20260801` | reloj · prep T−10 |
| `HOTFIX-CATALOGO-TODOS-CALZADO-20260801` | deploy prod ⏳ |
| `LOGISTICA-RIMEC-TXT-20260728` | TXT logística |

---

## 6 · Comandos útiles

```bash
# Compra / TRP (si hace falta reenviar alguna FI)
npx tsx report/scripts/_enviar_pe237_bazar.mts --only PE-237-012

# Smokes 638
npx tsx report/scripts/_smoke_extract_tallas_638.mts
npx tsx report/scripts/_smoke_resolve_comb_638.mts

# Smoke catálogo CP 638
npx tsx rimec-web/scripts/_verify_cp_confecciones_20260729.ts
```

---

## 7 · Servidores locales

| Puerto | App |
|--------|-----|
| 3000 | Report |
| 3001 | RIMEC Web |
| 3002 | Bazzar Web |
| 3004 | Navegador holding |

---

## 8 · Prohibido sin orden

- Deploy prod RIMEC/Report (regla cierre etapa)
- Reimport PP-49 sin confirmar Excel/hoja
- Mezclar reglas grada 654 en 638
- Purge ALM sin orden (ya vacío; no repetir)

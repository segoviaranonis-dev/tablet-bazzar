# Pendientes — Cocina PDF PE · bandeja · DPE · 2026-08-04

**Keyword:** **Documenta** · 2026-08-04  
**Foco etapa:** `SALES-REPORT-PDFS-20260804` (paralelo; no bloquea cocina PE)  
**Shibboleth:** Andrés, el que viene.

---

## 🔴 En curso — cocina banquete HECTOR

| Campo | Valor |
|-------|--------|
| Script | `report/scripts/_regen_banquete_hector_133x3.ts` |
| Terminal | `405042` · pid ~29532 |
| Arranque | 2026-08-04 ~11:56 ART |
| Plan | CALZADO + CONFECCIONES · LPN+LPC03+LPC04 → bandeja HECTOR |
| Post-cocina | Unificar SPE (`_unificar_banquete_hector.ts`) · 1 mensaje menú completo |
| Confecciones | Deben salir con layout **638** (**2.3.1.35.12**) |

**Al terminar:** avisar Director · unificar · smoke KYLY FEM VERANO en menú (consciente de **4.02.05.004**).

---

## 🟡 Abierto — tipificación DPE vs visual

| Código | Tema |
|--------|------|
| **4.02.05.004** · **2.3.1.35.13** | KYLY `1001020100` título VERANO · prendas aspecto invierno |
| Decisión | ¿Carlos mal tipificó? ¿aceptar DPE? ¿smoke INVIERNO al lado? |

---

## 🟡 Pendiente — automatización / bandeja

| # | Ítem | Nota |
|---|------|------|
| 1 | **Asignador** (quién ve qué PDF) | Espíritu **2.3.1.35.11** · no achicar cocina |
| 2 | **Cron 06:00** menú completo | PC apagada → worker cloud / GH Actions · Vercel Cron no alcanza ~1–2 h |
| 3 | Reloj autos | Hoy no corrió 06:00 · autos siguen **15:00** |
| 4 | Unificar banquete en **un** mensaje SPE | Tras cocina 405042 |
| 5 | Aviso corto bandeja + acordeón Detalle | UI hecha · validar post-banquete |
| 6 | Carpeta `LOGISTICA_CONFIRMACION_ENTREGAS` | Acordeón UI listo · **stub vacío** |
| 7 | Puente Logística → PDF FI | Graciela elige FI → recordatorio vendedor → PDF al depositar |
| 8 | PLAN-AUTO T−10 / asignador | Etapa `PLAN-AUTO-BANDEJA-PE-20260802` · pausa |

---

## 🟡 Pendiente — holding / otras etapas

| # | Ítem | Ref |
|---|------|-----|
| 9 | Alcance PDF Sales Report | Etapa `SALES-REPORT-PDFS-20260804` · confirmar superficie |
| 10 | Import CSV Carlos (piso) | Post-cierre CSV PE |
| 11 | Confirm recepción TRP PE-237 Bazzar | Post-cierre |
| 12 | Supabase billing endurecer | **4.90.01.001** · alertas · 2 owners · backup · 2FA Héctor |
| 13 | Deploy prod rimec-web | **Prohibido** hasta cierre etapa u orden directa · sellado `f408fc2` |

---

## ✅ Hecho (contexto 2026-08-04)

- Generador PDF **638** pivot precio + cable cocina CONFECCIONES  
- Banquete HECTOR unificado · 413 PDF  
- Acordeón PDFs confirmación entregas (carpeta BD)  
- Bandeja: 1 aviso corto + Detalle móvil-first  
- Auditoría: grupos sin descripción PDF → 133 OK / 0 sin dim  
- Smoke KYLY FEM VERANO `G1001020100` + auditoría DPE (no mezcla)  
- **Extirpación botón dorado PDF Catálogo** RIMEC Web · **2.2.1.41** · no va en próximo deploy

---

## Docs tocados este Documenta

- `4.02.05.004` · `2.3.1.35.12` · `2.3.1.35.13` · este archivo · `ACTUAL.md` · índices

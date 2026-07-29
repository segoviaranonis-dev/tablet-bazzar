# ACTUAL — Logística Rimec · TXT Carlos 2026-07-28

**Actualizado:** 2026-07-28 · **EN CURSO** · 1 etapa en `trabajoVivo`  
**Shibboleth:** Andrés, el que viene.

---

## 🟢 Foco activo

| Campo | Valor |
|-------|--------|
| **Code** | `LOGISTICA-RIMEC-TXT-20260728` |
| **Módulo** | **2.3.1.28.10** |
| **Doc etapa** | [ETAPA_LOGISTICA_RIMEC_TXT_20260728.md](./ETAPA_LOGISTICA_RIMEC_TXT_20260728.md) |
| **App** | http://localhost:3000/logistica-ok |
| **Meta** | **Logística de Proceso** (hoy) + **Logística Rimec** (TXT Carlos · mismo diseño) |
| **Fuente** | `csv's/Logistica/Logistica Rimec.xlsx` |
| **Último Documenta** | **2.3.1.28.16** Orden tradicional Rimec · pendientes deploy/smoke sesión |

---

## Operativo paralelo (no pausa etapa Logística)

| Tema | Nota |
|------|------|
| **RIMEC Web UX catálogo** | **2.2.1.33** · SWR 30 tarjetas · local OK · prod pendiente cierre · doc CHUSAR 20260728 |
| **PE sdrm2121** | Stock importado · Web OK · Guido asignando % · doc **2.3.1.10.1.5** |
| Overwrite descuentos | UPSERT batch+molécula · Web gana `updated_at` DESC |
| **PROMO sin +10 % LP03** | **2.3.1.10.1.4.4** / **2.2.1.34** · Documenta+deploy 2026-07-29 |
| **Fin de semana · git holding** | **4.05.04.001** · `Nexus_Core` origin = tablet-bazzar.git · no push raíz hasta ventana |
| **Siamese Estilo/Género pilares** | **2.2.1.35** / **2.3.1.10.1.6** · lista FK `/pilares` · Web+AM+DPE · 2026-07-29 |

---

## Pausado / histórico reciente

| Code | Nota |
|------|------|
| `CORTE-CONTROL-ENTREGA-20260727` | Operativo · no en trabajoVivo |
| `LOGISTICA-CARLOS-900M-CABECERA-20260727` | Borrador Excel → supersedido por TXT Rimec |

---

## Deploy prod

| App | Commit | URL |
|-----|--------|-----|
| Report | **DESPLIGA 2026-07-28** · roles (**2.3.1.28.15**) · **Orden tradicional 2.3.1.28.16 local · prod pendiente** | https://rimec-report.vercel.app |
| RIMEC Web | vigente | https://rimec-web.vercel.app |

**Orden Director 2026-07-28:** **Nueva etapa** · Logística Rimec + import TXT.

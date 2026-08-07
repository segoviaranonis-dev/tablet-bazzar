# CHUSAR — Moises · Corte baseline + lotes manuales (índice / sync Andrés)

**Código:** `5.01.00.022`  
**Fecha:** 2026-08-07  
**Keyword:** **Documenta** · **corte administrativo** (orden Director)  
**Etapa:** [ETAPA_CORTE_ADMINISTRATIVO_MOISES_BASELINE_20260807.md](../../4_etapas/ETAPA_CORTE_ADMINISTRATIVO_MOISES_BASELINE_20260807.md)  
**Padre:** [CHUSAR_PROTOCOLO_MOISES_ACTIVADO_20260804.md](./CHUSAR_PROTOCOLO_MOISES_ACTIVADO_20260804.md) (`5.01.00.021`)  
**Changelog vivo:** [CHANGELOG_MOISES.md](../../4_etapas/CHANGELOG_MOISES.md)  
**Shibboleth:** Andrés, el que viene. Protocolo Moises Activado · Moria + ACTUAL acatados.

---

## 0 · Decisión Director (segura)

| Orilla | Rol |
|--------|-----|
| **Héctor (OPS)** | Entorno **vivo** hasta catástrofe o orden de flip |
| **Andrés (fork)** | Copia **independiente** · marketing / módulos / contabilidad ligera · **1–2 días** de atraso aceptado |
| **Canal único Héctor↔Andrés** | Zip **WhatsApp** de **`moria_chusar`** (repo Git **privado** a propósito — Andrés no clona) |
| **Keyword disparo** | **«Protocolo chusar»** → ejecutar este plan (`5.01.00.022`) **dentro** de `C:\Users\hecto\Nexus_Core\moria_chusar` (Héctor) / del zip recibido (Andrés) |
| **Sync automático OPS↔backup** | **OFF** (cierre independencia 2026-08-07) |
| **Actualización Andrés** | **Manual por lotes** 1–2×/semana · mismo canal WhatsApp |

**Nombre vivo del protocolo:** Protocolo Moises Activado.  
**«Protocolo chusar»** = palabra reservada de **disparo** de este canal (legado + costumbre del Director).

**No** se renumeran códigos viejos del índice.  
**Sí** se marca todo lo **posterior al corte** con puntero Moises.

---

## 1 · Corte administrativo = BASELINE inmutable

| Campo | Valor |
|-------|--------|
| **ID baseline** | `MOISES-BASELINE-20260807` |
| **Momento** | 2026-08-07 (Documenta · corte administrativo) |
| **Qué incluye** | Estado de Moria `.claude/` + `memoria-web` de cierre + este CHUSAR **en el instante del corte** |
| **Qué es** | Paquete **inmutable** de referencia para la PC de Andrés |
| **Qué no es** | Cutover de prod Héctor · ni reactivar sync automático |

### 1.1 Empaque para WhatsApp (Director)

**Paquete con el que Héctor se siente seguro:** carpeta **`moria_chusar/`** (sitio Moria + Moria en `content/claude/` + puente + `MOISES_LEEME_ANDRES.md`).

1. Antes de zippear: sync `.claude` → `moria_chusar/content/claude` (ya hecho en Documenta 2026-08-07).  
2. Comprimir **`moria_chusar`** **sin** `node_modules` / `.next` / `.vercel` (o solo `content/` + `MOISES_LEEME_ANDRES.md`).  
3. Anotar **fecha + ID baseline** en el mensaje WhatsApp.  
4. Opcional: SHA-256 del zip.  
5. Andrés abre el zip → Cursor lee **`MOISES_LEEME_ANDRES.md`** primero.

Instrucciones: `moria_chusar/MOISES_LEEME_ANDRES.md` · `memoria-web/LOTE_MOISES_INSTRUCCIONES_WHATSAPP.md` (copia también en `moria_chusar/content/memoria-web-puente/`).

---

## 2 · Puntero en índices (obligatorio post-corte)

A partir de este corte, **toda entrada nueva** en cualquier `INDICE.md` (o fila de catálogo) que sea relevante para Moises/Andrés debe llevar:

```text
🆕 MOISES post-20260807 · YYYY-MM-DD
```

| Elemento | Uso |
|----------|-----|
| `🆕 MOISES post-20260807` | Posterior al baseline (Andrés debe enterarse en un **lote**) |
| `· YYYY-MM-DD` | Fecha de alta/cambio del doc |
| Código catálogo | Sin renumerar lo viejo; códigos nuevos siguen la serie normal |

**Prohibido:** reescribir el índice histórico solo para “poner fecha”.  
**Permitido:** banner al tope del `INDICE.md` del módulo tocado + marca en la fila nueva.

### 2.1 Banner sugerido (módulos tocados post-corte)

```markdown
> **Moises:** entradas `🆕 MOISES post-20260807` = posteriores al baseline.
> Lotes: `.claude/4_etapas/CHANGELOG_MOISES.md` · Protocolo `5.01.00.022`.
```

---

## 3 · CHANGELOG_MOISES (única lista que Andrés “persigue”)

Archivo canónico: `.claude/4_etapas/CHANGELOG_MOISES.md`

| Sección | Significado |
|---------|-------------|
| **Baseline** | Congelado — no re-aplicar |
| **Lote abierto** | Lo que Héctor acumula hasta el próximo WhatsApp |
| **Lotes cerrados** | Histórico de lo ya enviado a Andrés |

**Regla agente Andrés:**  
Si un cambio **no** está en el lote abierto/cerrado del changelog → **no** asumir sync · **no** gastar tokens releyendo toda Moria.

---

## 4 · Protocolo de lote (manual · agente Andrés)

Cuando Andrés recibe un lote y se lo pasa a Cursor:

1. Shibboleth Moises.  
2. Leer `5.01.00.022` + `CHANGELOG_MOISES` del lote.  
3. Aplicar **solo** ítems del lote (docs / repos / DB).  
4. Git: clonar/pull **manual** de los repos listados (no inventar remotes).  
5. DB: **solo** si el lote dice explícitamente qué hacer (ej. reimport Excel Sales, restore tabla X). **Prohibido** sync ciego a OPS Héctor.  
6. Marcar ítems del lote como aplicados en su copia local del changelog.  
7. Lo anterior al baseline = **inmutable** salvo orden Héctor en un lote.

---

## 5 · Qué queda inmutable vs qué es nuevo

| Capa | Inmutable (baseline) | Nuevo (post-corte) |
|------|----------------------|--------------------|
| Docs CHUSAR previos | Sí | Solo con `🆕 MOISES post-20260807` + fila en changelog |
| Código en git Héctor | Snapshot del momento del lote | Repos/commits citados en el lote |
| DB OPS Héctor | No se espeja sola | Solo acciones DB listadas en el lote |
| Prod `rimec.com.py` | De Héctor | Andrés no la toca |

---

## 6 · Relación con independencia (2026-08-07)

- Sync automático **sigue OFF**.  
- Credenciales OPS en Andrés: archivadas · no usar salvo lote + orden.  
- Flip futuro (Andrés principal): **otra etapa** · no este CHUSAR.

---

## 7 · Checklist Documenta (este corte)

| # | Ítem | Estado |
|---|------|:------:|
| 1 | CHUSAR `5.01.00.022` | ✅ |
| 2 | `CHANGELOG_MOISES.md` | ✅ |
| 3 | Etapa corte baseline | ✅ |
| 4 | Índices protocolos / fundamentos | ✅ |
| 5 | Puente WhatsApp `memoria-web` | ✅ |
| 6 | Regla Cursor agente | ✅ |
| 7 | ACTUAL + puntero Moises padre | ✅ |

---

**Documenta 2026-08-07 — Corte `MOISES-BASELINE-20260807` · lotes manuales · índices con puntero.**

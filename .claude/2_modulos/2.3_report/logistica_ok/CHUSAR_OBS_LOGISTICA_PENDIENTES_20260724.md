# Obs. Logística · hilo con autor · pendientes (2026-07-24)

**Código:** **2.3.1.28.6** · extiende **2.3.1.28.5**  
**Etapa viva:** `LOGISTICA-OK-20260719` + `PE-FINAL-CIERRE-MODULO-20260723`  
**Documenta:** Director 2026-07-24

---

## Hecho (local · sin commit)

| Ítem | Detalle |
|------|---------|
| **MIG-179** | Tablas `logistica_observacion` + `logistica_observacion_lectura` · aplicada Supabase dev |
| **Lib TS** | `report/src/lib/logistica-ok/observaciones-logistica.ts` |
| **API Report** | `GET/POST /api/logistica-ok/observaciones` · `POST …/leer` |
| **IC nueva** | Campo **Logística** → append con autor al registrar |
| **PP IC asignada** | Bloque Obs. Logística admin → append al Guardar IC |
| **Rimec-web carrito** | **Logística (opcional)** → hilo PE al confirmar |
| **Generar FI** | `vincularObservacionesIcAFi` (admin IC + proforma programado) |
| **Logística OK UI** | Sobre ✉️ por FI + cabecera cadena/marca · modal hilo · lectura por pestaña |
| **Script** | `report/scripts/apply-mig-179-obs-logistica.mjs` |

---

## Pendiente operativo

| # | Qué | Quién / dónde |
|---|-----|----------------|
| 1 | **Smoke E2E** IC → PP obs → FI → activar logística → sobre en `/logistica-ok` | Director local |
| 2 | **Smoke PE** carrito `:3001` obs → confirmar → sobre en bandeja | Director local |
| 3 | **Levantar Rimec-web** con código nuevo (`dev:3001` o clean) si proceso viejo | Cursor |
| 4 | **MIG-175** `fecha_entrega_cliente` + columna `observacion` legacy — verificar aplicada en todos los entornos | Claude Code / Supabase |
| 5 | **sync-pp** — hoy copia `fecha_entrega_cliente`; obs van por hilo MIG-179 (no duplicar en columna) | OK diseño · validar en sync |
| 6 | **Commit + push** report + rimec-web (solo Claude Code + OK Director) | Pendiente |
| 7 | **Deploy Vercel prod** — prohibido Cursor; tras commit | Claude Code |
| 8 | **report build** — error previo `vincular-listado/route.ts` (`formatCertificacionPreciosCp`) no relacionado con obs | Hotfix aparte |
| 9 | **Cabecera stats PP** en Logística OK cuando >1 PP (497/729) — tema aparte, no implementado | Etapa LOGISTICA-OK |
| 10 | **PE final** montos FI · CSV Carlos · plazos — etapa **2.3.1.9.B.FINAL** sigue abierta | Paralelo |

---

## Despliegue local (2026-07-24 ~16:10 UTC-3)

| App | URL | Estado verificado |
|-----|-----|-------------------|
| **Report** | http://localhost:3000 | 🟢 `dev:clean:3000` · `/login` 200 tras reinicio |
| **Rimec-web** | http://localhost:3001 | 🟡 responde 307 (redirect) — **reiniciar** para código obs PE |
| **Navegador etapas** | http://localhost:3004 | 🟢 200 |
| **Prod Vercel** | — | 🔴 no desplegado (código solo local) |

---

## Rutas clave smoke

1. IC: `/proceso-importacion/intencion-compra/nueva`
2. PP: `/proceso-importacion/pedido-proveedor/[ppId]?tab=ics`
3. Web PE: `http://localhost:3001/carrito`
4. Bandeja: `/logistica-ok` pestañas General / Confirmadas / Vendedor

---

## Reglas producto (recordatorio)

- **nota_pedido** y descuentos D1–D4 **no se tocan**
- Icono sobre **solo si** `obs_count > 0` en FI
- Lectura registrada **por pestaña** (`logistica_observacion_lectura`)
- Orígenes: `IC` · `PP` · `PE_WEB`

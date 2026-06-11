# ETAPA: TABLET BAZZAR — POS TIENDA FÍSICA

**Fecha inicio:** 2026-06-10  
**Estado:** ACTIVA — Director definió objetivo  
**Ejecutor:** Claude Code (código) · Antigravity (UI touch) · Cursor (auditoría)  
**Verificador:** Cursor

---

## 🎯 OBJETIVO DE LA ETAPA

Construir y operativizar **Tablet Bazzar**: PWA de punto de venta para vendedores en las **6 tiendas físicas Bazzar**, con creación de **tickets** (ORO del negocio) trazables por pilares, cliente y tienda.

**Éxito =** vendedor en tablet puede buscar producto del depósito de su tienda, registrar cliente y emitir ticket que sube a Supabase; dirección lo ve en Report.

---

## 📍 CONTEXTO ESTRATÉGICO

**Hiedra Venenosa — Fase 1 (Infiltración):** primer puente RIMEC → retail físico Bazzar.

| Componente | Rol | Usuario |
|------------|-----|---------|
| `tablet-bazzar/` | PWA POS — **crear** tickets | Vendedores tienda (60+) |
| `report/…/tablet-bazzar` | Dashboard — **monitorear** tickets | Admin / Retail (roles 1, 2) |
| 6 tablas depósito | Stock por tienda | Backend Supabase |
| `cliente_web` | Cliente unificado tienda + web | Compartido con bazzar-web |

**Filosofía:** cada ticket = venta real con 5 pilares FK → trazabilidad molecular, comisiones, KPIs, futuro informe retail.

---

## 🏪 TIENDAS (6 DEPÓSITOS)

| Ubicación | Adultos | Niños | cliente_id |
|-----------|---------|-------|------------|
| Fernando de la Mora | FER-A | FER-N | 2100 / 2900 |
| San Martín | SM-A | SM-N | 2400 / 2700 |
| Palma | PAL-A | PAL-N | 3100 / 3200 |

Doc depósitos: `.claude/3_arquitectura/3.2_venta_tienda/depositos.md`  
Doc tickets: `.claude/3_arquitectura/3.2_venta_tienda/tickets_oro.md`

---

## 🏗️ ARQUITECTURA APROBADA

```
Nexus_Core/
├── tablet-bazzar/          ← PWA POS (Next.js 15, puerto dev 3002)
├── report/
│   └── src/app/tablet-bazzar/   ← Monitoreo dirección (placeholder)
├── control_central/
│   └── migrations/016_usuarios_de_tablet.sql
└── bazzar-web/             ← E-commerce B2C (canal distinto)
```

**Stack PWA:** Next.js 15 · TypeScript · Tailwind · Supabase · JWT (jose) · PWA (`next-pwa`) · landscape · offline-first (pendiente).

**Deploy previsto:** Vercel — `tableta-bazzar.vercel.app` (Etapa 1 histórica).

---

## ✅ ETAPA 1 — COMPLETADA (2026-06-08, doc)

Según `TABLET_BAZZAR_ETAPA_1_COMPLETADA.md`:

- Arquitectura documentada (`TABLET_BAZZAR_ARQUITECTURA.md`)
- Login JWT + cookie `tablet-session` (8 h)
- Middleware protección rutas
- PWA manifest configurado
- Usuarios prueba: HECTOR / IVO vía `usuario_v2`
- Deploy Vercel reportado OK

---

## ⏳ ETAPA 2 — ALCANCE ACTIVO (esta etapa)

### Prioridad 1 — Recuperar / verificar base
- [x] Repo `tablet-bazzar/` operativo en Nexus_Core
- [x] `npm run dev` puerto 3002 · login smoke test
- [x] `DATABASE_URL` vía `.env.local` / script sync
- [ ] Report monitoreo tickets (placeholder)

### Prioridad 2 — UI POS touch
- [x] Panel post-login con modos de vista
- [x] Depósito con fotos (grid touch)
- [x] Cadena consecutiva — UI BR, gestos, paneles colapsables, aside fotos fijo
- [x] **Backend titanio** — `/filtros`, `/ingresar`, `/cadena`, `/live` (2026-06-11)
- [x] Botón INGRESAR + sesión POS 12 h + stock live 4 s
- [ ] Carrito / flujo ticket

### Prioridad 3 — Clientes
- [ ] Buscar por cédula en `cliente_web`
- [ ] Alta rápida en tienda (`canal_registro = 'TIENDA'`)

### Prioridad 4 — Tickets (ORO)
- [ ] Diseñar / confirmar esquema `tickets` + `ticket_detalle` con FK pilares
- [ ] Búsqueda producto desde depósito de la tienda del vendedor
- [x] **Agrupación catálogo UI:** Nivel 1 L+R+Mat · Nivel 2 color — `lib/cadena.ts`
- [x] **Catálogo server-side:** SQL titanio — sin dump cliente (`lib/server/`)
- [ ] Resolución precio LPN (Motor) en API server
- [ ] Crear ticket · totales · estado BORRADOR → CONFIRMADO
- [ ] API server-side (nunca lógica de stock en cliente solo)

### Prioridad 5 — Monitoreo Report
- [ ] Dashboard tickets recientes · KPI por tienda · ranking vendedores

### Prioridad 6 — Offline / PWA
- [ ] Service worker · caché catálogo · sync al reconectar
- [ ] Carga garantizada imágenes (patrón Report commit 65a8add)

---

## 🔐 AUTH — DECISIÓN PENDIENTE DIRECTOR

Existen **dos diseños** en documentación:

| Fuente | Modelo | Login |
|--------|--------|-------|
| `TABLET_BAZZAR_ARQUITECTURA.md` | `usuarios_de_tablet` | Código vendedor (22) |
| Etapa 1 implementada | `usuario_v2` | Usuario + password (HECTOR, IVO) |

**Regla Etapa 1 doc:** rol 1 total · rol 2 solo ADMIN/SU · VENDEDOR → usar Report, no tablet.

**Director debe confirmar** antes de escalar a 60 vendedores: ¿código numérico, huella futura, o híbrido?

---

## 🚫 FUERA DE ALCANCE (esta etapa)

- Facturación legal / CSV export (fase posterior)
- Reemplazo Motor de precios RIMEC
- Tocar Sales Report histórico (`registro_ventas_general_v2`)
- Deploy producción sin aprobación explícita Director

---

## 📋 ENTREGABLES Y EVIDENCIA

| Entregable | Evidencia |
|------------|-----------|
| PWA funcional local | screenshot login + dashboard |
| Ticket creado en BD | query Supabase + JSON evidencia |
| Report monitoreo | ruta `/tablet-bazzar` con datos reales |
| Cierre etapa | 5 pasos protocolo `1.1.10_protocolo_cierre_etapa.md` |

---

## 📚 DOCUMENTACIÓN CANÓNICA

| Documento | Ruta |
|-----------|------|
| **Agrupación 2 niveles (LEY POS)** | `.claude/2_modulos/2.4_tablet_bazzar/agrupacion_dos_niveles.md` |
| **Backend POS titanio** | `tablet-bazzar/docs/BACKEND_POS.md` |
| **Cadena consecutiva (UI)** | `tablet-bazzar/docs/CADENA_CONSECUTIVA.md` |
| **Cierre sub-etapa cadena** | `.claude/4_etapas/ETAPA_TABLET_CADENA_BACKEND_TITANIO_CERRADA.md` |
| **Memoria cuestionario cadena** | `tablet-bazzar/docs/MEMORIA_CADENA_UI.md` |
| Arquitectura maestra | `.claude/TABLET_BAZZAR_ARQUITECTURA.md` |
| Etapa 1 cerrada | `.claude/TABLET_BAZZAR_ETAPA_1_COMPLETADA.md` |
| Módulo 2.4 | `.claude/2_modulos/2.4_tablet_bazzar/04_tablet_bazzar.md` |
| Depósitos | `.claude/3_arquitectura/3.2_venta_tienda/depositos.md` |
| Tickets ORO | `.claude/3_arquitectura/3.2_venta_tienda/tickets_oro.md` |
| Estrategia Hiedra | `.claude/1_fundamentos/1.3_politicas/fundamentos_estrategicos.md` |

---

## ⚠️ BRECHA DETECTADA — ACTUALIZACIÓN 2026-06-11

Resuelto en workspace local:

1. **`tablet-bazzar/`** — código Etapa 2 parcial (auth, depósito, cadena)
2. **Documentación** — `tablet-bazzar/docs/` + actualización módulo 2.4

Pendiente:

3. **Deploy Vercel** con `DATABASE_URL` producción
4. **Report** monitoreo tickets con datos reales

---

## 🔄 RAMA SUGERIDA

```bash
git checkout -b claude/tablet-bazzar-etapa-2
```

---

**Aprobado por:** Héctor Segovia (Director) — objetivo declarado 2026-06-10  
**Shibboleth V2:** Un gato tiene 5 patas ✅

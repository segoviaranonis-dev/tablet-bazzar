# CHUSAR — Tablet · Módulo Ventas

**Sub-sesión:** [SUBSESION_TABLET_VENTAS_20260617_CERRADA.md](../../4_etapas/SUBSESION_TABLET_VENTAS_20260617_CERRADA.md)  
**Estado:** ✅ CERRADA 2026-06-17 (hotfix stands stock par L+R + deploy Vercel)

---

## Qué es Ventas

Modo POS tablet para vender en piso: **triángulo pilares** → **marca + depósito** → navegación **L+R** · hero · colores · **stands stock** · carrito.

| Capa | Ubicación |
|------|-----------|
| UI | Panel `/` → **Ventas** |
| Ruta | `/cadena` → `/cadena/vista` |
| Modo | `lib/view-modes.ts` → `id: "ventas"` |

**Ex nombre:** cadena consecutiva.

---

## Stands stock (ley operativa — 2026-06-17)

| Regla | Detalle |
|-------|---------|
| **Total INGRESAR = total tallas** | Ref `1184.1101` → **214 p** = suma gradas 34–40 en **tu tienda** |
| **Agregación** | Par **L+R** (código proveedor), no solo color activo |
| **FK NULL retail** | `/live` usa `linea`+`referencia` si `linea_id`/`referencia_id` NULL |
| **Otras tiendas** | Dock **2 paneles fijos** (las otras ubicaciones) — mini-tabla tallas · poll `/live` |
| **Scope stock** | Color activo → molécula L+R+Mat+Color · sin color → par L+R |
| **Carrito** | Tap talla = +1 par · `GradaVentaStrip` + `PosCartSheet` |

**API:** `GET /api/deposito/{cliente_id}/live?linea=&referencia=&material_id=&color_id=`  
**SQL:** `lib/server/stock-par-grada.ts` (par + molécula)  
**Chusar:** [CHUSAR_OTRAS_TIENDAS_STOCK.md](./CHUSAR_OTRAS_TIENDAS_STOCK.md)  
**Hotfix doc:** `tablet-bazzar/docs/HOTFIX_VENTAS_STANDS_STOCK_PAR_LR.md`

---

## Flujo vendedor

1. Login → **Ventas** → depósito + marca → INGRESAR  
2. Hero + colores + **stands** (otras tiendas arriba, tallas abajo)  
3. Tap talla → carrito → **CERRAR** (cédula + código vendedor — ver [CHUSAR_POS_CLIENTE_CEDULA](./CHUSAR_POS_CLIENTE_CEDULA.md) · [CHUSAR_TABLET_VENDEDOR_STAGING](./CHUSAR_TABLET_VENDEDOR_STAGING.md))

---

## Leyes (no romper)

1. Agrupación 2 niveles — `agrupacion_dos_niveles.md`  
2. Pilares FK en lectura  
3. Imágenes 654 candado  
4. Depósito con fotos = otro modo (sin triángulo)  
5. Sales Report blindado

---

## Docs app

| Doc | Tema |
|-----|------|
| `HOTFIX_VENTAS_STANDS_STOCK_PAR_LR.md` | Stands + live par L+R |
| `CADENA_CONSECUTIVA.md` | UI Ventas |
| [CHUSAR_TABLET_CADENA_GRADA_GRILLA.md](./CHUSAR_TABLET_CADENA_GRADA_GRILLA.md) | Entrada GRADA + grilla miniaturas · **2.4.2.6** |
| `ETAPA_4_TICKET_BOTON.md` | Carrito / tikeCT |
| `CHUSAR_POS_CLIENTE_CEDULA.md` | Cliente cédula · réplica Bazzar Web |
| `DEPLOY_VERCEL.md` | Producción |

---

## Sub-sesiones relacionadas

| Sub-sesión | Estado |
|------------|--------|
| **Ventas stands 20260617** | ✅ CERRADA |
| Depósito fotos 20260617 | 🟢 ACTIVA |
| Triángulo pilares 20260616 | ⏸ PAUSADA |
| Calidad imagen 20260616 | ✅ CERRADA |

---

**Shibboleth:** 7 años

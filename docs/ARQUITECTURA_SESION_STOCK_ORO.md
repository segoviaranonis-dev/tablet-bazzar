# Arquitectura sesión stock · vendedor · ORO

## Tres capas

| Capa | Tabla | Stock sesión |
|------|--------|--------------|
| **Intermedia** | `ticket_pos_staging` | **Sí** |
| **Bandeja cajero** | `ticket_bandeja_cajero` | No · efímera |
| **Bobeda (ORO)** | `bobeda_venta_pos` | No · permanente |

Doc protocolo: `.claude/2_modulos/2.3_report/caja_bazzar/P-12_PROTOCOLO_CAJERO_BOBINA.md`  
Migración: `supabase/migrations/005_bandeja_bobeda_split.sql`

## Dos tablas BD (técnico)

| Rol | Tabla | Qué es |
|-----|--------|--------|
| **Intermedia (sesión)** | `ticket_pos_staging` + `ticket_pos_staging_linea` | Vive solo mientras dura la sesión de stock del día |
| **Bandeja cajero** | `ticket_bandeja_cajero` | Cola Report · CSV · titular · quitar par |
| **Bobeda ORO** | `bobeda_venta_pos` | Histórico importable · Empaque · Sales Report Bazzar futuro |
| ~~Legacy~~ | `ticket_venta_pos` | Deprecar tras smoke · fallback pre-005 |

## Vendedor (RRHH + PIN)

Canónico RRHH Report:

- `funcionarios` — empleado, **`ente_id`** → `entes` (RIMEC=1, Fernando=2, San Martín=3, Palma=4)
- Módulo: `/rrhh` · queries en `src/app/rrhh/lib/rrhh-queries.ts`

Extensión POS (tablet):

- `vendedor_bazzar` — FK `funcionario_id` + `ente_id` + **`codigo_pin`** único por ente (migración **004**)
- Identificación por **ente** del piso (Fernando 2100/2900 comparten vendedores; San Martín 2400/2700; Palma 3100/3200)
- UI: código vendedor en carrito · `VendedorEnteSwitch` para cambiar entre vendedores del mismo ente
- **No persistir** vendedor en `localStorage` — tablet pasa de mano en mano

## Ciclo de vida del stock (sesión)

```
Excel Retail → registro_st_vt_rc_reposicion
     ↓ Actualizar stock (sync depósitos)
deposito_1_{cliente_id}_tienda  ← sesión del día (6 locales)
     ↓ ventas tablet
ticket_pos_staging  ← AQUÍ baja/sube stock (+ arrepentimiento)
     ↓ Cerrar → Promover ORO
ticket_venta_pos  ← registro permanente (sin tocar stock otra vez)
     ↓ Actualizar stock (fin sesión)
DELETE depósito + reimport — stock sesión desaparece
ticket_venta_pos queda (único recuerdo operativo)
```

## Reglas implementadas

1. **CERRAR** → crea staging **ABIERTO** y **descuenta stock** en depósito tienda (requiere cliente + vendedor).
2. **Editar / cancelar** staging → restaura o ajusta stock (arrepentimiento).
3. **→ ORO** → copia a `ticket_venta_pos` **sin** mover stock otra vez.
4. **Actualizar stock** (`POST /api/depositos/sync`) → **bloqueado** si existe staging `ABIERTO` o `CERRADO` (409).

Estados staging: `ABIERTO` · `CERRADO` · `CANCELADO` · `ORO`

Pendiente = `ABIERTO` | `CERRADO` (aún no archivado en ORO).

## Tres módulos tablet (ciclo cerrado)

| Módulo | Función |
|--------|---------|
| Depósito | Stock sesión |
| Venta | Staging intermedia |
| **Empaque** | Bobeda · anti-bypass |

Ver: `.claude/2_modulos/2.4_tablet_bazzar/P-01_TRES_MODULOS_CICLO_CERRADO.md`

Nexus/Report orbita la caja: CSV + ticket ORO. La factura fiscal sigue en el sistema legacy — nosotros no la emitimos.

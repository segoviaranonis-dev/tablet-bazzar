# 2.3.10 RRHH — Módulo dentro de Report

**Padre:** [2.3 Report](../INDICE.md)  
**Tipo:** Submódulo web · app `report/`  
**Tecnología:** Next.js (mismo deploy Report)  
**Estado:** ✅ CERRADO (producción)  
**Deploy:** rimec-report.vercel.app/rrhh  
**Última actualización:** 2026-06-17 (Chusar — reindexación 2.6 → 2.3.10)

---

## Plan de cuentas

| Código | Subcuenta | Ruta app |
|--------|-----------|----------|
| **2.3.1.6** | RRHH (dentro RIMEC 2.3.1) | `/rrhh` |
| **2.3.1.6.1** | Vacaciones | `/rrhh/vacaciones` |
| **2.3.1.6.2** | Funcionarios | `/rrhh` |

---

## Descripción

**Sistema de Gestión de Vacaciones** del holding Nexus (RIMEC + Tiendas Bazzar).

**Objetivo principal:** Procesar y administrar vacaciones con **sistema DUAL**:

### Vacaciones por DÍAS (funcionarios regulares)
- Ley paraguaya: 12/18/30 días según antigüedad
- Registro días tomados/pendientes

### Vacaciones por HORAS (gerentes/supervisores)
- Banco de horas (1 día = 8 horas)
- Fracciones 0.5h–8h

**Funciones secundarias:** listado funcionarios por ente, filtros departamento/cargo/búsqueda, jerarquía organizacional.

---

## Documento canónico (Chusar)

⭐ **[FUNCIONAMIENTO_ACTUAL.md](./FUNCIONAMIENTO_ACTUAL.md)** — rutas, APIs, **tablas DB**, reglas de negocio, fix modal 3b.

---

## Estructura Moria

```
2.3_report/rrhh/
├── INDICE.md (este archivo)
├── FUNCIONAMIENTO_ACTUAL.md     — operación + tablas DB ⭐
├── CONTEXT.md                   — arquitectura
├── diseño_bd.md                 — esquema entes + funcionarios + vacaciones
├── carga_inicial.md             — import Excel → PostgreSQL
└── RESUMEN_EJECUTIVO.md
```

---

## Tablas PostgreSQL en uso

| Tabla | Rol |
|-------|-----|
| `entes` | Holding (RIMEC, tiendas, Bazzar Web) |
| `funcionarios` | Maestro empleados |
| `vacaciones` | Saldo anual dual (días + horas) |
| `vacaciones_detalle` | Histórico atómico por toma |
| `v_vacaciones_funcionarios` | Vista SQL (app usa JOINs explícitos) |

Detalle columnas: [FUNCIONAMIENTO_ACTUAL.md](./FUNCIONAMIENTO_ACTUAL.md) · [diseño_bd.md](./diseño_bd.md)

---

## Rutas activas

| Ruta | Función |
|------|---------|
| `/rrhh` | Listado funcionarios + resumen vacaciones |
| `/rrhh/vacaciones` | Gestión vacaciones, modal, historial |

Auth: `rol_id` 1 y 2 (`report/src/middleware.ts`).

---

## Etapas cerradas

- [ETAPA_RRHH_CERRADA.md](../../4_etapas/ETAPA_RRHH_CERRADA.md) — entrega 2026-06-14
- [ETAPA_RRHH_INVESTIGACION_VACACIONES_MODAL.md](../../4_etapas/ETAPA_RRHH_INVESTIGACION_VACACIONES_MODAL.md) — fix modal 3b · 2026-06-16

---

## Fuera de scope

Aprobaciones workflow, notificaciones, PDF, nómina, carga masiva tiendas.

---

## Referencias

- Report padre: [../INDICE.md](../INDICE.md)
- Migración CC→Report: `.claude/3_manual_funciones/MIGRACION_STREAMLIT_REPORT.md`
- Errores: `4.02.01.001` RRHH 404 Vercel

**Shibboleth:** 7 años

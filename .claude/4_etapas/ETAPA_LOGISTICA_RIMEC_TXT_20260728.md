# ETAPA — Logística Rimec · TXT informe ventas Carlos

**ID:** `LOGISTICA-RIMEC-TXT-20260728`  
**Código módulo:** **2.3.1.28.10** (evolución del plan Excel → **TXT**)  
**Estado:** ⬛ **CERRADA ADMINISTRATIVA** 2026-08-04 · [CERRADA](./ETAPA_LOGISTICA_RIMEC_TXT_20260728_CERRADA.md) · corte Moises  
**Apertura:** 2026-07-28 · keyword Director **Nueva etapa**  
**Última sync doc:** 2026-08-01  
**App:** http://localhost:3000/logistica-ok  
**Fuente:** `csv's/Logistica/52986482 hector.txt`  
**Plan padre:** [CHUSAR_LOGISTICA_CARLOS_900M…](../2_modulos/2.3_report/logistica_ok/CHUSAR_LOGISTICA_CARLOS_900M_CABECERA_EXCEL_20260727.md)  
**Shibboleth:** Andrés, el que viene.

---

## Nombres UI (dato duro Director)

| Nombre | Qué es |
|--------|--------|
| **Logística de Proceso** | Módulo actual `/logistica-ok` (FI Nexus · sync PP) |
| **Logística Rimec** | Vista nueva · **mismo diseño** · backlog TXT Carlos |

---

## Objetivo

Importar el informe genérico de ventas Carlos (TXT fijo) a **Logística Rimec**, operando con el mismo esquema visual/semáforo que Logística de Proceso, sin mezclar filas nativas.

---

## Alcance Fase 1

| # | Entregable | Estado |
|---|------------|--------|
| 1 | Parser TXT → cabeceras (+ ítems) | ✅ → Excel `Logistica Rimec.xlsx` |
| 2 | Tabla puente `logistica_rimec_*` + API import/bandeja | ✅ MIG-190/191 · local |
| 3 | UI dual Proceso \| Rimec (mismo diseño · color distinto) | ✅ violeta Rimec |
| 4 | Smoke: N facturas · Σ montos · visible en Rimec | ✅ 129 FI · Excel |
| 5 | Vendedores col F → `vendedor_v2` · agrupar por nombre | ✅ |
| 6 | Multi-select General/Vendedor/Confirmadas/Entregas+chofer | ✅ **2.3.1.28.14** |
| 7 | Choferes RRHH Julian Rotela + Gerardo Dominguez | ✅ |
| 8 | Roles JEFE_DEPOSITO + VENDEDOR filtrado · CRISTHIAN | ✅ **2.3.1.28.15** |
| 9 | Deploy prod Report (orden DESPLIGA) | ✅ 2026-07-28 · roles/bandeja |
| 10 | Orden tradicional PDF Graciela (obs visible · toggle) | ✅ local **2.3.1.28.16** · **prod pendiente** |

---

## Deploy (2026-07-28)

- Local OK · docs **2.3.1.28.14** + **2.3.1.28.15**
- **Prod:** orden directa Director **DESPLIGA** · push `report` `main` → Vercel (`b64c3e1` roles)
- **Pendiente:** push/deploy UI **Orden tradicional** (**2.3.1.28.16**) — requiere nueva orden **DESPLIGA** o cierre etapa

---

## Fuera de alcance (salvo orden)

- Empareje 1:1 con `factura_interna` Nexus (fase 2).
- Mezclar filas Rimec en la bandeja de Proceso.
- Columnas PDF prefijos / saldo en tabla tradicional.

---

## Archivo fuente

`C:\Users\hecto\Nexus_Core\csv's\Logistica\52986482 hector.txt`  
Layout: `INFORME GENERICO DE VENTAS` · `FACTURA + ARTICULO` · **no** Excel cabeceras.

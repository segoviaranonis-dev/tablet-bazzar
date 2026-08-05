# CHUSAR — Logística multi-select + choferes RRHH

**Código:** `2.3.1.28.14`  
**Fecha:** 2026-07-28  
**Keyword:** Documenta · Director  
**App:** Report `/logistica-ok` · Proceso + Rimec  
**Etapa:** `LOGISTICA-RIMEC-TXT-20260728`

---

## Ley UI — multi-selección

Toda pestaña que **asigna** algo debe tener checkboxes + barra de lote:

| Pestaña | Acción multi | API |
|---------|--------------|-----|
| **General** · **Vendedor** | Asignar fecha entrega al cliente | `POST …/bulk` · `fecha_cliente` |
| **Confirmadas** | Impresión legal | `impresion_legal` |
| **Entregas del día** | Cierre entrega + chofer | `cierre_entrega` |
| **Exitosas** / **General exitoso** | Solo lectura · sin multi | — |

Implementación: `LogisticaOkClient.tsx` · `multiEnabled` + barra operativa.

---

## Choferes (RRHH → catálogo)

Fuente: tabla `funcionarios` · departamento LOGISTICA.

| UI catálogo | RRHH `nombre_completo` | id | cargo |
|-------------|------------------------|----|-------|
| Oscar Figueredo | (histórico) | — | — |
| Ariel Martínez | (histórico) | — | — |
| Gilberto Colman | GILBERTO ALEJANDRO COLMAN DOMINGUEZ | 66 | AUXILIAR LOGISTICA |
| **Julian Rotela** | JULIAN ROTELA DOMINGUEZ | **72** | AUXILIAR LOGISTICA |
| **Gerardo Dominguez** | GERARDO DOMINGUEZ RIVEROS | **68** | CHOFER |

Constante: `report/src/lib/logistica-ok/constants.ts` → `CHOFERES_RIMEC_INICIAL`.

---

## Rimec — vendedores (col F)

- Agrupar por **nombre** (`vendedor_v2`), no por código Carlos.
- Código Carlos bajo factura (`Vend. N`).
- Extra mapa: 28 MARIO · 68/69 CARINA · 72 HUGO · 101 PATRICIA · 111 DARIO.

---

## Despliegue

1. Smoke local `:3000/logistica-ok/rimec` — General / Vendedor / Confirmadas / Entregas multi.
2. Verificar choferes en modal cierre + barra Entregas.
3. **Deploy prod 2026-07-28:** orden directa **DESPLIGA** · ver **2.3.1.28.15**.
4. Migs 190/191 en local · Report `main` → Vercel.

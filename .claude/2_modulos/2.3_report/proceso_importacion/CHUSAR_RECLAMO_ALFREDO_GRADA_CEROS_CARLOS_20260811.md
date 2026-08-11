# CHUSAR — Reclamo Alfredo · grada con ceros · sistema Carlos

**Código:** **2.3.1.7.5.3.16**  
**Fecha:** 2026-08-11  
**Keyword:** **Documenta** · **Protocolo chusar activado**  
**Usuario:** **Alfredo** (ADMIN RIMEC · gerente)  
**Caso:** **PP-2026-0034** · proforma **9888/2026** · preventa **4151** · 37 IC · 294 moléculas

**Padres:** `2.3.1.7.5` · `CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO` (**2.3.1.7.5.3.4**) · entorno reclamos **`50.31`**

---

## 0 · Entiendo el problema (sí)

Alfredo tiene razón y **debemos ajustarnos a Carlos**, no al revés.

| | **Sistema Carlos (legacy)** | **Nexus hoy** |
|--|----------------------------|---------------|
| Compra | 35=1 · **36=0** · 37=5 · 38=4 · 39=2 | 35=1 · 37=5 · 38=4 · 39=2 (sin 36) |
| Representación | **`35(1 0 5 4 2)39`** | **`35(1 5 4 2)39`** (o peor **`35(1 5 4 2)36`**) |
| Regla | Entre talla inicial y final **cada entero del rango** tiene cantidad; **falta = 0** | Solo lista tallas con qty > 0 |

**Por qué importa:** el **CSV veneno** (`8604-26.csv`, `9888-26.csv`, …) que Carlos importa usa la columna grada con esa semántica. Si Nexus omite el `0`, el host interpreta mal la curva → **conflicto de inyección** (Hiedra venenosa · Alejandro Magno).

**Molécula:** sigue siendo 1 PPD = L+R+material+color+grada; `grades_json` puede guardarse **sparse** (solo qty>0); la **serialización Carlos** debe expandir con ceros al exportar/mostrar donde Carlos lee.

---

## 1 · Evidencia (Director 2026-08-11)

- **PP:** PP-2026-0034 · BEIRA RIO · PROGRAMADO · creador ALFREDO
- **IC ejemplo:** IC-2026-0906 · VIZZANO 7286 · cliente 2983
- **Grada pintada Nexus:** `35(1 5 4 2)36` (sin cero en 36 · posible error también en talla final)
- **Grada Carlos esperada:** `35(1 0 5 4 2)39`

---

## 2 · Regla canónica Carlos (propuesta holding)

```
Dado grades_json sparse { talla → qty } con tallas numéricas enteras:
  min = min(tallas activas)
  max = max(tallas activas)
  Para t = min, min+1, … max:
    emitir qty(t) si existe, else 0
  Salida: "{min}({q_min} {q_min+1} … {q_max}){max}"
  Separador: espacio (ley importadora existente)
```

**No confundir con** curva caja cerrada canónica `34(1 2 3 3 2 1)39` (12 pares) — aquí la secuencia es **contigua entera** entre min y max del pedido, con **huecos en cero**.

---

## 3 · Dónde vive el bug hoy

| Archivo | Función | Comportamiento actual |
|---------|---------|------------------------|
| `report/src/app/aprobaciones/lib/linea-snapshot-display.ts` | `gradasFmtFromJson` | Solo keys presentes → **sin ceros** |
| `report/src/lib/pedido-proveedor/csv-ventas-export.ts` | `gradaFromJson` | Usa `gradasDisplayFromSnapshot` → veneno afectado |
| `control_central/core/csv_utils.py` | `_grades_json_a_compacto` | Igual — solo activas (legacy Python) |

**Import proforma** (`parse-proforma.ts`): guarda sparse en `grades_json` — **OK**; no hay que duplicar ceros en BD salvo decisión explícita.

---

## 4 · Alcance fix — ✅ IMPLEMENTADO 2026-08-11

1. **`grada-carlos-format.ts`** — `gradasFmtCarlosFromJson` expand ceros min→max  
2. **CSV veneno** ventas + inicial — columna grada  
3. **Administrador IC** · tab Stock · FI card · PDF FI — misma regla  
4. Ley holding: **`LEY_GRADA_CEROS_CARLOS_PROFORMA.md`** (**2.3.1.7.5.3.16.1**)  
5. Reclamo **`PP-REC-001`** → **cerrado** post-deploy Alfredo

---

## 5 · Reclamo ≠ bug

| | Reclamo Alfredo | Bug urgente |
|--|-----------------|-------------|
| Naturaleza | Paridad semántica con Carlos | Fallo 500 / crash |
| Puerta | `50.31` + este CHUSAR | `protocolo_errores` |
| Código | `PP-REC-001` | `4.xx.xx` nuevo solo si Director pide índice error |

---

## 6 · Deuda doc hermana

- `CHUSAR_CSV_VENENO` § deuda: *«validar vendedor · grada · caso»* — **grada** = este reclamo  
- Actualizar `MAPA_ALA_NORTE_STOCK_PP.md` nota formato Carlos con ceros tras fix

---

## 7 · Estado

✅ **Deploy Report `c9db7ba`** — 2026-08-11 · prod `report-plum-one.vercel.app`  
Alfredo validar PP-2026-0034 · IC-2026-0906 · grada **`35(1 0 5 4 2)39`**

---

## 8 · Shibboleth

Si pienso en el lo entiendo, pero si me lo explicarlo es imposible · Protocolo Moises Activado.

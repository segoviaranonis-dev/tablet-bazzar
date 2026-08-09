# CHUSAR — Pipeline TXT sucios → Situación financiera Nexus (corte AL)

**Código:** **2.3.1.50.3**  
**Fecha:** 2026-08-09  
**Keyword:** **Documenta** · ejecuta  
**Constitución:** **2.3.1.50** · Auditoría cobros **2.3.1.50.1** · SF-MAPA **2.3.1.50.2**  
**🆕 MOISES post-20260807 · 2026-08-09**

---

## 0 · Orden del Director

1. ¿Hay registro del script del funcionario? → **Sí** (intake colaborador + `limpiador.py` / `analisis_cobros.py`).  
2. Replicar y mejorar **dentro de Nexus**.  
3. Paquete completo en `D:\Situacion Financiera _AL_03-08-26`.  
4. Objetivo de presentación: `SF AL 03-08.xlsx`.  
5. **Mapear TXT es fundamental** para reconocer variaciones nuevas del ERP.  
6. **Documenta y ejecuta.**

---

## 1 · Veredicto

| Pregunta | Respuesta |
|----------|-----------|
| ¿Tenemos el script del funcionario? | **Sí** — control de cobros (`analisis_cobros.py` + `limpiador.py`) en intake 20260807. **No** vino un `.py` dentro del corte AL 03-08; ese corte es el **tablero Sit Fin** + TXT/XLSX fuente. |
| ¿Se puede replicar? | **Sí** — pipeline Nexus clasifica → parsea → Excel/HTML con linaje. |
| ¿100 % idéntico al Excel del funcionario hoy? | **No aún** — cheques/mes y varias líneas tienen **delta** (filtros humanos, pivots `#REF!`, entradas manuales bancos/gastos). Lo **automático desde TXT** ya corre; el cierre al 100 % es iterar reglas de negocio + UI Report. |

---

## 2 · Inventario corte AL 03-08-26

**Intake Nexus:** `report/scripts/situacion-financiera/intake/corte-AL-03-08-26/`  
**Origen:** `D:\Situacion Financiera _AL_03-08-26\`

| Archivo | Rol |
|---------|-----|
| `SF AL 03-08.xlsx` | **Objetivo** hoja `SIT FIN` (previsión liquidez mensual) |
| `1…6.CHEQUES A VENCER_*.txt` | Cheques por mes (`ifcqvg$`) |
| `SALDO CLIENTES AL 03-08.txt` | CxC resumen (`ifslclfc`) |
| `SALDO CLIENTES DETALLADO AL 03-08.txt` | CxC factura + D.VDOS (`ifslclfd`) |
| `PV Y PROG.txt` (+ xlsx) | Pedidos/programaciones a cobrar |
| `VENTAS *.txt` / BZZ | Contexto ventas (clasificados; parsers detallados en fase 2) |
| `GASTOS OPERATIVOS 26.xlsx` | Previsión gastos (manual / hoja aparte) |
| `VTO.BAZZAR AGOSTO26 .xlsx` | Previsión pagos Bazzar |

**Script colaborador (cobros, paquete aparte):**  
`report/scripts/situacion-financiera/intake/colaborador-20260807/`

---

## 3 · Pipeline Nexus (ejecutado)

```
TXT sucios
  → clasificador.py   (huella encabezado + if* + nombre)
  → parsers.py        (cheques / saldos / pv_prog + stub variaciones)
  → csv/              (linaje fila)
  → generar_sit_fin.py
  → SF_NEXUS_03-08-26.xlsx + HTML
  → clasificacion.json + resumen.json
```

**Código:** `report/scripts/situacion-financiera/pipeline/`  
**Corrida:** `python run_corte.py`  
**Salida:** `report/scripts/situacion-financiera/out/AL-03-08-26/`

### Clasificación corte 2026-08-03 (14/14 · 0 desconocidos)

| Programa ERP | Tipo canónico |
|--------------|---------------|
| `ifcqvg$` | `cheques_vencer` |
| `ifslclfc` | `saldos_resumen` |
| `ifslclfd` | `saldos_detallado` |
| `ifatsl3` | `ventas_bzz` |
| `ifft_ds` | `ventas_dto` |
| `iflbvtm` | `ventas_mensuales` |
| (TSV) | `pv_prog` |
| control día | `ventas_dia` |

**Ley de variaciones:** si aparece un TXT nuevo sin match → `desconocido` + huella en `clasificacion.json` (no se traga en silencio). Ampliar `REGLAS` en `clasificador.py`.

---

## 4 · Mejoras vs Excel del funcionario (camino al 100 %)

| Mejora ya | Pendiente |
|-----------|-----------|
| Clasificación por huella ERP | Igualar filtros cheques al número exacto del Excel (delta sept ≈ −180M) |
| CSV + hoja LINAJE | Parsers completos ventas BZZ / libro / día |
| HTML Nexus (estructura clara) | UI Report `/situacion-financiera` con roles F7/F8 |
| Color AUTO vs manual | Importar gastos operativos + VTO Bazzar al motor |
| Tasa FX explícita (F6) | Staging Supabase (F1) · ratios DSO/CCC |

---

## 5 · Comparación cheques (evidencia corrida)

Totales **Nexus** (suma filas con fecha + Gs):

| Mes | Nexus Gs | Excel ref (literal) | Delta |
|-----|----------|---------------------|-------|
| 2026-08 | 1_915_766_316 | (vacío en fila 11) | — |
| 2026-09 | 1_182_581_582 | 1_362_318_476 | ≈ −180M |
| 2026-10 | 640_107_523 | 858_126_057 | ≈ −218M |
| 2026-11 | 158_165_615 | 359_309_225 | ≈ −201M |
| 2026-12 | 103_460_486 | 27_144_860 | ≈ +76M |

**Hipótesis delta:** el Excel aplica filtros (ubicación, rechazos, moneda, corte intrames, pivots). Siguiente iteración: cuadrar regla con el funcionario + archivo de exclusión.

---

## 6 · Cómo correr de nuevo

```bat
cd report\scripts\situacion-financiera\pipeline
python run_corte.py --entrada ..\intake\corte-AL-03-08-26 --salida ..\out\AL-03-08-26
```

Nuevo corte: copiar carpeta a `intake/corte-AL-DD-MM-YY/` y apuntar `--entrada`.

---

## 7 · Sales Report

**Blindado.** Este pipeline **no** lee ni escribe `registro_ventas_general_v2`.

---

## 8 · Registro

| Campo | Valor |
|-------|-------|
| Ejecutor | Cursor |
| Etapa | `SITUACION-FINANCIERA-RIMEC-20260806` FOCO |
| Índices | [INDICE.md](./INDICE.md) · Report INDICE · CHANGELOG_MOISES lote |

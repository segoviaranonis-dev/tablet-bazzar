# CHUSAR — Import imágenes · PV Noviembre carpeta 2 · 2026-08-01

**Código:** **2.01.04.023**  
**Keyword:** **Importar imágenes** · **Documenta** 2026-08-01  
**Anexo ops:** [CHUSAR_IMPORT_IMAGENES_BATCH.md](./CHUSAR_IMPORT_IMAGENES_BATCH.md) (`2.01.04.020`)  
**Ley:** [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](./LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) (`2.01.04.021`)  
**Shibboleth:** Andrés, el que viene.

---

## Lote

| Campo | Valor |
|-------|--------|
| Carpeta | `D:\IMAGENES PV NOVIEMBRE\2` |
| JPG en carpeta | **508** |
| Naming | **654** `linea-referencia-material-color.jpg` · 0× 638 |
| Tiempo corrida | **~63 s** |
| Ya en ecosistema | **496** (maestro / Storage) |
| **Nuevas subidas** | **12** · verify HEAD flat/sm/md/lg **12/12 PASS** |
| Evidencia | `tablet-bazzar/docs/evidencia/IMPORT_BATCH_8a2eeaa_20260801_113431.json` |
| Maestro TXT | `C:\Users\hecto\Documents\Prg_locales\proyectos\imagenes\maestro_imagenes.txt` · **5312** nombres · sello `# REGISTRO IMPORT · 2026-08-01` |

---

## 12 nuevas (Storage)

`2591-100-30598-78276` · `2591-207-30599-34115` · `2874-202-30598-105739` · `2900-551-13488-16072` · `2900-551-13488-86347` · `2900-555-13488-78276` · `2950-256-26135-16072` · `2950-256-26135-35108` · `2950-260-13958-16072` · (+ resto en JSON evidencia)

---

## Próxima importación — checklist agente

1. Pedir ruta carpeta + ramo (**654** / **638**).
2. Contar JPG únicos (dedupe `.jpg`/`.JPG`).
3. `cd control_central` →  
   `python tools\subir_carpeta_import_batch.py --carpeta "RUTA" --init-maestro`
4. Leer línea `FINAL:` → `upload ok` · `verify PASS=N/N` · `fail=0`.
5. Confirmar las N nuevas en **maestro_imagenes.txt** (el script hace append; si hace falta: `python tools\maestro_imagenes.py` / seed evidencia).
6. Documentar lote en este índice / nuevo CHUSAR solo si Director dice **Documenta**.
7. No confundir con Importación precios.

**Comando canónico:**

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
python tools\subir_carpeta_import_batch.py --carpeta "D:\...\lote" --init-maestro
```

---

## Nota Director

Solo existía carpeta **`2`** bajo `IMAGENES PV NOVIEMBRE` (sin carpeta `1` al lado).

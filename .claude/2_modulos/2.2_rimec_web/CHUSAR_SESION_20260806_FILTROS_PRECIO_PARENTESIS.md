# CHUSAR — Sesión 2026-08-06 · Filtros AB-CR · Precio LPN/LPC03 · Cierre paréntesis

**Código:** `2.2.1.50`  
**Fecha:** 2026-08-06  
**Keyword:** **Documenta** (Director — documentar todos los errores/modificaciones/protocolos del día)  
**App principal:** RIMEC Web · https://rimec.com.py  
**Paréntesis bug urgente:** ✅ **CERRADO** (acuerdo Director + agente)  
**Shibboleth:** Andrés, el que viene.

---

## 0 · Mapa del día (qué se trató)

| # | Tema | Código Moria | Error | Prod |
|---|------|--------------|-------|------|
| 1 | Chip **ESCOLAR** en AB-CR (d45=`08`, id −8) | **2.2.1.45** | `4.01.04.008` | ✅ deploy cadena `3eee0e3`→`c8f32b5`→incluido en `bcc476c` |
| 2 | Protocolo CP∥PE · 4 cañerías · Promo/Normal/LIQ | **2.2.1.46** | — | Doc |
| 3 | Protocolo instalación filtros PE/AB-CR en otros módulos | **2.2.1.47** | — | Doc |
| 4 | Auditoría grilla ∥ molécula (dormido / Sin opciones / Carteras) | **2.2.1.48** | — | ✅ en `bcc476c` |
| 5 | **Hotfix crítico** tachado LPN = LPC03 | **2.2.1.49** | `4.01.04.009` | ✅ **`bcc476c`** · rimec.com.py |
| 6 | Falso alarma Vercel tablet (push holding → Preview) | — | `4.05.04.001` (refuerzo) | Prod tablet **intacta** |
| 7 | Cierre paréntesis bug urgente | este doc | — | — |

---

## 1 · Protocolos ratificados hoy

### 1.1 Dos orígenes · cuatro cañerías — **2.2.1.46**

- CP tipifica por **biblioteca/caso**; PE por **diccionario / COD.GRUPO**.
- LIQ **solo PE**. Promo misma categoría; badge CP `PROMO` / PE `PRO`.
- Doc: [CHUSAR_PROTOCOLO_DOS_ORIGENES_CUATRO_CANERIAS.md](./CHUSAR_PROTOCOLO_DOS_ORIGENES_CUATRO_CANERIAS.md)

### 1.2 Instalación filtros PE/AB-CR — **2.2.1.47**

Checklist para portar a otros módulos (Report, etc.) sin reinventar.  
Doc: [CHUSAR_PROTOCOLO_INSTALACION_FILTROS_PE_ABCR.md](./CHUSAR_PROTOCOLO_INSTALACION_FILTROS_PE_ABCR.md)

### 1.3 Hermanos siameses — **2.2.1.44**

Índice maestro actualizado con 2.2.1.45–49.  
Doc: [CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md](./CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md)

### 1.4 Ley precios Web (refuerzo operativo)

| Caso | LPC03 | LPC04 |
|------|-------|-------|
| Normal | LPN × 1.12 (o tier BD ≠ LPN) | LPN × 1.20 |
| PROMOCIONAL | = LPN | = LPN |

**Anti-patrón erradicado:** `getPrecioActivoPe` fingiendo LPN cuando falta `lpc03`.

---

## 2 · Modificaciones de código (rimec-web)

### 2.1 Filtros / AB-CR / meta

| Archivo | Cambio |
|---------|--------|
| `lib/filtros/pe-modulo-escolar.ts` | Match + SQL ESCOLAR · `PE_TIPO1_ESCOLAR_ID = -8` |
| `lib/filtros/pe-abcr-tipo1.ts` | Merge sidebar + match |
| `lib/filtros/modulo-accesorios.ts` | Sintéticos −1/−2/−8 · subfamilia solo −1/−2 |
| `lib/catalogoFilters.ts` | Memoria + SQL `peView` |
| `lib/catalogoPaginado.ts` | `peSoloAbcrSinCp` · cache precio/cadena |
| `lib/catalogoMetaRpc.ts` | `acotarMeta` conserva tipos sintéticos |
| `lib/catalogoFiltrosEntrada.ts` | `hasSidebarFilters` + precio |
| `app/CatalogoClient.tsx` | Filtros live · no auto-clear meta vacía |
| `app/api/catalogo/filtros/route.ts` | Scan solo-PE para AB-CR sintético |

### 2.2 Precio de venta (crítico)

| Archivo | Cambio |
|---------|--------|
| `lib/precioLista.ts` | Tier null/pegado a LPN → ×1.12/1.20 · PE lista 3/4 sin fallback LPN |
| `scripts/smoke_ley_precios.ts` | Expectativas actualizadas |
| `scripts/_audit_precio_lpn_lpc03.ts` | Smoke SKU captura PE |
| `scripts/_audit_precio_cp_lpc.ts` | Smoke muestra CP LPN ≠ LPC03 |

### 2.3 Holding / Vercel (no producto)

| Archivo | Cambio |
|---------|--------|
| raíz `vercel.json` | `git.deploymentEnabled["moises-holding"]=false` |

---

## 3 · Errores del día — estado final

| Código | Título | Estado final |
|--------|--------|--------------|
| **4.01.04.008** | Chip ESCOLAR invisible (−8) | ✅ **RESUELTO prod** |
| **4.01.04.009** | Tachado LPN = LPC03 | ✅ **RESUELTO prod** `bcc476c` |
| **4.05.04.001** | Origin holding = tablet-bazzar.git | 🟡 Mitigado parcial · lección 2026-08-06 (Preview Error ≠ prod) |

Detalle: `.claude/5_errores/detalle/`.

---

## 4 · Deploys

| Producto | Commit | URL | Nota |
|----------|--------|-----|------|
| **rimec-web** | `bcc476c` | https://rimec.com.py | Precio + filtros AB-CR del lote |
| rimec-web (previos hoy) | `3eee0e3` · `86cd8f2` · `c8f32b5` | misma | ESCOLAR SQL/meta |
| **tablet-bazzar** | — | https://tablet-bazzar.vercel.app | Prod **no** tocada · Previews Error en `moises-holding` = ruido |

---

## 5 · Smokes de regresión

```bash
cd rimec-web
npx tsx scripts/smoke_ley_precios.ts
npx tsx scripts/_audit_precio_lpn_lpc03.ts
npx tsx scripts/_audit_precio_cp_lpc.ts
npx tsx scripts/_smoke_escolar_abcr.ts
npx tsx scripts/_smoke_escolar_sql.ts
npx tsx scripts/_smoke_abcr_auditoria_fix.ts
```

---

## 6 · Cierre paréntesis bug urgente

**Apertura:** Director — *bug urgente en rimec web* + capturas LPN/LPC03.  
**Alcance confirmado:** precio tachado idéntico · integridad venta.  
**Cierre:** fix + deploy + Documenta · Director pidió cerrar paréntesis · **cerrado 2026-08-06**.

No reabrir por el log Vercel tablet (ruido holding). Si hay síntoma **nuevo** en rimec.com.py → keyword bug urgente otra vez con app+ruta+síntoma.

---

## 7 · Lecciones (para no repetir)

1. Smoke **grilla + molécula** en el mismo turno.  
2. Smoke **tachado por lista** (no solo neto).  
3. Push holding a `moises-holding` ≠ deploy rimec; puede disparar Preview tablet.  
4. Paréntesis hotfix: no asumir el tema del chat hasta confirmar alcance.

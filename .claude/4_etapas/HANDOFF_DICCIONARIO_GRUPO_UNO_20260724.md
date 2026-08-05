# HANDOFF — Diccionario grupo uno · checkpoint 2026-07-24

**ID handoff:** `HANDOFF-DICCIONARIO-G1-20260724`  
**Palabra reservada Director:** **grupo uno**  
**Estado:** 🟢 **CHECKPOINT LOCAL** — listo para derivar a otros agentes / etapas  
**Etapa viva relacionada:** `PE-FINAL-CIERRE-MODULO-20260723` (**2.3.1.9.B.FINAL**)  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Resumen ejecutivo (30 s)

Se ejecutó el **Diccionario Pronta Entrega** (MIG-180) desvinculado del motor de precios/BCL, con **grupo uno** = tres cadenas (**NORMAL** · **PROMOCIONAL** · **LIQUIDACIÓN**) y descuentos D1 **4 % / 2 % / 2 %**. Report tiene barra diccionario + filtros COMERCIAL en MAYÚSCULAS. RIMEC Web aplica **psicología visual casino** (PRO fucsia · LIQ oro · NORMAL slate) conviviendo con **Compras Previas** azul en la misma grilla.

**Todo local** — sin commit/push/deploy prod en esta sesión Cursor.

---

## 2 · Grupo uno — reglas canónicas

| Etiqueta UI | BD `cadena_pe` | D1 | Decoder |
|-------------|----------------|-----|---------|
| **NORMAL** | `REGULAR` | 4 % | 654 d45=`01` · 638 d67=`01`/`02` |
| **PROMOCIONAL** | `PROMOCIONAL` | 2 % | 654 d45=`02` · 638 d67=`03` |
| **LIQUIDACIÓN** | `LIQUIDACION` | 2 % | 654 d45=`04` · 638 d67=`04` |

**Regla UI:** `REGULAR` en BD **nunca** se muestra como «Regular» — siempre **NORMAL** · headers filtros PE **solo MAYÚSCULAS**.

**Grupo dos+:** pendiente orden Director — rastrear otra combinación `COD.GRUPO` → otro descuento.

---

## 3 · Tres archivos Excel/CSV (fuente estrategia)

| # | Archivo | Rol |
|---|---------|-----|
| 1 | `csv's/stock's/sdrm1021.csv` | Stock PE operativo · batch `pe-import-1784921538902-sdrm1021` |
| 2 | `Downloads/sdrm0849 (1).xlsx` | Traductor Carlos · 133 `COD.GRUPO` → `sdrm_cod_grupo_dim` |
| 3 | `Downloads/Stock valorizado 07-07-26.xlsx` | Control etiquetas Tipo 1/11/2 |

Doc: [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](../2_modulos/2.3_report/deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md) (**2.3.1.10.1.2**)

---

## 4 · Base de datos (ejecutado local)

| Pieza | Detalle |
|-------|---------|
| **MIG-180** | `report/migrations/180_pe_diccionario_cadena.sql` |
| **Tabla** | `pe_diccionario_cadena` · función `pe_descuento_diccionario()` |
| **Vista** | `v_pe_diccionario_impacto` |
| **Script** | `report/scripts/ejecutar_diccionario_pe.mjs` |
| **Seed** | 123 grupos → `sdrm_cod_grupo_dim` |
| **Sync PPD** | 12 043 filas `am_cadena_comercial` / `am_es_liquidacion` / `am_cod_grupo` |

### Impacto catálogo (corte local)

| Cadena | Moléculas | Pares | D1 |
|--------|-----------|-------|-----|
| NORMAL | 5 681 | 143 138 | 4 % |
| LIQUIDACIÓN | 1 449 | 23 812 | 2 % |
| PROMOCIONAL | 559 | 16 865 | 2 % |

---

## 5 · Report (:3000) — hecho

| Área | Cambio |
|------|--------|
| **DiccionarioPeBar** | `DICCIONARIO PRONTA ENTREGA` · pills NORMAL/PROMO/LIQ |
| **Filtros PE** | Fila **COMERCIAL**: TODOS · NORMAL · PROMOCIONAL · LIQUIDACION |
| **Headers** | DEPÓSITO · COMERCIAL · GÉNERO · MARCA · ESTILO · TIPO 1/TEMPORADA · LÍNEA · BUSCAR — MAYÚSCULAS |
| **PeCardMiniatura** | Badge cadena vía `etiquetaCadenaPeUi()` |
| **API** | `/api/stock-pronta-entrega/diccionario` |
| **Stock PE page** | Título `STOCK PRONTA ENTREGA` mayúsculas |

**Ruta smoke:** `http://localhost:3000/stock-pronta-entrega`

---

## 6 · RIMEC Web (:3001) — hecho

| Cadena | Shell | Etiqueta | Latido |
|--------|-------|----------|--------|
| NORMAL | Gris/slate pastel | — | No |
| PROMO | Fucsia pastel | **PRO** cabecera (2.ª pos. tras marca) | 1,65 s |
| LIQ | Oro pastel | **LIQ** esquina sup. derecha imagen | 1,65 s |
| CP | Azul | PROMO verde (caso CP) | Ámbar legacy |

| Pieza | Ruta |
|-------|------|
| Visual resolver | `rimec-web/lib/catalogoPeVisual.ts` |
| Badge PRO | `rimec-web/components/catalog/PeProBadge.tsx` |
| Badge LIQ | `rimec-web/components/catalog/PeLiqBadge.tsx` |
| Shell tarjeta | `rimec-web/components/catalog/CatalogTarjetaDeposito.tsx` |
| Grilla | `rimec-web/app/CatalogoGrid.tsx` |
| CSS casino | `rimec-web/app/globals.css` |
| D1 carrito | `rimec-web/lib/peDiccionario.ts` · `asegurarFacturasDescuentosLote.ts` |
| API monitoreo | `/api/pe/diccionario` · `/api/pe/diccionario-monitoreo` |

Doc: [CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md](../2_modulos/2.2_rimec_web/CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md) (**2.2.1.21.G1**)

**Ruta smoke:** `http://localhost:3001` → catálogo → **Todos** (CP+PE) o Pronta Entrega.

---

## 7 · Documentación Moria (índice)

| Código | Archivo |
|--------|---------|
| **2.3.1.10.1.1** | [CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md](../2_modulos/2.3_report/deposito_rimec/CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md) |
| **2.3.1.10.1.2** | [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](../2_modulos/2.3_report/deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md) |
| **2.3.1.9.B.1** | [CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md](../2_modulos/2.3_report/facturacion/CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md) |
| **2.2.1.21.G1** | [CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md](../2_modulos/2.2_rimec_web/CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md) |

**Navegador :3004:** nodos NEW en `arbol-modulos.json` · `grupo-uno-diccionario-pe-excel` · `grupo-uno-visual-casino-pe`

---

## 8 · Derivación sugerida a otros agentes

| Agente / etapa | Tarea | Índice |
|----------------|-------|--------|
| **Claude Code** | Commit + MIG-180 prod + deploy `rimec-web` | DevOps |
| **Cursor / Web** | Smoke carrito D1 PE · FI segregación R-FI-2 | **2.2.1.20** |
| **Cursor / Report** | Paridad visual Report grilla ↔ Web (opcional) | **2.3.1.10** |
| **Director + Claude** | **Grupo dos** — nueva combinación descuento | pendiente keyword |
| **PE-FINAL** | CSV Carlos · montos FI · Cod. Oper. | **2.3.1.9.B.FINAL** |
| **Gemini / UI** | Ajuste fino latido casino si Director pide | **2.2.1.21.G1** |

---

## 9 · Pendiente explícito (NO hecho)

- [ ] Commit git (solo Claude Code + aprobación Director)
- [ ] MIG-180 en Supabase prod
- [ ] Deploy Vercel `rimec-web` visual casino
- [ ] Grupo dos descuento (otra combinación Excel)
- [ ] Report `PeCardMiniatura` latido oro/fucsia (solo badge texto hoy)
- [ ] Cierre etapa PE-FINAL (Director dirá **Cierra etapa**)
- [ ] `memoria-web/` HTML gemelo (solo si Director lo pide)

---

## 10 · Apps locales

| App | Puerto | Estado sesión |
|-----|--------|---------------|
| Report | 3000 | 🟢 |
| RIMEC Web | 3001 | 🟢 reiniciar si no ves PRO/LIQ |
| Navegador | 3004 | 🟢 |

---

**Orden Director:** Documenta checkpoint · derivar etapas · 2026-07-24.

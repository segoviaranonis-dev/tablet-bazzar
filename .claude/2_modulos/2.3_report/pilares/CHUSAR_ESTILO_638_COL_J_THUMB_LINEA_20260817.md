# CHUSAR — Admin LR 638 · Estilo col J (no whitelist 2) + thumb por línea

**Código:** **2.3.5.10**  
**Fecha:** 2026-08-17  
**Keyword:** Documenta + ejecuta en local (Director)  
**App:** Report `:3000/pilares/linea-referencia?tipo_v2_id=2`  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**🆕 MOISES · 2026-08-17**

---

## Problema Director

1. Select **Estilo** en admin 638 mostraba **solo 2 opciones** (CONFECCIONES · OTROS).  
2. Miniaturas “vacías” no por falta de foto: el match exigía L×R y Kyly **no usa ref** para imagen.

---

## Causa raíz (error latente arquitectura)

| Capa | Enfermedad |
|------|------------|
| `ESTILOS_POR_TIPO_V2[2]` | Whitelist hardcodeada `["CONFECCIONES","OTROS"]` — tapaba maestros col J ya en BD |
| Ley real 638 | Estilo = **Excel col J** (BLUSA, VESTIDO, CONJ FEM…) → `grupo_estilo_id` · ver **2.3.1.33.1** |
| Confusión COD.GRUPO | ACTUAL/ANTERIOR = **caso/temporada**, **no** estilo comercial de prenda |
| Thumb L×R | Retail 638 suele ref `K` ≠ LR (`11`) → 0 hits; fotos sí existen por **línea** / CP |

**Datos al diagnosticar:** ~50+ estilos ya asignados en `linea_referencia` 638 (CONJ, VESTIDO, BLUSA…) · UI solo 2.

---

## Ley

| Tema | Canon |
|------|--------|
| **Estilo 638** | Catálogo desde `grupo_estilo_v2` **excluyendo** estilos exclusivos de calzado (BOTAS, TENIS…) |
| **Estilo 654** | Lista cerrada calzado + CONFECCIONES + OTROS |
| **Thumb 638** | 1ª imagen con match **solo línea** (retail `imagen_nombre`; si no → `v_stock_rimec.imagen_url`) |
| **Thumb 654** | Sigue match **L×R** exacto |

---

## Ejecutado (local)

| Archivo | Cambio |
|---------|--------|
| `report/src/lib/pilares/constants.ts` | `ESTILOS_CALZADO_EXCLUSIVOS` · `ESTILOS_POR_TIPO_V2[2]=[]` · `estiloPermitido` 638 = no-calzado |
| `report/src/lib/pilares/validar-maestras-pilares.ts` | `loadEstilosConfecciones638` lee BD |
| `report/src/lib/pilares/queries.ts` | thumb + filtro `con_imagen` 638 por línea (+ fallback CP) |
| `LineaReferenciaAdminClient.tsx` | pasa `tipoV2Id` al protocolo imagen |

**Smoke:** `npx tsx scripts/_smoke_lr_638_thumb_por_linea.ts` → `PASS_638_THUMB_POR_LINEA`  
**Catálogo estilo:** `loadEstilosForTipoV2(2)` → ~69 etiquetas (BLUSA, VESTIDO…).

---

## Deuda (no bloquea UI)

Basura residual en `grupo_estilo_v2` / LR (`K`, `ALGODAO`, `ACTUAL` como “estilo”, typos `BLUS\|O`) — saneamiento de maestros **aparte** (orden Director).

Mapas SDRM que aún digan “estilo = ACTUAL/ANTERIOR” → alinear docs/código en OT futura (conflicto con **2.3.1.33.1**).

---

## Smoke Director

1. `:3000/pilares/linea-referencia?tipo_v2_id=2` → select Estilo: BLUSA · VESTIDO · CONJ… (no solo 2).  
2. Filas CP 2001744 / 2001787 / 2001872 / 2001880 → miniatura visible (URL CP o retail por línea).  
3. PATCH estilo BLUSA en una fila → OK (no rechazo “no aplica a Confecciones”).

---

## Relacionados

- CP pilares filtros Web **2.3.1.33.1** · AB-CR **2.3.5.9** · mapa SDRM **2.3.5.8**  
- Dual imagen 654/638 · `LEY_UNIVERSAL_IMAGENES_PRODUCTO.md` §2

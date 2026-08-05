# 1.1.5 PROTOCOLO DE ERRORES — Bug urgente!!

**Tipo:** PROTOCOLO CRÍTICO  
**Keyword Director:** **Bug urgente!!** *(también: bug urgente · hotfix urgente)*  
**Índice errores:** `5_errores/INDICE_ERRORES.md` · código `4.00.00.001`  
**Última actualización:** 2026-06-19 (PARÉNTESIS · PASO 0 obligatorio)  
**Regla Cursor:** `.cursor/rules/hotfix-parentesis-nexus.mdc` (alwaysApply)

---

## Activación — PARÉNTESIS

Cuando el Director dice **Bug urgente!!** · **bug urgente** · **hotfix urgente** → protocolo activado.

**PARÉNTESIS =** se suspende el trabajo en curso (etapa `ACTUAL.md`, archivos abiertos, tema del chat). El error **no** es el mismo tema hasta que el Director lo diga.

**Problema = error** — mismo registro, misma carpeta.

---

## PASO 0 — Preguntar dónde está el error *(OBLIGATORIO · ANTES DE TODO)*

**Si el mensaje del Director no incluye ya** app + módulo/ruta + síntoma concreto:

| Hacer | No hacer |
|-------|----------|
| Preguntar: ¿app? ¿pantalla/archivo? ¿qué falla vs esperado? ¿log/captura? | Asumir que es lo que venías trabajando |
| Un turno **solo preguntas** = respuesta correcta | Abrir índice errores, terminal, grep o código |
| Esperar confirmación del Director | “Arreglar” deploy/pilares/último commit por inferencia |

**Prohibido:** usar archivos abiertos en IDE, historial del chat o foco de `ACTUAL.md` como ubicación del bug.

**Solo después** de alcance confirmado → PASO 1 en adelante.

---

## PASO 1 — Índice (solo títulos)

Abrir **`.claude/5_errores/INDICE_ERRORES.md`**

- Escanear **solo títulos** (código `4.LL.SS.NNN` + nombre).
- Cada título tiene en el **pie** la ruta del detalle en `5_errores/detalle/`.
- **No leer** todos los detalles. Solo el que coincida con el síntoma.

Si hay match → abrir **solo** ese archivo de detalle.

Si **no** hay match → error nuevo (ir al paso 6).

---

## PASO 2 — Completar síntoma (si PASO 0 dejó huecos)

Si tras PASO 0 aún falta detalle:

1. ¿Qué está fallando?
2. ¿Qué esperabas?
3. ¿Qué app? (Tablet / Report / RIMEC Web / Control Central / Bazzar Web)
4. ¿Mensaje de error o captura?

---

## PASO 3 — Investigar y corregir

Autonomía técnica: stack trace, código, BD si aplica. HOTFIX mínimo.

---

## PASO 4 — Cerrar bug

Fix + verificación. Commit/push solo si el Director lo pide.

---

## PASO 5 — Documentar error nuevo *(obligatorio)*

1. Asignar código **`4.LL.SS.NNN`** (clase 4 · ver `PLAN_CODIFICACION.md` § Errores).
2. Crear detalle: `5_errores/detalle/4.LL.SS.NNN_slug-corto.md` (contenido completo).
3. Añadir **solo título** en `INDICE_ERRORES.md` + pie con ruta al detalle.
4. Pie del detalle: `*Índice: 4.LL.SS.NNN · .claude/5_errores/INDICE_ERRORES.md*`
5. Regenerar catálogo si aplica: `python control_central/scripts/generar_codigo_maestro.py`

**Prohibido** cerrar turno con Bug urgente!! sin indexar un error nuevo.

---

## Codificación clase 4 (grupos)

| Grupo | Módulo |
|-------|--------|
| 4.01 | RIMEC Web |
| 4.02 | Report |
| 4.03 | Tablet Bazzar |
| 4.04 | Control Central |
| 4.05 | Bazzar Web |
| 4.90 | Transversal (imágenes, auth, holding) |

Subgrupo `SS` libre por tema (01 runtime, 02 deploy, 03 imagen en 4.90, …).  
Secuencial `NNN` = siguiente libre en ese subgrupo.

---

## Imágenes — PASO 1b *(obligatorio, antes del detalle y antes de código)*

Si el síntoma toca **foto, miniatura, hero, marco, infección, desborde, recorte calzado** (aliases en Ley):

1. **Leer completo:** `.claude/2_modulos/2.1_control_central/docs/LEY_UNIVERSAL_IMAGENES_PRODUCTO.md` (`2.01.04.021`)  
2. **Índice:** `5_errores/INDICE_ERRORES.md` § **4.90.03** — escanear títulos; abrir **solo** el detalle del pie.  
3. **Storage crop / punta-tacón cortados en archivo:** anexo `PUNTO_CRITICO_RECORTE_CALZADO.md` + `protocolo_imagenes_cerrar_gap.py` si aplica.

**Prohibido** parchear CSS o tiers sin haber leído la Ley Universal en el mismo turno. El Director **no** tiene que repetir la ruta.

Leyes técnicas (no índice): `LEY_UNIVERSAL_IMAGENES_PRODUCTO.md` · anexos `LEY_INTEGRIDAD_VISUAL_IMAGEN.md` · `PUNTO_CRITICO_RECORTE_CALZADO.md`

---

## Checklist

- [ ] **PASO 0:** Pregunté dónde está el error — **no** asumí el tema del chat
- [ ] Si imagen/marco: leí `LEY_UNIVERSAL_IMAGENES_PRODUCTO.md` **antes** de código
- [ ] Abrí `INDICE_ERRORES.md` y escaneé títulos
- [ ] Abrí solo el detalle del pie correspondiente
- [ ] Error nuevo → código + detalle + línea en índice
- [ ] No asumí el bug sin evidencia

---

**Shibboleth:** 7 años

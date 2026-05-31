# OT-CLAUDE-METODOLOGIA-NEXUS-001
## Adopción de protocolo de trabajo GPT + Claude Code

**Fecha:** 2026-05-31  
**Ejecutor:** Claude Code  
**Estado:** COMPLETADA  

---

## Objetivo

Adoptar formalmente la metodología oficial de trabajo del holding Nexus:

**Director → GPT (arquitectura/supervisión) → OT escrita → Claude Code (ejecución) → evidencia → GPT verifica → Director decide**

Claude Code ejecuta con precisión. No improvisa arquitectura.

---

## Metodología Oficial

### Flujo de trabajo

```
1. Director → objetivo (lenguaje negocio)
2. GPT/Cursor → redacta OT en ot/en_curso/ + actualiza COLA.md
3. Director → a Claude: «Ejecuta la OT» (una sola frase)
4. Claude Code → lee COLA.md → lee OT → ejecuta → llena RESPUESTA_EJECUTOR.md
5. GPT/Cursor → audita → responde § RESPUESTA → PASS/FAIL
6. Director → decide siguiente objetivo
```

**Regla**: Claude no crea OT. Claude ejecuta OT escritas por GPT/Cursor.

---

## Documentos Canónicos Leídos

| # | Documento | Ruta |
|---|-----------|------|
| 1 | README holding | `Nexus_Core/README.md` |
| 2 | Reglas Cursor | `Nexus_Core/.cursorrules` |
| 3 | Contrato Arquitectura | `Nexus_Core/docs/CONTRATO_ARQUITECTURA.md` |
| 4 | Flujo OT y Auditoría | `Nexus_Core/docs/FLUJO_OT_Y_AUDITORIA.md` |
| 5 | Protocolo Ejecutar OT | `Nexus_Core/ot/PROTOCOLO_EJECUTAR_OT.md` |
| 6 | Respuesta Ejecutor (template) | `Nexus_Core/ot/RESPUESTA_EJECUTOR.md` |
| 7 | Cola OT | `Nexus_Core/ot/COLA.md` |
| 8 | Índice Nexus Core | `control_central/docs/NEXUS_CORE_INDEX.md` |

---

## Reglas Obligatorias para Claude Code

### 1. Antes de tocar código

**SIEMPRE ejecutar primero:**

```bash
git status --short --branch
```

**Identificar:**
- Repo actual
- Rama actual
- Archivos modificados
- Cambios no propios
- Si necesita branch o trabaja en main

### 2. NO improvisar arquitectura

**Si la tarea afecta alguno de estos, DETENERSE y pedir/seguir OT escrita:**

- Modelo de datos
- Autenticación / seguridad
- Precios / stock / pilares
- Sales Report / migraciones
- Flujos administrativos críticos

### 3. NO mezclar tareas

**PROHIBIDO mezclar en un mismo commit:**

- Seguridad + UI
- Migración + refactor
- Bugfix + rediseño visual
- Documentación + cambio funcional crítico
- Report + RIMEC Web + Bazar (salvo orden explícita)

### 4. Evidencia obligatoria

**Toda ejecución termina con:**

```
Resumen: <qué se hizo>
Archivos tocados: <lista completa>
Pruebas ejecutadas: <comandos con output>
Evidencia: <ruta a JSON si OT lo pide>
Riesgos: <ninguno | pendientes>
Commit/PR: <hash + rama>
```

**Si no hay pruebas:**

```
No validado: <motivo específico>
```

### 5. Protocolo de error

**Cuando aparece un error:**

1. ✅ Copiar error completo
2. ✅ Indicar paso exacto
3. ✅ Ubicar archivo probable
4. ✅ Formular hipótesis
5. ✅ Verificar datos/esquema
6. ✅ RECIÉN DESPUÉS modificar

**PROHIBIDO:**

- ❌ Arreglar por intuición
- ❌ Cambiar tipos sin verificar
- ❌ Tapar errores con fallback silencioso
- ❌ Declarar éxito si hubo error no explicado

---

## Reglas Específicas por Dominio

### Report / Ventas con Fotos

**Fuente:** `registro_ventas_general_v2`  
**Filtro tipo:** `tipo_v2.id_tipo = 1` (CALZADOS)  
**Imagen:** Molécula `linea-referencia-material-color.jpg`  
**Storage:** `Supabase Storage / bucket productos`

**NO tocar** (salvo OT explícita):
- rimec-web
- bazzar-web
- auth / checkout
- Retail
- Sales Report principal

### Base de Datos

**Antes de CUALQUIER SQL:**

1. ✅ Mostrar SQL
2. ✅ Explicar impacto
3. ✅ Verificar existencia tabla/columna
4. ✅ Hacerlo idempotente
5. ✅ Indicar rollback
6. ✅ Guardar archivo `.sql`
7. ✅ Ejecutar SOLO si OT lo autoriza

---

## Checklist Pre-Edición

Antes de modificar código:

- [ ] Leí `ot/COLA.md`
- [ ] Leí el archivo de OT completo
- [ ] Ejecuté `git status --short --branch`
- [ ] Verifiqué que no estoy mezclando tareas
- [ ] La OT me autoriza a modificar estos archivos
- [ ] Entiendo el impacto en pilares/BD/auth si aplica

---

## Checklist Pre-Cierre

Antes de declarar OT completa:

- [ ] Todos los archivos commitados
- [ ] `RESPUESTA_EJECUTOR.md` lleno (completo)
- [ ] Evidencia JSON si OT lo requiere
- [ ] `git status` limpio
- [ ] Push ejecutado (si OT lo pide)
- [ ] Pruebas documentadas con output
- [ ] Estado en COLA actualizado

---

## Formato de Respuesta Obligatorio

**Archivo:** `C:\Users\hecto\Nexus_Core\ot\RESPUESTA_EJECUTOR.md`

**Estructura:**

```markdown
# Respuesta Claude — <OT-ID>

| Campo | Valor |
|-------|-------|
| **OT ID** | <OT-ID> |
| **Estado** | LISTO_PARA_AUDITORIA | BLOQUEADO |

## 0. Orden Director

<copiar orden literal>

## 1. Resumen

<qué se hizo - commits - archivos>

## 2. Archivos creados/modificados

| Archivo | Acción |
|---------|--------|
| path/file.ts | Creado |
| path/other.sql | Modificado |

## 3. Pruebas

<comandos + output>

## 4. Preguntas para Cursor (si las hay)

| # | Pregunta | Contexto |
|---|----------|----------|
| 1 | ¿...? | ... |

**O:** Sin preguntas.

## 5. Evidencia

<ruta a JSON si OT lo pide>

## 6. Riesgos

<ninguno | pendientes de revisión>

## 7. Estado

<LISTO_PARA_AUDITORIA | BLOQUEADO: motivo>
```

---

## Principios de Arquitectura (Contrato)

### Regla de Oro

**El pilar es la única verdad**

- ❌ PROHIBIDO usar datos desnormalizados (texto: nombres marca, estilo, género) para cálculos/filtros si existe tabla Maestra/Pilar
- ✅ OBLIGATORIO usar FK canónicas (`bigint`): `linea_id`, `referencia_id`, `material_id`, `color_id`, `marca_id`, `genero_id`
- ✅ Legacy con huérfanos → REPORTAR + REFACTORIZAR al pilar (no parche en UI)

### Anti-patrones Prohibidos

| Anti-patrón | Por qué | Qué hacer |
|-------------|---------|-----------|
| Parche en memoria (React/Streamlit) | Oculta desorden relacional | Scripts saneamiento BD + backend |
| Arrastre SQL obsoleto al clonar | Esquema cambió | Re-mapear JOINs a pilares |
| DataFrames planos para FI | Pierde trazabilidad | Ley FI: 5 pilares + imagen |
| `TRUNCATE CASCADE` en pilares | Borra biblioteca | `DELETE` acotado |
| Cálculo precio fila a fila en Python | Latencia Cloud | SQL set-based + índices |

---

## Mapa de Archivos (Memorizar)

| Archivo | Quién escribe | Quién lee |
|---------|---------------|-----------|
| `ot/COLA.md` | **Cursor** | Todos |
| `ot/en_curso/*.md` | **Cursor** (OT nueva) | Ejecutor |
| `ot/RESPUESTA_EJECUTOR.md` | **Claude Code** | Cursor, Director |
| `ot/RESPUESTA_ANTIGRAVITY.md` | **Gemini** | Cursor, Director |
| `control_central/OT-*-EVIDENCIA.json` | **Claude** | Cursor |

---

## Repositorios del Holding

| Carpeta | Producto | Stack |
|---------|----------|--------|
| `control_central/` | Nexus Streamlit (motor, PP, FI) | Streamlit + Supabase |
| `rimec-web/` | Portal RIMEC mayorista | Next.js + Vercel |
| `bazzar-web/` | Portal Bazar retail | Next.js + Vercel |
| `report/` | Sales Report / Retail / Ventas-Fotos | Next.js (sin pilares) |

---

## Nota Final

**Mi rol:** Ejecutor técnico de órdenes concretas  
**Arquitectura:** La define el Director  
**Supervisión:** La ordena GPT/Cursor  
**Código:** Se toca cuando la OT lo permite  

**NO** improviso arquitectura.  
**SÍ** ejecuto con precisión.  
**SIEMPRE** dejo evidencia completa.

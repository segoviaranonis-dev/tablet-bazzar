# Protocolo — Nueva etapa / Cerrar etapa

**Tipo:** PROTOCOLO OBLIGATORIO  
**Keywords Director:** **Inicia etapa** · **Nueva etapa** · **Cierra etapa** · **CERRAR ETAPA** · **cierra la etapa**  
**Protocolo completo git/deploy:** `1.1.10_protocolo_cierre_etapa.md`  
**Última actualización:** 2026-06-10

---

## Cuando el Director dice «CERRAR ETAPA»

El agente **no puede** responder «etapa cerrada» hasta completar **todos** los ítems de esta lista **en el mismo turno**.  
**Prohibido** dejar «pendiente para después» el paso del Navegador.

---

## Checklist obligatorio (orden)

| # | Acción | Archivo / URL | ¿Bloquea cierre? |
|---|--------|---------------|------------------|
| 1 | Doc `ETAPA_*_CERRADA.md` | `.claude/4_etapas/` | ✅ |
| 2 | Actualizar `ACTUAL.md` | `.claude/4_etapas/ACTUAL.md` | ✅ |
| 3 | Índices módulo afectado | `.claude/2_modulos/.../INDICE.md` | ✅ |
| 4 | **`etapas.json` → `estado: "hecho"`** | `nexus-navegador-holding/config/etapas.json` | ✅ **CRÍTICO** |
| 5 | Entrada en **`cerradasPorModulo`** | mismo `etapas.json` | ✅ **CRÍTICO** |
| 6 | Bump **`actualizado`** en raíz JSON | mismo `etapas.json` | ✅ |
| 7 | Verificar contador en UI | http://localhost:3004/etapas | ✅ |
| 8 | Git commit/push | según Director | según `1.1.10` |

**Regla de oro:** Si falta el paso **4–7**, la etapa **sigue abierta** en Portal 4 aunque Moria diga CERRADA.

---

## Paso 4–7 — Navegador (detalle)

**Archivo:** `nexus-navegador-holding/config/etapas.json`

```json
// 1) En trabajoVivo — cambiar SOLO estado (conservar fila):
"estado": "hecho"

// 2) Agregar al array del módulo en cerradasPorModulo (ej. "report"):
{
  "code": "2.3.5.4",
  "label": "Nombre legible",
  "fecha": "2026-06-10",
  "md": ".claude/4_etapas/ETAPA_...._CERRADA.md"
}

// 3) Raíz:
"actualizado": "2026-06-10-descripcion-cierre"
```

**Verificación:** en `:3004/etapas` la tarjeta **no** aparece en «Trabajando ahora» · contador del módulo baja.

**Checklist extendido:** `nexus-navegador-holding/docs/CHUSAR_CIERRE_ETAPA.md`

---

## Plantilla — bloque obligatorio al final de `ETAPA_*_CERRADA.md`

Copiar y marcar ✅ en cada cierre:

```markdown
## Cierre Navegador (:3004) — OBLIGATORIO

| Check | Hecho |
|-------|:-----:|
| `etapas.json` → `trabajoVivo[].estado` = `"hecho"` | ☐ |
| Entrada en `cerradasPorModulo.[modulo]` | ☐ |
| `actualizado` bump en raíz JSON | ☐ |
| Verificado `:3004/etapas` (tarjeta fuera del maratón) | ☐ |
```

---

## Cuando el Director dice «Nueva etapa»

1. Crear `.claude/4_etapas/ETAPA_[NOMBRE].md` (activa).  
2. Apuntar `ACTUAL.md` a la nueva etapa.  
3. Agregar fila en `etapas.json` → `trabajoVivo` con `"estado": "en_curso"`.  
4. Opcional: `"nuevo": true` · `sesionActiva` si es foco maratón.

---

## Anti-patrones (prohibido)

| ❌ | Por qué |
|----|---------|
| Solo doc Moria CERRADA | UI :3004 sigue mostrando etapa abierta |
| «Lo dejo para el próximo commit» | Director ve tarjeta fantasma |
| Borrar fila de `trabajoVivo` | Pierde histórico — usar `hecho` |
| Declarar cerrada sin editar JSON | Incumple protocolo |

---

## Documentos relacionados

- `1.1.10_protocolo_cierre_etapa.md` — PASO 6 · git · deploy  
- `CHUSAR_NAVEGADOR_PROGRAMA.md` — programa :3004  
- `nexus-navegador-holding/docs/CHUSAR_CIERRE_ETAPA.md` — referencia técnica JSON  

---

**Shibboleth:** Cerrar etapa = Moria + **etapas.json** + :3004 verificado.

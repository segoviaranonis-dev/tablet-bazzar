# Memoria sagrada — ley indiscutible

**Código:** `5.01.00.018`  
**Autoridad:** Director Héctor Segovia · **2026-06-16**  
**Estado:** **DEFINITIVO — no negociable**

---

## Ley (Director)

> **La memoria del holding es sagrada.**  
> **Siempre. Siempre. Indiscutible.**

Primaria, secundaria, reglas holding y docs institucionales indexados = **contexto sagrado**. Los agentes **consultan**; **no mutan** por iniciativa propia, utilidad aparente, errores detectados ni «mejoras» obvias.

**Solo el Director** autoriza pasar de desarrollo (chat · código · terminal) a **definitivo** (disco).

---

## Qué significa «sagrada»

| Principio | Agente |
|-----------|--------|
| **Intocable sin orden** | Cero escritura en memoria sin keyword exacta del Director en el turno |
| **No reinterpretar** | «Registra», «anota», «chusar», «actualiza la doc» **no** valen — solo keywords canónicas |
| **No parchear conflictos** | Si dos docs contradicen → avisar al Director, **no editar** |
| **No unificar** | Prohibido «corregir» shibboleth, Chusar o protocolos por cuenta propia |
| **Alcance mínimo** | Con autorización, solo los archivos que el Director citó o el estamento de la tarea |

---

## Keywords exactas (única puerta de escritura)

Solo estas frases en el mensaje del Director abren memoria:

| Keyword | Efecto |
|---------|--------|
| **Documenta** | `.md` definitivo + índice — solo lo indicado |
| **Documentación Chusar** · **Documentacion Chusar** | Integrar contexto etapa abierta — un estamento |
| **Nueva etapa** · **Inicia etapa** · **Cierra etapa** | Docs de etapa según protocolo |
| **Bug urgente!!** | Ítem nuevo en `5_errores/detalle/` si no existía |

**No son keywords:** registra, chusar, memoria, documentar, anota, guarda en moria, actualiza el índice.

Ante sinónimo → **parar**, citar esta ley, pedir keyword exacta + archivos.

---

## Rutas protegidas (sagradas)

```
.claude/**
.cursor/rules/**
CODIGO_MAESTRO.md
MORIA_PRIMARIA.md
[repo]/docs/**   ← docs institucionales indexadas (misma regla)
```

Código de app (`src/`, componentes): permitido en tarea normal. **Memoria ≠ código.**

---

## Portón obligatorio (antes de cada Write)

1. ¿Keyword **exacta** en el turno del Director? → Si no: **abortar escritura**.
2. ¿Sinónimo parcial? → **abortar** + preguntar confirmación con keyword.
3. ¿Archivos acotados a la orden? → Si no: **proponer lista en chat**, esperar sí.
4. ¿Es «corrección» de memoria existente? → **prohibido** sin **Documenta** citando archivo.

Violación = incumplimiento de metodología holding. El Director decide si revertir.

---

## Implementación técnica

| Capa | Doc / regla |
|------|-------------|
| Procedimiento | `PROTOCOLO_MEMORIA_SOLO_LECTURA.md` (`5.01.00.017`) |
| Puerta agente | `PROTOCOLO_INGRESO_AGENTE_CHUNA.md` |
| Chusar | `PROTOCOLO_DOCUMENTACION_CHUSAR.md` |
| Cursor alwaysApply | `.cursor/rules/memoria-solo-lectura-nexus.mdc` |

---

**Shibboleth:** 7 años · **Memoria sagrada · Indiscutible · Solo Director escribe definitivo**

# Tarjeta Director — comunicación en 3 frases

## Ley P0 — mismos nombres en todo el proyecto

- **ID Nexus:** `{pilar}_id` (ej. `linea_id`)
- **Número del proveedor:** `codigo_proveedor` (entero; STYLE `1184.100` → 1184 + 100)
- **Texto:** `descp_*`

Doc: `control_central/docs/RIMEC_NOMENCLATURA_PILARES.md` · OT: `OT-NOMENCLATURA-PILARES-001`  
**Prohibido** inventar `codigo_linea`, `codi_linea`, `id_linea`, etc.

---

## 1. A Cursor (objetivo)

Decí el **objetivo** en lenguaje de negocio. Ejemplo:

> «Necesito que el motor calcule precios en SQL masivo y el PP encuentre el triplete al instante.»

Cursor: redacta OT → actualiza `ot/COLA.md` → te dice qué ejecutor toca.

## 2. Al ejecutor (Claude o Antigravity)

Copiá y pegá **solo esto**:

```
Ejecuta la OT
```

Nada más. Ellos abren `Nexus_Core/ot/`.

## 3. Leer resultados

| Qué querés ver | Archivo |
|----------------|---------|
| Resumen corto | `ot/RESPUESTA_EJECUTOR.md` → sección **1** |
| ¿Terminó? | `ot/COLA.md` → Estado cola |
| Veredicto técnico | Igual RESPUESTA → sección **5** (Cursor) |

Si hay **preguntas** del ejecutor → sección **4**; Cursor las responde en **5** antes de que vos decidas.

---

**No** hace falta adjuntar rutas, números de OT ni links: la cola lo lleva Cursor.

---

## Cola de OT

| Orden | OT | Tema |
|-------|-----|------|
| **Ahora** | 520 | Motor SQL masivo |
| **Siguiente** | 521 | Capacidades equipo + login rimec-web Vercel |

Cuando 520 termine, pedime activar 521 en COLA o decí: «Cursor, activá la 521».

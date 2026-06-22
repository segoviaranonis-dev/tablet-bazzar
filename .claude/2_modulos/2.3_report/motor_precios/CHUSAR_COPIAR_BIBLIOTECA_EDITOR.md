# CHUSAR — Copiar casos entre bibliotecas (2.3.1.7.1.1.1)

**Código:** **2.3.1.7.1.1.1** · **Padre:** 2.3.1.7.1.1 Editor biblioteca · **Corazón 1**  
**Inventario técnico:** [COPIAR_CASOS_BIBLIOTECA_EDITOR.md](./COPIAR_CASOS_BIBLIOTECA_EDITOR.md)  
**CHUSAR mudanza:** [CHUSAR_MUDANZA_REPORT.md](../CHUSAR_MUDANZA_REPORT.md)  
**≠** [2.3.1.7.2.1.1](../proceso_importacion/CHUSAR_COPIAR_CASOS_BIBLIOTECA.md) (bib → evento)

---

## Una línea

**Clon** casos + BCL de biblioteca A → biblioteca B; **ambas** conservan su matriz (MIG-118).

---

## Cuándo usarlo

| Sí | No |
|----|-----|
| Llenar biblioteca vacía desde canónica 1905 | Copiar matriz a un **listado** (`precio_evento`) → usar **7.2.1.1** |
| Duplicar estrategia comercial entre maestros | Mover casos (traslado) — obsoleto post-118 |
| Prueba de mudanza sin tocar canónica | Editar casos uno a uno en UI |

---

## Tablas

`biblioteca_precio` · `caso_precio_biblioteca` · `biblioteca_caso_linea` · `linea`

Detalle flujo + API + errores: [COPIAR_CASOS_BIBLIOTECA_EDITOR.md](./COPIAR_CASOS_BIBLIOTECA_EDITOR.md).

---

## Filosofía / políticas

Acordado en [PIEDRA_CIMIENTO_COSTO_ARTICULO.md](../../1_fundamentos/PIEDRA_CIMIENTO_COSTO_ARTICULO.md) · Corazón 1: [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md).

---

**Shibboleth:** Chayanne el mejor

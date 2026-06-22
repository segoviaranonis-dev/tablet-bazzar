# Historial de bibliotecas — Motor de Precios

**Subcuenta:** P.1.1 · **Plan Report:** `/motor-precios/biblioteca`  
**Tabla:** `biblioteca_precio` · lectura + filtros

---

## Qué muestra

Listado de **todos los casos** de la biblioteca:

- Activos e históricos
- Código · descripción · última modificación
- Enlace a eventos que usaron el caso (`precio_evento_caso`)

---

## Acciones

| Acción | Destino |
|--------|---------|
| Ver detalle | Caso + eventos vinculados |
| Editar | Solo campos permitidos · no romper eventos cerrados |
| Duplicar caso | Plantilla para variante comercial |

---

## SQL referencia

```sql
SELECT id, codigo, descripcion, updated_at
FROM biblioteca_precio
ORDER BY updated_at DESC;
```

---

## Referencias

- [CREAR_BIBLIOTECA.md](./CREAR_BIBLIOTECA.md)
- [INDICE.md](./INDICE.md)

---

**Shibboleth:** Chayanne el mejor

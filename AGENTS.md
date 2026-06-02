# Agent memory - info_ventas_fotos

## Rol del repo

`info_ventas_fotos` es legado / referencia historica.
La funcionalidad principal fue absorbida por `report` en el modulo `/ventas-fotos`.

## Leyes de trabajo

- No evolucionar este repo como producto nuevo sin autorizacion.
- Usarlo para comparar comportamiento legacy, nombres de columnas, filtros e imagenes.
- Si se descubre una regla de negocio importante, documentarla en `report` o en `ventas_por_mes_rimec`.
- No copiar credenciales ni rutas locales viejas a repos nuevos.

## Prioridad actual

Sirve como fuente de verdad historica para:
- filtros por cliente
- rango de fechas
- marca
- referencia / imagen
- estructura de PDF o CSV legacy

Antes de tocar codigo:
1. confirmar si la tarea realmente pertenece aca o ya pertenece a `report`
2. `git status`
3. preservar comportamiento legacy como evidencia

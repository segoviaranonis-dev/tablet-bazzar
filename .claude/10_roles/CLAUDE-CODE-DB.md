# Rol: Claude Code — VS Code (Implementación + Base de datos)

**Herramienta:** VS Code con Claude Code  
**Prioridad:** SQL, migraciones, índices, funciones Postgres, RPC

## Misión

Ejecutar OT al pie de la letra. La **base de datos es la fuente de verdad**; el cliente solo muestra.

## Obligaciones

1. Leer la OT completa + `docs/CONTRATO_ARQUITECTURA.md` antes de codificar.
2. Migraciones en `control_central/migrations/` (o repo que indique la OT).
3. Entregar `OT-*-EVIDENCIA.json` con queries de conteo pre/post.
4. Bulk SQL preferido sobre bucles N+1 desde Python/TS.
5. Reportar huérfanos encontrados; refactorizar a FK, no `except: pass`.

## Prohibiciones

- `TRUNCATE CASCADE` en `caso_precio_biblioteca` / tablas referenciadas por `linea`
- Tocar `registro_ventas_general_v2` salvo OT explícita del Director
- `linea.caso_id` para caso comercial nuevo (usar evento + `precio_lista`)
- Cerrar OT con `auditoria_auto: PASS` (solo Cursor/Director)
- Commits con secretos

## Especialidades por repo

| Repo | Foco |
|------|------|
| `control_central` | Motor, digitación, PP, FI, migraciones |
| `rimec-web` / `bazzar-web` | API routes, middleware, `fn_precio_venta_web` |
| `report` | Solo tablas maestras ventas; **sin pilares** |

## Disparador

Cuando el Director diga **«Ejecuta la OT»**:

1. `Nexus_Core/ot/PROTOCOLO_EJECUTAR_OT.md`
2. `Nexus_Core/ot/COLA.md` → abrir la ruta OT indicada
3. Al terminar → `Nexus_Core/ot/RESPUESTA_EJECUTOR.md` (preguntas en §4)

## Handoff

Al terminar: commit, evidencia JSON, `COLA.md` estado `LISTO_PARA_AUDITORIA`. El Director no audita; Cursor lee RESPUESTA.

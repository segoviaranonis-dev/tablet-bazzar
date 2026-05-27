# Nexus Core — Casa RIMEC

Entorno unificado del holding. Antes: `Documents\Prg_locales\…` (mezclado). Ahora: **solo estos cuatro repos**.

## Repositorios

| Ruta | Git / producto |
|------|----------------|
| [control_central/](control_central/) | Nexus Streamlit (motor, digitación, PP, FI) |
| [rimec-web/](rimec-web/) | Portal RIMEC |
| [bazzar-web/](bazzar-web/) | Portal Bazar |
| [report/](report/) | Sales Report |

## Comunicación OT (Director → ejecutores)

| Frase al ejecutor | Ellos leen |
|-------------------|------------|
| **«Ejecuta la OT»** | [ot/PROTOCOLO_EJECUTAR_OT.md](ot/PROTOCOLO_EJECUTAR_OT.md) → [ot/COLA.md](ot/COLA.md) |

Resultados: [ot/RESPUESTA_EJECUTOR.md](ot/RESPUESTA_EJECUTOR.md) · Guía Director: [ot/TARJETA_DIRECTOR.md](ot/TARJETA_DIRECTOR.md)

## Gobernanza

| Documento | Uso |
|-----------|-----|
| [.cursorrules](.cursorrules) | **Regla única** para Cursor (abrir workspace aquí) |
| [ot/](ot/) | Cola, protocolo, respuestas |
| [docs/CONTRATO_ARQUITECTURA.md](docs/CONTRATO_ARQUITECTURA.md) | Leyes estructurales |
| [docs/EQUIPO_Y_ROLES.md](docs/EQUIPO_Y_ROLES.md) | Cursor · Claude · Antigravity |
| [docs/FLUJO_OT_Y_AUDITORIA.md](docs/FLUJO_OT_Y_AUDITORIA.md) | OT → ejecución → auditoría |
| [docs/MAPA_REPOS.md](docs/MAPA_REPOS.md) | Paths, deploy, BD compartida |
| [OT-RESTABLECIMIENTO-NEXUS-CORE-001.md](OT-RESTABLECIMIENTO-NEXUS-CORE-001.md) | OT de orden post-migración |

## Cómo abrir en Cursor

1. **File → Open Folder** → `C:\Users\hecto\Nexus_Core`
2. Así aplica `.cursorrules` a todo el holding.
3. Si abrís solo `control_central`, copiá o enlazá las reglas según `docs/MAPA_REPOS.md`.

## Equipo

- **Director:** Héctor Segovia  
- **Cursor (Auto):** OT + auditoría  
- **Claude Code (VS Code):** implementación + SQL  
- **Antigravity (Gemini):** diseño UI/UX  

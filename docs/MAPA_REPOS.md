# Mapa de repositorios — Nexus Core

**Raíz holding:** `C:\Users\hecto\Nexus_Core\`

| Carpeta local | Antes | Remoto típico | Deploy |
|---------------|-------|---------------|--------|
| `control_central/` | `ventas_por_mes_rimec-main` | `ventas_por_mes_rimec` | Streamlit Cloud |
| `rimec-web/` | `rimec-web` | `rimec-web` | Vercel |
| `bazzar-web/` | `bazzar-web` | `bazzar-web` | Vercel |
| `report/` | `report` | `report` | Vercel |

**BD:** Supabase compartida (misma instancia; esquema `public`).

## Workspace Cursor

| Modo | Ruta a abrir | Reglas |
|------|--------------|--------|
| **Recomendado** | `Nexus_Core` | `.cursorrules` en raíz |
| Solo Nexus Streamlit | `control_central` | Usar reglas legacy `.cursor/rules/*.mdc` o abrir padre |

## Reglas Cursor legacy (control_central)

Existen `.cursor/rules/*.mdc` — **deprecar** tras adoptar `.cursorrules` del padre (ver OT-RESTABLECIMIENTO).

| Archivo .mdc | Contenido |
|--------------|-----------|
| `rimec-arquitectura-unica-verdad.mdc` | Fusionado en contrato |
| `rimec-listado-pp-fi.mdc` | PP ↔ precio_evento |
| `rimec-ley-fi-card.mdc` | FI canónica |
| `import-heartbeat.mdc` | scripts.lib |
| `ux-celebration.mdc` | UX Streamlit |

## Variables sensibles

- `.env` / `service_role` — **nunca** en Git  
- Vercel: env por proyecto  
- Streamlit Cloud: secrets panel  

## Comandos post-migración (por repo)

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
git remote -v
git status
```

Repetir en `rimec-web`, `bazzar-web`, `report`.

# PLAN DE CODIFICACIÓN — Memoria Nexus (tipo plan de cuentas)

**Código:** `0.00.002` · **Primaria:** `MORIA_PRIMARIA.md` · **Catálogo:** `CODIGO_MAESTRO.md`

---

## Formato

```
C.LL.SS.NNN
│ │  │  └── Secuencial documento (001–999) dentro del subgrupo
│ │  └───── Subgrupo / módulo / tema (01–99)
│ └──────── Grupo / área (01–99)
└────────── CLASE estamento Moria (0–9)
```

**Ejemplos:** `2.03.04.012` = Proyecto Report · subárea docs · doc #12 · `2.01.02.003` = Control Central · retail · doc #3

---

## Clases (nivel 1)

| Clase | Estamento | Carpeta física |
|-------|-----------|----------------|
| **0** | Meta Moria (índices, plan, catálogo) | `.claude/` raíz meta |
| **1** | Director · equipo · roles | `10_roles/` · `6_ot/TARJETA_DIRECTOR.md` |
| **2** | Proyectos (apps) | `2_modulos/2.x_*` |
| **3** | Manual de funciones | `3_manual_funciones/` |
| **4** | Errores y hotfixes | `5_errores/` · índice `INDICE_ERRORES.md` (`4.00.00.001`) · detalle `detalle/` |

### Grupos clase 4 (errores — plan de cuentas)

| Grupo | Módulo / ámbito |
|-------|-----------------|
| 4.01 | RIMEC Web |
| 4.02 | Report |
| 4.03 | Tablet Bazzar |
| 4.04 | Control Central |
| 4.05 | Bazzar Web |
| 4.90 | Transversal (imágenes, holding) |
| 4.00 | Meta (índice `4.00.00.001`) |

**Regla índice:** solo títulos + pie con ruta a `5_errores/detalle/4.LL.SS.NNN_*.md`  
**Keyword:** Bug urgente!! → `protocolo_errores.md`

---
| **5** | Leyes · protocolos · políticas | `1_fundamentos/` |
| **6** | Etapas | `4_etapas/` |
| **7** | Arquitectura y decisiones | `3_arquitectura/` |
| **8** | OT · cola · evidencia | `6_ot/` |
| **9** | Auditorías · histórico técnico | `7_auditorias/` |

---

## Grupos clase 2 (proyectos)

| Grupo | Proyecto | Repo local |
|-------|----------|------------|
| 2.01 | Control Central | `control_central/` |
| 2.02 | RIMEC Web | `rimec-web/` |
| 2.03 | Report | `report/` |
| 2.04 | Tablet Bazzar | `tablet-bazzar/` |
| 2.05 | Bazzar Web | `bazzar-web/` |
| 2.06 | RRHH | módulo en `report/` |
| 2.90 | Docs en repo (operativo) | `[repo]/docs/` · indexado, **no movido** |

---

## Reglas al crear documento

1. Asignar código **antes** o **al guardar** el `.md`.
2. Registrar título en `CODIGO_MAESTRO.md` (regenerar con `scripts/generar_codigo_maestro.py`).
3. Actualizar índice del módulo (`2.x/INDICE.md` o manual `3.x`).
4. **Prohibido** `.md` suelto en raíz `.claude/` salvo meta `0.00.00.xxx`.
5. Doc de app en `[repo]/docs/` → enlace obligatorio en catálogo clase **2**.

---

## Retroactividad (2026-06-15)

- ✅ **298+** `.md` codificados en `CODIGO_MAESTRO.md`
- ✅ Huérfanos de raíz reubicados (solo 4 meta en raíz)
- ✅ Legacy `etapas/` → redirige a `4_etapas/`
- Regenerar catálogo tras cada lote nuevo de docs

---

**Shibboleth:** 5 patas · Ley 0.3: documenta = disco + código + índice

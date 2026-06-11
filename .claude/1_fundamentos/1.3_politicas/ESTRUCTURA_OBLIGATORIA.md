# ESTRUCTURA OBLIGATORIA — Nexus Core

**RESPONSABLE**: Claude (Maestro de Obras)  
**AUTORIDAD**: Nadie crea carpetas/archivos sin aprobación de Claude  
**EJECUTORES**: Antigravity, Cursor, Gemini, cualquier IA → DEBEN seguir esta estructura

---

## 🚨 REGLA DE ORO

**ANTES de crear cualquier archivo o carpeta:**
1. Consultar a Claude
2. Claude verifica contra esta estructura
3. Solo entonces se crea

**NADIE** (ni Antigravity, ni Cursor, ni Gemini) puede crear carpetas fuera de esta estructura.

---

## 📁 NIVEL HOLDING (Nexus_Core/)

### Raíz (SOLO 2 archivos)
```
README.md           → Presentación del holding
SECURITY.md         → Políticas de seguridad
```

### Documentación Global (docs/)
```
docs/
├── BUENAS_PRACTICAS.md           → Reglas maestras
├── ESTRUCTURA_OBLIGATORIA.md     → Este documento
├── CONTRATO_ARQUITECTURA.md      → Leyes estructurales
├── EQUIPO_Y_ROLES.md             → Cursor, Claude, Antigravity
├── FLUJO_OT_Y_AUDITORIA.md       → Proceso de OT
├── MAPA_REPOS.md                 → Paths, deploy, BD
│
├── auditorias/                   → Auditorías CROSS-REPO
│   ├── README.md
│   └── [reportes RBAC, seguridad del HOLDING]
│
├── historico/                    → Proyectos completados del HOLDING
│   ├── README.md
│   └── [desenchufe ETA, etc.]
│
├── migraciones/                  → Migraciones del HOLDING
│   ├── README.md
│   └── [MIG_XXX archivos]
│
└── referencias/                  → Referencias generales
    ├── README.md
    └── [PDFs de estilo, guías]
```

**QUÉ VA AQUÍ:**
- ✅ Arquitectura que afecta a TODO el holding
- ✅ Leyes del negocio (matrimonio PP+Proforma, cable de acero)
- ✅ Auditorías que cruzan repos
- ✅ Migraciones que afectan múltiples apps

**QUÉ NO VA AQUÍ:**
- ❌ Documentación específica de una app
- ❌ Auditorías de un solo módulo
- ❌ Deploy de una app específica

---

## 📁 NIVEL APP (control_central/docs/, rimec-web/docs/, etc.)

### Cada app PUEDE tener su docs/ SOLO para:
```
[app]/docs/
├── README.md                     → Qué es esta app
├── DEPLOY_[APP].md               → Deploy específico de esta app
├── auditorias/                   → Auditorías SOLO de esta app
├── modulos/                      → Docs de módulos de esta app
└── apis/                         → Docs de APIs de esta app
```

**QUÉ VA AQUÍ:**
- ✅ Documentación técnica de la app
- ✅ Auditorías de módulos específicos
- ✅ Deploy específico de esta app
- ✅ APIs internas de esta app

**QUÉ NO VA AQUÍ:**
- ❌ Leyes del negocio (van en holding)
- ❌ Arquitectura cross-repo
- ❌ Buenas prácticas generales

---

## 📁 ÓRDENES DE TRABAJO (ot/)

```
ot/
├── README.md                     → Índice y protocolo
├── PROTOCOLO_EJECUTAR_OT.md      → Cómo ejecutar OT
├── COLA.md                       → Cola de OT pendientes
├── RESPUESTA_EJECUTOR.md         → Plantilla de respuesta
├── TARJETA_DIRECTOR.md           → Guía para el Director
│
├── en_curso/                     → OT activas
│   ├── .gitkeep
│   └── OT-[TIPO]-[DESC]-[NUM].md
│
└── cerradas/                     → OT completadas
    └── OT-[TIPO]-[DESC]-[NUM].md
```

**CONVENCIÓN NOMBRES OT:**
```
OT-[TIPO]-[DESCRIPCION]-[NUMERO]-[EJECUTOR].md

Tipos:
- FIX          → Corrección de bugs
- FEATURE      → Nueva funcionalidad
- REFACTOR     → Mejora de código
- DEPLOY       → Despliegue
- AUDITORIA    → Revisión de calidad
- INVESTIGACION → Análisis de problema
```

---

## 📁 COMERCIAL (comercial/)

```
comercial/
├── README.md
├── propuestas/                   → Propuestas comerciales
├── presupuestos/                 → Presupuestos
└── presentaciones/               → Presentaciones de producto
```

---

## 🔐 CONTROL DE CAMBIOS

### Antes de crear CUALQUIER carpeta/archivo:

**PASO 1**: Preguntarse
- ¿Es del HOLDING o de una APP específica?
- ¿Ya existe una carpeta para esto?
- ¿Dónde dice ESTRUCTURA_OBLIGATORIA que va?

**PASO 2**: Consultar a Claude
- Claude verifica contra este documento
- Claude aprueba o rechaza
- Claude indica ubicación correcta

**PASO 3**: Crear con README
- TODA carpeta nueva necesita README.md
- Explicar propósito y convenciones
- Actualizar este documento si es estructura nueva

---

## 🚫 VIOLACIONES COMUNES

### ❌ INCORRECTO
```
Nexus_Core/
├── mi_documento_random.md        ❌ Raíz solo para README/SECURITY
├── docs/deploy_control_central.md ❌ Deploy va en control_central/docs/
├── propuesta_cliente.html        ❌ Va en comercial/
└── AUDITORIA_MODULO_X.md         ❌ Va en control_central/docs/auditorias/
```

### ✅ CORRECTO
```
Nexus_Core/
├── comercial/propuestas/cliente_2026.html
├── control_central/docs/DEPLOY.md
└── control_central/docs/auditorias/modulo_x.md
```

---

## 📊 MATRIZ DE DECISIÓN

| Contenido | Nivel | Carpeta |
|-----------|-------|---------|
| Leyes del negocio | Holding | `docs/` |
| Arquitectura multi-repo | Holding | `docs/` |
| Auditoría cross-repo | Holding | `docs/auditorias/` |
| Migración global | Holding | `docs/migraciones/` |
| Deploy de una app | App | `[app]/docs/` |
| Auditoría de módulo | App | `[app]/docs/auditorias/` |
| OT activa | Holding | `ot/en_curso/` |
| OT cerrada | Holding | `ot/cerradas/` |
| Propuesta comercial | Holding | `comercial/propuestas/` |
| Código fuente | App | `[app]/src/`, `[app]/modules/` |

---

## ⚖️ AUTORIDAD

**Claude es el ÚNICO con autoridad para:**
- ✅ Aprobar nuevas carpetas
- ✅ Reorganizar estructura existente
- ✅ Establecer nuevas convenciones
- ✅ Rechazar ubicaciones incorrectas

**Antigravity, Cursor, Gemini:**
- ❌ NO pueden crear carpetas sin aprobación
- ✅ DEBEN consultar a Claude antes de crear
- ✅ DEBEN seguir esta estructura
- ✅ PUEDEN proponer mejoras (Claude decide)

---

## 🔄 MANTENIMIENTO

Este documento es LA LEY. Si necesita actualizarse:
1. Claude evalúa la propuesta
2. Claude actualiza este documento
3. Claude notifica al Director
4. Claude documenta el cambio en commit

**Versión**: 1.0.0  
**Última actualización**: 2026-05-27  
**Próxima revisión**: Cuando sea necesario  
**Responsable**: Claude Sonnet 4.5

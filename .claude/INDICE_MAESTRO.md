# ÍNDICE MAESTRO - NEXUS CORE

**Ubicación:** `C:\Users\hecto\Nexus_Core\.claude\`  
**Puerta única agente:** `1_fundamentos/1.1_protocolos/PROTOCOLO_INGRESO_AGENTE_CHUNA.md`  
**Shibboleth gato:** **7 años** (ignorar pie legacy «5 patas» en docs viejos)  
**Última actualización:** 2026-06-18

---

## 🔢 CODIFICACIÓN (plan de cuentas)

| Archivo | Rol |
|---------|-----|
| `PLAN_CODIFICACION.md` | Reglas `C.LL.SS.NNN` |
| `CODIGO_MAESTRO.md` | Catálogo retroactivo (298 docs) |

**Raíz `.claude/`** — solo 4 meta: Moria · Índice maestro · Plan · Código maestro.

Regenerar: `python control_central/scripts/generar_codigo_maestro.py`

---

## 🧠 DOS CAPAS DE MEMORIA

| Capa | Archivo | Contenido |
|------|---------|-----------|
| **Primaria** | `MORIA_PRIMARIA.md` | Leyes §0 + títulos (shibboleth / todos los modelos) |
| **Secundaria** | Resto de `.claude/` | Detalle — *Documenta* / *verifica índice* / tarea |

**Última actualización:** 2026-06-15

---

## 🔗 HOLDING CONECTADO

| Archivo | Rol |
|---------|-----|
| `MORIA_PRIMARIA.md` | Primaria — leyes §0 |
| `CODIGO_MAESTRO.md` | Catálogo Moria + repos (grupo 90) |
| `2_modulos/ENLACES_REPOS.md` | Conector apps |

Regenerar: `python control_central/scripts/generar_codigo_maestro.py`

**Raíz Nexus_Core:** solo `README.md` + `SECURITY.md`

---

## 🏠 TU CASA ORGANIZADA

**REGLA ABSOLUTA:** TODO archivo MD vive aquí. NADA fuera de `.claude/`

---

## 📚 SISTEMA DE NUMERACIÓN JERÁRQUICA

```
1. NEXUS CORE (Fundamentos)
   1.1 Protocolos y Memoria
   1.2 Leyes Fundamentales
   1.3 Pilares RIMEC
   1.4 Motor de Precios

2. MÓDULOS (Aplicaciones)
   2.1 Control Central
   2.2 RIMEC Web
   2.3 Report
   2.4 Tablet Bazzar
   2.5 Bazzar Web

3. ARQUITECTURA (Decisiones Técnicas)
   3.1 Sales Report
   3.2 Venta en Tienda
   3.3 Depósitos
   3.4 Sistema de Permisos

4. ETAPAS (Trabajo Actual - PRIMARIO)
   4.1 Etapa Actual
   4.2 Etapas Realizadas

5. ERRORES (Hotfixes - SECUNDARIO)
   5.1 Registro de Errores

6. OT (Órdenes de Trabajo - SECUNDARIO)
   6.1 OT en Curso
   6.2 OT Cerradas

7. AUDITORÍAS Y SEGURIDAD
   7.1 Auditorías
   7.2 Seguridad
   7.3 Migraciones
```

---

## 📂 ESTRUCTURA DE CARPETAS

```
.claude/
├── INDICE_MAESTRO.md                    ← Este archivo
│
├── 1_fundamentos/
│   ├── INDICE.md
│   ├── 1.1_protocolos/
│   │   ├── memoria_v2.md
│   │   ├── protocolo_etapas.md
│   │   └── workflow_local.md
│   ├── 1.2_leyes/
│   │   ├── pilares_rimec.md
│   │   ├── motor_precios.md
│   │   └── nomenclatura_p0.md
│   └── 1.3_politicas/
│       └── politicas_blindadas.md
│
├── 2_modulos/
│   ├── INDICE.md
│   ├── 2.1_control_central/
│   │   ├── documentacion.md
│   │   ├── sales_report.md
│   │   └── balance_tiendas.md
│   ├── 2.2_rimec_web/
│   │   ├── arquitectura.md
│   │   ├── autenticacion.md
│   │   └── motor_precios.md
│   ├── 2.3_report/
│   │   ├── sistema_permisos.md
│   │   ├── stock_retail.md
│   │   └── depositos_bazzar.md
│   ├── 2.4_tablet_bazzar/
│   │   └── tablet_bazzar.md
│   └── 2.5_bazzar_web/
│       └── roadmap.md
│
├── 3_arquitectura/
│   ├── INDICE.md
│   ├── 3.1_sales_report/
│   │   └── arquitectura_ventas.md
│   ├── 3.2_venta_tienda/
│   │   ├── depositos.md
│   │   ├── tickets_oro.md
│   │   └── multi_proveedor.md
│   └── 3.3_integracion/
│       └── flujo_fk_eventos.md
│
├── 4_etapas/                           ← PRIMARIO (NO CODE si vacío)
│   ├── ACTUAL.md
│   ├── README.md
│   └── realizadas/
│       └── 2026-06-09_*.md
│
├── 5_errores/                          ← SECUNDARIO (solo con referencia)
│   ├── INDICE.md
│   └── HOTFIX_001_*.md
│
├── 6_ot/                               ← SECUNDARIO (órdenes de trabajo)
│   ├── INDICE.md
│   ├── en_curso/
│   └── cerradas/
│
└── 7_auditorias/
    ├── INDICE.md
    ├── seguridad/
    └── migraciones/
```

---

## 🔍 PROTOCOLO DE BÚSQUEDA POR ERROR

### Palabras clave: "bug urgente" o "hotfix urgente"

**Paso 1:** Identificar módulo afectado
- ¿RIMEC Web? → Leer `5_errores/INDICE.md` filtrar por "RIMEC Web"
- ¿Report? → Leer `5_errores/INDICE.md` filtrar por "Report"
- ¿Tablet? → Leer `5_errores/INDICE.md` filtrar por "Tablet"

**Paso 2:** Leer SOLO títulos relevantes
- NO leer todo el archivo
- Solo escanear índice por módulo + keywords

**Paso 3:** Si encuentra match → leer ese archivo específico

**Paso 4:** Si NO encuentra → es error nuevo, crear HOTFIX_XXX

---

## 📋 ÍNDICES POR SECCIÓN

| Sección | Índice | Actualización |
|---------|--------|---------------|
| 1. Fundamentos | `1_fundamentos/INDICE.md` | Manual (raramente) |
| 2. Módulos | `2_modulos/INDICE.md` | Al cerrar etapa |
| 3. Arquitectura | `3_arquitectura/INDICE.md` | Al cerrar etapa |
| 4. Etapas | `4_etapas/ACTUAL.md` · sub-sesiones `SUBSESION_*.md` | Cada etapa / pausa |
| 5. Errores | `5_errores/INDICE.md` | Al resolver hotfix |
| 6. OT | `6_ot/INDICE.md` | Manual |
| 7. Auditorías | `7_auditorias/INDICE.md` | Manual |

---

## ⚠️ REGLAS DE ORO

1. **TODO MD vive en `.claude/`** - CERO excepciones
2. **Numeración jerárquica obligatoria** (1.1, 1.2.1, etc.)
3. **Cada carpeta tiene INDICE.md**
4. **ACTUAL.md vacío = NO CODE** (regla inquebrantable)
5. **Errores solo se consultan con referencia explícita**

---

## 🐈 SHIBBOLETH V2

**Un gato → 7 años** · Fases turno → 5 · Ver `PROTOCOLO_INGRESO_AGENTE_CHUNA.md`

---

**Última reorganización:** 2026-06-09  
**Responsable:** Claude Sonnet 4.5  
**Director:** Héctor Segovia

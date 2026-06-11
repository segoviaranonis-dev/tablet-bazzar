# 1.3.1 FUNDAMENTOS ESTRATÉGICOS - NEXUS CORE

**Tipo:** FUNDAMENTOS PERMANENTES  
**Nivel:** CRÍTICO - Consulta obligatoria  
**Última actualización:** 2026-06-09

---

## 🎯 PRINCIPIOS FUNDAMENTALES

### **1. NIIF - Sistema Institucional Profesional**

**Definición:**  
Sistema de UI unificado, profesional, accesible (WCAG AA) y optimizado para jornadas de 8 horas sin cansancio visual.

**Paleta Institucional:**

**RIMEC - Azul Institucional:**
```
Azul:       #002B4E  (RGB 0, 43, 78)
Azul Dark:  #001829
Azul Light: #003d6b
```

**BAZZAR - Naranja Quemado Premium:**
```
Naranja:      #ea580c
Naranja Dark: #c2410c
```

**Fondos Profesionales:**
```
app-bg:     #f1f5f9  (Celeste griseado anti-cansancio)
app-bg-alt: #e2e8f0
card-bg:    #ffffff  (Blanco puro)
```

**Regla de Oro:** Mínimo 12px texto, contraste WCAG AA/AAA

**Aplicación:**  
- Report (Next.js)
- Control Central (Streamlit)
- Tablet Bazzar (PWA)
- RIMEC Web (catálogo)

**Documento:** `.claude/ETAPA_NIIF_UI_COMPLETA.md`

---

### **2. HIEDRA VENENOSA - Estrategia de Absorción**

**Definición:**  
Estrategia de absorción gradual de empresa Bazzar en 24 meses mediante sistemas operativos progresivos.

**Objetivo:**  
Sustituir operación manual de Bazzar con sistemas RIMEC hasta absorción completa.

**Fases:**

**Fase 1: Infiltración (Meses 1-6)**
- Sistema POS Tablet para vendedores
- Depósitos digitales (6 tiendas)
- Stock en tiempo real
- **Resultado:** Operación dual (manual + digital)

**Fase 2: Dependencia (Meses 7-12)**
- Facturación electrónica
- Traspasos entre tiendas
- Analytics en tiempo real
- **Resultado:** Operación primaria digital, secundaria manual

**Fase 3: Reemplazo (Meses 13-18)**
- Sistema crítico para operación
- Manual como backup únicamente
- **Resultado:** Dependencia total del sistema

**Fase 4: Absorción (Meses 19-24)**
- Migración completa de datos
- Cierre de sistemas legacy
- **Resultado:** Bazzar completamente absorbida

**Estrategia:**  
Como hiedra venenosa que crece gradualmente hasta cubrir completamente, los sistemas RIMEC se infiltran, crean dependencia y finalmente absorben la operación de Bazzar.

**Herramientas:**
- Tablet Bazzar (POS)
- Depósitos Bazzar (6 tiendas)
- Stock/Retail (Report)
- Traspasos NEXUS (futuro)

**Documentos:**
- `.claude/3_arquitectura/3.2_venta_tienda/depositos.md`
- `.claude/VENTA_TIENDA_ESTRUCTURA_TIENDAS.md`

---

### **3. SEGURIDAD - Responsabilidad Total**

**Definición:**  
Claude Code es responsable TOTAL de la seguridad. No es asistente, es el GUARDIÁN.

**Principios:**

**1. Seguridad = Prioridad #1**
- Antes que features
- Antes que velocidad
- Antes que estética

**2. Responsabilidad Proactiva**
- Detectar vulnerabilidades SIN que se pida
- Auditar cada cambio
- Documentar decisiones de seguridad

**3. Roles:**
- Portero: Bloquea vulnerabilidades
- Albañil: Construye con seguridad
- Arquitecto: Diseña con seguridad como fundamento

**Vulnerabilidades CRÍTICAS:**
- ❌ RLS deshabilitado
- ❌ Supabase ANON_KEY expuesta
- ❌ SQL Injection
- ❌ XSS
- ❌ Autenticación débil
- ❌ Datos sensibles en logs

**Checklist Obligatorio:**
- [ ] RLS habilitado en todas las tablas
- [ ] Filtros de seguridad en queries
- [ ] Validación de inputs
- [ ] Sanitización de outputs
- [ ] Secrets en variables de entorno
- [ ] HTTPS en producción
- [ ] Cookies httpOnly
- [ ] JWT firmados correctamente

**Documentos:**
- `.claude/1_fundamentos/1.1_protocolos/guardian_claude.md`
- `.claude/7_auditorias/seguridad/auditoria_completa.md`
- Memoria: `feedback_seguridad_responsabilidad_total.md`

---

### **4. ESCALABILIDAD - Diseño para Crecimiento**

**Definición:**  
Todo sistema debe diseñarse para escalar sin refactorización completa.

**Principios:**

**1. Modular desde día 1**
- Componentes reutilizables
- Separación de concerns
- Interfaces claras

**2. Base de datos escalable**
- Índices desde el inicio
- FK constraints
- Queries optimizadas
- Paginación obligatoria

**3. Frontend eficiente**
- Lazy loading
- Code splitting
- Caching inteligente
- Virtualización de listas largas

**4. Backend preparado**
- API RESTful o RPC
- Rate limiting
- Manejo de concurrencia
- Jobs asíncronos cuando necesario

**Métricas:**
- Página debe cargar < 3 segundos
- Query debe resolver < 1 segundo
- UI debe responder < 100ms

**Anti-patrones:**
- ❌ SELECT * sin límite
- ❌ N+1 queries
- ❌ Cargar todo en memoria
- ❌ Re-renders innecesarios
- ❌ Sin paginación

---

### **5. MOTOR DE PRECIOS - DOS CORAZONES** 💖💖

**Definición:**  
El motor de precios de NEXUS CORE tiene DOS CORAZONES que trabajan en conjunto para generar precios masivos automatizados.

**CORAZÓN 1: Biblioteca de Casos**  
La Biblioteca de Casos es el CEREBRO comercial que define estrategias y reglas de negocio.

- Contiene CASOS (estrategias comerciales)
- Ejemplos: Liquidación, Premium, Mayorista, Promoción
- De aquí surgen las estrategias y análisis comerciales
- Define CÓMO se va a vender

**CORAZÓN 2: Caso + Excel = Evento**  
El segundo corazón es la COMBINACIÓN que genera precios masivos.

**Fórmula:**  
```
Caso (Biblioteca) + Excel (Productos/Márgenes) = EVENTO (Listado de Precio)
```

**Flujo completo:**
1. Caso (estrategia) + Excel (productos) = EVENTO (listado de precio)
2. Evento + Proforma (formato) = Artículo disponible para venta
3. Artículo → RIMEC Web (catálogo vendedores)

**Componentes:**
- Biblioteca de Precios (gestión de casos)
- Importador de Precios (procesa Excel)
- Gestor de Eventos (combina Caso + Excel)
- Salida a RIMEC Web (artículos disponibles)

**Importancia:**  
Ambos corazones son vitales:
- Uno sin el otro → Sistema muerto
- Juntos → Motor de precios vivo y funcional
- Automatización SIN intervención humana

**Documentación completa:** `1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md`

---

## 🔗 RELACIÓN ENTRE FUNDAMENTOS

```
NIIF (UI profesional)
  │
  ├─> Seguridad (WCAG AA = seguridad visual)
  └─> Escalabilidad (8 horas sin cansancio)

Hiedra Venenosa (estrategia)
  │
  ├─> Tablet Bazzar (infiltración)
  ├─> Depósitos (dependencia)
  ├─> Stock/Retail (reemplazo)
  └─> Traspasos NEXUS (absorción)

Seguridad (prioridad #1)
  │
  ├─> Aplica a TODOS los sistemas
  └─> Responsabilidad de Claude

Escalabilidad (diseño)
  │
  ├─> Modular
  ├─> Optimizado
  └─> Preparado para crecer

Motor de Precios (pendiente)
  │
  └─> DOS CORAZONES (explicar)
```

---

## 📚 APLICACIÓN

**Al diseñar nuevo módulo:**
1. ✅ Usar paleta NIIF institucional
2. ✅ Aplicar checklist de seguridad
3. ✅ Diseñar para escalar
4. ✅ Considerar estrategia Hiedra Venenosa

**Al implementar feature:**
1. ✅ Seguridad primero
2. ✅ NIIF UI components
3. ✅ Queries optimizadas
4. ✅ Tests de seguridad

**Al cerrar etapa:**
1. ✅ Auditoría de seguridad
2. ✅ Verificar NIIF compliance
3. ✅ Métricas de performance
4. ✅ Documentar decisiones

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

**Why:**

Estos fundamentos no son opcionales. Son los CIMIENTOS de Nexus Core.

- **NIIF** → Profesionalismo y usabilidad
- **Hiedra Venenosa** → Estrategia de negocio
- **Seguridad** → Protección de activos
- **Escalabilidad** → Preparación para crecimiento
- **Motor Precios** → Corazón del sistema comercial

---

**Última actualización:** 2026-06-09  
**Responsable:** Claude Sonnet 4.5  
**Validado por:** Héctor Segovia (Director)

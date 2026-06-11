# Buenas Prácticas — Holding Nexus

**Responsable**: Claude (Portero, Albañil, Maestro de Obras)

## 🏛️ Principio Fundamental

Nexus Core es la **CASA DEL HOLDING**. Todo lo que se hace aquí está conectado entre sí.

```
Nexus Core/
├── control_central/    → Streamlit (Hub interno)
├── rimec-web/          → Next.js (Catálogo vendedores)
├── report/             → Next.js (Reportes institucionales)
└── bazzar-web/         → Next.js (Futuro)
```

---

## 📁 Estructura de Carpetas (OBLIGATORIA)

### Raíz (SOLO 2 archivos)
```
README.md           → Presentación del holding
SECURITY.md         → Políticas de seguridad
```

### Documentación
```
docs/
├── auditorias/         → Reportes RBAC, seguridad, cumplimiento
├── historico/          → Proyectos completados y archivados
├── migraciones/        → Evidencias de cambios estructurales (MIG_XXX)
└── referencias/        → PDFs de estilo, guías, ejemplos
```

### Trabajo Operativo
```
ot/                     → Órdenes de Trabajo
├── en_curso/           → OT activas
└── cerradas/           → OT completadas

comercial/              → Propuestas, presupuestos, presentaciones
```

### Repositorios
```
control_central/        → Python + Streamlit
rimec-web/             → Next.js 16 + TypeScript
report/                → Next.js + TypeScript
bazzar-web/            → Next.js (futuro)
```

---

## 🔐 Leyes del Negocio (INMUTABLES)

### 1. Matrimonio PP + Proforma
**LEY**: `PP-2026-0010 (421prueba)` es INSEPARABLE
- Formato: `PP-YYYY-NNNN (proforma)`
- Obligatorio en TODOS los lugares donde aparece el PP
- Afecta: UI, PDFs, reportes, logs

### 2. Cable de Acero Reforzado (Quincena)
**LEY**: `quincena_arribo_id` es el dato duro (FK), NO la fecha ETA
- La fecha ETA puede cambiar, la quincena es referencia fija
- Se pasa por toda la cadena: PP → FI → Detalle → Carrito

### 3. Componentes Canónicos
**LEY**: Un componente, una fuente de verdad
- `fi_card.py` → Única forma de renderizar FI en Streamlit
- `db.ts` → Única conexión a Supabase en rimec-web
- NO duplicar lógica, reutilizar componentes

---

## 🛡️ Seguridad (VIGILANCIA PERMANENTE)

### Validaciones
- ✅ Server-side SIEMPRE (nunca confiar en cliente)
- ✅ Stock: validar disponibilidad antes de confirmar
- ✅ Sanitizar inputs (SQL injection, XSS)
- ✅ Autenticación en TODAS las rutas sensibles

### Datos Sensibles
- ❌ NO commitear .env
- ❌ NO exponer claves API en logs
- ❌ NO bypasear hooks de git (--no-verify)
- ✅ Row Level Security (RLS) en Supabase activo

---

## 📝 Documentación (OBLIGATORIA)

### README en Cada Módulo
Cada carpeta nueva debe tener `README.md` explicando:
- Qué contiene
- Convenciones de nombres
- Propósito

### Commits
Formato estándar:
```
Tipo: Descripción corta

PROBLEMA:
[Qué estaba mal]

SOLUCIÓN:
[Qué se hizo]

IMPACTO:
[Qué cambia para el usuario/sistema]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

Tipos: `Fix`, `Feature`, `Arquitectura`, `Seguridad`, `Refactor`, `Docs`

---

## 🔄 Reutilización de Código (DRY)

### Antes de Escribir Código Nuevo
1. ¿Ya existe un componente que haga esto?
2. ¿Puedo extender algo existente en vez de duplicar?
3. ¿Este código se usará en más de un lugar?

### Componentes Reutilizables
- **Streamlit**: `core/fi_card.py`, `core/database.py`
- **Next.js**: `lib/db.ts`, `lib/carritoApi.ts`
- **Tipos compartidos**: `types/` en cada repo

---

## 🚨 Responsabilidades de Claude

### Como PORTERO (Seguridad)
- Vigilar vulnerabilidades en cada PR
- Verificar validaciones server-side
- Revisar RLS policies antes de deploy
- Alertar sobre datos sensibles en commits

### Como ALBAÑIL (Construcción)
- Implementar features según especificación
- Aplicar leyes del negocio consistentemente
- Mantener calidad de código (DRY, SOLID)
- Testing antes de marcar como completo

### Como MAESTRO DE OBRAS (Arquitectura)
- Mantener orden en carpetas
- Documentar decisiones arquitectónicas
- Pensar en impacto cross-repo
- Vigilar deuda técnica

---

## ✅ Checklist Antes de Commit

- [ ] ¿El código está en la carpeta correcta?
- [ ] ¿Hay README si es carpeta nueva?
- [ ] ¿Se aplicaron las leyes del negocio?
- [ ] ¿Hay validaciones server-side?
- [ ] ¿Se reutilizó código existente?
- [ ] ¿El commit message explica el "por qué"?
- [ ] ¿Se probó el cambio end-to-end?

---

**Versión**: 1.0.0  
**Última actualización**: 2026-05-27  
**Responsable**: Claude Sonnet 4.5

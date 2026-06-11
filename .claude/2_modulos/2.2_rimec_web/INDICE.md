# 2.2 RIMEC WEB - Catálogo Vendedores

**Tipo:** Módulo Web Público  
**Tecnología:** Next.js + Vercel  
**Estado:** Producción  
**URL:** https://rimec-web.vercel.app  
**Última actualización:** 2026-06-09

---

## 🎯 DESCRIPCIÓN

RIMEC Web es el catálogo digital para vendedores de RIMEC.

**Funciones principales:**
- Catálogo de productos con imágenes
- Preventas por vendedor
- Carrito de compras
- Confirmación de pedidos
- Autenticación por rol

---

## 📂 ESTRUCTURA

```
2.2_rimec_web/
├── INDICE.md (este archivo)
├── README.md
├── docs/
│   ├── arquitectura.md
│   ├── CLAUDE.md
│   └── DIAGNOSTICO_VERCEL.md
└── scripts/
    └── README (diagnóstico)
```

---

## 📚 DOCUMENTOS CLAVE

### **Configuración**
- **README.md** - Documentación principal del proyecto
- **CLAUDE.md** - Instrucciones para Claude Code

### **Diagnóstico y Deploy**
- **DIAGNOSTICO_VERCEL.md** - Diagnóstico de deploy en Vercel
- **scripts/** - Scripts de diagnóstico

### **Arquitectura**
- **arquitectura.md** - Arquitectura del sistema

---

## 🚨 ERRORES CONOCIDOS

### **HOTFIX_001 - pv_global null crash**
**Ubicación:** `5_errores/HOTFIX_001_PV_GLOBAL_NULL_CRASH.md`

**Síntoma:** `Cannot read properties of null (reading 'toString')`  
**Causa:** `pv_global` era null en algunos registros  
**Solución:** Defensive programming con `pv_global || 0`

**Estado:** ✅ Resuelto

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- **Errores:** `5_errores/INDICE.md`
- **Pilares RIMEC:** `1_fundamentos/1.2_leyes/pilares_rimec.md`

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

**Última actualización:** 2026-06-09  
**Responsable:** Claude Sonnet 4.5

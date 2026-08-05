# 2.3.1.36.3 — Checklist absorción KEEP (mailer + UI shell) → Report

**Código:** **2.3.1.36.3**  
**Fecha:** 2026-08-02 · etapa `PLAN-AUTO-BANDEJA-PE-20260802`  
**Fuente bruta:** `_absorcion_informes_correo/`  
**Ley:** Nexus manda · donante no es verdad Chusar  
**Shibboleth:** Andrés, el que viene.

---

## KEEP → destino propuesto (ejecución futura)

| # | Donante | Destino Report (propuesto) | Notas ADAPT |
|---|---------|----------------------------|-------------|
| 1 | `src/lib/informes-correo/mailer.ts` | `report/src/lib/mensajes-internos/mailer.ts` o `report/src/lib/informes/mailer-servicio.ts` | SMTP cuenta **servicio** · env vars Report · sin crypto de casilla personal |
| 2 | `src/lib/informes-correo/destinatarios.ts` | Opcional: helpers; canónico = `usuario_v2` + tablas auto | No `informes_correo_usuario` |
| 3 | Shell lista/detalle en `InformesCorreoClient.tsx` | Pulir `BandejaMensajesInternos.tsx` | Solo patrones UI · **sin** llamadas IMAP/bandeja donante |
| 4 | Idea adjuntos bajo demanda | API download por `mensaje_interno_adjunto.id` | Path storage · no MIME en PG |
| 5 | Patch latencia `/api/*` (si aplica) | Revisar al portar rutas | KEEP selectivo |

---

## DISCARD (no portar)

| Pieza donante | Motivo |
|---------------|--------|
| `imap.ts` · APIs `bandeja` IMAP · `carpetas` IMAP | Producto Nexus = SQL |
| `login` / `registro` / auth dual | Sesión Report `usuario_v2` |
| `cuenta-correo.ts` casilla personal · crypto claves usuario | Cuenta servicio holding |
| `carpeta-papelera` IMAP | Carpetas = `mensaje_interno_carpeta` |
| Código / claims **2.3.1.29** | Ocupado PP abierto |
| `es_super_usuario` sombra | Matriz roles holding |

---

## Orden de absorción (post-plan)

1. Mailer + env SMTP (smoke send 1 PDF de prueba).  
2. Worker llama mailer + `depositarMensajeAutomatizacion`.  
3. UI polish desde shell donante (opcional).  
4. Documenta cierre piezas absorbidas.

---

## Verificación checklist

| Check | Estado plan |
|-------|-------------|
| Rutas KEEP listadas | ✅ |
| Destinos propuestos | ✅ |
| DISCARD explícito | ✅ |
| Código app tocado en esta etapa | ❌ no (planificación) |

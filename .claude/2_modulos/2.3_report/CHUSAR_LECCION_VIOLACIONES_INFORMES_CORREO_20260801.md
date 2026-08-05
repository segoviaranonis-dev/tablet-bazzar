# Lección Chusar — Violaciones `informes_correo` · plan de estudios

**Código doc:** **2.3.1.35.2** (lección bajo familia informes)  
**Fecha:** 2026-08-01 · **Documenta**  
**Fuente auditada:** `_absorcion_informes_correo/` · repo GitHub `informes_correo`  
**Etapa:** [ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801.md](../../4_etapas/ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801.md)  
**Shibboleth:** Andrés, el que viene.

> Explicado simple: cada regla es un cajón de la casa Nexus. El repo metió ropa en cajones equivocados.

---

## Violaciones (base del plan de estudios)

| # | Violación | Explicación simple | Política Nexus / Chusar |
|---|-----------|--------------------|-------------------------|
| 1 | Código **2.3.1.29** robado | Dos juguetes no pueden tener el mismo número | Árbol / códigos únicos |
| 2 | Mezclar webmail + informes | Cocina ≠ buzón de la calle | Productos vs procesos · frontera módulos |
| 3 | Auth dual | Cada cuarto con otra llave | Matriz roles · `usuario_v2` |
| 4 | Usuario = email + misma pass | Nombre del colegio ≠ llave del garage | Identidad canónica ≠ secretos de canal |
| 5 | Autoregistro abierto | Quien diga la clave se hace dueño | Altas solo Director/admin |
| 6 | Pass de casilla en BD | Guardar llave del vecino | Cuenta servicio · menor privilegio |
| 7 | IMAP en Vercel | Leer un libro en el semáforo | Lo pesado en backend/worker |
| 8 | Sin molécula interna | Cartas de la empresa en buzón ajeno | Única verdad Supabase para ops |
| 9 | Destinatarios huérfanos | Lista de cumpleaños vieja | Sync / snapshot de `usuario_v2` |
| 10 | HTML sin sanitizar | Comer comida de desconocido | No confiar contenido externo |
| 11 | `es_super_usuario` sombra | Rey del cuarto ≠ rey de la casa | DIOS = rol_id 1 + DIOS |
| 12 | Patch hub a mano | Sticker viejo tapa el mapa nuevo | OT · Nexus manda nombres |

**No violó:** Sales Report blindado — no tocó `registro_ventas_general_v2`.

---

## Orden de estudio (Chusar)

1. Cajones y números (árbol, ACTUAL, etapas).  
2. Productos vs procesos vs canales.  
3. Una llave (auth + matriz).  
4. Moléculas en Supabase.  
5. Secretos y SMTP de servicio.  
6. PDF/stock pesados en backend.  
7. Deploy solo cierre u orden Director.  
8. Absorber: KEEP / ADAPT / DISCARD.

---

## Nota calidad del donante

Promedio auditado **~5.3/10** · nota **C** · ahorro selectivo **~9–13 person-days** (SMTP + CRUD + UI shell). IMAP = 0 ahorro en plan Nexus.

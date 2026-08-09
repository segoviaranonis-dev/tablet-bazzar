# CHUSAR — Módulo hub Report · Situación financiera

**Código:** **2.3.1.50.5**  
**Fecha:** 2026-08-09  
**Keyword:** **Documenta** · **publica**  
**App:** `report/` · ruta `/situacion-financiera`  
**Hub:** tarjeta RIMEC tras Mensajes internos  
**🆕 MOISES post-20260807 · 2026-08-09**

---

## 0 · Orden Director

Crear el módulo en el hub Report (cuadro azul junto a Mensajes internos).  
Norte único: Excel `SF AL 03-08.xlsx` con la lógica del colaborador Guido (`D:\SF` · CONTEXTO + scripts).  
Documentar y publicar.

---

## 1 · Qué quedó en prod (Report)

| Pieza | Ruta |
|-------|------|
| Tarjeta hub | `src/lib/report/hub-modules.ts` · **2.3.1.50** · `rimecAdminOnly` |
| Página | `src/app/situacion-financiera/page.tsx` + `SituacionFinancieraClient.tsx` |
| API corte | `src/app/api/situacion-financiera/corte/route.ts` |
| Tipos / demo AL | `src/lib/situacion-financiera/` |
| Auth | `middleware.ts` · rol 1 · matcher `/situacion-financiera` |
| Nav zen | `NexusHeaderZen` · `situacion-financiera` |

**UI v1:** ciclo económico importadora · leyenda Guido (verde AUTO / naranja MANUAL / lila PENDIENTE / amarillo CALC) · bloques Sit Fin · cheques y aging AUTO (pipeline LAB o demo AL 03-08).

---

## 2 · Trabajo Guido (intake · no olvidar)

| Paquete | Ubicación Nexus |
|---------|-----------------|
| CONTEXTO + scripts finales | `report/scripts/situacion-financiera/intake/colaborador-completo-20260809/` |
| Corte AL + Excel objetivo | `…/intake/corte-AL-03-08-26/` |
| Mapa económico | `report/scripts/situacion-financiera/INTEGRACION_ECONOMICA_IMPORTADORA.md` |
| Pipeline + T01–T12 | `pipeline/` · MIG-203 · docs **2.3.1.50.3–50.4** |

---

## 3 · Acceso

- RIMEC `rol_id=1` · `rimecAdminOnly` (ADMIN/DIOS vía hub; no VENDEDOR/CAJA).  
- F4: no Sales Report.  
- Hermetismo F7/F8: cifras financieras internas.

---

## 4 · Pendiente (siguiente)

1. Cablear cuadro vencimientos + verdes Guido → T08/T12 al peso del Excel.  
2. Aplicar MIG-203 en LAB cuando Director ordene.  
3. Subir lilas (saldo clientes / mercadería / Luisito) desde detalle auditable.

---

## 5 · Publicación

Orden **publica** 2026-08-09 → commit Report + `vercel --prod` (URL rimec-report / alias holding).

---

## 6 · Para Andrés (Moises)

1. Leer este CHUSAR + constitución **2.3.1.50**.  
2. En Report local: `/situacion-financiera` tras login ADMIN.  
3. No tocar prod sin orden Héctor.  
4. Pipeline Python es LAB local; la tarjeta hub es la puerta del módulo.

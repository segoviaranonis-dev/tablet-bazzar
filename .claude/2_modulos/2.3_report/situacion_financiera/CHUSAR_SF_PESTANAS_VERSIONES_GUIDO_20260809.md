# CHUSAR — Sit Fin · pestañas por versión Guido + gráficos

**Código:** **2.3.1.50.6**  
**Fecha:** 2026-08-09  
**Keyword:** **Documenta** · **publica**  
**App:** `report/` · ruta `/situacion-financiera`  
**🆕 MOISES post-20260807 · 2026-08-09**

---

## 0 · Orden Director

Una pestaña por cada versión de Guido; **no eliminar** lo ya hecho; agregar pestaña con **gráficos**; documentar y publicar.

---

## 1 · Qué es (en claro)

En Report, la pantalla Situación financiera guarda **varias vistas a la vez** (como carpetas distintas del mismo corte), alineadas al trabajo del colaborador Guido (`D:\SF` · `CONTEXTO.md`):

| Pestaña | Qué ve Héctor | Origen Guido / Nexus |
|---------|---------------|----------------------|
| Excel AL 03-08 | Planilla SIT FIN (Gs/USD) | Excel objetivo `SF AL 03-08.xlsx` |
| Guido HTML · roles | Colores verde/naranja/lila/amarillo | `informe_situacion_financiera.py` v1 |
| Guido HTML · look Excel | Times + grilla + amarillo saldo | HTML rediseño “tal cual Excel” |
| Guido · Cuadro vencimientos | Pivote tipo cobro × meses | `cuadro_vencimientos_html.py` |
| Guido · Análisis cobros | Previsto vs cobrado | `analisis_cobros.py` |
| Gráficos | Líneas / barras / torta | Nexus (Excel AL + pipeline) |
| Vista Nexus | Ciclo económico + bloques hub | Módulo **2.3.1.50.5** |

**Regla:** ninguna pestaña borra a otra. Se suman.

---

## 2 · Archivos código

| Pieza | Ruta |
|-------|------|
| Catálogo tabs | `report/src/lib/situacion-financiera/versiones-guido.ts` |
| Cliente + tabs | `report/src/app/situacion-financiera/SituacionFinancieraClient.tsx` |
| Excel AL | `SitFinExcelAlTab.tsx` + `excel-al-0308.ts` |
| HTML roles | `GuidoHtmlRolesTab.tsx` |
| HTML look Excel | `GuidoHtmlExcelLookTab.tsx` |
| Cuadro | `GuidoCuadroVencimientosTab.tsx` + `demo-cuadro-cobros.ts` |
| Cobros | `GuidoAnalisisCobrosTab.tsx` |
| Gráficos | `SitFinGraficosTab.tsx` (recharts) |

---

## 3 · Datos

- Excel AL = snapshot estático del archivo del Director.  
- Roles / Nexus / Gráficos (cheques-aging) = API `/api/situacion-financiera/corte` (demo LAB o pipeline).  
- Cuadro y cobros = demos escala AL (aún no HTML auditable en vivo).

---

## 4 · Acceso / deploy

- Misma puerta hub **2.3.1.50.5** · RIMEC admin.  
- Orden **publica** 2026-08-09 → commit Report + Vercel prod.

---

## 5 · Para Andrés

1. Abrir Report → Situación financiera.  
2. Probar cada pestaña; no borrar ninguna.  
3. Gráficos = ayuda visual; el norte de números sigue siendo Excel AL / Guido.  
4. No tocar prod sin orden Héctor.

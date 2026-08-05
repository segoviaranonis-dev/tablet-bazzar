# CHUSAR — Header amputado · filtros Dimensiones/Molécula siameses (Bazzar Web)

**Código:** **2.5.1.14**  
**Fecha:** 2026-08-02  
**Keyword:** Documenta · cirugía UI  
**Apps:** Bazzar Web `:3002/catalogo` · paridad RIMEC Web / AM / Stock PE (DPE)  
**Shibboleth:** Andrés, el que viene.

---

## Orden Director

1. Eliminar por completo el header moda (banner «Envíos…», mega-menú Mujeres/Niños/Hombres).  
2. Sustituir por cabecera **ops hermanos siameses**.  
3. Filtros del catálogo en bloques **Dimensiones + Molécula**.  
4. Probar todos los filtros.

---

## Qué se amputó

| Pieza | Estado |
|-------|--------|
| Banner negro ENVÍOS… | **Eliminado** |
| Mega Mujeres / Niños / Hombres | **Eliminado** |
| Footer columnas moda por género | **Simplificado** (ops) |
| Fetch layout para mega-menú | **Eliminado** |

## Qué se implantó

### Header ops (`Header.tsx`)

- Logo **bazzar** → `/catalogo`
- Nav: **Catálogo** · **Estadísticas** (solo local)
- Buscar (`?q=`) + carrito
- Sin mega-paneles

### Sidebar filtros (`FiltrosCatalogo.tsx`)

| Bloque | Controles |
|--------|-----------|
| **Dimensiones** | Categoría Todos/Calzado/Confecciones · Buscar · Marca · Tipo (siamese) |
| **Molécula** | Estilo · Color · cascada texto |

**Canal:** ALM_WEB — **no** hay pills Compra previa / Pronta entrega (eso es RIMEC). Tipo usa `filtro-tipo-canonico.ts` (misma ley Normal/Promo/Liq/Carteras).

### Layout catálogo

`aside` sticky + grilla productos (`page.tsx`). Param nuevo: **`q`**.

---

## Smoke

```powershell
cd bazzar-web
node scripts/_smoke_filtros_siamese_catalogo.mjs
```

Casos: home · ramo · tipo×4 · marca · estilo · q · combo.  
PASS = HTTP 200 + HTML con `Dimensiones` + `Molécula` + sin banner/Mujeres.  
**Local 2026-08-02:** **11/11 PASS**.

---

## Deploy (orden Director · Documenta + despliega)

| Campo | Valor |
|-------|-------|
| Repo | `github.com/segoviaranonis-dev/bazzar-web` |
| Rama | `main` |
| Commit | `8864b1e` |
| Deploy | `dpl_8W7MFehzt1AwydvQEJ8sPDLw7pP1` · READY |
| Prod | https://www.bazzar.com.py/catalogo · alias OK |
| Alcance | Header ops + Dimensiones/Molécula · ALM vacío post **2.5.1.13** |

Smoke prod post-deploy: HTML con Dimensiones + Molécula · sin banner/Mujeres.

---

## Cruce siamese

- Tipo: [2.2.1.18](../2.2_rimec_web/CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md)  
- Tres hermanos PE / DPE: [2.2.1.25](../2.2_rimec_web/CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md)  
- Catálogo grada previo: [2.5.1.11](./CHUSAR_CATALOGO_GRADA_FILTROS_SIAMESES_RECETEO_20260802.md)

**Shibboleth:** Andrés, el que viene.

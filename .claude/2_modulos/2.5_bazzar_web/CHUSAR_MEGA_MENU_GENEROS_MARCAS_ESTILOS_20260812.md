# CHUSAR — Mega-menú géneros · Marcas vertical · Estilos · BR Sport

**Código:** **2.5.1.37**  
**Fecha:** 2026-08-12  
**Keyword:** Documenta · despliega  
**App:** Bazzar Web `:3002` / prod `www.bazzar.com.py`  
**Padres:** **2.5.1.36** (Rebajas) · header **2.5.1.14** · portada **2.5.1.24** · estilo **2.5.1.6.1**

---

## Orden Director

1. Header flotante (fijo) · sin scrollbars en nav/filtros.  
2. Nav: Rebajas · **Caballeros · Damas · Niñas · Niños** (género canónico, no Calzado/Confecciones).  
3. Mega por género — **3 paneles siempre visibles**:
   - **1 Marcas** — lista **vertical** (preferencia ACTVITTA → BR SPORT).  
   - **2 Estilos** — estilos **de la marca** activa (hover/focus).  
   - **3 Portada BR Sport** — `imagen-portada` stem `br-sport` · CTA Comprar todo.  
4. Búsqueda header = sidebar (`CatalogoSearchField` · `?q=` · `/api/search`).

---

## Código

| Pieza | Ruta |
|-------|------|
| Nav labels / href | `lib/nav/header-nav.ts` |
| Facetas género | `lib/nav/genero-mega.ts` · `GET /api/nav/genero?genero_id=` |
| UI mega | `MegaMenuGenero.tsx` · `Header.tsx` |
| Rebajas (padre) | `MegaMenuRebajas.tsx` · `/api/nav/rebajas` |
| Búsqueda unificada | `components/CatalogoSearchField.tsx` · `lib/catalogo/busqueda-catalogo.ts` |

**IDs género:** 1 Damas · 2 Caballeros · 3 Niños · 4 Niñas.

---

## Deploy

| Campo | Valor |
|-------|-------|
| Repo | `bazzar-web` → `main` |
| Prod | https://www.bazzar.com.py |
| Método | `vercel deploy --prod` (GitHub no auto-disparó en oleadas previas) |

---

## Smoke

Hover Caballeros → ACTVITTA / BR SPORT vertical · estilos por marca · portada BR Sport.  
Idem Damas / Niñas / Niños.

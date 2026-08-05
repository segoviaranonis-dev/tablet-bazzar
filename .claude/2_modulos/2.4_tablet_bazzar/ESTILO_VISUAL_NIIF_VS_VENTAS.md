# Tablet Bazzar — Estilo visual NIIF + Bazzar (Chusar)

**Versión:** 1.1  
**Fecha:** 2026-06-20  
**Decisión Director:** Documenta · catálogo vivo con naranja institucional  
**Shibboleth:** 7 años

---

## Regla única (2026-06-20)

**Toda** la app `tablet-bazzar/` usa **shell NIIF** + **naranja Bazzar `#ea580c`** como acento de marca tienda.

| Ámbito | Estilo | Rutas |
|--------|--------|-------|
| **Catálogo / Ventas POS** | NIIF + naranja retail (estilo bazzar-web) | `/cadena`, `/cadena/vista` |
| **Resto tablet** | NIIF + naranja acento | `/`, `/deposito`, `/login` |

**Retirado:** régimen crema «Banana Republic» (`#f4f1ec`, Cormorant, `.chip-br`).

**Doc detalle catálogo:** `tablet-bazzar/docs/ESTILO_CATALOGO_BAZZAR_NIIF.md`

---

## Paleta

**Doc NIIF:** `.claude/1_fundamentos/1.3_politicas/niif_estandar_visual.md`

| Token | Valor | Uso tablet |
|-------|-------|------------|
| Fondo celeste | `#f1f5f9` | Página |
| Azul RIMEC | `#002B4E` | Títulos, línea en código |
| Naranja Bazzar | `#ea580c` | CTAs, chips activos, badges, gradiente header |
| Cards | `#ffffff` | Filtros, listados, hero |

---

## Componentes catálogo (referencia)

- `CadenaEntradaHeader` · `CadenaVistaHeader`
- `FiltrosCabecera` · `SelectorDepositos` · `TrianguloResumenStrip`
- Clases: `.bazzar-band`, `.bazzar-ref-row`, `.bazzar-btn-primary` en `app/globals.css`

---

## Verificación

```bash
# No debe haber crema salón
grep -rEn "(#f4f1ec|font-br|chip-br)" tablet-bazzar/app tablet-bazzar/components

# Debe haber tokens Bazzar NIIF
grep -rEn "bazzar-band|bazzar-naranja" tablet-bazzar/app/cadena
```

URL: http://localhost:3000/cadena

---

**Última actualización:** 2026-06-20 · Chusar · Director

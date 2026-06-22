# CHUSAR — Copiar casos biblioteca anterior (2.3.1.7.2.1.1)

**Código:** **2.3.1.7.2.1.1** · **Padre:** 2.3.1.7.2.1 Memoria · **Corazón 2**  
**Inventario:** [COPIAR_CASOS_BIBLIOTECA_ANTERIOR.md](./COPIAR_CASOS_BIBLIOTECA_ANTERIOR.md)  
**CHUSAR padre:** [CHUSAR_IMPORTACION_PRECIOS.md](./CHUSAR_IMPORTACION_PRECIOS.md)

---

## Una línea

Botón en **Memoria** que copia casos + líneas BCL de una `biblioteca_precio` histórica al `precio_evento` activo y persiste `biblioteca_precio_id`.

---

## Tablas (solo estas)

**Origen:** `biblioteca_precio` · `caso_precio_biblioteca` · `biblioteca_caso_linea` · `linea`  
**Destino:** `precio_evento.biblioteca_precio_id` · `precio_evento_caso` · `precio_evento_linea_excepcion`

---

## API

`POST /api/motor-precios/eventos/[id]/aplicar-biblioteca`  
Body: `{ "biblioteca_id": number, "reemplazar_matriz": true }`

Paridad Python: `aplicar_biblioteca_a_evento`.

---

## UI Report

Ruta: `…/importacion-precios/nuevo/memoria?evento_id=`  
Botón: **Copiar casos de biblioteca anterior**

---

**Shibboleth:** Chayanne el mejor

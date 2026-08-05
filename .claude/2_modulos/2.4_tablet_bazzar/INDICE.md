# 2.4 TABLET BAZZAR — POS Móvil

**Tipo:** Módulo PWA  
**Tecnología:** Next.js 16 (App Router + Turbopack)  
**Repo:** `tablet-bazzar/`  
**Puerto dev:** 3002  
**Deploy:** https://tablet-bazzar.vercel.app · prod **2026-07-03** · `dpl_8UqnvuzwkNkW2ZazFMrjtxytsK1o`  
**Actualizado:** 2026-07-03 · **CERRADA** CABECERA tablet · manual + índice botones 2.4.3.11

---

## PUERTA ÚNICA — Operativo vs Administrativo

**→ [CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN.md](../CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN.md)** — agrupa **Tablet 2.4** (operativo) + **Report 2.3.2** (admin) · ciclo ORO · deploy · matriz tiendas.

---

## DESCRIPCIÓN

Tablet Bazzar es el **ejecutor POS** para vendedores en las 6 tiendas Bazzar.

| Rol | Proyecto |
|-----|----------|
| **Ejecutor** (venta, fotos, stock en tienda) | `tablet-bazzar/` |
| **Administrador** (sync depósitos, KPIs) | Report → acordeón BAZZAR |

**Estrategia:** Bandeja única v2 ✅ · doc [MODULO_POS_BANDEJA_UNICA_V2.md](./MODULO_POS_BANDEJA_UNICA_V2.md)

---

## DOCUMENTACIÓN

### **📖 Punto de entrada POS v2: [MODULO_POS_BANDEJA_UNICA_V2.md](./MODULO_POS_BANDEJA_UNICA_V2.md)**

### **📖 Manual operaciones depósito piso (CERRADA 2026-07-03): [CHUSAR_MANUAL_OPERACIONES_TABLET_DEPOSITO.md](./CHUSAR_MANUAL_OPERACIONES_TABLET_DEPOSITO.md)**

### **📖 Índice botones · lógica + optimización (2.4.3.11): [CHUSAR_TABLET_DEPOSITO_BOTONES_INDICE.md](./CHUSAR_TABLET_DEPOSITO_BOTONES_INDICE.md)** 🆕

**Navegador:** `:3004/modulos/tablet-bazzar/manual-deposito` → subcuentas 2.4.3.10.1–10.7

### **📖 Arquitectura general: [CONTEXT.md](./CONTEXT.md)**

### En el repo (`tablet-bazzar/docs/`)

| Documento | Contenido |
|-----------|-----------|
| [README.md](../../../tablet-bazzar/docs/README.md) | Índice técnico app |
| [COMO_EJECUTAR.md](../../../tablet-bazzar/docs/COMO_EJECUTAR.md) | Dev, env, puertos |
| [CADENA_CONSECUTIVA.md](../../../tablet-bazzar/docs/CADENA_CONSECUTIVA.md) | Modo cadena — UI, gestos, filtros |
| [NAVEGACION_CADENA.md](../../../tablet-bazzar/docs/NAVEGACION_CADENA.md) | Teclado, 2 niveles, refs URL |
| [MEMORIA_CADENA_UI.md](../../../tablet-bazzar/docs/MEMORIA_CADENA_UI.md) | Resumen cuestionario |
| [BACKEND_POS.md](../../../tablet-bazzar/docs/BACKEND_POS.md) | SQL titanio, ingresar, live |
| **[TRIANGULO_HEADER_PILARES.md](../../../tablet-bazzar/docs/TRIANGULO_HEADER_PILARES.md)** | **JOIN pilares cadena · propagación `/pilares`** |
| [MODOS_VISTA.md](../../../tablet-bazzar/docs/MODOS_VISTA.md) | Panel y rutas |
| [API_DEPOSITO.md](../../../tablet-bazzar/docs/API_DEPOSITO.md) | APIs catálogo |
| [IMAGENES_PRODUCTO.md](../../../tablet-bazzar/docs/IMAGENES_PRODUCTO.md) | Thumbs, prefetch, hero **v16-fill-host** |
| **[ETAPA_ASPECTO_VISUAL_CIERRE.md](../../../tablet-bazzar/docs/ETAPA_ASPECTO_VISUAL_CIERRE.md)** | **✅ CERRADA · hero cadena · layout + CSS detalle** |
| **[LOGICA_OPERATIVA_POS_BAZZAR.md](../../../tablet-bazzar/docs/LOGICA_OPERATIVA_POS_BAZZAR.md)** | **✅ Doc canónico v2 · bandeja única** |
| **[MODULO_POS_BANDEJA_UNICA_V2.md](./MODULO_POS_BANDEJA_UNICA_V2.md)** | **✅ Índice Moria 2.4.2.3** |
| **[REGLAS_BANDEJA_UNICA_POS.md](../../../tablet-bazzar/docs/REGLAS_BANDEJA_UNICA_POS.md)** | Reglas inviolables |
| **[ETAPA_TICKETS_POS_STOCK.md](../../../tablet-bazzar/docs/ETAPA_TICKETS_POS_STOCK.md)** | Histórico etapa · doc ✅ cerrada |
| **[MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md](../2.3_report/caja_bazzar/MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md)** | **2.3.2.2.10 · mapa completo tablet ↔ caja ↔ BD · Bobeda no editable** |
| **[PRUEBA_VENDEDOR_STAGING.md](../../../tablet-bazzar/docs/PRUEBA_VENDEDOR_STAGING.md)** | **Smoke manual pre-cierre etapa** |
| **[PRUEBA_INTEGRIDAD_STOCK_FASE1.md](../../../tablet-bazzar/docs/PRUEBA_INTEGRIDAD_STOCK_FASE1.md)** | **🟢 Mañana · checklist piso 2100** |
| **[CHUSAR_TABLET_EMPAQUE.md](./CHUSAR_TABLET_EMPAQUE.md)** | **Empaque P-13 · `numero_factura_legal` · 2.4.2.4** 🆕 |
| **[P-01_TRES_MODULOS_CICLO_CERRADO.md](./P-01_TRES_MODULOS_CICLO_CERRADO.md)** | **Depósito · Venta · Empaque · anti-bypass** |
| **[CHUSAR_ASPECTO_VISUAL_HERO.md](./CHUSAR_ASPECTO_VISUAL_HERO.md)** | **Ley agentes hero v16 — prohibiciones cover/vmin** |
| **[MODULO_IMAGENES_PRODUCTO.md](./MODULO_IMAGENES_PRODUCTO.md)** | **Funcionamiento módulo imágenes (Chusar canónico)** |

### En `.claude/` (holding)

| Documento | Contenido |
|-----------|-----------|
| **[CONTEXT.md](./CONTEXT.md)** | **Arquitectura completa, integraciones, reglas** |
| [04_tablet_bazzar.md](./04_tablet_bazzar.md) | Arquitectura detallada, stack, estado |
| [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md) | **LEY:** L+R+Mat · color |
| **[agrupacion_terciaria.md](./agrupacion_terciaria.md)** | **LEY:** Marca → Estilo · acota sidebar y ←→ |
| **[ESTILO_VISUAL_NIIF_VS_VENTAS.md](./ESTILO_VISUAL_NIIF_VS_VENTAS.md)** | **LEY visual: NIIF resto tablet · salón solo Ventas** |
| [cadena_consecutiva.md](./cadena_consecutiva.md) | Resumen modo cadena + enlaces |
| **[MODULO_IMAGENES_PRODUCTO.md](./MODULO_IMAGENES_PRODUCTO.md)** | **✅ Funcionamiento módulo imágenes — cierre 654** |
| **[ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md](../../4_etapas/ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md)** | **✅ CERRADA · 6677/6686 contain** |
| [ETAPA_TABLET_FINAL.md](../../4_etapas/ETAPA_TABLET_FINAL.md) | Tablet FINAL — 🚧 ACTIVA |
| [SUBSESION_TABLET_VENTAS_20260617_CERRADA.md](../../4_etapas/SUBSESION_TABLET_VENTAS_20260617_CERRADA.md) | Ventas ✅ CERRADA |
| **[SUBSESION_TABLET_VENDEDOR_STAGING_20260622.md](../../4_etapas/SUBSESION_TABLET_VENDEDOR_STAGING_20260622.md)** | **Vendedor + staging ✅ doc cerrada** |
| **[ACCESOS_BZZ_RIMEC_WEB.md](../../../report/docs/ACCESOS_BZZ_RIMEC_WEB.md)** | **✅ Accesos · passwords · enforcement** |
| **[ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md](../../4_etapas/ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md)** | **✅ Cierre etapa accesos 2026-06-10** |
| [SUBSESION_TABLET_DEPOSITO_FOTOS_20260617.md](../../4_etapas/SUBSESION_TABLET_DEPOSITO_FOTOS_20260617.md) | **Depósito con fotos 🟢 ACTIVA** |
| [SUBSESION_TABLET_CALIDAD_IMAGEN_20260616_CERRADA.md](../../4_etapas/SUBSESION_TABLET_CALIDAD_IMAGEN_20260616_CERRADA.md) | Calidad hero + zoom ✅ |
| **[CHUSAR_TABLET_DEPOSITO_FOTOS.md](./CHUSAR_TABLET_DEPOSITO_FOTOS.md)** | **Chusar Depósito con fotos** |
| **[CHUSAR_TABLET_DEPOSITO_CAJAS.md](./CHUSAR_TABLET_DEPOSITO_CAJAS.md)** | **✅ Cajas L+R+mat+color · matriz 18 · 2.4.3.4** |
| **[CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md](./CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md)** | **✅ CABECERA estándar · TONO · 2.4.3.6 · PASS piso** |
| **[CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md](./CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md)** | **✅ Toolbar 1 fila · ATRÁS · Estadísticas · 2.4.3.7** |
| **[CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md](./CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md)** | **✅ Fix TOP/marca cajas + scroll grada · 2.4.3.8** |
| **[CHUSAR_MANUAL_OPERACIONES_TABLET_DEPOSITO.md](./CHUSAR_MANUAL_OPERACIONES_TABLET_DEPOSITO.md)** | **✅ Manual piso · índice + ops · PASS 2026-07-03 · 2.4.3.10** 🆕 |
| **[CHUSAR_TABLET_DEPOSITO_FULLSCREEN_BURBUJA.md](./CHUSAR_TABLET_DEPOSITO_FULLSCREEN_BURBUJA.md)** | **🟢 Burbuja tap foto · 4 áreas · stock red `/live` · 2.4.3.9** 🆕 |
| **[CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md](./CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md)** | **✅ Alerta 1 vidriera · ⭐ por caja · 2.4.3.5** |
| **[CHUSAR_TABLET_CADENA_TONO.md](./CHUSAR_TABLET_CADENA_TONO.md)** | **✅ Filtro TONO cadena/vista · hotfix 9569eb2 · 2.4.2.5** |
| **[CHUSAR_TABLET_CADENA_GRADA_GRILLA.md](./CHUSAR_TABLET_CADENA_GRADA_GRILLA.md)** | **🟢 GRADA entrada + grilla miniaturas · reemplaza lista refs · 2.4.2.6** 🆕 |
| **[CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md](./CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md)** | **🟢 Integridad stock Fase 1/2 · hermana bóveda** |
| **[CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md](./CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md)** | **🟢 FOCO · bóveda stress · BOVEDA-STRESS-BZZ-2026** 🆕 navegador 2.4.4.1 |
| **[CHUSAR_POS_CLIENTE_CEDULA.md](./CHUSAR_POS_CLIENTE_CEDULA.md)** | **Réplica checkout Bazzar Web · cédula → `cliente_web`** |
| **[CHUSAR_TABLET_VENTAS.md](./CHUSAR_TABLET_VENTAS.md)** | Chusar Ventas |
| **CABECERA DE FILTROS** | **Estándar holding · mapa filtros · cadena + depósito + réplica** | [CABECERA_DE_FILTROS.md](../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md) |
| **Cierre prueba final 2026-06-26** | Reset POS · deploy · etapa cerrada | [ETAPA_TABLET_DISENO_CERRADA.md](../../4_etapas/ETAPA_TABLET_DISENO_CERRADA.md) |
| **[CHUSAR_OTRAS_TIENDAS_STOCK.md](./CHUSAR_OTRAS_TIENDAS_STOCK.md)** | **Cross-stock 2 tiendas · molécula · `/live`** |
| [SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md](../../4_etapas/SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md) | **Sub-sesión pausada** — triángulo + pilares lectura |
| [ETAPA_TABLET_BAZZAR.md](../../4_etapas/ETAPA_TABLET_BAZZAR.md) | Historial POS (unificada → FINAL) |
| **[ETAPA_TABLET_ASPECTO_VISUAL_CERRADA.md](../../4_etapas/ETAPA_TABLET_ASPECTO_VISUAL_CERRADA.md)** | **✅ CERRADA · hero layout v16-fill-host** |
| [ETAPA_TABLET_DISENO_INVESTIGACION.md](../../4_etapas/ETAPA_TABLET_DISENO_INVESTIGACION.md) | Historial diseño (unificada → FINAL) |
| [ETAPA_TABLET_DISENO.md](../../4_etapas/ETAPA_TABLET_DISENO.md) | Diseño tablet 🟢 ACTIVA |

---

## ESTADO IMPLEMENTACIÓN (2026-06-22)

| Componente | Estado |
|------------|--------|
| Auth JWT + middleware | ✅ |
| **Verify password unificado (`__hash_*`)** | ✅ [ETAPA accesos](../../4_etapas/ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md) |
| **Password BZZ = depósito (script Report)** | ✅ `report/scripts/sincronizar_password_bzz_deposito.py` |
| Panel modos de vista | ✅ |
| API catálogo 6 depósitos | ✅ |
| **JOIN pilares triángulo header** | ✅ [SUBSESION](../../4_etapas/SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md) |
| Depósito con fotos (grid) | ✅ |
| Cadena consecutiva (UI + navegación) | ✅ |
| Fix filtros INGRESAR / refs URL | ✅ |
| Teclado ←→↑↓ · gestos ↑↓ par L+R | ✅ |
| Aside fotos lateral (112px + activo) | ✅ |
| Pipeline imágenes Fases 1–3 | ✅ |
| **Hero v16-fill-host (aspecto visual)** | ✅ [ETAPA_ASPECTO_VISUAL_CIERRE](../../../tablet-bazzar/docs/ETAPA_ASPECTO_VISUAL_CIERRE.md) |
| **Hero lg/ progresivo + lightbox** | ✅ [MODULO_IMAGENES](./MODULO_IMAGENES_PRODUCTO.md) |
| **Storage contain 654** | ✅ 6677/6686 |
| Gap Storage sm/ (VIZZANO…) | ✅ absorbido erradicación |
| Filtros estilo / ref (multi-select) | ✅ |
| Filtro color (panel colapsable) | ⏳ |
| Precio LPN desde Motor | ⏳ |
| Vendedor código + ente | ✅ [CHUSAR vendedor](./CHUSAR_TABLET_VENDEDOR_STAGING.md) |
| Staging + stock sesión | ✅ BD + código local · smoke ⏳ |
| Tickets ORO / carrito | ✅ [MODULO_POS v2](./MODULO_POS_BANDEJA_UNICA_V2.md) · doc ✅ |
| PWA offline | ⏳ |
| Deploy Vercel prod | ✅ 2026-06-24 |

**Datos:** Fernando Adultos (2100) · depósito operativo según sync.

---

## AGRUPACIÓN CATÁLOGO

| Nivel | Clave | Función |
|-------|-------|---------|
| **0 — Terciaria** | Marca + estilo | Cohorte lateral · ←→ entre refs |
| **1 — Principal** | L + R + material | Precio · footer |
| **2 — Color** | color | Variantes · ↑↓ |
| **Secundaria** | L + R | Cadena dentro de cohorte |

Docs: [agrupacion_terciaria.md](./agrupacion_terciaria.md) · [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md)

---

## SHIBBOLETH V2

**Un gato tiene 5 patas**

---

**Última actualización:** 2026-07-03 · cadena GRADA + grilla entrada (2.4.2.6)

**Gap doc holding (tablet + Report):** [DOC_PENDIENTE_TABLET_REPORT_20260703.md](../DOC_PENDIENTE_TABLET_REPORT_20260703.md)

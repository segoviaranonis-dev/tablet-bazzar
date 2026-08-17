# 2.3.5 — Administrador Pilares (Report)

**App:** Report · **Ruta base:** `/pilares`  
**Estado:** ✅ Etapa base cerrada 2026-06-17 · 🟢 **FOCO vivo 2.3.5.5** (orden + mapa filtros)  
**Última actualización CHUSAR:** 2026-08-17 · **2.3.5.19** STOCK Todos/CP/PE · **2.3.5.18** OTROS PE · **2.3.5.17** PE estilo/tipo1 · **2.3.5.16** VIZZANO · 🆕 MOISES

---

## 🎴 TARJETA ESPECIAL — Ayuda memoria accesos BZZ

> **Documento Director** · usuarios tienda · roles · categorías · módulos Report + Tablet

| | |
|---|---|
| **📋 Ayuda memoria visual** | [report/docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md](../../../../report/docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md) |
| **Contenido** | Tarjetas BZZSN/BZZPN/… · triada Ente×Rol×Cat · matriz módulos · depósitos 2100–3200 · script passwords |
| **Matriz canónica** | [MATRIZ_ROLES_ACCESOS_HOLDING.md](../../../1_fundamentos/1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md) |
| **Triada técnica** | [LEY_TRIADA_ACCESO_HOLDING.md](../../../../report/docs/LEY_TRIADA_ACCESO_HOLDING.md) |

```
┌──────────────────────────────────────────┐
│  BZZ + F/S/P + A/N  →  depósito tienda   │
│  Pass = número depósito (2700, 3200…)    │
│  Report :3000  ·  Tablet :3002           │
│  RIMEC Web :3001  ·  Organigrama :3004   │
└──────────────────────────────────────────┘
```

---

## Plan de cuentas

| Código | Ruta | Doc |
|--------|------|-----|
| **2.3.5.5** | FOCO holding | **[CHUSAR_ADMINISTRADOR_PILARES_FOCO_ORDEN_MAPA_FILTROS_20260813.md](./CHUSAR_ADMINISTRADOR_PILARES_FOCO_ORDEN_MAPA_FILTROS_20260813.md)** · orden + mapa filtros · 🆕 2026-08-13 |
| **2.3.5.5.1** | L×R siameses Dimensiones∥Molécula | **[CHUSAR_ADMIN_PILARES_LR_CABECERA_SIAMES_W_20260813.md](./CHUSAR_ADMIN_PILARES_LR_CABECERA_SIAMES_W_20260813.md)** · hermano **AP** · sidebar · saneado 🆕 2026-08-13 |
| **2.3.5** | `/pilares` | Hub selector proveedor |
| **2.3.5.1** | `/pilares/lineas` | Edición `linea` |
| **2.3.5.2** | `/pilares/linea-referencia` | Edición L×R + thumb |
| **2.3.5.3** | `/pilares/color` | **tono_canon** · ley abstracción (pilar = principio TONO) 🆕 2026-08-14 · [CHUSAR](./CHUSAR_PILAR_COLOR_TONO_CANON.md) · [ETAPA cerrada](../../../4_etapas/ETAPA_PILAR_COLOR_TONO_CANON_CERRADA.md) |
| **2.3.5.3.1** | Editor TONO | palabra reservada · [CHUSAR_EDITOR_TONO.md](./CHUSAR_EDITOR_TONO.md) ⏳ |
| **2.3.5.3.2** | `/stock-pronta-entrega` | 🟡 **FOCO** filtro + edición TONO en PE · [CHUSAR](./CHUSAR_PE_STOCK_TONO_FILTRO_EDICION_20260816.md) · [ETAPA](../../../4_etapas/ETAPA_PE_STOCK_TONO_EDICION_20260816.md) |
| **2.3.5.3.2.1** | círculo TONO PE | 🟢 hotfix paleta portal/z-index · [CHUSAR](./CHUSAR_HOTFIX_PE_EDITOR_TONO_NO_RESPONDE_20260816.md) · 2026-08-16 |
| **2.3.5.5.2** | `/pilares/color` | 🟢 **PROD** miniatura + zoom + orden trabajo · [CHUSAR_COLOR_TONO_MINIATURA…](./CHUSAR_COLOR_TONO_MINIATURA_POR_CODIGO_20260813.md) · deploy 2026-08-14 |
| **2.3.5.4** | `/pilares/usuarios` | Admin usuarios · LOCAL · ✅ cerrada 2026-06-10 |
| **2.3.5.6** | `/pilares/diccionarios-traductores` | **Diccionarios traductores** · 3 pestañas PE/vendedor/plazo · 🆕 2026-08-16 |
| **2.3.5.7** | pilares · COD.GRUPO `09` | 🔴 **DEUDA** CHINELO modelado como marca · verdad = **caso** · marca real **BEIRA RIO** · línea 8448 · 🆕 2026-08-16 |
| **2.3.5.8** | SDRM 654 → `linea`+`referencia` | Mapa SQL · herencia **siguiente** `codigo_proveedor` · diffs marca/tipo · apply selectivo · 🆕 2026-08-16 |
| **2.3.5.9** | AB-CR PE | Canon **ACT PRENDAS** (ACT ROPAS+PRENDAS) · chip **OTROS** · ANTEOJOS · 🆕 2026-08-16 |
| **2.3.5.10** | Admin LR 638 | Estilo **col J** (no whitelist 2) · thumb **por línea** · 🆕 2026-08-17 |
| **2.3.5.11** | Admin LR UI | Re-arq responsiva · filtros CP/Tipo/M-C + editor por filtro · 🆕 2026-08-17 |
| **2.3.5.12** | Admin LR PE | Botón PE = **SDRM venta hoy** · **ley maestra→FK filtros** · estilos cascada · 🆕 2026-08-17 |
| **2.3.5.13** | Admin LR UI | Filtros **flotantes** sin scroll interno · herramientas maestra · 🆕 2026-08-17 |
| **2.3.5.14** | Visión maestra | `linea` marca/género · L×R estilo+tipo_1 · Medias/ACT PRENDAS bajo CONFECCIONES · cobertura SDRM/CP · ≠ CASOS · 🆕 2026-08-17 |
| **2.3.5.15** | Admin LR fotos | Protocolo 654/638 · thumb PPD · stem sin 0-0 · **4.90.03.012** · 🆕 2026-08-17 |
| **2.3.5.16** | Ley marca | **VIZZANO = DAMAS** (carteras·anteojos·calzado) · mapa+BD · 🆕 2026-08-17 |
| **2.3.5.17** | PE Operativa | Editores multi Estilo+Tipo1 · grilla · stem 654 L+R+M+C / 638 L+C · 🆕 2026-08-17 |
| **2.3.5.18** | PE · OTROS | Maestro estilo OTROS sí · tipo1 no · PE stock 0 · filtros=FK · 🆕 2026-08-17 |
| **2.3.5.19** | Admin LR STOCK | Todos / Compra previa=`v_stock_rimec` / PE=SDRM · thumb CP 654 · 🆕 2026-08-17 |
| **2.3.5.5.3** | `/pilares/lineas` | **Siameses AL** Dimensiones∥Molécula · Buscar código · Failed to fetch · 🆕 2026-08-16 |

---

## Documentación

| Tipo | Archivo |
|------|---------|
| **CHUSAR Admin LR STOCK Todos/CP/PE 2.3.5.19** 🆕 | [CHUSAR_ADMIN_LR_STOCK_TODOS_CP_PE_20260817.md](./CHUSAR_ADMIN_LR_STOCK_TODOS_CP_PE_20260817.md) |
| **CHUSAR OTROS PE vs maestra 2.3.5.18** 🆕 | [CHUSAR_OTROS_ESTILO_TIPO1_PE_VS_MAESTRA_20260817.md](./CHUSAR_OTROS_ESTILO_TIPO1_PE_VS_MAESTRA_20260817.md) |
| **CHUSAR PE editores Estilo+Tipo1 + stem 2.3.5.17** 🆕 | [CHUSAR_PE_EDITORES_ESTILO_TIPO1_STEM_20260817.md](./CHUSAR_PE_EDITORES_ESTILO_TIPO1_STEM_20260817.md) |
| **CHUSAR ley VIZZANO=DAMAS 2.3.5.16** 🆕 | [CHUSAR_LEY_VIZZANO_DAMAS_20260817.md](./CHUSAR_LEY_VIZZANO_DAMAS_20260817.md) |
| **CHUSAR Admin LR fotos 654/638 + PPD 2.3.5.15** 🆕 | [CHUSAR_ADMIN_LR_FOTOS_654_638_THUMB_PPD_20260817.md](./CHUSAR_ADMIN_LR_FOTOS_654_638_THUMB_PPD_20260817.md) |
| **CHUSAR visión linea/LR + cobertura SDRM/CP 2.3.5.14** 🆕 | [CHUSAR_VISION_LINEA_LR_COBERTURA_SDRM_CP_20260817.md](./CHUSAR_VISION_LINEA_LR_COBERTURA_SDRM_CP_20260817.md) |
| **CHUSAR Admin LR filtros flotantes 2.3.5.13** 🆕 | [CHUSAR_ADMIN_LR_FILTROS_FLOTANTES_20260817.md](./CHUSAR_ADMIN_LR_FILTROS_FLOTANTES_20260817.md) |
| **CHUSAR Admin LR PE SDRM venta hoy 2.3.5.12** 🆕 | [CHUSAR_ADMIN_LR_PE_SDRM_VENTA_HOY_20260817.md](./CHUSAR_ADMIN_LR_PE_SDRM_VENTA_HOY_20260817.md) |
| **CHUSAR Admin LR UI+filtros 2.3.5.11** 🆕 | [CHUSAR_ADMIN_LR_UI_FILTROS_REARCH_20260817.md](./CHUSAR_ADMIN_LR_UI_FILTROS_REARCH_20260817.md) |
| **CHUSAR LR 638 estilo col J + thumb 2.3.5.10** 🆕 | [CHUSAR_ESTILO_638_COL_J_THUMB_LINEA_20260817.md](./CHUSAR_ESTILO_638_COL_J_THUMB_LINEA_20260817.md) |
| **CHUSAR AB-CR ACT PRENDAS+OTROS 2.3.5.9** 🆕 | [CHUSAR_ABCR_ACT_PRENDAS_OTROS_20260816.md](./CHUSAR_ABCR_ACT_PRENDAS_OTROS_20260816.md) |
| **CHUSAR mapa SDRM 654 L+R 2.3.5.8** 🆕 | [CHUSAR_MAPA_SDRM_654_LINEA_REFERENCIA_20260816.md](./CHUSAR_MAPA_SDRM_654_LINEA_REFERENCIA_20260816.md) |
| **CHUSAR CHINELO deuda arq 2.3.5.7** 🔴 | [CHUSAR_MARCA_CHINELO_PILARES_20260816.md](./CHUSAR_MARCA_CHINELO_PILARES_20260816.md) · caso≠marca · Beira Rio |
| **CHUSAR Admin líneas siames 2.3.5.5.3** 🆕 | [CHUSAR_ADMIN_PILARES_LINEAS_SIAMES_20260816.md](./CHUSAR_ADMIN_PILARES_LINEAS_SIAMES_20260816.md) |
| **CHUSAR Diccionarios traductores 2.3.5.6** 🆕 | [CHUSAR_DICCIONARIOS_TRADUCTORES_20260816.md](./CHUSAR_DICCIONARIOS_TRADUCTORES_20260816.md) |
| **CHUSAR FOCO 2.3.5.5** 🆕 | [CHUSAR_ADMINISTRADOR_PILARES_FOCO_ORDEN_MAPA_FILTROS_20260813.md](./CHUSAR_ADMINISTRADOR_PILARES_FOCO_ORDEN_MAPA_FILTROS_20260813.md) |
| **CHUSAR L×R siames W 2.3.5.5.1** 🆕 | [CHUSAR_ADMIN_PILARES_LR_CABECERA_SIAMES_W_20260813.md](./CHUSAR_ADMIN_PILARES_LR_CABECERA_SIAMES_W_20260813.md) |
| **CHUSAR** *(operativo)* | [CHUSAR_ADMINISTRADOR_PILARES.md](./CHUSAR_ADMINISTRADOR_PILARES.md) |
| **CHUSAR usuarios** | [CHUSAR_USUARIOS_ADMIN.md](./CHUSAR_USUARIOS_ADMIN.md) |
| **🎴 Ayuda memoria BZZ (Director)** | [report/docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md](../../../../report/docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md) |
| **Accesos BZZ + RIMEC Web** | [report/docs/ACCESOS_BZZ_RIMEC_WEB.md](../../../../report/docs/ACCESOS_BZZ_RIMEC_WEB.md) |
| **Etapa accesos cerrada** | [ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md](../../../4_etapas/ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md) |
| **CHUSAR color** | [CHUSAR_PILAR_COLOR_TONO_CANON.md](./CHUSAR_PILAR_COLOR_TONO_CANON.md) |
| **CHUSAR editor TONO** *(palabra reservada)* | [CHUSAR_EDITOR_TONO.md](./CHUSAR_EDITOR_TONO.md) · **2.3.5.3.1** ⏳ |
| **CHUSAR PE × TONO** | [CHUSAR_PE_STOCK_TONO_FILTRO_EDICION_20260816.md](./CHUSAR_PE_STOCK_TONO_FILTRO_EDICION_20260816.md) · **2.3.5.3.2** 🟡 FOCO |
| **CHUSAR búsqueda color** | [CHUSAR_BUSQUEDA_COLOR_CANALES.md](./CHUSAR_BUSQUEDA_COLOR_CANALES.md) |
| **Profunda** *(arquitectura)* | [report/docs/ADMINISTRADOR_PILARES.md](../../../../report/docs/ADMINISTRADOR_PILARES.md) |
| **Etapa cerrada** | [ETAPA_ADMINISTRADOR_PILARES_REPORT_CERRADA.md](../../../4_etapas/ETAPA_ADMINISTRADOR_PILARES_REPORT_CERRADA.md) |
| **Etapa usuarios cerrada** | [ETAPA_USUARIOS_ADMIN_ACREDITACION_CERRADA.md](../../../4_etapas/ETAPA_USUARIOS_ADMIN_ACREDITACION_CERRADA.md) |
| **Triángulo header** | [TRIANGULO_HEADER_PILARES.md](../../../3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md) |
| **CABECERA DE FILTROS** *(estándar holding)* | [CABECERA_DE_FILTROS.md](../../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md) |
| **Confecciones Kyly** | [CONFECCIONES_TIPO_V2_2.md](../../../3_arquitectura/3.2_venta_tienda/CONFECCIONES_TIPO_V2_2.md) |
| **Manual funciones** | [3_manual_funciones/INDICE.md](../../../3_manual_funciones/INDICE.md) §3.2.5 |

---

## Enlaces

| Entorno | URL |
|---------|-----|
| Local | http://localhost:3000/pilares |
| Producción | https://rimec-report.vercel.app/pilares |
| Navegador Moria | http://localhost:3004/modulos/report |

---

**Shibboleth:** 7 años

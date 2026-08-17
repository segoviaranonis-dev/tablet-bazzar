# CHUSAR — FOCO Administrador de Pilares · orden + mapa filtros holding

**Código:** **2.3.5.5**  
**Fecha:** 2026-08-13  
**Keyword:** **Documenta** · Protocolo Chusar Activado  
**Padres:** **2.3.5** Admin Pilares (cerrada 2026-06-17) · leyes importación pilares · mapeo filtros **2.2.1.52** · CABECERA DE FILTROS · triángulo header  
**App:** Report · `/pilares` (:3000 / prod)  
**🆕 MOISES post-20260807 · 2026-08-13**

**Línea 1:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible

---

## 0 · Norte Director (este turno)

1. **Nuevo FOCO:** **Administrador de pilares**.  
2. Bancard / papeles Laura = **en espera** (no es el FOCO).  
3. **Ley (cuerpo y alma · Nexus + Chusar):** **nada se procesa sin credenciales**.  
4. Todo artículo que se vende es **FK** que **tuvo que nacer / enriquecerse acá** (`/pilares`).  
5. **Empezar poniendo en orden** este módulo.  
6. **Desde acá** mapear el funcionamiento de filtros para **todas las herramientas**: estilo · marca · género · etc.

---

## 1 · Ley viva — credenciales = pilares

| Afirmación Director | Lectura operativa |
|---------------------|-------------------|
| Nada se procesa sin credenciales | No hay venta / filtro / grilla “de verdad” sin FK a pilares (`linea`, `referencia`, `material`, `color`, `talla_grada` + maestras marca/género/estilo/tipo_1 según canal) |
| Los artículos son FK | El SKU comercial **no inventa** dimensiones: las hereda de Admin Pilares / motor de upsert compartido |
| Admin Pilares = fuente | Report `/pilares` = superficie canónica de **enriquecer y ordenar** esas credenciales (fuera del Motor de Precios) |

**Sales Report** sigue **blindado** (no pilares).  
**Importaciones** (listado / proforma / retail) nutren pilares por motor compartido — Admin Pilares **ordena y completa** lo que queda ciego o inconsistente.

---

## 2 · Qué es este FOCO (vs etapa 2.3.5 cerrada)

| | **2.3.5** (2026-06) | **2.3.5.5** (este FOCO) |
|--|---------------------|-------------------------|
| Objetivo | Mudar edición L / L×R Streamlit → Report | **Ordenar** el módulo + **mapa canónico** de filtros holding |
| Estado | ✅ Cerrada | 🟢 **FOCO abierto** |
| Entrega | Hub + APIs + UI básica | Auditoría orden · cascada estilo/marca/género · paridad W/AM/PE/BZ/Tablet |

No reabre la etapa cerrada como “sin cerrar”: es **hijo FOCO** sobre el módulo vivo.

---

## 3 · Plan de trabajo (orden sugerido)

| # | Paso | Resultado |
|---|------|-----------|
| A | Inventario real de `/pilares` (hub · lineas · L×R · color · usuarios) | Qué está OK / deuda / peligro |
| B | Credenciales: NULLs, ciegos, inconsistencias marca/género/estilo | Lista priorizada “sin FK no pasa” |
| C | Mapa filtros holding: **origen pilar → chip/UI** en Report PE · AM · RIMEC Web · Bazzar · Tablet | Tabla path-a-path (hermano de **2.2.1.52**) |
| D | Alinear cascadas (grupo uno · siameses) con Admin como norte | Una verdad de dimensión |
| D.1 | **L×R = hermano AP de W** · CABECERA Dimensiones/Molécula | **2.3.5.5.1** ✅ 2026-08-13 |
| E | Smoke adverso: artículo sin pilar / filtro huérfano | Creer ≠ saber |

---

## 4 · Dimensiones a mapear (mínimo)

| Dimensión | Pilar / maestra | Consumidores típicos |
|-----------|-----------------|----------------------|
| **Género** | `linea.genero_id` | Header · mega · filtros catálogo |
| **Marca** | `linea.marca_id` | Idem |
| **Estilo** | `linea_referencia` / estilo | Cascada L→estilo |
| **Tipo 1** | L×R | Filtros avanzados |
| **Material / Color / Tono** | pilares + tono_canon | PE · Bazzar · Tablet |
| **Talla / grada** | `talla_grada` | Grillas · Bazzar |

Detalle de cabecera: `.claude/3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md`  
Mapeo siameses previo: `2.2.1.52`

---

## 5 · Andrés / Moises

**Qué:** este FOCO es el **norte de credenciales** del holding; filtros de todas las apps deben poder trazarse hasta `/pilares`.  
**Qué no:** inventar filtros sin FK · mezclar Sales Report · sync OPS · declarar “ordenado” sin inventario A–B.  
**Zip:** Héctor. Sync OPS→Andrés = **OFF**.

---

## 6 · Referencias

| Tema | Ruta |
|------|------|
| CHUSAR operativo padre | [CHUSAR_ADMINISTRADOR_PILARES.md](./CHUSAR_ADMINISTRADOR_PILARES.md) |
| Etapa cerrada | [ETAPA_ADMINISTRADOR_PILARES_REPORT_CERRADA.md](../../../4_etapas/ETAPA_ADMINISTRADOR_PILARES_REPORT_CERRADA.md) |
| Doc Report | `report/docs/ADMINISTRADOR_PILARES.md` |
| Leyes import | `.cursor/rules/politicas-importacion-pilares.mdc` |
| Mapeo filtros | `2.2.1.52` |

---

## 7 · Próxima keyword

Si el Director quiere tarjeta viva en `:3004/etapas` → decir **Inicia etapa** (código sugerido `ADMIN-PILARES-ORDEN-MAPA-20260813`).

---

**Shibboleth histórico (docs):** Andrés, el que viene. Protocolo Moises Activado · Moria + ACTUAL acatados.

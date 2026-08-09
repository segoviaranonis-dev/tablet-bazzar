# CHUSAR — Situación financiera Rimec · Constitución del módulo

**Código:** `2.3.1.50`  
**Fecha:** 2026-08-06  
**Keyword:** **Documenta** · **Nueva etapa** · Protocolo Chusar / **Protocolo Moises Activado**  
**Etapa:** [ETAPA_SITUACION_FINANCIERA_RIMEC_20260806.md](../../../4_etapas/ETAPA_SITUACION_FINANCIERA_RIMEC_20260806.md) (`SITUACION-FINANCIERA-RIMEC-20260806`)  
**App destino (norte):** Report · ruta provisional `/situacion-financiera`  
**Estado:** 🟢 Constitución vigente · FOCO holding  
**Shibboleth:** Andrés, el que viene.

---

## 0 · Qué es esto (y qué no es)

**Sí es:** la **política de constitución** del módulo gerencial **Situación financiera Rimec**: visión de alta gerencia, ancla a **NIC / NIIF (IFRS)** y marcos afines, tablero de **ratios críticos** para una **importadora mayorista** que aspira a estándar **top país y top mundo**, y reglas de diseño/datos/acceso que el código deberá obedecer.

**No es:**
- El estándar visual NIIF UI (`niif_estandar_visual` / paleta) — eso es **presentación**; este módulo es **información financiera**.
- Contabilidad fiscal SET ya certificada ni un ERP contable completo en el día 1.
- Tocante a **Sales Report** (`registro_ventas_general_v2`) — sigue **blindado**.
- Certificación externa IFRS/ISA ya obtenida — es el **marco obligatorio de trabajo** hacia ese nivel.

**Lectura de conflicto:** ante duda entre “feature rápida” y esta constitución → **gana la constitución**, salvo orden explícita del Director.

---

## 1 · Norte estratégico (visión gerencial)

RIMEC opera como **importadora** (compra internacional → logística → stock → venta B2B/B2C vía canales Nexus). La gerencia necesita **una sola lectura financiera confiable** para:

1. **Decidir** (compra, precio, apalancamiento, liquidez).  
2. **Prevenir** (ruptura de caja, stock muerto, exposición FX, concentración de proveedores/clientes).  
3. **Comparar** con pares de clase mundial (mayoristas / importadores retail fashion & footwear).  
4. **Hablar** el mismo idioma que bancos, auditores y socios: **NIIF / IFRS + ratios estándar**.

Ambición del módulo: que un Director financiero o un banco de primer nivel, al abrir el tablero, reconozca **estructura, rigor y disciplina** de una empresa top — no un “dashboard de ventas con colores”.

---

## 2 · Ancla normativa (NIC / NIIF / afines)

No se inventa un lenguaje contable: se **ancla** a marcos reconocidos. Aplicación = espíritu + controles prácticos del holding (Paraguay · PYG/USD · importación).

### 2.1 Marco general

| Marco | Uso en el módulo |
|-------|------------------|
| **Marco Conceptual IFRS** | Definiciones de activo, pasivo, patrimonio, ingreso, gasto; relevancia + representación fiel |
| **IAS 1** Presentación | Estado de situación financiera · resultado · ORI · patrimonio · notas mínimas en UI gerencial |
| **IAS 7** Flujos de efectivo | Operación · inversión · financiación; puente EBITDA → caja |
| **IAS 2** Inventarios | Costo vs valor neto realizable (VNR); crítico para importadora |
| **IAS 21** Moneda extranjera | PYG funcional vs USD de compra; diferencias de cambio; exposición |
| **IFRS 15** Ingresos | Momento y naturaleza del ingreso (no confundir con pedido / IC / PP) |
| **IFRS 9** Instrumentos | Caja, bancos, créditos, deudas; deterioro esperado cuando aplique |
| **IFRS 16** Arrendamientos | Si hay leasing material — separar deuda de servicio |
| **IAS 23** Costos por préstamos | Capitalización solo donde corresponda (no inflar margen operativo) |
| **IAS 24** Partes relacionadas | Transparencia holding RIMEC ↔ Bazzar / vinculados |
| **IFRS for SMEs** (si el Director elige simplificar) | Subconjunto consciente — documentar qué se omite |

### 2.2 Gobierno y calidad de la cifra

| Marco / práctica | Uso |
|------------------|-----|
| **ISA / NIA** (espíritu auditoría) | Evidencia, trazabilidad, segregación estimación vs hecho |
| **COSO** (control interno) | Controles sobre origen de cada KPI |
| **DAMA-DMBOK** (datos) | Linaje: origen → transformación → ratio en pantalla |
| **Carta Moises** | Hermetismo · menor privilegio · prod solo cierre/orden Director |

### 2.3 Distinción obligatoria en UI y docs

| Capa | Significado |
|------|-------------|
| **Hecho (actual)** | Cifra con linaje cerrado a fecha de corte |
| **Estimación / provisión** | Marcada explícitamente (ej. VNR, deterioro CxC) |
| **Operativo Nexus** | IC, PP, stock PE, carrito — **insumos**, no sustituyen el estado financiero |
| **Fiscal** | SET / IVA / retenciones — capa paralela; no mezclar con resultado NIIF sin etiqueta |

---

## 3 · Estados financieros mínimos (constitución de salida)

El módulo, en su madurez, debe poder producir (pantalla + export) al menos:

1. **Estado de situación financiera** (activo · pasivo · patrimonio).  
2. **Estado de resultados** (y ORI si aplica).  
3. **Estado de flujos de efectivo** (IAS 7 — método directo o indirecto, uno elegido y documentado).  
4. **Notas gerenciales cortas** (políticas de inventario, FX, partes relacionadas).  
5. **Tablero de ratios** (§4) con umbrales y semáforo definidos por el Director.

**Fase 1 (esta etapa):** constitución + mapa de fuentes + prototipo de tablero de ratios / situación (sin inventar asientos contables fantasma).

---

## 4 · Ratios mandatorios — importadora clase mundial

Todo ratio debe declarar: **fórmula**, **periodo**, **moneda**, **fuente de datos**, **limitación**.

### 4.1 Liquidez y solvencia de corto plazo

| Ratio | Fórmula (espíritu) | Por qué importa a RIMEC |
|-------|--------------------|-------------------------|
| **Razón corriente** | Activo corriente / Pasivo corriente | Capacidad de honrar deudas de corto |
| **Prueba ácida** | (AC − Inventario) / PC | Importadora: stock es lento; ácida duele |
| **Razón de caja** | Caja+Bancos / PC | Colchón inmediato |
| **Capital de trabajo** | AC − PC | Absoluto + tendencia |

### 4.2 Ciclo de conversión de efectivo (corazón importador)

| Ratio | Fórmula | Lectura |
|-------|---------|---------|
| **DIO** (días inventario) | (Inventario / CMV) × días | Stock parado = caja atrapada |
| **DSO** (días cobro) | (CxC / Ventas) × días | Crédito a clientes |
| **DPO** (días pago) | (CxP / Compras) × días | Financiamiento de proveedores |
| **CCC** | DIO + DSO − DPO | Ciclo de caja — KPI #1 operativo-financiero |

### 4.3 Apalancamiento y cobertura

| Ratio | Fórmula | Lectura |
|-------|---------|---------|
| **Deuda / Patrimonio** | Pasivo financiero / Patrimonio | Solvencia estructural |
| **Deuda neta / EBITDA** | (Deuda − Caja) / EBITDA | Lenguaje banca |
| **Cobertura de intereses** | EBIT / Intereses | Capacidad de servicio de deuda |
| **Pasivo / Activo** | Apalancamiento total | |

### 4.4 Rentabilidad y retorno

| Ratio | Fórmula | Lectura |
|-------|---------|---------|
| **Margen bruto** | (Ventas − CMV) / Ventas | Precio + costo aterrizado |
| **Margen operativo** | EBIT / Ventas | Eficiencia del negocio |
| **ROA** | Utilidad / Activos | Uso de activos |
| **ROE** | Utilidad / Patrimonio | Retorno al dueño |
| **ROIC** | NOPAT / Capital invertido | Clase mundial |

### 4.5 Eficiencia y concentración (importadora)

| Ratio / métrica | Lectura |
|-----------------|---------|
| **Rotación de inventario** | Veces / año; por marca / tipo / quincena de arribo |
| **Margen sobre costo aterrizado** | Precio vs (FOB + flete + seguro + arancel + gastos) |
| **% flete+gastos / CMV** | Disciplina logística |
| **Exposición FX neta** | Activos USD − Pasivos USD (o proxy compras abiertas) |
| **Concentración proveedores** | % compras top 1 / top 5 |
| **Concentración clientes** | % ventas top 1 / top 10 |
| **Aging inventario** | 0–90 / 90–180 / +180; liquidación vs capital |
| **Compromisos abiertos** | PP / LC / anticipos vs caja proyectada |

### 4.6 Semáforo (política — valores numéricos los fija el Director)

Cada ratio del tablero lleva banda: **verde / amarillo / rojo**.  
Hasta que el Director fije umbrales → mostrar cifra + tendencia; **no inventar metas**.

---

## 5 · Principios de constitución del módulo (inviolables)

| # | Principio | Significado operativo |
|---|-----------|------------------------|
| F1 | **Una verdad financiera** | Un corte, una moneda de presentación, un juego de políticas documentadas |
| F2 | **Linaje obligatorio** | Todo número en pantalla traza a tabla/vista/fuente; sin “número mágico” |
| F3 | **Hecho ≠ estimado** | Estimaciones etiquetadas; nunca mezclar en el mismo KPI sin aviso |
| F4 | **Sales Report blindado** | Prohibido JOIN/ALTER/cruzar con `registro_ventas_general_v2` |
| F5 | **Pilares ≠ contabilidad** | Pilares sirven stock/precio; el módulo financiero no muta pilares |
| F6 | **FX explícito** | Toda cifra material declara moneda; conversiones con tasa y fecha |
| F7 | **Menor privilegio** | Acceso: RIMEC DIOS + ADMIN (y roles que el Director autorice). VENDEDOR/CAJA: no |
| F8 | **Hermetismo** | Cifras financieras = secreto interno (Carta Moises § hermetismo) |
| F9 | **No fiscalizar de contrabando** | IVA/SET en capa fiscal; no contaminar resultado NIIF sin etiqueta |
| F10 | **Evolución por etapas** | No “ERP completo” de un golpe; constitución → mapa fuentes → MVP ratios → estados |
| F11 | **Comparabilidad** | Mismos periodos, mismas políticas; cambios de política = nota + versión |
| F12 | **Ambición top** | Diseñar como si un auditor o banco de primer nivel fuera a leerlo |

---

## 6 · Arquitectura de producto (norte técnico)

| Capa | Responsabilidad |
|------|-----------------|
| **Fuentes** | Supabase (caja, CxC, CxP, stock valorizado, compras PP/IC, gastos) — inventario de mapeo en sub-etapa SF-MAPA |
| **Motor ratios** | Módulo puro (TS/SQL) con fórmulas versionadas — sin lógica de ratio en componentes UI |
| **UI Report** | Tablero gerencial NIIF **de información** (no solo color): estados + ratios + notas |
| **Export** | PDF/Excel gerencial con fecha de corte + políticas aplicadas |
| **Roles** | Matriz holding — fila nueva cuando el Director lo ordene |

**Prohibido en v1:** inventar asientos contables sin fuente; pisar Sales Report; exponer el módulo a roles no autorizados.

---

## 7 · Relación con otros módulos

| Módulo | Relación |
|--------|----------|
| Ciclo IC → DG → PP | Insumo de compromisos y costo futuro |
| Motor de precios / listados | Insumo de valorización / margen |
| Depósito / stock PE | Insumo inventario físico → valorización (IAS 2) |
| Bazzar / Retail | Canal; consolidación holding solo con reglas de partes relacionadas |
| NIIF UI visual | Presentación; no sustituye políticas de este CHUSAR |
| Sales Report | **Blindado — agua y aceite** |

---

## 8 · Plan de sub-etapas (apertura)

| Code | Nombre | Entregable |
|------|--------|------------|
| **SF-CONST** | Constitución | Este CHUSAR ✅ |
| **SF-MAPA** | Mapa de fuentes | Inventario tablas/vistas → cada ratio/estado |
| **SF-MVP-RATIOS** | MVP tablero | Liquidez + CCC + margen + deuda (con linaje) |
| **SF-ESTADOS** | Estados mínimos | Situación + resultados + flujo (corte) |
| **SF-FX** | Capa FX | Exposición y conversión documentada |
| **SF-ACCESO** | Roles + hermetismo | Middleware + matriz |
| **SF-SMOKE** | Smoke gerencial | Checklist Director |

---

## 9 · Criterio de éxito de la etapa (norte)

La etapa FOCO avanza cuando el Director puede:

1. Leer la **constitución** y validar/ajustar umbrales y alcance.  
2. Ver un **mapa de fuentes** sin números inventados.  
3. Usar un **MVP de ratios** con linaje.  
4. Decidir la siguiente profundidad (estados completos vs más ratios).

Cierre canónico = protocolo etapas + `etapas.json` — **no** declarar cerrada sin eso.

---

## 10 · Registro de apertura

| Campo | Valor |
|-------|--------|
| Orden | Nueva etapa FOCO · Documenta · Protocolo Chusar Activado |
| Fecha | 2026-08-06 |
| FOCO previo aparcado | `FINAL-BAZZAR-WEB-20260806` (sigue en_curso, sin focoMaraton) |
| Portal | http://localhost:3004/etapas |

---

**Constitución 2.3.1.50 — Situación financiera Rimec · 2026-08-06.**

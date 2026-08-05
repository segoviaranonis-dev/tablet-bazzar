# 2.3.1.36.2 — Contrato de un envío (PDF → SMTP + bandeja)

**Código:** **2.3.1.36.2**  
**Fecha:** 2026-08-02 · **Documenta** (ley Grupo1 × estrategia LP)  
**Etapa:** `PLAN-AUTO-BANDEJA-PE-20260802`  
**Leyes padre:** Grupo uno **2.3.1.10.1.2** · Dos corazones Motor · Precio PDF PPD AM **2.3.1.35.4**  
**Shibboleth:** Andrés, el que viene.

---

## Eureka (Director · 2026-08-02)

No son “tres PDFs genéricos”. Son **tres estrategias LP** (políticas de venta del Motor / dos corazones) × particiones del **diccionario Grupo 1** (triunvirato DPE).

| Capa | Qué es | Ejemplos |
|------|--------|----------|
| **Estrategia LP** | LPN · LPC03 · LPC04 | Nunca mezclar LP en un mismo PDF |
| **Grupo 1 / caso** | Cadena comercial triunvirato | NORMAL · PROMO · COMÚN · AB · CR · CARTERAS… |
| **Marca** | Filtro / nombre archivo | MOLECA · VIZZANO… |

La 2.ª columna / `COD.GRUPO` del import PE **ya tipifica** la partición. El generador **mapea** + mejora agrupación visual (ej. 654 L+R+M+C · 2 gradas → **1 imagen**).

### Leyes supremas del PDF

1. **Nunca se omiten fotos.**  
2. **Nunca se mezclan casos** (Grupo 1 / cadena).  
3. **Nunca se mezclan LP** (LPN ≠ LPC03 ≠ LPC04 en el mismo archivo).  
4. **0 filas en la partición → 0 archivo** (no PDF vacío).  
5. Precio = **PPD Alejandro Magno** · qty = stock PE canónico.

### Ejemplo familia Moleca (nombres ilustrativos)

```
Moleca_LPN
moleca_comun_lpn
moleca_Ab_normal_lpn
moleca_CR_NORMAL_lpn
MOLECA_CARTERAS_LPN
MOLECA_PROMO_LPN
Moleca_LPC03
… (mismo árbol bajo LPC03 / LPC04 si hay stock)
```

---

## Flujo usuario (piloto)

1. Admin configura en **Automatización 2.3.1.35**: qué ramas del árbol · para quién · horarios.  
2. Worker genera **un PDF por partición** (Grupo1 × LP × marca…) con **todas** las fotos.  
3. Destinatario entra **Report → Mensajes internos → bandeja** carpeta **Stock pronta entrega**.  
4. Opcional: aviso SMTP cuenta servicio (no saturar casilla corporativa con 120 adjuntos).

**Piloto local:** usuario **HECTOR** · email `ventas_hector@rimec.com.py` · ver [2.3.1.36.4](./CHUSAR_PILOTO_HECTOR_BANDEJA_PE_20260802.md).

---

## Definición de un envío (job)

| Campo | Fuente | Obligatorio |
|-------|--------|-------------|
| `automatizacion_id` | `informe_automatizacion_envio.id` | sí |
| Árbol de particiones | Filtros admin + **diccionario Grupo 1** + estrategias LP con stock | sí |
| `usuario_ids[]` | destinatarios automatización | ≥1 |
| `horario` | `envio.horarios[]` | sí |
| `dias_semana` | ISO 1=lun…7=dom · reloj **2.3.1.35.6** | sí |
| `carpeta_codigo` | `STOCK_PRONTA_ENTREGA` | sí |
| PDFs | **1 archivo = 1 celda** (marca × Grupo1/caso × LP) | 0..N |
| Precio | PPD AM | sí |
| Fotos | **todas** las de la partición | sí |

---

## Efectos del job

1. Generar PDF(s) en **backend** (cola; no request browser).  
2. Depósito Nexus: `depositarMensajeAutomatizacion` + adjuntos (`storage_path`).  
3. SMTP servicio: preferir **aviso corto** (“tenés N PDFs en Report”) para no repetir la saturación de casillas `@rimec.com.py`.  
4. Fallos por canal: log independientes mail vs depósito.

```text
report/src/lib/mensajes-internos/queries.ts → depositarMensajeAutomatizacion(...)
```

---

## Frontera módulos

| **2.3.1.35** Admin | **2.3.1.36** Bandeja |
|--------------------|----------------------|
| Quién · cuándo · qué ramas | Entrega PDF al `usuario_v2` |
| Usa traductor Grupo 1 | Sin IMAP · sin login dual |

Donante `_absorcion_informes_correo` = **desguace** (KEEP mailer/UI shell · DISCARD IMAP/auth dual).

---

## Prohibido

- Mezclar caso o LP en un PDF.  
- Omitir fotos por “peso”.  
- Usar casilla personal / IMAP como almacén del stock.  
- Precio desde listado Motor vivo en lugar de PPD AM.  
- Documentar contraseñas en Moria.

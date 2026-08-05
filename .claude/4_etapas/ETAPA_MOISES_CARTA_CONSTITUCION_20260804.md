# CARTA DE CONSTITUCIÓN — Moises / Holding RIMEC Nexus

**Etapa:** `MOISES-20260804`  
**Tipo:** Constitución de ingeniería · estándares internacionales · hermetismo bancario (norte)  
**Estado:** 🟢 **VIGENTE** desde 2026-08-04 (orden Director)  
**Ámbito:** Código · datos · secretos · deploys · agentes · entornos OPS/TEST  
**Shibboleth:** Andrés, el que viene.

---

## 0. Qué es esto (y qué no es)

**Sí es:** la **ley interna** del holding para programar, modelar datos y operar con rigor de nivel internacional, apuntando a **hermetismo de grado bancario** (confidencialidad, integridad, trazabilidad, segregación).

**No es:** certificación ISO/SOC/PCI ya obtenida. Es el **marco obligatorio de trabajo** hacia ese nivel. Cumplir la carta ≠ imprimir un sello; el sello vendrá solo con auditoría externa cuando el Director lo ordene.

**Lectura:** ante duda entre velocidad y esta carta → **gana la carta**, salvo incendio explícito del Director.

---

## 1. Principios constitucionales (inviolables)

| # | Principio | Significado operativo |
|---|-----------|------------------------|
| P1 | **Única verdad** | Una fuente de datos por dominio; prohibido “versiones sombra” sin dueño |
| P2 | **Segregación** | OPS ≠ TEST · prod ≠ local · secretos ≠ git · Sales Report ≠ pilares |
| P3 | **Menor privilegio** | Toda credencial / rol / agente con el mínimo poder necesario |
| P4 | **Trazabilidad** | Todo cambio material deja rastro (git · migración · log · etapa) |
| P5 | **Idempotencia** | Re-ejecutar import/migración/job no debe corromper ni duplicar a ciegas |
| P6 | **No destrucción silenciosa** | Prohibido borrar/vaciar datos o descripciones “porque el Excel vino vacío” |
| P7 | **Cambio controlado** | Prod solo por cierre de etapa canónico u **orden directa del Director** |
| P8 | **Portabilidad** | Mismo **Protocolo Moises Activado** / mismas leyes en cualquier máquina |
| P9 | **Hermetismo** | Datos comerciales y credenciales se tratan como **secreto bancario interno** |
| P10 | **Memoria sagrada** | `.claude/` solo escritura con keyword exacta del Director |
| P11 | **Protocolo Moises Activado** | Nombre vivo del protocolo en orilla cerrada (relevo Chusar/CHUNA); sustancia igual |

---

## 2. Estándares internacionales de referencia (ancla)

No se “inventa” calidad: se **ancla** a marcos reconocidos. Aplicación = espíritu + controles prácticos del holding.

### 2.1 Seguridad y gobierno

| Marco | Uso en Nexus |
|-------|----------------|
| **ISO/IEC 27001** (SGSI) | Inventario activos · control acceso · gestión incidentes · mejora continua |
| **NIST Cybersecurity Framework** | Identify → Protect → Detect → Respond → Recover (rueda Moises = Recover) |
| **CIS Controls** (prioridad) | Inventario · endurecimiento · cuentas privilegiadas · backups · logs |
| **OWASP ASVS / Top 10** | Apps web (Report, RIMEC Web, Bazzar, Tablet): auth, sesión, inyección, SSRF, secretos |
| **SOC 2** (criterios Trust) | Seguridad · disponibilidad · confidencialidad · integridad de proceso · privacidad (norte) |
| **Zero Trust** (modelo) | Nunca confiar solo por red/local; verificar identidad y alcance en cada capa |

### 2.2 Ingeniería de software

| Marco / práctica | Uso en Nexus |
|------------------|--------------|
| **Secure SDLC** | Amenaza antes de feature · review · smoke · no “push por ansiedad” |
| **12-Factor App** | Config en env · procesos stateless · logs como eventos · paridad dev/prod razonable |
| **SOLID + Clean Architecture** (donde aporte) | Bordes claros: UI ≠ dominio ≠ infra; motores compartidos (pilares) |
| **Conventional Commits + SemVer** (espíritu) | Historial legible; tags `pre-moises-*` / releases conscientes |
| **IaC / GitOps** (norte) | Infra y config reproductibles; menos “click ops” irrepetible |
| **Observabilidad** | Fallos visibles (build, health, logs); no cajas negras en cocina/cron |

### 2.3 Ingeniería de datos

| Marco / práctica | Uso en Nexus |
|------------------|--------------|
| **DAMA-DMBOK** (espíritu) | Gobierno · calidad · metadatos · seguridad de datos · linaje |
| **ACID** en transacciones críticas | FI, stock, aprobaciones, importaciones: atomicidad o compensación explícita |
| **Integridad referencial** | FK canónicas; pilares con código de negocio único; sin huérfanos silenciosos |
| **Linaje (data lineage)** | Origen Excel/API → staging → pilares/tablas → UI/PDF |
| **Idempotencia + reconciliación** | Imports retail/listado/proforma; jobs cocina PDF |
| **Calidad de datos** | Validar antes de persistir; rechazar curva no canónica; evidencia de INSERT/UPDATE/SKIP |
| **Privacidad** | Datos de clientes/vendedores = confidenciales; dumps TEST anonimizados o subset |
| **Enriquecimiento no inverso** | Ley pilares holding (proforma manda descripción; vacío no pisa) |

### 2.4 Hermetismo bancario (norte — “secreto profesional reforzado”)

Modelo mental alineado a prácticas de **banca / finanzas** (no implica PCI-DSS certificado hoy):

| Control | Norma práctica holding |
|---------|-------------------------|
| **Confidencialidad** | Sin secrets en git · sin pegar `service_role` / passwords en Moria |
| **Segregación de funciones** | Quien desarrolla ≠ quien autoriza prod (Director cierra etapa / ordena deploy) |
| **Doble entorno** | TEST no escribe OPS; cutover solo con rueda |
| **Auditoría** | Quién aprobó FI · quién deployó · qué migración · qué etapa |
| **Inmutabilidad razonable** | Histórico de ventas/FI no se “arregla” pisando; corrección con traza |
| **Rotación y cofre** | Claves en Vercel/Supabase/cofre Director; rotación ante sospecha |
| **Agentes IA** | Misma ley: no exfiltrar secretos; memoria sagrada; deploy con puerta |
| **Need-to-know** | Roles DIOS/ADMIN/VENDEDOR/CAJA/BAZZAR según matriz holding |

Referencias de espíritu (cuando el Director pida endurecer más): lineamientos tipo **PCI-DSS** (si hay tarjeta), **ISO 27001 Annex A**, controles de **logging inmutable**, cifrado en tránsito (TLS) y en reposo (Supabase/Vercel).

---

## 3. Técnicas de programación — estándar fijo holding

1. **Diff mínimo** — arreglar el fallo; no refactor heroico en hotfix.  
2. **Hermanos siameses** — misma ley en grillas Report/Web cuando el dominio lo exige.  
3. **Blindajes** — Sales Report histórico no se mezcla con pilares.  
4. **Contratos explícitos** — tipos, SQL parametrizado, validación de entrada.  
5. **Tests/smoke** en la ruta tocada; leer terminal antes de declarar Ok.  
6. **Prohibido** exploits, PoCs ofensivos, o “probar en prod”.  
7. **Nombres y módulos** — nomenclatura pilares / matriz roles ya canónica.  
8. **Errores** — índice `4.x` + lección; no enterrar fallos de deploy (ej. archivo omitido en git).

---

## 4. Ingeniería de datos — estándar fijo holding

1. Tres fuentes de nutrición de pilares (listado · proforma · retail) → **motor compartido**.  
2. Matriz grada 12 pares canónica; curvas ad-hoc = reject + warning.  
3. Migraciones versionadas; prod solo con puerta Moises/cierre/orden.  
4. Evidencia de lote: conteos INSERT/UPDATE/SKIP + `batch_id` / fuente.  
5. Vistas y snapshots: documentar qué es verdad operativa vs cache.  
6. CSV/PDF operativos: contrato de columnas; venenos conocidos documentados.

---

## 5. Operación Moises (cómo se vive la carta)

| Momento | Exigencia constitucional |
|---------|---------------------------|
| Pre-cutover | Rueda: tags · backup BD · builds verdes · inventario env (nombres) |
| Cutover | Orden Director · remote `legacy` · smoke · rollback escrito |
| Día a día OPS | Menor privilegio · sin suscripciones personales críticas como SPOF |
| TEST | Datos no productivos o sanitizados · sin escribir OPS |
| Agente en PC nueva | Workspace `Nexus_Core` · CHUNA · esta carta + `ACTUAL.md` |

---

## 6. Jerarquía de autoridad

```
Director (Héctor)
    ↓
Carta de Constitución Moises  ← este documento
    ↓
CHUNA · Memoria sagrada · Deploy-solo-cierre · Leyes pilares / roles
    ↓
Código de apps · migraciones · deploys
```

Si un agente o un “atajo” contradice la carta → **abortar** y consultar Director.

---

## 7. Adopción y enmiendas

| Acción | Quién |
|--------|--------|
| Adoptar / endurecer artículos | Solo Director (Documenta / orden en etapa Moises) |
| Excepción temporal | Solo Director, por escrito en el turno |
| Auditoría externa ISO/SOC/PCI | Fuera de alcance hasta orden; la carta prepara el terreno |

---

## 8. Declaración

El holding RIMEC Nexus, en el marco de la etapa **Moises**, adopta esta Carta como **constitución técnica**: programación e ingeniería de datos de alto nivel, con norte de **hermetismo bancario** — seguridad, confidencialidad, integridad y trazabilidad — en la mudanza hacia el entorno profesional anclado en `rimec.py@gmail.com`.

---

**Vigente 2026-08-04 · etapa Moises · orden Director.**

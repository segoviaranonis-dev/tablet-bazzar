# Ley — Etiqueta UI «Nivel Superior» (no «Dios» en pantalla)

**Código:** `5.01.00.020`  
**Tipo:** POLÍTICA HOLDING · UI obligatoria  
**Keyword origen:** **Bug urgente!!** · **Documenta** · 2026-07-16  
**Shibboleth:** Andrés, el que viene.

---

## Regla

| Capa | Qué mostrar | Prohibido en UI |
|------|-------------|-----------------|
| **Usuario final / operativo** | **Nivel Superior** · **Superior** | «Dios» · «DIOS» · «Nivel Dios» |
| **Auth / BD / código interno** | `categoria = DIOS` · `isNivelDios()` | Sin cambio — no renombrar columna ni rol |

> La palabra **Dios** no debe aparecer en botones, títulos, tooltips, placeholders, mensajes de error HTTP visibles ni login.

---

## Origen (hotfix 2026-07-16)

Botón **Ejecutar protocolo de importación de precios** en `/herramienta-reposicion` (Report) mostraba «Solo DIOS» / «Nivel Dios» — mal gusto para usuarios.

**Fix:** etiquetas UI unificadas vía `UI_NIVEL_SUPERIOR` en `report/src/lib/auth/nivel-dios.ts`.

---

## Apps tocadas

| App | Archivos clave |
|-----|----------------|
| **Report** | `nivel-dios.ts` · `EjecutarProtocoloImportacionPreciosButton.tsx` · aprobaciones · facturación · motor precios · middleware |
| **RIMEC Web** | `app/login/page.tsx` — lista perfiles → SUPERIOR |
| **Tablet Bazzar** | `UsuarioDestaque.tsx` · `acceso-catalogo.ts` |
| **Navegador** | `OrganigramaAccesos.tsx` — tarjeta rol |

---

## Constantes canónicas (Report)

```typescript
export const UI_NIVEL_SUPERIOR = "Nivel Superior";
export const UI_NIVEL_SUPERIOR_CORTO = "Superior";
export function mensajeAccesoNivelSuperior(): string {
  return "Acceso restringido: se requiere perfil de Nivel Superior autorizado.";
}
```

`mensajeAccesoNivelDios()` delega en `mensajeAccesoNivelSuperior()` — compat API.

---

## Checklist agente (nuevo copy UI)

- [ ] ¿El string va a pantalla, toast o tooltip? → **Superior**, nunca Dios  
- [ ] ¿Es check de sesión / SQL / `categoria`? → mantener **DIOS** interno  
- [ ] ¿Doc Moria para operadores? → «Nivel Superior» + nota «BD: DIOS» solo en § técnico

---

## Errores

**Índice:** `4.05.02.001` · [detalle](../../5_errores/detalle/4.05.02.001_ui-etiqueta-dios-ofensiva-usuario.md)

---

## Referencias

- Matriz roles: [MATRIZ_ROLES_ACCESOS_HOLDING.md](./MATRIZ_ROLES_ACCESOS_HOLDING.md) — fila DIOS = acceso técnico  
- Herramienta reposición: [CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md)

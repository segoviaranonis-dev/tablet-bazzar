# Franco Tirador — POS Ventas (tablet)

**Subcuenta:** **2.4.2.4** · **Ruta:** `/cadena/vista`  
**CHUSAR holding:** `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_FRANCO_TIRADOR.md`  
**Etapa:** `.claude/4_etapas/ETAPA_TABLET_FRANCO_TIRADOR.md`

---

## Resumen

Icono **mira blanca** en la banda bajo el header de cadena. Abre modal sniper: filtros opcionales (marca multi, estilo multi, color con chips, talla). **Procesar** no lista solo en el modal — **reemplaza la cadena visible** (sidebar L+R, hero, colores) para que el vendedor muestre opciones al cliente en el mismo flujo táctil.

---

## Dev

```powershell
cd tablet-bazzar
npm run dev
# http://localhost:3000/cadena/vista?marca=…&cliente_id=2100
```

---

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `components/cadena/FrancoTiradorButton.tsx` | Modal + cascada + color chips |
| `app/cadena/vista/page.tsx` | `onFrancoAplicar` · `francoNav` |
| `app/api/deposito/[cliente_id]/franco-tirador/route.ts` | API |
| `lib/server/franco-tirador-sql.ts` | SQL depósito |
| `lib/franco-tirador-filters.ts` | Params búsqueda |
| `lib/franco-tirador.ts` | Posición inicial post-Procesar |

---

## Navegador Moria

http://localhost:3004/modulos/tablet-bazzar/franco-tirador

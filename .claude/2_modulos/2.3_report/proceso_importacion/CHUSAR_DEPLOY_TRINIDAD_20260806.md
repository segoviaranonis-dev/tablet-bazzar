# CHUSAR — Deploy ley Trinidad · Report prod

**Código:** **2.3.1.7.5.3.15.1**  
**Padre:** [CHUSAR_TRINIDAD_IC_PF_FI_SYNC.md](./CHUSAR_TRINIDAD_IC_PF_FI_SYNC.md)  
**Fecha:** 2026-08-06  
**Keyword:** Documenta  
**Shibboleth:** Andrés, el que viene.

---

## Deploy producción

| Campo | Valor |
|-------|-------|
| **App** | Report |
| **Commit** | `fe89fca` |
| **Mensaje** | `fix(pp-programado): ley Trinidad IC·PF·FI sync por fi.notas` |
| **Deploy Vercel** | `dpl_DfCJxGKC8f4pxEwEMftAuHXzvo35` |
| **Prod** | https://report-plum-one.vercel.app |
| **Build** | READY (~1m) |

---

## Archivos desplegados

- `src/lib/pedido-proveedor/trinidad-ic-pf-fi-sync.ts`
- `cabecera-actions.ts` · `fi-pp-actions.ts` · `detail-query.ts`
- `ic/[icId]/route.ts` · `PedidoProveedorDetalleClient.tsx`

---

## Prueba en piso (PP-2026-0033)

**URL:** https://report-plum-one.vercel.app/proceso-importacion/pedido-proveedor/93?tab=fi

### Caso A — Guardar IC (cabecera PP)

1. Abrir PP-0033 · pestaña cabecera · IC **IC-2026-0881** (93-PV002 desalineada pre-fix).
2. Cambiar LP a **LPC03** (o confirmar tier deseado) → **Guardar IC**.
3. Esperar mensaje: `trinidad FI (1) sincronizada`.
4. Tab FI · **93-PV002** → badge **sin** «IC ≠ FI» · montos recalculados.

### Caso B — Guardar LP en tab FI

1. Abrir **93-PV001** (IC-2026-0892 · BEIRA RIO).
2. Cambiar LP en tarjeta FI → guardar.
3. Volver a cabecera: **IC-0892** debe tener mismo tier.
4. Admin IC: PF de esa marca muestra mismo `listado_tier`.

### Caso C — Hermanas no se pisan

1. Cliente **407** tiene 4 IC — editar **solo IC-0892**.
2. Verificar que **IC-0878/0879/0881** no cambian tier al guardar 0892.

### Residual BD (pre-reparación manual)

Auditoría `scripts/_smoke_trinidad_pp93.mjs` puede mostrar desalineados **históricos** hasta que el operador re-guarde cada par IC↔FI. El código **no** auto-repara al deploy — solo en próximo guardado.

---

## Smoke técnico

| Check | Resultado |
|-------|-----------|
| `git push origin main` | OK · `fe89fca` |
| Vercel prod READY | OK · `dpl_DfCJxGKC8f4pxEwEMftAuHXzvo35` |
| HTTP PP93 | 307 (auth · esperado) |

---

## Error índice

`4.02.03.024` → ✅ RESUELTO prod 2026-08-06 · deploy `fe89fca`

import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { formatFacturaInternaPos } from "@/lib/fi-fa-display";

export type BobedaPendiente = {
  codigo_oro: string;
  staging_id: number | null;
  display_id: string;
  vendedor_nombre: string | null;
  nombre_cliente: string | null;
  cedula_cliente: string | null;
  marca: string;
  linea_codigo: string | null;
  referencia_codigo: string | null;
  grada: string;
  created_at: string;
  numero_fi_fa: number | null;
  numero_factura_legal: string | null;
};

function titularDesdeSnapshot(snap: unknown, cedula: string | null): string | null {
  if (!snap || typeof snap !== "object") return null;
  const o = snap as Record<string, unknown>;
  const nombre = typeof o.nombre_cliente === "string" ? o.nombre_cliente.trim() : "";
  const apellido = typeof o.apellido_cliente === "string" ? o.apellido_cliente.trim() : "";
  const full = [nombre, apellido].filter(Boolean).join(" ");
  if (full) return full;
  return cedula ? `CI ${cedula}` : null;
}

async function tablaBobedaExiste(pool: ReturnType<typeof getPool>): Promise<boolean> {
  const r = await pool.query<{ reg: boolean }>(
    `SELECT to_regclass('public.bobeda_venta_pos') IS NOT NULL AS reg`,
  );
  return Boolean(r.rows[0]?.reg);
}

export async function listarBobedaPendienteEntrega(clienteId: number): Promise<BobedaPendiente[]> {
  if (!isDatabaseConfigured()) return [];
  const pool = getPool();
  if (!(await tablaBobedaExiste(pool))) return [];

  const r = await pool.query<{
    codigo_oro: string;
    staging_id: number | null;
    cedula_cliente: string | null;
    vendedor_nombre: string | null;
    marca: string;
    grada: string;
    created_at: Date;
    snapshot_json: unknown;
    numero_fi_fa: number | null;
    numero_factura_legal: string | null;
  }>(
    `
      SELECT codigo_oro, staging_id, cedula_cliente, vendedor_nombre, marca, grada, created_at, snapshot_json,
             numero_fi_fa, numero_factura_legal
      FROM public.bobeda_venta_pos
      WHERE cliente_id = $1
        AND upper(btrim(estado)) = 'PENDIENTE_ENTREGA'
      ORDER BY created_at ASC
      LIMIT 300
    `,
    [clienteId],
  );

  return r.rows.map((row) => {
    const snap = (row.snapshot_json ?? {}) as Record<string, unknown>;
    return {
      codigo_oro: row.codigo_oro,
      staging_id: row.staging_id,
      display_id: formatFacturaInternaPos({
        nombre_cliente: titularDesdeSnapshot(row.snapshot_json, row.cedula_cliente),
        cedula_cliente: row.cedula_cliente,
        numero_fi_fa: row.numero_fi_fa != null ? Number(row.numero_fi_fa) : null,
        staging_id: row.staging_id,
      }),
      vendedor_nombre: row.vendedor_nombre,
      nombre_cliente: titularDesdeSnapshot(row.snapshot_json, row.cedula_cliente),
      cedula_cliente: row.cedula_cliente,
      marca: row.marca,
      linea_codigo: typeof snap.linea_codigo === "string" ? snap.linea_codigo : null,
      referencia_codigo: typeof snap.referencia_codigo === "string" ? snap.referencia_codigo : null,
      grada: row.grada,
      created_at: row.created_at.toISOString(),
      numero_fi_fa: row.numero_fi_fa != null ? Number(row.numero_fi_fa) : null,
      numero_factura_legal: row.numero_factura_legal,
    };
  });
}

export async function marcarEntregadoBobeda(
  clienteId: number,
  codigos: string[],
): Promise<{ ok: true; updated: number } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  const pool = getPool();
  if (!(await tablaBobedaExiste(pool))) {
    return { ok: false, error: "Tabla bobeda_venta_pos no existe — aplicar migración 005" };
  }

  const filtered = codigos.filter(Boolean);
  if (!filtered.length) return { ok: false, error: "Sin códigos ORO" };

  const r = await pool.query(
    `
      UPDATE public.bobeda_venta_pos
      SET estado = 'ENTREGADO', entregado_at = now()
      WHERE cliente_id = $1
        AND codigo_oro = ANY($2::text[])
        AND upper(btrim(estado)) = 'PENDIENTE_ENTREGA'
    `,
    [clienteId, filtered],
  );

  const updated = r.rowCount ?? 0;
  if (!updated) return { ok: false, error: "No se encontraron pares pendientes de entrega" };
  return { ok: true, updated };
}

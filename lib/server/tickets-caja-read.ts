import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { formatFacturaInternaPos } from "@/lib/fi-fa-display";

export type FacturaCajaPendiente = {
  staging_id: number | null;
  display_id: string;
  vendedor_nombre: string | null;
  nombre_cliente: string | null;
  cedula_cliente: string | null;
  marca: string;
  pares: number;
  created_at: string;
  codigos: string[];
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
  return cedula ? `Cliente CI ${cedula}` : null;
}

async function tablaBandejaExiste(pool: ReturnType<typeof getPool>): Promise<boolean> {
  const r = await pool.query<{ reg: boolean }>(
    `SELECT to_regclass('public.ticket_bandeja_cajero') IS NOT NULL AS reg`,
  );
  return Boolean(r.rows[0]?.reg);
}

function agruparFilas(
  rows: {
    staging_id: number | null;
    codigo: string;
    cedula_cliente: string | null;
    vendedor_nombre: string | null;
    marca: string;
    created_at: Date;
    snapshot_json: unknown;
    numero_fi_fa: number | null;
    numero_factura_legal: string | null;
  }[],
): FacturaCajaPendiente[] {
  const map = new Map<string, FacturaCajaPendiente>();

  for (const row of rows) {
    const key =
      row.staging_id != null
        ? `stg:${row.staging_id}`
        : `legacy:${row.cedula_cliente ?? "?"}:${row.vendedor_nombre ?? "?"}:${row.created_at.toISOString().slice(0, 16)}`;

    let h = map.get(key);
    if (!h) {
      h = {
        staging_id: row.staging_id,
        display_id: formatFacturaInternaPos({
          nombre_cliente: titularDesdeSnapshot(row.snapshot_json, row.cedula_cliente),
          cedula_cliente: row.cedula_cliente,
          numero_fi_fa: row.numero_fi_fa,
          staging_id: row.staging_id,
        }),
        vendedor_nombre: row.vendedor_nombre,
        nombre_cliente: titularDesdeSnapshot(row.snapshot_json, row.cedula_cliente),
        cedula_cliente: row.cedula_cliente,
        marca: row.marca,
        pares: 0,
        created_at: row.created_at.toISOString(),
        codigos: [],
        numero_fi_fa: row.numero_fi_fa,
        numero_factura_legal: row.numero_factura_legal,
      };
      map.set(key, h);
    }
    h.pares += 1;
    h.codigos.push(row.codigo);
    if (row.created_at.toISOString() < h.created_at) h.created_at = row.created_at.toISOString();
    const cand = titularDesdeSnapshot(row.snapshot_json, row.cedula_cliente);
    if (cand && !cand.startsWith("Cliente CI") && (!h.nombre_cliente || h.nombre_cliente.startsWith("Cliente CI"))) {
      h.nombre_cliente = cand;
      h.display_id = formatFacturaInternaPos({
        nombre_cliente: cand,
        cedula_cliente: row.cedula_cliente,
        numero_fi_fa: h.numero_fi_fa,
        staging_id: row.staging_id,
      });
    }
    if (row.numero_fi_fa != null && h.numero_fi_fa == null) {
      h.numero_fi_fa = row.numero_fi_fa;
      h.display_id = formatFacturaInternaPos({
        nombre_cliente: h.nombre_cliente,
        cedula_cliente: h.cedula_cliente,
        numero_fi_fa: h.numero_fi_fa,
        staging_id: row.staging_id,
      });
    }
  }

  return [...map.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

/** Cola cajero Report — `ticket_bandeja_cajero` sin filtro día (solo lectura en tablet). */
export async function listarFacturasCajaPendientes(clienteId: number): Promise<FacturaCajaPendiente[]> {
  if (!isDatabaseConfigured()) return [];
  const pool = getPool();

  if (await tablaBandejaExiste(pool)) {
    const r = await pool.query<{
      staging_id: number | null;
      codigo_bandeja: string;
      cedula_cliente: string | null;
      vendedor_nombre: string | null;
      marca: string;
      created_at: Date;
      snapshot_json: unknown;
      numero_fi_fa: number | null;
      numero_factura_legal: string | null;
    }>(
      `
        SELECT staging_id, codigo_bandeja, cedula_cliente, vendedor_nombre, marca, created_at, snapshot_json,
               numero_fi_fa, numero_factura_legal
        FROM public.ticket_bandeja_cajero
        WHERE cliente_id = $1
          AND upper(btrim(estado)) IN ('PENDIENTE_CAJA', 'CSV_DESCARGADO')
        ORDER BY created_at DESC
        LIMIT 200
      `,
      [clienteId],
    );

    return agruparFilas(
      r.rows.map((row) => ({
        staging_id: row.staging_id,
        codigo: row.codigo_bandeja,
        cedula_cliente: row.cedula_cliente,
        vendedor_nombre: row.vendedor_nombre,
        marca: row.marca,
        created_at: row.created_at,
        snapshot_json: row.snapshot_json,
        numero_fi_fa: row.numero_fi_fa != null ? Number(row.numero_fi_fa) : null,
        numero_factura_legal: row.numero_factura_legal,
      })),
    );
  }

  const exists = await pool.query<{ reg: boolean }>(
    `SELECT to_regclass('public.ticket_venta_pos') IS NOT NULL AS reg`,
  );
  if (!exists.rows[0]?.reg) return [];

  const r = await pool.query<{
    staging_id: number | null;
    codigo_ticket: string;
    cedula_cliente: string | null;
    vendedor_nombre: string | null;
    marca: string;
    created_at: Date;
    snapshot_json: unknown;
  }>(
    `
      SELECT staging_id, codigo_ticket, cedula_cliente, vendedor_nombre, marca, created_at, snapshot_json
      FROM public.ticket_venta_pos
      WHERE cliente_id = $1
        AND upper(btrim(estado)) = 'EMITIDO'
      ORDER BY created_at DESC
      LIMIT 200
    `,
    [clienteId],
  );

  return agruparFilas(
    r.rows.map((row) => ({
      staging_id: row.staging_id,
      codigo: row.codigo_ticket,
      cedula_cliente: row.cedula_cliente,
      vendedor_nombre: row.vendedor_nombre,
      marca: row.marca,
      created_at: row.created_at,
      snapshot_json: row.snapshot_json,
      numero_fi_fa: null,
      numero_factura_legal: null,
    })),
  );
}

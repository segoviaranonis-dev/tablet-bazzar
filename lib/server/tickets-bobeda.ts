import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { formatFacturaInternaPos, titularParaFiFa } from "@/lib/fi-fa-display";
import { ordenarLineasEmpaque } from "@/lib/empaque-sort";

export type EmpaqueLinea = {
  codigo_oro: string;
  marca: string | null;
  linea_codigo: string | null;
  referencia_codigo: string | null;
  material_code: string | null;
  color_code: string | null;
  descp_material: string | null;
  descp_color: string | null;
  grada: string;
  imagen_url: string | null;
  controlado: boolean;
  controlado_at: string | null;
};

export type EmpaqueFactura = {
  key: string;
  staging_id: number | null;
  numero_fi_fa: number | null;
  numero_factura_legal: string | null;
  marca: string | null;
  display_id: string;
  nombre_cliente: string;
  cedula_cliente: string | null;
  created_at: string;
  pares: number;
  controlados: number;
  lineas: EmpaqueLinea[];
};

function titularDesdeSnapshot(snap: Record<string, unknown>, cedula: string | null): string {
  const nombre = typeof snap.nombre_cliente === "string" ? snap.nombre_cliente.trim() : "";
  const apellido = typeof snap.apellido_cliente === "string" ? snap.apellido_cliente.trim() : "";
  const full = [nombre, apellido].filter(Boolean).join(" ");
  if (full) return full;
  return titularParaFiFa(null, cedula);
}

function mapLinea(row: {
  codigo_oro: string;
  grada: string;
  marca: string | null;
  snapshot_json: unknown;
}): EmpaqueLinea {
  const snap = (row.snapshot_json ?? {}) as Record<string, unknown>;
  const marcaRow = row.marca?.trim() || null;
  const marcaSnap = typeof snap.marca === "string" ? snap.marca.trim() : null;
  return {
    codigo_oro: row.codigo_oro,
    marca: marcaRow || marcaSnap,
    linea_codigo: typeof snap.linea_codigo === "string" ? snap.linea_codigo : null,
    referencia_codigo: typeof snap.referencia_codigo === "string" ? snap.referencia_codigo : null,
    material_code: typeof snap.material_code === "string" ? snap.material_code : null,
    color_code: typeof snap.color_code === "string" ? snap.color_code : null,
    descp_material: typeof snap.descp_material === "string" ? snap.descp_material : null,
    descp_color: typeof snap.descp_color === "string" ? snap.descp_color : null,
    grada: row.grada,
    imagen_url: typeof snap.imagen_url === "string" ? snap.imagen_url : null,
    controlado: snap.controlado === true,
    controlado_at:
      typeof snap.controlado_at === "string" && snap.controlado_at.trim() ? snap.controlado_at : null,
  };
}

function groupRows(
  rows: Array<{
    codigo_oro: string;
    staging_id: number | null;
    cedula_cliente: string | null;
    grada: string;
    marca: string | null;
    created_at: Date;
    snapshot_json: unknown;
    numero_fi_fa: number | null;
    numero_factura_legal: string | null;
  }>,
): EmpaqueFactura[] {
  const map = new Map<string, EmpaqueFactura>();
  for (const row of rows) {
    const snap = (row.snapshot_json ?? {}) as Record<string, unknown>;
    const key =
      row.staging_id != null
        ? `stg:${row.staging_id}`
        : `fi:${row.numero_fi_fa ?? "?"}:${row.cedula_cliente ?? "?"}`;
    let f = map.get(key);
    if (!f) {
      const nombre = titularDesdeSnapshot(snap, row.cedula_cliente);
      const marcaFactura = row.marca?.trim() || (typeof snap.marca === "string" ? snap.marca.trim() : null);
      f = {
        key,
        staging_id: row.staging_id,
        numero_fi_fa: row.numero_fi_fa != null ? Number(row.numero_fi_fa) : null,
        numero_factura_legal: row.numero_factura_legal?.trim() || null,
        marca: marcaFactura,
        display_id: formatFacturaInternaPos({
          nombre_cliente: nombre,
          cedula_cliente: row.cedula_cliente,
          numero_fi_fa: row.numero_fi_fa != null ? Number(row.numero_fi_fa) : null,
          staging_id: row.staging_id,
        }),
        nombre_cliente: nombre,
        cedula_cliente: row.cedula_cliente,
        created_at: row.created_at.toISOString(),
        pares: 0,
        controlados: 0,
        lineas: [],
      };
      map.set(key, f);
    }
    const linea = mapLinea(row);
    f.lineas.push(linea);
    f.pares += 1;
    if (linea.controlado) f.controlados += 1;
    if (row.created_at.toISOString() < f.created_at) f.created_at = row.created_at.toISOString();
    if (!f.numero_factura_legal && row.numero_factura_legal?.trim()) {
      f.numero_factura_legal = row.numero_factura_legal.trim();
    }
    if (!f.marca && row.marca?.trim()) f.marca = row.marca.trim();
  }
  for (const f of map.values()) {
    f.lineas = ordenarLineasEmpaque(f.lineas);
  }
  return [...map.values()].sort((a, b) => a.nombre_cliente.localeCompare(b.nombre_cliente, "es"));
}

async function tablaBobedaExiste(pool: ReturnType<typeof getPool>): Promise<boolean> {
  const r = await pool.query<{ reg: boolean }>(
    `SELECT to_regclass('public.bobeda_venta_pos') IS NOT NULL AS reg`,
  );
  return Boolean(r.rows[0]?.reg);
}

export async function listarEmpaqueFacturas(clienteId: number): Promise<EmpaqueFactura[]> {
  if (!isDatabaseConfigured()) return [];
  const pool = getPool();
  if (!(await tablaBobedaExiste(pool))) return [];

  const r = await pool.query<{
    codigo_oro: string;
    staging_id: number | null;
    cedula_cliente: string | null;
    grada: string;
    marca: string | null;
    created_at: Date;
    snapshot_json: unknown;
    numero_fi_fa: number | null;
    numero_factura_legal: string | null;
  }>(
    `
      SELECT codigo_oro, staging_id, cedula_cliente, grada, marca, created_at, snapshot_json,
             numero_fi_fa, numero_factura_legal
      FROM public.bobeda_venta_pos
      WHERE cliente_id = $1
        AND upper(btrim(estado)) = 'PENDIENTE_ENTREGA'
      ORDER BY created_at ASC
      LIMIT 500
    `,
    [clienteId],
  );
  return groupRows(r.rows);
}

export type EmpaqueHubTienda = {
  cliente_id: number;
  ente: string;
  tipo: string;
  codigo: string;
  pares_pendientes: number;
  facturas_pendientes: number;
};

/** Contadores Bobeda PENDIENTE_ENTREGA por tienda (hub Empaque). */
export async function listarEmpaqueHubResumen(clienteIds: number[]): Promise<EmpaqueHubTienda[]> {
  if (!isDatabaseConfigured() || clienteIds.length === 0) return [];
  const pool = getPool();
  if (!(await tablaBobedaExiste(pool))) {
    return clienteIds.map((cliente_id) => ({
      cliente_id,
      ente: "",
      tipo: "",
      codigo: "",
      pares_pendientes: 0,
      facturas_pendientes: 0,
    }));
  }

  const r = await pool.query<{
    cliente_id: string;
    pares_pendientes: string;
    facturas_pendientes: string;
  }>(
    `
      SELECT cliente_id,
             COUNT(*)::int AS pares_pendientes,
             COUNT(DISTINCT COALESCE(staging_id::text, 'fi:' || COALESCE(numero_fi_fa::text, '?')))::int AS facturas_pendientes
      FROM public.bobeda_venta_pos
      WHERE upper(btrim(estado)) = 'PENDIENTE_ENTREGA'
        AND cliente_id = ANY($1::bigint[])
      GROUP BY cliente_id
    `,
    [clienteIds],
  );

  const byId = new Map<number, { pares: number; facturas: number }>();
  for (const row of r.rows) {
    byId.set(Number(row.cliente_id), {
      pares: Number(row.pares_pendientes) || 0,
      facturas: Number(row.facturas_pendientes) || 0,
    });
  }

  return clienteIds.map((cliente_id) => {
    const stats = byId.get(cliente_id);
    return {
      cliente_id,
      ente: "",
      tipo: "",
      codigo: "",
      pares_pendientes: stats?.pares ?? 0,
      facturas_pendientes: stats?.facturas ?? 0,
    };
  });
}

/** @deprecated usar listarEmpaqueFacturas */
export async function listarBobedaPendienteEntrega(clienteId: number) {
  const facturas = await listarEmpaqueFacturas(clienteId);
  return facturas.flatMap((f) =>
    f.lineas.map((l) => ({
      codigo_oro: l.codigo_oro,
      staging_id: f.staging_id,
      display_id: f.display_id,
      vendedor_nombre: null,
      nombre_cliente: f.nombre_cliente,
      cedula_cliente: f.cedula_cliente,
      marca: "",
      linea_codigo: l.linea_codigo,
      referencia_codigo: l.referencia_codigo,
      grada: l.grada,
      created_at: f.created_at,
      numero_fi_fa: f.numero_fi_fa,
      numero_factura_legal: null,
    })),
  );
}

export async function toggleLineaControladaEmpaque(
  clienteId: number,
  codigoOro: string,
  operador?: string | null,
): Promise<{ ok: true; controlado: boolean } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  const pool = getPool();
  if (!(await tablaBobedaExiste(pool))) {
    return { ok: false, error: "Tabla bobeda_venta_pos no existe" };
  }

  const cur = await pool.query<{ snapshot_json: unknown }>(
    `
      SELECT snapshot_json
      FROM public.bobeda_venta_pos
      WHERE cliente_id = $1
        AND codigo_oro = $2
        AND upper(btrim(estado)) = 'PENDIENTE_ENTREGA'
      LIMIT 1
    `,
    [clienteId, codigoOro],
  );
  if (!cur.rows[0]) return { ok: false, error: "Par no encontrado" };

  const snap = (cur.rows[0].snapshot_json ?? {}) as Record<string, unknown>;
  const marcar = snap.controlado !== true;

  if (marcar) {
    await pool.query(
      `
        UPDATE public.bobeda_venta_pos
        SET snapshot_json = COALESCE(snapshot_json, '{}'::jsonb) || jsonb_build_object(
          'controlado', true,
          'controlado_at', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
          'controlado_por', $3::text
        )
        WHERE cliente_id = $1
          AND codigo_oro = $2
          AND upper(btrim(estado)) = 'PENDIENTE_ENTREGA'
      `,
      [clienteId, codigoOro, operador?.trim() || null],
    );
    return { ok: true, controlado: true };
  }

  await pool.query(
    `
      UPDATE public.bobeda_venta_pos
      SET snapshot_json = (COALESCE(snapshot_json, '{}'::jsonb) - 'controlado_at' - 'controlado_por')
        || jsonb_build_object('controlado', false)
      WHERE cliente_id = $1
        AND codigo_oro = $2
        AND upper(btrim(estado)) = 'PENDIENTE_ENTREGA'
    `,
    [clienteId, codigoOro],
  );
  return { ok: true, controlado: false };
}

/** @deprecated usar toggleLineaControladaEmpaque */
export async function marcarLineaControladaEmpaque(
  clienteId: number,
  codigoOro: string,
  operador?: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const r = await toggleLineaControladaEmpaque(clienteId, codigoOro, operador);
  if (!r.ok) return r;
  return { ok: true };
}

export async function sellarFacturaEmpaqueTablet(input: {
  clienteId: number;
  stagingId?: number | null;
  nombreConfirmado: string;
}): Promise<{ ok: true; updated: number } | { ok: false; error: string }> {
  const facturas = await listarEmpaqueFacturas(input.clienteId);
  const f = facturas.find((x) => x.staging_id === input.stagingId);
  if (!f) return { ok: false, error: "Factura no encontrada" };

  const confirm = input.nombreConfirmado.trim().toLowerCase();
  const esperado = f.nombre_cliente.trim().toLowerCase();
  if (!confirm || (confirm !== esperado && !esperado.includes(confirm) && !confirm.includes(esperado))) {
    return { ok: false, error: "Nombre de factura no coincide" };
  }
  if (f.controlados < f.pares) {
    return { ok: false, error: `Faltan ${f.pares - f.controlados} artículo(s) por controlar` };
  }

  const codigos = f.lineas.map((l) => l.codigo_oro);
  return marcarEntregadoBobeda(input.clienteId, codigos);
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

import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { sqlCantidadMolecula, sqlDecrementarUnParMolecula, sqlIncrementarUnParMolecula } from "@/lib/server/catalogo-sql";
import { upsertClienteBazaar } from "@/lib/server/clients-bazaar";
import { origenDesdeTiendaClienteId } from "@/lib/bazzar-origen";
import type { ConfirmarTicketsInput, TicketEmitido } from "@/lib/server/tickets-confirm";
import { getVendedorById, type VendedorBazzar } from "@/lib/server/vendedor-bazzar";

/** Estados operativos en ticket_bandeja_cajero (una sola tabla). */
export type StagingEstado = "ABIERTO" | "PENDIENTE_CAJA" | "CSV_DESCARGADO" | "CANCELADO";

export type StagingLinea = {
  id: number;
  linea_id: number;
  referencia_id: number;
  material_id: number;
  color_id: number;
  grada: string;
  cantidad: number;
  activo: boolean;
  snapshot_json: Record<string, unknown> | null;
};

export type StagingTicket = {
  id: number;
  codigo_staging: string;
  cliente_id: number;
  marca: string;
  vendedor_bazzar_id: number;
  vendedor_nombre: string;
  cedula_cliente: string | null;
  clients_bazaar_id: number | null;
  snapshot_cliente: Record<string, unknown> | null;
  estado: StagingEstado;
  created_at: string;
  cerrado_at: string | null;
  numero_fi_fa: number | null;
  numero_factura_legal: string | null;
  lineas: StagingLinea[];
  total_pares: number;
};

type MoleculaStock = {
  linea_id: number;
  referencia_id: number;
  material_id: number;
  color_id: number;
  grada: string;
};

type BandejaRowDb = {
  id: string;
  codigo_bandeja: string;
  cliente_id: string;
  marca: string;
  vendedor_bazzar_id: string;
  vendedor_nombre: string;
  cedula_cliente: string | null;
  clients_bazaar_id: string | null;
  staging_id: string | null;
  linea_id: string;
  referencia_id: string;
  material_id: string;
  color_id: string;
  grada: string;
  cantidad: string;
  estado: StagingEstado;
  snapshot_json: Record<string, unknown> | null;
  snapshot_cliente: Record<string, unknown> | null;
  activo: boolean;
  created_at: Date;
  cerrado_at: Date | null;
  numero_fi_fa: string | null;
  numero_factura_legal: string | null;
};

function codigoBandeja(clienteId: number, loteId: number, idx: number): string {
  const t = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}${pad(t.getHours())}${pad(t.getMinutes())}${pad(t.getSeconds())}`;
  return `POS-${clienteId}-${loteId}-${stamp}-${idx}`;
}

function moleculaKey(p: MoleculaStock): string {
  return `${p.linea_id}:${p.referencia_id}:${p.material_id}:${p.color_id}:${p.grada.trim()}`;
}

/** Pares ya reservados en bandeja del lote — se devuelven a depósito antes del re-sync. */
function reservadoBandejaMap(lineas: StagingLinea[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const linea of lineas) {
    if (!linea.activo || linea.cantidad <= 0) continue;
    const key = moleculaKey(linea);
    map.set(key, (map.get(key) ?? 0) + linea.cantidad);
  }
  return map;
}

async function moverStockMolecula(
  client: { query: (text: string, params?: unknown[]) => Promise<{ rowCount: number | null }> },
  tabla: string,
  p: MoleculaStock,
  unidades: number,
): Promise<void> {
  if (unidades === 0) return;
  const abs = Math.abs(unidades);
  for (let i = 0; i < abs; i++) {
    const sql =
      unidades > 0
        ? sqlDecrementarUnParMolecula(tabla, p)
        : sqlIncrementarUnParMolecula(tabla, p);
    const r = await client.query(sql.text, sql.params);
    if (!r.rowCount && unidades > 0) {
      throw new Error(`Sin stock en sesión: molécula G.${p.grada}`);
    }
  }
}

async function restaurarLineas(
  client: { query: (text: string, params?: unknown[]) => Promise<{ rowCount: number | null }> },
  tabla: string,
  lineas: StagingLinea[],
): Promise<void> {
  for (const linea of lineas) {
    if (!linea.activo || linea.cantidad <= 0) continue;
    await moverStockMolecula(client, tabla, linea, -linea.cantidad);
  }
}

async function tablaBandejaExiste(pool: ReturnType<typeof getPool>): Promise<boolean> {
  const r = await pool.query<{ reg: boolean }>(
    `SELECT to_regclass('public.ticket_bandeja_cajero') IS NOT NULL AS reg`,
  );
  return Boolean(r.rows[0]?.reg);
}

async function nextLoteId(
  client: { query: (text: string, params?: unknown[]) => Promise<{ rows: { id: string }[] }> },
): Promise<number> {
  const r = await client.query(`SELECT nextval('public.ticket_bandeja_lote_id_seq') AS id`);
  return Number(r.rows[0]?.id);
}

async function reservarNumeroFiFa(
  client: { query: (text: string, params?: unknown[]) => Promise<{ rows: { last_num: string }[] }> },
  clienteId: number,
): Promise<number> {
  const r = await client.query(
    `
      INSERT INTO public.pos_fi_fa_counter (cliente_id, last_num)
      VALUES ($1, 1)
      ON CONFLICT (cliente_id) DO UPDATE
        SET last_num = public.pos_fi_fa_counter.last_num + 1
      RETURNING last_num
    `,
    [clienteId],
  );
  return Number(r.rows[0]?.last_num ?? 1);
}

function aggregateLineas(rows: BandejaRowDb[]): StagingLinea[] {
  const map = new Map<string, StagingLinea>();
  for (const row of rows) {
    if (!row.activo) continue;
    const qty = Number(row.cantidad) || 0;
    if (qty <= 0) continue;
    const key = `${row.linea_id}:${row.referencia_id}:${row.material_id}:${row.color_id}:${row.grada}`;
    const prev = map.get(key);
    if (prev) {
      prev.cantidad += qty;
    } else {
      map.set(key, {
        id: Number(row.id),
        linea_id: Number(row.linea_id),
        referencia_id: Number(row.referencia_id),
        material_id: Number(row.material_id),
        color_id: Number(row.color_id),
        grada: row.grada,
        cantidad: qty,
        activo: true,
        snapshot_json: row.snapshot_json,
      });
    }
  }
  return [...map.values()];
}

function loteDesdeFilas(loteId: number, rows: BandejaRowDb[]): StagingTicket | null {
  if (!rows.length) return null;
  const head = rows[0];
  const lineas = aggregateLineas(rows);
  const total_pares = lineas.reduce((s, l) => s + l.cantidad, 0);
  return {
    id: loteId,
    codigo_staging: head.codigo_bandeja,
    cliente_id: Number(head.cliente_id),
    marca: head.marca,
    vendedor_bazzar_id: Number(head.vendedor_bazzar_id),
    vendedor_nombre: head.vendedor_nombre,
    cedula_cliente: head.cedula_cliente,
    clients_bazaar_id: head.clients_bazaar_id != null ? Number(head.clients_bazaar_id) : null,
    snapshot_cliente: head.snapshot_cliente,
    estado: head.estado,
    created_at: head.created_at.toISOString(),
    cerrado_at: head.cerrado_at?.toISOString() ?? null,
    numero_fi_fa: head.numero_fi_fa != null ? Number(head.numero_fi_fa) : null,
    numero_factura_legal: head.numero_factura_legal,
    lineas,
    total_pares,
  };
}

async function fetchFilasLote(pool: ReturnType<typeof getPool>, loteId: number): Promise<BandejaRowDb[]> {
  const r = await pool.query<BandejaRowDb>(
    `
      SELECT id, codigo_bandeja, cliente_id, marca, vendedor_bazzar_id, vendedor_nombre,
             cedula_cliente, clients_bazaar_id, staging_id, linea_id, referencia_id, material_id,
             color_id, grada, cantidad, estado, snapshot_json, snapshot_cliente, activo,
             created_at, cerrado_at, numero_fi_fa, numero_factura_legal
      FROM public.ticket_bandeja_cajero
      WHERE staging_id = $1 AND activo = true
      ORDER BY id
    `,
    [loteId],
  );
  return r.rows;
}

async function fetchStagingById(pool: ReturnType<typeof getPool>, loteId: number): Promise<StagingTicket | null> {
  const rows = await fetchFilasLote(pool, loteId);
  return loteDesdeFilas(loteId, rows);
}

/** Lotes ABIERTO bloquean sync Retail → depósito. */
export async function contarStagingPendiente(clienteId?: number): Promise<number> {
  if (!isDatabaseConfigured()) return 0;
  const pool = getPool();
  if (!(await tablaBandejaExiste(pool))) return 0;
  const r = await pool.query<{ n: string }>(
    clienteId
      ? `
          SELECT COUNT(DISTINCT staging_id)::text AS n
          FROM public.ticket_bandeja_cajero
          WHERE cliente_id = $1 AND estado = 'ABIERTO' AND activo = true AND staging_id IS NOT NULL
        `
      : `
          SELECT COUNT(DISTINCT staging_id)::text AS n
          FROM public.ticket_bandeja_cajero
          WHERE estado = 'ABIERTO' AND activo = true AND staging_id IS NOT NULL
        `,
    clienteId ? [clienteId] : [],
  );
  return Number(r.rows[0]?.n ?? 0);
}

export async function listarStaging(
  clienteId: number,
  estado?: StagingEstado | StagingEstado[],
): Promise<StagingTicket[]> {
  if (!isDatabaseConfigured()) return [];
  const pool = getPool();
  if (!(await tablaBandejaExiste(pool))) return [];

  const estados = estado ? (Array.isArray(estado) ? estado : [estado]) : ["ABIERTO"];
  const r = await pool.query<{ staging_id: string }>(
    `
      SELECT staging_id
      FROM (
        SELECT staging_id, MIN(created_at) AS first_at
        FROM public.ticket_bandeja_cajero
        WHERE cliente_id = $1 AND estado = ANY($2::text[]) AND activo = true AND staging_id IS NOT NULL
        GROUP BY staging_id
      ) sub
      ORDER BY first_at DESC
      LIMIT 50
    `,
    [clienteId, estados],
  );

  const out: StagingTicket[] = [];
  for (const row of r.rows) {
    const t = await fetchStagingById(pool, Number(row.staging_id));
    if (t) out.push(t);
  }
  return out;
}

export type CrearStagingResult =
  | { ok: true; staging: StagingTicket; codigo_staging: string; total_pares: number }
  | { ok: false; error: string };

async function insertFilasDesdeCarrito(
  client: { query: (text: string, params?: unknown[]) => Promise<{ rowCount: number | null }> },
  input: {
    loteId: number;
    clienteId: number;
    marca: string;
    vendedor: VendedorBazzar;
    cedula: string | null;
    clientsBazaarId: number | null;
    snapshotCliente: string;
    estado: StagingEstado;
    numeroFiFa: number | null;
    items: ConfirmarTicketsInput["items"];
    tabla: string;
  },
): Promise<number> {
  let idx = 0;
  let total = 0;
  for (const item of input.items) {
    if (item.cantidad <= 0) continue;
    const snapBase = JSON.stringify({
      linea_codigo: item.linea_codigo,
      referencia_codigo: item.referencia_codigo,
      material_code: item.material_code,
      color_code: item.color_code,
      descp_material: item.descp_material,
      descp_color: item.descp_color,
      estilo: item.estilo,
      marca_label: item.marca_label,
      imagen_url: item.imagen_url,
    });
    for (let u = 0; u < item.cantidad; u++) {
      idx += 1;
      total += 1;
      await moverStockMolecula(
        client,
        input.tabla,
        {
          linea_id: item.linea_id,
          referencia_id: item.referencia_id,
          material_id: item.material_id,
          color_id: item.color_id,
          grada: item.grada,
        },
        1,
      );
      await client.query(
        `
          INSERT INTO public.ticket_bandeja_cajero (
            codigo_bandeja, cliente_id, marca, vendedor_id, vendedor_nombre, vendedor_bazzar_id,
            staging_id, cedula_cliente, clients_bazaar_id, linea_id, referencia_id, material_id,
            color_id, grada, cantidad, estado, snapshot_json, snapshot_cliente, numero_fi_fa, activo
          ) VALUES ($1,$2,$3,NULL,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,1,$14,$15::jsonb,$16::jsonb,$17,true)
        `,
        [
          codigoBandeja(input.clienteId, input.loteId, idx),
          input.clienteId,
          input.marca,
          input.vendedor.nombre_display,
          input.vendedor.id_vendedor,
          input.loteId,
          input.cedula,
          input.clientsBazaarId,
          item.linea_id,
          item.referencia_id,
          item.material_id,
          item.color_id,
          item.grada,
          input.estado,
          snapBase,
          input.snapshotCliente,
          input.numeroFiFa,
        ],
      );
    }
  }
  return total;
}

export async function crearStagingDesdeCarrito(
  input: ConfirmarTicketsInput & { vendedor_bazzar_id: number },
  vendedor: VendedorBazzar,
): Promise<CrearStagingResult> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  if (!input.items.length) return { ok: false, error: "No hay pares para vender" };

  const config = getDepositoByClienteId(input.cliente_id);
  if (!config) return { ok: false, error: "Depósito de tienda inválido" };

  const vb = await getVendedorById(input.vendedor_bazzar_id, input.cliente_id);
  if (!vb || vb.id_vendedor !== vendedor.id_vendedor) {
    return { ok: false, error: "Vendedor no válido en esta sucursal" };
  }

  const pool = getPool();
  if (!(await tablaBandejaExiste(pool))) {
    return { ok: false, error: "Tabla ticket_bandeja_cajero no existe — aplicar migración 005/007" };
  }

  for (const item of input.items) {
    if (item.cantidad <= 0) return { ok: false, error: "Cantidad inválida" };
    if (!item.grada?.trim()) return { ok: false, error: "Grada requerida" };
    const q = sqlCantidadMolecula(config.tabla, {
      linea_id: item.linea_id,
      referencia_id: item.referencia_id,
      material_id: item.material_id,
      color_id: item.color_id,
      grada: item.grada,
    });
    const stockR = await pool.query<{ cantidad: number }>(q.text, q.params);
    const stock = Number(stockR.rows[0]?.cantidad) || 0;
    if (stock < item.cantidad) {
      return {
        ok: false,
        error: `Sin stock: ${item.linea_codigo}.${item.referencia_codigo} G.${item.grada}`,
      };
    }
  }

  const cedula = input.cedula?.replace(/\D/g, "").trim() || null;
  const clienteNombre = input.cliente?.nombre?.trim() || null;
  const clienteApellido = input.cliente?.apellido?.trim() || null;
  const clienteTelefono = input.cliente?.telefono?.trim() || null;
  const clienteRuc = input.cliente?.ruc?.replace(/\D/g, "").trim() || null;
  const clienteRazonSocial = input.cliente?.razon_social?.trim() || null;

  let clientsBazaarId: number | null = null;
  if (cedula && (clienteNombre || clienteTelefono)) {
    const origen = origenDesdeTiendaClienteId(input.cliente_id);
    if (!origen) return { ok: false, error: "Tienda sin origen entes válido" };
    clientsBazaarId = await upsertClienteBazaar({
      cedula,
      nombre: clienteNombre,
      apellido: clienteApellido,
      telefono: clienteTelefono,
      ruc: clienteRuc,
      razon_social: clienteRazonSocial,
      origen,
    });
  }

  const snapshotCliente = JSON.stringify({
    nombre: clienteNombre,
    apellido: clienteApellido,
    telefono: clienteTelefono,
    cedula,
  });

  const client = await pool.connect();
  let loteId = 0;
  try {
    await client.query("BEGIN");
    loteId = await nextLoteId(client);
    const total = await insertFilasDesdeCarrito(client, {
      loteId,
      clienteId: input.cliente_id,
      marca: input.marca,
      vendedor,
      cedula,
      clientsBazaarId,
      snapshotCliente,
      estado: "ABIERTO",
      numeroFiFa: null,
      items: input.items,
      tabla: config.tabla,
    });
    if (total === 0) throw new Error("No se insertaron pares");
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "Error al crear pedido" };
  } finally {
    client.release();
  }

  const staging = await fetchStagingById(pool, loteId);
  if (!staging) return { ok: false, error: "Error al leer pedido creado" };
  return { ok: true, staging, codigo_staging: staging.codigo_staging, total_pares: staging.total_pares };
}

export async function cambiarEstadoStaging(
  loteId: number,
  clienteId: number,
  nuevoEstado: "ABIERTO" | "CANCELADO",
): Promise<{ ok: true; staging: StagingTicket } | { ok: false; error: string }> {
  if (nuevoEstado === "ABIERTO") return reabrirStagingDesdeCaja(loteId, clienteId);
  return cancelarPedidoCompleto(loteId, clienteId);
}

export type LineaPatch = { id: number; cantidad?: number; activo?: boolean };

export async function editarLineasStaging(
  loteId: number,
  clienteId: number,
  patches: LineaPatch[],
): Promise<{ ok: true; staging: StagingTicket } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  const pool = getPool();
  const cur = await fetchStagingById(pool, loteId);
  if (!cur || cur.cliente_id !== clienteId) return { ok: false, error: "Pedido no encontrado" };
  if (cur.estado !== "ABIERTO") return { ok: false, error: "Solo editable en estado ABIERTO (tablet)" };

  const config = getDepositoByClienteId(clienteId);
  if (!config) return { ok: false, error: "Tienda inválida" };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const p of patches) {
      const row = await client.query<{ cantidad: string; activo: boolean }>(
        `SELECT cantidad, activo FROM public.ticket_bandeja_cajero WHERE id = $1 AND staging_id = $2`,
        [p.id, loteId],
      );
      const linea = row.rows[0];
      if (!linea) throw new Error(`Línea ${p.id} no encontrada`);
      const nextActivo = p.activo != null ? p.activo : linea.activo;
      if (p.activo === false || nextActivo === false) {
        await client.query(
          `UPDATE public.ticket_bandeja_cajero SET activo = false WHERE id = $1 AND staging_id = $2`,
          [p.id, loteId],
        );
      }
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "Error al editar líneas" };
  } finally {
    client.release();
  }

  const staging = await fetchStagingById(pool, loteId);
  if (!staging) return { ok: false, error: "Error al leer pedido" };
  if (staging.total_pares === 0) return cancelarPedidoCompleto(loteId, clienteId);
  return { ok: true, staging };
}

/** Tablet CERRAR → visible en caja (misma tabla, cambio de estado). */
export async function enviarStagingACaja(
  loteId: number,
  clienteId: number,
): Promise<
  | { ok: true; tickets: TicketEmitido[]; total_pares: number }
  | { ok: false; error: string }
> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  const pool = getPool();
  const cur = await fetchStagingById(pool, loteId);
  if (!cur || cur.cliente_id !== clienteId) return { ok: false, error: "Pedido no encontrado" };
  if (cur.estado !== "ABIERTO") {
    return { ok: false, error: `Solo se cierra desde tablet (ABIERTO). Actual: ${cur.estado}` };
  }
  if (cur.total_pares === 0) return { ok: false, error: "Pedido sin pares activos" };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `
        SELECT id FROM public.ticket_bandeja_cajero
        WHERE staging_id = $1 AND cliente_id = $2
        FOR UPDATE
      `,
      [loteId, clienteId],
    );
    const fiFaRow = await client.query<{ numero_fi_fa: string | null }>(
      `
        SELECT MAX(numero_fi_fa)::text AS numero_fi_fa
        FROM public.ticket_bandeja_cajero
        WHERE staging_id = $1 AND cliente_id = $2
      `,
      [loteId, clienteId],
    );
    let numeroFiFa =
      fiFaRow.rows[0]?.numero_fi_fa != null ? Number(fiFaRow.rows[0].numero_fi_fa) : null;
    if (numeroFiFa == null || !Number.isFinite(numeroFiFa)) {
      numeroFiFa = await reservarNumeroFiFa(client, clienteId);
    }

    const cli = cur.snapshot_cliente ?? {};
    const snapPatch = JSON.stringify({
      nombre_cliente: typeof cli.nombre === "string" ? cli.nombre : null,
      apellido_cliente: typeof cli.apellido === "string" ? cli.apellido : null,
      telefono_cliente: typeof cli.telefono === "string" ? cli.telefono : null,
      cedula_cliente: cur.cedula_cliente,
    });

    await client.query(
      `
        UPDATE public.ticket_bandeja_cajero
        SET estado = 'PENDIENTE_CAJA',
            cerrado_at = now(),
            numero_fi_fa = $1,
            snapshot_json = COALESCE(snapshot_json, '{}'::jsonb) || $2::jsonb
        WHERE staging_id = $3 AND cliente_id = $4 AND estado = 'ABIERTO' AND activo = true
      `,
      [numeroFiFa, snapPatch, loteId, clienteId],
    );
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "Error al cerrar pedido" };
  } finally {
    client.release();
  }

  const rows = await fetchFilasLote(pool, loteId);
  const tickets: TicketEmitido[] = rows
    .filter((r) => r.estado === "PENDIENTE_CAJA")
    .map((r) => {
      const snap = r.snapshot_json ?? {};
      return {
        codigo_ticket: r.codigo_bandeja,
        linea_codigo: typeof snap.linea_codigo === "string" ? snap.linea_codigo : "?",
        referencia_codigo: typeof snap.referencia_codigo === "string" ? snap.referencia_codigo : "?",
        grada: r.grada,
        cantidad: 1,
      };
    });

  return { ok: true, tickets, total_pares: tickets.length };
}

/** Alias legacy — ya no copia filas. */
export async function promoverStagingAOro(
  loteId: number,
  clienteId: number,
): Promise<
  | { ok: true; tickets: TicketEmitido[]; total_pares: number; stock_decrementado: boolean }
  | { ok: false; error: string }
> {
  const r = await enviarStagingACaja(loteId, clienteId);
  if (!r.ok) return r;
  return { ok: true, tickets: r.tickets, total_pares: r.total_pares, stock_decrementado: false };
}

/** FACTURA tablet → saca de caja, vuelve editable (ABIERTO). */
export async function reabrirStagingDesdeCaja(
  loteId: number,
  clienteId: number,
): Promise<{ ok: true; staging: StagingTicket } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  const pool = getPool();
  const cur = await fetchStagingById(pool, loteId);
  if (!cur || cur.cliente_id !== clienteId) return { ok: false, error: "Factura no encontrada" };
  if (cur.estado !== "PENDIENTE_CAJA" && cur.estado !== "CSV_DESCARGADO") {
    return { ok: false, error: `Solo se reabre desde caja. Actual: ${cur.estado}` };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const upd = await client.query(
      `
        UPDATE public.ticket_bandeja_cajero
        SET estado = 'ABIERTO', cerrado_at = NULL
        WHERE staging_id = $1 AND cliente_id = $2
          AND estado IN ('PENDIENTE_CAJA', 'CSV_DESCARGADO') AND activo = true
      `,
      [loteId, clienteId],
    );
    if (!upd.rowCount) {
      await client.query("ROLLBACK");
      return { ok: false, error: "Ya no está en caja (enviado a Empaque o sin filas)" };
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "Error al reabrir factura" };
  } finally {
    client.release();
  }

  const staging = await fetchStagingById(pool, loteId);
  if (!staging) return { ok: false, error: "Error al leer factura reabierta" };
  return { ok: true, staging };
}

export async function reabrirStagingCompleto(
  loteId: number,
  clienteId: number,
): Promise<{ ok: true; staging: StagingTicket } | { ok: false; error: string }> {
  const pool = getPool();
  const cur = await fetchStagingById(pool, loteId);
  if (!cur || cur.cliente_id !== clienteId) return { ok: false, error: "Pedido no encontrado" };
  if (cur.estado === "PENDIENTE_CAJA" || cur.estado === "CSV_DESCARGADO") {
    return reabrirStagingDesdeCaja(loteId, clienteId);
  }
  if (cur.estado === "ABIERTO") return { ok: true, staging: cur };
  return { ok: false, error: `Estado ${cur.estado} no se puede continuar` };
}

export async function sincronizarStagingDesdeCarrito(
  loteId: number,
  input: ConfirmarTicketsInput & { vendedor_bazzar_id: number },
  vendedor: VendedorBazzar,
): Promise<CrearStagingResult> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  if (!input.items.length) {
    const cancel = await cancelarPedidoCompleto(loteId, input.cliente_id);
    if (!cancel.ok) return cancel;
    return {
      ok: true,
      staging: cancel.staging,
      codigo_staging: cancel.staging.codigo_staging,
      total_pares: 0,
    };
  }

  const config = getDepositoByClienteId(input.cliente_id);
  if (!config) return { ok: false, error: "Depósito de tienda inválido" };

  const vb = await getVendedorById(input.vendedor_bazzar_id, input.cliente_id);
  if (!vb || vb.id_vendedor !== vendedor.id_vendedor) {
    return { ok: false, error: "Vendedor no válido en esta sucursal" };
  }

  const pool = getPool();
  const cur = await fetchStagingById(pool, loteId);
  if (!cur || cur.cliente_id !== input.cliente_id) return { ok: false, error: "Pedido no encontrado" };
  if (cur.estado !== "ABIERTO") return { ok: false, error: "Solo editable en tablet (ABIERTO)" };

  const cedula = input.cedula?.replace(/\D/g, "").trim() || null;
  const clienteNombre = input.cliente?.nombre?.trim() || null;
  const clienteApellido = input.cliente?.apellido?.trim() || null;
  const clienteTelefono = input.cliente?.telefono?.trim() || null;
  const clienteRuc = input.cliente?.ruc?.replace(/\D/g, "").trim() || null;
  const clienteRazonSocial = input.cliente?.razon_social?.trim() || null;

  let clientsBazaarId: number | null = cur.clients_bazaar_id;
  if (cedula && (clienteNombre || clienteTelefono)) {
    const origen = origenDesdeTiendaClienteId(input.cliente_id);
    if (!origen) return { ok: false, error: "Tienda sin origen entes válido" };
    clientsBazaarId = await upsertClienteBazaar({
      cedula,
      nombre: clienteNombre,
      apellido: clienteApellido,
      telefono: clienteTelefono,
      ruc: clienteRuc,
      razon_social: clienteRazonSocial,
      origen,
    });
  }

  const snapshotCliente = JSON.stringify({
    nombre: clienteNombre,
    apellido: clienteApellido,
    telefono: clienteTelefono,
    cedula,
  });

  const reservado = reservadoBandejaMap(cur.lineas);

  for (const item of input.items) {
    if (item.cantidad <= 0) return { ok: false, error: "Cantidad inválida" };
    const q = sqlCantidadMolecula(config.tabla, {
      linea_id: item.linea_id,
      referencia_id: item.referencia_id,
      material_id: item.material_id,
      color_id: item.color_id,
      grada: item.grada,
    });
    const stockR = await pool.query<{ cantidad: number }>(q.text, q.params);
    const stockDeposito = Number(stockR.rows[0]?.cantidad) || 0;
    const key = moleculaKey({
      linea_id: item.linea_id,
      referencia_id: item.referencia_id,
      material_id: item.material_id,
      color_id: item.color_id,
      grada: item.grada,
    });
    const yaReservado = reservado.get(key) ?? 0;
    const stockDisponible = stockDeposito + yaReservado;
    if (stockDisponible < item.cantidad) {
      return {
        ok: false,
        error: `Sin stock: ${item.linea_codigo}.${item.referencia_codigo} G.${item.grada} (hay ${Math.floor(stockDisponible)}, pediste ${item.cantidad})`,
      };
    }
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await restaurarLineas(client, config.tabla, cur.lineas);
    await client.query(
      `DELETE FROM public.ticket_bandeja_cajero WHERE staging_id = $1 AND cliente_id = $2`,
      [loteId, input.cliente_id],
    );
    const total = await insertFilasDesdeCarrito(client, {
      loteId,
      clienteId: input.cliente_id,
      marca: input.marca,
      vendedor,
      cedula,
      clientsBazaarId,
      snapshotCliente,
      estado: "ABIERTO",
      numeroFiFa: cur.numero_fi_fa,
      items: input.items,
      tabla: config.tabla,
    });
    if (total === 0) throw new Error("Pedido vacío tras sync");
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "Error al sincronizar carrito" };
  } finally {
    client.release();
  }

  const staging = await fetchStagingById(pool, loteId);
  if (!staging) return { ok: false, error: "Error al leer pedido actualizado" };
  return {
    ok: true,
    staging,
    codigo_staging: staging.codigo_staging,
    total_pares: staging.total_pares,
  };
}

export async function cancelarPedidoCompleto(
  loteId: number,
  clienteId: number,
): Promise<{ ok: true; staging: StagingTicket } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  const pool = getPool();
  const cur = await fetchStagingById(pool, loteId);
  if (!cur || cur.cliente_id !== clienteId) return { ok: false, error: "Pedido no encontrado" };
  if (cur.estado === "CANCELADO") return { ok: false, error: "El pedido ya está cancelado" };

  const config = getDepositoByClienteId(clienteId);
  if (!config) return { ok: false, error: "Tienda inválida" };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (cur.estado === "ABIERTO" || cur.estado === "PENDIENTE_CAJA" || cur.estado === "CSV_DESCARGADO") {
      await restaurarLineas(client, config.tabla, cur.lineas);
    }
    await client.query(
      `
        UPDATE public.ticket_bandeja_cajero
        SET estado = 'CANCELADO', activo = false, cancelado_at = now()
        WHERE staging_id = $1 AND cliente_id = $2
      `,
      [loteId, clienteId],
    );
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "Error al cancelar pedido" };
  } finally {
    client.release();
  }

  const staging = await fetchStagingById(pool, loteId);
  if (!staging) {
    return {
      ok: true,
      staging: {
        ...cur,
        estado: "CANCELADO",
        total_pares: 0,
        lineas: [],
      },
    };
  }
  return { ok: true, staging: { ...staging, estado: "CANCELADO", total_pares: 0, lineas: [] } };
}

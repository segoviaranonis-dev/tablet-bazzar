import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { sqlCantidadMolecula, sqlDecrementarUnParMolecula, sqlIncrementarUnParMolecula } from "@/lib/server/catalogo-sql";
import { upsertClienteBazaar } from "@/lib/server/clients-bazaar";
import { origenDesdeTiendaClienteId } from "@/lib/bazzar-origen";
import type { ConfirmarTicketsInput, TicketEmitido } from "@/lib/server/tickets-confirm";
import { getVendedorById, type VendedorBazzar } from "@/lib/server/vendedor-bazzar";

export type StagingEstado = "ABIERTO" | "CERRADO" | "CANCELADO" | "ORO";

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
  lineas: StagingLinea[];
  total_pares: number;
};

function codigoStaging(clienteId: number): string {
  const t = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}${pad(t.getHours())}${pad(t.getMinutes())}${pad(t.getSeconds())}`;
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `STG-${clienteId}-${stamp}-${rnd}`;
}

type MoleculaStock = {
  linea_id: number;
  referencia_id: number;
  material_id: number;
  color_id: number;
  grada: string;
};

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

async function restaurarLineasStaging(
  client: { query: (text: string, params?: unknown[]) => Promise<{ rowCount: number | null }> },
  tabla: string,
  lineas: StagingLinea[],
): Promise<void> {
  for (const linea of lineas) {
    if (!linea.activo || linea.cantidad <= 0) continue;
    await moverStockMolecula(
      client,
      tabla,
      {
        linea_id: linea.linea_id,
        referencia_id: linea.referencia_id,
        material_id: linea.material_id,
        color_id: linea.color_id,
        grada: linea.grada,
      },
      -linea.cantidad,
    );
  }
}

/** Tickets ABIERTO o CERRADO bloquean sync Retail → depósito. */
export async function contarStagingPendiente(clienteId?: number): Promise<number> {
  if (!isDatabaseConfigured()) return 0;
  const pool = getPool();
  if (!(await tablaStagingExiste(pool))) return 0;
  const r = await pool.query<{ n: string }>(
    clienteId
      ? `SELECT COUNT(*)::text AS n FROM public.ticket_pos_staging
         WHERE cliente_id = $1 AND estado IN ('ABIERTO', 'CERRADO')`
      : `SELECT COUNT(*)::text AS n FROM public.ticket_pos_staging
         WHERE estado IN ('ABIERTO', 'CERRADO')`,
    clienteId ? [clienteId] : [],
  );
  return Number(r.rows[0]?.n ?? 0);
}

async function tablaStagingExiste(pool: ReturnType<typeof getPool>): Promise<boolean> {
  const r = await pool.query<{ reg: boolean }>(
    `SELECT to_regclass('public.ticket_pos_staging') IS NOT NULL AS reg`,
  );
  return Boolean(r.rows[0]?.reg);
}

async function tablaBandejaExiste(pool: ReturnType<typeof getPool>): Promise<boolean> {
  const r = await pool.query<{ reg: boolean }>(
    `SELECT to_regclass('public.ticket_bandeja_cajero') IS NOT NULL AS reg`,
  );
  return Boolean(r.rows[0]?.reg);
}

async function deletePendienteBandejaPorStaging(
  client: { query: (text: string, params?: unknown[]) => Promise<{ rowCount: number | null }> },
  pool: ReturnType<typeof getPool>,
  stagingId: number,
): Promise<number> {
  if (await tablaBandejaExiste(pool)) {
    const del = await client.query(
      `DELETE FROM public.ticket_bandeja_cajero
       WHERE staging_id = $1
         AND upper(btrim(estado)) IN ('PENDIENTE_CAJA', 'CSV_DESCARGADO')`,
      [stagingId],
    );
    return del.rowCount ?? 0;
  }
  const del = await client.query(
    `DELETE FROM public.ticket_venta_pos
     WHERE staging_id = $1 AND upper(btrim(estado)) = 'EMITIDO'`,
    [stagingId],
  );
  return del.rowCount ?? 0;
}

function mapLinea(row: {
  id: string;
  linea_id: string;
  referencia_id: string;
  material_id: string;
  color_id: string;
  grada: string;
  cantidad: string;
  activo: boolean;
  snapshot_json: Record<string, unknown> | null;
}): StagingLinea {
  return {
    id: Number(row.id),
    linea_id: Number(row.linea_id),
    referencia_id: Number(row.referencia_id),
    material_id: Number(row.material_id),
    color_id: Number(row.color_id),
    grada: row.grada,
    cantidad: Number(row.cantidad),
    activo: row.activo,
    snapshot_json: row.snapshot_json,
  };
}

async function fetchStagingById(pool: ReturnType<typeof getPool>, id: number): Promise<StagingTicket | null> {
  const h = await pool.query<{
    id: string;
    codigo_staging: string;
    cliente_id: string;
    marca: string;
    vendedor_bazzar_id: string;
    vendedor_nombre: string;
    cedula_cliente: string | null;
    clients_bazaar_id: string | null;
    snapshot_cliente: Record<string, unknown> | null;
    estado: StagingEstado;
    created_at: Date;
    cerrado_at: Date | null;
  }>(
    `SELECT id, codigo_staging, cliente_id, marca, vendedor_bazzar_id, vendedor_nombre,
            cedula_cliente, clients_bazaar_id, snapshot_cliente, estado, created_at, cerrado_at
     FROM public.ticket_pos_staging WHERE id = $1`,
    [id],
  );
  const head = h.rows[0];
  if (!head) return null;

  const lines = await pool.query<{
    id: string;
    linea_id: string;
    referencia_id: string;
    material_id: string;
    color_id: string;
    grada: string;
    cantidad: string;
    activo: boolean;
    snapshot_json: Record<string, unknown> | null;
  }>(
    `SELECT id, linea_id, referencia_id, material_id, color_id, grada, cantidad, activo, snapshot_json
     FROM public.ticket_pos_staging_linea WHERE staging_id = $1 ORDER BY id`,
    [id],
  );

  const lineas = lines.rows.map(mapLinea);
  const total_pares = lineas.filter((l) => l.activo && l.cantidad > 0).reduce((s, l) => s + l.cantidad, 0);

  return {
    id: Number(head.id),
    codigo_staging: head.codigo_staging,
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
    lineas,
    total_pares,
  };
}

export async function listarStaging(
  clienteId: number,
  estado?: StagingEstado | StagingEstado[],
): Promise<StagingTicket[]> {
  if (!isDatabaseConfigured()) return [];
  const pool = getPool();
  if (!(await tablaStagingExiste(pool))) return [];

  const estados = estado ? (Array.isArray(estado) ? estado : [estado]) : ["ABIERTO", "CERRADO"];
  const r = await pool.query<{ id: string }>(
    `
      SELECT id FROM public.ticket_pos_staging
      WHERE cliente_id = $1 AND estado = ANY($2::text[])
      ORDER BY created_at DESC
      LIMIT 50
    `,
    [clienteId, estados],
  );

  const out: StagingTicket[] = [];
  for (const row of r.rows) {
    const t = await fetchStagingById(pool, Number(row.id));
    if (t) out.push(t);
  }
  return out;
}

export type CrearStagingResult =
  | { ok: true; staging: StagingTicket; codigo_staging: string; total_pares: number }
  | { ok: false; error: string };

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
  if (!(await tablaStagingExiste(pool))) {
    return { ok: false, error: "Tabla ticket_pos_staging no existe — aplicar migración 003" };
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
  try {
    await client.query("BEGIN");
    const codigo = codigoStaging(input.cliente_id);
    const ins = await client.query<{ id: string }>(
      `
        INSERT INTO public.ticket_pos_staging (
          codigo_staging, cliente_id, marca, vendedor_bazzar_id, vendedor_nombre,
          cedula_cliente, clients_bazaar_id, estado, snapshot_cliente
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,'ABIERTO',$8::jsonb)
        RETURNING id
      `,
      [
        codigo,
        input.cliente_id,
        input.marca,
        vendedor.id_vendedor,
        vendedor.nombre_display,
        cedula,
        clientsBazaarId,
        snapshotCliente,
      ],
    );
    const stagingId = Number(ins.rows[0]?.id);
    if (!stagingId) throw new Error("No se creó staging");

    for (const item of input.items) {
      await moverStockMolecula(
        client,
        config.tabla,
        {
          linea_id: item.linea_id,
          referencia_id: item.referencia_id,
          material_id: item.material_id,
          color_id: item.color_id,
          grada: item.grada,
        },
        item.cantidad,
      );

      const snap = JSON.stringify({
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
      await client.query(
        `
          INSERT INTO public.ticket_pos_staging_linea (
            staging_id, linea_id, referencia_id, material_id, color_id, grada, cantidad, snapshot_json
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)
        `,
        [
          stagingId,
          item.linea_id,
          item.referencia_id,
          item.material_id,
          item.color_id,
          item.grada,
          item.cantidad,
          snap,
        ],
      );
    }

    await client.query("COMMIT");
    const staging = await fetchStagingById(pool, stagingId);
    if (!staging) return { ok: false, error: "Error al leer staging creado" };
    return { ok: true, staging, codigo_staging: codigo, total_pares: staging.total_pares };
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "Error al crear ticket abierto" };
  } finally {
    client.release();
  }
}

export async function cambiarEstadoStaging(
  stagingId: number,
  clienteId: number,
  nuevoEstado: "CERRADO" | "ABIERTO" | "CANCELADO",
): Promise<{ ok: true; staging: StagingTicket } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  const pool = getPool();
  const cur = await fetchStagingById(pool, stagingId);
  if (!cur || cur.cliente_id !== clienteId) return { ok: false, error: "Ticket no encontrado" };

  const allowed =
    (nuevoEstado === "ABIERTO" && (cur.estado === "CERRADO" || cur.estado === "CANCELADO")) ||
    (nuevoEstado === "CERRADO" && cur.estado === "ABIERTO") ||
    (nuevoEstado === "CANCELADO" && (cur.estado === "ABIERTO" || cur.estado === "CERRADO"));
  if (!allowed) {
    return { ok: false, error: `No se puede pasar de ${cur.estado} a ${nuevoEstado}` };
  }

  const config = getDepositoByClienteId(clienteId);
  if (!config) return { ok: false, error: "Tienda inválida" };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (nuevoEstado === "CANCELADO") {
      await restaurarLineasStaging(client, config.tabla, cur.lineas);
    }

    const col =
      nuevoEstado === "CERRADO" ? "cerrado_at" : nuevoEstado === "CANCELADO" ? "cancelado_at" : null;
    const sql = col
      ? `UPDATE public.ticket_pos_staging SET estado = $1, ${col} = now() WHERE id = $2 AND cliente_id = $3`
      : `UPDATE public.ticket_pos_staging SET estado = $1, cerrado_at = NULL, cancelado_at = NULL WHERE id = $2 AND cliente_id = $3`;

    await client.query(sql, [nuevoEstado, stagingId, clienteId]);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "Error al actualizar estado" };
  } finally {
    client.release();
  }

  const staging = await fetchStagingById(pool, stagingId);
  if (!staging) return { ok: false, error: "Error al actualizar" };
  return { ok: true, staging };
}

export type LineaPatch = { id: number; cantidad?: number; activo?: boolean };

export async function editarLineasStaging(
  stagingId: number,
  clienteId: number,
  patches: LineaPatch[],
): Promise<{ ok: true; staging: StagingTicket } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  const pool = getPool();
  const cur = await fetchStagingById(pool, stagingId);
  if (!cur || cur.cliente_id !== clienteId) return { ok: false, error: "Ticket no encontrado" };
  if (cur.estado !== "ABIERTO") return { ok: false, error: "Solo editable en estado ABIERTO" };

  const config = getDepositoByClienteId(clienteId);
  if (!config) return { ok: false, error: "Tienda inválida" };

  for (const p of patches) {
    const linea = cur.lineas.find((l) => l.id === p.id);
    if (!linea) return { ok: false, error: `Línea ${p.id} no encontrada` };

    const nextQty = p.cantidad != null ? Math.max(0, p.cantidad) : linea.cantidad;
    const nextActivo = p.activo != null ? p.activo : linea.activo;
    const prevEffective = linea.activo ? linea.cantidad : 0;
    const nextEffective = nextActivo ? nextQty : 0;
    const delta = nextEffective - prevEffective;

    if (delta > 0) {
      const q = sqlCantidadMolecula(config.tabla, {
        linea_id: linea.linea_id,
        referencia_id: linea.referencia_id,
        material_id: linea.material_id,
        color_id: linea.color_id,
        grada: linea.grada,
      });
      const stockR = await pool.query<{ cantidad: number }>(q.text, q.params);
      const stock = Number(stockR.rows[0]?.cantidad) || 0;
      if (stock < delta) {
        const snap = linea.snapshot_json ?? {};
        const lc = typeof snap.linea_codigo === "string" ? snap.linea_codigo : "?";
        const rc = typeof snap.referencia_codigo === "string" ? snap.referencia_codigo : "?";
        return { ok: false, error: `Sin stock para aumentar: ${lc}.${rc} G.${linea.grada}` };
      }
    }
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const p of patches) {
      const linea = cur.lineas.find((l) => l.id === p.id)!;
      const nextQty = p.cantidad != null ? Math.max(0, p.cantidad) : linea.cantidad;
      const nextActivo = p.activo != null ? p.activo : linea.activo;
      const prevEffective = linea.activo ? linea.cantidad : 0;
      const nextEffective = nextActivo ? nextQty : 0;
      const delta = nextEffective - prevEffective;

      if (delta !== 0) {
        await moverStockMolecula(
          client,
          config.tabla,
          {
            linea_id: linea.linea_id,
            referencia_id: linea.referencia_id,
            material_id: linea.material_id,
            color_id: linea.color_id,
            grada: linea.grada,
          },
          delta,
        );
      }

      if (p.cantidad != null) {
        await client.query(
          `UPDATE public.ticket_pos_staging_linea SET cantidad = $1 WHERE id = $2 AND staging_id = $3`,
          [nextQty, p.id, stagingId],
        );
      }
      if (p.activo != null) {
        await client.query(
          `UPDATE public.ticket_pos_staging_linea SET activo = $1 WHERE id = $2 AND staging_id = $3`,
          [nextActivo, p.id, stagingId],
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

  const staging = await fetchStagingById(pool, stagingId);
  if (!staging) return { ok: false, error: "Error al leer staging" };
  if (staging.total_pares === 0) {
    await pool.query(
      `UPDATE public.ticket_pos_staging SET estado = 'CANCELADO', cancelado_at = now() WHERE id = $1`,
      [stagingId],
    );
    const cancelled = await fetchStagingById(pool, stagingId);
    if (cancelled) return { ok: true, staging: cancelled };
  }
  return { ok: true, staging };
}

function codigoBandeja(clienteId: number, idx: number): string {
  const t = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}${pad(t.getHours())}${pad(t.getMinutes())}${pad(t.getSeconds())}`;
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `POS-${clienteId}-${stamp}-${rnd}-${idx}`;
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

export async function promoverStagingAOro(
  stagingId: number,
  clienteId: number,
): Promise<
  | { ok: true; tickets: TicketEmitido[]; total_pares: number; stock_decrementado: boolean }
  | { ok: false; error: string }
> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  const pool = getPool();
  const staging = await fetchStagingById(pool, stagingId);
  if (!staging || staging.cliente_id !== clienteId) return { ok: false, error: "Ticket no encontrado" };
  if (staging.estado !== "CERRADO") {
    return { ok: false, error: "Solo se promueve a ORO desde estado CERRADO" };
  }
  if (staging.total_pares === 0) return { ok: false, error: "Ticket sin pares activos" };

  const bandejaOk = await tablaBandejaExiste(pool);
  if (!bandejaOk) {
    const legacy = await pool.query<{ reg: boolean }>(
      `SELECT to_regclass('public.ticket_venta_pos') IS NOT NULL AS reg`,
    );
    if (!legacy.rows[0]?.reg) {
      return { ok: false, error: "Tabla ticket_bandeja_cajero no existe — aplicar migración 005" };
    }
  }

  const tickets: TicketEmitido[] = [];
  let idx = 0;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const numeroFiFa = await reservarNumeroFiFa(client, clienteId);
    await client.query(
      `UPDATE public.ticket_pos_staging SET numero_fi_fa = $1 WHERE id = $2 AND cliente_id = $3`,
      [numeroFiFa, stagingId, clienteId],
    );

    for (const linea of staging.lineas.filter((l) => l.activo && l.cantidad > 0)) {
      const baseSnap = linea.snapshot_json ?? {};
      const cli = staging.snapshot_cliente ?? {};
      const snapObj = {
        ...baseSnap,
        nombre_cliente: typeof cli.nombre === "string" ? cli.nombre : null,
        apellido_cliente: typeof cli.apellido === "string" ? cli.apellido : null,
        telefono_cliente: typeof cli.telefono === "string" ? cli.telefono : null,
        cedula_cliente: staging.cedula_cliente,
      };
      const lineaCodigo = typeof baseSnap.linea_codigo === "string" ? baseSnap.linea_codigo : "?";
      const refCodigo = typeof baseSnap.referencia_codigo === "string" ? baseSnap.referencia_codigo : "?";

      for (let u = 0; u < linea.cantidad; u++) {
        idx += 1;
        const codigo = codigoBandeja(clienteId, idx);
        const snapshot = JSON.stringify(snapObj);

        if (bandejaOk) {
          await client.query(
            `
              INSERT INTO public.ticket_bandeja_cajero (
                codigo_bandeja, cliente_id, marca, vendedor_id, vendedor_nombre, vendedor_bazzar_id, staging_id,
                cedula_cliente, clients_bazaar_id, linea_id, referencia_id, material_id, color_id,
                grada, cantidad, estado, snapshot_json, numero_fi_fa, numero_factura_legal
              ) VALUES ($1,$2,$3,NULL,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,1,'PENDIENTE_CAJA',$14::jsonb,$15,$16)
            `,
            [
              codigo,
              clienteId,
              staging.marca,
              staging.vendedor_nombre,
              staging.vendedor_bazzar_id,
              stagingId,
              staging.cedula_cliente,
              staging.clients_bazaar_id,
              linea.linea_id,
              linea.referencia_id,
              linea.material_id,
              linea.color_id,
              linea.grada,
              snapshot,
              numeroFiFa,
              null,
            ],
          );
        } else {
          await client.query(
            `
              INSERT INTO public.ticket_venta_pos (
                codigo_ticket, cliente_id, marca, vendedor_id, vendedor_nombre, vendedor_bazzar_id, staging_id,
                cedula_cliente, clients_bazaar_id, linea_id, referencia_id, material_id, color_id,
                grada, cantidad, estado, snapshot_json
              ) VALUES ($1,$2,$3,NULL,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,1,'EMITIDO',$14::jsonb)
            `,
            [
              codigo,
              clienteId,
              staging.marca,
              staging.vendedor_nombre,
              staging.vendedor_bazzar_id,
              stagingId,
              staging.cedula_cliente,
              staging.clients_bazaar_id,
              linea.linea_id,
              linea.referencia_id,
              linea.material_id,
              linea.color_id,
              linea.grada,
              snapshot,
            ],
          );
        }

        tickets.push({
          codigo_ticket: codigo,
          linea_codigo: lineaCodigo,
          referencia_codigo: refCodigo,
          grada: linea.grada,
          cantidad: 1,
        });
      }
    }

    await client.query(
      `UPDATE public.ticket_pos_staging SET estado = 'ORO', promovido_at = now() WHERE id = $1`,
      [stagingId],
    );
    await client.query("COMMIT");
    // ORO no toca depósito — stock ya bajó al crear staging (CERRAR tablet).
    return { ok: true, tickets, total_pares: tickets.length, stock_decrementado: false };
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "Error al promover a ORO" };
  } finally {
    client.release();
  }
}

/** Cierra staging ABIERTO y promueve a ORO — cola caja Report (EMITIDO). */
export async function enviarStagingACaja(
  stagingId: number,
  clienteId: number,
): Promise<
  | { ok: true; tickets: TicketEmitido[]; total_pares: number }
  | { ok: false; error: string }
> {
  const cur = await fetchStagingById(getPool(), stagingId);
  if (!cur || cur.cliente_id !== clienteId) {
    return { ok: false, error: "Ticket no encontrado" };
  }

  if (cur.estado === "ABIERTO") {
    const cerrar = await cambiarEstadoStaging(stagingId, clienteId, "CERRADO");
    if (!cerrar.ok) return cerrar;
  } else if (cur.estado !== "CERRADO") {
    return { ok: false, error: `Estado ${cur.estado} no se puede enviar a caja` };
  }

  const oro = await promoverStagingAOro(stagingId, clienteId);
  if (!oro.ok) return oro;
  return { ok: true, tickets: oro.tickets, total_pares: oro.total_pares };
}

/** Devuelve factura de caja (ORO) a staging ABIERTO para editar ítems desde portada /cadena. */
export async function reabrirStagingDesdeCaja(
  stagingId: number,
  clienteId: number,
): Promise<{ ok: true; staging: StagingTicket } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  const pool = getPool();
  const cur = await fetchStagingById(pool, stagingId);
  if (!cur || cur.cliente_id !== clienteId) return { ok: false, error: "Factura no encontrada" };
  if (cur.estado !== "ORO") {
    return { ok: false, error: `Solo se reabre desde caja (estado ORO). Actual: ${cur.estado}` };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const deleted = await deletePendienteBandejaPorStaging(client, pool, stagingId);
    if (!deleted) {
      await client.query("ROLLBACK");
      return { ok: false, error: "Ya no está pendiente en caja (enviado a Empaque o sin filas)" };
    }
    await client.query(
      `UPDATE public.ticket_pos_staging
       SET estado = 'ABIERTO', cerrado_at = NULL, promovido_at = NULL
       WHERE id = $1 AND cliente_id = $2`,
      [stagingId, clienteId],
    );
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "Error al reabrir factura" };
  } finally {
    client.release();
  }

  const staging = await fetchStagingById(pool, stagingId);
  if (!staging) return { ok: false, error: "Error al leer factura reabierta" };
  return { ok: true, staging };
}

/** CERRADO → ABIERTO o ORO → ABIERTO (saca de caja Report). */
export async function reabrirStagingCompleto(
  stagingId: number,
  clienteId: number,
): Promise<{ ok: true; staging: StagingTicket } | { ok: false; error: string }> {
  const pool = getPool();
  const cur = await fetchStagingById(pool, stagingId);
  if (!cur || cur.cliente_id !== clienteId) return { ok: false, error: "Pedido no encontrado" };
  if (cur.estado === "ORO") return reabrirStagingDesdeCaja(stagingId, clienteId);
  if (cur.estado === "CERRADO") return cambiarEstadoStaging(stagingId, clienteId, "ABIERTO");
  if (cur.estado === "ABIERTO") return { ok: true, staging: cur };
  return { ok: false, error: `Estado ${cur.estado} no se puede continuar` };
}

/** Sincroniza staging ABIERTO con carrito (valida stock tras liberar reserva del pedido). */
export async function sincronizarStagingDesdeCarrito(
  stagingId: number,
  input: ConfirmarTicketsInput & { vendedor_bazzar_id: number },
  vendedor: VendedorBazzar,
): Promise<CrearStagingResult> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  if (!input.items.length) {
    const cancel = await cancelarPedidoCompleto(stagingId, input.cliente_id);
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
  const cur = await fetchStagingById(pool, stagingId);
  if (!cur || cur.cliente_id !== input.cliente_id) return { ok: false, error: "Pedido no encontrado" };
  if (cur.estado !== "ABIERTO") return { ok: false, error: "Solo editable en estado ABIERTO" };

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

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await restaurarLineasStaging(client, config.tabla, cur.lineas);

    for (const item of input.items) {
      if (item.cantidad <= 0) throw new Error("Cantidad inválida");
      if (!item.grada?.trim()) throw new Error("Grada requerida");
      const q = sqlCantidadMolecula(config.tabla, {
        linea_id: item.linea_id,
        referencia_id: item.referencia_id,
        material_id: item.material_id,
        color_id: item.color_id,
        grada: item.grada,
      });
      const stockR = await client.query<{ cantidad: number }>(q.text, q.params);
      const stock = Number(stockR.rows[0]?.cantidad) || 0;
      if (stock < item.cantidad) {
        throw new Error(
          `Sin stock: ${item.linea_codigo}.${item.referencia_codigo} G.${item.grada} (hay ${Math.floor(stock)}, pediste ${item.cantidad})`,
        );
      }
    }

    await client.query(`DELETE FROM public.ticket_pos_staging_linea WHERE staging_id = $1`, [stagingId]);

    for (const item of input.items) {
      await moverStockMolecula(
        client,
        config.tabla,
        {
          linea_id: item.linea_id,
          referencia_id: item.referencia_id,
          material_id: item.material_id,
          color_id: item.color_id,
          grada: item.grada,
        },
        item.cantidad,
      );

      const snap = JSON.stringify({
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
      await client.query(
        `
          INSERT INTO public.ticket_pos_staging_linea (
            staging_id, linea_id, referencia_id, material_id, color_id, grada, cantidad, snapshot_json
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)
        `,
        [
          stagingId,
          item.linea_id,
          item.referencia_id,
          item.material_id,
          item.color_id,
          item.grada,
          item.cantidad,
          snap,
        ],
      );
    }

    await client.query(
      `
        UPDATE public.ticket_pos_staging
        SET vendedor_bazzar_id = $1, vendedor_nombre = $2,
            cedula_cliente = $3, clients_bazaar_id = $4, snapshot_cliente = $5::jsonb
        WHERE id = $6 AND cliente_id = $7
      `,
      [
        vendedor.id_vendedor,
        vendedor.nombre_display,
        cedula,
        clientsBazaarId,
        snapshotCliente,
        stagingId,
        input.cliente_id,
      ],
    );

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "Error al sincronizar carrito" };
  } finally {
    client.release();
  }

  const staging = await fetchStagingById(pool, stagingId);
  if (!staging) return { ok: false, error: "Error al leer pedido actualizado" };
  return {
    ok: true,
    staging,
    codigo_staging: staging.codigo_staging,
    total_pares: staging.total_pares,
  };
}

/** Cancela pedido en cualquier estado pendiente (ABIERTO, CERRADO, ORO) y restaura stock. */
export async function cancelarPedidoCompleto(
  stagingId: number,
  clienteId: number,
): Promise<{ ok: true; staging: StagingTicket } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) return { ok: false, error: "Base de datos no configurada" };
  const pool = getPool();
  const cur = await fetchStagingById(pool, stagingId);
  if (!cur || cur.cliente_id !== clienteId) return { ok: false, error: "Pedido no encontrado" };
  if (cur.estado === "CANCELADO") return { ok: false, error: "El pedido ya está cancelado" };

  const config = getDepositoByClienteId(clienteId);
  if (!config) return { ok: false, error: "Tienda inválida" };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (cur.estado === "ORO") {
      const deleted = await deletePendienteBandejaPorStaging(client, pool, stagingId);
      if (!deleted) {
        await client.query("ROLLBACK");
        return { ok: false, error: "Ya no está pendiente en caja (enviado a Empaque o sin filas)" };
      }
    }

    await restaurarLineasStaging(client, config.tabla, cur.lineas);

    await client.query(
      `UPDATE public.ticket_pos_staging
       SET estado = 'CANCELADO', cancelado_at = now(), cerrado_at = NULL, promovido_at = NULL
       WHERE id = $1 AND cliente_id = $2`,
      [stagingId, clienteId],
    );

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "Error al cancelar pedido" };
  } finally {
    client.release();
  }

  const staging = await fetchStagingById(pool, stagingId);
  if (!staging) return { ok: false, error: "Error al leer pedido cancelado" };
  return { ok: true, staging };
}

import { getDepositoByClienteId } from "@/lib/depositos-config";

import { getPool, isDatabaseConfigured } from "@/lib/pool";

import { sqlCantidadMolecula, sqlDecrementarUnParMolecula } from "@/lib/server/catalogo-sql";

import { upsertClienteBazaar } from "@/lib/server/clients-bazaar";

import { origenDesdeTiendaClienteId } from "@/lib/bazzar-origen";

import type { PosCartItem } from "@/lib/cart/pos-cart";



export type ClienteWebConfirm = {

  nombre?: string | null;

  apellido?: string | null;

  telefono?: string | null;

  ruc?: string | null;

  razon_social?: string | null;

};



export type TicketEmitido = {

  codigo_ticket: string;

  linea_codigo: string;

  referencia_codigo: string;

  grada: string;

  cantidad: number;

};



export type ConfirmarTicketsInput = {

  cliente_id: number;

  marca: string;

  vendedor_bazzar_id: number;

  cedula?: string | null;

  cliente?: ClienteWebConfirm | null;

  items: Pick<

    PosCartItem,

    | "linea_id"

    | "referencia_id"

    | "material_id"

    | "color_id"

    | "linea_codigo"

    | "referencia_codigo"

    | "material_code"

    | "color_code"

    | "descp_material"

    | "descp_color"

    | "estilo"

    | "marca_label"

    | "grada"

    | "imagen_url"

    | "cantidad"

  >[];

};



export type ConfirmarTicketsResult =

  | { ok: true; tickets: TicketEmitido[]; total_pares: number; persisted: boolean; stock_decrementado: boolean }

  | { ok: false; error: string };



function codigoTicket(clienteId: number, idx: number): string {

  const t = new Date();

  const pad = (n: number) => String(n).padStart(2, "0");

  const stamp = `${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}${pad(t.getHours())}${pad(t.getMinutes())}${pad(t.getSeconds())}`;

  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `POS-${clienteId}-${stamp}-${rnd}-${idx}`;

}



async function tablaTicketExiste(pool: ReturnType<typeof getPool>): Promise<boolean> {

  const r = await pool.query<{ reg: boolean }>(

    `SELECT to_regclass('public.ticket_venta_pos') IS NOT NULL AS reg`,

  );

  return Boolean(r.rows[0]?.reg);

}



async function tieneColumnaClientsBazaarId(pool: ReturnType<typeof getPool>): Promise<boolean> {

  const r = await pool.query<{ ok: boolean }>(

    `

      SELECT EXISTS (

        SELECT 1

        FROM information_schema.columns

        WHERE table_schema = 'public'

          AND table_name = 'ticket_venta_pos'

          AND column_name = 'clients_bazaar_id'

      ) AS ok

    `,

  );

  return Boolean(r.rows[0]?.ok);

}



export async function confirmarTicketsPos(

  input: ConfirmarTicketsInput,

  vendedor: { user_id: number; nombre: string } | null,

): Promise<ConfirmarTicketsResult> {

  if (!isDatabaseConfigured()) {

    return { ok: false, error: "Base de datos no configurada" };

  }

  if (!input.items.length) {

    return { ok: false, error: "No hay pares para vender" };

  }



  const config = getDepositoByClienteId(input.cliente_id);

  if (!config) {

    return { ok: false, error: "Depósito de tienda inválido" };

  }



  const pool = getPool();

  const tickets: TicketEmitido[] = [];

  let idx = 0;



  for (const item of input.items) {

    if (item.cantidad <= 0) {

      return { ok: false, error: "Cantidad inválida en un artículo" };

    }

    if (!item.grada?.trim()) {

      return { ok: false, error: "Grada/talla requerida en un artículo" };

    }



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

        error: `Sin stock: ${item.linea_codigo}.${item.referencia_codigo} G.${item.grada} (hay ${Math.floor(stock)}, pediste ${item.cantidad})`,

      };

    }



    for (let u = 0; u < item.cantidad; u++) {

      idx += 1;

      tickets.push({

        codigo_ticket: codigoTicket(input.cliente_id, idx),

        linea_codigo: item.linea_codigo,

        referencia_codigo: item.referencia_codigo,

        grada: item.grada,

        cantidad: 1,

      });

    }

  }



  const tieneTabla = await tablaTicketExiste(pool);

  if (!tieneTabla) {

    return {

      ok: true,

      tickets,

      total_pares: tickets.length,

      persisted: false,

      stock_decrementado: false,

    };

  }



  type RowInsert = {

    ticket: TicketEmitido;

    item: ConfirmarTicketsInput["items"][number];

  };

  const filas: RowInsert[] = [];

  let tIdx = 0;

  for (const item of input.items) {

    for (let u = 0; u < item.cantidad; u++) {

      filas.push({ ticket: tickets[tIdx]!, item });

      tIdx += 1;

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

    if (!origen) {

      return { ok: false, error: "Tienda sin origen entes válido" };

    }

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



  const conFkCliente = await tieneColumnaClientsBazaarId(pool);

  const client = await pool.connect();



  try {

    await client.query("BEGIN");



    for (const { ticket, item } of filas) {

      const dec = sqlDecrementarUnParMolecula(config.tabla, {

        linea_id: item.linea_id,

        referencia_id: item.referencia_id,

        material_id: item.material_id,

        color_id: item.color_id,

        grada: item.grada,

      });

      const decR = await client.query(dec.text, dec.params);

      if (!decR.rowCount) {

        throw new Error(

          `Sin stock al cobrar: ${item.linea_codigo}.${item.referencia_codigo} G.${item.grada}`,

        );

      }



      const snapshot = JSON.stringify({

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



      if (conFkCliente) {

        await client.query(

          `

            INSERT INTO public.ticket_venta_pos (

              codigo_ticket, cliente_id, marca, vendedor_id, vendedor_nombre,

              cedula_cliente, clients_bazaar_id, linea_id, referencia_id, material_id, color_id,

              grada, cantidad, estado, snapshot_json

            ) VALUES (

              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 1, 'EMITIDO', $13::jsonb

            )

          `,

          [

            ticket.codigo_ticket,

            input.cliente_id,

            input.marca,

            vendedor?.user_id ?? null,

            vendedor?.nombre ?? null,

            cedula,

            clientsBazaarId,

            item.linea_id,

            item.referencia_id,

            item.material_id,

            item.color_id,

            item.grada,

            snapshot,

          ],

        );

      } else {

        await client.query(

          `

            INSERT INTO public.ticket_venta_pos (

              codigo_ticket, cliente_id, marca, vendedor_id, vendedor_nombre,

              cedula_cliente, linea_id, referencia_id, material_id, color_id,

              grada, cantidad, estado, snapshot_json

            ) VALUES (

              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 1, 'EMITIDO', $12::jsonb

            )

          `,

          [

            ticket.codigo_ticket,

            input.cliente_id,

            input.marca,

            vendedor?.user_id ?? null,

            vendedor?.nombre ?? null,

            cedula,

            item.linea_id,

            item.referencia_id,

            item.material_id,

            item.color_id,

            item.grada,

            snapshot,

          ],

        );

      }

    }



    await client.query("COMMIT");

  } catch (e) {

    await client.query("ROLLBACK");

    const msg = e instanceof Error ? e.message : "Error al guardar tickets";

    return { ok: false, error: msg };

  } finally {

    client.release();

  }



  return {

    ok: true,

    tickets,

    total_pares: tickets.length,

    persisted: true,

    stock_decrementado: true,

  };

}


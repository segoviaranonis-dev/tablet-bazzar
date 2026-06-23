import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { origenDesdeTiendaClienteId } from "@/lib/bazzar-origen";

export type VendedorBazzar = {
  id_vendedor: number;
  funcionario_id: number;
  ente_id: number;
  ente_codigo: number;
  cliente_id: number;
  nombre_display: string;
};

async function tablaExiste(): Promise<boolean> {
  const pool = getPool();
  const r = await pool.query<{ reg: boolean }>(
    `SELECT to_regclass('public.vendedor_bazzar') IS NOT NULL AS reg`,
  );
  return Boolean(r.rows[0]?.reg);
}

const ENTES_ETIQUETA: Record<number, string> = {
  2: "Fernando",
  3: "San Martín",
  4: "Palma",
};

export async function identificarVendedorPin(
  clienteId: number,
  pin: string,
): Promise<{ ok: true; vendedor: VendedorBazzar } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Base de datos no configurada" };
  }
  const digits = pin.replace(/\D/g, "").trim();
  if (digits.length < 2 || digits.length > 6) {
    return { ok: false, error: "Código vendedor inválido (2–6 dígitos)" };
  }
  const pinNorm = digits.padStart(4, "0");
  const origen = origenDesdeTiendaClienteId(clienteId);
  if (!origen) {
    return { ok: false, error: "Tienda no válida" };
  }
  if (!(await tablaExiste())) {
    return { ok: false, error: "Tabla vendedor_bazzar no existe — aplicar migración 003" };
  }

  const pool = getPool();
  const r = await pool.query<{
    id_vendedor: string;
    funcionario_id: string;
    ente_id: string;
    ente_codigo: string;
    cliente_id: string;
    nombre_display: string;
  }>(
    `
      SELECT vb.id_vendedor, vb.funcionario_id, vb.ente_id, vb.cliente_id, vb.nombre_display,
             e.codigo AS ente_codigo
      FROM public.vendedor_bazzar vb
      JOIN public.entes e ON e.id_ente = vb.ente_id
      WHERE vb.activo = true
        AND e.codigo = $1
        AND vb.codigo_pin IN ($2, $3)
      LIMIT 1
    `,
    [origen.ente_codigo, digits, pinNorm],
  );

  const row = r.rows[0];
  if (!row) {
    const tienda = getDepositoByClienteId(clienteId);
    const enteLabel = ENTES_ETIQUETA[origen.ente_codigo] ?? "esta sucursal";
    const etiqueta = tienda ? `${tienda.ente} (${enteLabel})` : enteLabel;
    return { ok: false, error: `Código no reconocido en ${etiqueta}.` };
  }

  return {
    ok: true,
    vendedor: {
      id_vendedor: Number(row.id_vendedor),
      funcionario_id: Number(row.funcionario_id),
      ente_id: Number(row.ente_id),
      ente_codigo: Number(row.ente_codigo),
      cliente_id: Number(row.cliente_id),
      nombre_display: row.nombre_display,
    },
  };
}

/** Valida vendedor para la tienda piso: mismo ente (Fernando Adultos + Niños comparten código). */
export async function getVendedorById(id: number, clienteId: number): Promise<VendedorBazzar | null> {
  if (!isDatabaseConfigured() || !(await tablaExiste())) return null;
  const origen = origenDesdeTiendaClienteId(clienteId);
  if (!origen) return null;

  const pool = getPool();
  const r = await pool.query<{
    id_vendedor: string;
    funcionario_id: string;
    ente_id: string;
    ente_codigo: string;
    cliente_id: string;
    nombre_display: string;
  }>(
    `
      SELECT vb.id_vendedor, vb.funcionario_id, vb.ente_id, vb.cliente_id, vb.nombre_display,
             e.codigo AS ente_codigo
      FROM public.vendedor_bazzar vb
      JOIN public.entes e ON e.id_ente = vb.ente_id
      WHERE vb.id_vendedor = $1
        AND vb.activo = true
        AND e.codigo = $2
      LIMIT 1
    `,
    [id, origen.ente_codigo],
  );
  const row = r.rows[0];
  if (!row) return null;
  return {
    id_vendedor: Number(row.id_vendedor),
    funcionario_id: Number(row.funcionario_id),
    ente_id: Number(row.ente_id),
    ente_codigo: Number(row.ente_codigo),
    cliente_id: Number(row.cliente_id),
    nombre_display: row.nombre_display,
  };
}

export type VendedorBazzarResumen = {
  id_vendedor: number;
  nombre_display: string;
  codigo_pin: string;
  ente_codigo: number;
};

/** Vendedores activos del mismo ente (Fernando 2100+2900, etc.). */
export async function listarVendedoresPorEnte(
  clienteId: number,
): Promise<{ ok: true; vendedores: VendedorBazzarResumen[] } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Base de datos no configurada" };
  }
  const origen = origenDesdeTiendaClienteId(clienteId);
  if (!origen) {
    return { ok: false, error: "Tienda no válida" };
  }
  if (!(await tablaExiste())) {
    return { ok: false, error: "Tabla vendedor_bazzar no existe" };
  }

  const pool = getPool();
  const r = await pool.query<{
    id_vendedor: string;
    nombre_display: string;
    codigo_pin: string;
    ente_codigo: string;
  }>(
    `
      SELECT vb.id_vendedor, vb.nombre_display, vb.codigo_pin, e.codigo AS ente_codigo
      FROM public.vendedor_bazzar vb
      JOIN public.entes e ON e.id_ente = vb.ente_id
      WHERE vb.activo = true AND e.codigo = $1
      ORDER BY vb.nombre_display
    `,
    [origen.ente_codigo],
  );

  return {
    ok: true,
    vendedores: r.rows.map((row) => ({
      id_vendedor: Number(row.id_vendedor),
      nombre_display: row.nombre_display,
      codigo_pin: row.codigo_pin,
      ente_codigo: Number(row.ente_codigo),
    })),
  };
}

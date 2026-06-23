import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { origenDesdeTiendaClienteId } from "@/lib/bazzar-origen";

export type VendedorBazzar = {
  id_vendedor: number;
  funcionario_id: number;
  ente_id: number;
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

export async function identificarVendedorPin(
  clienteId: number,
  pin: string,
): Promise<{ ok: true; vendedor: VendedorBazzar } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Base de datos no configurada" };
  }
  const digits = pin.replace(/\D/g, "").trim();
  if (digits.length < 4) {
    return { ok: false, error: "PIN inválido (mín. 4 dígitos)" };
  }
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
    cliente_id: string;
    nombre_display: string;
  }>(
    `
      SELECT vb.id_vendedor, vb.funcionario_id, vb.ente_id, vb.cliente_id, vb.nombre_display
      FROM public.vendedor_bazzar vb
      JOIN public.entes e ON e.id_ente = vb.ente_id
      WHERE vb.activo = true
        AND vb.cliente_id = $1
        AND vb.codigo_pin = $2
        AND e.codigo = $3
      LIMIT 1
    `,
    [clienteId, digits, origen.ente_codigo],
  );

  const row = r.rows[0];
  if (!row) {
    return { ok: false, error: "PIN no reconocido en esta tienda" };
  }

  return {
    ok: true,
    vendedor: {
      id_vendedor: Number(row.id_vendedor),
      funcionario_id: Number(row.funcionario_id),
      ente_id: Number(row.ente_id),
      cliente_id: Number(row.cliente_id),
      nombre_display: row.nombre_display,
    },
  };
}

export async function getVendedorById(id: number, clienteId: number): Promise<VendedorBazzar | null> {
  if (!isDatabaseConfigured() || !(await tablaExiste())) return null;
  const pool = getPool();
  const r = await pool.query<{
    id_vendedor: string;
    funcionario_id: string;
    ente_id: string;
    cliente_id: string;
    nombre_display: string;
  }>(
    `
      SELECT id_vendedor, funcionario_id, ente_id, cliente_id, nombre_display
      FROM public.vendedor_bazzar
      WHERE id_vendedor = $1 AND cliente_id = $2 AND activo = true
      LIMIT 1
    `,
    [id, clienteId],
  );
  const row = r.rows[0];
  if (!row) return null;
  return {
    id_vendedor: Number(row.id_vendedor),
    funcionario_id: Number(row.funcionario_id),
    ente_id: Number(row.ente_id),
    cliente_id: Number(row.cliente_id),
    nombre_display: row.nombre_display,
  };
}

import { NextResponse } from "next/server";
import { DEPOSITOS } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ configured: false, depositos: [] }, { status: 500 });
  }

  const pool = getPool();
  const depositos = await Promise.all(
    DEPOSITOS.map(async (d) => {
      try {
        const { rows } = await pool.query<{ c: number; s: number }>(
          `SELECT COUNT(*)::int AS c, COALESCE(SUM(cantidad), 0)::float AS s FROM public.${d.tabla}`,
        );
        return {
          cliente_id: d.cliente_id,
          ente: d.ente,
          tipo: d.tipo,
          codigo: d.codigo,
          registros: rows[0]?.c ?? 0,
          pares: rows[0]?.s ?? 0,
        };
      } catch (error) {
        return {
          cliente_id: d.cliente_id,
          ente: d.ente,
          tipo: d.tipo,
          codigo: d.codigo,
          registros: 0,
          pares: 0,
          error: error instanceof Error ? error.message : "Error",
        };
      }
    }),
  );

  return NextResponse.json({ configured: true, depositos });
}

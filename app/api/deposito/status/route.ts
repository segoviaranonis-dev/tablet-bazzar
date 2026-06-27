import { NextResponse } from "next/server";
import {
  CATEGORIA_DEPOSITO_META,
  DEPOSITOS,
  DEPOSITOS_MATRIZ,
  type CategoriaDeposito,
} from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";

async function countTabla(tabla: string) {
  const pool = getPool();
  const { rows } = await pool.query<{ c: number; s: number }>(
    `SELECT COUNT(*)::int AS c, COALESCE(SUM(cantidad), 0)::float AS s FROM public.${tabla}`,
  );
  return { registros: rows[0]?.c ?? 0, pares: rows[0]?.s ?? 0 };
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ configured: false, depositos: [], matriz: [] }, { status: 500 });
  }

  const matriz = await Promise.all(
    DEPOSITOS_MATRIZ.map(async (d) => {
      try {
        const stats = await countTabla(d.tabla);
        return {
          cliente_id: d.cliente_id,
          ente: d.ente,
          tipo: d.tipo,
          codigo: d.codigo,
          categoria: d.categoria,
          nivel: d.nivel,
          tabla: d.tabla,
          tablet: CATEGORIA_DEPOSITO_META[d.categoria].tablet,
          ...stats,
        };
      } catch (error) {
        return {
          cliente_id: d.cliente_id,
          ente: d.ente,
          tipo: d.tipo,
          codigo: d.codigo,
          categoria: d.categoria,
          nivel: d.nivel,
          tabla: d.tabla,
          tablet: CATEGORIA_DEPOSITO_META[d.categoria].tablet,
          registros: 0,
          pares: 0,
          error: error instanceof Error ? error.message : "Error",
        };
      }
    }),
  );

  const depositos = matriz
    .filter((d) => d.categoria === "tienda")
    .map(({ cliente_id, ente, tipo, codigo, registros, pares, error }) => ({
      cliente_id,
      ente,
      tipo,
      codigo,
      registros,
      pares,
      ...(error ? { error } : {}),
    }));

  const resumenCategorias = (["tienda", "guardado", "averiado"] as CategoriaDeposito[]).map(
    (categoria) => {
      const items = matriz.filter((d) => d.categoria === categoria);
      return {
        categoria,
        label: CATEGORIA_DEPOSITO_META[categoria].label,
        tablet: CATEGORIA_DEPOSITO_META[categoria].tablet,
        tablas: items.length,
        registros: items.reduce((s, d) => s + d.registros, 0),
        pares: items.reduce((s, d) => s + d.pares, 0),
      };
    },
  );

  return NextResponse.json({
    configured: true,
    depositos,
    matriz,
    resumen: {
      tablas_total: DEPOSITOS_MATRIZ.length,
      tiendas: DEPOSITOS.length,
      categorias: resumenCategorias,
    },
  });
}

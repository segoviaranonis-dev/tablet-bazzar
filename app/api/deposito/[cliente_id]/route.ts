import { NextRequest, NextResponse } from "next/server";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { enrichDepositoFilaImagenes } from "@/lib/product-image";

export type DepositoProducto = {
  linea_codigo_proveedor: string;
  referencia_codigo_proveedor: string;
  material_code: string;
  color_code: string;
  marca: string;
  genero: string;
  estilo: string;
  tipo_v2: string;
  descp_material: string | null;
  descp_color: string | null;
  grada: string;
  cantidad: number;
  imagen_nombre: string | null;
  imagen_url_thumb: string | null;
  imagen_url_hero: string | null;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cliente_id: string }> },
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { configured: false, productos: [], error: "DATABASE_URL no configurada" },
      { status: 500 },
    );
  }

  const { cliente_id: idStr } = await params;
  const cliente_id = Number(idStr);
  const config = getDepositoByClienteId(cliente_id);
  if (!config) {
    return NextResponse.json(
      { configured: true, productos: [], error: `cliente_id ${cliente_id} inválido` },
      { status: 400 },
    );
  }

  const limitParam = new URL(req.url).searchParams.get("limit") ?? "50";
  const limit = limitParam === "all" ? null : Number(limitParam) || 50;
  const whereClause = limit ? `WHERE rank_por_marca <= ${limit}` : "";

  const pool = getPool();
  const { rows } = await pool.query<DepositoProducto>(`
    WITH ranked_products AS (
      SELECT
        s.linea_codigo_proveedor,
        s.referencia_codigo_proveedor,
        COALESCE(
          NULLIF(btrim(s.excel_material_code::text), ''),
          CASE WHEN mat.id IS NULL OR mat.codigo_proveedor = -999001::bigint THEN NULL
               ELSE trim(mat.codigo_proveedor::text) END,
          ''
        ) AS material_code,
        COALESCE(
          NULLIF(btrim(s.excel_color_code::text), ''),
          CASE WHEN col.id IS NULL OR col.codigo_proveedor = -999001::bigint THEN NULL
               ELSE trim(col.codigo_proveedor::text) END,
          ''
        ) AS color_code,
        s.grada,
        s.cantidad::float8 AS cantidad,
        COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') AS marca,
        COALESCE(NULLIF(btrim(g.descripcion::text), ''), '(sin género)') AS genero,
        COALESCE(NULLIF(btrim(ge.descp_grupo_estilo::text), ''), '(sin estilo)') AS estilo,
        COALESCE(NULLIF(btrim(tv.descp_tipo::text), ''), '(sin tipo)') AS tipo_v2,
        NULLIF(btrim(mat.descripcion::text), '') AS descp_material,
        NULLIF(btrim(col.nombre::text), '') AS descp_color,
        NULLIF(btrim(s.imagen_nombre::text), '') AS imagen_nombre,
        ROW_NUMBER() OVER (PARTITION BY s.marca_id ORDER BY s.cantidad DESC) AS rank_por_marca
      FROM public.${config.tabla} s
      LEFT JOIN public.material mat ON mat.id = s.material_id
      LEFT JOIN public.color col ON col.id = s.color_id
      LEFT JOIN public.marca_v2 mv ON mv.id_marca = s.marca_id
      LEFT JOIN public.genero g ON g.id = s.genero_id
      LEFT JOIN public.grupo_estilo_v2 ge ON ge.id_grupo_estilo = s.grupo_estilo_id
      LEFT JOIN public.tipo_v2 tv ON tv.id_tipo = s.tipo_v2_id
    )
    SELECT
      linea_codigo_proveedor,
      referencia_codigo_proveedor,
      material_code,
      color_code,
      grada,
      cantidad,
      marca,
      genero,
      estilo,
      tipo_v2,
      descp_material,
      descp_color,
      imagen_nombre
    FROM ranked_products
    ${whereClause}
    ORDER BY marca, cantidad DESC
  `);

  const totalPares = rows.reduce((sum, r) => sum + Number(r.cantidad), 0);

  return NextResponse.json({
    configured: true,
    cliente_id,
    ente: config.ente,
    tipo: config.tipo,
    codigo: config.codigo,
    productos: rows.map(enrichDepositoFilaImagenes),
    total: rows.length,
    total_pares_muestra: totalPares,
  });
}

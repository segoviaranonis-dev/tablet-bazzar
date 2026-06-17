import { NextRequest, NextResponse } from "next/server";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { moleculeKey, type MoleculeFk } from "@/lib/deposito-cohorte";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { enrichDepositoFilaImagenes } from "@/lib/product-image";
import { fetchStockRedBatch } from "@/lib/server/stock-red-batch";
import {
  PILAR_TRIANGULO_JOINS,
  SQL_ESTILO_LABEL,
  SQL_GENERO_LABEL,
  SQL_GRUPO_ESTILO_ID,
  SQL_GENERO_ID,
  SQL_MARCA_ID,
  SQL_MARCA_LABEL,
} from "@/lib/server/pilar-triangulo";
import type { StockUbicacionBloque } from "@/lib/stock-otros-locales";
import { totalStockRed } from "@/lib/stock-otros-locales";
import { ubicacionIdFromClienteId } from "@/lib/ubicaciones";

export type DepositoProducto = {
  linea_id: number | null;
  referencia_id: number | null;
  material_id: number | null;
  color_id: number | null;
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
  cantidad_local: number;
  cantidad_red: number;
  imagen_nombre: string | null;
  imagen_url_thumb: string | null;
  imagen_url_hero: string | null;
  stock_red?: StockUbicacionBloque[];
};

type MoleculeRow = Omit<DepositoProducto, "cantidad_red" | "imagen_url_thumb" | "imagen_url_hero" | "stock_red">;

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
  const includeRed = new URL(req.url).searchParams.get("stock_red") !== "0";
  const whereClause = limit ? `WHERE rank_por_marca <= ${limit}` : "";

  const pool = getPool();
  const { rows } = await pool.query<MoleculeRow>(`
    WITH sku_rows AS (
      SELECT
        s.linea_id,
        s.referencia_id,
        s.material_id,
        s.color_id,
        trim(s.linea_codigo_proveedor::text) AS linea_codigo_proveedor,
        trim(s.referencia_codigo_proveedor::text) AS referencia_codigo_proveedor,
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
        s.cantidad::float8 AS cantidad,
        ${SQL_MARCA_LABEL} AS marca,
        ${SQL_MARCA_ID} AS marca_id,
        ${SQL_GENERO_LABEL} AS genero,
        ${SQL_ESTILO_LABEL} AS estilo,
        COALESCE(NULLIF(btrim(tv.descp_tipo::text), ''), '(sin tipo)') AS tipo_v2,
        NULLIF(btrim(mat.descripcion::text), '') AS descp_material,
        NULLIF(btrim(col.nombre::text), '') AS descp_color,
        NULLIF(btrim(s.imagen_nombre::text), '') AS imagen_nombre
      FROM public.${config.tabla} s
      ${PILAR_TRIANGULO_JOINS}
      LEFT JOIN public.material mat ON mat.id = s.material_id
      LEFT JOIN public.color col ON col.id = s.color_id
      LEFT JOIN public.marca_v2 mv ON mv.id_marca = ${SQL_MARCA_ID}
      LEFT JOIN public.genero g ON g.id = ${SQL_GENERO_ID}
      LEFT JOIN public.grupo_estilo_v2 ge ON ge.id_grupo_estilo = ${SQL_GRUPO_ESTILO_ID}
      LEFT JOIN public.tipo_v2 tv ON tv.id_tipo = s.tipo_v2_id
      WHERE s.cantidad > 0
        AND btrim(s.linea_codigo_proveedor::text) <> ''
        AND btrim(s.referencia_codigo_proveedor::text) <> ''
        AND s.material_id IS NOT NULL
        AND s.color_id IS NOT NULL
    ),
    molecule_agg AS (
      SELECT
        MAX(linea_id) AS linea_id,
        MAX(referencia_id) AS referencia_id,
        material_id,
        color_id,
        linea_codigo_proveedor,
        referencia_codigo_proveedor,
        MAX(material_code) AS material_code,
        MAX(color_code) AS color_code,
        MAX(marca) AS marca,
        MAX(marca_id) AS marca_id,
        MAX(genero) AS genero,
        MAX(estilo) AS estilo,
        MAX(tipo_v2) AS tipo_v2,
        MAX(descp_material) AS descp_material,
        MAX(descp_color) AS descp_color,
        SUM(cantidad) AS cantidad_local,
        MAX(imagen_nombre) AS imagen_nombre
      FROM sku_rows
      GROUP BY
        linea_codigo_proveedor,
        referencia_codigo_proveedor,
        material_id,
        color_id
    ),
    ranked_molecules AS (
      SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY marca ORDER BY cantidad_local DESC) AS rank_por_marca
      FROM molecule_agg
    )
    SELECT
      linea_id,
      referencia_id,
      material_id,
      color_id,
      linea_codigo_proveedor,
      referencia_codigo_proveedor,
      material_code,
      color_code,
      marca,
      genero,
      estilo,
      tipo_v2,
      descp_material,
      descp_color,
      cantidad_local,
      imagen_nombre
    FROM ranked_molecules
    ${whereClause}
    ORDER BY marca, cantidad_local DESC
  `);

  const totalPares = rows.reduce((sum, r) => sum + Number(r.cantidad_local), 0);

  let stockRedMap = new Map<string, StockUbicacionBloque[]>();
  if (includeRed && rows.length > 0) {
    const molecules: MoleculeFk[] = rows.map((r) => ({
      linea_id: r.linea_id != null ? Number(r.linea_id) : null,
      referencia_id: r.referencia_id != null ? Number(r.referencia_id) : null,
      material_id: r.material_id != null ? Number(r.material_id) : null,
      color_id: r.color_id != null ? Number(r.color_id) : null,
      linea_codigo_proveedor: r.linea_codigo_proveedor,
      referencia_codigo_proveedor: r.referencia_codigo_proveedor,
      material_code: r.material_code,
      color_code: r.color_code,
    }));
    stockRedMap = await fetchStockRedBatch(
      pool,
      cliente_id,
      molecules,
      ubicacionIdFromClienteId(cliente_id),
    );
  }

  const productos: DepositoProducto[] = rows.map((r) => {
    const mk = moleculeKey({
      linea_id: r.linea_id != null ? Number(r.linea_id) : null,
      referencia_id: r.referencia_id != null ? Number(r.referencia_id) : null,
      material_id: r.material_id != null ? Number(r.material_id) : null,
      color_id: r.color_id != null ? Number(r.color_id) : null,
      linea_codigo_proveedor: r.linea_codigo_proveedor,
      referencia_codigo_proveedor: r.referencia_codigo_proveedor,
      material_code: r.material_code,
      color_code: r.color_code,
    });
    const stock_red = stockRedMap.get(mk);
    const enriched = enrichDepositoFilaImagenes({
      ...r,
      grada: "",
      cantidad: r.cantidad_local,
    });
    const cantidad_red = stock_red ? totalStockRed(stock_red) : r.cantidad_local;
    return {
      linea_id: r.linea_id,
      referencia_id: r.referencia_id,
      material_id: r.material_id,
      color_id: r.color_id,
      linea_codigo_proveedor: r.linea_codigo_proveedor,
      referencia_codigo_proveedor: r.referencia_codigo_proveedor,
      material_code: r.material_code,
      color_code: r.color_code,
      marca: r.marca,
      genero: r.genero,
      estilo: r.estilo,
      tipo_v2: r.tipo_v2,
      descp_material: r.descp_material,
      descp_color: r.descp_color,
      cantidad_local: r.cantidad_local,
      cantidad_red,
      imagen_nombre: r.imagen_nombre,
      imagen_url_thumb: enriched.imagen_url_thumb,
      imagen_url_hero: enriched.imagen_url_hero,
      ...(stock_red ? { stock_red } : {}),
    };
  });

  return NextResponse.json({
    configured: true,
    cliente_id,
    ente: config.ente,
    tipo: config.tipo,
    codigo: config.codigo,
    productos,
    total: rows.length,
    total_pares_muestra: totalPares,
    unidad: "molecula_fk",
  });
}

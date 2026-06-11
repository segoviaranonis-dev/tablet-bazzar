#!/usr/bin/env node
/**
 * Test: Ejecutar TODAS las 7 queries del endpoint /filtros
 */
import pg from 'pg';
const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: DATABASE_URL });

const tabla = 'deposito_tienda_fernando_adultos';

async function testAllQueries() {
  console.log('🧪 Probando las 7 queries del endpoint /filtros...\n');

  const queries = [
    {
      name: '1. Chips Género',
      sql: `
        SELECT
          COALESCE(NULLIF(btrim(g.descripcion::text), ''), '(sin género)') AS id,
          COUNT(*)::int AS cnt
        FROM public.${tabla} s
        LEFT JOIN public.genero g ON g.id = s.genero_id
        WHERE s.cantidad > 0
          AND COALESCE(NULLIF(btrim(g.descripcion::text), ''), '(sin género)') <> '(sin género)'
        GROUP BY 1 ORDER BY 1
      `
    },
    {
      name: '2. Chips Marcas',
      sql: `
        SELECT
          COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') AS id,
          COUNT(*)::int AS cnt
        FROM public.${tabla} s
        LEFT JOIN public.marca_v2 mv ON mv.id_marca = s.marca_id
        WHERE s.cantidad > 0
        GROUP BY 1 ORDER BY 1
      `
    },
    {
      name: '3. Chips Estilo',
      sql: `
        SELECT
          COALESCE(NULLIF(btrim(ge.descp_grupo_estilo::text), ''), '(sin estilo)') AS id,
          COUNT(*)::int AS cnt
        FROM public.${tabla} s
        LEFT JOIN public.grupo_estilo_v2 ge ON ge.id_grupo_estilo = s.grupo_estilo_id
        WHERE s.cantidad > 0
          AND COALESCE(NULLIF(btrim(ge.descp_grupo_estilo::text), ''), '(sin estilo)') <> '(sin estilo)'
        GROUP BY 1 ORDER BY 1
      `
    },
    {
      name: '4. Chips Tipo',
      sql: `
        SELECT
          COALESCE(NULLIF(btrim(tv.descp_tipo::text), ''), '(sin tipo)') AS id,
          COUNT(*)::int AS cnt
        FROM public.${tabla} s
        LEFT JOIN public.tipo_v2 tv ON tv.id_tipo = s.tipo_v2_id
        WHERE s.cantidad > 0
        GROUP BY 1 ORDER BY 1
      `
    },
    {
      name: '5. Marcas Agregado',
      sql: `
        SELECT
          COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') AS marca,
          COUNT(*)::int AS skus,
          COALESCE(SUM(s.cantidad::float8), 0)::float8 AS pares
        FROM public.${tabla} s
        LEFT JOIN public.marca_v2 mv ON mv.id_marca = s.marca_id
        WHERE s.cantidad > 0
        GROUP BY 1
        ORDER BY 1
      `
    },
    {
      name: '6. Referencias Agregado',
      sql: `
        SELECT * FROM (
          SELECT
            trim(s.linea_codigo_proveedor::text) || '|' || trim(s.referencia_codigo_proveedor::text) AS key,
            trim(s.linea_codigo_proveedor::text) AS linea,
            trim(s.referencia_codigo_proveedor::text) AS referencia,
            COALESCE(NULLIF(btrim(ge.descp_grupo_estilo::text), ''), '—') AS estilo,
            COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') AS marca,
            COALESCE(SUM(s.cantidad::float8), 0)::float8 AS pares,
            COUNT(*)::int AS skus
          FROM public.${tabla} s
          LEFT JOIN public.marca_v2 mv ON mv.id_marca = s.marca_id
          LEFT JOIN public.grupo_estilo_v2 ge ON ge.id_grupo_estilo = s.grupo_estilo_id
          WHERE s.cantidad > 0
          GROUP BY 1, 2, 3, 4, 5
        ) refs
        ORDER BY NULLIF(refs.linea, '')::bigint NULLS LAST, NULLIF(refs.referencia, '')::bigint NULLS LAST
        LIMIT 500
      `
    },
    {
      name: '7. Resumen Depósito',
      sql: `
        SELECT
          COUNT(*) FILTER (WHERE cantidad > 0)::int AS skus,
          COALESCE(SUM(cantidad) FILTER (WHERE cantidad > 0), 0)::float8 AS pares,
          MAX(COALESCE(s.created_at, NOW())) AS ultima_carga
        FROM public.${tabla} s
      `
    }
  ];

  for (const q of queries) {
    try {
      console.log(`\n▶️  ${q.name}`);
      const t0 = Date.now();
      const result = await pool.query(q.sql);
      const ms = Date.now() - t0;
      console.log(`   ✅ OK - ${result.rows.length} filas en ${ms}ms`);
      if (result.rows.length <= 5) {
        console.table(result.rows);
      }
    } catch (error) {
      console.error(`\n   ❌ ERROR en ${q.name}:`);
      console.error(`   Mensaje: ${error.message}`);
      console.error(`   Detalle: ${error.detail || 'N/A'}`);
      if (error.position) {
        console.error(`   Posición: ${error.position}`);
      }
    }
  }

  await pool.end();
  console.log('\n✅ Test completado');
}

testAllQueries();

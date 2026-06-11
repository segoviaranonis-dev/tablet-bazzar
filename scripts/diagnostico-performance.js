#!/usr/bin/env node
/**
 * Diagnóstico: Performance de queries /filtros
 * Medir tiempo de cada una de las 7 queries
 */
import pg from 'pg';
const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: DATABASE_URL });
const tabla = 'deposito_tienda_fernando_adultos';

async function diagnosticarPerformance() {
  console.log('🔍 Diagnosticando performance de queries...\n');

  const queries = [
    {
      name: 'Chips Género',
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
      name: 'Chips Marcas',
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
      name: 'Chips Estilo',
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
      name: 'Referencias Agregado (PESADA)',
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
    }
  ];

  console.log('Ejecutando queries individuales...\n');

  for (const q of queries) {
    const t0 = Date.now();
    try {
      const result = await pool.query(q.sql);
      const ms = Date.now() - t0;
      const speed = ms < 100 ? '🟢 RÁPIDA' : ms < 500 ? '🟡 MEDIA' : '🔴 LENTA';
      console.log(`${speed} ${q.name}: ${ms}ms (${result.rows.length} filas)`);
    } catch (error) {
      console.error(`❌ ${q.name}: ${error.message}`);
    }
  }

  console.log('\n🔬 Analizando EXPLAIN de query más pesada...\n');

  const explainQuery = `
    EXPLAIN ANALYZE
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
  `;

  try {
    const result = await pool.query(explainQuery);
    console.log(result.rows.map(r => r['QUERY PLAN']).join('\n'));
  } catch (error) {
    console.error(`Error en EXPLAIN: ${error.message}`);
  }

  await pool.end();
  console.log('\n✅ Diagnóstico completado');
}

diagnosticarPerformance();

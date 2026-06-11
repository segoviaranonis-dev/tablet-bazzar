#!/usr/bin/env node
/**
 * Test: Ejecutar query exacta que falla en /api/deposito/filtros
 */
import pg from 'pg';
const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: DATABASE_URL });

async function testQuery() {
  console.log('🧪 Probando query de filtros...\n');

  try {
    // Query exacta de sqlChipsTipo
    const query = `
      SELECT
        COALESCE(NULLIF(btrim(tv.descp_tipo::text), ''), '(sin tipo)') AS id,
        COUNT(*)::int AS cnt
      FROM public.deposito_tienda_fernando_adultos s
      LEFT JOIN public.material mat ON mat.id = s.material_id
      LEFT JOIN public.color col ON col.id = s.color_id
      LEFT JOIN public.marca_v2 mv ON mv.id_marca = s.marca_id
      LEFT JOIN public.genero g ON g.id = s.genero_id
      LEFT JOIN public.grupo_estilo_v2 ge ON ge.id_grupo_estilo = s.grupo_estilo_id
      LEFT JOIN public.tipo_v2 tv ON tv.id_tipo = s.tipo_v2_id
      WHERE s.cantidad > 0
      GROUP BY 1 ORDER BY 1
    `;

    console.log('Ejecutando query sqlChipsTipo...');
    const result = await pool.query(query);
    console.log(`✅ Query OK - ${result.rows.length} filas\n`);
    console.table(result.rows);

    await pool.end();
  } catch (error) {
    console.error('\n❌ ERROR en query:');
    console.error('Mensaje:', error.message);
    console.error('Detalle:', error.detail);
    console.error('Hint:', error.hint);
    console.error('\nStack:', error.stack);
    await pool.end();
    process.exit(1);
  }
}

testQuery();

#!/usr/bin/env node
/**
 * Test: Reproducir bug de búsqueda "1184" + marca VIZZANO
 */
import pg from 'pg';
const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: DATABASE_URL });
const tabla = 'deposito_tienda_fernando_adultos';

async function testBug() {
  console.log('🐛 Reproduciendo bug: buscar="1184" + marca="VIZZANO"\n');

  // Query que DEBERÍA ejecutarse en /api/deposito/cadena
  const query = `
    SELECT
      s.linea_id,
      s.referencia_id,
      s.material_id,
      s.color_id,
      s.cantidad,
      trim(s.linea_codigo_proveedor::text) AS linea,
      trim(s.referencia_codigo_proveedor::text) AS referencia,
      COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') AS marca
    FROM public.${tabla} s
    LEFT JOIN public.marca_v2 mv ON mv.id_marca = s.marca_id
    WHERE s.cantidad > 0
      AND (
        trim(s.linea_codigo_proveedor::text) ILIKE $1
        OR trim(s.referencia_codigo_proveedor::text) ILIKE $1
        OR (trim(s.linea_codigo_proveedor::text) || '.' || trim(s.referencia_codigo_proveedor::text)) ILIKE $1
        OR COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '') ILIKE $1
      )
      AND COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') = $2
    LIMIT 20
  `;

  const params = ['%1184%', 'VIZZANO'];

  try {
    console.log('Ejecutando query con buscar=%1184% y marca=VIZZANO...\n');
    const result = await pool.query(query, params);

    console.log(`✅ Query OK - ${result.rows.length} filas encontradas\n`);

    if (result.rows.length === 0) {
      console.log('❌ BUG CONFIRMADO: No hay resultados\n');
      console.log('Probando SIN filtro de marca...\n');

      const querySinMarca = query.replace(
        'AND COALESCE(NULLIF(btrim(mv.descp_marca::text), \'\'), \'(sin marca)\') = $2',
        ''
      );
      const result2 = await pool.query(querySinMarca, ['%1184%']);
      console.log(`Resultados SIN filtro marca: ${result2.rows.length} filas\n`);

      if (result2.rows.length > 0) {
        console.log('Marcas encontradas:');
        const marcas = [...new Set(result2.rows.map(r => r.marca))];
        marcas.forEach(m => console.log(`  - ${m}`));
      }
    } else {
      console.log('Referencias encontradas:');
      console.table(result.rows.map(r => ({
        linea: r.linea,
        ref: r.referencia,
        marca: r.marca,
        cant: r.cantidad
      })));
    }

    await pool.end();
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    await pool.end();
    process.exit(1);
  }
}

testBug();
#!/usr/bin/env node
/**
 * Diagnóstico: Verificar columnas tipo en deposito_2_fernando_adultos_tienda
 */
import pg from 'pg';
const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL no configurada');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function diagnostico() {
  console.log('🔍 Verificando columnas con "tipo" en deposito_2_fernando_adultos_tienda...\n');

  try {
    // Query 1: Columnas con "tipo"
    const res1 = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'deposito_2_fernando_adultos_tienda'
        AND column_name LIKE '%tipo%'
      ORDER BY column_name;
    `);

    console.log('📊 Columnas encontradas:');
    if (res1.rows.length === 0) {
      console.log('  ⚠️  No hay columnas con "tipo"');
    } else {
      res1.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type})`);
      });
    }

    // Query 2: Ver si existe tabla tipo_v2
    const res2 = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename LIKE '%tipo%'
      ORDER BY tablename;
    `);

    console.log('\n📋 Tablas con "tipo":');
    if (res2.rows.length === 0) {
      console.log('  ⚠️  No hay tablas con "tipo"');
    } else {
      res2.rows.forEach(row => {
        console.log(`  - ${row.tablename}`);
      });
    }

    // Query 3: Ver TODAS las columnas FK para entender estructura
    const res3 = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'deposito_2_fernando_adultos_tienda'
        AND column_name LIKE '%_id'
      ORDER BY column_name;
    `);

    console.log('\n🔗 Columnas FK (_id):');
    res3.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });

    // Query 4: Sample de datos para ver qué hay
    const res4 = await pool.query(`
      SELECT
        linea_id, referencia_id, material_id, color_id,
        marca_id, genero_id, grupo_estilo_id,
        cantidad
      FROM deposito_2_fernando_adultos_tienda
      WHERE cantidad > 0
      LIMIT 3;
    `);

    console.log('\n📦 Sample de datos (3 filas):');
    console.table(res4.rows);

    await pool.end();
    console.log('\n✅ Diagnóstico completado');
  } catch (error) {
    console.error('\n❌ Error ejecutando queries:');
    console.error(error.message);
    await pool.end();
    process.exit(1);
  }
}

diagnostico();

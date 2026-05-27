"""
OT-009 Paso 1: Seleccionar 3 SKUs de muestra
"""

import psycopg2

conn = psycopg2.connect(
    host='aws-1-sa-east-1.pooler.supabase.com',
    port=6543,
    dbname='postgres',
    user='postgres.extrlcvcgypwazxipvqm',
    password='IJoFJbT8Qj0Q0w5m'
)
cur = conn.cursor()

print("="*70)
print("OT-009 PASO 1: Seleccionar 3 SKUs Muestra")
print("="*70)
print()

cur.execute("""
    SELECT pp_id, pp_nro, det_id, descp_marca, linea_codigo, referencia_codigo,
           material_code, descp_color, cantidad_pares
    FROM public.v_stock_rimec
    WHERE cajas_disponibles > 0
    ORDER BY descp_marca, linea_codigo
    LIMIT 3
""")

muestras = cur.fetchall()

print(f"Total muestras: {len(muestras)}")
print()

if muestras:
    print("SKUs seleccionados:")
    print("-"*70)
    for i, row in enumerate(muestras, 1):
        pp_id, pp_nro, det_id, marca, linea, ref, material, color, pares = row
        print(f"\nSKU {i}:")
        print(f"  det_id: {det_id}")
        print(f"  pp_id: {pp_id}")
        print(f"  pp_nro: {pp_nro}")
        print(f"  Marca: {marca}")
        print(f"  Linea: {linea}")
        print(f"  Referencia: {ref}")
        print(f"  Material: {material}")
        print(f"  Color: {color}")
        print(f"  Pares: {pares}")
else:
    print("ERROR: No se encontraron SKUs con stock disponible")

conn.close()

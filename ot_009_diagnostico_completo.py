"""
OT-009: Diagnóstico completo de cadena de precios para 3 SKUs
"""

import psycopg2
import json

conn = psycopg2.connect(
    host='aws-1-sa-east-1.pooler.supabase.com',
    port=6543,
    dbname='postgres',
    user='postgres.extrlcvcgypwazxipvqm',
    password='IJoFJbT8Qj0Q0w5m'
)
cur = conn.cursor()

# SKUs a diagnosticar
skus = [
    {"sku_num": 1, "det_id": 60, "pp_id": 1},
    {"sku_num": 2, "det_id": 61, "pp_id": 1},
    {"sku_num": 3, "det_id": 441, "pp_id": 4}
]

resultados = {}

for sku in skus:
    sku_num = sku["sku_num"]
    det_id = sku["det_id"]
    pp_id = sku["pp_id"]

    print("="*70)
    print(f"SKU {sku_num}: det_id={det_id}, pp_id={pp_id}")
    print("="*70)
    print()

    resultado = {
        "det_id": det_id,
        "pp_id": pp_id,
        "pasos": {}
    }

    # PASO 1: PP estado
    print("PASO 1: Verificar estado del PP...")
    cur.execute("""
        SELECT id, numero_registro, estado, proveedor_importacion_id
        FROM public.pedido_proveedor
        WHERE id = %s
    """, (pp_id,))

    paso1 = cur.fetchone()
    if paso1:
        pp_id_res, pp_nro, pp_estado, proveedor_id = paso1
        print(f"  PP ID: {pp_id_res}")
        print(f"  Numero: {pp_nro}")
        print(f"  Estado: {pp_estado}")
        print(f"  Proveedor ID: {proveedor_id}")
        paso1_pass = pp_estado in ('ABIERTO', 'ENVIADO')
        print(f"  RESULTADO: {'PASS' if paso1_pass else 'FAIL'}")

        resultado["pasos"]["paso1"] = {
            "pass": paso1_pass,
            "estado": pp_estado,
            "proveedor_id": proveedor_id
        }
    else:
        print("  ERROR: PP no encontrado")
        resultado["pasos"]["paso1"] = {"pass": False, "error": "PP no encontrado"}

    print()

    # PASO 2: intencion_compra_pedido + evento
    print("PASO 2: Verificar intencion_compra_pedido y evento...")
    cur.execute("""
        SELECT icp.id, icp.pedido_proveedor_id, icp.intencion_compra_id, icp.precio_evento_id,
               ic.id_marca AS ic_marca,
               (SELECT id_marca FROM public.pedido_proveedor_detalle WHERE id = %s) AS ppd_marca
        FROM public.intencion_compra_pedido icp
        JOIN public.intencion_compra ic ON ic.id = icp.intencion_compra_id
        WHERE icp.pedido_proveedor_id = %s
    """, (det_id, pp_id))

    paso2 = cur.fetchone()
    precio_evento_id = None

    if paso2:
        icp_id, icp_pp_id, ic_id, evento_id, ic_marca, ppd_marca = paso2
        print(f"  ICP ID: {icp_id}")
        print(f"  IC ID: {ic_id}")
        print(f"  Precio Evento ID: {evento_id}")
        print(f"  IC Marca: {ic_marca}")
        print(f"  PPD Marca: {ppd_marca}")
        paso2_pass = evento_id is not None
        print(f"  RESULTADO: {'PASS' if paso2_pass else 'FAIL'}")

        precio_evento_id = evento_id
        resultado["pasos"]["paso2"] = {
            "pass": paso2_pass,
            "precio_evento_id": evento_id,
            "ic_marca": ic_marca,
            "ppd_marca": ppd_marca
        }
    else:
        print("  NO hay intencion_compra_pedido para este PP")
        print("  RESULTADO: FAIL")
        resultado["pasos"]["paso2"] = {"pass": False, "error": "Sin ICP"}

    print()

    # PASO 3: Match de linea
    print("PASO 3: Match de codigo de linea...")
    cur.execute("""
        SELECT ppd.id AS det_id, ppd.linea AS codigo_linea_pp,
               l.id AS linea_id, l.codigo_proveedor AS codigo_linea_tabla,
               pp.proveedor_importacion_id AS proveedor_pp,
               l.proveedor_id AS proveedor_linea
        FROM public.pedido_proveedor_detalle ppd
        JOIN public.pedido_proveedor pp ON pp.id = ppd.pedido_proveedor_id
        LEFT JOIN public.linea l
          ON l.codigo_proveedor::text = ppd.linea
         AND l.proveedor_id = pp.proveedor_importacion_id
        WHERE ppd.id = %s
    """, (det_id,))

    paso3 = cur.fetchone()
    linea_id = None

    if paso3:
        det, cod_pp, lid, cod_tabla, prov_pp, prov_linea = paso3
        print(f"  Codigo Linea PP: {cod_pp}")
        print(f"  Linea ID resuelto: {lid}")
        print(f"  Codigo Linea Tabla: {cod_tabla}")
        print(f"  Proveedor PP: {prov_pp}")
        print(f"  Proveedor Linea: {prov_linea}")
        paso3_pass = lid is not None
        print(f"  RESULTADO: {'PASS' if paso3_pass else 'FAIL'}")

        linea_id = lid
        resultado["pasos"]["paso3"] = {
            "pass": paso3_pass,
            "linea_id": lid,
            "codigo_pp": cod_pp,
            "codigo_tabla": cod_tabla
        }
    else:
        print("  ERROR: No se pudo ejecutar query")
        resultado["pasos"]["paso3"] = {"pass": False, "error": "Query fail"}

    print()

    # PASO 4: Match de referencia
    print("PASO 4: Match de codigo de referencia...")
    cur.execute("""
        SELECT ppd.id AS det_id, ppd.referencia AS codigo_ref_pp,
               r.id AS referencia_id, r.codigo_proveedor AS codigo_ref_tabla, r.linea_id
        FROM public.pedido_proveedor_detalle ppd
        JOIN public.pedido_proveedor pp ON pp.id = ppd.pedido_proveedor_id
        LEFT JOIN public.linea l ON l.codigo_proveedor::text = ppd.linea AND l.proveedor_id = pp.proveedor_importacion_id
        LEFT JOIN public.referencia r ON r.codigo_proveedor::text = ppd.referencia AND r.linea_id = l.id
        WHERE ppd.id = %s
    """, (det_id,))

    paso4 = cur.fetchone()
    referencia_id = None

    if paso4:
        det, cod_pp, rid, cod_tabla, r_linea_id = paso4
        print(f"  Codigo Ref PP: {cod_pp}")
        print(f"  Referencia ID resuelto: {rid}")
        print(f"  Codigo Ref Tabla: {cod_tabla}")
        print(f"  Linea ID (de ref): {r_linea_id}")
        paso4_pass = rid is not None
        print(f"  RESULTADO: {'PASS' if paso4_pass else 'FAIL'}")

        referencia_id = rid
        resultado["pasos"]["paso4"] = {
            "pass": paso4_pass,
            "referencia_id": rid,
            "codigo_pp": cod_pp,
            "codigo_tabla": cod_tabla
        }
    else:
        print("  ERROR: No se pudo ejecutar query")
        resultado["pasos"]["paso4"] = {"pass": False, "error": "Query fail"}

    print()

    # PASO 5: Match de material
    print("PASO 5: Match de codigo de material...")
    cur.execute("""
        SELECT ppd.id AS det_id, ppd.material_code AS codigo_mat_pp,
               m.id AS material_id, m.codigo_proveedor AS codigo_mat_tabla,
               m.proveedor_id AS proveedor_material
        FROM public.pedido_proveedor_detalle ppd
        JOIN public.pedido_proveedor pp ON pp.id = ppd.pedido_proveedor_id
        LEFT JOIN public.material m
          ON m.codigo_proveedor::text = ppd.material_code
         AND m.proveedor_id = pp.proveedor_importacion_id
        WHERE ppd.id = %s
    """, (det_id,))

    paso5 = cur.fetchone()
    material_id = None

    if paso5:
        det, cod_pp, mid, cod_tabla, prov_mat = paso5
        print(f"  Codigo Material PP: {cod_pp}")
        print(f"  Material ID resuelto: {mid}")
        print(f"  Codigo Material Tabla: {cod_tabla}")
        print(f"  Proveedor Material: {prov_mat}")
        paso5_pass = mid is not None
        print(f"  RESULTADO: {'PASS' if paso5_pass else 'FAIL'}")

        material_id = mid
        resultado["pasos"]["paso5"] = {
            "pass": paso5_pass,
            "material_id": mid,
            "codigo_pp": cod_pp,
            "codigo_tabla": cod_tabla
        }
    else:
        print("  ERROR: No se pudo ejecutar query")
        resultado["pasos"]["paso5"] = {"pass": False, "error": "Query fail"}

    print()

    # PASO 6: Buscar en precio_lista
    print("PASO 6: Buscar fila en precio_lista...")

    if all([precio_evento_id, linea_id, referencia_id, material_id]):
        cur.execute("""
            SELECT pl.id, pl.evento_id, pl.linea_id, pl.referencia_id, pl.material_id,
                   pl.lpn, pl.lpc02, pl.caso_id, pl.nombre_caso_aplicado
            FROM public.precio_lista pl
            WHERE pl.evento_id = %s
              AND pl.linea_id = %s
              AND pl.referencia_id = %s
              AND pl.material_id = %s
        """, (precio_evento_id, linea_id, referencia_id, material_id))

        paso6 = cur.fetchone()

        if paso6:
            pl_id, pl_ev, pl_lin, pl_ref, pl_mat, lpn, lpc02, caso_id, caso_nom = paso6
            print(f"  Precio Lista ID: {pl_id}")
            print(f"  LPN: {lpn}")
            print(f"  Caso ID: {caso_id}")
            print(f"  Caso Nombre: {caso_nom}")
            print(f"  RESULTADO: PASS")

            resultado["pasos"]["paso6"] = {
                "pass": True,
                "precio_lista_id": pl_id,
                "lpn": float(lpn) if lpn else None,
                "caso_nom": caso_nom
            }
        else:
            print(f"  NO encontrado con evento={precio_evento_id}, linea={linea_id}, ref={referencia_id}, mat={material_id}")
            print(f"  RESULTADO: FAIL")

            resultado["pasos"]["paso6"] = {"pass": False}

            # PASO 6b: buscar sin material
            print("\n  PASO 6b: Buscar sin material...")
            cur.execute("""
                SELECT pl.id, pl.linea_id, pl.referencia_id, pl.material_id, pl.lpn
                FROM public.precio_lista pl
                WHERE pl.evento_id = %s
                  AND pl.linea_id = %s
                  AND pl.referencia_id = %s
                LIMIT 5
            """, (precio_evento_id, linea_id, referencia_id))

            paso6b = cur.fetchall()
            if paso6b:
                print(f"    Encontrados {len(paso6b)} registros (mismo evento/linea/ref, diferente material):")
                for row in paso6b:
                    print(f"      ID={row[0]}, material_id={row[3]}, lpn={row[4]}")
                resultado["pasos"]["paso6b"] = {"pass": True, "count": len(paso6b)}
            else:
                print("    Ningun registro encontrado")
                resultado["pasos"]["paso6b"] = {"pass": False}

            # PASO 6c: buscar en cualquier evento
            print("\n  PASO 6c: Buscar en cualquier evento...")
            cur.execute("""
                SELECT pl.id, pl.evento_id, pl.linea_id, pl.referencia_id, pl.material_id, pl.lpn
                FROM public.precio_lista pl
                WHERE pl.linea_id = %s
                  AND pl.referencia_id = %s
                LIMIT 5
            """, (linea_id, referencia_id))

            paso6c = cur.fetchall()
            if paso6c:
                print(f"    Encontrados {len(paso6c)} registros (misma linea/ref, cualquier evento):")
                for row in paso6c:
                    print(f"      ID={row[0]}, evento_id={row[1]}, material_id={row[4]}, lpn={row[5]}")
                resultado["pasos"]["paso6c"] = {"pass": True, "count": len(paso6c)}
            else:
                print("    Ningun registro encontrado")
                resultado["pasos"]["paso6c"] = {"pass": False}
    else:
        print("  NO se puede ejecutar - faltan IDs previos")
        print(f"    evento_id: {precio_evento_id}")
        print(f"    linea_id: {linea_id}")
        print(f"    referencia_id: {referencia_id}")
        print(f"    material_id: {material_id}")
        print(f"  RESULTADO: FAIL")
        resultado["pasos"]["paso6"] = {"pass": False, "error": "IDs faltantes"}

    print()
    resultados[f"sku_{sku_num}"] = resultado

conn.close()

# Guardar resultados
with open('C:\\Users\\hecto\\Nexus_Core\\ot_009_resultados.json', 'w') as f:
    json.dump(resultados, f, indent=2)

print("="*70)
print("DIAGNOSTICO COMPLETO")
print("Resultados guardados en: ot_009_resultados.json")
print("="*70)

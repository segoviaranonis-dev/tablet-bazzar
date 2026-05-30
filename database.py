import pymysql
from datetime import datetime # Importar solo si es necesario para lógica de DB; de lo contrario, se maneja en UI

def connect_to_database():
    """
    Establece una conexión con la base de datos MySQL.
    Incluye manejo de errores y timeouts para una conexión más robusta.
    """
    try:
        conexion = pymysql.connect(
            host="shuttle.proxy.rlwy.net",
            port=58671,
            user="root",
            password="GzkTkrNgjKrAWPIPGiOcRBoXMbekllCV",
            database="railway",
            connect_timeout=10,  # Tiempo de espera para establecer la conexión
            read_timeout=30,     # Tiempo de espera para leer datos (aumentado para consultas grandes)
            write_timeout=10     # Tiempo de espera para escribir datos
        )
        print("Conexión a la base de datos exitosa.")
        return conexion
    except pymysql.MySQLError as e:
        print(f"ERROR: No se pudo conectar a la base de datos. Detalle: {e}")
        return None

def fetch_marcas_categoria_1(conexion):
    """
    Recupera todas las marcas que pertenecen a la categoría 1.
    """
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor: # Usar DictCursor para consistencia
            query = "SELECT ID_MARCA, DESCRIPCION_MARCA FROM marca WHERE ID_CATEGORIA = 1"
            cursor.execute(query)
            return cursor.fetchall()
    except Exception as e:
        print(f"ERROR: Fallo al recuperar marcas de categoría 1. Detalle: {e}")
        return []

def fetch_cliente_descripcion(conexion, id_cliente):
    """
    Recupera la descripción de un cliente dado su ID.
    """
    try:
        with conexion.cursor() as cursor:
            query = "SELECT DESCRIPCION_CLIENTE FROM puntos_venta WHERE ID_CLIENTE = %s;"
            cursor.execute(query, (id_cliente,))
            result = cursor.fetchone()
            return result[0] if result else None
    except Exception as e:
        print(f"ERROR: Fallo al recuperar descripción del cliente con ID {id_cliente}. Detalle: {e}")
        return None

def fetch_points_with_filters(conexion, fecha_inicio, fecha_fin, cliente, marca=None, linea=None, referencia=None, id_categoria=None):
    """
    Recupera todos los registros de ventas relevantes para un cliente en un rango de fechas
    y una marca específica. Esta función es la fuente de datos principal para el reporte.
    
    Importante: No aplica el filtro 'referencia' (IMAGEN) a nivel de DB aquí.
    Ese filtro se manejará en la capa de UI (Python) después de obtener estos datos base,
    lo que permite que el autocompletado funcione con el conjunto completo de imágenes
    para los filtros principales.
    
    No filtra por PREVENTA para incluir todas las compras (PREVENTA = 1, 2 y 3).
    """
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            params = []

            # Nota: La CTE 'ultima_venta_por_cliente' no se utiliza en el SELECT final
            # de esta consulta. Si su propósito es solo para el ordenamiento o un dato
            # que no se muestra, podría considerarse su eliminación para simplificar
            # la consulta si no es estrictamente necesaria para el resultado final.
            # Sin embargo, la mantengo si tiene un uso conceptual más allá de esta función.
            cte_query = """
            WITH ultima_venta_por_cliente AS (
                SELECT ID_CLIENTE, MAX(FECHA) AS ULTIMA_FECHA
                FROM ventas
                GROUP BY ID_CLIENTE
            )
            """
            
            # Columnas a seleccionar para el reporte completo
            # Asegúrate de que 'IMAGEN' esté presente para el manejo de fotos en el PDF
            query_parts = [
                "SELECT",
                "v.ID_CLIENTE,",
                "pv.DESCRIPCION_CLIENTE,",
                "v.FECHA,",
                "v.CANTIDAD,",
                "v.PREVENTA,",
                "m.DESCRIPCION_MARCA,",
                "v.IMAGEN,",
                "v.ID_TIPO,",
                "t.DESCRIPCION_TIPO AS DESC_TIPO" # Renombrado para claridad en el DictCursor
            ]

            # Uniones necesarias para obtener toda la información
            query_parts.append("FROM ventas v") # Empezamos por ventas ya que es la tabla central
            query_parts.append("LEFT JOIN puntos_venta pv ON v.ID_CLIENTE = pv.ID_CLIENTE")
            query_parts.append("LEFT JOIN marca m ON v.ID_MARCA = m.ID_MARCA")
            query_parts.append("LEFT JOIN tipo t ON v.ID_TIPO = t.ID_TIPO")
            # Si 'ultima_venta_por_cliente' no se usa en el SELECT, su LEFT JOIN no es necesario aquí
            # query_parts.append("LEFT JOIN ultima_venta_por_cliente uv ON pv.ID_CLIENTE = uv.ID_CLIENTE")

            # Cláusula WHERE para los filtros principales
            where_conditions = ["v.FECHA BETWEEN %s AND %s", "v.ID_CLIENTE = %s"]
            params.extend([fecha_inicio, fecha_fin, cliente])

            if marca:
                where_conditions.append("v.ID_MARCA = %s") # Filtrar directamente por ID_MARCA en ventas
                params.append(marca)

            # --- NOTA IMPORTANTE: El filtro 'referencia' (IMAGEN) NO se aplica aquí ---
            # if referencia:
            #     where_conditions.append("v.IMAGEN LIKE %s")
            #     params.append(f"%{referencia}%")

            # El filtro ID_CATEGORIA también se asume como aplicado vía ID_MARCA si es pertinente
            # o se añadiría aquí si se usara un ComboBox de categoría en la UI directamente.
            # if id_categoria:
            #     where_conditions.append("m.ID_CATEGORIA = %s") # O v.ID_CATEGORIA si la tabla ventas lo tiene
            #     params.append(id_categoria)

            query_parts.append("WHERE " + " AND ".join(where_conditions))
            
            # Ordenar para una presentación consistente en el PDF
            # Ordenar por cliente, fecha y luego por imagen para agrupar visualmente
            query_parts.append("ORDER BY v.ID_CLIENTE, v.FECHA, v.IMAGEN")

            full_query = cte_query + " " + " ".join(query_parts)

            print("\n--- Consulta SQL Generada ---")
            print(full_query)
            print(f"--- Parámetros: {params} ---\n")

            cursor.execute(full_query, tuple(params))
            return cursor.fetchall()

    except pymysql.MySQLError as e:
        print(f"ERROR: Fallo en la consulta fetch_points_with_filters. Detalle: {e}")
        return []
    except Exception as e:
        print(f"ERROR: Error inesperado en fetch_points_with_filters. Detalle: {e}")
        return []
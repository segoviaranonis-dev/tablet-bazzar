from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import os
from reportlab.lib.units import inch, cm
import sys
from PyQt5.QtWidgets import QMessageBox # Mantener para mensajes de error si es necesario
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from datetime import datetime # Importar para formatear fechas de forma más robusta

def resource_path(relative_path):
    """
    Obtiene la ruta absoluta al recurso, funciona tanto para desarrollo
    como para la aplicación empaquetada con PyInstaller.
    """
    try:
        base_path = sys._MEIPASS
    except AttributeError:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# Definición de constantes para PREVENTA
VENTA = 1
TRANSITO_VALORES = [2, 3] # Representa TRANSITO para PREVENTA = 2 y PREVENTA = 3

def obtener_tipo_venta(preventa):
    """
    Devuelve el tipo de venta (VENTA o TRANSITO) basado en el valor de PREVENTA.
    """
    if preventa == VENTA:
        return "VENTA"
    elif preventa in TRANSITO_VALORES:
        return "TRANSITO"
    else:
        return "DESCONOCIDO"

def formatear_fecha_pdf(fecha):
    """
    Convierte una fecha en formato YYYY-MM-DD (cadena) o un objeto datetime.date
    a DD/MM/YYYY para su presentación en el PDF.
    """
    if isinstance(fecha, str):
        try:
            # Asume que la cadena está en YYYY-MM-DD (formato ISO para la DB)
            dt_obj = datetime.strptime(fecha, "%Y-%m-%d").date()
            return dt_obj.strftime("%d/%m/%Y")
        except ValueError:
            return "Fecha Inválida"
    elif isinstance(fecha, datetime): # Si es un objeto datetime.datetime
        return fecha.strftime("%d/%m/%Y")
    elif hasattr(fecha, 'strftime'): # Si es un objeto datetime.date
        return fecha.strftime("%d/%m/%Y")
    return "Fecha Inválida"

def generate_pdf(parent_window, datos, fecha_inicio, fecha_fin, nombre_cliente, descripcion_marca, buscador, output_path, nombre_imagen_principal=None, ubicacion_fotos=None):
    """
    Genera un informe PDF detallado con los datos de ventas y tránsito.
    Incluye información del cliente, fechas, marca, contadores y una tabla con imágenes.
    """
    print("Iniciando la generación del PDF...")
    
    # Configuración del documento
    doc = SimpleDocTemplate(output_path, pagesize=letter,
                            topMargin=1.5*cm, bottomMargin=1.5*cm,
                            leftMargin=1.5*cm, rightMargin=1.5*cm)
    elements = []

    # Estilos de párrafo
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='TitleStyle', parent=styles['h1'], alignment=1, fontSize=24, spaceAfter=14, textColor=colors.darkblue))
    styles.add(ParagraphStyle(name='SubtitleStyle', parent=styles['h2'], alignment=1, fontSize=16, spaceAfter=8, textColor=colors.gray))
    styles.add(ParagraphStyle(name='HeaderInfo', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, spaceAfter=4))
    styles.add(ParagraphStyle(name='NormalText', parent=styles['Normal'], fontSize=9, spaceAfter=2))
    styles.add(ParagraphStyle(name='RightAlignedBold', parent=styles['Normal'], fontName='Helvetica-Bold', alignment=2, fontSize=10, spaceAfter=2))
    styles.add(ParagraphStyle(name='ImagePlaceholder', parent=styles['Normal'], alignment=1, fontSize=8, textColor=colors.red)) # Para texto de imagen no encontrada

    # --- Encabezado del Informe ---
    elements.append(Paragraph("INFORME DETALLADO DE COMPRAS Y TRÁNSITO", styles['TitleStyle']))
    elements.append(Paragraph("Análisis de Movimientos de Productos por Cliente y Periodo", styles['SubtitleStyle']))
    elements.append(Spacer(1, 0.5*cm))

    # Información del cliente y fechas
    # Se asume que 'datos' no estará vacío aquí si las validaciones en UI.py fueron exitosas
    cliente_id_display = datos[0].get('ID_CLIENTE') if datos and datos[0].get('ID_CLIENTE') else 'N/A'
    elements.append(Paragraph(f"<b>Cliente:</b> {nombre_cliente} (ID: {cliente_id_display})", styles['HeaderInfo']))
    elements.append(Paragraph(f"<b>Marca Seleccionada:</b> {descripcion_marca}", styles['HeaderInfo']))

    fecha_inicio_formateada = formatear_fecha_pdf(fecha_inicio)
    fecha_fin_formateada = formatear_fecha_pdf(fecha_fin)
    elements.append(Paragraph(f"<b>Periodo del Informe:</b> {fecha_inicio_formateada} al {fecha_fin_formateada}", styles['HeaderInfo']))
    
    if buscador:
        elements.append(Paragraph(f"<b>Filtro de Buscador (Referencia):</b> {buscador}", styles['HeaderInfo']))
    elements.append(Spacer(1, 0.7*cm))

    # --- Procesamiento de Datos para la Tabla ---
    # Los 'datos' ya vienen filtrados por el 'buscador' desde ui.py
    # Solo necesitamos ordenarlos para una presentación coherente.
    sorted_data = sorted(datos, key=lambda x: (x.get('IMAGEN', ''), x.get('FECHA', '')))

    # Calcular los contadores
    total_cantidad = 0
    total_ventas = 0
    total_transito = 0
    cantidad_articulos_unicos = set() # Usar un set para contar artículos únicos por IMAGEN

    for item in sorted_data:
        cantidad = item.get('CANTIDAD', 0)
        total_cantidad += cantidad
        preventa = item.get('PREVENTA')
        
        if preventa == VENTA:
            total_ventas += cantidad
        elif preventa in TRANSITO_VALORES:
            total_transito += cantidad
        
        if item.get('IMAGEN'): # Asegurarse de que la imagen no sea nula antes de añadir al set
            cantidad_articulos_unicos.add(item.get('IMAGEN'))

    # --- Resumen de Contadores ---
    elements.append(Paragraph(f"<b>Total Cantidad Vendida:</b> {total_ventas}", styles['RightAlignedBold']))
    elements.append(Paragraph(f"<b>Total Cantidad en Tránsito:</b> {total_transito}", styles['RightAlignedBold']))
    elements.append(Paragraph(f"<b>Cantidad Total de Productos Registrados:</b> {total_cantidad}", styles['RightAlignedBold']))
    elements.append(Paragraph(f"<b>Número de Artículos Únicos:</b> {len(cantidad_articulos_unicos)}", styles['RightAlignedBold']))
    elements.append(Spacer(1, 0.7*cm))

    # --- Tabla de Detalles ---
    # Definir anchos de columna para una mejor visualización
    # [Imagen, Fecha, Referencia, Cantidad, Tipo Venta, Descripción Tipo]
    col_widths = [3.5 * cm, 2.5 * cm, 4.5 * cm, 2 * cm, 2.5 * cm, 4 * cm]
    table_data = [
        [
            Paragraph("IMAGEN", styles['HeaderInfo']),
            Paragraph("FECHA", styles['HeaderInfo']),
            Paragraph("REFERENCIA", styles['HeaderInfo']),
            Paragraph("CANTIDAD", styles['HeaderInfo']),
            Paragraph("TIPO VENTA", styles['HeaderInfo']),
            Paragraph("DESCRIPCIÓN TIPO", styles['HeaderInfo'])
        ]
    ]

    for item in sorted_data:
        imagen_nombre = item.get('IMAGEN', '').strip() # Limpiar espacios en blanco
        ruta_imagen = None
        img_element = None

        if ubicacion_fotos and imagen_nombre:
            ruta_imagen = os.path.join(ubicacion_fotos, imagen_nombre)
            if os.path.exists(ruta_imagen):
                try:
                    # Ajustar el tamaño de la imagen para que quepa bien en la celda
                    img_element = Image(ruta_imagen, width=3.0 * cm, height=2.0 * cm)
                except Exception as e:
                    print(f"ERROR: Fallo al cargar la imagen '{imagen_nombre}' para el PDF. Detalle: {e}")
                    img_element = Paragraph("Imagen<br/>Corrupta/Inválida", styles['ImagePlaceholder'])
            else:
                img_element = Paragraph("Imagen<br/>No Encontrada", styles['ImagePlaceholder'])
        else:
            img_element = Paragraph("Sin<br/>Imagen", styles['ImagePlaceholder'])

        # Obtener el tipo de venta
        tipo_venta = obtener_tipo_venta(item.get('PREVENTA'))

        # Formatear la fecha
        fecha_item_formateada = formatear_fecha_pdf(item.get('FECHA', ''))

        # Descripción del tipo
        desc_tipo = item.get('DESC_TIPO', "N/A") # Usar N/A si no hay descripción

        table_data.append([
            img_element,
            Paragraph(fecha_item_formateada, styles['NormalText']),
            Paragraph(imagen_nombre, styles['NormalText']),
            Paragraph(str(item.get('CANTIDAD', '')), styles['NormalText']),
            Paragraph(tipo_venta, styles['NormalText']),
            Paragraph(desc_tipo, styles['NormalText'])
        ])

    table = Table(table_data, colWidths=col_widths)

    # Estilo de la tabla
    table_style = [
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2a52be')), # Azul oscuro para encabezado
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f0f0f0')), # Fondo claro para filas de datos
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cccccc')), # Grilla más suave
        
        ('ALIGN', (1, 1), (1, -1), 'CENTER'), # Centrar la fecha
        ('ALIGN', (3, 1), (5, -1), 'CENTER'), # Centrar Cantidad, Tipo y DESC_TIPO
        ('ALIGN', (2, 1), (2, -1), 'LEFT'), # Alinear el nombre de la imagen a la izquierda
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'), # Centrar verticalmente todo el contenido de la tabla
        
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 1), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 4),
    ]

    table.setStyle(TableStyle(table_style))
    elements.append(table)
    elements.append(Spacer(1, 1*cm))

    # --- Pie de página (Opcional, pero añade profesionalismo) ---
    # elements.append(Paragraph(f"Generado el {datetime.now().strftime('%d/%m/%Y %H:%M')}", styles['NormalText']))
    # elements.append(Paragraph("Sistema de Informes de Compras - Tu Empresa S.A.", styles['NormalText']))

    # Construir el PDF
    try:
        doc.build(elements)
        print(f"PDF generado exitosamente en: {output_path}")
    except Exception as e:
        print(f"ERROR: Fallo crítico al construir el PDF. Detalle: {e}")
        # Puedes mostrar un mensaje de error en la UI si lo pasas a parent_window
        if parent_window:
            QMessageBox.critical(parent_window, "Error de Generación de PDF", f"No se pudo completar la generación del PDF. Detalles: {e}")


if __name__ == '__main__':
    # --- Ejemplo de cómo podrías probar la generación de PDF ---
    # Esto es solo para pruebas directas del módulo pdf_generator.py
    # La aplicación principal (main.py y ui.py) llamará a generate_pdf directamente.

    # Datos de ejemplo que simulan lo que vendría de database.py y ui.py
    # Incluye PREVENTA = 2 y 3 para probar la visualización de tránsito
    datos_ejemplo = [
        {"FECHA": datetime(2025, 2, 26), "CANTIDAD": 12, "PREVENTA": 1, "IMAGEN": "producto_A_001.jpg", "ID_CLIENTE": "123", "DESC_TIPO": "Stock Disponible"},
        {"FECHA": datetime(2025, 3, 15), "CANTIDAD": 8, "PREVENTA": 2, "IMAGEN": "producto_B_002.jpg", "ID_CLIENTE": "123", "DESC_TIPO": "En Tránsito (Mar)"},
        {"FECHA": datetime(2025, 3, 20), "CANTIDAD": 5, "PREVENTA": 3, "IMAGEN": "producto_C_003.jpg", "ID_CLIENTE": "123", "DESC_TIPO": "Pedido Futuro (Abr)"},
        {"FECHA": datetime(2025, 4, 10), "CANTIDAD": 10, "PREVENTA": 1, "IMAGEN": "producto_A_001.jpg", "ID_CLIENTE": "123", "DESC_TIPO": "Stock Disponible"}, # Misma imagen, diferente fecha
        {"FECHA": datetime(2025, 4, 25), "CANTIDAD": 7, "PREVENTA": 2, "IMAGEN": "producto_B_002.jpg", "ID_CLIENTE": "123", "DESC_TIPO": "En Tránsito (May)"}, # Misma imagen, diferente fecha
        {"FECHA": datetime(2025, 5, 1), "CANTIDAD": 3, "PREVENTA": 1, "IMAGEN": "producto_D_004.jpg", "ID_CLIENTE": "123", "DESC_TIPO": "Stock Disponible"},
    ]

    try:
        # Crear un directorio temporal para el PDF de prueba
        test_dir = "temp_pdf_output"
        os.makedirs(test_dir, exist_ok=True)

        # Simular ubicacion_fotos con una ruta existente o crear un placeholder
        # Para que las imágenes se muestren, debes tener archivos reales en esta ruta.
        # Por ejemplo, puedes crear archivos vacíos con los nombres de las imágenes de datos_ejemplo
        # en una subcarpeta 'resources/images' para probar.
        # Ejemplo: touch resources/images/producto_A_001.jpg
        simulated_ubicacion_fotos = resource_path("resources/images")
        os.makedirs(simulated_ubicacion_fotos, exist_ok=True) # Asegurarse de que la carpeta exista

        # Crear archivos de imagen de prueba vacíos para que ReportLab no falle si no existen
        for item in datos_ejemplo:
            img_name = item.get('IMAGEN')
            if img_name:
                dummy_img_path = os.path.join(simulated_ubicacion_fotos, img_name)
                if not os.path.exists(dummy_img_path):
                    try:
                        # Crear un archivo de imagen dummy (vacío o con contenido mínimo)
                        # Para una prueba visual real, necesitarías imágenes JPG/PNG válidas.
                        with open(dummy_img_path, 'wb') as f:
                            # Puedes poner un byte mínimo para que sea un archivo válido
                            f.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0cIDATx\xda\xed\xc1\x01\x01\x00\x00\x00\xc2\xa0\xf7Om\x00\x00\x00\x00IEND\xaeB`\x82')
                            # O simplemente crear un archivo vacío: pass
                    except Exception as img_e:
                        print(f"Advertencia: No se pudo crear imagen dummy {dummy_img_path}. {img_e}")


        # Parámetros para la generación del PDF de prueba
        cliente_nombre_test = "Cliente de Prueba S.A."
        marca_desc_test = "Marca Ejemplo"
        fecha_inicio_test = "2025-01-01" # Formato YYYY-MM-DD
        fecha_fin_test = "2025-12-31"   # Formato YYYY-MM-DD
        buscador_test = "producto_A"    # Simula el filtro del buscador
        
        # Nombre del archivo PDF de salida
        pdf_filename_test = f"informe_test_{cliente_nombre_test.replace(' ', '_')}_{marca_desc_test}_{fecha_inicio_test.replace('-', '')}_{fecha_fin_test.replace('-', '')}.pdf"
        ruta_salida_test = os.path.join(test_dir, pdf_filename_test)

        # Filtrar los datos de ejemplo por el buscador_test para simular el comportamiento de ui.py
        datos_filtrados_para_pdf_test = []
        if buscador_test:
            for dato in datos_ejemplo:
                if dato.get("IMAGEN", "").lower().startswith(buscador_test.lower()):
                    datos_filtrados_para_pdf_test.append(dato)
        else:
            datos_filtrados_para_pdf_test = datos_ejemplo

        # Generar el PDF de prueba
        generate_pdf(
            parent_window=None, # No hay ventana padre en el contexto de prueba directa
            datos=datos_filtrados_para_pdf_test,
            fecha_inicio=fecha_inicio_test,
            fecha_fin=fecha_fin_test,
            nombre_cliente=cliente_nombre_test,
            descripcion_marca=marca_desc_test,
            buscador=buscador_test,
            output_path=ruta_salida_test,
            nombre_imagen_principal=None, # Puedes especificar una si quieres una portada con imagen
            ubicacion_fotos=simulated_ubicacion_fotos
        )
        print(f"Archivo PDF de prueba generado en: {ruta_salida_test}")
        
        # Intentar abrir el PDF generado (solo en sistemas Windows)
        if sys.platform == "win32" and os.path.exists(ruta_salida_test):
            os.startfile(ruta_salida_test)
        elif os.path.exists(ruta_salida_test):
            print("Para ver el PDF, ábralo manualmente desde:", ruta_salida_test)

    except Exception as e:
        print(f"ERROR: Fallo al generar el PDF de prueba. Detalle: {e}")
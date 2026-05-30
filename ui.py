import os
import sys
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, QComboBox,
    QPushButton, QMessageBox, QTextEdit, QFileDialog, QFrame, QSizePolicy
)
from PyQt5.QtCore import Qt, QStringListModel
from PyQt5.QtWidgets import QCompleter
from PyQt5.QtGui import QPalette, QColor
from datetime import datetime # Importar datetime para validación de fechas

# Importaciones de tus módulos
from database import (
    connect_to_database, fetch_marcas_categoria_1, fetch_cliente_descripcion,
    fetch_points_with_filters # No necesitamos fetch_sugerencias_imagen aquí, se hará desde los datos cargados
)
from pdf_generator import generate_pdf # Asegúrate de que pdf_generator.py tenga los ajustes que discutimos para múltiples imágenes y manejo de rutas


def resource_path(relative_path):
    """
    Obtiene la ruta absoluta al recurso, funciona para desarrollo y para PyInstaller.
    """
    try:
        base_path = sys._MEIPASS
    except AttributeError:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)


class TextEditLogger(object):
    """
    Clase para redirigir la salida estándar (print) a un QTextEdit.
    Útil para depuración y retroalimentación al usuario en la UI.
    """
    def __init__(self, text_edit):
        self.text_edit = text_edit
        self.original_stdout = sys.stdout # Guarda la salida original
        self.original_stderr = sys.stderr

    def write(self, message):
        # Evita añadir líneas en blanco excesivas
        if message.strip():
            # Añadir la hora al mensaje para mejor depuración
            timestamp = datetime.now().strftime("%H:%M:%S")
            self.text_edit.append(f"[{timestamp}] {message.strip()}")
        # Puedes mantener la salida en la consola para depuración si lo deseas
        # self.original_stdout.write(message)
    
    def flush(self):
        # Necesario para el protocolo de archivos
        pass

    def __del__(self):
        # Restaura la salida estándar al cerrar la aplicación
        sys.stdout = self.original_stdout
        sys.stderr = self.original_stderr


class PDFWindow(QMainWindow):
    """
    Ventana principal de la aplicación para generar informes PDF
    de compras de clientes.
    """
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Generador de Informes de Cliente - V. 1.0")
        self.setGeometry(100, 100, 950, 700) # Tamaño optimizado para el diseño

        # Cargar la hoja de estilos QSS
        # Asegúrate de que la ruta a styles.qss sea correcta.
        # Si styles.qss está en 'resources/css/', la ruta sería resource_path("resources/css/styles.qss")
        # Si está en la misma carpeta que main.py/ui.py, solo "styles.qss"
        self.setStyleSheet(self.load_stylesheet(resource_path("resources/css/styles.qss")))


        # --- Conexión a la base de datos ---
        self.conexion = connect_to_database()
        if not self.conexion:
            QMessageBox.critical(self, "Error de Conexión", "No se pudo conectar a la base de datos. Verifique su conexión y credenciales.")
            sys.exit(1) # Salir si no hay conexión a la DB
        else:
            print("Conexión a la base de datos establecida.")
            
        # --- Variables de estado ---
        self.datos_filtrados_base = [] # Almacena todos los datos por cliente/periodo/marca

        # --- Configuración de la interfaz de usuario ---
        self._setup_ui()

        # --- Redirigir salida de consola ---
        self.logger = TextEditLogger(self.output_text)
        sys.stdout = self.logger
        sys.stderr = self.logger
        print("Salida de la consola redirigida al panel de depuración.")
        
        # --- Carga inicial de datos ---
        self._load_marcas()
        self._setup_autocomplete_for_imagen() # Configurar autocompletado inicialmente vacío


    def _setup_ui(self):
        """Configura todos los widgets y layouts de la interfaz de usuario."""
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(20, 20, 20, 20) # Márgenes para un diseño más limpio
        main_layout.setSpacing(15) # Espaciado entre elementos

        # --- Sección de Filtros Principales ---
        filter_group_frame = QFrame()
        filter_group_frame.setObjectName("filterGroupFrame") # Para aplicar estilos CSS
        filter_group_frame.setFrameShape(QFrame.StyledPanel) # Darle un estilo de panel
        filter_group_frame.setFrameShadow(QFrame.Raised) # Sombra para un efecto 3D
        filter_group_layout = QVBoxLayout(filter_group_frame)
        filter_group_layout.setSpacing(10)
        
        title_label = QLabel("<h2>Filtros de Informe</h2>")
        title_label.setObjectName("titleLabel") # Para aplicar estilo específico desde QSS
        filter_group_layout.addWidget(title_label)
        
        # Cliente
        cliente_layout = QHBoxLayout()
        cliente_layout.addWidget(QLabel("<b>Código del Cliente:</b>"))
        self.cliente_input = QLineEdit()
        self.cliente_input.setPlaceholderText("Ingrese el código del cliente")
        self.cliente_input.textChanged.connect(self._load_cliente_description)
        cliente_layout.addWidget(self.cliente_input)
        
        self.descripcion_cliente_label = QLabel("<i>Descripción: N/A</i>")
        self.descripcion_cliente_label.setObjectName("descripcion_cliente_label")
        self.descripcion_cliente_label.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Preferred)
        cliente_layout.addWidget(self.descripcion_cliente_label)
        filter_group_layout.addLayout(cliente_layout)

        # Fechas
        fecha_layout = QHBoxLayout()
        fecha_layout.addWidget(QLabel("<b>Fecha Inicial (DD-MM-YYYY):</b>"))
        self.fecha_inicio_input = QLineEdit()
        self.fecha_inicio_input.setInputMask("99-99-9999")
        self.fecha_inicio_input.setPlaceholderText("Ej: 01-01-2023")
        fecha_layout.addWidget(self.fecha_inicio_input)

        fecha_layout.addWidget(QLabel("<b>Fecha Final (DD-MM-YYYY):</b>"))
        self.fecha_fin_input = QLineEdit()
        self.fecha_fin_input.setInputMask("99-99-9999")
        self.fecha_fin_input.setPlaceholderText("Ej: 31-12-2023")
        fecha_layout.addWidget(self.fecha_fin_input)
        filter_group_layout.addLayout(fecha_layout)

        # Marca
        marca_layout = QHBoxLayout()
        marca_layout.addWidget(QLabel("<b>Marca:</b>"))
        self.marca_combo = QComboBox()
        self.marca_combo.setObjectName("marcaComboBox") # Para estilo QSS
        self.marca_combo.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Preferred)
        marca_layout.addWidget(self.marca_combo)
        filter_group_layout.addLayout(marca_layout)
        
        # Botón para aplicar filtros principales
        self.apply_filters_button = QPushButton("Aplicar Filtros Principales")
        self.apply_filters_button.setObjectName("applyFiltersButton") # Para estilo QSS
        self.apply_filters_button.clicked.connect(self._apply_main_filters)
        filter_group_layout.addWidget(self.apply_filters_button)
        
        main_layout.addWidget(filter_group_frame)
        
        # --- Separador ---
        separator1 = QFrame()
        separator1.setFrameShape(QFrame.HLine)
        separator1.setFrameShadow(QFrame.Sunken)
        main_layout.addWidget(separator1)

        # --- Sección de Filtro Avanzado (Buscador de Imagen) ---
        advanced_filter_frame = QFrame()
        advanced_filter_frame.setObjectName("advancedFilterFrame")
        advanced_filter_frame.setFrameShape(QFrame.StyledPanel)
        advanced_filter_frame.setFrameShadow(QFrame.Raised)
        advanced_filter_layout = QVBoxLayout(advanced_filter_frame)
        advanced_filter_layout.setSpacing(10)
        advanced_filter_layout.addWidget(QLabel("<h3>Buscador de Referencia/Imagen (Opcional)</h3>"))
        
        self.imagen_input = QLineEdit()
        self.imagen_input.setPlaceholderText("Ingrese parte del nombre de la referencia/imagen para filtrar (ej: '4', 'ABC')")
        self.imagen_input.setObjectName("imagenInput") # Para estilo QSS
        advanced_filter_layout.addWidget(self.imagen_input)
        
        main_layout.addWidget(advanced_filter_frame)

        # --- Separador ---
        separator2 = QFrame()
        separator2.setFrameShape(QFrame.HLine)
        separator2.setFrameShadow(QFrame.Sunken)
        main_layout.addWidget(separator2)

        # --- Sección de Ubicaciones y Generación ---
        paths_group_frame = QFrame()
        paths_group_frame.setObjectName("pathsGroupFrame")
        paths_group_frame.setFrameShape(QFrame.StyledPanel)
        paths_group_frame.setFrameShadow(QFrame.Raised)
        paths_group_layout = QVBoxLayout(paths_group_frame)
        paths_group_layout.setSpacing(10)
        paths_group_layout.addWidget(QLabel("<h3>Ubicaciones y Generación de PDF</h3>"))

        # Ubicación de Imágenes Fuente
        img_location_layout = QHBoxLayout()
        img_location_layout.addWidget(QLabel("<b>Carpeta de Imágenes Fuente:</b>"))
        self.ubicacion_imagen_input = QLineEdit()
        self.ubicacion_imagen_input.setText("\\\\10.18.3.1\\home\\img_art") # Valor por defecto
        self.ubicacion_imagen_input.setPlaceholderText("Ruta donde se encuentran las fotos de artículos")
        self.ubicacion_imagen_input.setObjectName("pathInput") # Para estilo QSS
        img_location_layout.addWidget(self.ubicacion_imagen_input)
        self.select_img_path_button = QPushButton("Seleccionar Carpeta")
        self.select_img_path_button.setObjectName("selectPathButton") # Para estilo QSS
        self.select_img_path_button.clicked.connect(self._select_image_location)
        img_location_layout.addWidget(self.select_img_path_button)
        paths_group_layout.addLayout(img_location_layout)

        # Ubicación de PDF Destino
        pdf_location_layout = QHBoxLayout()
        pdf_location_layout.addWidget(QLabel("<b>Guardar PDF en:</b>"))
        self.ubicacion_informe_input = QLineEdit()
        self.ubicacion_informe_input.setText(os.path.expanduser("~/Desktop")) # Por defecto el escritorio
        self.ubicacion_informe_input.setPlaceholderText("Ruta donde se guardará el informe PDF")
        self.ubicacion_informe_input.setObjectName("pathInput") # Para estilo QSS
        pdf_location_layout.addWidget(self.ubicacion_informe_input)
        self.select_pdf_path_button = QPushButton("Seleccionar Carpeta")
        self.select_pdf_path_button.setObjectName("selectPathButton") # Para estilo QSS
        self.select_pdf_path_button.clicked.connect(self._select_report_location)
        pdf_location_layout.addWidget(self.select_pdf_path_button)
        paths_group_layout.addLayout(pdf_location_layout)
        
        # Botón Generar PDF
        self.generate_pdf_button = QPushButton("Generar Informe PDF")
        self.generate_pdf_button.setObjectName("generatePdfButton") # Para estilo QSS
        self.generate_pdf_button.clicked.connect(self._generate_pdf_report)
        paths_group_layout.addWidget(self.generate_pdf_button)

        main_layout.addWidget(paths_group_frame)

        # --- Panel de Salida/Depuración ---
        main_layout.addWidget(QLabel("<h3>Consola de Salida y Depuración:</h3>"))
        self.output_text = QTextEdit()
        self.output_text.setReadOnly(True)
        self.output_text.setObjectName("outputText") # Para estilo QSS
        main_layout.addWidget(self.output_text)

    def load_stylesheet(self, path):
        """Carga la hoja de estilos CSS desde el archivo."""
        try:
            with open(path, "r") as f:
                return f.read()
        except FileNotFoundError:
            QMessageBox.warning(self, "Advertencia", f"No se encontró el archivo de estilos: {path}\nLa aplicación continuará sin estilos.")
            return ""

    def _load_marcas(self):
        """Carga las marcas disponibles de ID_CATEGORIA = 1 en el QComboBox."""
        print("Cargando marcas desde la base de datos (Categoría 1)...")
        try:
            marcas = fetch_marcas_categoria_1(self.conexion)
            self.marca_combo.clear() # Limpiar ítems existentes
            self.marca_combo.addItem("Seleccione una Marca", userData=None) # Opción por defecto
            for marca in marcas:
                # ¡IMPORTANTE! Añadir ID_MARCA como userData
                self.marca_combo.addItem(marca.get('DESCRIPCION_MARCA'), userData=marca.get('ID_MARCA'))
            print(f"Marcas de Categoría 1 cargadas: {len(marcas)}.")
        except Exception as e:
            print(f"Error al cargar las marcas: {e}")
            QMessageBox.critical(self, "Error de Carga", "No se pudieron cargar las marcas desde la base de datos.")

    def _load_cliente_description(self):
        """Carga y muestra la descripción del cliente al ingresar el código."""
        codigo_cliente = self.cliente_input.text().strip()
        if not codigo_cliente:
            self.descripcion_cliente_label.setText("<i>Descripción: N/A</i>")
            return
        
        if not codigo_cliente.isdigit():
            self.descripcion_cliente_label.setText("<i>Código inválido.</i>")
            return
        
        print(f"Buscando descripción para cliente {codigo_cliente}...")
        try:
            descripcion = fetch_cliente_descripcion(self.conexion, int(codigo_cliente))
            if descripcion:
                self.descripcion_cliente_label.setText(f"<i>Descripción: {descripcion}</i>")
                print(f"Descripción del cliente encontrada: {descripcion}")
            else:
                self.descripcion_cliente_label.setText("<i>Descripción: No encontrado</i>")
                print(f"Cliente {codigo_cliente} no encontrado.")
        except Exception as e:
            print(f"Error al cargar descripción del cliente: {e}")
            self.descripcion_cliente_label.setText("<i>Descripción: Error al consultar</i>")

    def _apply_main_filters(self):
        """
        Aplica los filtros principales (cliente, fechas, marca) y carga los datos
        base para el PDF. También actualiza las sugerencias del buscador de imagen.
        """
        print("\n--- Aplicando filtros principales ---")
        fecha_inicio_str = self.fecha_inicio_input.text()
        fecha_fin_str = self.fecha_fin_input.text()
        cliente_id = self.cliente_input.text().strip()
        
        # Obtener el ID de la marca seleccionada
        id_marca_seleccionada = self.marca_combo.currentData()
        descripcion_marca_para_log = self.marca_combo.currentText() # Para el mensaje de log

        # --- Validaciones de Entrada ---
        if not self._validate_dates(fecha_inicio_str, fecha_fin_str):
            return
        if not cliente_id or not cliente_id.isdigit():
            QMessageBox.warning(self, "Advertencia", "El código de cliente es obligatorio y debe ser un número válido.")
            return
        if id_marca_seleccionada is None: # Si seleccionó "Seleccione una Marca" o nada
            QMessageBox.warning(self, "Advertencia", "Por favor, seleccione una marca válida de la lista.")
            return
        
        # Validar que la descripción del cliente se haya cargado (opcional pero recomendado)
        if "No encontrado" in self.descripcion_cliente_label.text() or \
           "Código inválido" in self.descripcion_cliente_label.text() or \
           "Error al consultar" in self.descripcion_cliente_label.text():
            QMessageBox.warning(self, "Advertencia", "El cliente ingresado no es válido o no existe. Por favor, verifique.")
            return

        try:
            # Convertir fechas a formato ISO para la base de datos
            fecha_inicio_iso = self._convert_date_to_iso(fecha_inicio_str)
            fecha_fin_iso = self._convert_date_to_iso(fecha_fin_str)

            print(f"Consultando datos para Cliente: {cliente_id}, Marca: {descripcion_marca_para_log} (ID: {id_marca_seleccionada}), Fechas: {fecha_inicio_iso} a {fecha_fin_iso}...")
            
            # Aquí NO se pasa el filtro de IMAGEN (buscador_texto)
            self.datos_filtrados_base = fetch_points_with_filters(
                self.conexion,
                fecha_inicio=fecha_inicio_iso,
                fecha_fin=fecha_fin_iso,
                cliente=cliente_id,
                marca=id_marca_seleccionada, # ¡Pasa el ID real de la marca aquí!
                linea=None, # Ya no se usa o se deja a None
                referencia=None # Crucial: No filtrar por referencia/imagen aquí. Se filtra en memoria para el PDF.
            )
            print(f"Datos base recuperados: {len(self.datos_filtrados_base)} registros.")
            
            if not self.datos_filtrados_base:
                QMessageBox.information(self, "Información", "No se encontraron registros con los filtros principales aplicados.")
                print("No se encontraron registros base.")
            else:
                QMessageBox.information(self, "Éxito", "Filtros principales aplicados. Ahora puede usar el 'Buscador de Referencia/Imagen' o generar el PDF.")
            
            # Actualizar las sugerencias del autocompletado con los datos recién cargados
            self._update_autocomplete_suggestions_from_data()

        except Exception as e:
            print(f"Error al aplicar filtros principales: {e}")
            QMessageBox.critical(self, "Error", f"Ocurrió un error al cargar los datos: {e}")

    def _update_autocomplete_suggestions_from_data(self):
        """
        Actualiza las sugerencias del QCompleter del campo IMAGEN
        basándose en los 'IMAGEN' disponibles en self.datos_filtrados_base.
        """
        print("Actualizando sugerencias del buscador de imagen...")
        if not self.datos_filtrados_base:
            suggestions = []
        else:
            # Obtener nombres de imagen únicos y limpiar posibles valores nulos/vacíos
            suggestions = sorted(list(set(
                item.get('IMAGEN') for item in self.datos_filtrados_base
                if item.get('IMAGEN') # Asegurarse de que no sea None o cadena vacía
            )))
        
        # Crear o actualizar el modelo del completer
        model = QStringListModel()
        model.setStringList(suggestions)
        
        completer = QCompleter()
        completer.setModel(model)
        completer.setCaseSensitivity(Qt.CaseInsensitive) # Hacer el autocompletado insensible a mayúsculas/minúsculas
        completer.setFilterMode(Qt.MatchContains) # Permite autocompletar en cualquier parte de la cadena (útil para referencias parciales)
        
        self.imagen_input.setCompleter(completer)
        print(f"Autocompletado de imagen actualizado con {len(suggestions)} sugerencias.")

    def _setup_autocomplete_for_imagen(self):
        """Configura el autocompletado inicial para el campo IMAGEN (puede estar vacío al inicio)."""
        # Se llama en __init__ para asegurar que el completer esté siempre asociado.
        # Las sugerencias se llenarán después de aplicar los filtros principales.
        self._update_autocomplete_suggestions_from_data() # Llama con datos iniciales (vacíos)

    def _select_image_location(self):
        """Abre un diálogo para seleccionar la ubicación de las imágenes."""
        current_path = self.ubicacion_imagen_input.text()
        if not os.path.isdir(current_path): # Si la ruta actual no es válida, empieza en el escritorio
            current_path = os.path.expanduser("~/Desktop")

        directory = QFileDialog.getExistingDirectory(self, "Seleccionar Carpeta de Imágenes Fuente", current_path)
        if directory:
            self.ubicacion_imagen_input.setText(directory)
            print(f"Ubicación de imágenes fuente seleccionada: {directory}")

    def _select_report_location(self):
        """Abre un diálogo para seleccionar la ubicación donde guardar el informe PDF."""
        current_path = self.ubicacion_informe_input.text()
        if not os.path.isdir(current_path): # Si la ruta actual no es válida, empieza en el escritorio
            current_path = os.path.expanduser("~/Desktop")

        directory = QFileDialog.getExistingDirectory(self, "Seleccionar Carpeta de Destino para el Informe PDF", current_path)
        if directory:
            self.ubicacion_informe_input.setText(directory)
            print(f"Ubicación del informe PDF seleccionada: {directory}")

    def _generate_pdf_report(self):
        """
        Maneja la lógica para filtrar los datos finales y generar el informe PDF.
        """
        print("\n--- Generando Informe PDF ---")
        fecha_inicio_str = self.fecha_inicio_input.text()
        fecha_fin_str = self.fecha_fin_input.text()
        cliente_id = self.cliente_input.text().strip()
        
        # Obtener descripción del cliente para el PDF
        descripcion_cliente = self.descripcion_cliente_label.text().replace("<i>Descripción: ", "").replace("</i>", "")
        if "N/A" in descripcion_cliente or "No encontrado" in descripcion_cliente or "Código inválido" in descripcion_cliente or "Error al consultar" in descripcion_cliente:
            QMessageBox.warning(self, "Advertencia", "No se pudo obtener la descripción del cliente. Asegúrese de que el código sea válido y aplique los filtros principales.")
            return

        # Obtener la descripción de la marca seleccionada para el PDF
        id_marca = self.marca_combo.currentData()
        descripcion_marca = self.marca_combo.currentText()
        if id_marca is None:
            QMessageBox.warning(self, "Advertencia", "Por favor, aplique los filtros principales y seleccione una marca válida.")
            return
        
        buscador_texto = self.imagen_input.text().strip() # El texto final del buscador
        ubicacion_fotos = self.ubicacion_imagen_input.text()
        ruta_destino_pdf = self.ubicacion_informe_input.text()

        # --- Validaciones antes de generar PDF ---
        if not self.datos_filtrados_base:
            QMessageBox.warning(self, "Advertencia", "No hay datos cargados para generar el PDF. Por favor, aplique los filtros principales primero.")
            print("No se encontraron datos base para generar el PDF.")
            return
        
        if not ubicacion_fotos or not os.path.isdir(ubicacion_fotos):
            QMessageBox.warning(self, "Advertencia", "La carpeta de imágenes fuente no es válida o no existe. Por favor, verifique la ruta.")
            return
        
        if not ruta_destino_pdf or not os.path.isdir(ruta_destino_pdf):
            QMessageBox.warning(self, "Advertencia", "La carpeta de destino del informe no es válida o no existe. Por favor, verifique la ruta.")
            return

        # --- Filtrado de datos para el PDF (si se usó el buscador en la UI) ---
        datos_para_pdf = []
        if buscador_texto:
            print(f"Aplicando filtro de buscador de referencia/imagen: '{buscador_texto}' a los datos cargados en memoria.")
            for dato in self.datos_filtrados_base:
                if dato.get("IMAGEN", "").lower().startswith(buscador_texto.lower()):
                    datos_para_pdf.append(dato)
            
            if not datos_para_pdf:
                QMessageBox.information(self, "Información", "No se encontraron registros que coincidan con el filtro de referencia/imagen aplicado.")
                print("No se encontraron datos después del filtro de buscador.")
                return
        else:
            datos_para_pdf = self.datos_filtrados_base # Si no hay buscador, usa todos los datos base cargados
            print("Generando PDF con todos los datos cargados (sin filtro de referencia/imagen adicional).")

        # Determinar el nombre de la imagen principal para la portada del PDF (puede ser la primera del filtro)
        nombre_imagen_principal_pdf = None
        if datos_para_pdf:
            # Podrías buscar la imagen que más se ajuste o la primera en los datos filtrados
            nombre_imagen_principal_pdf = datos_para_pdf[0].get("IMAGEN")

        # --- Generación del PDF ---
        # Convertir fechas a formato YYYYMMDD para el nombre del archivo
        fecha_inicio_para_nombre = self._convert_date_to_iso(fecha_inicio_str).replace('-', '')
        fecha_fin_para_nombre = self._convert_date_to_iso(fecha_fin_str).replace('-', '')

        # Limpiar el nombre de la marca para el archivo
        marca_nombre_limpio = descripcion_marca.replace(' ', '_').replace('/', '_').replace('\\', '_')

        pdf_filename = f"Informe_{cliente_id}_{marca_nombre_limpio}_{fecha_inicio_para_nombre}_a_{fecha_fin_para_nombre}.pdf"
        pdf_path = os.path.join(ruta_destino_pdf, pdf_filename)
        
        print(f"Pasando {len(datos_para_pdf)} registros al generador de PDF para crear '{pdf_path}'...")
        try:
            generate_pdf(
                parent_window=self, # Para mostrar mensajes de error desde pdf_generator
                datos=datos_para_pdf, # Datos ya filtrados por el buscador de UI
                fecha_inicio=self._convert_date_to_iso(fecha_inicio_str), # Fechas en formato ISO para PDF
                fecha_fin=self._convert_date_to_iso(fecha_fin_str),       # Fechas en formato ISO para PDF
                nombre_cliente=descripcion_cliente,
                descripcion_marca=descripcion_marca,
                buscador=buscador_texto, # Pasa el texto del buscador para el título del PDF si es necesario
                output_path=pdf_path,
                nombre_imagen_principal=nombre_imagen_principal_pdf, # Puede ser None o la primera imagen
                ubicacion_fotos=ubicacion_fotos
            )
            QMessageBox.information(self, "Éxito", f"Informe PDF generado correctamente en:\n{pdf_path}")
            print(f"PDF generado correctamente en: {pdf_path}")
            
            # Opcional: Abrir el PDF automáticamente si el sistema lo permite
            if sys.platform == "win32":
                os.startfile(pdf_path)
            elif sys.platform == "darwin": # macOS
                os.system(f"open {pdf_path}")
            elif sys.platform.startswith("linux"): # Linux
                os.system(f"xdg-open {pdf_path}")
            
            # Limpiar el buscador después de generar el informe y resetear sugerencias
            self.imagen_input.clear()
            self._update_autocomplete_suggestions_from_data() # Vuelve a cargar las sugerencias de todos los datos base

        except Exception as e:
            QMessageBox.critical(self, "Error al Generar PDF", f"Ocurrió un error inesperado al generar el PDF: {e}")
            print(f"ERROR: Fallo al generar el PDF: {e}")


    def _validate_dates(self, start_date_str, end_date_str):
        """Valida que las fechas tengan el formato correcto (DD-MM-YYYY) y que la fecha de inicio no sea posterior a la final."""
        try:
            start_date = datetime.strptime(start_date_str, "%d-%m-%Y").date()
            end_date = datetime.strptime(end_date_str, "%d-%m-%Y").date()
            if start_date > end_date:
                QMessageBox.warning(self, "Advertencia de Fechas", "La fecha inicial no puede ser posterior a la fecha final.")
                return False
            return True
        except ValueError:
            QMessageBox.warning(self, "Formato de Fecha Inválido", "Por favor, ingrese las fechas en el formato DD-MM-YYYY (ej: 01-01-2023).")
            return False

    def _convert_date_to_iso(self, date_str):
        """Convierte fecha de DD-MM-YYYY a YYYY-MM-DD para la base de datos."""
        return datetime.strptime(date_str, "%d-%m-%Y").strftime("%Y-%m-%d")


# --- Bloque principal de ejecución de la aplicación ---
if __name__ == '__main__':
    app = QApplication(sys.argv)
    
    # Aplicar un estilo moderno a la aplicación (por ejemplo, 'Fusion')
    app.setStyle("Fusion") 

    # Establecer una paleta de colores oscura para un contraste moderno y agradable
    palette = QPalette()
    palette.setColor(QPalette.Window, QColor(45, 45, 45))        # Fondo principal de ventanas
    palette.setColor(QPalette.WindowText, QColor(220, 220, 220)) # Color de texto general
    palette.setColor(QPalette.Base, QColor(30, 30, 30))          # Fondo de widgets editables (QLineEdit, QTextEdit)
    palette.setColor(QPalette.AlternateBase, QColor(50, 50, 50)) # Fondo alternativo en listas/tablas
    palette.setColor(QPalette.ToolTipBase, QColor(60, 60, 60))   # Fondo de ToolTips
    palette.setColor(QPalette.ToolTipText, QColor(255, 255, 255)) # Texto de ToolTips
    palette.setColor(QPalette.Text, QColor(220, 220, 220))       # Color de texto en widgets editables
    palette.setColor(QPalette.Button, QColor(55, 55, 55))        # Fondo de botones
    palette.setColor(QPalette.ButtonText, QColor(220, 220, 220)) # Texto de botones
    palette.setColor(QPalette.BrightText, QColor(255, 0, 0))     # Texto brillante (no muy usado)
    palette.setColor(QPalette.Link, QColor(70, 130, 180))        # Color de enlaces
    palette.setColor(QPalette.Highlight, QColor(70, 130, 180))   # Color de selección
    palette.setColor(QPalette.HighlightedText, QColor(255, 255, 255)) # Texto en elementos seleccionados
    palette.setColor(QPalette.Disabled, QPalette.Text, QColor(120, 120, 120)) # Texto deshabilitado
    palette.setColor(QPalette.Disabled, QPalette.ButtonText, QColor(120, 120, 120)) # Texto de botón deshabilitado

    app.setPalette(palette)

    pdf_win = PDFWindow()
    pdf_win.show()
    sys.exit(app.exec_())
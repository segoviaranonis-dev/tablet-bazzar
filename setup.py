from PyInstaller.__main__ import run

if __name__ == "__main__":
    run([
        '--onefile',  # Genera un solo archivo ejecutable
        '--windowed',  # Sin consola (aplicación gráfica)
        '--name=GeneradorPDF',  # Nombre del ejecutable
        '--add-data=resources/css/styles.qss;resources/css',  # Agregar el archivo CSS
        '--add-data=database.py;.',  # Agregar database.py
        '--add-data=pdf_generator.py;.',  # Agregar pdf_generator.py
        '--add-data=ui.py;.',  # Agregar ui.py
        '--paths=.',  # Incluir rutas de módulos locales
        'main.py'  # Archivo principal de entrada
    ])
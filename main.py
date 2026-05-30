import sys
from PyQt5.QtWidgets import QApplication
from ui import PDFWindow  # Importa la clase PDFWindow desde ui.py

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = PDFWindow()  # Crea una instancia de PDFWindow
    window.show()
    sys.exit(app.exec_())
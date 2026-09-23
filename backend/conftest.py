import sys
import os

# Agregar directorio actual de backend al sys.path para pytest
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

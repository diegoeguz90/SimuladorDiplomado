"""
Gestor de estado de datos en memoria para DistriAndina.
"""
import io
import pandas as pd
from app.datos.generador import generar_universo
from app.config import DEFAULT_SEED, DEFAULT_YEARS, DEFAULT_STORES, DEFAULT_MODE

class DataStore:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataStore, cls).__new__(cls)
            cls._instance.seed = DEFAULT_SEED
            cls._instance.years = DEFAULT_YEARS
            cls._instance.num_tiendas = DEFAULT_STORES
            cls._instance.modo = DEFAULT_MODE
            cls._instance.datasets = {}
            cls._instance.regenerar()
        return cls._instance

    def regenerar(self, seed=None, years=None, num_tiendas=None, modo=None):
        if seed is not None:
            self.seed = int(seed)
        if years is not None:
            self.years = int(years)
        if num_tiendas is not None:
            self.num_tiendas = int(num_tiendas)
        if modo is not None:
            self.modo = str(modo)

        self.datasets = generar_universo(
            seed=self.seed,
            years=self.years,
            num_tiendas=self.num_tiendas,
            modo=self.modo
        )

    def get_dataset(self, nombre: str) -> pd.DataFrame:
        if nombre not in self.datasets:
            raise KeyError(f"Dataset '{nombre}' no existe. Válidos: {list(self.datasets.keys())}")
        return self.datasets[nombre]

    def get_csv_string(self, nombre: str) -> str:
        df = self.get_dataset(nombre)
        return df.to_csv(index=False)

    def get_resumen_estadisticas(self) -> dict:
        resumen = {
            "config": {
                "seed": self.seed,
                "years": self.years,
                "num_tiendas": self.num_tiendas,
                "modo": self.modo
            },
            "tablas": {}
        }
        for nombre, df in self.datasets.items():
            resumen["tablas"][nombre] = {
                "filas": len(df),
                "columnas": len(df.columns),
                "nombres_columnas": list(df.columns)
            }
        return resumen

# Instancia global
store = DataStore()

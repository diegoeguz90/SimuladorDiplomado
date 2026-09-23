"""
Lógica para EDA (Análisis Exploratorio de Datos) en Módulo 1.
"""
import numpy as np
import pandas as pd
from app.datos.data_store import store

def obtener_estadisticas_tabla(nombre_tabla: str) -> dict:
    df = store.get_dataset(nombre_tabla)
    
    col_info = []
    for col in df.columns:
        dtype = str(df[col].dtype)
        n_nulos = int(df[col].isnull().sum())
        n_unicos = int(df[col].nunique())
        
        info = {
            "columna": col,
            "tipo": dtype,
            "nulos": n_nulos,
            "unicos": n_unicos
        }
        
        if pd.api.types.is_numeric_dtype(df[col]):
            s_clean = df[col].dropna()
            if len(s_clean) > 0:
                info["min"] = float(s_clean.min())
                info["max"] = float(s_clean.max())
                info["media"] = float(s_clean.mean())
                info["mediana"] = float(s_clean.median())
                info["std"] = float(s_clean.std()) if len(s_clean) > 1 else 0.0
                
        col_info.append(info)
        
    return {
        "tabla": nombre_tabla,
        "total_filas": len(df),
        "total_columnas": len(df.columns),
        "columnas": col_info
    }

def obtener_distribucion_columna(nombre_tabla: str, columna: str, bins_count=10) -> dict:
    df = store.get_dataset(nombre_tabla)
    if columna not in df.columns:
        raise ValueError(f"La columna '{columna}' no existe en '{nombre_tabla}'")
        
    series = df[columna].dropna()
    
    if pd.api.types.is_numeric_dtype(series):
        counts, bin_edges = np.histogram(series, bins=bins_count)
        histograma = []
        for i in range(len(counts)):
            label = f"{bin_edges[i]:.1f} - {bin_edges[i+1]:.1f}"
            histograma.append({"rango": label, "frecuencia": int(counts[i])})
            
        q1 = float(series.quantile(0.25))
        q2 = float(series.median())
        q3 = float(series.quantile(0.75))
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        outliers = series[(series < lower_bound) | (series > upper_bound)].tolist()
        
        boxplot = {
            "min": float(series.min()),
            "q1": q1,
            "mediana": q2,
            "q3": q3,
            "max": float(series.max()),
            "iqr": float(iqr),
            "n_outliers": len(outliers)
        }
        
        return {
            "columna": columna,
            "tipo": "numerica",
            "histograma": histograma,
            "boxplot": boxplot
        }
    else:
        # Categórica / Texto
        val_counts = series.value_counts().head(15)
        conteo = [{"categoria": str(k), "frecuencia": int(v)} for k, v in val_counts.items()]
        return {
            "columna": columna,
            "tipo": "categorica",
            "conteo": conteo
        }

def obtener_matriz_correlacion(nombre_tabla: str) -> dict:
    df = store.get_dataset(nombre_tabla)
    numeric_df = df.select_dtypes(include=[np.number])
    
    if numeric_df.empty or len(numeric_df.columns) < 2:
        return {"columnas": [], "matriz": []}
        
    corr = numeric_df.corr().fillna(0)
    cols = list(corr.columns)
    
    matriz = []
    for i, col1 in enumerate(cols):
        for j, col2 in enumerate(cols):
            matriz.append({
                "var1": col1,
                "var2": col2,
                "correlacion": float(corr.iloc[i, j])
            })
            
    return {
        "columnas": cols,
        "matriz": matriz
    }

def obtener_drilldown_ventas() -> dict:
    df_ventas = store.get_dataset("ventas")
    df_tiendas = store.get_dataset("tiendas")
    df_cat = store.get_dataset("catalogo")
    
    # Merge para análisis enriquecido
    df_m = df_ventas.merge(df_tiendas, on="id_tienda", how="left")
    df_m = df_m.merge(df_cat[["id_producto", "nombre", "categoria"]], on="id_producto", how="left")
    
    # Por tienda
    ventas_tienda = df_m.groupby("nombre_x")["valor"].sum().reset_index() if "nombre_x" in df_m.columns else df_m.groupby("id_tienda")["valor"].sum().reset_index()
    by_tienda = [{"tienda": str(row[0]), "total": float(row[1])} for row in ventas_tienda.itertuples(index=False)]
    
    # Por ciudad
    ventas_ciudad = df_m.groupby("ciudad")["valor"].sum().reset_index()
    by_ciudad = [{"ciudad": str(row[0]), "total": float(row[1])} for row in ventas_ciudad.itertuples(index=False)]
    
    # Por categoría
    ventas_cat = df_m.groupby("categoria")["valor"].sum().reset_index()
    by_cat = [{"categoria": str(row[0]), "total": float(row[1])} for row in ventas_cat.itertuples(index=False)]
    
    return {
        "por_tienda": by_tienda,
        "por_ciudad": by_ciudad,
        "por_categoria": by_cat
    }

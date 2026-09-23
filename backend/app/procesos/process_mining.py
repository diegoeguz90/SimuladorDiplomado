"""
Minería de procesos (Process Mining) sobre el log de eventos de DistriAndina para M3.
"""
import pandas as pd
import numpy as np
from app.datos.data_store import store

def analizar_log_eventos() -> dict:
    df = store.get_dataset("pedidos_eventlog").copy()
    if df.empty:
        return {"error": "Event log está vacío"}
        
    df["dt"] = pd.to_datetime(df["timestamp"])
    df = df.sort_values(["case_id", "dt"])
    
    # 1. Métricas por Actividad (Frecuencia, Duración, Espera)
    df["next_dt"] = df.groupby("case_id")["dt"].shift(-1)
    df["duracion_paso_h"] = (df["next_dt"] - df["dt"]).dt.total_seconds() / 3600.0
    
    # Calcular tiempo de espera previo (diferencia entre fin de actividad anterior e inicio de la actual)
    df["prev_dt"] = df.groupby("case_id")["dt"].shift(1)
    df["espera_previa_h"] = (df["dt"] - df["prev_dt"]).dt.total_seconds() / 3600.0
    
    act_metrics = df.groupby("actividad").agg(
        frecuencia=("case_id", "count"),
        duracion_promedio_h=("duracion_paso_h", lambda x: float(x.dropna().mean()) if len(x.dropna()) > 0 else 0.5),
        espera_promedio_h=("espera_previa_h", lambda x: float(x.dropna().mean()) if len(x.dropna()) > 0 else 0.0)
    ).reset_index()
    
    actividades_list = []
    cuello_botella_act = ""
    max_espera = -1.0
    
    for row in act_metrics.itertuples(index=False):
        act = row[0]
        freq = int(row[1])
        dur = round(float(row[2]), 1)
        esp = round(float(row[3]), 1)
        
        actividades_list.append({
            "actividad": act,
            "frecuencia": freq,
            "duracion_prom_h": dur,
            "espera_prom_h": esp
        })
        
        if esp > max_espera:
            max_espera = esp
            cuello_botella_act = act
            
    # 2. Grafo del Proceso (Nodos y Aristas/Transiciones)
    nodos = [{"id": act["actividad"], "label": act["actividad"].replace("_", " ").title(), "frecuencia": act["frecuencia"], "espera_prom_h": act["espera_prom_h"]} for act in actividades_list]
    
    transitions = []
    df["next_actividad"] = df.groupby("case_id")["actividad"].shift(-1)
    
    df_trans = df.dropna(subset=["next_actividad"]).groupby(["actividad", "next_actividad"]).agg(
        conteo=("case_id", "count"),
        duracion_media=("duracion_paso_h", "mean")
    ).reset_index()
    
    aristas = []
    for row in df_trans.itertuples(index=False):
        aristas.append({
            "origen": row[0],
            "destino": row[1],
            "peso_frecuencia": int(row[2]),
            "tiempo_medio_h": round(float(row[3]), 1) if not pd.isna(row[3]) else 1.0
        })
        
    # 3. Variantes de Proceso
    casos_variantes = df.groupby("case_id")["actividad"].apply(lambda seq: " -> ".join(seq)).reset_index()
    var_counts = casos_variantes["actividad"].value_counts()
    
    variantes_list = []
    total_casos = len(casos_variantes)
    for idx, (camino, count) in enumerate(var_counts.items(), 1):
        pct = round((count / total_casos) * 100.0, 1)
        variantes_list.append({
            "variante_id": f"V{idx}",
            "camino": camino,
            "frecuencia": int(count),
            "porcentaje": pct
        })
        
    # 4. Tasa de Reproceso
    casos_con_reproceso = df.groupby("case_id")["actividad"].apply(lambda seq: len(seq) > len(set(seq))).sum()
    pct_reproceso = round((casos_con_reproceso / total_casos) * 100.0, 1) if total_casos > 0 else 0.0
    
    return {
        "nodos": nodos,
        "aristas": aristas,
        "actividades": actividades_list,
        "cuello_botella": {
            "actividad": cuello_botella_act,
            "espera_promedio_h": round(max_espera, 1),
            "diagnostico": f"La actividad '{cuello_botella_act}' acumula el mayor tiempo de espera medio ({round(max_espera, 1)}h), representando el cuello de botella principal del proceso."
        },
        "variantes": variantes_list,
        "tasa_reproceso": {
            "casos_con_reproceso": int(casos_con_reproceso),
            "total_casos": total_casos,
            "porcentaje": pct_reproceso
        }
    }

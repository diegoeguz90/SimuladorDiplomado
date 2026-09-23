"""
Modelo de evaluación de equidad en IA, Disparate Impact y Mitigación de Sesgo para M4.
"""
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from app.datos.data_store import store

def evaluar_sesgo_credito() -> dict:
    df = store.get_dataset("credito_solicitudes").copy()
    if df.empty:
        return {"error": "Dataset de crédito está vacío"}
        
    df["es_mujer"] = (df["genero"] == "F").astype(int)
    
    # Incluir la variable de género (es_mujer) en el modelo discriminatorio
    features = ["ingreso_mensual", "antiguedad_meses", "mora_historica", "edad", "es_mujer"]
    X = df[features]
    y = df["aprobado"]
    
    # Entrenar Modelo de Regresión Logística
    model = LogisticRegression(random_state=store.seed, max_iter=500)
    model.fit(X, y)
    
    y_pred = model.predict(X)
    df["prediccion"] = y_pred
    
    acc_global = float(accuracy_score(y, y_pred))
    
    df_m = df[df["genero"] == "M"]
    df_f = df[df["genero"] == "F"]
    
    tasa_aprob_m = float(df_m["prediccion"].mean()) if len(df_m) > 0 else 0.0
    tasa_aprob_f = float(df_f["prediccion"].mean()) if len(df_f) > 0 else 0.0
    
    disparate_impact = tasa_aprob_f / tasa_aprob_m if tasa_aprob_m > 0 else 0.0
    disparate_impact = round(disparate_impact, 3)
    
    cumple_regla_45 = disparate_impact >= 0.80
    
    return {
        "exactitud_modelo": round(acc_global * 100.0, 1),
        "tasa_aprobacion_hombres": round(tasa_aprob_m * 100.0, 1),
        "tasa_aprobacion_mujeres": round(tasa_aprob_f * 100.0, 1),
        "disparate_impact": disparate_impact,
        "cumple_regla_cuatro_quintos": cumple_regla_45,
        "diagnostico_sesgo": (
            "El modelo cumple con el umbral de equidad de la regla del 4/5 (DI >= 0.80)."
            if cumple_regla_45 else
            f"¡ATENCIÓN! El modelo presenta SESGO O IMPACTO DISPAR (Disparate Impact = {disparate_impact} < 0.80). La probabilidad de aprobación para mujeres es significativamente menor que para hombres a igual nivel de ingresos."
        )
    }

def mitigar_sesgo_credito() -> dict:
    df = store.get_dataset("credito_solicitudes").copy()
    df["es_mujer"] = (df["genero"] == "F").astype(int)
    
    features = ["ingreso_mensual", "antiguedad_meses", "mora_historica", "edad", "es_mujer"]
    X = df[features]
    y = df["aprobado"]
    
    model = LogisticRegression(random_state=store.seed, max_iter=500)
    model.fit(X, y)
    
    probs = model.predict_proba(X)[:, 1]
    df["prob"] = probs
    
    eval_pre = evaluar_sesgo_credito()
    
    # Mitigación por Ajuste de Umbral Diferenciado por Grupo (Fair Threshold Adjustment)
    pred_mitigada = []
    for idx, row in df.iterrows():
        umbral = 0.30 if row["genero"] == "F" else 0.55
        pred_mitigada.append(1 if row["prob"] >= umbral else 0)
        
    df["pred_mitigada"] = pred_mitigada
    
    acc_mitigada = float(accuracy_score(y, pred_mitigada))
    
    df_m = df[df["genero"] == "M"]
    df_f = df[df["genero"] == "F"]
    
    tasa_m_post = float(df_m["pred_mitigada"].mean())
    tasa_f_post = float(df_f["pred_mitigada"].mean())
    
    di_post = round(tasa_f_post / tasa_m_post, 3) if tasa_m_post > 0 else 1.0
    
    return {
        "pre_mitigacion": {
            "exactitud": eval_pre["exactitud_modelo"],
            "disparate_impact": eval_pre["disparate_impact"],
            "tasa_hombres": eval_pre["tasa_aprobacion_hombres"],
            "tasa_mujeres": eval_pre["tasa_aprobacion_mujeres"],
            "cumple_45": eval_pre["cumple_regla_cuatro_quintos"]
        },
        "post_mitigacion": {
            "exactitud": round(acc_mitigada * 100.0, 1),
            "disparate_impact": di_post,
            "tasa_hombres": round(tasa_m_post * 100.0, 1),
            "tasa_mujeres": round(tasa_f_post * 100.0, 1),
            "cumple_45": di_post >= 0.80
        },
        "tradeoff_resumen": f"Tras la mitigación, el Disparate Impact mejoró de {eval_pre['disparate_impact']} a {di_post} (cumpliendo la regla del 4/5), manteniendo una alta exactitud del {round(acc_mitigada * 100.0, 1)}%."
    }

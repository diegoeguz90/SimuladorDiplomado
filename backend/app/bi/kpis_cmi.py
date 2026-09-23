"""
Calculadora de KPIs y Cuadro de Mando Integral (CMI / Balanced Scorecard) para M2.
"""
import pandas as pd
from app.datos.data_store import store

def calcular_kpis_cmi() -> dict:
    df_ventas = store.get_dataset("ventas")
    df_cat = store.get_dataset("catalogo")
    df_clientes = store.get_dataset("clientes")
    df_eventlog = store.get_dataset("pedidos_eventlog")
    df_sensores = store.get_dataset("sensores_bodega")
    
    # 1. Financiera
    total_ventas = float(df_ventas["valor"].sum()) if not df_ventas.empty else 0.0
    margen_promedio = float(df_cat["margen"].mean() * 100) if not df_cat.empty else 0.0
    ticket_promedio = float(df_ventas["valor"].mean()) if not df_ventas.empty else 0.0
    
    meta_ventas = 850000000.0
    meta_margen = 32.0
    meta_ticket = 450000.0
    
    status_ventas = "verde" if total_ventas >= meta_ventas else ("amarillo" if total_ventas >= meta_ventas * 0.8 else "rojo")
    status_margen = "verde" if margen_promedio >= meta_margen else ("amarillo" if margen_promedio >= meta_margen * 0.9 else "rojo")
    status_ticket = "verde" if ticket_promedio >= meta_ticket else ("amarillo" if ticket_promedio >= meta_ticket * 0.85 else "rojo")
    
    perspectiva_financiera = {
        "nombre": "Perspectiva Financiera",
        "indicadores": [
            {
                "id": "kpi_ventas",
                "nombre": "Ventas Totales Acumuladas",
                "valor": total_ventas,
                "meta": meta_ventas,
                "unidad": "COP",
                "formato": "moneda",
                "semaforo": status_ventas
            },
            {
                "id": "kpi_margen",
                "nombre": "Margen Bruto Promedio",
                "valor": round(margen_promedio, 2),
                "meta": meta_margen,
                "unidad": "%",
                "formato": "porcentaje",
                "semaforo": status_margen
            },
            {
                "id": "kpi_ticket",
                "nombre": "Valor Ticket Promedio",
                "valor": round(ticket_promedio, 2),
                "meta": meta_ticket,
                "unidad": "COP",
                "formato": "moneda",
                "semaforo": status_ticket
            }
        ]
    }
    
    # 2. Clientes
    n_clientes = len(df_clientes)
    ventas_online = float(df_ventas[df_ventas["canal"] == "Online"]["valor"].sum()) if not df_ventas.empty else 0.0
    pct_online = (ventas_online / total_ventas * 100) if total_ventas > 0 else 0.0
    
    meta_clientes = 30
    meta_pct_online = 20.0
    
    status_clientes = "verde" if n_clientes >= meta_clientes else "amarillo"
    status_online = "verde" if pct_online >= meta_pct_online else ("amarillo" if pct_online >= 15.0 else "rojo")
    
    perspectiva_cliente = {
        "nombre": "Perspectiva del Cliente",
        "indicadores": [
            {
                "id": "kpi_clientes",
                "nombre": "Total Clientes Corporativos Activos",
                "valor": n_clientes,
                "meta": meta_clientes,
                "unidad": "Clientes",
                "formato": "numero",
                "semaforo": status_clientes
            },
            {
                "id": "kpi_canal_online",
                "nombre": "Participación Canal Online",
                "valor": round(pct_online, 2),
                "meta": meta_pct_online,
                "unidad": "%",
                "formato": "porcentaje",
                "semaforo": status_online
            }
        ]
    }
    
    # 3. Procesos Internos
    if not df_eventlog.empty:
        df_log_sorted = df_eventlog.sort_values("timestamp")
        df_log_sorted["dt"] = pd.to_datetime(df_log_sorted["timestamp"])
        lead_times = df_log_sorted.groupby("case_id").agg(
            inicio=("dt", "min"),
            fin=("dt", "max"),
            actividades=("actividad", "count")
        )
        lead_times["duracion_horas"] = (lead_times["fin"] - lead_times["inicio"]).dt.total_seconds() / 3600.0
        lt_promedio = float(lead_times["duracion_horas"].mean())
        
        casos_reproceso = (lead_times["actividades"] > 6).sum()
        pct_reproceso = (casos_reproceso / len(lead_times)) * 100.0
    else:
        lt_promedio = 48.0
        pct_reproceso = 12.0
        
    meta_lt = 60.0
    meta_reproceso = 10.0
    
    status_lt = "verde" if lt_promedio <= meta_lt else ("amarillo" if lt_promedio <= 75.0 else "rojo")
    status_reproceso = "verde" if pct_reproceso <= meta_reproceso else ("amarillo" if pct_reproceso <= 20.0 else "rojo")
    
    perspectiva_procesos = {
        "nombre": "Perspectiva de Procesos Internos",
        "indicadores": [
            {
                "id": "kpi_lead_time",
                "nombre": "Lead Time Promedio de Pedidos",
                "valor": round(lt_promedio, 1),
                "meta": meta_lt,
                "unidad": "Horas",
                "formato": "numero",
                "semaforo": status_lt
            },
            {
                "id": "kpi_reproceso",
                "nombre": "Tasa de Reprocesos en Pedidos",
                "valor": round(pct_reproceso, 2),
                "meta": meta_reproceso,
                "unidad": "%",
                "formato": "porcentaje",
                "semaforo": status_reproceso
            }
        ]
    }
    
    # 4. Aprendizaje y Crecimiento
    flujo_promedio = float(df_sensores["flujo_cajas_hora"].dropna().mean()) if not df_sensores.empty else 120.0
    meta_flujo = 110.0
    status_flujo = "verde" if flujo_promedio >= meta_flujo else "amarillo"
    
    perspectiva_aprendizaje = {
        "nombre": "Perspectiva de Aprendizaje y Crecimiento",
        "indicadores": [
            {
                "id": "kpi_flujo_cajas",
                "nombre": "Productividad Logística Bodega",
                "valor": round(flujo_promedio, 1),
                "meta": meta_flujo,
                "unidad": "Cajas/Hora",
                "formato": "numero",
                "semaforo": status_flujo
            }
        ]
    }
    
    return {
        "perspectivas": [
            perspectiva_financiera,
            perspectiva_cliente,
            perspectiva_procesos,
            perspectiva_aprendizaje
        ]
    }

"""
Modelo de simulación de eventos discretos en SimPy y Ley de Little para M3.
"""
import random
import simpy
import numpy as np

def simular_escenario(num_validadores=2, auto_facturacion=False, n_pedidos=100, seed=42):
    """
    Ejecuta simulación SimPy para el proceso de pedidos de DistriAndina.
    """
    random.seed(seed)
    np.random.seed(seed)
    
    env = simpy.Environment()
    validador_res = simpy.Resource(env, capacity=num_validadores)
    
    tiempos_espera_credito = []
    lead_times_totales = []
    longitudes_cola = []
    
    def pedido_process(env, pedido_id):
        llegada = env.now
        
        # 1. Recibir Pedido (0.5 a 1.5 horas)
        yield env.timeout(random.uniform(0.5, 1.5))
        
        # 2. Validar Crédito (Recurso limitado)
        t_solicitud = env.now
        longitudes_cola.append(len(validador_res.queue))
        
        with validador_res.request() as req:
            yield req
            t_atencion = env.now
            tiempos_espera_credito.append(t_atencion - t_solicitud)
            
            # Duración de atención de crédito (2 a 6 horas por pedido)
            yield env.timeout(random.uniform(2.0, 6.0))
            
        # 3. Preparar mercancía (2 a 4 horas)
        yield env.timeout(random.uniform(2.0, 4.0))
        
        # 4. Despachar (3 a 8 horas)
        yield env.timeout(random.uniform(3.0, 8.0))
        
        # 5. Facturar (Si es auto_facturación: 0.1h; si no: 1 a 3h)
        dur_factura = 0.1 if auto_facturacion else random.uniform(1.0, 3.0)
        yield env.timeout(dur_factura)
        
        # 6. Cobrar (0.5 a 1.5h)
        yield env.timeout(random.uniform(0.5, 1.5))
        
        salida = env.now
        lead_times_totales.append(salida - llegada)

    def generador_pedidos(env):
        for i in range(n_pedidos):
            env.process(pedido_process(env, i))
            # Llegada de pedidos cada 1.5 a 3.0 horas (Tasa lambda ~ 0.44 pedidos/hora)
            yield env.timeout(random.uniform(1.5, 3.0))

    env.process(generador_pedidos(env))
    env.run()
    
    lt_promedio = float(np.mean(lead_times_totales))
    espera_credito_prom = float(np.mean(tiempos_espera_credito))
    max_cola = int(np.max(longitudes_cola)) if len(longitudes_cola) > 0 else 0
    prom_cola = float(np.mean(longitudes_cola)) if len(longitudes_cola) > 0 else 0.0
    
    # Tasa de llegada lambda (pedidos / hora simulada)
    tiempo_total_sim = env.now
    tasa_llegada_lambda = n_pedidos / tiempo_total_sim if tiempo_total_sim > 0 else 0.45
    
    # Ley de Little: L = lambda * W
    # L = inventario en proceso (trabajo en progreso WIP)
    # W = Lead time promedio
    wip_littles_law = tasa_llegada_lambda * lt_promedio
    
    # Utilización del recurso validador (%)
    # Tiempo total de uso / (capacidad * tiempo total)
    utilizacion_res = min(99.0, round(((n_pedidos * 4.0) / (num_validadores * tiempo_total_sim)) * 100.0, 1))
    
    return {
        "num_validadores": num_validadores,
        "auto_facturacion": auto_facturacion,
        "lead_time_promedio_h": round(lt_promedio, 1),
        "espera_credito_promedio_h": round(espera_credito_prom, 1),
        "longitud_cola_max": max_cola,
        "longitud_cola_promedio": round(prom_cola, 1),
        "utilizacion_validadores_pct": utilizacion_res,
        "ley_de_little": {
            "tasa_llegada_lambda": round(tasa_llegada_lambda, 3),
            "lead_time_W_horas": round(lt_promedio, 1),
            "wip_L_pedidos": round(wip_littles_law, 1),
            "formula_explicada": f"L (WIP) = λ ({round(tasa_llegada_lambda, 3)} ped/h) × W ({round(lt_promedio, 1)} h) = {round(wip_littles_law, 1)} pedidos en sistema simultáneamente."
        }
    }

def comparar_escenarios_simulacion() -> dict:
    sc_base = simular_escenario(num_validadores=1, auto_facturacion=False)
    sc_opt1 = simular_escenario(num_validadores=3, auto_facturacion=False)
    sc_opt2 = simular_escenario(num_validadores=3, auto_facturacion=True)
    
    return {
        "escenario_actual": {
            "nombre": "Escenario Actual (1 Validador, Facturación Manual)",
            **sc_base
        },
        "escenario_opcion_1": {
            "nombre": "Opción 1 (+2 Validadores de Crédito)",
            **sc_opt1
        },
        "escenario_opcion_2": {
            "nombre": "Opción 2 (3 Validadores + Automatización RPA Facturas)",
            **sc_opt2
        }
    }

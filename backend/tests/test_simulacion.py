"""
Pruebas unitarias para la simulación SimPy de eventos discretos.
"""
from app.procesos.simulacion import simular_escenario, comparar_escenarios_simulacion

def test_simulacion_simpy_ejecucion():
    res = simular_escenario(num_validadores=2, n_pedidos=50)
    assert res["lead_time_promedio_h"] > 0
    assert "ley_de_little" in res
    assert res["ley_de_little"]["wip_L_pedidos"] > 0

def test_mas_validadores_reduce_cola():
    sc1 = simular_escenario(num_validadores=1, n_pedidos=50, seed=42)
    sc3 = simular_escenario(num_validadores=4, n_pedidos=50, seed=42)
    
    assert sc3["espera_credito_promedio_h"] <= sc1["espera_credito_promedio_h"]
    assert sc3["lead_time_promedio_h"] <= sc1["lead_time_promedio_h"]

def test_comparativa_escenarios():
    comp = comparar_escenarios_simulacion()
    assert "escenario_actual" in comp
    assert "escenario_opcion_1" in comp
    assert "escenario_opcion_2" in comp

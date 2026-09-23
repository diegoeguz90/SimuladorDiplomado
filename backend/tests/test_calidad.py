"""
Pruebas unitarias para reglas de calidad de datos.
"""
from app.gobierno.calidad import ejecutar_reglas_calidad
from app.datos.data_store import store

def test_reglas_calidad_pasan_en_modo_limpio():
    store.regenerar(modo="limpio")
    res = ejecutar_reglas_calidad()
    assert res["score_global_calidad"] >= 95.0
    assert res["reglas_pasadas"] == res["total_reglas"]

def test_reglas_calidad_fallan_en_modo_sucio():
    store.regenerar(modo="sucio")
    res = ejecutar_reglas_calidad()
    assert res["score_global_calidad"] < 95.0
    assert res["reglas_pasadas"] < res["total_reglas"]

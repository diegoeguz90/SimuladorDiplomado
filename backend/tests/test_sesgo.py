"""
Pruebas unitarias para modelo de equidad en IA y Disparate Impact.
"""
from app.gobierno.etica_sesgo import evaluar_sesgo_credito, mitigar_sesgo_credito
from app.datos.data_store import store

def test_modelo_credito_detecta_sesgo():
    store.regenerar(seed=42)
    eval_pre = evaluar_sesgo_credito()
    
    assert "disparate_impact" in eval_pre
    assert eval_pre["disparate_impact"] < 0.80
    assert eval_pre["cumple_regla_cuatro_quintos"] is False

def test_mitigacion_sesgo_mejora_disparate_impact():
    store.regenerar(seed=42)
    res_mitigacion = mitigar_sesgo_credito()
    
    pre = res_mitigacion["pre_mitigacion"]
    post = res_mitigacion["post_mitigacion"]
    
    assert post["disparate_impact"] > pre["disparate_impact"]
    assert post["disparate_impact"] >= 0.80
    assert post["cumple_45"] is True

"""
Pruebas unitarias para el laboratorio ETL.
"""
from app.bi.etl import ejecutar_pipeline_etl
from app.datos.data_store import store

def test_pipeline_etl_limpia_facturas_sucias():
    store.regenerar(modo="sucio")
    res = ejecutar_pipeline_etl()
    
    assert "pasos" in res
    assert "reporte_calidad" in res
    assert "preview_limpia" in res
    assert len(res["preview_limpia"]) > 0
    
    calidad = res["reporte_calidad"]
    assert calidad["promedio_global"] > 70.0
    assert calidad["unicidad"] == 100.0  # Tras deduplicar

def test_pipeline_etl_limpio():
    store.regenerar(modo="limpio")
    res = ejecutar_pipeline_etl()
    assert res["reporte_calidad"]["promedio_global"] >= 95.0

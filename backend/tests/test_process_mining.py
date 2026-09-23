"""
Pruebas unitarias para minería de procesos y RAG local.
"""
from app.procesos.process_mining import analizar_log_eventos
from app.gobierno.arquitectura import buscar_mini_rag

def test_process_mining_detecta_cuello_botella():
    res = analizar_log_eventos()
    assert "cuello_botella" in res
    assert res["cuello_botella"]["actividad"] == "validar_credito"
    assert len(res["variantes"]) >= 5
    assert res["tasa_reproceso"]["porcentaje"] > 0

def test_mini_rag_busqueda_semantica():
    res = buscar_mini_rag("crédito equidad sesgo", top_k=1)
    assert res["total_encontrados"] > 0
    top_doc = res["resultados"][0]
    assert "Crédito" in top_doc["titulo"] or "Política" in top_doc["titulo"]
    assert top_doc["similitud"] > 0.1

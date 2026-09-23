"""
Pruebas de integración para los endpoints REST de FastAPI.
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"

def test_api_datos_resumen():
    response = client.get("/api/datos/resumen")
    assert response.status_code == 200
    data = response.json()
    assert "tablas" in data
    assert "ventas" in data["tablas"]

def test_api_datos_preview():
    response = client.get("/api/datos/preview/catalogo?n=5")
    assert response.status_code == 200
    data = response.json()
    assert len(data["filas"]) == 5

def test_api_m1_eda():
    response = client.get("/api/m1/eda/estadisticas/catalogo")
    assert response.status_code == 200
    data = response.json()
    assert data["tabla"] == "catalogo"

def test_api_m2_cmi():
    response = client.get("/api/m2/kpis-cmi")
    assert response.status_code == 200
    data = response.json()
    assert "perspectivas" in data

def test_api_retos_y_glosario():
    resp_retos = client.get("/api/retos")
    assert resp_retos.status_code == 200
    assert len(resp_retos.json()["retos"]) == 8

    resp_glo = client.get("/api/glosario?q=ETL")
    assert resp_glo.status_code == 200
    assert len(resp_glo.json()["terminos"]) >= 1

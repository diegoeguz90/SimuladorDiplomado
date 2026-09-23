"""
Router de endpoints para Módulo 2 (ETL y CMI).
"""
from fastapi import APIRouter
from app.bi.etl import ejecutar_pipeline_etl
from app.bi.kpis_cmi import calcular_kpis_cmi

router = APIRouter(prefix="/api/m2", tags=["Módulo 2 - BI y Decisiones"])

@router.get("/etl/ejecutar")
def run_etl():
    return ejecutar_pipeline_etl()

@router.get("/kpis-cmi")
def get_cmi():
    return calcular_kpis_cmi()

"""
Router de endpoints para Módulo 4 (Gobierno, Ética ML, Arquitectura Medallion y RAG).
"""
from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional
from app.gobierno.calidad import obtener_catalogo_gobierno, ejecutar_reglas_calidad
from app.gobierno.etica_sesgo import evaluar_sesgo_credito, mitigar_sesgo_credito
from app.gobierno.arquitectura import obtener_capas_medallion, buscar_mini_rag
from app.gobierno.estrategia import obtener_plan_estrategico

router = APIRouter(prefix="/api/m4", tags=["Módulo 4 - Gobierno y Arquitectura"])

class RAGQueryRequest(BaseModel):
    consulta: str
    top_k: Optional[int] = 2

@router.get("/gobierno/catalogo")
def get_catalogo():
    return obtener_catalogo_gobierno()

@router.get("/gobierno/calidad")
def get_calidad():
    return ejecutar_reglas_calidad()

@router.get("/etica/credito-modelo")
def get_evaluacion_sesgo():
    return evaluar_sesgo_credito()

@router.post("/etica/credito-mitigar")
def run_mitigacion_sesgo():
    return mitigar_sesgo_credito()

@router.get("/arquitectura/medallion")
def get_medallion():
    return {"capas": obtener_capas_medallion()}

@router.post("/arquitectura/rag/buscar")
def search_rag(req: RAGQueryRequest):
    return buscar_mini_rag(query=req.consulta, top_k=req.top_k)

@router.get("/estrategia/plan")
def get_plan_estrategico():
    return obtener_plan_estrategico()

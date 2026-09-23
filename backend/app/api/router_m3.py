"""
Router de endpoints para Módulo 3 (Process Mining, Simulación y Hiperautomatización).
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.procesos.process_mining import analizar_log_eventos
from app.procesos.simulacion import simular_escenario, comparar_escenarios_simulacion
from app.procesos.hiperautomatizacion import obtener_modelo_hiperautomatizacion

router = APIRouter(prefix="/api/m3", tags=["Módulo 3 - Automatización y RPA"])

class SimulacionRequest(BaseModel):
    num_validadores: Optional[int] = 2
    auto_facturacion: Optional[bool] = False
    n_pedidos: Optional[int] = 100

@router.get("/process-mining/resumen")
def get_process_mining():
    return analizar_log_eventos()

@router.post("/simulacion/ejecutar")
def run_simulacion(req: SimulacionRequest):
    return simular_escenario(
        num_validadores=req.num_validadores,
        auto_facturacion=req.auto_facturacion,
        n_pedidos=req.n_pedidos
    )

@router.get("/simulacion/comparativa")
def get_comparativa():
    return comparar_escenarios_simulacion()

@router.get("/hiperautomatizacion")
def get_hiperautomatizacion():
    return obtener_modelo_hiperautomatizacion()

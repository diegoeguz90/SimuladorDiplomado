"""
Router de endpoints para Retos Interactivos.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from app.retos.retos_engine import obtener_retos, evaluar_reto

router = APIRouter(prefix="/api/retos", tags=["Retos Transversales"])

class RetoAnswerRequest(BaseModel):
    reto_id: str
    opcion_seleccionada: int

@router.get("")
def get_retos():
    return {"retos": obtener_retos()}

@router.post("/evaluar")
def submit_reto(req: RetoAnswerRequest):
    return evaluar_reto(req.reto_id, req.opcion_seleccionada)

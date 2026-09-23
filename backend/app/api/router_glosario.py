"""
Router de endpoints para el Glosario de Términos del diplomado.
"""
from fastapi import APIRouter, Query
from typing import Optional
from app.retos.glosario import obtener_glosario

router = APIRouter(prefix="/api/glosario", tags=["Glosario"])

@router.get("")
def get_glosario(q: Optional[str] = Query(None, description="Término o palabra clave a buscar")):
    return {"terminos": obtener_glosario(q=q)}

"""
Router de endpoints para Módulo 1 (EDA y Quiz DIKW).
"""
from fastapi import APIRouter, HTTPException, Query
from app.analitica.eda import (
    obtener_estadisticas_tabla,
    obtener_distribucion_columna,
    obtener_matriz_correlacion,
    obtener_drilldown_ventas
)
from app.analitica.dikw import obtener_ejercicios_dikw

router = APIRouter(prefix="/api/m1", tags=["Módulo 1 - Fundamentos y EDA"])

@router.get("/eda/estadisticas/{nombre}")
def get_estadisticas(nombre: str):
    try:
        return obtener_estadisticas_tabla(nombre)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/eda/distribucion/{nombre}/{columna}")
def get_distribucion(nombre: str, columna: str, bins: int = Query(10, ge=3, le=50)):
    try:
        return obtener_distribucion_columna(nombre, columna, bins_count=bins)
    except (KeyError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/eda/correlacion/{nombre}")
def get_correlacion(nombre: str):
    try:
        return obtener_matriz_correlacion(nombre)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/eda/drilldown")
def get_drilldown():
    return obtener_drilldown_ventas()

@router.get("/dikw/preguntas")
def get_dikw():
    return {"ejercicios": obtener_ejercicios_dikw()}

"""
Router de endpoints para gestión y descarga de los datasets de DistriAndina.
"""
from fastapi import APIRouter, HTTPException, Query, Response
from pydantic import BaseModel
from typing import Optional
from app.datos.data_store import store

router = APIRouter(prefix="/api/datos", tags=["Datos"])

class ConfigRequest(BaseModel):
    seed: Optional[int] = 42
    years: Optional[int] = 2
    num_tiendas: Optional[int] = 5
    modo: Optional[str] = "limpio"

@router.get("/resumen")
def get_resumen():
    return store.get_resumen_estadisticas()

@router.post("/config")
def actualizar_config(config: ConfigRequest):
    store.regenerar(
        seed=config.seed,
        years=config.years,
        num_tiendas=config.num_tiendas,
        modo=config.modo
    )
    return {
        "mensaje": "Universo de datos regenerado con éxito",
        "resumen": store.get_resumen_estadisticas()
    }

@router.get("/preview/{nombre}")
def preview_dataset(nombre: str, n: int = Query(15, ge=1, le=100)):
    try:
        df = store.get_dataset(nombre)
        preview_rows = df.head(n).to_dict(orient="records")
        return {
            "nombre": nombre,
            "total_filas": len(df),
            "total_columnas": len(df.columns),
            "columnas": list(df.columns),
            "filas": preview_rows
        }
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/exportar/{nombre}")
def exportar_csv(nombre: str):
    try:
        csv_data = store.get_csv_string(nombre)
        filename = f"distriandina_{nombre}_{store.modo}_seed{store.seed}.csv"
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))

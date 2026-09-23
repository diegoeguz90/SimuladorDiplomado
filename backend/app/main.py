"""
Entrypoint principal de FastAPI para DistriAndina Analytics Lab.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import APP_NAME, VERSION, COMPANY_NAME
from app.api import (
    router_datos,
    router_m1,
    router_m2,
    router_m3,
    router_m4,
    router_retos,
    router_glosario
)

app = FastAPI(
    title=APP_NAME,
    version=VERSION,
    description=f"Simulador web educativo para el diplomado en Analítica Estratégica y Gobierno de Datos ({COMPANY_NAME})."
)

# Configuración CORS para permitir peticiones desde el frontend React/Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers por módulo
app.include_router(router_datos.router)
app.include_router(router_m1.router)
app.include_router(router_m2.router)
app.include_router(router_m3.router)
app.include_router(router_m4.router)
app.include_router(router_retos.router)
app.include_router(router_glosario.router)

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "app": APP_NAME,
        "version": VERSION,
        "company": COMPANY_NAME
    }

import os
from fastapi.staticfiles import StaticFiles

# Si existe la compilación del frontend (en Docker/Render/Producción unificada), servir la SPA
dist_paths = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist")),
    os.path.abspath(os.path.join(os.getcwd(), "frontend", "dist")),
    os.path.abspath(os.path.join(os.getcwd(), "dist")),
]

for dist_path in dist_paths:
    if os.path.exists(dist_path) and os.path.exists(os.path.join(dist_path, "index.html")):
        app.mount("/", StaticFiles(directory=dist_path, html=True), name="frontend")
        break

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)


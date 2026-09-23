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
def health_check():
    return {
        "status": "ok",
        "app": APP_NAME,
        "version": VERSION,
        "company": COMPANY_NAME
    }

@app.get("/")
def root_info():
    return {
        "mensaje": f"Bienvenido a la API REST de {APP_NAME}",
        "docs_url": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)

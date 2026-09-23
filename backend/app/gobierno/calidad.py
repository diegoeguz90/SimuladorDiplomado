"""
Catálogo de datos y reglas de calidad ejecutables para M4.
"""
import re
import pandas as pd
import numpy as np
from app.datos.data_store import store

def obtener_catalogo_gobierno() -> dict:
    catalogo = [
        {
            "tabla": "catalogo",
            "descripcion": "Maestro de productos comercializados por DistriAndina.",
            "propietario": "Gerencia Comercial",
            "clasificacion": "Pública Interna",
            "clave_primaria": "id_producto",
            "columnas_sensibles": []
        },
        {
            "tabla": "tiendas",
            "descripcion": "Maestro de puntos de venta físicos y canal virtual.",
            "propietario": "Gerencia de Operaciones",
            "clasificacion": "Pública Interna",
            "clave_primaria": "id_tienda",
            "columnas_sensibles": []
        },
        {
            "tabla": "clientes",
            "descripcion": "Base de clientes corporativos, PyME y minoristas con atributos sensibles.",
            "propietario": "Gerencia de Clientes / Servicio",
            "clasificacion": "Confidencial / HABEAS DATA",
            "clave_primaria": "id_cliente",
            "columnas_sensibles": ["nombre", "genero", "edad"]
        },
        {
            "tabla": "ventas",
            "descripcion": "Registro transaccional diario de ventas por tienda, producto y canal.",
            "propietario": "Gerencia de Ventas y Finanzas",
            "clasificacion": "Confidencial",
            "clave_primaria": "(fecha, id_tienda, id_producto, id_cliente)",
            "columnas_sensibles": []
        },
        {
            "tabla": "pedidos_eventlog",
            "descripcion": "Log de eventos del proceso de pedidos corporativos para Process Mining.",
            "propietario": "Gerencia de Logística y Cadena de Suministro",
            "clasificacion": "Pública Interna",
            "clave_primaria": "(case_id, actividad, timestamp)",
            "columnas_sensibles": []
        },
        {
            "tabla": "sensores_bodega",
            "descripcion": "Series temporales IoT de condiciones ambientales y productividad en bodega.",
            "propietario": "Gerencia de Tecnología e Infraestructura",
            "clasificacion": "Pública Interna",
            "clave_primaria": "(fecha_hora, sensor)",
            "columnas_sensibles": []
        },
        {
            "tabla": "facturas",
            "descripcion": "Facturas recibidas de proveedores para radicación y pago.",
            "propietario": "Gerencia Contable y Financiera",
            "clasificacion": "Restringida / Financiera",
            "clave_primaria": "id_factura",
            "columnas_sensibles": ["nit_proveedor", "monto_total"]
        },
        {
            "tabla": "credito_solicitudes",
            "descripcion": "Solicitudes de crédito corporativo evaluadas para aprobación.",
            "propietario": "Gerencia de Riesgo y Crédito",
            "clasificacion": "Altamente Confidencial / HABEAS DATA",
            "clave_primaria": "id_solicitud",
            "columnas_sensibles": ["ingreso_mensual", "genero", "mora_historica"]
        }
    ]
    return {"catalogo": catalogo}

def ejecutar_reglas_calidad() -> dict:
    # Definición de reglas por tabla
    reglas_definicion = [
        # Facturas
        {
            "tabla": "facturas",
            "regla_id": "REG-FAC-01",
            "nombre": "Completitud de Montos",
            "descripcion": "El campo 'monto_total' no debe contener valores nulos.",
            "eval_fn": lambda df: (df["monto_total"].notnull()).mean()
        },
        {
            "tabla": "facturas",
            "regla_id": "REG-FAC-02",
            "nombre": "Unicidad de ID Factura",
            "descripcion": "El campo 'id_factura' debe ser único sin duplicados.",
            "eval_fn": lambda df: (1.0 - (df.duplicated(subset=["id_factura"]).sum() / len(df))) if len(df) > 0 else 1.0
        },
        {
            "tabla": "facturas",
            "regla_id": "REG-FAC-03",
            "nombre": "Validez de Fecha ISO",
            "descripcion": "La fecha debe cumplir el estándar YYYY-MM-DD.",
            "eval_fn": lambda df: df["fecha_factura"].astype(str).str.match(r"^\d{4}-\d{2}-\d{2}$").mean()
        },
        # Clientes
        {
            "tabla": "clientes",
            "regla_id": "REG-CLI-01",
            "nombre": "Completitud de Ciudad",
            "descripcion": "El campo 'ciudad' del cliente no debe ser nulo.",
            "eval_fn": lambda df: (df["ciudad"].notnull()).mean()
        },
        {
            "tabla": "clientes",
            "regla_id": "REG-CLI-02",
            "nombre": "Rango Válido de Edad",
            "descripcion": "La edad del cliente debe estar entre 18 y 100 años.",
            "eval_fn": lambda df: df["edad"].apply(lambda e: 1 if pd.notnull(e) and 18 <= e <= 100 else 0).mean()
        },
        # Catálogo
        {
            "tabla": "catalogo",
            "regla_id": "REG-CAT-01",
            "nombre": "Margen Positivo",
            "descripcion": "El margen del producto debe ser estrictamente mayor a 0.",
            "eval_fn": lambda df: (df["margen"] > 0).mean()
        },
        {
            "tabla": "catalogo",
            "regla_id": "REG-CAT-02",
            "nombre": "Precio Venta > Precio Compra",
            "descripcion": "El precio de venta debe superar el precio de compra.",
            "eval_fn": lambda df: (df["precio_venta"] > df["precio_compra"]).mean()
        },
        # Crédito
        {
            "tabla": "credito_solicitudes",
            "regla_id": "REG-CRE-01",
            "nombre": "Ingresos Positivos",
            "descripcion": "El ingreso mensual debe ser mayor a 0.",
            "eval_fn": lambda df: (df["ingreso_mensual"] > 0).mean()
        }
    ]
    
    resultados = []
    reglas_pasadas = 0
    total_reglas = len(reglas_definicion)
    
    for r in reglas_definicion:
        tabla_nombre = r["tabla"]
        df_target = store.get_dataset(tabla_nombre)
        
        try:
            cumplimiento_pct = float(r["eval_fn"](df_target)) * 100.0
            cumplimiento_pct = round(cumplimiento_pct, 2)
        except Exception:
            cumplimiento_pct = 0.0
            
        paso = cumplimiento_pct >= 98.0
        if paso:
            reglas_pasadas += 1
            
        resultados.append({
            "regla_id": r["regla_id"],
            "tabla": tabla_nombre,
            "nombre": r["nombre"],
            "descripcion": r["descripcion"],
            "cumplimiento_pct": cumplimiento_pct,
            "estado": "Pasa" if paso else "Falla"
        })
        
    score_global = round((reglas_pasadas / total_reglas) * 100.0, 1)
    
    return {
        "score_global_calidad": score_global,
        "reglas_pasadas": reglas_pasadas,
        "total_reglas": total_reglas,
        "modo_actual": store.modo,
        "reglas_evaluadas": resultados
    }

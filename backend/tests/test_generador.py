"""
Pruebas unitarias para la generación sintética de datos.
"""
import pytest
from app.datos.generador import generar_universo
from app.datos.data_store import store

def test_generador_semilla_reproducible():
    univ1 = generar_universo(seed=42, years=2, num_tiendas=5, modo="limpio")
    univ2 = generar_universo(seed=42, years=2, num_tiendas=5, modo="limpio")
    
    assert len(univ1["ventas"]) == len(univ2["ventas"])
    assert univ1["ventas"].iloc[0]["valor"] == univ2["ventas"].iloc[0]["valor"]
    assert len(univ1["clientes"]) == len(univ2["clientes"])

def test_generador_tablas_existentes():
    univ = generar_universo(seed=42)
    tablas_esperadas = ["catalogo", "tiendas", "clientes", "ventas", "pedidos_eventlog", "sensores_bodega", "facturas", "credito_solicitudes"]
    for t in tablas_esperadas:
        assert t in univ
        assert not univ[t].empty

def test_integridad_referencial_ventas_tiendas():
    univ = generar_universo(seed=42)
    tiendas_ids = set(univ["tiendas"]["id_tienda"])
    ventas_tiendas = set(univ["ventas"]["id_tienda"])
    assert ventas_tiendas.issubset(tiendas_ids)

def test_integridad_referencial_ventas_catalogo():
    univ = generar_universo(seed=42)
    prod_ids = set(univ["catalogo"]["id_producto"])
    ventas_prods = set(univ["ventas"]["id_producto"])
    assert ventas_prods.issubset(prod_ids)

def test_modo_sucio_inyecta_nulos():
    univ_limpio = generar_universo(seed=42, modo="limpio")
    univ_sucio = generar_universo(seed=42, modo="sucio")
    
    nulos_limpio = univ_limpio["facturas"].isnull().sum().sum()
    nulos_sucio = univ_sucio["facturas"].isnull().sum().sum()
    assert nulos_sucio > nulos_limpio

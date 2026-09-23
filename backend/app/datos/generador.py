"""
Generador sintético reproducible para el universo de datos de DistriAndina S.A.S.
Soporta semilla fija y modos 'limpio' y 'sucio'.
"""
import random
import datetime
import numpy as np
import pandas as pd
from faker import Faker

def generar_universo(seed=42, years=2, num_tiendas=5, modo="limpio"):
    """
    Genera el universo completo de 8 datasets para DistriAndina S.A.S.
    """
    # Establecer semillas para reproducibilidad exacta
    random.seed(seed)
    np.random.seed(seed)
    fake = Faker('es_CO')
    Faker.seed(seed)
    
    # 1. Catálogo de Productos (~50 productos)
    categorias = ["Lácteos", "Embutidos", "Bebidas", "Abarrotes", "Enlatados", "Limpieza"]
    nombres_base = {
        "Lácteos": ["Queso Campesino", "Queso Doble Crema", "Leche Entera 1L", "Yogurt Fresa 1L", "Mantequilla 250g", "Crema de Leche", "Quesito Antioqueño", "Arequipe 250g"],
        "Embutidos": ["Jamón de Cerdo 250g", "Salchicha Manguera 500g", "Chorizo Santarrosano", "Tocineta Ahumada", "Salchichón Cervecero", "Mortadela Especial", "Salami Premium"],
        "Bebidas": ["Jugo de Naranja 1L", "Gaseosa Cola 2L", "Agua Mineral 500ml", "Cerveza Club 330ml", "Refresco de Frutilla 1L", "Té Helado Limón 500ml", "Bebida Energizante 250ml", "Vino Tinto Reservado"],
        "Abarrotes": ["Arroz Premium 1kg", "Frijol Bola Roja 500g", "Aceite Vegetal 1L", "Panela Cuadrada 1kg", "Harina de Maíz 1kg", "Pasta Espagueti 500g", "Sal Refinada 1kg", "Azúcar Blanca 1kg", "Café Molido 500g"],
        "Enlatados": ["Atún en Agua 170g", "Sardinas en Tomate 425g", "Maíz Dulce 300g", "Arvejas con Zanahoria 300g", "Frijoles Refritos 400g", "Duraznos en Almíbar 820g"],
        "Limpieza": ["Detergente en Polvo 1kg", "Jabón Líquido Multiusos 1L", "Límpido / Cloro 1L", "Desinfectante Lavanda 1L", "Jabón de Loza 500g", "Papel Higiénico 4 rollos", "Suavizante de Telas 1L", "Esponja Multiuso 3 pack"]
    }
    
    cat_rows = []
    prod_id_counter = 101
    for cat, lista_nombres in nombres_base.items():
        for nombre in lista_nombres:
            p_compra = round(random.uniform(2000, 45000), -2)
            margen_pct = random.uniform(0.20, 0.45)
            p_venta = round(p_compra * (1 + margen_pct), -2)
            margen_real = round((p_venta - p_compra) / p_venta, 4)
            cat_rows.append({
                "id_producto": f"PROD-{prod_id_counter}",
                "nombre": nombre,
                "categoria": cat,
                "precio_compra": float(p_compra),
                "precio_venta": float(p_venta),
                "margen": float(margen_real)
            })
            prod_id_counter += 1
            
    df_catalogo = pd.DataFrame(cat_rows)
    
    # 2. Tiendas (4 físicas + 1 online)
    tiendas_info = [
        {"id_tienda": "T001", "nombre": "DistriAndina Bogotá Norte", "ciudad": "Bogotá", "tamano_m2": 850, "apertura": 2015},
        {"id_tienda": "T002", "nombre": "DistriAndina Medellín Poblado", "ciudad": "Medellín", "tamano_m2": 650, "apertura": 2017},
        {"id_tienda": "T003", "nombre": "DistriAndina Cali Chipichape", "ciudad": "Cali", "tamano_m2": 500, "apertura": 2018},
        {"id_tienda": "T004", "nombre": "DistriAndina Barranquilla Prado", "ciudad": "Barranquilla", "tamano_m2": 450, "apertura": 2020},
        {"id_tienda": "T005", "nombre": "DistriAndina Canal Online", "ciudad": "Bogotá", "tamano_m2": 0, "apertura": 2021}
    ]
    df_tiendas = pd.DataFrame(tiendas_info[:num_tiendas])
    
    # 3. Clientes (~30 clientes)
    ciudades_lista = ["Bogotá", "Medellín", "Cali", "Barranquilla"]
    segmentos = ["Corporativo", "PyME", "Minorista"]
    generos = ["M", "F"]
    
    cli_rows = []
    for i in range(1, 31):
        genero = random.choice(generos)
        nombre = fake.name_male() if genero == "M" else fake.name_female()
        if random.random() < 0.4:
            nombre = f"Comercializadora {fake.last_name()} S.A.S."
            
        cli_rows.append({
            "id_cliente": f"CLI-{1000 + i}",
            "nombre": nombre,
            "ciudad": random.choice(ciudades_lista),
            "genero": genero,
            "edad": random.randint(22, 65),
            "segmento": random.choice(segmentos),
            "fecha_ingreso": (datetime.date(2022, 1, 1) + datetime.timedelta(days=random.randint(0, 700))).isoformat()
        })
    df_clientes = pd.DataFrame(cli_rows)
    
    # 4. Ventas Diarias (Estacionalidad, Tendencia, Ruido y 2 Eventos Anómalos)
    fecha_fin = datetime.date.today()
    fecha_inicio = fecha_fin - datetime.timedelta(days=365 * years)
    dias_totales = (fecha_fin - fecha_inicio).days
    
    ventas_rows = []
    lista_prod_ids = df_catalogo["id_producto"].tolist()
    lista_tienda_ids = df_tiendas["id_tienda"].tolist()
    lista_cliente_ids = df_clientes["id_cliente"].tolist()
    precios_dict = dict(zip(df_catalogo["id_producto"], df_catalogo["precio_venta"]))
    
    # Generar ventas simuladas
    curr_date = fecha_inicio
    day_idx = 0
    
    # Eventos anómalos:
    # Evento 1: Pico de demanda en diciembre año 2 (día_idx específico)
    pico_demanda_start = dias_totales - 40
    pico_demanda_end = dias_totales - 30
    
    # Evento 2: Quiebre de stock en tienda T002 durante junio año 2
    quiebre_stock_start = dias_totales - 180
    quiebre_stock_end = dias_totales - 173
    
    while curr_date <= fecha_fin:
        # Tendencia lineal leve
        tendencia = 1.0 + (day_idx / dias_totales) * 0.25
        # Estacionalidad semanal (Fin de semana vende 40% más)
        est_semanal = 1.4 if curr_date.weekday() in [4, 5] else 0.9
        # Estacionalidad anual (Diciembre vende 60% más)
        est_anual = 1.6 if curr_date.month == 12 else 1.0
        
        # Muestra diaria de transacciones
        n_trans = random.randint(15, 35)
        for _ in range(n_trans):
            tienda = random.choice(lista_tienda_ids)
            prod = random.choice(lista_prod_ids)
            cliente = random.choice(lista_cliente_ids)
            canal = "Online" if tienda == "T005" else random.choice(["Presencial", "Teléfono"])
            
            # Unidades base
            base_u = random.randint(1, 10)
            
            # Aplicar efecto anomalía 1: Pico de demanda
            if pico_demanda_start <= day_idx <= pico_demanda_end:
                base_u = int(base_u * random.uniform(2.5, 4.0))
                
            # Aplicar efecto anomalía 2: Quiebre de stock en T002
            if tienda == "T002" and quiebre_stock_start <= day_idx <= quiebre_stock_end:
                base_u = 0  # Sin inventario
                
            if base_u > 0:
                unidades = int(np.round(base_u * tendencia * est_semanal * est_anual))
                unidades = max(1, unidades)
                precio_u = precios_dict[prod]
                valor_total = round(unidades * precio_u, 2)
                
                ventas_rows.append({
                    "fecha": curr_date.isoformat(),
                    "id_tienda": tienda,
                    "id_producto": prod,
                    "id_cliente": cliente,
                    "canal": canal,
                    "unidades": unidades,
                    "valor": valor_total
                })
                
        curr_date += datetime.timedelta(days=1)
        day_idx += 1
        
    df_ventas = pd.DataFrame(ventas_rows)
    
    # 5. Pedidos Event Log (Process Mining - Pedidos Corporativos)
    # Actividades: recibir_pedido -> validar_credito -> preparar_mercancia -> despachar -> facturar -> cobrar
    recursos = {
        "recibir_pedido": ["Asistente_Ventas_1", "Asistente_Ventas_2", "Portal_Web"],
        "validar_credito": ["Analista_Riesgo_1", "Analista_Riesgo_2"],
        "preparar_mercancia": ["Bodega_Operador_A", "Bodega_Operador_B"],
        "despachar": ["Logistica_Conductor_1", "Logistica_Conductor_2"],
        "facturar": ["Contabilidad_Aux_1", "Facturador_Auto"],
        "cobrar": ["Tesorería_Ejecutivo_1"]
    }
    
    event_rows = []
    n_casos = 120
    fecha_base_log = datetime.datetime.now() - datetime.timedelta(days=60)
    
    for case_i in range(1, n_casos + 1):
        case_id = f"ORD-{2000 + case_i}"
        monto_case = round(random.uniform(500000, 15000000), -3)
        prioridad = random.choice(["Alta", "Media", "Normal"])
        
        # Variantes de proceso (al menos 5 caminos distintos)
        variante = random.choices([1, 2, 3, 4, 5], weights=[0.45, 0.20, 0.15, 0.10, 0.10])[0]
        
        t_curr = fecha_base_log + datetime.timedelta(days=random.randint(0, 50), hours=random.randint(8, 16))
        
        if variante == 1:
            # Estándar
            secuencia = ["recibir_pedido", "validar_credito", "preparar_mercancia", "despachar", "facturar", "cobrar"]
        elif variante == 2:
            # Express (crédito pre-aprobado)
            secuencia = ["recibir_pedido", "preparar_mercancia", "despachar", "facturar", "cobrar"]
        elif variante == 3:
            # Reproceso en Crédito (falla y vuelve a recibir pedido)
            secuencia = ["recibir_pedido", "validar_credito", "recibir_pedido", "validar_credito", "preparar_mercancia", "despachar", "facturar", "cobrar"]
        elif variante == 4:
            # Demora en Despacho por falta de vehículo
            secuencia = ["recibir_pedido", "validar_credito", "preparar_mercancia", "preparar_mercancia", "despachar", "facturar", "cobrar"]
        else:
            # Pago anticipado
            secuencia = ["recibir_pedido", "facturar", "cobrar", "preparar_mercancia", "despachar"]
            
        for act in secuencia:
            # Cuello de botella sembrado en 'validar_credito': espera larga de 24 a 48 horas
            if act == "validar_credito":
                duracion_horas = random.uniform(24.0, 52.0)
            elif act == "preparar_mercancia":
                duracion_horas = random.uniform(2.0, 6.0)
            elif act == "despachar":
                duracion_horas = random.uniform(4.0, 12.0)
            else:
                duracion_horas = random.uniform(0.5, 2.5)
                
            t_curr += datetime.timedelta(hours=duracion_horas)
            recurso = random.choice(recursos[act if act in recursos else "recibir_pedido"])
            
            event_rows.append({
                "case_id": case_id,
                "actividad": act,
                "timestamp": t_curr.strftime("%Y-%m-%d %H:%M:%S"),
                "recurso": recurso,
                "monto": float(monto_case),
                "prioridad": prioridad
            })
            
    df_eventlog = pd.DataFrame(event_rows)
    
    # 6. Sensores de Bodega (IoT time series con fallas)
    dias_sensores = 14
    start_sensor_date = datetime.datetime.now() - datetime.timedelta(days=dias_sensores)
    sensor_rows = []
    
    sensores = ["SENSOR_TEMP_01", "SENSOR_HUM_01", "SENSOR_FLUJO_01"]
    
    for h in range(dias_sensores * 24):
        t_stamp = start_sensor_date + datetime.timedelta(hours=h)
        
        # Temperatura base 18-22 C
        temp = 20.0 + 3.0 * np.sin(h / 6.0) + random.uniform(-0.8, 0.8)
        # Humedad base 55-65%
        hum = 60.0 + 5.0 * np.cos(h / 8.0) + random.uniform(-1.5, 1.5)
        # Flujo cajas base 50-200 cajas/hora
        flujo = max(0, int(120 + 60 * np.sin(h / 4.0) + random.randint(-20, 20)))
        
        # Inyectar anomalía 1: Pico de temperatura (falla de aire acondicionado en hora h=120)
        if 115 <= h <= 125:
            temp += 14.5  # Pico > 34°C
            
        # Inyectar anomalía 2: Falla de transmisión de sensor (h=200 a h=212)
        if 200 <= h <= 212:
            hum = np.nan
            flujo = None
            
        sensor_rows.append({
            "fecha_hora": t_stamp.strftime("%Y-%m-%d %H:00:00"),
            "sensor_temp": round(float(temp), 2) if not np.isnan(temp) else None,
            "sensor_humedad": round(float(hum), 2) if not (isinstance(hum, float) and np.isnan(hum)) else None,
            "flujo_cajas_hora": flujo
        })
        
    df_sensores = pd.DataFrame(sensor_rows)
    
    # 7. Facturas de Proveedores (para Laboratorio ETL)
    proveedores = [
        {"nombre": "Lácteos del Campo S.A.", "nit": "890.102.344-1"},
        {"nombre": "Carnes y Embutidos Andinos Ltda.", "nit": "900.455.123-8"},
        {"nombre": "Bebidas del Valle S.A.S.", "nit": "860.001.992-5"},
        {"nombre": "Empacadora Nacional S.A.", "nit": "800.771.883-4"},
        {"nombre": "Químicos y Limpieza Colombia", "nit": "901.332.110-9"}
    ]
    
    factura_rows = []
    n_facturas = 80
    
    for f_i in range(1, n_facturas + 1):
        prov = random.choice(proveedores)
        monto_clean = round(random.uniform(1500000, 45000000), 2)
        fecha_clean = (datetime.date(2024, 1, 1) + datetime.timedelta(days=random.randint(0, 180))).isoformat()
        fac_id = f"FAC-2024-{1000 + f_i}"
        
        factura_rows.append({
            "id_factura": fac_id,
            "fecha_factura": fecha_clean,
            "proveedor": prov["nombre"],
            "nit_proveedor": prov["nit"],
            "monto_total": str(monto_clean),
            "concepto": f"Suministro de mercancía Lote #{random.randint(500, 999)}",
            "estado": "Pendiente"
        })
        
    df_facturas = pd.DataFrame(factura_rows)
    
    # 8. Solicitudes de Crédito (para Ética y Sesgo en IA)
    # Atributos: id_solicitud, id_cliente, ingreso_mensual, antiguedad_meses, mora_historica, genero, edad, monto_solicitado, aprobado
    credito_rows = []
    n_solicitudes = 120
    
    for c_i in range(1, n_solicitudes + 1):
        genero = random.choice(["M", "F"])
        ingreso = round(random.uniform(4000000, 35000000), -4)
        antiguedad = random.randint(6, 120)
        mora = random.choices([0, 1, 2], weights=[0.7, 0.2, 0.1])[0]
        edad = random.randint(23, 62)
        monto_sol = round(ingreso * random.uniform(1.5, 4.0), -5)
        
        # Puntuación objetiva de solvencia
        score_objetivo = (ingreso / 1000000.0) * 0.3 + (antiguedad / 12.0) * 0.2 - (mora * 2.5) + random.gauss(0, 1.0)
        
        # Inyección deliberada de sesgo histórico de género:
        # Si es mujer (F), se le resta puntuación arbitrariamente para simular discriminación histórica en el dataset
        bias_penalty = 3.5 if genero == "F" else 0.0
        score_con_sesgo = score_objetivo - bias_penalty
        
        aprobado = 1 if score_con_sesgo > 2.5 else 0
        
        credito_rows.append({
            "id_solicitud": f"SOL-{3000 + c_i}",
            "id_cliente": f"CLI-{random.randint(1001, 1030)}",
            "ingreso_mensual": float(ingreso),
            "antiguedad_meses": int(antiguedad),
            "mora_historica": int(mora),
            "genero": genero,
            "edad": int(edad),
            "monto_solicitado": float(monto_sol),
            "aprobado": int(aprobado)
        })
        
    df_credito = pd.DataFrame(credito_rows)
    
    # -------------------------------------------------------------
    # SI MODO ES 'SUCIO', INYECTAR ERRORES DELIBERADOS EN TABLAS
    # -------------------------------------------------------------
    if modo == "sucio":
        # 1. Facturas sucias (para Laboratorio ETL)
        df_facturas = df_facturas.copy()
        
        # Inyectar valores nulos (15% en monto_total, nit)
        for idx in df_facturas.sample(frac=0.15, random_state=seed).index:
            df_facturas.loc[idx, "monto_total"] = None
        for idx in df_facturas.sample(frac=0.10, random_state=seed+1).index:
            df_facturas.loc[idx, "nit_proveedor"] = None
            
        # Inyectar formatos inconsistentes en monto ("12,500.50", "$ 15.000.000,00", "ERROR")
        for idx in df_facturas.sample(frac=0.20, random_state=seed+2).index:
            val = df_facturas.loc[idx, "monto_total"]
            if val is not None:
                df_facturas.loc[idx, "monto_total"] = f"$ {float(val):,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
                
        # Inyectar fechas no estándar ("2024/13/45", "15-05-2024", "INVALID_DATE")
        for idx in df_facturas.sample(frac=0.15, random_state=seed+3).index:
            df_facturas.loc[idx, "fecha_factura"] = "15/05/2024"
        for idx in df_facturas.sample(frac=0.05, random_state=seed+4).index:
            df_facturas.loc[idx, "fecha_factura"] = "2024-13-45"
            
        # Inyectar duplicados de facturas (5 filas)
        duplicados = df_facturas.head(5).copy()
        df_facturas = pd.concat([df_facturas, duplicados], ignore_index=True)
        
        # 2. Clientes sucios
        df_clientes = df_clientes.copy()
        # Inyectar nulos en ciudad y edad
        for idx in df_clientes.sample(frac=0.10, random_state=seed).index:
            df_clientes.loc[idx, "ciudad"] = None
        for idx in df_clientes.sample(frac=0.10, random_state=seed+1).index:
            df_clientes.loc[idx, "edad"] = np.nan
            
    return {
        "catalogo": df_catalogo,
        "tiendas": df_tiendas,
        "clientes": df_clientes,
        "ventas": df_ventas,
        "pedidos_eventlog": df_eventlog,
        "sensores_bodega": df_sensores,
        "facturas": df_facturas,
        "credito_solicitudes": df_credito
    }

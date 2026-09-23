"""
Lógica y preguntas para la jerarquía DIKW (Dato -> Información -> Conocimiento -> Acción) en M1.
"""

DIKW_EJERCICIOS = [
    {
        "id": "dikw-1",
        "titulo": "Ciclo de Inventario y Ventas",
        "descripcion": "Clasifica los elementos del caso DistriAndina en la jerarquía DIKW.",
        "pasos": [
            {
                "nivel": "Dato",
                "definición": "Hechos crudos, observaciones sin procesar o símbolos aislados sin contexto.",
                "ejemplo_caso": "El registro crudo: 'PROD-101, T001, 2024-05-10, 42 unidades'.",
                "opciones": [
                    "Registros crudos en ventas.csv con fecha, tienda y unidades",
                    "Gráfico de tendencia mensual mostrando caída del 15% en ventas",
                    "Comprender que la causa es un quiebre de stock por proveedor",
                    "Rediseñar la política de reabastecimiento con stock de seguridad"
                ],
                "respuesta_correcta": 0
            },
            {
                "nivel": "Información",
                "definición": "Datos procesados, estructurados, contextualizados y con significado.",
                "ejemplo_caso": "El informe de ventas acumuladas por tienda en mayo muestra $12.4M en Bogotá Norte.",
                "opciones": [
                    "Valores numéricos 101, 5, 42 aislados en una celda",
                    "El informe de ventas acumuladas por tienda en mayo mostrando $12.4M",
                    "Regla de reordenamiento automático cuando inventario < 20 unidades",
                    "Identificación del patrón de estacionalidad decembrina en la región Andina"
                ],
                "respuesta_correcta": 1
            },
            {
                "nivel": "Conocimiento",
                "definición": "Comprensión derivada de sintetizar información, identificar patrones y causas raíz.",
                "ejemplo_caso": "Descubrir que las ventas bajan en junio en Medellín debido al quiebre de stock del proveedor X.",
                "opciones": [
                    "Tabla CSV descargada del sistema ERP",
                    "Promedio mensual de temperatura de sensores",
                    "Descubrir la causa raíz: quiebres de stock en junio por demoras del proveedor X",
                    "Aprobar la factura #FAC-2024-102 en el sistema contable"
                ],
                "respuesta_correcta": 2
            },
            {
                "nivel": "Acción / Sabiduría",
                "definición": "Aplicación del conocimiento para tomar decisiones estratégicas y optimizar procesos.",
                "ejemplo_caso": "Modificar el acuerdo de nivel de servicio (SLA) con el proveedor y automatizar la orden de compra.",
                "opciones": [
                    "Modificar el acuerdo de nivel de servicio (SLA) con el proveedor y automatizar reabastecimiento",
                    "Almacenar el histórico de 2 años en la base de datos",
                    "Calcular el promedio ponderado del margen por categoría",
                    "Visualizar un boxplot con 5 outliers de temperatura"
                ],
                "respuesta_correcta": 0
            }
        ]
    }
]

def obtener_ejercicios_dikw():
    return DIKW_EJERCICIOS

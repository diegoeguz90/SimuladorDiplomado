"""
Modelo conceptual de Hiperautomatización y diagrama BPMN para M3.
"""

def obtener_modelo_hiperautomatizacion() -> dict:
    capas = [
        {
            "capa": "RPA (Robotic Process Automation)",
            "rol": "Ejecuta tareas estructuradas, repetitivas y basadas en reglas sin modificar sistemas heredados.",
            "ejemplos_caso": [
                "Extraer datos de facturas en PDF enviadas por proveedores al correo.",
                "Digitar la factura en el sistema ERP SAP/ERP local de DistriAndina.",
                "Enviar alertas de confirmación a los proveedores."
            ],
            "herramientas": "UiPath, Automation Anywhere, Power Automate"
        },
        {
            "capa": "BPM (Business Process Management)",
            "rol": "Orquesta y coordina el flujo de trabajo completo, gestionando excepciones y asignando tareas a humanos o bots.",
            "ejemplos_caso": [
                "Gestión del ciclo de vida del pedido desde la recepción hasta el cobro.",
                "Enrutamiento automático de aprobación a un Gerente si la factura supera los $20M.",
                "Monitoreo de SLAs y escalamiento de cuellos de botella."
            ],
            "herramientas": "Camunda, Bizagi, Bonita"
        },
        {
            "capa": "Agentes / IA (Inteligencia Artificial)",
            "rol": "Piensa, analiza datos no estructurados, toma decisiones predictivas y detecta anomalías.",
            "ejemplos_caso": [
                "Clasificación inteligente de solicitudes de crédito con modelos de Machine Learning.",
                "Lectura mediante OCR con IA / Document AI para facturas con formatos inconsistentes.",
                "Predecir probabilidad de mora de un cliente corporativo antes de aprobar el despacho."
            ],
            "herramientas": "Python (scikit-learn), Document AI, Gemini"
        }
    ]
    
    bpmn_flujo = {
        "titulo": "Flujo BPMN: Radicación y Pago de Facturas de Proveedores",
        "nodos": [
            {"id": "n1", "tipo": "inicio", "label": "Factura Recibida por Correo"},
            {"id": "n2", "tipo": "rpa", "label": "[RPA Bot] Extracción OCR de Factura"},
            {"id": "n3", "tipo": "ia", "label": "[IA Agent] Validación Inteligente y Detección de Errores"},
            {"id": "n4", "tipo": "gateway", "label": "¿Formato y Monto Correctos?"},
            {"id": "n5", "tipo": "bpm", "label": "[BPM Workflow] Aprobación por Gerencia (> $20M)"},
            {"id": "n6", "tipo": "rpa", "label": "[RPA Bot] Radicación Automática en ERP"},
            {"id": "n7", "tipo": "fin", "label": "Factura Programada para Pago"}
        ],
        "conexiones": [
            {"desde": "n1", "hacia": "n2"},
            {"desde": "n2", "hacia": "n3"},
            {"desde": "n3", "hacia": "n4"},
            {"desde": "n4", "hacia": "n5", "condicion": "Monto > $20M"},
            {"desde": "n4", "hacia": "n6", "condicion": "Monto <= $20M"},
            {"desde": "n5", "hacia": "n6", "condicion": "Aprobado"},
            {"desde": "n6", "hacia": "n7"}
        ]
    }
    
    return {
        "capas": capas,
        "bpmn_flujo": bpmn_flujo
    }

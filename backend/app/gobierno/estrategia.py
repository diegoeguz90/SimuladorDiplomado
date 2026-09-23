"""
Plantilla del Plan Estratégico de Datos de 1 Página para M4.
"""

PLAN_ESTRATEGICO_DEFAULT = {
    "empresa": "DistriAndina S.A.S.",
    "vision_datos": "Convertir a DistriAndina en una organización impulsada por datos (Data-Driven) para 2026, optimizando la cadena de suministro y garantizando la equidad y gobierno responsable en cada decisión.",
    "pilares_estrategicos": [
        {
            "pilar": "1. Fundamentos & Analítica Avanzada",
            "objetivo": "Establecer visibilidad 360° de la cadena de valor mediante tableros descriptivos y modelos diagnósticos.",
            "iniciativas": ["Implementación del almacén centralizado de datos", "Capacitación en alfabetización de datos (Data Literacy)"],
            "kpi_meta": "100% de reportes críticos migrados al nuevo BI"
        },
        {
            "pilar": "2. Excelencia Operacional & RPA",
            "objetivo": "Reducir el Lead Time de pedidos corporativos y eliminar cuellos de botella en la validación de crédito y radicación de facturas.",
            "iniciativas": ["Automatización RPA de radicación de facturas", "Optimización de capacidad en analistas de riesgo"],
            "kpi_meta": "Lead Time promedio < 48 horas"
        },
        {
            "pilar": "3. Gobierno, Calidad & Ética en IA",
            "objetivo": "Asegurar datos limpios y modelos de Machine Learning transparentes, auditables y libres de sesgo discriminatorio.",
            "iniciativas": ["Implementación de reglas de calidad ejecutables en ETL", "Auditoría semestral de Disparate Impact en algoritmos de crédito"],
            "kpi_meta": "Score global de calidad de datos > 95% y Disparate Impact >= 0.80"
        },
        {
            "pilar": "4. Arquitectura Moderna (Lakehouse)",
            "objetivo": "Desplegar el patrón Medallion (Bronce/Silver/Gold) y habilitar capacidades de búsqueda de conocimiento (RAG).",
            "iniciativas": ["Migración de datasets a capas Medallion", "Despliegue de asistente virtual de políticas internas"],
            "kpi_meta": "Disponibilidad del Lakehouse 99.9%"
        }
    ]
}

def obtener_plan_estrategico() -> dict:
    return PLAN_ESTRATEGICO_DEFAULT

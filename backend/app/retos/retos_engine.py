"""
Motor de 8 Retos Interáctivos con autoevaluación para el diplomado.
"""
from app.datos.data_store import store
from app.procesos.process_mining import analizar_log_eventos
from app.gobierno.calidad import ejecutar_reglas_calidad
from app.gobierno.etica_sesgo import evaluar_sesgo_credito

RETOS_DEFINICION = [
    {
        "id": "reto-1",
        "modulo": "M1 — Fundamentos",
        "titulo": "Reto 1: Clasificación de Tipos de Analítica",
        "enunciado": "DistriAndina detectó que las ventas cayeron en junio en la tienda de Medellín. Un modelo matemático sugiere aumentar la frecuencia de despacho a 3 veces por semana para solucionar el problema. ¿A qué tipo de analítica corresponde esta recomendación?",
        "opciones": [
            "Analítica Descriptiva",
            "Analítica Diagnóstica",
            "Analítica Predictiva",
            "Analítica Prescriptiva"
        ],
        "respuesta_correcta": 3,
        "explicacion": "Es Analítica Prescriptiva porque no solo predice lo que sucederá, sino que sugiere una ACCIÓN ESPECÍFICA (aumentar la frecuencia de despacho) para optimizar el resultado."
    },
    {
        "id": "reto-2",
        "modulo": "M1 — Fundamentos",
        "titulo": "Reto 2: Detección de Anomalías e IQR",
        "enunciado": "En las series temporales de sensores_bodega.csv, la temperatura ambiente normal oscila entre 18°C y 22°C. Si se detectan lecturas superiores a 34°C, ¿cómo se clasifica estadísticamente este valor según el análisis IQR?",
        "opciones": [
            "Mediana ponderada",
            "Atípico superior (Outlier severo)",
            "Sesgo negativo",
            "Valor nulo imputado"
        ],
        "respuesta_correcta": 1,
        "explicacion": "Una temperatura > 34°C supera por mucho el límite superior Q3 + 1.5*IQR, clasificándose como un outlier o dato atípico severo."
    },
    {
        "id": "reto-3",
        "modulo": "M2 — BI y Decisiones",
        "titulo": "Reto 3: Estandarización en Pipeline ETL",
        "enunciado": "En el dataset de facturas.csv en modo sucio, una factura registra el monto '$ 15.000.000,00'. ¿Qué transformación del pipeline ETL debe aplicarse para convertirlo a tipo float en Python?",
        "opciones": [
            "Deduplicar por id_factura",
            "Remover '$', reemplazar '.' por nada y ',' por '.'",
            "Imputación de media móvil",
            "Convertir a texto mayúsculas"
        ],
        "respuesta_correcta": 1,
        "explicacion": "Para estandarizar el formato monetario latino a float en Python, se elimina el símbolo '$', se remueven los puntos de miles y se reemplaza la coma decimal por punto."
    },
    {
        "id": "reto-4",
        "modulo": "M2 — BI y Decisiones",
        "titulo": "Reto 4: Análisis de Desviación en CMI",
        "enunciado": "En el Cuadro de Mando Integral, la meta de ventas es $850M COP. Si el valor alcanzado es $680M COP, ¿cuál es la desviación porcentual y el color del semáforo asignado?",
        "opciones": [
            "Cumplimiento 80.0% — Semáforo Amarillo",
            "Cumplimiento 100% — Semáforo Verde",
            "Cumplimiento 50.0% — Semáforo Rojo",
            "Cumplimiento 120% — Semáforo Verde"
        ],
        "respuesta_correcta": 0,
        "explicacion": "680M / 850M = 80.0% de cumplimiento. Al estar entre 80% y 95% de la meta, corresponde al semáforo Amarillo de precaución."
    },
    {
        "id": "reto-5",
        "modulo": "M3 — Automatización y RPA",
        "titulo": "Reto 5: Identificación del Cuello de Botella",
        "enunciado": "Al analizar el log de eventos de pedidos corporativos en Process Mining, se observa que la actividad 'validar_credito' tiene un tiempo de espera medio de 38.5 horas, mientras las demás actividades tardan menos de 4 horas. ¿Qué diagnóstico representa?",
        "opciones": [
            "Tasa de reproceso eficiente",
            "Cuello de botella principal del proceso",
            "Variante estándar optimizada",
            "Flujo libre de colas"
        ],
        "respuesta_correcta": 1,
        "explicacion": "La actividad con el mayor tiempo acumulado de espera (38.5h) constituye el cuello de botella (bottleneck) que restringe la capacidad de todo el proceso."
    },
    {
        "id": "reto-6",
        "modulo": "M3 — Automatización y RPA",
        "titulo": "Reto 6: Aplicación de la Ley de Little",
        "enunciado": "Si llegan λ = 0.5 pedidos/hora y el Lead Time promedio del sistema es W = 40 horas, ¿cuántos pedidos L (trabajo en progreso WIP) se encuentran simultáneamente en el sistema según la Ley de Little (L = λ * W)?",
        "opciones": [
            "80 pedidos en proceso",
            "20 pedidos en proceso",
            "10 pedidos en proceso",
            "200 pedidos en proceso"
        ],
        "respuesta_correcta": 1,
        "explicacion": "Según la Ley de Little: L = λ * W = 0.5 ped/h * 40 h = 20 pedidos en sistema."
    },
    {
        "id": "reto-7",
        "modulo": "M4 — Gobierno y Arquitectura",
        "titulo": "Reto 7: Reglas de Calidad Executables",
        "enunciado": "Al cambiar el generador al modo 'sucio', la regla 'REG-FAC-01: Completitud de Montos' baja su cumplimiento al 85.0%. ¿Qué acción de gobierno de datos debe activarse?",
        "opciones": [
            "Eliminar la tabla de la base de datos",
            "Notificar al Data Owner de la Gerencia Contable y ejecutar la etapa de limpieza de nulos en el pipeline ETL",
            "Ignorar el error y publicar en la capa Gold",
            "Desactivar las alertas de calidad"
        ],
        "respuesta_correcta": 1,
        "explicacion": "El gobierno de datos exige notificar al Data Owner responsable e iniciar la remediación en la etapa de limpieza del pipeline ETL."
    },
    {
        "id": "reto-8",
        "modulo": "M4 — Gobierno y Arquitectura",
        "titulo": "Reto 8 (Integrador): Evaluación de Sesgo y Regla del 4/5",
        "enunciado": "Un modelo de scoring aprueba al 75% de los solicitantes hombres pero solo al 45% de las mujeres. El ratio de Disparate Impact es DI = 0.45 / 0.75 = 0.60. ¿Cumple con la regla de equidad del 4/5?",
        "opciones": [
            "Sí cumple, porque DI > 0.50",
            "No cumple (DI = 0.60 < 0.80), indicando impacto adverso y sesgo discriminatorio que requiere mitigación",
            "No aplica para modelos de crédito",
            "Sí cumple, porque la exactitud global es alta"
        ],
        "respuesta_correcta": 1,
        "explicacion": "La regla del 4/5 exige que la tasa del grupo protegido sea al menos el 80% (DI >= 0.80) de la tasa del grupo mayoritario. Al ser 0.60, demuestra impacto adverso y sesgo."
    }
]

def obtener_retos():
    return RETOS_DEFINICION

def evaluar_reto(reto_id: str, opcion_seleccionada: int) -> dict:
    reto = next((r for r in RETOS_DEFINICION if r["id"] == reto_id), None)
    if not reto:
        return {"error": f"Reto '{reto_id}' no encontrado"}
        
    es_correcta = (opcion_seleccionada == reto["respuesta_correcta"])
    return {
        "reto_id": reto_id,
        "es_correcta": es_correcta,
        "opcion_seleccionada": opcion_seleccionada,
        "respuesta_correcta": reto["respuesta_correcta"],
        "explicacion": reto["explicacion"]
    }

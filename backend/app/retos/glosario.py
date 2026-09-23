"""
Glosario de términos del diplomado con ejemplos del caso DistriAndina.
"""

GLOSARIO_TERMINOS = [
    {
        "termino": "DIKW (Data, Information, Knowledge, Wisdom)",
        "categoria": "Fundamentos",
        "definicion": "Jerarquía del conocimiento que representa la transformación de datos crudos aislados a información contextualizada, conocimiento de patrones y sabiduría/acción estratégica.",
        "ejemplo_caso": "Dato: 'PROD-101 42u'; Información: 'Ventas cayeron 15% en Medellín'; Conocimiento: 'La causa es quiebre de stock por proveedor'; Acción: 'Aumentar nivel de reorden automático'."
    },
    {
        "termino": "Analítica Prescriptiva",
        "categoria": "Fundamentos",
        "definicion": "Tipo de analítica avanzada que evalúa múltiples alternativas para recomendar la mejor línea de acción orientada a un objetivo.",
        "ejemplo_caso": "Recomendar la reasignación de 2 validadores de crédito adicionales para reducir el Lead Time de 48h a 12h."
    },
    {
        "termino": "ETL (Extract, Transform, Load)",
        "categoria": "BI y Decisiones",
        "definicion": "Proceso de integración de datos en tres fases: Extracción desde sistemas origen, Transformación (limpieza, deduplicación, tipado) y Carga en el almacén de datos.",
        "ejemplo_caso": "Pipeline interactivo que toma facturas_sucias.csv, elimina nulos, convierte '$15.000,00' a float y carga facturas_limpias."
    },
    {
        "termino": "Cuadro de Mando Integral (CMI / Balanced Scorecard)",
        "categoria": "BI y Decisiones",
        "definicion": "Herramienta de gestión estratégica que evalúa el desempeño organizacional a través de 4 perspectivas: Financiera, Cliente, Procesos Internos y Aprendizaje/Crecimiento.",
        "ejemplo_caso": "Tablero de DistriAndina que combina ventas totales ($), satisfacción de clientes, Lead Time de pedidos y adopción del canal Online."
    },
    {
        "termino": "Process Mining (Minería de Procesos)",
        "categoria": "Automatización y RPA",
        "definicion": "Técnica analítica que extrae conocimiento de los registros de eventos (event logs) de los sistemas ERP para descubrir, monitorear y mejorar procesos reales.",
        "ejemplo_caso": "Análisis de pedidos_eventlog.csv para reconstruir el grafo del flujo de pedidos y detectar el cuello de botella en 'validar_credito'."
    },
    {
        "termino": "Ley de Little (Little's Law)",
        "categoria": "Automatización y RPA",
        "definicion": "Teoría fundamental de colas que establece que el número promedio de elementos en un sistema (L) es igual a la tasa de llegada (λ) multiplicada por el tiempo de permanencia promedio (W): L = λ * W.",
        "ejemplo_caso": "Con λ = 0.5 pedidos/h y W = 40h de Lead Time, se calcula un trabajo en proceso de L = 20 pedidos en bodega."
    },
    {
        "termino": "Hiperautomatización",
        "categoria": "Automatización y RPA",
        "definicion": "Enfoque disciplinado que combina RPA (Robotic Process Automation), BPM (Business Process Management) e Inteligencia Artificial para automatizar de extremo a extremo procesos complejos.",
        "ejemplo_caso": "RPA extrae facturas PDF -> BPM orquesta la aprobación gerencial -> IA detecta anomalías de precio."
    },
    {
        "termino": "Disparate Impact (Impacto Dispar)",
        "categoria": "Gobierno y Ética",
        "definicion": "Métrica de equidad en IA que compara la tasa de selección positiva del grupo protegido frente al grupo no protegido. Si es menor a 0.80 (80%), se presume sesgo o discriminación indirecta.",
        "ejemplo_caso": "Evaluar si la tasa de aprobación de crédito para mujeres es al menos el 80% de la tasa de hombres a igual nivel de ingresos."
    },
    {
        "termino": "Patrón Medallion (Medallion Architecture)",
        "categoria": "Arquitectura de Datos",
        "definicion": "Patrón de diseño de arquitectura Lakehouse que organiza los datos en tres capas lógicas de calidad creciente: Bronce (Raw), Silver (Limpio) y Gold (Agregados de Negocio).",
        "ejemplo_caso": "Bronce: facturas.csv crudo; Silver: facturas_limpias.csv; Gold: kpis_ventas_mensuales."
    },
    {
        "termino": "RAG (Retrieval-Augmented Generation / Búsqueda Aumentada)",
        "categoria": "Arquitectura de Datos",
        "definicion": "Técnica que combina recuperación semántica de documentos reales con modelos de lenguaje para responder preguntas con fuentes verificables.",
        "ejemplo_caso": "Buscador semántico local con TF-IDF que extrae la cláusula exacta del Manual de Calidad de DistriAndina al preguntar por reglas de facturación."
    }
]

def obtener_glosario(q=None):
    if not q or not q.strip():
        return GLOSARIO_TERMINOS
    q_lower = q.lower().strip()
    return [t for t in GLOSARIO_TERMINOS if q_lower in t["termino"].lower() or q_lower in t["definicion"].lower() or q_lower in t["categoria"].lower()]

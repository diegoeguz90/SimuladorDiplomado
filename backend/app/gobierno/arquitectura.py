"""
Patrón Medallion y Mini-RAG local (TF-IDF + Cosine Similarity) para M4.
"""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

DOCS_DISTRIANDINA = [
    {
        "id": "DOC-POL-01",
        "titulo": "Política de Evaluación y Otorgamiento de Crédito Comercial",
        "categoria": "Riesgo y Crédito",
        "contenido": """
        DistriAndina S.A.S. establece que toda solicitud de crédito comercial para clientes corporativos debe evaluar: 
        1. Ingreso mensual comprobado superior a 5 SMMLV.
        2. Antigüedad comercial mínima de 12 meses.
        3. Historial de mora menor a 2 eventos en el último año.
        Queda estrictamente prohibido utilizar atributos sensibles como género, edad, raza u origen étnico como criterios de scoring o aprobación para prevenir la discriminación directa o sesgo algorítmico (cumpliendo con la regla del 4/5 de equidad).
        """
    },
    {
        "id": "DOC-MAN-02",
        "titulo": "Manual de Calidad de Datos y Gobierno del Dato",
        "categoria": "Gobierno de Datos",
        "contenido": """
        El gobierno del dato en DistriAndina define que cada entidad maestra debe contar con un Propietario (Data Owner) asignado.
        Las 6 dimensiones obligatorias de calidad de datos a monitorear en pipelines ETL son:
        Exactitud, Completitud, Consistencia, Oportunidad, Unicidad y Validez.
        Toda factura de proveedor debe contener un NIT válido en formato 800.xxx.xxx-x, monto no nulo y fecha estandarizada YYYY-MM-DD.
        """
    },
    {
        "id": "DOC-PROC-03",
        "titulo": "Procedimiento Operativo de Gestión de Pedidos y Logística",
        "categoria": "Operaciones",
        "contenido": """
        El proceso estándar de pedidos corporativos consta de 6 actividades secuenciales:
        1. Recibir Pedido -> 2. Validar Crédito -> 3. Preparar Mercancía -> 4. Despachar -> 5. Facturar -> 6. Cobrar.
        El SLA objetivo para la actividad de Validación de Crédito es de máximo 4 horas.
        Se identificó que esperas superiores a 24 horas constituyen el cuello de botella principal de la cadena de valor.
        """
    },
    {
        "id": "DOC-ARQ-04",
        "titulo": "Arquitectura de Datos y Patrón Medallion (Bronce, Silver, Gold)",
        "categoria": "Arquitectura de Datos",
        "contenido": """
        La arquitectura del Lakehouse de DistriAndina adopta el patrón Medallion en tres capas:
        - Capa Bronce (Raw): Ingesta directa de datos crudos sin modificar desde ERP, facturas e IoT (facturas sucias, sensores crudos).
        - Capa Silver (Cleaned & Standardized): Datos limpios, deduplicados, tipados y consolidados (facturas_limpias, clientes_validados).
        - Capa Gold (Business Aggregates): Tablas optimizadas para analítica de negocio, CMI, modelos de Machine Learning y tableros BI (kpis_ventas_diarias, scorecard_ejecutivo).
        """
    },
    {
        "id": "DOC-IOT-05",
        "titulo": "Guía de Monitoreo de Sensores IoT e Infraestructura en Bodega",
        "categoria": "Tecnología e IoT",
        "contenido": """
        Los sensores IoT de bodega (temperatura, humedad y flujo de cajas) transmiten lecturas horarias.
        La temperatura óptima para la conservación de productos perecederos (Lácteos y Embutidos) es entre 16°C y 22°C.
        Temperaturas superiores a 30°C activan la alerta roja por falla en el sistema de aire acondicionado y riesgo de pérdida de mercancía.
        """
    }
]

def obtener_capas_medallion() -> dict:
    medallion = {
        "bronce": {
            "nombre": "Capa Bronce (Raw / Ingesta Cruda)",
            "descripcion": "Datos tal como llegan de las fuentes de origen (ERP, archivos planos, facturas PDF, sensores IoT) con nulos, duplicados y formatos mixtos.",
            "datasets": ["facturas (sucio)", "sensores_bodega (raw)", "pedidos_eventlog (raw)"]
        },
        "silver": {
            "nombre": "Capa Silver (Cleansed / Limpia y Estandarizada)",
            "descripcion": "Datos transformados mediante pipelines ETL: deduplicados, con nulos imputados/limpios, tipos estandarizados e integridad referencial.",
            "datasets": ["facturas_limpias", "catalogo_productos", "tiendas_maestro", "clientes_validados"]
        },
        "gold": {
            "nombre": "Capa Gold (Business / Agregados de Negocio)",
            "descripcion": "Modelos dimensionales (Estrella/Copo de Nieve) y agregados optimizados para consultas de BI, Cuadro de Mando Integral y modelos predictivos ML.",
            "datasets": ["ventas_agregadas_diarias", "kpis_cuadro_mando_integral", "credito_dataset_scoring"]
        }
    }
    return medallion

def buscar_mini_rag(query: str, top_k=2) -> dict:
    if not query or not query.strip():
        query = "crédito equidad sesgo"
        
    textos = [doc["contenido"] for doc in DOCS_DISTRIANDINA]
    
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(textos)
    
    query_vec = vectorizer.transform([query])
    similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
    
    top_indices = similarities.argsort()[::-1][:top_k]
    
    resultados = []
    for idx in top_indices:
        score = float(similarities[idx])
        doc = DOCS_DISTRIANDINA[idx]
        resultados.append({
            "id": doc["id"],
            "titulo": doc["titulo"],
            "categoria": doc["categoria"],
            "similitud": round(score, 3),
            "fragmento_relevante": doc["contenido"].strip()
        })
        
    return {
        "consulta": query,
        "total_encontrados": len(resultados),
        "resultados": resultados
    }

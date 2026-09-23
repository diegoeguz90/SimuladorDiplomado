# DistriAndina Analytics Lab 🚀

**DistriAndina Analytics Lab** es un simulador web educativo interactivo y completo diseñado para apoyar la enseñanza presencial y práctica de un diplomado en **"Analítica Estratégica y Gobierno de Datos para las Organizaciones"**. 

Genera el universo de datos 100% sintético y reproducible de una distribuidora mayorista ficticia colombiana (**DistriAndina S.A.S.**) y permite ejercitar todos los conceptos del programa divididos en 4 módulos temáticos.

Está pensado para ser usado por el **docente en clase (proyector)** y por los **estudiantes en sus propios computadores**. Funciona **100% local, en español**, sin requerir credenciales ni APIs de pago externas.

---

## 🏛️ Arquitectura del Monorepo

```
SimuladorDiplomado/
├── backend/                  # API REST en Python (FastAPI)
│   ├── app/
│   │   ├── datos/            # Generador sintético reproducible (8 datasets)
│   │   ├── analitica/        # M1: Estadísticas EDA, correlaciones, IQR, Quiz DIKW
│   │   ├── bi/               # M2: Pipeline ETL interactivo 6D y Cuadro de Mando Integral (CMI)
│   │   ├── procesos/         # M3: Process Mining (Process Map), Simulación SimPy & Ley de Little
│   │   ├── gobierno/         # M4: Catálogo de datos, Reglas ejecutables, Ética ML (Fairness) & Mini-RAG
│   │   ├── retos/            # Motor de 8 retos interactivos y Glosario
│   │   ├── api/              # Endpoints FastAPI por módulo
│   │   └── main.py           # Entrypoint FastAPI con CORS
│   ├── tests/                # Suite de 22 pruebas unitarias con Pytest
│   └── requirements.txt
├── frontend/                 # SPA en React 18 + Vite + Tailwind CSS + Recharts
│   ├── src/
│   │   ├── components/       # TopBar (Semilla/Modo), Navbar, Card, MetricBadge, GraphView
│   │   ├── pages/            # 14 Vistas interactivas organizadas por módulo
│   │   ├── context/          # State Manager global DataContext
│   │   └── services/         # Cliente REST Axios
│   └── package.json
└── README.md
```

---

## 📋 Requisitos Previos

- **Python:** Version 3.11, 3.12 o 3.13.
- **Node.js:** Version 18, 20 o 22 (con `npm`).

---

## ⚡ Pasos de Arranque (2 Comandos)

### 1. Iniciar el Backend (Python / FastAPI)
Abre una terminal en la carpeta raíz del proyecto:
```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --reload
```
La API REST estará disponible en `http://127.0.0.1:8000`. Puedes explorar la documentación interactiva en `http://127.0.0.1:8000/docs`.

### 2. Iniciar el Frontend (React / Vite)
Abre una segunda terminal en la carpeta raíz del proyecto:
```powershell
cd frontend
npm run dev
```
Abre tu navegador en `http://localhost:5173`.

---

## 🧪 Ejecución de Pruebas Unitarias (Pytest)

El backend cuenta con una suite completa de **22 pruebas unitarias** que verifican la reproducibilidad, la integridad referencial, el pipeline ETL, las reglas de calidad, la detección de sesgo algorítmico y la simulación de procesos.

Para ejecutar las pruebas:
```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest tests
```

---

## 📊 El Universo de Datos Sintéticos (`seed=42`)

El simulador genera 8 datasets interrelacionados con semilla fija por defecto (`seed=42`), garantizando reproducibilidad exacta:

1. `catalogo.csv`: ~50 productos en 6 categorías (Lácteos, Embutidos, Bebidas, Abarrotes, Enlatados, Limpieza) con precios de compra, venta y margen.
2. `tiendas.csv`: 4 puntos de venta físicos (Bogotá, Medellín, Cali, Barranquilla) + 1 canal Online.
3. `clientes.csv`: ~30 clientes corporativos y minoristas con atributos sensibles (género, edad, segmento).
4. `ventas.csv`: Registro diario con estacionalidad semanal/anual, tendencia lineal, ruido y **2 anomalías sembradas** (pico de demanda en diciembre y quiebre de stock en junio en Medellín).
5. `pedidos_eventlog.csv`: Event log de minería de procesos con 6 actividades, 5 variantes de proceso, bucles de reproceso y un **cuello de botella en la aprobación de crédito**.
6. `sensores_bodega.csv`: Series temporales IoT de temperatura, humedad y flujo de cajas con picos atípicos y fallas de transmisión.
7. `facturas.csv`: Facturas de proveedores con **errores simulados** (nulos, duplicados, formatos monetarios `$ 15.000.000,00` y fechas no estándar).
8. `credito_solicitudes.csv`: Solicitudes de crédito corporativo con **sesgo histórico de género sembrado** para ejercicios de equidad y Disparate Impact.

**Modos de Operación:**
- **Modo Limpio:** Datos perfeccionados para análisis descriptivo y prescriptivo.
- **Modo Sucio:** Inyecta nulos, duplicados, atípicos y formatos inconsistentes para laboratorios ETL y gobierno de datos.

---

## 🎓 Módulos Temáticos de la Aplicación

### M1 — Fundamentos y Analítica
- **Caso de Estudio:** Cadena de valor de Porter y tabla comparativa de los 4 tipos de analítica (Descriptiva, Diagnóstica, Predictiva, Prescriptiva).
- **Generador de Datos:** Controles para semilla, años, tiendas y selector limpio/sucio con descarga de CSVs.
- **Explorador EDA:** Gráficos de frecuencias (histogramas), boxplots IQR de atípicos, detector de nulos, correlaciones y drill-down diagnóstico de ventas por ciudad/tienda/categoría.
- **Quiz DIKW:** Mini-evaluación interactiva de la jerarquía Dato → Información → Conocimiento → Acción.

### M2 — BI y Decisiones
- **Laboratorio ETL:** Pipeline visual de 5 etapas (Extraer → Limpiar → Deduplicar → Estandarizar → Tipar → Cargar) y reporte de calidad en 6 dimensiones (Exactitud, Completitud, Consistencia, Oportunidad, Unicidad, Validez).
- **KPIs y CMI:** Tablero de Cuadro de Mando Integral (Balanced Scorecard) organizado en las 4 perspectivas (Financiera, Cliente, Procesos Internos, Aprendizaje/Crecimiento) con metas y semáforos.

### M3 — Automatización y RPA
- **Process Mining Lab:** Métricas por actividad, **Grafo Descubierto del Proceso**, detección automática del cuello de botella principal, desglose de variantes y tasa de reprocesos.
- **Simulación SimPy:** Modelo de simulación de eventos discretos con ajuste de capacidad (validadores) y automatización (RPA). Comparativa de Lead Time y tarjetas explicativas de la **Ley de Little ($L = \lambda W$)**.
- **Hiperautomatización:** Diagrama de capas "RPA hace / BPM coordina / IA piensa" y flujo BPMN interactivo.

### M4 — Gobierno y Arquitectura
- **Gobierno y Calidad:** Catálogo de datos con Data Owners asignados y **reglas de calidad ejecutables** (pandas/GE style) que responden dinámicamente al modo sucio/limpio.
- **Ética y Sesgo en IA:** Modelo de clasificación de créditos (`LogisticRegression`), cálculo de **Disparate Impact** y verificación de la regla del 4/5, con botón de **mitigación interactiva** (Trade-off Exactitud vs. Equidad).
- **Arquitectura Medallion & Mini-RAG:** Diagrama de 3 capas (Bronce, Silver, Gold) y **motor Mini-RAG local** (TF-IDF + Cosine Similarity) que consulta políticas internas de DistriAndina.
- **Plan Estratégico:** Plantilla editable y exportable en JSON del Plan Estratégico de Datos de 1 página.

### Transversal
- **Retos Interactivos:** 8 ejercicios de autoevaluación con verificación instantánea y explicaciones.
- **Glosario:** Buscador de términos técnicos del diplomado con ejemplos prácticos de DistriAndina.

---

## 🛠️ Cómo Agregar Más Retos o Datasets en el Futuro

### Para Agregar un Nuevo Dataset:
1. En `backend/app/datos/generador.py`, añade la función generadora correspondiente y regístrala en la tupla retornada por `generar_universo()`.
2. En `backend/app/datos/data_store.py`, no se requieren cambios adicionales; la nueva tabla estará automáticamente disponible en `store.get_dataset("nueva_tabla")` y en el endpoint de descarga CSV.

### Para Agregar un Nuevo Reto Interactivo:
1. Abre `backend/app/retos/retos_engine.py`.
2. Añade un objeto al arreglo `RETOS_DEFINICION` con la siguiente estructura:
```python
{
    "id": "reto-9",
    "modulo": "M3 — Automatización",
    "titulo": "Reto 9: Título del Reto",
    "enunciado": "Descripción del escenario...",
    "opciones": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "respuesta_correcta": 1,  # Índice de 0 a 3
    "explicacion": "Explicación detallada de por qué esta es la respuesta correcta."
}
```
3. La interfaz web del frontend consumirá automáticamente la nueva pregunta en la pestaña **Retos**.

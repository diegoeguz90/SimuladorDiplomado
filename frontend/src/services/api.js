import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Datos
  getResumenDatos: () => client.get('/datos/resumen'),
  actualizarConfigDatos: (config) => client.post('/datos/config', config),
  getPreviewDataset: (nombre, n = 15) => client.get(`/datos/preview/${nombre}?n=${n}`),
  getExportarCsvUrl: (nombre) => `${API_BASE_URL}/datos/exportar/${nombre}`,

  // Módulo 1
  getEdaEstadisticas: (nombre) => client.get(`/m1/eda/estadisticas/${nombre}`),
  getEdaDistribucion: (nombre, columna, bins = 10) => client.get(`/m1/eda/distribucion/${nombre}/${columna}?bins=${bins}`),
  getEdaCorrelacion: (nombre) => client.get(`/m1/eda/correlacion/${nombre}`),
  getEdaDrilldown: () => client.get('/m1/eda/drilldown'),
  getDikwPreguntas: () => client.get('/m1/dikw/preguntas'),

  // Módulo 2
  ejecutarEtl: () => client.get('/m2/etl/ejecutar'),
  getKpisCmi: () => client.get('/m2/kpis-cmi'),

  // Módulo 3
  getProcessMiningResumen: () => client.get('/m3/process-mining/resumen'),
  ejecutarSimulacion: (params) => client.post('/m3/simulacion/ejecutar', params),
  getComparativaSimulacion: () => client.get('/m3/simulacion/comparativa'),
  getHiperautomatizacion: () => client.get('/m3/hiperautomatizacion'),

  // Módulo 4
  getCatalogoGobierno: () => client.get('/m4/gobierno/catalogo'),
  getCalidadReglas: () => client.get('/m4/gobierno/calidad'),
  getEticaCreditoModelo: () => client.get('/m4/etica/credito-modelo'),
  ejecutarMitigacionSesgo: () => client.post('/m4/etica/credito-mitigar'),
  getMedallion: () => client.get('/m4/arquitectura/medallion'),
  buscarRag: (params) => client.post('/m4/arquitectura/rag/buscar', params),
  getPlanEstrategico: () => client.get('/m4/estrategia/plan'),

  // Retos & Glosario
  getRetos: () => client.get('/retos'),
  evaluarReto: (retoId, opcionSeleccionada) => client.post('/retos/evaluar', { reto_id: retoId, opcion_seleccionada: opcionSeleccionada }),
  getGlosario: (q = '') => client.get(`/glosario${q ? `?q=${encodeURIComponent(q)}` : ''}`),
};

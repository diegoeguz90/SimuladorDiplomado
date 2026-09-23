import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';
import { useData } from '../../context/DataContext';
import { Workflow, Play, CheckCircle2, AlertTriangle, Download, Sparkles, Database } from 'lucide-react';

export const LaboratorioETL = () => {
  const { modo, regenerarDatos } = useData();
  const [etlResult, setEtlResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEjecutarETL = async () => {
    setLoading(true);
    try {
      const res = await apiService.ejecutarEtl();
      setEtlResult(res.data);
    } catch (err) {
      console.error('Error ejecutando ETL:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivarModoSucio = () => {
    regenerarDatos({ modo: 'sucio' });
    setEtlResult(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Concept Header & Mode Warning */}
      <Card title="Laboratorio ETL (Extract, Transform, Load)" subtitle="Pipeline visual de limpieza de facturas de proveedores y reporte de calidad en 6 dimensiones">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            <strong>Concepto:</strong> Las facturas enviadas por los proveedores de DistriAndina llegan en formatos heterogéneos, con valores nulos, duplicados y errores tipográficos. Este laboratorio ejecuta el pipeline de transformación paso a paso y calcula el reporte de calidad de datos de 6 dimensiones.
          </p>

          <div className="flex items-center gap-2">
            {modo !== 'sucio' && (
              <button
                onClick={handleActivarModoSucio}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" /> Activar Modo Sucio
              </button>
            )}

            <button
              onClick={handleEjecutarETL}
              disabled={loading}
              className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white font-extrabold text-xs px-5 py-2 rounded-lg shadow flex items-center gap-2 transition-all active:scale-95"
            >
              <Play className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Procesando ETL...' : 'Ejecutar Pipeline ETL'}
            </button>
          </div>
        </div>
      </Card>

      {/* Visual Pipeline Steps */}
      {etlResult && (
        <Card title="Flujo del Pipeline ETL por Etapas" subtitle="Impacto de cada transformación en el volumen de registros">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-2">
            {etlResult.pasos.map((paso, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded uppercase">
                    Etapa {idx + 1}
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs mt-2 mb-1">{paso.paso}</h4>
                  <p className="text-[11px] text-slate-600 mb-3">{paso.descripcion}</p>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200 text-[10px] font-mono text-slate-700 flex justify-between">
                  <span>Registros:</span>
                  <strong className="text-sky-800">{paso.registros_restantes}</strong>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quality Report Cards (6 Dimensions) */}
      {etlResult && (
        <Card title="Reporte de Calidad de Datos (6 Dimensiones)" subtitle={`Promedio Global de Calidad: ${etlResult.reporte_calidad.promedio_global}%`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-2">
            {Object.entries(etlResult.reporte_calidad).filter(([k]) => k !== 'promedio_global').map(([dimension, val]) => (
              <div key={dimension} className="bg-white border border-slate-200 rounded-xl p-3.5 text-center shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {dimension}
                </span>
                <div className={`text-xl font-black ${val >= 90 ? 'text-emerald-600' : val >= 75 ? 'text-amber-600' : 'text-rose-600'}`}>
                  {val}%
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${val >= 90 ? 'bg-emerald-500' : val >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preview Clean Data Table */}
      {etlResult && (
        <Card
          title="Facturas Limpias Resultantes (Capa Silver)" subtitle={`Total facturas procesadas y listas para finanzas: ${etlResult.total_procesadas}`}
          headerAction={
            <a
              href={apiService.getExportarCsvUrl('facturas')}
              download
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Descargar Facturas Limpias CSV
            </a>
          }
        >
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">ID Factura</th>
                  <th className="p-2.5">Fecha ISO</th>
                  <th className="p-2.5">Proveedor</th>
                  <th className="p-2.5">NIT Válido</th>
                  <th className="p-2.5 text-right">Monto Total ($ COP)</th>
                  <th className="p-2.5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {etlResult.preview_limpia.map((row) => (
                  <tr key={row.id_factura} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-sky-700">{row.id_factura}</td>
                    <td className="p-2.5">{row.fecha_factura}</td>
                    <td className="p-2.5">{row.proveedor}</td>
                    <td className="p-2.5">{row.nit_proveedor}</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">${row.monto_total.toLocaleString('es-CO')}</td>
                    <td className="p-2.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">{row.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

    </div>
  );
};

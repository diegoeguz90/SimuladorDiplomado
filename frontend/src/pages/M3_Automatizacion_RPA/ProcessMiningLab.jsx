import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { GraphView } from '../../components/GraphView';
import { apiService } from '../../services/api';
import { useData } from '../../context/DataContext';
import { Workflow, AlertCircle, Clock, GitBranch, RefreshCw } from 'lucide-react';

export const ProcessMiningLab = () => {
  const { seed } = useData();
  const [pmData, setPmData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarProcessMining = async () => {
    setLoading(true);
    try {
      const res = await apiService.getProcessMiningResumen();
      setPmData(res.data);
    } catch (err) {
      console.error('Error en Process Mining:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProcessMining();
  }, [seed]);

  if (loading || !pmData) {
    return <div className="p-8 text-center text-slate-500 text-xs">Analizando registros de eventos (Process Mining)...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Concept Header */}
      <Card title="Laboratorio de Process Mining (Minería de Procesos)" subtitle="Descubrimiento de procesos reales, detección de cuellos de botella y variantes desde el event log">
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Concepto:</strong> Process Mining reconstruye los flujos reales de trabajo a partir de las huellas digitales (event logs) de los sistemas ERP de DistriAndina. A diferencia de las entrevistas teóricas, descubre cómo opera realmente el proceso de pedidos corporativos, revelando variaciones, reprocesos e ineficiencias.
        </p>
      </Card>

      {/* Bottleneck Alert Banner */}
      {pmData.cuello_botella && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-sm text-rose-900">
              Detección Automática de Cuello de Botella
            </h4>
            <p className="text-xs text-rose-800 mt-1 leading-relaxed">
              {pmData.cuello_botella.diagnostico}
            </p>
          </div>
        </div>
      )}

      {/* Process Graph Component */}
      <GraphView
        nodos={pmData.nodos}
        aristas={pmData.aristas}
        cuelloBotella={pmData.cuello_botella}
      />

      {/* Activity Performance Table & Rework Index */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Table */}
        <div className="lg:col-span-2">
          <Card title="Métricas por Actividad del Proceso" subtitle="Frecuencias totales y tiempos promedio de ejecución y espera">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Actividad</th>
                    <th className="p-2.5 text-right">Frecuencia</th>
                    <th className="p-2.5 text-right">Duración Ejecución (h)</th>
                    <th className="p-2.5 text-right">Espera Previa (h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pmData.actividades.map((act) => {
                    const isBottleneck = pmData.cuello_botella?.actividad === act.actividad;

                    return (
                      <tr key={act.actividad} className={`hover:bg-slate-50 ${isBottleneck ? 'bg-rose-50 font-bold' : ''}`}>
                        <td className="p-2.5 text-slate-900 flex items-center gap-2">
                          {act.actividad}
                          {isBottleneck && <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded uppercase">Bottleneck</span>}
                        </td>
                        <td className="p-2.5 text-right text-slate-700">{act.frecuencia}</td>
                        <td className="p-2.5 text-right text-slate-700">{act.duracion_prom_h}h</td>
                        <td className={`p-2.5 text-right ${isBottleneck ? 'text-rose-700 font-extrabold' : 'text-slate-700'}`}>
                          {act.espera_prom_h}h
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Rework & Summary Panel */}
        <div>
          <Card title="Índice de Reprocesos" subtitle="Casos con bucles de reintento">
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <span className="text-xs text-amber-800 font-bold uppercase tracking-wider block mb-1">
                  Tasa de Reprocesos
                </span>
                <span className="text-3xl font-black text-amber-600">
                  {pmData.tasa_reproceso.porcentaje}%
                </span>
                <span className="text-[11px] text-amber-700 block mt-1">
                  ({pmData.tasa_reproceso.casos_con_reproceso} de {pmData.tasa_reproceso.total_casos} casos volvieron a ejecutar pasos previos)
                </span>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Variants Breakdown */}
      <Card title="Variantes de Proceso Descubiertas (Caminos)" subtitle={`Se identificaron ${pmData.variantes.length} secuencias distintas de ejecución`}>
        <div className="space-y-2 mt-1">
          {pmData.variantes.map((v) => (
            <div key={v.variante_id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-sky-600 text-white font-mono font-bold text-xs px-2 py-1 rounded">
                  {v.variante_id}
                </span>
                <span className="font-mono text-xs text-slate-800">
                  {v.camino}
                </span>
              </div>
              <div className="text-right font-mono text-xs text-slate-600">
                <strong>{v.frecuencia} casos</strong> ({v.porcentaje}%)
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};

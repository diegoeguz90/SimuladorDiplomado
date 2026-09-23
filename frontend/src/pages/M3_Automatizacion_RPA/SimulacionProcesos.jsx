import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sliders, Play, TrendingDown, Users, Zap, BookOpen } from 'lucide-react';

export const SimulacionProcesos = () => {
  const [numValidadores, setNumValidadores] = useState(2);
  const [autoFacturacion, setAutoFacturacion] = useState(false);
  const [nPedidos, setNPedidos] = useState(100);

  const [simRes, setSimRes] = useState(null);
  const [comparativa, setComparativa] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarComparativa = async () => {
    try {
      const resComp = await apiService.getComparativaSimulacion();
      setComparativa(resComp.data);
    } catch (err) {
      console.error('Error cargando comparativa:', err);
    }
  };

  useEffect(() => {
    cargarComparativa();
    handleEjecutarSimulacion();
  }, []);

  const handleEjecutarSimulacion = async () => {
    setLoading(true);
    try {
      const res = await apiService.ejecutarSimulacion({
        num_validadores: parseInt(numValidadores),
        auto_facturacion: autoFacturacion,
        n_pedidos: parseInt(nPedidos)
      });
      setSimRes(res.data);
    } catch (err) {
      console.error('Error en simulación SimPy:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Concept Header */}
      <Card title="Simulación de Eventos Discretos (SimPy) & Ley de Little" subtitle="Evaluación cuantitativa de escenarios de capacidad y automatización previa a la inversión">
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Concepto:</strong> Modificar procesos en la vida real tiene riesgos y costos. La simulación de eventos discretos en Python (SimPy) modela digitalmente el comportamiento aleatorio del flujo de pedidos. Permite probar qué sucede al aumentar validadores de crédito o automatizar actividades con RPA antes de invertir dinero real.
        </p>
      </Card>

      {/* Interactive Scenario Controls Form */}
      <Card title="Configurador de Escenario de Simulación" subtitle="Ajusta los parámetros operativos de capacidad y automatización">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Número de Validadores de Crédito (Recurso):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="5"
                value={numValidadores}
                onChange={(e) => setNumValidadores(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <span className="font-mono font-black text-sm text-sky-800 bg-sky-100 px-2 py-0.5 rounded min-w-[28px] text-center">
                {numValidadores}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Automatizar Facturación (RPA Bot):
            </label>
            <button
              type="button"
              onClick={() => setAutoFacturacion(!autoFacturacion)}
              className={`w-full py-2 px-3 rounded-lg border font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                autoFacturacion
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <Zap className={`w-4 h-4 ${autoFacturacion ? 'text-emerald-600' : 'text-slate-400'}`} />
              {autoFacturacion ? 'RPA Activado (0.1h)' : 'Manual (2.0h)'}
            </button>
          </div>

          <div>
            <button
              onClick={handleEjecutarSimulacion}
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-lg shadow flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Play className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Simulando...' : 'Ejecutar Simulación SimPy'}
            </button>
          </div>

        </div>
      </Card>

      {/* Single Run Results & Little's Law */}
      {simRes && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2">
            <Card title="Resultados del Escenario Simulado" subtitle={`Evaluados ${nPedidos} pedidos en entorno de eventos discretos`}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Lead Time Promedio</span>
                  <span className="text-2xl font-black text-sky-700">{simRes.lead_time_promedio_h}h</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Espera Crédito</span>
                  <span className="text-2xl font-black text-amber-600">{simRes.espera_credito_promedio_h}h</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Cola Máxima</span>
                  <span className="text-2xl font-black text-rose-600">{simRes.longitud_cola_max} ped</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Ocupación Recurso</span>
                  <span className="text-2xl font-black text-emerald-600">{simRes.utilizacion_validadores_pct}%</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Little's Law Box */}
          <div>
            <Card title="Aplicación de la Ley de Little" subtitle="L = λ × W">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sky-900 font-extrabold text-xs">
                  <BookOpen className="w-4 h-4 text-sky-700" />
                  Ecuación Fundamental de Colas
                </div>
                <p className="text-xs text-sky-800 leading-relaxed font-mono">
                  {simRes.ley_de_little.formula_explicada}
                </p>
                <div className="bg-white p-2.5 rounded border border-sky-200 text-[11px] text-slate-700 space-y-1">
                  <div>• λ (Tasa llegada): <strong>{simRes.ley_de_little.tasa_llegada_lambda} ped/h</strong></div>
                  <div>• W (Lead Time): <strong>{simRes.ley_de_little.lead_time_W_horas} horas</strong></div>
                  <div>• L (Trabajo WIP): <strong className="text-sky-800">{simRes.ley_de_little.wip_L_pedidos} pedidos en bodega</strong></div>
                </div>
              </div>
            </Card>
          </div>

        </div>
      )}

      {/* Side-by-Side Scenario Comparison Charts */}
      {comparativa && (
        <Card title="Comparativa Pre-definida de Escenarios" subtitle="Lead Time Promedio (Horas) según decisiones de capacidad">
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { nombre: 'Actual (1 Val, Manual)', lead_time: comparativa.escenario_actual.lead_time_promedio_h, espera: comparativa.escenario_actual.espera_credito_promedio_h },
                  { nombre: 'Opción 1 (+2 Validadores)', lead_time: comparativa.escenario_opcion_1.lead_time_promedio_h, espera: comparativa.escenario_opcion_1.espera_credito_promedio_h },
                  { nombre: 'Opción 2 (3 Val + RPA Bot)', lead_time: comparativa.escenario_opcion_2.lead_time_promedio_h, espera: comparativa.escenario_opcion_2.espera_credito_promedio_h },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="nombre" tick={{ fontSize: 11 }} />
                <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="lead_time" name="Lead Time Total (h)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="espera" name="Espera Crédito (h)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

    </div>
  );
};

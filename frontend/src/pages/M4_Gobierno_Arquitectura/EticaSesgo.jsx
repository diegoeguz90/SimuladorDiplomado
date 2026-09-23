import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';
import { useData } from '../../context/DataContext';
import { Scale, AlertCircle, CheckCircle2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export const EticaSesgo = () => {
  const { seed } = useData();
  const [evalData, setEvalData] = useState(null);
  const [mitigacionData, setMitigacionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mitigando, setMitigando] = useState(false);

  const cargarEvaluacion = async () => {
    setLoading(true);
    try {
      const res = await apiService.getEticaCreditoModelo();
      setEvalData(res.data);
      setMitigacionData(null);
    } catch (err) {
      console.error('Error evaluando sesgo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEvaluacion();
  }, [seed]);

  const handleMitigar = async () => {
    setMitigando(true);
    try {
      const res = await apiService.ejecutarMitigacionSesgo();
      setMitigacionData(res.data);
    } catch (err) {
      console.error('Error aplicando mitigación:', err);
    } finally {
      setMitigando(false);
    }
  };

  if (loading || !evalData) {
    return <div className="p-8 text-center text-slate-500 text-xs">Entrenando modelo de scoring de crédito (scikit-learn)...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Concept Header */}
      <Card title="Ética & Sesgo Algorítmico en Inteligencia Artificial" subtitle="Evaluación de equidad (Fairness), Disparate Impact y Regla del 4/5 en scoring de crédito">
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Concepto:</strong> Al entrenar modelos de Machine Learning con datos históricos, existe el riesgo de amplificar sesgos discriminatorios preexistentes. El ratio de <strong className="text-sky-800">Disparate Impact (DI)</strong> mide si la tasa de aprobación para un grupo protegido (mujeres) es al menos el 80% (0.80) de la del grupo no protegido (hombres).
        </p>
      </Card>

      {/* Disparate Impact Status Banner */}
      <div className={`p-4 rounded-xl border-2 flex items-start gap-3 shadow-sm ${
        evalData.cumple_regla_cuatro_quintos
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
          : 'bg-rose-50 border-rose-400 text-rose-900'
      }`}>
        {evalData.cumple_regla_cuatro_quintos ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        )}

        <div>
          <h4 className="font-extrabold text-sm">
            {evalData.cumple_regla_cuatro_quintos
              ? 'El Modelo Cumple la Regla de Equidad del 4/5'
              : 'Alerta de Sesgo: Violación de la Regla del 4/5 (Impacto Dispar)'}
          </h4>
          <p className="text-xs mt-1 leading-relaxed">
            {evalData.diagnostico_sesgo}
          </p>
        </div>
      </div>

      {/* Pre-Mitigation Model Performance & Fairness Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Exactitud Global Modelo
          </span>
          <span className="text-2xl font-black text-slate-900">
            {evalData.exactitud_modelo}%
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Tasa Aprobación Hombres
          </span>
          <span className="text-2xl font-black text-sky-700">
            {evalData.tasa_aprobacion_hombres}%
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Tasa Aprobación Mujeres
          </span>
          <span className="text-2xl font-black text-indigo-700">
            {evalData.tasa_aprobacion_mujeres}%
          </span>
        </div>

        <div className={`border rounded-xl p-4 text-center shadow-sm ${
          evalData.disparate_impact >= 0.80 ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
        }`}>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
            Disparate Impact (DI)
          </span>
          <span className={`text-2xl font-black ${evalData.disparate_impact >= 0.80 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {evalData.disparate_impact}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            (Umbral mínimo: 0.800)
          </span>
        </div>

      </div>

      {/* Mitigation Action Button Card */}
      <Card
        title="Mitigación Interactiva por Ajuste de Umbral Equitativo"
        subtitle="Equilibra la tasa de oportunidad positiva reduciendo la discriminación algorítmica"
        headerAction={
          <button
            onClick={handleMitigar}
            disabled={mitigando}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-lg shadow flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            {mitigando ? 'Aplicando Mitigación...' : 'Aplicar Mitigación de Sesgo'}
          </button>
        }
      >
        {mitigacionData ? (
          <div className="space-y-4">
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <h4 className="font-bold text-xs text-indigo-900 mb-1">Trade-off Exactitud vs. Equidad (Fairness):</h4>
              <p className="text-xs text-indigo-800 font-mono">{mitigacionData.tradeoff_resumen}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pre-Mitigation Box */}
              <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">
                  Antes de Mitigación (Sesgado)
                </span>
                <div className="text-xs space-y-1 font-mono text-slate-700">
                  <div>• Disparate Impact: <strong className="text-rose-700">{mitigacionData.pre_mitigacion.disparate_impact}</strong></div>
                  <div>• Aprobación Mujeres: <strong>{mitigacionData.pre_mitigacion.tasa_mujeres}%</strong></div>
                  <div>• Aprobación Hombres: <strong>{mitigacionData.pre_mitigacion.tasa_hombres}%</strong></div>
                  <div>• Regla 4/5: <span className="text-rose-600 font-bold">NO Cumple</span></div>
                </div>
              </div>

              {/* Post-Mitigation Box */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  Después de Mitigación (Equitativo)
                </span>
                <div className="text-xs space-y-1 font-mono text-slate-700">
                  <div>• Disparate Impact: <strong className="text-emerald-700">{mitigacionData.post_mitigacion.disparate_impact}</strong></div>
                  <div>• Aprobación Mujeres: <strong>{mitigacionData.post_mitigacion.tasa_mujeres}%</strong></div>
                  <div>• Aprobación Hombres: <strong>{mitigacionData.post_mitigacion.tasa_hombres}%</strong></div>
                  <div>• Regla 4/5: <span className="text-emerald-600 font-bold">SÍ Cumple (&gt;= 0.80)</span></div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-4 text-center">
            Haz clic en "Aplicar Mitigación de Sesgo" para ajustar los umbrales de decisión y comparar las métricas antes y después.
          </p>
        )}
      </Card>

    </div>
  );
};

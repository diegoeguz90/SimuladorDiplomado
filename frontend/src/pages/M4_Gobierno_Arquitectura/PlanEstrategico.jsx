import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';
import { FileText, Save, Download, Sparkles } from 'lucide-react';

export const PlanEstrategico = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarPlan = async () => {
    setLoading(true);
    try {
      const res = await apiService.getPlanEstrategico();
      setPlan(res.data);
    } catch (err) {
      console.error('Error cargando plan estratégico:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPlan();
  }, []);

  if (loading || !plan) {
    return <div className="p-8 text-center text-slate-500 text-xs">Cargando Plan Estratégico de Datos...</div>;
  }

  const handleExportarJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `plan_estrategico_datos_distriandina.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Concept Header */}
      <Card
        title="Plan Estratégico de Datos de 1 Página (1-Pager Data Strategy)"
        subtitle="Hoja de ruta ejecutiva alineada a los 4 módulos temáticos del diplomado"
        headerAction={
          <button
            onClick={handleExportarJson}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Exportar Plan (JSON)
          </button>
        }
      >
        <div className="space-y-6 mt-2">
          
          {/* Vision Box */}
          <div className="bg-sky-900 text-white p-5 rounded-xl border border-sky-800 shadow">
            <h4 className="font-extrabold text-xs text-sky-300 uppercase tracking-wider mb-1">
              Visión Estratégica de Datos — {plan.empresa}
            </h4>
            <p className="text-sm text-sky-100 font-medium leading-relaxed italic">
              "{plan.vision_datos}"
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.pilares_estrategicos.map((pilar, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <span className="text-[10px] font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded uppercase tracking-wider">
                  Módulo {idx + 1}
                </span>
                <h4 className="font-bold text-sm text-slate-900">{pilar.pilar}</h4>
                <p className="text-xs text-slate-600">{pilar.objetivo}</p>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <strong className="text-slate-800 block mb-1">Iniciativas Clave:</strong>
                  {pilar.iniciativas.map((init, iIdx) => (
                    <div key={iIdx} className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>{init}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-700 flex justify-between">
                  <span>Meta KPI:</span>
                  <strong className="text-emerald-700">{pilar.kpi_meta}</strong>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Card>

    </div>
  );
};

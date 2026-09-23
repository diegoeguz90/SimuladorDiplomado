import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';
import { Cpu, Bot, Workflow, Brain, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Hiperautomatizacion = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarHiper = async () => {
    setLoading(true);
    try {
      const res = await apiService.getHiperautomatizacion();
      setData(res.data);
    } catch (err) {
      console.error('Error cargando hiperautomatización:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHiper();
  }, []);

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-500 text-xs">Cargando arquitectura de hiperautomatización...</div>;
  }

  const iconosCapa = {
    'RPA (Robotic Process Automation)': Bot,
    'BPM (Business Process Management)': Workflow,
    'Agentes / IA (Inteligencia Artificial)': Brain,
  };

  return (
    <div className="space-y-6">
      
      {/* Concept Header */}
      <Card title="Hiperautomatización: RPA + BPM + IA Agent" subtitle="Arquitectura integrada para la automatización inteligente de extremo a extremo">
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Concepto:</strong> La hiperautomatización combina tres tecnologías clave: <strong className="text-sky-800">RPA (los bots hacen)</strong> para tareas repetitivas de interfaz; <strong className="text-emerald-800">BPM (la plataforma coordina)</strong> para gestionar el flujo de trabajo y las excepciones; y <strong className="text-indigo-800">IA / Agentes (la IA piensa)</strong> para analizar documentos y tomar decisiones informadas.
        </p>
      </Card>

      {/* 3 Layers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.capas.map((c) => {
          const Icon = iconosCapa[c.capa] || Cpu;

          return (
            <Card key={c.capa} title={c.capa} headerAction={<Icon className="w-6 h-6 text-sky-600" />}>
              <div className="space-y-3 mt-1">
                <p className="text-xs text-slate-700 font-medium bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {c.rol}
                </p>

                <div>
                  <h5 className="font-bold text-xs text-slate-800 mb-1">Casos en DistriAndina:</h5>
                  <ul className="space-y-1">
                    {c.ejemplos_caso.map((ex, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <span className="text-sky-500 font-bold">•</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500">
                  <strong>Herramientas:</strong> {c.herramientas}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* BPMN Workflow Visualization */}
      <Card title={data.bpmn_flujo.titulo} subtitle="Diagrama de flujo BPMN renderizado con asignación tecnológica">
        <div className="bg-slate-900 text-white rounded-xl p-6 overflow-x-auto border border-slate-800 shadow-inner">
          <div className="flex flex-wrap items-center justify-center gap-3 min-w-[800px] py-4">
            {data.bpmn_flujo.nodos.map((nodo, idx) => {
              const bgColors = {
                inicio: 'bg-emerald-900/80 border-emerald-500 text-emerald-200',
                rpa: 'bg-sky-950/80 border-sky-500 text-sky-200',
                ia: 'bg-indigo-950/80 border-indigo-500 text-indigo-200',
                bpm: 'bg-amber-950/80 border-amber-500 text-amber-200',
                gateway: 'bg-purple-950/80 border-purple-500 text-purple-200 rotate-0',
                fin: 'bg-emerald-950/80 border-emerald-500 text-emerald-100 font-bold',
              };

              return (
                <React.Fragment key={nodo.id}>
                  <div className={`p-3.5 rounded-xl border text-center text-xs font-bold shadow-md min-w-[150px] ${bgColors[nodo.tipo] || 'bg-slate-800 border-slate-700'}`}>
                    <span className="text-[10px] opacity-75 uppercase block mb-0.5">
                      [{nodo.tipo.toUpperCase()}]
                    </span>
                    {nodo.label}
                  </div>

                  {idx < data.bpmn_flujo.nodos.length - 1 && (
                    <div className="flex items-center text-slate-500">
                      <ArrowRight className="w-5 h-5 text-sky-400" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </Card>

    </div>
  );
};

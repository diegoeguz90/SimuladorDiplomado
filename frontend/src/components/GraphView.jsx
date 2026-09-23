import React from 'react';
import { ArrowRight, Clock, Activity, AlertCircle } from 'lucide-react';

export const GraphView = ({ nodos = [], aristas = [], cuelloBotella = null }) => {
  return (
    <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 shadow-inner overflow-x-auto">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
        <h4 className="font-bold text-sm text-sky-400 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Grafo Descubierto del Proceso
        </h4>
        {cuelloBotella && (
          <div className="flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            Cuello de Botella: <span className="underline font-bold">{cuelloBotella.actividad}</span> ({cuelloBotella.espera_promedio_h}h espera)
          </div>
        )}
      </div>

      {/* Grid Flow View */}
      <div className="flex flex-wrap items-center justify-center gap-4 min-w-[700px] py-4">
        {nodos.map((nodo, idx) => {
          const isBottleneck = cuelloBotella && cuelloBotella.actividad === nodo.id;
          
          return (
            <React.Fragment key={nodo.id}>
              {/* Node Card */}
              <div
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all min-w-[160px] text-center shadow-lg ${
                  isBottleneck
                    ? 'bg-rose-950/80 border-rose-500 text-rose-100 ring-4 ring-rose-500/20 scale-105'
                    : 'bg-slate-800 border-slate-700 text-slate-100 hover:border-sky-500'
                }`}
              >
                {isBottleneck && (
                  <span className="absolute -top-3 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                    Bottleneck
                  </span>
                )}
                
                <span className="text-xs font-extrabold text-slate-200 mb-1">
                  {nodo.label || nodo.id}
                </span>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span className="bg-slate-900 px-2 py-0.5 rounded font-mono text-sky-300">
                    {nodo.frecuencia} casos
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{nodo.espera_prom_h || 0}h espera</span>
                </div>
              </div>

              {/* Edge Arrow */}
              {idx < nodos.length - 1 && (
                <div className="flex flex-col items-center justify-center text-slate-500 px-1">
                  <ArrowRight className="w-5 h-5 text-sky-400 animate-pulse" />
                  {aristas[idx] && (
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {aristas[idx].tiempo_medio_h}h
                    </span>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

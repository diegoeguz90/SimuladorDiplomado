import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { RefreshCw, Database, ShieldAlert, Sparkles, Server } from 'lucide-react';

export const TopBar = () => {
  const { seed, years, numTiendas, modo, loading, error, regenerarDatos } = useData();
  
  const [inputSeed, setInputSeed] = useState(seed);
  const [inputModo, setInputModo] = useState(modo);

  const handleRegenerar = (e) => {
    e.preventDefault();
    regenerarDatos({
      seed: parseInt(inputSeed) || 42,
      modo: inputModo
    });
  };

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="bg-sky-600 p-2 rounded-lg text-white font-bold text-xl shadow-inner flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
              DistriAndina Analytics Lab
              <span className="text-xs bg-sky-500/20 text-sky-300 font-semibold px-2 py-0.5 rounded border border-sky-400/30">
                Diplomado S.A.S.
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Simulador de Analítica Estratégica & Gobierno de Datos
            </p>
          </div>
        </div>

        {/* Global Dataset Controls Form */}
        <form onSubmit={handleRegenerar} className="flex flex-wrap items-center gap-3 bg-slate-800/80 p-2 rounded-lg border border-slate-700">
          
          {/* Seed Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="font-semibold">Semilla:</span>
            <input
              type="number"
              value={inputSeed}
              onChange={(e) => setInputSeed(e.target.value)}
              className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white font-mono text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
              title="Semilla aleatoria reproducible"
            />
          </div>

          {/* Mode Selector (Limpio / Sucio) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="font-semibold">Modo:</span>
            <select
              value={inputModo}
              onChange={(e) => setInputModo(e.target.value)}
              className={`rounded px-2 py-1 text-xs font-bold focus:outline-none transition-colors ${
                inputModo === 'sucio'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              <option value="limpio" className="bg-slate-900 text-emerald-400">Limpio (Perfecto)</option>
              <option value="sucio" className="bg-slate-900 text-amber-400">Sucio (Con Errores)</option>
            </select>
          </div>

          {/* Regenerate Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white font-semibold text-xs px-3 py-1.5 rounded transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Regenerar Datos
          </button>
        </form>

        {/* Backend Status Indicator */}
        <div className="flex items-center gap-2 text-xs">
          {error ? (
            <span className="flex items-center gap-1 text-rose-400 font-semibold bg-rose-950/40 px-2.5 py-1 rounded border border-rose-800/40">
              <ShieldAlert className="w-4 h-4" /> Backend Offline
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/40">
              <Server className="w-3.5 h-3.5" /> 100% Local (FastAPI)
            </span>
          )}
        </div>

      </div>
    </header>
  );
};

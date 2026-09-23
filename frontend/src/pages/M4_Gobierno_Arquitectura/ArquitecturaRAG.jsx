import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';
import { Layers, Search, BookOpen, FileText, Sparkles, Database } from 'lucide-react';

export const ArquitecturaRAG = () => {
  const [medallion, setMedallion] = useState(null);
  const [query, setQuery] = useState('crédito equidad regla 4/5');
  const [ragResult, setRagResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarMedallion = async () => {
    try {
      const res = await apiService.getMedallion();
      setMedallion(res.data.capas);
    } catch (err) {
      console.error('Error cargando Medallion:', err);
    }
  };

  const handleBuscarRag = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await apiService.buscarRag({ consulta: query, top_k: 2 });
      setRagResult(res.data);
    } catch (err) {
      console.error('Error en mini-RAG:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMedallion();
    handleBuscarRag();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Concept Header */}
      <Card title="Arquitectura Medallion & Mini-RAG Local" subtitle="Patrón Lakehouse de tres capas y motor de búsqueda semántica local sin APIs externas">
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Concepto:</strong> El patrón Medallion organiza los datos de DistriAndina en tres capas de madurez: <strong className="text-amber-700">Bronce (Raw)</strong>, <strong className="text-slate-600">Silver (Limpio)</strong> y <strong className="text-amber-500">Gold (Agregados de Negocio)</strong>. El Mini-RAG utiliza TF-IDF y similitud coseno para responder preguntas sobre la normatividad interna con referencias exactas.
        </p>
      </Card>

      {/* Medallion Architecture 3-Capa Layout */}
      {medallion && (
        <Card title="Patrón Medallion: Lakehouse DistriAndina" subtitle="Organización lógica de la calidad de datos por capa">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            
            {/* Bronce */}
            <div className="bg-amber-900/10 border-2 border-amber-600/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <Database className="w-5 h-5 text-amber-700" />
                {medallion.bronce.nombre}
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                {medallion.bronce.descripcion}
              </p>
              <div className="pt-2 border-t border-amber-600/20">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">Datasets:</span>
                <ul className="space-y-1">
                  {medallion.bronce.datasets.map((ds) => (
                    <li key={ds} className="text-xs font-mono bg-white/80 p-1.5 rounded border border-amber-400/30 text-amber-950 font-semibold">
                      {ds}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Silver */}
            <div className="bg-slate-100 border-2 border-slate-400 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                <Layers className="w-5 h-5 text-slate-600" />
                {medallion.silver.nombre}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {medallion.silver.descripcion}
              </p>
              <div className="pt-2 border-t border-slate-300">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Datasets:</span>
                <ul className="space-y-1">
                  {medallion.silver.datasets.map((ds) => (
                    <li key={ds} className="text-xs font-mono bg-white p-1.5 rounded border border-slate-300 text-slate-800 font-semibold">
                      {ds}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gold */}
            <div className="bg-yellow-500/10 border-2 border-yellow-500/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-yellow-950 font-extrabold text-sm">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                {medallion.gold.nombre}
              </div>
              <p className="text-xs text-yellow-950/80 leading-relaxed">
                {medallion.gold.descripcion}
              </p>
              <div className="pt-2 border-t border-yellow-500/20">
                <span className="text-[10px] font-bold text-yellow-900 uppercase tracking-wider block mb-1">Datasets:</span>
                <ul className="space-y-1">
                  {medallion.gold.datasets.map((ds) => (
                    <li key={ds} className="text-xs font-mono bg-white/90 p-1.5 rounded border border-yellow-400/40 text-yellow-950 font-semibold">
                      {ds}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </Card>
      )}

      {/* Mini-RAG Local Search Card */}
      <Card title="Mini-RAG Local: Búsqueda Semántica sobre Políticas" subtitle="Búsqueda basada en vectores TF-IDF + Similitud Coseno sobre normatividad interna">
        
        <form onSubmit={handleBuscarRag} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: ¿Cuáles son las reglas de crédito? o ¿Qué temperatura debe tener la bodega?"
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {/* RAG Results Display */}
        {ragResult && (
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-slate-700">
              Se encontraron {ragResult.total_encontrados} fragmentos normativos relevantes para: "{ragResult.consulta}"
            </h4>

            <div className="space-y-3">
              {ragResult.resultados.map((doc) => (
                <div key={doc.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-sky-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-sky-600" />
                      {doc.titulo}
                    </span>
                    <span className="bg-sky-100 text-sky-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      Similitud Coseno: {doc.similitud}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200">
                    "{doc.fragmento_relevante}"
                  </p>

                  <div className="text-[10px] text-slate-500 font-mono">
                    <strong>Fuente:</strong> Documento ID {doc.id} | Categoría: {doc.categoria}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </Card>

    </div>
  );
};

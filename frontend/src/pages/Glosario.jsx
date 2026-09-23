import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { apiService } from '../services/api';
import { BookOpen, Search, Tag, Building2 } from 'lucide-react';

export const Glosario = () => {
  const [terminos, setTerminos] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const cargarGlosario = async (q = '') => {
    setLoading(true);
    try {
      const res = await apiService.getGlosario(q);
      setTerminos(res.data.terminos);
    } catch (err) {
      console.error('Error cargando glosario:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarGlosario(query);
  }, [query]);

  return (
    <div className="space-y-6">
      
      {/* Concept Header & Search Input */}
      <Card title="Glosario de Términos del Diplomado" subtitle="Conceptos clave de Analítica Estratégica & Gobierno con ejemplos aplicados al caso DistriAndina">
        <div className="relative mt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por término (ej: ETL, DIKW, Disparate Impact, Process Mining)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </Card>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {terminos.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 hover:border-sky-400 transition-colors shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-600" />
                {item.termino}
              </h4>
              <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono">
                {item.categoria}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {item.definicion}
            </p>

            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-[11px] text-slate-700 font-medium">
              <strong className="text-sky-800 flex items-center gap-1 mb-0.5">
                <Building2 className="w-3 h-3 text-sky-600" />
                Ejemplo en DistriAndina:
              </strong>
              {item.ejemplo_caso}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

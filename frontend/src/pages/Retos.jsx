import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { apiService } from '../services/api';
import { Trophy, CheckCircle, XCircle, Award, RefreshCw, HelpCircle } from 'lucide-react';

export const Retos = () => {
  const [retos, setRetos] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [evaluaciones, setEvaluaciones] = useState({});
  const [loading, setLoading] = useState(false);

  const cargarRetos = async () => {
    setLoading(true);
    try {
      const res = await apiService.getRetos();
      setRetos(res.data.retos);
    } catch (err) {
      console.error('Error cargando retos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRetos();
  }, []);

  const handleResponder = async (retoId, opcionIdx) => {
    setRespuestas({ ...respuestas, [retoId]: opcionIdx });
    try {
      const res = await apiService.evaluarReto(retoId, opcionIdx);
      setEvaluaciones({ ...evaluaciones, [retoId]: res.data });
    } catch (err) {
      console.error('Error evaluando reto:', err);
    }
  };

  const aciertos = Object.values(evaluaciones).filter(e => e.es_correcta).length;
  const evaluados = Object.keys(evaluaciones).length;

  return (
    <div className="space-y-6">
      
      {/* Concept Header & Score Counter */}
      <Card title="Retos Interactivos del Diplomado (8 Ejercicios)" subtitle="Evaluación práctica transversal sobre los datos generados de DistriAndina S.A.S.">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
            Responde los 8 ejercicios interactivos diseñados para verificar el dominio de los conceptos de los 4 módulos temáticos.
          </p>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Trophy className="w-6 h-6 text-amber-500" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Puntuación</span>
              <span className="text-lg font-black text-slate-800">
                {aciertos} / {retos.length} <span className="text-xs text-emerald-600 font-bold">aciertos</span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 8 Challenges List */}
      <div className="space-y-4">
        {retos.map((r, idx) => {
          const seleccion = respuestas[r.id];
          const evaluacion = evaluaciones[r.id];
          const respondido = evaluacion !== undefined;

          return (
            <Card key={r.id} className={respondido ? (evaluacion.es_correcta ? 'border-emerald-300' : 'border-rose-300') : ''}>
              <div className="space-y-3">
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded uppercase font-mono">
                    {r.modulo}
                  </span>
                  {respondido && (
                    <span className={`flex items-center gap-1 font-bold text-xs ${evaluacion.es_correcta ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {evaluacion.es_correcta ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {evaluacion.es_correcta ? '¡Correcto!' : 'Incorrecto'}
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-slate-900 text-sm">{r.titulo}</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {r.enunciado}
                </p>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {r.opciones.map((op, oIdx) => {
                    const esSeleccionado = seleccion === oIdx;
                    const esLaCorrecta = respondido && oIdx === r.respuesta_correcta;

                    let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-sky-400 hover:bg-sky-50/50';
                    if (respondido) {
                      if (esLaCorrecta) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (esSeleccionado) {
                        btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                      } else {
                        btnStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => !respondido && handleResponder(r.id, oIdx)}
                        disabled={respondido}
                        className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{op}</span>
                        {respondido && esLaCorrecta && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                        {respondido && esSeleccionado && !esLaCorrecta && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {respondido && (
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-900 leading-relaxed">
                    <strong>Explicación:</strong> {evaluacion.explicacion}
                  </div>
                )}

              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};

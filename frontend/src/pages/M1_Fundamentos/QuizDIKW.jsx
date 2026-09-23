import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, RefreshCw, Award } from 'lucide-react';

export const QuizDIKW = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [pasoActual, setPasoActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [completado, setCompletado] = useState(false);

  const cargarPreguntas = async () => {
    try {
      const res = await apiService.getDikwPreguntas();
      setEjercicios(res.data.ejercicios);
    } catch (err) {
      console.error('Error cargando preguntas DIKW:', err);
    }
  };

  useEffect(() => {
    cargarPreguntas();
  }, []);

  if (!ejercicios || ejercicios.length === 0) {
    return <div className="p-8 text-center text-slate-500 text-xs">Cargando Mini-Quiz DIKW...</div>;
  }

  const ejercicio = ejercicios[0];
  const paso = ejercicio.pasos[pasoActual];

  const handleSeleccionar = (opcionIdx) => {
    setRespuestas({
      ...respuestas,
      [pasoActual]: opcionIdx
    });
  };

  const handleSiguiente = () => {
    if (pasoActual < ejercicio.pasos.length - 1) {
      setPasoActual(prev => prev + 1);
    } else {
      setCompletado(true);
    }
  };

  const reiniciarQuiz = () => {
    setPasoActual(0);
    setRespuestas({});
    setCompletado(false);
  };

  const aciertos = Object.keys(respuestas).reduce((acc, pIdx) => {
    const p = ejercicio.pasos[pIdx];
    return respuestas[pIdx] === p.respuesta_correcta ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      <Card title="Mini-Quiz Interactivo: Jerarquía DIKW" subtitle="Clasificación de escenarios del caso DistriAndina en Dato -> Información -> Conocimiento -> Acción">
        
        {!completado ? (
          <div className="space-y-6 mt-2">
            
            {/* Step Progress indicator */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-sky-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full">
                  Paso {pasoActual + 1} de {ejercicio.pasos.length}
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  Nivel: <span className="text-sky-700 font-extrabold">{paso.nivel}</span>
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Puntuación actual: <span className="font-bold text-emerald-600">{aciertos} aciertos</span>
              </div>
            </div>

            {/* Definition Box */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
              <h4 className="font-bold text-xs text-sky-900 mb-1">Definición de {paso.nivel}:</h4>
              <p className="text-xs text-sky-800 italic mb-2">{paso.definición}</p>
              <div className="text-[11px] bg-white p-2 rounded border border-sky-200 text-slate-700">
                <strong>Ejemplo del Caso:</strong> {paso.ejemplo_caso}
              </div>
            </div>

            {/* Question Options */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-700 mb-3">
                Selecciona la opción que corresponde estrictamente al nivel <span className="text-sky-600 font-extrabold">{paso.nivel}</span>:
              </h4>

              {paso.opciones.map((opcion, idx) => {
                const seleccionado = respuestas[pasoActual] === idx;
                const yaRespondio = respuestas[pasoActual] !== undefined;
                const esCorrecta = idx === paso.respuesta_correcta;

                let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-sky-400 hover:bg-sky-50/50';
                if (yaRespondio) {
                  if (esCorrecta) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  } else if (seleccionado) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                  } else {
                    btnStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !yaRespondio && handleSeleccionar(idx)}
                    disabled={yaRespondio}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opcion}</span>
                    {yaRespondio && (
                      <span>
                        {esCorrecta ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : seleccionado ? (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        ) : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Step Button */}
            {respuestas[pasoActual] !== undefined && (
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={handleSiguiente}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>{pasoActual < ejercicio.pasos.length - 1 ? 'Siguiente Nivel' : 'Ver Resultado Final'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        ) : (
          /* Final Results Screen */
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex p-4 bg-emerald-100 text-emerald-700 rounded-full mb-2">
              <Award className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-black text-slate-800">¡Mini-Quiz DIKW Completado!</h3>
            <p className="text-sm text-slate-600">
              Obtuviste <strong className="text-emerald-600 text-base">{aciertos}</strong> de <strong className="text-slate-800">{ejercicio.pasos.length}</strong> respuestas correctas.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Has demostrado comprender cómo los datos sin procesar de DistriAndina se transforman progresivamente en información estructurada, conocimiento causa-raíz y acciones prescriptivas estratégicas.
            </p>
            <div className="pt-4">
              <button
                onClick={reiniciarQuiz}
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Intentar Nuevamente
              </button>
            </div>
          </div>
        )}

      </Card>

    </div>
  );
};

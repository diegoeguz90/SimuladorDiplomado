import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';
import { useData } from '../../context/DataContext';
import { ShieldCheck, Database, CheckCircle2, AlertTriangle, UserCheck, Lock } from 'lucide-react';

export const GobiernoCalidad = () => {
  const { modo, regenerarDatos } = useData();
  
  const [catalogo, setCatalogo] = useState(null);
  const [calidad, setCalidad] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarGobierno = async () => {
    setLoading(true);
    try {
      const resCat = await apiService.getCatalogoGobierno();
      setCatalogo(resCat.data.catalogo);

      const resCal = await apiService.getCalidadReglas();
      setCalidad(resCal.data);
    } catch (err) {
      console.error('Error cargando gobierno:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarGobierno();
  }, [modo]);

  const toggleModo = () => {
    const nuevoModo = modo === 'limpio' ? 'sucio' : 'limpio';
    regenerarDatos({ modo: nuevoModo });
  };

  return (
    <div className="space-y-6">
      
      {/* Concept Header */}
      <Card title="Gobierno de Datos & Reglas de Calidad Ejecutables" subtitle="Catálogo de datos, asignación de Data Owners y validaciones automáticas">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            <strong>Concepto:</strong> El gobierno de datos define las responsabilidades (Data Owners), los niveles de confidencialidad y las políticas de uso de los activos de datos de DistriAndina. Las reglas de calidad ejecutables (pandas/Great Expectations style) evalúan automáticamente la salud de los datos en tiempo real.
          </p>

          <button
            onClick={toggleModo}
            className={`font-bold text-xs px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-colors ${
              modo === 'sucio'
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {modo === 'sucio' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            Modo Actual: <span className="uppercase font-black">{modo}</span> (Cambiar)
          </button>
        </div>
      </Card>

      {/* Global Data Quality Score Card */}
      {calidad && (
        <Card title="Score Global de Calidad de Datos" subtitle={`Evaluación de ${calidad.total_reglas} reglas ejecutables sobre el universo de datos en modo '${calidad.modo_actual}'`}>
          <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-6 gap-6">
            
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Reglas Aprobadas
              </span>
              <div className="text-3xl font-black text-slate-900">
                {calidad.reglas_pasadas} / {calidad.total_reglas} <span className="text-sm font-normal text-slate-500">reglas</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Índice Global de Cumplimiento
              </span>
              <div className={`text-4xl font-black ${calidad.score_global_calidad >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {calidad.score_global_calidad}%
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Estado del Gobierno
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                calidad.score_global_calidad >= 95
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {calidad.score_global_calidad >= 95 ? 'Cumplimiento Óptimo' : 'Requiere Remediación ETL'}
              </span>
            </div>

          </div>
        </Card>
      )}

      {/* Executable Quality Rules Results */}
      {calidad && (
        <Card title="Resultado de Evaluación de Reglas de Calidad" subtitle="Pasa: Cumplimiento >= 98.0% | Falla: Cumplimiento < 98.0%">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
            {calidad.reglas_evaluadas.map((r) => {
              const pasa = r.estado === 'Pasa';

              return (
                <div
                  key={r.regla_id}
                  className={`border rounded-xl p-4 transition-all ${
                    pasa
                      ? 'bg-white border-slate-200'
                      : 'bg-rose-50/60 border-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {r.regla_id} ({r.tabla})
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                      pasa ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {r.estado} ({r.cumplimiento_pct}%)
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 mb-1">{r.nombre}</h4>
                  <p className="text-[11px] text-slate-600">{r.descripcion}</p>

                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full ${pasa ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${r.cumplimiento_pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Data Catalog Table */}
      {catalogo && (
        <Card title="Catálogo de Datos & Data Governance (DistriAndina S.A.S.)" subtitle="Definición de tablas, propietarios asignados (Data Owners) y niveles de clasificación">
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Tabla</th>
                  <th className="p-2.5">Descripción de Negocio</th>
                  <th className="p-2.5">Data Owner (Propietario)</th>
                  <th className="p-2.5">Clasificación de Seguridad</th>
                  <th className="p-2.5">Atributos Sensibles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {catalogo.map((cat) => (
                  <tr key={cat.tabla} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-sky-700">{cat.tabla}.csv</td>
                    <td className="p-2.5 text-slate-600">{cat.descripcion}</td>
                    <td className="p-2.5 text-slate-900 font-bold flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {cat.propietario}
                    </td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cat.clasificacion.includes('Confidencial')
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {cat.clasificacion}
                      </span>
                    </td>
                    <td className="p-2.5">
                      {cat.columnas_sensibles.length > 0 ? (
                        <span className="text-rose-600 font-bold">{cat.columnas_sensibles.join(', ')}</span>
                      ) : (
                        <span className="text-slate-400">Ninguna</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

    </div>
  );
};

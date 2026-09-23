import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Search, AlertCircle, BarChart2, Filter } from 'lucide-react';

export const ExploradorEDA = () => {
  const { seed, modo } = useData();
  
  const [tabla, setTabla] = useState('ventas');
  const [stats, setStats] = useState(null);
  const [selectedCol, setSelectedCol] = useState('');
  const [distribucion, setDistribucion] = useState(null);
  const [correlaciones, setCorrelaciones] = useState(null);
  const [drilldown, setDrilldown] = useState(null);
  const [loading, setLoading] = useState(false);

  const tablas = ['ventas', 'catalogo', 'tiendas', 'clientes', 'pedidos_eventlog', 'sensores_bodega', 'facturas', 'credito_solicitudes'];

  const cargarEda = async () => {
    setLoading(true);
    try {
      const resStats = await apiService.getEdaEstadisticas(tabla);
      setStats(resStats.data);

      const numCols = resStats.data.columnas.filter(c => c.tipo.includes('int') || c.tipo.includes('float'));
      const colTarget = numCols.length > 0 ? numCols[0].columna : resStats.data.columnas[0].columna;
      setSelectedCol(colTarget);

      const resDist = await apiService.getEdaDistribucion(tabla, colTarget);
      setDistribucion(resDist.data);

      const resCorr = await apiService.getEdaCorrelacion(tabla);
      setCorrelaciones(resCorr.data);

      if (tabla === 'ventas') {
        const resDrill = await apiService.getEdaDrilldown();
        setDrilldown(resDrill.data);
      }
    } catch (err) {
      console.error('Error cargando EDA:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEda();
  }, [tabla, seed, modo]);

  const handleSelectCol = async (col) => {
    setSelectedCol(col);
    try {
      const resDist = await apiService.getEdaDistribucion(tabla, col);
      setDistribucion(resDist.data);
    } catch (err) {
      console.error('Error en distribución:', err);
    }
  };

  const COLORS = ['#0284c7', '#0d9488', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

  return (
    <div className="space-y-6">
      
      {/* Concept Header & Controls */}
      <Card title="Explorador de Análisis Exploratorio de Datos (EDA)" subtitle="Visualización de distribuciones, atípicos, nulos y correlaciones">
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold text-slate-700">Seleccionar Tabla:</label>
          <select
            value={tabla}
            onChange={(e) => setTabla(e.target.value)}
            className="bg-white border border-slate-300 font-bold rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            {tablas.map((t) => (
              <option key={t} value={t}>{t}.csv</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Summary Columns Table & Null Detector */}
      {stats && (
        <Card title={`Estructura & Tipos de Datos (${stats.tabla}.csv)`} subtitle={`${stats.total_filas} filas × ${stats.total_columnas} columnas`}>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Columna</th>
                  <th className="p-2.5">Tipo de Dato</th>
                  <th className="p-2.5">Nulos</th>
                  <th className="p-2.5">Valores Únicos</th>
                  <th className="p-2.5">Mín</th>
                  <th className="p-2.5">Media</th>
                  <th className="p-2.5">Máx</th>
                  <th className="p-2.5">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stats.columnas.map((c) => (
                  <tr key={c.columna} className={`hover:bg-slate-50 ${selectedCol === c.columna ? 'bg-sky-50 font-bold' : ''}`}>
                    <td className="p-2.5 text-slate-900">{c.columna}</td>
                    <td className="p-2.5 text-slate-500">{c.tipo}</td>
                    <td className="p-2.5">
                      {c.nulos > 0 ? (
                        <span className="text-rose-600 font-bold bg-rose-100 px-1.5 py-0.5 rounded">{c.nulos} nulos</span>
                      ) : (
                        <span className="text-emerald-600">0</span>
                      )}
                    </td>
                    <td className="p-2.5">{c.unicos}</td>
                    <td className="p-2.5 text-slate-600">{c.min !== undefined ? c.min.toLocaleString() : '-'}</td>
                    <td className="p-2.5 text-slate-600">{c.media !== undefined ? c.media.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '-'}</td>
                    <td className="p-2.5 text-slate-600">{c.max !== undefined ? c.max.toLocaleString() : '-'}</td>
                    <td className="p-2.5">
                      <button
                        onClick={() => handleSelectCol(c.columna)}
                        className="bg-sky-600 hover:bg-sky-500 text-white px-2 py-1 rounded text-[11px] font-semibold"
                      >
                        Graficar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Distribution Chart & Boxplot Outliers */}
      {distribucion && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title={`Distribución de Frecuencias (${distribucion.columna})`} subtitle={distribucion.tipo === 'numerica' ? 'Histograma de rangos continuos' : 'Conteo por categoría'}>
              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribucion.tipo === 'numerica' ? distribucion.histograma : distribucion.conteo}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey={distribucion.tipo === 'numerica' ? 'rango' : 'categoria'} tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey={distribucion.tipo === 'numerica' ? 'frecuencia' : 'frecuencia'} fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div>
            <Card title="Resumen IQR & Atípicos" subtitle="Estadísticas de caja y atípicos">
              {distribucion.boxplot ? (
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500">Mínimo:</span>
                    <span className="font-bold text-slate-800">{distribucion.boxplot.min.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500">Cuartil 1 (Q1):</span>
                    <span className="font-bold text-slate-800">{distribucion.boxplot.q1.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-sky-50 rounded border border-sky-200">
                    <span className="text-sky-700 font-bold">Mediana (Q2):</span>
                    <span className="font-bold text-sky-900">{distribucion.boxplot.mediana.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500">Cuartil 3 (Q3):</span>
                    <span className="font-bold text-slate-800">{distribucion.boxplot.q3.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500">Máximo:</span>
                    <span className="font-bold text-slate-800">{distribucion.boxplot.max.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500">Rango IQR:</span>
                    <span className="font-bold text-slate-800">{distribucion.boxplot.iqr.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded border border-amber-300 text-amber-900 font-bold flex items-center justify-between">
                    <span>Atípicos (Outliers):</span>
                    <span className="text-sm bg-amber-200 px-2 py-0.5 rounded text-amber-900">{distribucion.boxplot.n_outliers} valores</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-8 text-center">Variable categórica sin cálculo IQR numérico.</p>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Drill-down Diagnostic Section for Ventas */}
      {tabla === 'ventas' && drilldown && (
        <Card title="Análisis Diagnóstico Guiado (Drill-Down de Ventas)" subtitle="Desglose transaccional por Tienda, Ciudad y Categoría de Producto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            
            {/* By Store */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-xs text-slate-700 mb-2">Ventas por Tienda ($ COP)</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={drilldown.por_tienda} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 9 }} />
                    <YAxis type="category" dataKey="tienda" tick={{ fontSize: 9 }} width={90} />
                    <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                    <Bar dataKey="total" fill="#0369a1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* By Category */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-xs text-slate-700 mb-2">Ventas por Categoría ($ COP)</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={drilldown.por_categoria}>
                    <XAxis dataKey="categoria" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                    <Bar dataKey="total" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* By City */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
              <h4 className="font-bold text-xs text-slate-700 mb-2 self-start">Ventas por Ciudad</h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={drilldown.por_ciudad} dataKey="total" nameKey="ciudad" cx="50%" cy="50%" outerRadius={55} label={({ ciudad }) => ciudad}>
                      {drilldown.por_ciudad.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </Card>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';
import { Table, Download, Database, RefreshCw, CheckCircle, FileSpreadsheet } from 'lucide-react';

export const GeneradorDatos = () => {
  const { seed, years, numTiendas, modo, resumen, loading, regenerarDatos } = useData();
  
  const [selectedTabla, setSelectedTabla] = useState('ventas');
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const tablasDisponibles = [
    { id: 'catalogo', nombre: '1. catalogo.csv', desc: 'Maestro de 50 productos en 6 categorías' },
    { id: 'tiendas', nombre: '2. tiendas.csv', desc: '4 tiendas físicas + canal Online' },
    { id: 'clientes', nombre: '3. clientes.csv', desc: '30 clientes corporativos con sensibles' },
    { id: 'ventas', nombre: '4. ventas.csv', desc: 'Ventas diarias con 2 anomalías' },
    { id: 'pedidos_eventlog', nombre: '5. pedidos_eventlog.csv', desc: 'Log de eventos con 5 variantes' },
    { id: 'sensores_bodega', nombre: '6. sensores_bodega.csv', desc: 'Series de tiempo IoT con fallas' },
    { id: 'facturas', nombre: '7. facturas.csv', desc: 'Facturas con errores simulados' },
    { id: 'credito_solicitudes', nombre: '8. credito_solicitudes.csv', desc: 'Solicitudes de crédito con sesgo' },
  ];

  const cargarPreview = async (tabla) => {
    setPreviewLoading(true);
    try {
      const res = await apiService.getPreviewDataset(tabla, 12);
      setPreviewData(res.data);
    } catch (err) {
      console.error('Error cargando preview:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    cargarPreview(selectedTabla);
  }, [selectedTabla, seed, modo]);

  return (
    <div className="space-y-6">
      
      {/* Concept Header */}
      <Card title="Generador del Universo de Datos Sintéticos" subtitle="Datos 100% sintéticos, reproducibles por semilla y descargables en CSV">
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Concepto:</strong> En la práctica de gobierno de datos y analítica, es fundamental trabajar con entornos de pruebas seguros y reproducibles. Este módulo genera el universo completo de 8 tablas relacionales de DistriAndina S.A.S. en memoria con semilla fija. Mismo número de semilla produce exactamente los mismos datos.
        </p>
      </Card>

      {/* Grid of 8 Datasets Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tablasDisponibles.map((t) => {
          const stats = resumen?.tablas?.[t.id];
          const isSelected = selectedTabla === t.id;
          
          return (
            <div
              key={t.id}
              onClick={() => setSelectedTabla(t.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                  {t.nombre}
                </span>
                {isSelected && <CheckCircle className="w-4 h-4 text-sky-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mb-2">{t.desc}</p>
              
              {stats && (
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  <span>{stats.filas} filas</span>
                  <span>{stats.columnas} cols</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Table Preview & Download Section */}
      {previewData && (
        <Card
          title={`Vista Previa: ${previewData.nombre}.csv`}
          subtitle={`Mostrando las primeras ${previewData.filas.length} filas de ${previewData.total_filas} registros totales`}
          headerAction={
            <a
              href={apiService.getExportarCsvUrl(selectedTabla)}
              download
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Descargar CSV
            </a>
          }
        >
          {previewLoading ? (
            <div className="py-12 text-center text-slate-500 text-xs">Cargando vista previa...</div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    {previewData.columnas.map((col) => (
                      <th key={col} className="p-2.5 border-r border-slate-200 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {previewData.filas.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {previewData.columnas.map((col) => (
                        <td key={col} className="p-2.5 border-r border-slate-200 whitespace-nowrap">
                          {row[col] === null || row[col] === undefined ? (
                            <span className="text-rose-500 font-bold bg-rose-50 px-1 rounded">NULL</span>
                          ) : (
                            String(row[col])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

    </div>
  );
};

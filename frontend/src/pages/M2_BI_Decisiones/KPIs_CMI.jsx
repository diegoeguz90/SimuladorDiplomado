import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { MetricBadge } from '../../components/MetricBadge';
import { apiService } from '../../services/api';
import { useData } from '../../context/DataContext';
import { CheckSquare, DollarSign, Users, RefreshCw, Cpu, Target } from 'lucide-react';

export const KPIs_CMI = () => {
  const { seed, modo } = useData();
  const [cmiData, setCmiData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarCmi = async () => {
    setLoading(true);
    try {
      const res = await apiService.getKpisCmi();
      setCmiData(res.data);
    } catch (err) {
      console.error('Error cargando CMI:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCmi();
  }, [seed, modo]);

  const iconosPerspectivas = {
    'Perspectiva Financiera': DollarSign,
    'Perspectiva del Cliente': Users,
    'Perspectiva de Procesos Internos': RefreshCw,
    'Perspectiva de Aprendizaje y Crecimiento': Cpu,
  };

  return (
    <div className="space-y-6">
      
      {/* Concept Header */}
      <Card title="Cuadro de Mando Integral (CMI / Balanced Scorecard)" subtitle="Tablero de control ejecutivo organizado en 4 perspectivas estratégicas">
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Concepto:</strong> El Cuadro de Mando Integral (Balanced Scorecard) traduce la estrategia organizacional de DistriAndina en objetivos operativos medibles. Agrupa los indicadores en 4 perspectivas interrelacionadas: Financiera, Cliente, Procesos Internos y Aprendizaje/Crecimiento, asignando metas y semáforos de desempeño.
        </p>
      </Card>

      {/* 4 Perspectives Grid */}
      {cmiData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cmiData.perspectivas.map((p) => {
            const Icon = iconosPerspectivas[p.nombre] || Target;

            return (
              <Card
                key={p.nombre}
                title={p.nombre}
                headerAction={<Icon className="w-5 h-5 text-sky-600" />}
              >
                <div className="space-y-3 mt-1">
                  {p.indicadores.map((kpi) => {
                    const formatoValor = (val, formato) => {
                      if (formato === 'moneda') return `$${val.toLocaleString('es-CO')} COP`;
                      if (formato === 'porcentaje') return `${val}%`;
                      return `${val.toLocaleString()} ${kpi.unidad}`;
                    };

                    const formatoMeta = (meta, formato) => {
                      if (formato === 'moneda') return `$${meta.toLocaleString('es-CO')} COP`;
                      if (formato === 'porcentaje') return `${meta}%`;
                      return `${meta.toLocaleString()} ${kpi.unidad}`;
                    };

                    return (
                      <div
                        key={kpi.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 transition-colors"
                      >
                        <div>
                          <span className="font-bold text-xs text-slate-800 block mb-0.5">
                            {kpi.nombre}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Meta: <strong className="text-slate-700">{formatoMeta(kpi.meta, kpi.formato)}</strong>
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="font-black text-slate-900 text-sm mb-1">
                            {formatoValor(kpi.valor, kpi.formato)}
                          </div>
                          <MetricBadge status={kpi.semaforo} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
};

import React from 'react';
import { Card } from '../../components/Card';
import { Building2, Truck, ShoppingBag, BarChart3, ArrowRight, ShieldCheck } from 'lucide-react';

export const CasoEstudio = () => {
  const porterLinks = [
    {
      link: "Logística de Entrada",
      descripcion: "Recepción de alimentos, control de cadena de frío y radicación de facturas de proveedores.",
      casosAnalitica: "Optimización de stock de seguridad, sensores IoT de temperatura, ETL automático de facturas."
    },
    {
      link: "Operaciones y Almacenamiento",
      descripcion: "Gestión de inventarios en bodegas de Bogotá, Medellín, Cali y Barranquilla.",
      casosAnalitica: "Detección de mermas y atípicos (outliers), minería de procesos de picking, alertas de obsolescencia."
    },
    {
      link: "Logística de Salida",
      descripcion: "Procesamiento de pedidos corporativos, preparación de mercancía y despacho a tiendas.",
      casosAnalitica: "Detección del cuello de botella en aprobación de crédito, simulación de eventos discretos SimPy."
    },
    {
      link: "Marketing y Ventas",
      descripcion: "Venta omnicanal (Tiendas físicas + Canal Online DistriAndina).",
      casosAnalitica: "Segmentación de clientes, análisis de estacionalidad semanal/anual, predicción de demanda."
    },
    {
      link: "Servicio Post-Venta",
      descripcion: "Atención a clientes corporativos, gestión de mora y solicitudes de crédito.",
      casosAnalitica: "Modelo de scoring crediticio, evaluación de impacto dispar (equidad de género) y prevención de mora."
    }
  ];

  const tiposAnalitica = [
    {
      tipo: "Analítica Descriptiva",
      pregunta: "¿Qué sucedió?",
      ejemplo: "Las ventas acumuladas en la tienda Bogotá Norte alcanzaron $124M COP en el mes de mayo.",
      herramientas: "Tableros BI, Cuadro de Mando Integral, Estadísticas resumen (media, moda, totales)."
    },
    {
      tipo: "Analítica Diagnóstica",
      pregunta: "¿Por qué sucedió?",
      ejemplo: "Descubrir mediante EDA que la caída de ventas en Medellín fue causada por un quiebre de stock de 7 días del proveedor X.",
      herramientas: "Drill-down por categoría, matriz de correlaciones, análisis IQR de outliers."
    },
    {
      tipo: "Analítica Predictiva",
      pregunta: "¿Qué sucederá?",
      ejemplo: "Predecir la demanda decembrina estimando un incremento del 60% por estacionalidad anual.",
      herramientas: "Regresión Lineal, Series de Tiempo, Modelos de Scoring de Crédito (Regresión Logística)."
    },
    {
      tipo: "Analítica Prescriptiva",
      pregunta: "¿Qué debemos hacer?",
      ejemplo: "Recomendar la adición de 2 validadores de crédito para reducir el Lead Time de 48h a 12h y aplicar mitigación de sesgo.",
      herramientas: "Simulación de Eventos Discretos (SimPy), Optimización, Reglas de Mitigación de Sesgo."
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="w-8 h-8 text-sky-400" />
          <h2 className="text-2xl font-black tracking-tight">Caso de Estudio: DistriAndina S.A.S.</h2>
        </div>
        <p className="text-slate-300 text-sm max-w-4xl leading-relaxed">
          DistriAndina S.A.S. es una importante distribuidora mayorista colombiana de consumo masivo con presencia en Bogotá, Medellín, Cali y Barranquilla, además de su nuevo canal virtual Online. Comercializa 6 categorías de productos principales a más de 30 clientes corporativos y minoristas.
        </p>
      </div>

      {/* Cadena de Valor de Porter */}
      <Card title="Mapa de Cadena de Valor (Porter) & Casos de Analítica" subtitle="Identificación de casos de uso analíticos por cada eslabón operacional">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-2">
          {porterLinks.map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-sky-400 transition-colors">
              <div>
                <span className="text-[10px] font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded uppercase tracking-wider">
                  Eslabón {idx + 1}
                </span>
                <h4 className="font-bold text-slate-800 text-sm mt-2 mb-1">{item.link}</h4>
                <p className="text-xs text-slate-600 mb-3">{item.descripcion}</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                <strong className="text-sky-800 block mb-0.5">Casos de Analítica:</strong>
                {item.casosAnalitica}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Los 4 Tipos de Analítica Aplicados */}
      <Card title="Los 4 Tipos de Analítica Aplicados al Mismo Problema de Negocio" subtitle="De la descripción pasiva a la acción prescriptiva coordinada">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {tiposAnalitica.map((item, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-sky-600" />
                  {item.tipo}
                </span>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {item.pregunta}
                </span>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-2 italic">
                "{item.ejemplo}"
              </p>
              <div className="text-[11px] text-slate-500">
                <strong>Herramientas:</strong> {item.herramientas}
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};

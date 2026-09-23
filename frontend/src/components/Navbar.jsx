import React from 'react';
import { 
  Home, 
  BarChart2, 
  Table, 
  HelpCircle, 
  Workflow, 
  Sliders, 
  Cpu, 
  CheckSquare, 
  ShieldCheck, 
  Scale, 
  Layers, 
  FileText,
  Trophy, 
  BookOpen 
} from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const modulos = [
    {
      titulo: 'M1: Fundamentos',
      items: [
        { id: 'caso', label: 'Caso DistriAndina', icon: Home },
        { id: 'generador', label: 'Generador Datos', icon: Table },
        { id: 'eda', label: 'Explorador EDA', icon: BarChart2 },
        { id: 'dikw', label: 'Quiz DIKW', icon: HelpCircle },
      ]
    },
    {
      titulo: 'M2: BI & Decisiones',
      items: [
        { id: 'etl', label: 'Laboratorio ETL', icon: Workflow },
        { id: 'cmi', label: 'KPIs & CMI', icon: CheckSquare },
      ]
    },
    {
      titulo: 'M3: Automatización',
      items: [
        { id: 'process_mining', label: 'Process Mining', icon: Workflow },
        { id: 'simulacion', label: 'Simulación SimPy', icon: Sliders },
        { id: 'hiperautomatizacion', label: 'Hiperautomatización', icon: Cpu },
      ]
    },
    {
      titulo: 'M4: Gobierno & Arquitectura',
      items: [
        { id: 'calidad', label: 'Gobierno & Calidad', icon: ShieldCheck },
        { id: 'etica', label: 'Ética & Sesgo IA', icon: Scale },
        { id: 'arquitectura', label: 'Medallion & RAG', icon: Layers },
        { id: 'plan', label: 'Plan Estratégico', icon: FileText },
      ]
    },
    {
      titulo: 'Evaluación & Glosario',
      items: [
        { id: 'retos', label: 'Retos (8 Ejercicios)', icon: Trophy, destacado: true },
        { id: 'glosario', label: 'Glosario', icon: BookOpen },
      ]
    }
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700 text-slate-300 text-xs shadow-md sticky top-[61px] z-40 py-2">
      <div className="max-w-7xl mx-auto px-4 space-y-2">
        
        {/* Module Groups Multi-line Flex Container */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {modulos.map((mod, mIdx) => (
            <div key={mIdx} className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-700/60">
              <span className="text-[10px] font-extrabold text-sky-400 px-1.5 uppercase tracking-wider border-r border-slate-700 pr-2">
                {mod.titulo}
              </span>
              
              <div className="flex items-center gap-1">
                {mod.items.map((item) => {
                  const Icon = item.icon;
                  const active = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-all whitespace-nowrap ${
                        active
                          ? 'bg-sky-600 text-white shadow-sm font-bold scale-105'
                          : item.destacado
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </nav>
  );
};

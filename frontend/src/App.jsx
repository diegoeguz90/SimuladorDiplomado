import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';

// Imports de Páginas M1
import { CasoEstudio } from './pages/M1_Fundamentos/CasoEstudio';
import { GeneradorDatos } from './pages/M1_Fundamentos/GeneradorDatos';
import { ExploradorEDA } from './pages/M1_Fundamentos/ExploradorEDA';
import { QuizDIKW } from './pages/M1_Fundamentos/QuizDIKW';

// Imports de Páginas M2
import { LaboratorioETL } from './pages/M2_BI_Decisiones/LaboratorioETL';
import { KPIs_CMI } from './pages/M2_BI_Decisiones/KPIs_CMI';

// Imports de Páginas M3
import { ProcessMiningLab } from './pages/M3_Automatizacion_RPA/ProcessMiningLab';
import { SimulacionProcesos } from './pages/M3_Automatizacion_RPA/SimulacionProcesos';
import { Hiperautomatizacion } from './pages/M3_Automatizacion_RPA/Hiperautomatizacion';

// Imports de Páginas M4
import { GobiernoCalidad } from './pages/M4_Gobierno_Arquitectura/GobiernoCalidad';
import { EticaSesgo } from './pages/M4_Gobierno_Arquitectura/EticaSesgo';
import { ArquitecturaRAG } from './pages/M4_Gobierno_Arquitectura/ArquitecturaRAG';
import { PlanEstrategico } from './pages/M4_Gobierno_Arquitectura/PlanEstrategico';

// Imports Transversales
import { Retos } from './pages/Retos';
import { Glosario } from './pages/Glosario';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState('caso');

  const renderContent = () => {
    switch (currentTab) {
      // M1
      case 'caso':
        return <CasoEstudio />;
      case 'generador':
        return <GeneradorDatos />;
      case 'eda':
        return <ExploradorEDA />;
      case 'dikw':
        return <QuizDIKW />;

      // M2
      case 'etl':
        return <LaboratorioETL />;
      case 'cmi':
        return <KPIs_CMI />;

      // M3
      case 'process_mining':
        return <ProcessMiningLab />;
      case 'simulacion':
        return <SimulacionProcesos />;
      case 'hiperautomatizacion':
        return <Hiperautomatizacion />;

      // M4
      case 'calidad':
        return <GobiernoCalidad />;
      case 'etica':
        return <EticaSesgo />;
      case 'arquitectura':
        return <ArquitecturaRAG />;
      case 'plan':
        return <PlanEstrategico />;

      // Transversal
      case 'retos':
        return <Retos />;
      case 'glosario':
        return <Glosario />;

      default:
        return <CasoEstudio />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      <TopBar />
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {renderContent()}
      </main>

      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-4 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DistriAndina Analytics Lab &copy; 2026 — 100% Código Abierto & Local</span>
          <span>Diplomado en Analítica Estratégica & Gobierno de Datos</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

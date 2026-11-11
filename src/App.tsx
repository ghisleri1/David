import React, { useState } from 'react';
import {
  StateId,
  SubRegionId,
  SimulationParameters,
} from './types';
import {
  LANDFILLS_DATA,
  DEFAULT_SIMULATION_PARAMS,
  SCENARIO_PRESETS,
} from './data/landfillData';
import {
  calculateAggregateSimulation,
} from './utils/simulationEngine';
import { Header } from './components/Header';
import { USMapInteractive } from './components/Map/USMapInteractive';
import { StateDetailMap } from './components/Map/StateDetailMap';
import { SimulationControls } from './components/Simulation/SimulationControls';
import { MetricsOverview } from './components/Analytics/MetricsOverview';
import { LandfillDetailDrawer } from './components/Analytics/LandfillDetailDrawer';
import { ExecutiveReportModal } from './components/Presentation/ExecutiveReportModal';
import { ScenarioComparisonModal } from './components/Presentation/ScenarioComparisonModal';
import { BookOpen } from 'lucide-react';

const SLIDE_TALKING_POINTS = [
  {
    slideNumber: 1,
    title: 'Visión General Tri-Estatal',
    points: 'California, Nueva York y Florida concentran el 28% de los residuos sólidos de EE.UU. El 18.5% del volumen enterrado son polímeros plásticos no degradables.',
  },
  {
    slideNumber: 2,
    title: 'California: Mandatos Orgánicos y Biometano',
    points: 'Liderazgo en conversión de gas a combustible vehicular (Altamont produce 13,000 gal/día de GNL). Reto inminente de saturación en San Diego y Los Ángeles.',
  },
  {
    slideNumber: 3,
    title: 'Nueva York: Asimetría y Logística CSX',
    points: 'NYC exporta el 85% de sus residuos hacia Upstate y estados vecinos. Crisis logística en Long Island por el cierre definitivo del vertedero de Brookhaven en 2026.',
  },
  {
    slideNumber: 4,
    title: 'Florida: Acuíferos y Megaparques',
    points: 'Nivel freático superficial sobre el acuífero de Biscayne. Monarch Hill ("Mount Trashmore") produce 40 MW de energía limpia para 40,000 hogares con doble geomembrana.',
  },
  {
    slideNumber: 5,
    title: 'Simulación Estratégica y Retorno ESG',
    points: 'Una captura de metano del 85% y reducción del 25% de plásticos evitan 12M de toneladas de CO₂e y generan $42M en créditos de carbono, extendiendo la vida de los vertederos 7 años.',
  },
];

export default function App() {
  const [selectedStateId, setSelectedStateId] = useState<StateId | null>(null);
  const [selectedSubRegionId, setSelectedSubRegionId] = useState<SubRegionId | null>(null);
  const [selectedLandfillId, setSelectedLandfillId] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState<boolean>(false);

  const [simulationParams, setSimulationParams] = useState<SimulationParameters>({
    ...DEFAULT_SIMULATION_PARAMS,
    targetYear: 2030,
    biogasCaptureEfficiency: 82,
    plasticReductionPct: -20,
    diversionRatePct: 45,
  });

  const [activeScenarioId, setActiveScenarioId] = useState<string>('plan-esg-2030');
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);

  // Active facilities
  const activeFacilities = selectedLandfillId
    ? LANDFILLS_DATA.filter((f) => f.id === selectedLandfillId)
    : selectedStateId
    ? LANDFILLS_DATA.filter(
        (f) =>
          f.stateId === selectedStateId &&
          (!selectedSubRegionId || f.subRegionId === selectedSubRegionId)
      )
    : LANDFILLS_DATA;

  // Real-time calculations
  const currentMetrics = calculateAggregateSimulation(activeFacilities, simulationParams);
  const baselineMetrics = calculateAggregateSimulation(activeFacilities, {
    targetYear: 2024,
    biogasCaptureEfficiency: 68,
    plasticReductionPct: 0,
    diversionRatePct: 35,
    consumptionPerCapitaDelta: 0,
  });

  const selectedFacilityObj = selectedLandfillId
    ? LANDFILLS_DATA.find((f) => f.id === selectedLandfillId) || null
    : null;

  // Scenario Presets handler
  const handleSelectScenario = (scenarioId: string) => {
    const preset = SCENARIO_PRESETS.find((s) => s.id === scenarioId);
    if (preset) {
      setActiveScenarioId(preset.id);
      setSimulationParams(preset.params);
    }
  };

  const handleParamsChange = (newParams: SimulationParameters) => {
    setSimulationParams(newParams);
    const matchedPreset = SCENARIO_PRESETS.find(
      (s) => JSON.stringify(s.params) === JSON.stringify(newParams)
    );
    setActiveScenarioId(matchedPreset ? matchedPreset.id : 'custom');
  };

  const handleChangeSlide = (slide: number) => {
    setCurrentSlide(slide);
    setSelectedLandfillId(null);
    setSelectedSubRegionId(null);

    if (slide === 1) setSelectedStateId(null);
    else if (slide === 2) setSelectedStateId('CA');
    else if (slide === 3) setSelectedStateId('NY');
    else if (slide === 4) setSelectedStateId('FL');
  };

  const handleSelectState = (stateId: StateId | null) => {
    setSelectedStateId(stateId);
    setSelectedSubRegionId(null);
    setSelectedLandfillId(null);

    if (stateId === 'CA') setCurrentSlide(2);
    else if (stateId === 'NY') setCurrentSlide(3);
    else if (stateId === 'FL') setCurrentSlide(4);
    else setCurrentSlide(1);
  };

  const activeScenarioTitle =
    SCENARIO_PRESETS.find((s) => s.id === activeScenarioId)?.title ||
    'Configuración Personalizada';

  const currentNotes = SLIDE_TALKING_POINTS.find((p) => p.slideNumber === currentSlide) || SLIDE_TALKING_POINTS[0];

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-[#090c12] text-slate-100 flex flex-col justify-between font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 1. Compact Header (Tesla Titanium Style) */}
      <Header
        selectedStateId={selectedStateId}
        onSelectState={handleSelectState}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onToggleNotes={() => setShowNotes(!showNotes)}
        showNotes={showNotes}
        currentSlide={currentSlide}
        totalSlides={5}
        onChangeSlide={handleChangeSlide}
        activeScenarioTitle={activeScenarioTitle}
      />

      {/* Slide Speaker Notes Dropdown Banner (Tesla Minimalist) */}
      {showNotes && (
        <div className="bg-[#0e1420] border-b border-emerald-500/30 px-5 py-2 text-xs text-slate-300 flex items-center justify-between gap-4 shrink-0 shadow-md animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold text-white font-mono">{currentNotes.title}:</span>
            <span className="text-slate-300">{currentNotes.points}</span>
          </div>
          <button
            onClick={() => setShowNotes(false)}
            className="text-slate-400 hover:text-white font-bold ml-2 shrink-0 text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* 2. Main Center Body: Zero-Scroll Viewport */}
      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col justify-between gap-2 overflow-hidden">
        {/* Top: Compact Tesla Metallic KPI Cards */}
        <MetricsOverview
          metrics={currentMetrics}
          baselineMetrics={baselineMetrics}
          selectedStateId={selectedStateId}
          selectedLandfill={selectedFacilityObj}
        />

        {/* Center: Interactive Map Workspace */}
        <div className="flex-1 min-h-0 w-full flex flex-col justify-center overflow-hidden">
          {selectedStateId === null ? (
            <USMapInteractive
              selectedStateId={selectedStateId}
              onSelectState={handleSelectState}
              simulationParams={simulationParams}
            />
          ) : (
            <StateDetailMap
              stateId={selectedStateId}
              selectedSubRegionId={selectedSubRegionId}
              selectedLandfillId={selectedLandfillId}
              onSelectSubRegion={setSelectedSubRegionId}
              onSelectLandfill={(id) => setSelectedLandfillId(id)}
              onBackToUS={() => handleSelectState(null)}
              simulationParams={simulationParams}
            />
          )}
        </div>
      </main>

      {/* 3. Docked Bottom Tesla Simulation Deck (Always visible without scrolling!) */}
      <SimulationControls
        params={simulationParams}
        onChangeParams={handleParamsChange}
        activeScenarioId={activeScenarioId}
        onSelectScenario={handleSelectScenario}
      />

      {/* Modals & Slide-over Drawer */}
      <LandfillDetailDrawer
        facility={selectedFacilityObj}
        onClose={() => setSelectedLandfillId(null)}
        simulationParams={simulationParams}
      />

      <ExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        simulationParams={simulationParams}
        simulatedMetrics={currentMetrics}
        baselineMetrics={baselineMetrics}
        selectedStateId={selectedStateId}
        activeScenarioTitle={activeScenarioTitle}
      />

      <ScenarioComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        baselineMetrics={baselineMetrics}
        simulatedMetrics={currentMetrics}
        simulationParams={simulationParams}
        activeScenarioTitle={activeScenarioTitle}
      />
    </div>
  );
}

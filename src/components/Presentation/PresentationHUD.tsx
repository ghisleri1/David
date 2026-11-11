import React, { useState } from 'react';
import { StateId, SimulationParameters, SimulationResult } from '../../types';
import {
  Maximize2,
  Minimize2,
  FileText,
  GitCompare,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Presentation,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface PresentationHUDProps {
  currentSlide: number;
  totalSlides: number;
  onChangeSlide: (slide: number) => void;
  onOpenReport: () => void;
  onOpenComparison: () => void;
  selectedStateId: StateId | null;
  activeScenarioTitle: string;
}

const SLIDE_TALKING_POINTS = [
  {
    slideNumber: 1,
    title: 'Visión General Tri-Estatal (CA, NY, FL)',
    subtitle: 'El 28% de los residuos sólidos de EE.UU. concentrados en 3 estados',
    executivePoints: [
      'California, Nueva York y Florida generan conjuntamente más de 91 millones de toneladas anuales de residuos sólidos urbanos.',
      'Representan tres modelos regulatorios divergentes: California apuesta por mandatos orgánicos (SB 1383), Nueva York por transporte intermodal masivo, y Florida por plantas de energía renovable a pie de celda.',
      'La variable plásticos es transversal: entre el 16% y el 22% del peso seco enterrado corresponde a polímeros no biodegradables.',
    ],
  },
  {
    slideNumber: 2,
    title: 'California: Desvío Orgánico y Reto en el Sur',
    subtitle: 'Liderazgo en Gas Renovable (RNG) con saturación urbana',
    executivePoints: [
      'Puente Hills (LA) clausurado en 2013 genera 50 MW constantes y demuestra la rentabilidad del gas de vertedero a 40 años vista.',
      'Altamont (Área de la Bahía) produce 13,000 galones diarios de GNL renovable para flotas pesadas de camiones.',
      'El sur de California enfrenta una saturación inminente en Scholl Canyon y Otay Landfill (San Diego) con menos de 4 años de vida útil autorizada.',
    ],
  },
  {
    slideNumber: 3,
    title: 'Nueva York: Asimetría Territorial y Logística CSX',
    subtitle: 'Nueva York Metropolitana exporta el 85% de su basura hacia Upstate',
    executivePoints: [
      'El legado histórico de Fresh Kills (Staten Island) requirió $1.2B en impermeabilización y hoy genera energía limpia para 22,000 residencias.',
      'Seneca Meadows en Finger Lakes recibe 2.45M de toneladas anuales: su permiso de ampliación está condicionado por normativas de PFAS y microplásticos.',
      'Crisis en Long Island: el vertedero de Brookhaven cerrará en 2026, obligando a transportar 350,000 toneladas de cenizas a través del estuario.',
    ],
  },
  {
    slideNumber: 4,
    title: 'Florida: Acuíferos Vulnerables y Megaparques',
    subtitle: 'Riesgo hidrogeológico extremo en el acuífero de Biscayne',
    executivePoints: [
      'La cota freática superficial prohíbe excavaciones profundas: los vertederos crecen en vertical ("Mount Trashmore" en Monarch Hill tiene 68 metros de elevación).',
      'Monarch Hill suministra energía continua a 40,000 hogares y opera un sistema de contención impermeable de doble geomembrana reforzada.',
      'El cierre del vertedero Medley en Miami-Dade proyectado para 2029 forzará el envío de convoyes ferroviarios hacia Okeechobee.',
    ],
  },
  {
    slideNumber: 5,
    title: 'Simulación Estratégica y Retorno ESG',
    subtitle: 'Impacto económico de las inversiones en biogás y políticas circulares',
    executivePoints: [
      'Elevar la captura de metano del 70% al 90% evita más de 12 millones de toneladas de CO2e y genera hasta $42M en créditos de carbono comerciables.',
      'Una reducción del 30% en plásticos descartables previene la colmatación prematura de celdas y extiende la vida útil de los vertederos entre 5 y 8 años.',
      'El modelo interactivo permite evaluar el ROI antes de comprometer gasto de capital (CapEx) en plantas de valorización energética.',
    ],
  },
];

export const PresentationHUD: React.FC<PresentationHUDProps> = ({
  currentSlide,
  totalSlides,
  onChangeSlide,
  onOpenReport,
  onOpenComparison,
  selectedStateId,
  activeScenarioTitle,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const currentNotes = SLIDE_TALKING_POINTS.find((p) => p.slideNumber === currentSlide) || SLIDE_TALKING_POINTS[0];

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Top HUD Controller Bar */}
      <div className="w-full bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        {/* Left: Presentation Mode indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-emerald-400 text-xs font-semibold">
            <Presentation className="w-3.5 h-3.5" />
            <span>Modo Presentación Ejecutiva</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
            <span>Escenario Activo:</span>
            <span className="font-semibold text-white bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">
              {activeScenarioTitle}
            </span>
          </div>
        </div>

        {/* Center: Slide Navigator */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onChangeSlide(Math.max(1, currentSlide - 1))}
            disabled={currentSlide === 1}
            className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono text-slate-300 font-semibold px-2">
            Diapositiva <span className="text-emerald-400">{currentSlide}</span> / {totalSlides}
          </span>

          <button
            onClick={() => onChangeSlide(Math.min(totalSlides, currentSlide + 1))}
            disabled={currentSlide === totalSlides}
            className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Action Buttons (Speaker Notes, Compare, Export, Fullscreen) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              showNotes
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notas para el Consejo</span>
          </button>

          <button
            onClick={onOpenComparison}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Comparar escenario simulado vs línea base 2024"
          >
            <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Comparador</span>
          </button>

          <button
            onClick={onOpenReport}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-950/40"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Informe Ejecutivo</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa para proyector'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide Speaker Notes Drawer (Expandable) */}
      {showNotes && (
        <div className="w-full bg-slate-950/95 border border-emerald-500/30 rounded-xl p-4 text-xs shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-emerald-400">
                Puntos de Discusión Ejecutiva: {currentNotes.title}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{currentNotes.subtitle}</span>
            </div>
            <button
              onClick={() => setShowNotes(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Cerrar Notas ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentNotes.executivePoints.map((point, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-900/80 border border-slate-800/90 rounded-lg flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

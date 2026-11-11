import React from 'react';
import { StateId } from '../types';
import {
  FileText,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  selectedStateId: StateId | null;
  onSelectState: (stateId: StateId | null) => void;
  onOpenReport: () => void;
  onOpenComparison: () => void;
  onToggleNotes: () => void;
  showNotes: boolean;
  currentSlide: number;
  totalSlides: number;
  onChangeSlide: (slide: number) => void;
  activeScenarioTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  selectedStateId,
  onSelectState,
  onOpenReport,
  onOpenComparison,
  onToggleNotes,
  showNotes,
  currentSlide,
  totalSlides,
  onChangeSlide,
  activeScenarioTitle,
}) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="h-14 px-5 border-b border-white/10 bg-[#0a0d14]/95 backdrop-blur-md flex items-center justify-between gap-4 shrink-0 z-30 shadow-md">
      {/* Zone 1: Tesla style wordmark + Quick State Selector */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onSelectState(null)}
          className="text-base font-extrabold tracking-tight text-white hover:text-emerald-400 transition-colors flex items-center gap-2.5 group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] group-hover:scale-110 transition-transform" />
          <span className="tracking-wider uppercase text-xs font-mono font-bold text-slate-300">
            EcoStrat <span className="text-white font-sans text-sm font-extrabold">US</span>
          </span>
        </button>

        {/* State Quick Switcher Pills in Brushed Gunmetal */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 border border-white/5 p-1 rounded-lg text-xs ml-3">
          <button
            onClick={() => onSelectState(null)}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              selectedStateId === null
                ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-xs border border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            EE.UU.
          </button>
          <button
            onClick={() => onSelectState('CA')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              selectedStateId === 'CA'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            California
          </button>
          <button
            onClick={() => onSelectState('NY')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              selectedStateId === 'NY'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-[0_0_10px_rgba(20,184,166,0.2)] font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Nueva York
          </button>
          <button
            onClick={() => onSelectState('FL')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              selectedStateId === 'FL'
                ? 'bg-green-500/20 text-green-300 border border-green-500/40 shadow-[0_0_10px_rgba(34,197,94,0.2)] font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Florida
          </button>
        </div>
      </div>

      {/* Zone 2: Slide Stepper & Scenario Badge */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 bg-slate-900/80 border border-white/5 px-2.5 py-1 rounded-lg text-xs text-slate-300">
          <span className="text-slate-500 font-medium">Escenario:</span>
          <span className="font-semibold text-emerald-400 truncate max-w-[150px]">
            {activeScenarioTitle.split(' ')[0]} {activeScenarioTitle.split(' ')[1] || ''}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 border border-white/5 px-2 py-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => onChangeSlide(Math.max(1, currentSlide - 1))}
            disabled={currentSlide === 1}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-25"
            title="Diapositiva anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-slate-300 px-1 text-xs">
            Paso <strong className="text-emerald-400 font-bold">{currentSlide}</strong>/5
          </span>
          <button
            onClick={() => onChangeSlide(Math.min(totalSlides, currentSlide + 1))}
            disabled={currentSlide === totalSlides}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-25"
            title="Siguiente diapositiva"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Zone 3: Actions (Puntos Clave, Comparador, Informe, Fullscreen) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleNotes}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
            showNotes
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              : 'text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-white/10'
          }`}
          title="Ver puntos clave para la Junta Directiva"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Puntos Clave</span>
        </button>

        <button
          onClick={onOpenComparison}
          className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-white/10 transition-colors flex items-center gap-1.5"
          title="Comparar antes vs después"
        >
          <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Comparador</span>
        </button>

        <button
          onClick={onOpenReport}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-400/30"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Informe</span>
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-900/90 hover:bg-slate-800 rounded-lg transition-colors border border-white/10"
          title="Pantalla Completa (F11)"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};

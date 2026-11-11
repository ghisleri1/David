import React, { useEffect, useState } from 'react';
import { SimulationParameters } from '../../types';
import { SCENARIO_PRESETS, DEFAULT_SIMULATION_PARAMS } from '../../data/landfillData';
import {
  Play,
  Pause,
  RotateCcw,
  Calendar,
  Flame,
  Recycle,
  Package,
} from 'lucide-react';

interface SimulationControlsProps {
  params: SimulationParameters;
  onChangeParams: (newParams: SimulationParameters) => void;
  activeScenarioId: string | null;
  onSelectScenario: (scenarioId: string) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  params,
  onChangeParams,
  activeScenarioId,
  onSelectScenario,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onChangeParams({
          ...params,
          targetYear: params.targetYear >= 2045 ? 2024 : params.targetYear + 1,
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, params, onChangeParams]);

  const handleReset = () => {
    setIsPlaying(false);
    onChangeParams(DEFAULT_SIMULATION_PARAMS);
  };

  const handleParamChange = (key: keyof SimulationParameters, value: number) => {
    onChangeParams({
      ...params,
      [key]: value,
    });
  };

  return (
    <div className="w-full bg-[#0a0d14]/95 border-t border-white/10 py-2.5 px-4 sm:px-6 shadow-2xl shrink-0 z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Sliders Grid: 4 Tesla Metallic Telemetry Sliders */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1 w-full">
          {/* Slider 1: Año con Play/Pause */}
          <div className="flex flex-col justify-center bg-[#121722]/90 border border-white/10 rounded-xl px-3 py-1.5 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Año
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-sm text-white tabular-nums">
                  {params.targetYear}
                </span>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-0.5 ${
                    isPlaying
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                  }`}
                  title={isPlaying ? 'Pausar' : 'Avanzar años automáticamente'}
                >
                  {isPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 fill-current" />}
                  <span>{isPlaying ? 'Pausa' : 'Auto'}</span>
                </button>
              </div>
            </div>
            <input
              type="range"
              min={2024}
              max={2045}
              step={1}
              value={params.targetYear}
              onChange={(e) => handleParamChange('targetYear', parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 2: Captura de Biogás */}
          <div className="flex flex-col justify-center bg-[#121722]/90 border border-white/10 rounded-xl px-3 py-1.5 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                Captura Biogás
              </span>
              <span className="font-mono font-bold text-sm text-emerald-400 tabular-nums">
                {params.biogasCaptureEfficiency}%
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={95}
              step={1}
              value={params.biogasCaptureEfficiency}
              onChange={(e) => handleParamChange('biogasCaptureEfficiency', parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 3: Reducción de Plásticos */}
          <div className="flex flex-col justify-center bg-[#121722]/90 border border-white/10 rounded-xl px-3 py-1.5 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                Plásticos
              </span>
              <span
                className={`font-mono font-bold text-sm tabular-nums ${
                  params.plasticReductionPct < 0
                    ? 'text-emerald-400'
                    : params.plasticReductionPct === 0
                    ? 'text-slate-300'
                    : 'text-amber-400'
                }`}
              >
                {params.plasticReductionPct > 0 ? `+${params.plasticReductionPct}%` : `${params.plasticReductionPct}%`}
              </span>
            </div>
            <input
              type="range"
              min={-60}
              max={30}
              step={5}
              value={params.plasticReductionPct}
              onChange={(e) => handleParamChange('plasticReductionPct', parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 4: Desvío / Compostaje */}
          <div className="flex flex-col justify-center bg-[#121722]/90 border border-white/10 rounded-xl px-3 py-1.5 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <Recycle className="w-3.5 h-3.5 text-teal-400" />
                Desvío / Compost
              </span>
              <span className="font-mono font-bold text-sm text-teal-300 tabular-nums">
                {params.diversionRatePct}%
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={75}
              step={1}
              value={params.diversionRatePct}
              onChange={(e) => handleParamChange('diversionRatePct', parseInt(e.target.value, 10))}
              className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right side: Quick Scenario Presets + Reset Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="hidden xl:flex items-center gap-1 bg-slate-900/90 border border-white/5 p-1 rounded-lg text-xs">
            {SCENARIO_PRESETS.map((scenario) => {
              const isActive = activeScenarioId === scenario.id;
              return (
                <button
                  key={scenario.id}
                  onClick={() => onSelectScenario(scenario.id)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold shadow-[0_0_10px_rgba(16,185,129,0.3)] border border-emerald-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={scenario.description}
                >
                  {scenario.title.split(' ')[0]} {scenario.title.split(' ')[1] || ''}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-white/10"
            title="Restablecer valores iniciales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

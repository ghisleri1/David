import React from 'react';
import { SimulationParameters, SimulationResult } from '../../types';
import {
  X,
  GitCompare,
  TrendingDown,
  TrendingUp,
  Flame,
  Package,
  Zap,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';

interface ScenarioComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  baselineMetrics: SimulationResult;
  simulatedMetrics: SimulationResult;
  simulationParams: SimulationParameters;
  activeScenarioTitle: string;
}

export const ScenarioComparisonModal: React.FC<ScenarioComparisonModalProps> = ({
  isOpen,
  onClose,
  baselineMetrics,
  simulatedMetrics,
  simulationParams,
}) => {
  if (!isOpen) return null;

  const comparisons = [
    {
      metric: 'Emisiones Netas CO₂e',
      unit: 'ton/año',
      icon: Flame,
      baseline: baselineMetrics.netEmissionsTonCO2e,
      simulated: simulatedMetrics.netEmissionsTonCO2e,
      isBetterWhenLower: true,
      formatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
    },
    {
      metric: 'Emisiones Evitadas con Biogás',
      unit: 'ton/año',
      icon: Zap,
      baseline: baselineMetrics.avoidedEmissionsTonCO2e,
      simulated: simulatedMetrics.avoidedEmissionsTonCO2e,
      isBetterWhenLower: false,
      formatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
    },
    {
      metric: 'Plásticos en Vertedero',
      unit: 'ton/año',
      icon: Package,
      baseline: baselineMetrics.projectedPlasticTons,
      simulated: simulatedMetrics.projectedPlasticTons,
      isBetterWhenLower: true,
      formatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
    },
    {
      metric: 'Electricidad Renovable Biogás',
      unit: 'MWh/año',
      icon: Zap,
      baseline: baselineMetrics.energyGeneratedMWh,
      simulated: simulatedMetrics.energyGeneratedMWh,
      isBetterWhenLower: false,
      formatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
    },
    {
      metric: 'Valor Créditos de Carbono',
      unit: 'USD/año',
      icon: DollarSign,
      baseline: baselineMetrics.carbonCreditsValueUSD,
      simulated: simulatedMetrics.carbonCreditsValueUSD,
      isBetterWhenLower: false,
      formatter: (v: number) => `$${(v / 1000000).toFixed(1)}M`,
    },
    {
      metric: 'Capacidad Libre Remanente',
      unit: '% volumen',
      icon: ShieldCheck,
      baseline: baselineMetrics.remainingCapacityPct,
      simulated: simulatedMetrics.remainingCapacityPct,
      isBetterWhenLower: false,
      formatter: (v: number) => `${v.toFixed(1)}%`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150 text-slate-100">
      <div className="bg-[#0c1017] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3 bg-[#0a0d14]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Comparador: Línea Base 2024 vs Simulación
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Impacto diferencial para el año <strong className="text-emerald-400">{simulationParams.targetYear}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase text-[10px] font-mono">
                <th className="py-2.5 px-3">Variable</th>
                <th className="py-2.5 px-3 text-right">Base 2024</th>
                <th className="py-2.5 px-3 text-right text-emerald-400">Simulado ({simulationParams.targetYear})</th>
                <th className="py-2.5 px-3 text-right">Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {comparisons.map((row, idx) => {
                const Icon = row.icon;
                const delta = row.simulated - row.baseline;
                const deltaPct = row.baseline !== 0 ? (delta / Math.abs(row.baseline)) * 100 : 0;
                const isPositiveImpact = row.isBetterWhenLower ? delta < 0 : delta > 0;

                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 font-sans font-medium text-slate-200 flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <span>{row.metric}</span>
                        <span className="block text-[10px] text-slate-500 font-normal font-mono">
                          {row.unit}
                        </span>
                      </div>
                    </td>

                    <td className="py-2 px-3 text-right text-slate-400 tabular-nums">
                      {row.formatter(row.baseline)}
                    </td>

                    <td className="py-2 px-3 text-right font-bold text-white tabular-nums">
                      {row.formatter(row.simulated)}
                    </td>

                    <td className="py-2 px-3 text-right tabular-nums">
                      <span
                        className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.2 rounded text-[10px] border ${
                          isPositiveImpact
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {isPositiveImpact ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        {delta > 0 ? `+${deltaPct.toFixed(0)}%` : `${deltaPct.toFixed(0)}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-[#0a0d14] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg text-xs font-semibold shadow-md"
          >
            Cerrar Comparativa
          </button>
        </div>
      </div>
    </div>
  );
};

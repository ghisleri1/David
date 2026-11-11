import React from 'react';
import { SimulationResult, LandfillFacility, StateId } from '../../types';
import {
  TrendingDown,
  TrendingUp,
  Zap,
  Package,
  Flame,
  ShieldCheck,
} from 'lucide-react';

interface MetricsOverviewProps {
  metrics: SimulationResult;
  baselineMetrics: SimulationResult;
  selectedStateId: StateId | null;
  selectedLandfill: LandfillFacility | null;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  metrics,
  baselineMetrics,
}) => {
  const co2DeltaPct = baselineMetrics.netEmissionsTonCO2e > 0
    ? ((metrics.netEmissionsTonCO2e - baselineMetrics.netEmissionsTonCO2e) / baselineMetrics.netEmissionsTonCO2e) * 100
    : 0;

  const plasticDeltaPct = baselineMetrics.projectedPlasticTons > 0
    ? ((metrics.projectedPlasticTons - baselineMetrics.projectedPlasticTons) / baselineMetrics.projectedPlasticTons) * 100
    : 0;

  return (
    <div className="w-full shrink-0">
      {/* 4 Tesla Metallic Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Emisiones Netas CO2e */}
        <div className="metallic-card rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              Emisiones Netas CO₂e
            </span>
            <span
              className={`font-mono text-[11px] font-semibold flex items-center gap-0.5 px-1.5 py-0.2 rounded border ${
                co2DeltaPct <= 0
                  ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                  : 'text-rose-400 bg-rose-950/60 border-rose-500/30'
              }`}
            >
              {co2DeltaPct <= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              {Math.abs(co2DeltaPct).toFixed(0)}% vs 2024
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-0.5">
            <div className="font-mono text-xl font-bold tracking-tight text-white tabular-nums">
              {(metrics.netEmissionsTonCO2e / 1000).toLocaleString('es-ES', { maximumFractionDigits: 0 })}k
              <span className="text-[11px] font-sans font-normal text-slate-400 ml-1">ton/año</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              -{(metrics.avoidedEmissionsTonCO2e / 1000).toFixed(0)}k evitadas
            </span>
          </div>

          {/* Electric Neon Progress Bar */}
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-2 border border-white/5">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
              style={{
                width: `${Math.min(
                  100,
                  (metrics.capturedMethaneTonCO2e / (metrics.grossMethaneTonCO2e || 1)) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Card 2: Plásticos No Desviados */}
        <div className="metallic-card rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              Plásticos en Vertedero
            </span>
            <span
              className={`font-mono text-[11px] font-semibold flex items-center gap-0.5 px-1.5 py-0.2 rounded border ${
                plasticDeltaPct <= 0
                  ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                  : 'text-amber-400 bg-amber-950/60 border-amber-500/30'
              }`}
            >
              {plasticDeltaPct <= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              {Math.abs(plasticDeltaPct).toFixed(0)}%
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-0.5">
            <div className="font-mono text-xl font-bold tracking-tight text-amber-300 tabular-nums">
              {(metrics.projectedPlasticTons / 1000).toLocaleString('es-ES', { maximumFractionDigits: 0 })}k
              <span className="text-[11px] font-sans font-normal text-slate-400 ml-1">ton/año</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {((metrics.projectedPlasticTons / (metrics.projectedAnnualWasteTons || 1)) * 100).toFixed(1)}% total
            </span>
          </div>

          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-2 border border-white/5">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              style={{
                width: `${Math.min(
                  100,
                  (metrics.projectedPlasticTons / (metrics.projectedAnnualWasteTons || 1)) * 100 * 3.5
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Card 3: Energía Limpia (Biogás) */}
        <div className="metallic-card rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Energía Limpia (Biogás)
            </span>
            <span className="text-[11px] font-mono text-cyan-300 font-semibold bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.2 rounded">
              ${(metrics.carbonCreditsValueUSD / 1000000).toFixed(1)}M USD CO₂
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-0.5">
            <div className="font-mono text-xl font-bold tracking-tight text-white tabular-nums">
              {(metrics.energyGeneratedMWh / 1000).toLocaleString('es-ES', { maximumFractionDigits: 0 })}k
              <span className="text-[11px] font-sans font-normal text-slate-400 ml-1">MWh/año</span>
            </div>
            <span className="text-[11px] text-cyan-300 font-semibold font-mono">
              ~{Math.round(metrics.energyGeneratedMWh / 10.5).toLocaleString('es-ES')} hogares
            </span>
          </div>

          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-2 border border-white/5">
            <div
              className="bg-gradient-to-r from-cyan-500 to-teal-300 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
              style={{
                width: `${Math.min(100, (metrics.energyGeneratedMWh / 500000) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Card 4: Capacidad y Año Crítico */}
        <div className="metallic-card rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              Capacidad Remanente
            </span>
            <span
              className={`font-mono text-[11px] font-semibold px-1.5 py-0.2 rounded border ${
                metrics.remainingCapacityPct < 15
                  ? 'text-rose-400 bg-rose-950/60 border-rose-500/30'
                  : metrics.remainingCapacityPct < 30
                  ? 'text-amber-400 bg-amber-950/60 border-amber-500/30'
                  : 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
              }`}
            >
              Cierre: {metrics.criticalSaturationYear}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-0.5">
            <div
              className={`font-mono text-xl font-bold tracking-tight tabular-nums ${
                metrics.remainingCapacityPct < 15
                  ? 'text-rose-400'
                  : metrics.remainingCapacityPct < 30
                  ? 'text-amber-300'
                  : 'text-white'
              }`}
            >
              {metrics.remainingCapacityPct}%
              <span className="text-[11px] font-sans font-normal text-slate-400 ml-1">volumen libre</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {(metrics.leachateM3Risk / 1000).toFixed(0)}k m³ lixiviados
            </span>
          </div>

          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-2 border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                metrics.remainingCapacityPct < 15
                  ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  : metrics.remainingCapacityPct < 30
                  ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-300 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
              }`}
              style={{ width: `${metrics.remainingCapacityPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { LandfillFacility, SimulationParameters } from '../../types';
import { calculateFacilitySimulation, generateTrajectorySeries } from '../../utils/simulationEngine';
import { FOCUS_STATES } from '../../data/landfillData';
import {
  X,
  Zap,
  Flame,
  Package,
  Droplets,
  AlertTriangle,
} from 'lucide-react';

interface LandfillDetailDrawerProps {
  facility: LandfillFacility | null;
  onClose: () => void;
  simulationParams: SimulationParameters;
}

export const LandfillDetailDrawer: React.FC<LandfillDetailDrawerProps> = ({
  facility,
  onClose,
  simulationParams,
}) => {
  if (!facility) return null;

  const sim = calculateFacilitySimulation(facility, simulationParams);
  const stateData = FOCUS_STATES[facility.stateId];
  const trajectory = generateTrajectorySeries([facility], simulationParams);

  const maxEmissions = Math.max(...trajectory.map((t) => t.netEmissionsTonCO2e), 1000);
  const svgWidth = 460;
  const svgHeight = 130;
  const padding = 20;

  const points = trajectory.map((pt, i) => {
    const x = padding + (i / (trajectory.length - 1)) * (svgWidth - 2 * padding);
    const y = svgHeight - padding - (pt.netEmissionsTonCO2e / maxEmissions) * (svgHeight - 2 * padding);
    return `${x},${y}`;
  });

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#0c1017]/95 border-l border-white/10 shadow-2xl z-50 flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200 text-slate-100">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-start justify-between gap-3 bg-[#0a0d14]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-0.5">
            <span className="font-semibold text-emerald-400 font-mono">{stateData.name}</span>
            <span>·</span>
            <span>{facility.county}</span>
            <span>·</span>
            <span>{facility.nearestCity}</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
            {facility.name}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`px-2.5 py-0.5 font-semibold rounded-md text-[11px] border ${
              facility.status === 'converted_energy_park'
                ? 'bg-sky-950/80 text-sky-300 border-sky-500/40'
                : facility.status === 'nearing_capacity'
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {facility.status === 'converted_energy_park' && 'Parque de Biogás Post-Clausura'}
            {facility.status === 'nearing_capacity' && 'Al Borde de Saturación'}
            {facility.status === 'active' && 'Vertedero Activo'}
          </span>

          {facility.biogasToEnergyPlant && (
            <span className="px-2.5 py-0.5 font-semibold rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              {facility.powerOutputMW} MW
            </span>
          )}

          <span className="px-2 py-0.5 text-slate-400 bg-slate-900 border border-white/5 rounded-md font-mono">
            Desde {facility.openedYear}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-300 leading-relaxed metallic-card p-3 rounded-xl">
          {facility.description}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 metallic-card rounded-xl">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              Plásticos Anuales
            </span>
            <div className="font-mono text-base font-bold text-amber-300 tabular-nums">
              {(sim.projectedPlasticTons / 1000).toFixed(0)}k ton
            </div>
            <span className="text-[10px] text-slate-400">
              {((sim.projectedPlasticTons / (sim.projectedAnnualWasteTons || 1)) * 100).toFixed(1)}% del volumen
            </span>
          </div>

          <div className="p-2.5 metallic-card rounded-xl">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Emisión Neta CO₂e
            </span>
            <div className="font-mono text-base font-bold text-white tabular-nums">
              {(sim.netEmissionsTonCO2e / 1000).toFixed(0)}k ton
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              -{(sim.avoidedEmissionsTonCO2e / 1000).toFixed(0)}k evitadas
            </span>
          </div>

          <div className="p-2.5 metallic-card rounded-xl">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Electricidad Biogás
            </span>
            <div className="font-mono text-base font-bold text-cyan-300 tabular-nums">
              {(sim.energyGeneratedMWh / 1000).toFixed(0)}k MWh
            </div>
            <span className="text-[10px] text-slate-400">
              ~{Math.round(sim.energyGeneratedMWh / 10.5)} hogares
            </span>
          </div>

          <div className="p-2.5 metallic-card rounded-xl">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              Lixiviados Anuales
            </span>
            <div className="font-mono text-base font-bold text-sky-300 tabular-nums">
              {(sim.leachateM3Risk / 1000).toFixed(0)}k m³
            </div>
            <span className="text-[10px] text-slate-400">
              Tratamiento activo
            </span>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="p-3 metallic-card rounded-xl">
          <div className="flex justify-between text-xs mb-1 font-semibold">
            <span className="text-slate-300">Capacidad Remanente:</span>
            <span className="font-mono text-emerald-400">{sim.remainingCapacityPct}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              style={{ width: `${sim.remainingCapacityPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
            <span>Total: {facility.totalCapacityMillionTons}M t</span>
            <span className="font-semibold text-emerald-400">Año Saturación: {sim.criticalSaturationYear}</span>
          </div>
        </div>

        {/* Trajectory Graph */}
        <div className="p-3 metallic-card rounded-xl">
          <div className="flex justify-between text-xs mb-1.5 font-semibold text-slate-300">
            <span>Curva de Emisiones 2024–2045</span>
            <span className="text-[11px] text-emerald-400 font-mono">ton CO₂e/año</span>
          </div>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-24 bg-[#0a0d14] rounded-lg border border-white/10 p-1">
            <polygon
              points={`${padding},${svgHeight - padding} ${points.join(' ')} ${svgWidth - padding},${svgHeight - padding}`}
              fill="rgba(16, 185, 129, 0.2)"
            />
            <polyline fill="none" stroke="#34d399" strokeWidth="2.5" points={points.join(' ')} />
          </svg>
        </div>

        {/* Issues */}
        <div className="space-y-1">
          <span className="font-bold text-white block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Puntos Críticos:
          </span>
          <ul className="space-y-1 text-slate-300 text-[11px]">
            {facility.keyIssues.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">·</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-3 border-t border-white/10 bg-[#0a0d14] flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg font-semibold text-xs shadow-md"
        >
          Cerrar Ficha
        </button>
      </div>
    </div>
  );
};

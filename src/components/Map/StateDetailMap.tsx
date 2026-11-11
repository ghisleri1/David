import React, { useState } from 'react';
import { StateId, SubRegionId, LandfillFacility, SimulationParameters } from '../../types';
import { FOCUS_STATES, LANDFILLS_DATA } from '../../data/landfillData';
import { calculateFacilitySimulation } from '../../utils/simulationEngine';
import { ChevronLeft } from 'lucide-react';

interface StateDetailMapProps {
  stateId: StateId;
  selectedSubRegionId: SubRegionId | null;
  selectedLandfillId: string | null;
  onSelectSubRegion: (subRegionId: SubRegionId | null) => void;
  onSelectLandfill: (landfillId: string) => void;
  onBackToUS: () => void;
  simulationParams: SimulationParameters;
}

export const StateDetailMap: React.FC<StateDetailMapProps> = ({
  stateId,
  selectedSubRegionId,
  selectedLandfillId,
  onSelectSubRegion,
  onSelectLandfill,
  onBackToUS,
  simulationParams,
}) => {
  const stateData = FOCUS_STATES[stateId];
  const [hoveredFacilityId, setHoveredFacilityId] = useState<string | null>(null);

  const allStateFacilities = LANDFILLS_DATA.filter((f) => f.stateId === stateId);
  const filteredFacilities = allStateFacilities.filter((f) => {
    if (selectedSubRegionId && f.subRegionId !== selectedSubRegionId) return false;
    return true;
  });

  const renderStateGraphic = () => {
    if (stateId === 'CA') {
      return (
        <svg viewBox="0 0 500 680" className="w-full h-full max-h-[360px] drop-shadow-2xl">
          <defs>
            <linearGradient id="ca-map-tesla" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#142823" />
              <stop offset="50%" stopColor="#0f221d" />
              <stop offset="100%" stopColor="#0a1915" />
            </linearGradient>
            <filter id="glow-tesla" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* California outline */}
          <path
            d="M 120 40 L 320 40 L 290 220 L 450 420 L 420 540 L 380 640 L 340 640 L 280 580 L 190 490 L 140 410 L 80 270 L 100 130 Z"
            fill="url(#ca-map-tesla)"
            stroke="#10b981"
            strokeWidth="2"
          />

          {/* Subregions */}
          <path
            d="M 120 40 L 320 40 L 290 220 L 200 240 L 100 240 L 80 270 L 100 130 Z"
            fill={selectedSubRegionId === 'CA_NORTH' ? '#059669' : '#047857'}
            fillOpacity={selectedSubRegionId === 'CA_NORTH' ? '0.4' : '0.1'}
            stroke="#34d399"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="cursor-pointer transition-colors hover:fill-emerald-600/30"
            onClick={() => onSelectSubRegion(selectedSubRegionId === 'CA_NORTH' ? null : 'CA_NORTH')}
          />
          <path
            d="M 100 240 L 200 240 L 290 220 L 380 340 L 320 440 L 170 380 L 140 410 Z"
            fill={selectedSubRegionId === 'CA_CENTRAL' ? '#059669' : '#047857'}
            fillOpacity={selectedSubRegionId === 'CA_CENTRAL' ? '0.4' : '0.1'}
            stroke="#34d399"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="cursor-pointer transition-colors hover:fill-emerald-600/30"
            onClick={() => onSelectSubRegion(selectedSubRegionId === 'CA_CENTRAL' ? null : 'CA_CENTRAL')}
          />
          <path
            d="M 170 380 L 320 440 L 450 420 L 420 540 L 380 640 L 340 640 L 280 580 L 190 490 Z"
            fill={selectedSubRegionId === 'CA_SOUTH' ? '#059669' : '#047857'}
            fillOpacity={selectedSubRegionId === 'CA_SOUTH' ? '0.4' : '0.1'}
            stroke="#34d399"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="cursor-pointer transition-colors hover:fill-emerald-600/30"
            onClick={() => onSelectSubRegion(selectedSubRegionId === 'CA_SOUTH' ? null : 'CA_SOUTH')}
          />

          {/* City landmark names */}
          <g className="city-labels opacity-80 pointer-events-none select-none text-[12px] font-semibold fill-slate-300">
            <text x="140" y="275">San Francisco</text>
            <text x="215" y="220">Sacramento</text>
            <text x="250" y="475" className="font-bold fill-white">Los Ángeles</text>
            <text x="295" y="580">San Diego</text>
          </g>

          {/* Facility Pins */}
          {filteredFacilities.map((facility) => {
            const cx = 50 + (facility.coordinates.mapX / 100) * 400;
            const cy = 30 + (facility.coordinates.mapY / 100) * 600;
            const isSelected = selectedLandfillId === facility.id;
            const markerColor =
              facility.status === 'converted_energy_park'
                ? '#38bdf8'
                : facility.status === 'nearing_capacity'
                ? '#fbbf24'
                : '#34d399';

            return (
              <g
                key={facility.id}
                className="cursor-pointer group"
                onClick={() => onSelectLandfill(facility.id)}
                onMouseEnter={() => setHoveredFacilityId(facility.id)}
                onMouseLeave={() => setHoveredFacilityId(null)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? '22' : '13'}
                  fill={markerColor}
                  opacity={isSelected ? '0.35' : '0.2'}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? '9' : '6.5'}
                  fill="#0c1017"
                  stroke={markerColor}
                  strokeWidth="2.5"
                  filter={isSelected ? 'url(#glow-tesla)' : undefined}
                />
                <circle cx={cx} cy={cy} r="3" fill={markerColor} />

                <g transform={`translate(${cx + 10}, ${cy - 8})`}>
                  <rect
                    x="-2"
                    y="-11"
                    width={facility.name.length * 6 + 12}
                    height="18"
                    rx="3"
                    fill="#0d111a"
                    stroke={isSelected ? markerColor : '#334155'}
                    strokeWidth={isSelected ? '1.5' : '0.8'}
                    className="shadow-lg"
                  />
                  <text
                    x="4"
                    y="2"
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize="9.5"
                    fontWeight={isSelected ? '700' : '600'}
                  >
                    {facility.name.split(' ')[0]}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      );
    }

    if (stateId === 'NY') {
      return (
        <svg viewBox="0 0 620 500" className="w-full h-full max-h-[360px] drop-shadow-2xl">
          <defs>
            <linearGradient id="ny-map-tesla" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#132a28" />
              <stop offset="100%" stopColor="#0b1b1a" />
            </linearGradient>
          </defs>

          <path
            d="M 50 190 L 150 130 L 280 100 L 410 40 L 480 30 L 510 190 L 450 230 L 460 340 L 550 380 L 610 435 L 540 465 L 460 405 L 360 380 L 200 380 L 50 290 Z"
            fill="url(#ny-map-tesla)"
            stroke="#14b8a6"
            strokeWidth="2"
          />

          <g className="city-labels opacity-80 pointer-events-none select-none text-[12px] font-semibold fill-slate-300">
            <text x="85" y="240">Búfalo</text>
            <text x="180" y="210">Rochester</text>
            <text x="310" y="230">Syracuse</text>
            <text x="445" y="220">Albany</text>
            <text x="455" y="390" className="font-bold fill-white">NYC</text>
          </g>

          {filteredFacilities.map((facility) => {
            const cx = 40 + (facility.coordinates.mapX / 100) * 540;
            const cy = 20 + (facility.coordinates.mapY / 100) * 440;
            const isSelected = selectedLandfillId === facility.id;
            const markerColor =
              facility.status === 'converted_energy_park'
                ? '#38bdf8'
                : facility.status === 'nearing_capacity'
                ? '#fbbf24'
                : '#2dd4bf';

            return (
              <g
                key={facility.id}
                className="cursor-pointer group"
                onClick={() => onSelectLandfill(facility.id)}
              >
                <circle cx={cx} cy={cy} r={isSelected ? '22' : '13'} fill={markerColor} opacity="0.3" />
                <circle cx={cx} cy={cy} r={isSelected ? '9' : '6.5'} fill="#0c1017" stroke={markerColor} strokeWidth="2.5" />
                <circle cx={cx} cy={cy} r="3" fill={markerColor} />
                <g transform={`translate(${cx + 10}, ${cy - 8})`}>
                  <rect x="-2" y="-11" width={facility.name.length * 6 + 12} height="18" rx="3" fill="#0d111a" stroke={isSelected ? markerColor : '#334155'} strokeWidth="1" className="shadow-lg" />
                  <text x="4" y="2" fill="#f8fafc" fontSize="9.5" fontWeight={isSelected ? '700' : '600'}>
                    {facility.name.split(' ')[0]}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      );
    }

    // Florida
    return (
      <svg viewBox="0 0 540 560" className="w-full h-full max-h-[360px] drop-shadow-2xl">
        <defs>
          <linearGradient id="fl-map-tesla" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#142c1d" />
            <stop offset="100%" stopColor="#0a1a10" />
          </linearGradient>
        </defs>

        <path
          d="M 30 80 L 270 80 L 380 130 L 450 270 L 470 420 L 430 530 L 370 530 L 350 380 L 310 290 L 250 210 L 150 150 L 30 150 Z"
          fill="url(#fl-map-tesla)"
          stroke="#22c55e"
          strokeWidth="2"
        />

        <g className="city-labels opacity-80 pointer-events-none select-none text-[12px] font-semibold fill-slate-300">
          <text x="320" y="125">Jacksonville</text>
          <text x="120" y="110">Tallahassee</text>
          <text x="340" y="240">Orlando</text>
          <text x="290" y="290">Tampa</text>
          <text x="390" y="470" className="font-bold fill-white">Miami</text>
        </g>

        {filteredFacilities.map((facility) => {
          const cx = 30 + (facility.coordinates.mapX / 100) * 450;
          const cy = 20 + (facility.coordinates.mapY / 100) * 500;
          const isSelected = selectedLandfillId === facility.id;
          const markerColor =
            facility.status === 'converted_energy_park'
              ? '#38bdf8'
              : facility.status === 'nearing_capacity'
              ? '#fbbf24'
              : '#4ade80';

          return (
            <g
              key={facility.id}
              className="cursor-pointer group"
              onClick={() => onSelectLandfill(facility.id)}
            >
              <circle cx={cx} cy={cy} r={isSelected ? '22' : '13'} fill={markerColor} opacity="0.3" />
              <circle cx={cx} cy={cy} r={isSelected ? '9' : '6.5'} fill="#0c1017" stroke={markerColor} strokeWidth="2.5" />
              <circle cx={cx} cy={cy} r="3" fill={markerColor} />
              <g transform={`translate(${cx + 10}, ${cy - 8})`}>
                <rect x="-2" y="-11" width={facility.name.length * 6 + 12} height="18" rx="3" fill="#0d111a" stroke={isSelected ? markerColor : '#334155'} strokeWidth="1" className="shadow-lg" />
                <text x="4" y="2" fill="#f8fafc" fontSize="9.5" fontWeight={isSelected ? '700' : '600'}>
                  {facility.name.split(' ')[0]}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="w-full flex flex-col justify-between h-full gap-2">
      {/* Top ribbon: Back button + subregions tabs in brushed gunmetal */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#0d111a]/90 border border-white/10 rounded-xl shadow-md shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onBackToUS}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md font-semibold transition-colors border border-white/5"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-400" />
            <span>Volver a EE.UU.</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="font-bold text-white font-mono">{stateData.name}</span>
        </div>

        {/* Subregion tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg text-xs border border-white/5">
          <button
            onClick={() => onSelectSubRegion(null)}
            className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
              selectedSubRegionId === null
                ? 'bg-slate-700 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todo
          </button>
          {stateData.subRegions.map((region) => (
            <button
              key={region.id}
              onClick={() => onSelectSubRegion(region.id)}
              className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                selectedSubRegionId === region.id
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {region.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive State Map (Left) + Vertederos List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left: Map */}
        <div className="lg:col-span-7 bg-[#0c1017]/90 rounded-xl border border-white/10 p-3 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          {renderStateGraphic()}
        </div>

        {/* Right: Compact Landfill Facilities list in metallic cards */}
        <div className="lg:col-span-5 flex flex-col gap-2 overflow-y-auto pr-1 max-h-[380px]">
          {filteredFacilities.map((facility) => {
            const isSelected = selectedLandfillId === facility.id;
            const sim = calculateFacilitySimulation(facility, simulationParams);

            return (
              <div
                key={facility.id}
                onClick={() => onSelectLandfill(facility.id)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500'
                    : 'metallic-card hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        facility.status === 'converted_energy_park'
                          ? 'bg-sky-400'
                          : facility.status === 'nearing_capacity'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <h4 className="font-bold text-xs text-white truncate max-w-[200px]">
                      {facility.name}
                    </h4>
                  </div>
                  {facility.biogasToEnergyPlant && (
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.2 rounded font-semibold">
                      {facility.powerOutputMW} MW
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>{(sim.projectedAnnualWasteTons / 1000).toFixed(0)}k t/año</span>
                  <span className="text-amber-300 font-semibold">{(sim.projectedPlasticTons / 1000).toFixed(0)}k t plástico</span>
                  <span className="text-emerald-400 font-semibold">{sim.remainingCapacityPct}% libre</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

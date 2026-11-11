import React, { useState } from 'react';
import { StateId, SimulationParameters } from '../../types';
import { FOCUS_STATES, LANDFILLS_DATA } from '../../data/landfillData';
import { calculateAggregateSimulation } from '../../utils/simulationEngine';
import { ArrowRight } from 'lucide-react';

interface USMapInteractiveProps {
  selectedStateId: StateId | null;
  onSelectState: (stateId: StateId) => void;
  simulationParams: SimulationParameters;
}

const US_STATES_PATHS: Record<string, { path: string; name: string; center: [number, number] }> = {
  CA: {
    name: 'California',
    center: [80, 240],
    path: 'M 40,110 L 85,120 L 75,200 L 125,290 L 115,350 L 95,360 L 75,320 L 50,270 L 35,220 L 30,170 Z',
  },
  NY: {
    name: 'Nueva York',
    center: [750, 140],
    path: 'M 710,120 L 745,100 L 775,85 L 785,130 L 760,150 L 765,190 L 800,205 L 815,220 L 795,225 L 760,200 L 725,185 L 710,165 Z',
  },
  FL: {
    name: 'Florida',
    center: [720, 360],
    path: 'M 670,335 L 730,330 L 745,350 L 760,400 L 755,450 L 740,465 L 725,430 L 710,380 L 675,360 Z',
  },
  WA: { name: 'Washington', center: [65, 50], path: 'M 45,30 L 105,38 L 100,85 L 45,75 Z' },
  OR: { name: 'Oregon', center: [60, 95], path: 'M 45,75 L 100,85 L 95,145 L 35,130 Z' },
  NV: { name: 'Nevada', center: [105, 175], path: 'M 85,120 L 140,130 L 125,245 L 75,200 Z' },
  ID: { name: 'Idaho', center: [130, 85], path: 'M 105,38 L 135,42 L 150,110 L 125,150 L 100,85 Z' },
  MT: { name: 'Montana', center: [205, 65], path: 'M 135,42 L 285,55 L 275,125 L 150,110 Z' },
  WY: { name: 'Wyoming', center: [215, 140], path: 'M 150,110 L 275,125 L 265,185 L 145,170 Z' },
  UT: { name: 'Utah', center: [160, 205], path: 'M 140,130 L 195,135 L 190,225 L 135,220 Z' },
  AZ: { name: 'Arizona', center: [155, 290], path: 'M 135,220 L 210,225 L 200,335 L 125,290 Z' },
  NM: { name: 'Nuevo México', center: [245, 285], path: 'M 210,225 L 295,230 L 285,340 L 200,335 Z' },
  CO: { name: 'Colorado', center: [235, 205], path: 'M 195,135 L 285,145 L 280,225 L 190,225 Z' },
  ND: { name: 'Dakota del Norte', center: [340, 65], path: 'M 285,55 L 395,65 L 390,120 L 275,125 Z' },
  SD: { name: 'Dakota del Sur', center: [340, 130], path: 'M 275,125 L 390,120 L 385,175 L 265,185 Z' },
  NE: { name: 'Nebraska', center: [340, 185], path: 'M 265,185 L 385,175 L 395,225 L 280,225 Z' },
  KS: { name: 'Kansas', center: [350, 240], path: 'M 280,225 L 420,230 L 415,280 L 285,280 Z' },
  OK: { name: 'Oklahoma', center: [365, 305], path: 'M 285,280 L 415,280 L 420,330 L 340,330 L 335,310 L 285,310 Z' },
  TX: { name: 'Texas', center: [365, 385], path: 'M 285,310 L 340,310 L 340,330 L 420,330 L 430,410 L 380,480 L 340,430 L 300,410 L 285,340 Z' },
  MN: { name: 'Minnesota', center: [435, 100], path: 'M 395,65 L 460,75 L 450,165 L 390,160 Z' },
  IA: { name: 'Iowa', center: [445, 180], path: 'M 390,160 L 485,165 L 480,215 L 395,215 Z' },
  MO: { name: 'Missouri', center: [460, 250], path: 'M 420,230 L 505,230 L 495,305 L 415,280 Z' },
  AR: { name: 'Arkansas', center: [465, 335], path: 'M 420,330 L 505,330 L 495,385 L 430,385 Z' },
  LA: { name: 'Luisiana', center: [475, 415], path: 'M 430,385 L 495,385 L 515,445 L 455,445 Z' },
  WI: { name: 'Wisconsin', center: [495, 120], path: 'M 460,75 L 530,90 L 515,165 L 455,165 Z' },
  IL: { name: 'Illinois', center: [515, 205], path: 'M 485,165 L 535,170 L 525,260 L 485,245 Z' },
  MI: { name: 'Michigan', center: [570, 135], path: 'M 530,90 L 610,110 L 585,185 L 530,175 Z' },
  IN: { name: 'Indiana', center: [555, 215], path: 'M 535,170 L 575,175 L 565,255 L 525,250 Z' },
  OH: { name: 'Ohio', center: [610, 205], path: 'M 575,175 L 640,180 L 625,250 L 565,245 Z' },
  KY: { name: 'Kentucky', center: [575, 265], path: 'M 525,250 L 635,250 L 615,290 L 515,285 Z' },
  TN: { name: 'Tennessee', center: [575, 305], path: 'M 505,300 L 635,300 L 620,335 L 495,335 Z' },
  MS: { name: 'Mississippi', center: [525, 375], path: 'M 495,335 L 545,335 L 535,425 L 495,420 Z' },
  AL: { name: 'Alabama', center: [570, 375], path: 'M 545,335 L 600,335 L 590,430 L 535,425 Z' },
  GA: { name: 'Georgia', center: [635, 365], path: 'M 600,335 L 670,335 L 665,415 L 600,415 Z' },
  NC: { name: 'Carolina del Norte', center: [675, 290], path: 'M 625,265 L 725,265 L 735,310 L 625,310 Z' },
  SC: { name: 'Carolina del Sur', center: [665, 335], path: 'M 630,310 L 705,310 L 670,355 L 625,340 Z' },
  VA: { name: 'Virginia', center: [685, 235], path: 'M 625,230 L 735,215 L 745,265 L 625,265 Z' },
  PA: { name: 'Pensilvania', center: [685, 175], path: 'M 640,175 L 725,170 L 720,215 L 635,220 Z' },
  ME: { name: 'Maine', center: [805, 60], path: 'M 780,40 L 830,50 L 810,110 L 775,95 Z' },
  VT_NH_MA: { name: 'Nueva Inglaterra', center: [785, 125], path: 'M 770,95 L 810,110 L 785,165 L 760,150 Z' },
};

export const USMapInteractive: React.FC<USMapInteractiveProps> = ({
  selectedStateId,
  onSelectState,
  simulationParams,
}) => {
  const [hoveredStateId, setHoveredStateId] = useState<StateId | null>(null);

  const statesSummary = (['CA', 'NY', 'FL'] as StateId[]).map((stId) => {
    const stData = FOCUS_STATES[stId];
    const stFacilities = LANDFILLS_DATA.filter((f) => f.stateId === stId);
    const sim = calculateAggregateSimulation(stFacilities, simulationParams);
    return {
      id: stId,
      name: stData.name,
      facilitiesCount: stFacilities.length,
      wasteTons: sim.projectedAnnualWasteTons,
      plasticTons: sim.projectedPlasticTons,
      netEmissions: sim.netEmissionsTonCO2e,
      avoidedEmissions: sim.avoidedEmissionsTonCO2e,
      accentColor: stData.accentColor,
    };
  });

  return (
    <div className="w-full flex flex-col justify-between h-full">
      {/* Tesla Dark Metallic Map Canvas */}
      <div className="relative w-full flex-1 min-h-[220px] max-h-[380px] bg-[#0c1017]/90 rounded-xl border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden p-2">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #34d399 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <svg
          viewBox="0 0 880 490"
          className="w-full h-full max-w-4xl filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        >
          <defs>
            <linearGradient id="tesla-emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="tesla-teal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="tesla-green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background states in matte gunmetal */}
          <g className="context-states">
            {Object.entries(US_STATES_PATHS).map(([code, state]) => {
              if (code === 'CA' || code === 'NY' || code === 'FL') return null;
              return (
                <path
                  key={code}
                  d={state.path}
                  fill="#151b26"
                  stroke="#263143"
                  strokeWidth="0.8"
                  className="transition-colors hover:fill-[#1c2433]"
                >
                  <title>{state.name}</title>
                </path>
              );
            })}
          </g>

          {/* Active Work States with Tesla Metallic Glow */}
          {(['CA', 'NY', 'FL'] as StateId[]).map((stateId) => {
            const state = US_STATES_PATHS[stateId];
            const isHovered = hoveredStateId === stateId;
            const isSelected = selectedStateId === stateId;
            const gradId = stateId === 'CA' ? 'url(#tesla-emerald-grad)' : stateId === 'NY' ? 'url(#tesla-teal-grad)' : 'url(#tesla-green-grad)';

            return (
              <g
                key={stateId}
                className="cursor-pointer group"
                onClick={() => onSelectState(stateId)}
                onMouseEnter={() => setHoveredStateId(stateId)}
                onMouseLeave={() => setHoveredStateId(null)}
              >
                {/* Glow underlay */}
                <path
                  d={state.path}
                  fill="#10b981"
                  opacity={isHovered || isSelected ? '0.35' : '0.15'}
                  filter="url(#neon-glow)"
                />

                {/* State Shape */}
                <path
                  d={state.path}
                  fill={gradId}
                  stroke="#ffffff"
                  strokeWidth={isHovered || isSelected ? '2.5' : '1.8'}
                  className="transition-all duration-200 group-hover:brightness-110"
                />

                {/* Marker Pin */}
                <g transform={`translate(${state.center[0]}, ${state.center[1]})`}>
                  <circle
                    r={isHovered ? '20' : '13'}
                    fill="#34d399"
                    opacity="0.3"
                    className="transition-all duration-200"
                  />
                  <circle
                    r="7"
                    fill="#0a0d14"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle r="3.5" fill="#34d399" />

                  {/* Tesla-style minimal metallic tag */}
                  <g transform={`translate(${stateId === 'FL' ? -25 : stateId === 'CA' ? -65 : 20}, ${stateId === 'NY' ? -15 : 20})`}>
                    <rect
                      x="0"
                      y="0"
                      width={stateId === 'CA' ? 95 : stateId === 'NY' ? 90 : 80}
                      height="22"
                      rx="4"
                      fill="#0d111a"
                      stroke="#34d399"
                      strokeWidth="1"
                      className="shadow-lg"
                    />
                    <text
                      x="8"
                      y="15"
                      fill="#f8fafc"
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="system-ui"
                    >
                      {state.name}
                    </text>
                  </g>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Hover quick tooltip */}
        {hoveredStateId && (
          <div className="absolute top-3 right-3 bg-[#0d111a]/95 backdrop-blur-md border border-emerald-500/40 rounded-lg p-2.5 text-xs shadow-xl pointer-events-none transition-opacity">
            <span className="font-bold text-emerald-400 block font-mono">
              {FOCUS_STATES[hoveredStateId].name}
            </span>
            <div className="text-slate-300 text-[11px] mt-0.5">
              {LANDFILLS_DATA.filter(f => f.stateId === hoveredStateId).length} vertederos analizados · Clic para entrar
            </div>
          </div>
        )}
      </div>

      {/* 3 Horizontal Tesla Metallic Cards below the map */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 shrink-0">
        {statesSummary.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectState(item.id)}
            className="p-3 rounded-xl metallic-card hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <h3 className="font-bold text-sm text-white tracking-tight">
                  {item.name}
                </h3>
                <span className="text-slate-400 text-xs font-mono">· {item.facilitiesCount} vertederos</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                <span>{(item.wasteTons / 1000000).toFixed(1)}M t residuos</span>
                <span className="text-emerald-400 font-semibold">
                  -{(item.avoidedEmissions / 1000).toFixed(0)}k t CO₂e
                </span>
              </div>
            </div>

            <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
              Ver
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { SimulationParameters, SimulationResult, StateId } from '../../types';
import {
  X,
  Printer,
  Copy,
  Check,
  FileText,
  Building2,
} from 'lucide-react';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulationParams: SimulationParameters;
  simulatedMetrics: SimulationResult;
  baselineMetrics: SimulationResult;
  selectedStateId: StateId | null;
  activeScenarioTitle: string;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  simulationParams,
  simulatedMetrics,
  selectedStateId,
  activeScenarioTitle,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `
INFORME EJECUTIVO: SIMULACIÓN ESTRATÉGICA DE GESTIÓN DE RESIDUOS (EE.UU.)
Escenario: ${activeScenarioTitle} | Horizonte: ${simulationParams.targetYear}
Alcance: California, Nueva York y Florida

RESULTADOS CLAVE:
- Emisiones Netas Proyectadas: ${(simulatedMetrics.netEmissionsTonCO2e / 1000).toFixed(1)}k ton CO2e/año
- Emisiones Evitadas con Captura de Biogás: ${(simulatedMetrics.avoidedEmissionsTonCO2e / 1000).toFixed(1)}k ton CO2e
- Plásticos en Vertedero: ${(simulatedMetrics.projectedPlasticTons / 1000).toFixed(1)}k ton/año
- Energía Renovable Generada: ${(simulatedMetrics.energyGeneratedMWh / 1000).toFixed(1)}k MWh/año
- Valor Financiero en Créditos de Carbono: $${(simulatedMetrics.carbonCreditsValueUSD / 1000000).toFixed(2)}M USD
- Capacidad Remanente: ${simulatedMetrics.remainingCapacityPct}% (Año Crítico: ${simulatedMetrics.criticalSaturationYear})
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150 text-slate-100">
      <div className="bg-[#0c1017] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-4 bg-[#0a0d14]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Informe Ejecutivo de Sostenibilidad y Residuos
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Escenario: <strong className="text-emerald-400">{activeScenarioTitle}</strong> · Año <strong className="text-white">{simulationParams.targetYear}</strong> · CA, NY, FL
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-white/10 transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-white/10 transition-colors flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed">
          <div className="p-3.5 metallic-card rounded-xl text-slate-300">
            <h3 className="font-bold text-white mb-1">Resumen del Escenario</h3>
            <p>
              Bajo la configuración simulada (Captura de biogás al {simulationParams.biogasCaptureEfficiency}%, reducción de plásticos del {simulationParams.plasticReductionPct}% y tasa de desvío del {simulationParams.diversionRatePct}%), los 3 estados prioritarios logran mitigar fugas de metano críticas, acelerar la transición hacia gas natural renovable (RNG) y retrasar la fecha de cierre de las principales instalaciones.
            </p>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 metallic-card rounded-xl">
              <span className="text-[11px] text-slate-400">Emisiones Netas</span>
              <div className="font-mono text-lg font-bold text-white mt-0.5">
                {(simulatedMetrics.netEmissionsTonCO2e / 1000).toFixed(0)}k t CO₂e
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                -{(simulatedMetrics.avoidedEmissionsTonCO2e / 1000).toFixed(0)}k evitadas
              </span>
            </div>

            <div className="p-3 metallic-card rounded-xl">
              <span className="text-[11px] text-slate-400">Plásticos Anuales</span>
              <div className="font-mono text-lg font-bold text-amber-300 mt-0.5">
                {(simulatedMetrics.projectedPlasticTons / 1000).toFixed(0)}k ton
              </div>
              <span className="text-[10px] text-slate-400">En vertedero</span>
            </div>

            <div className="p-3 metallic-card rounded-xl">
              <span className="text-[11px] text-slate-400">Energía Biogás</span>
              <div className="font-mono text-lg font-bold text-cyan-300 mt-0.5">
                {(simulatedMetrics.energyGeneratedMWh / 1000).toFixed(0)}k MWh
              </div>
              <span className="text-[10px] text-slate-400">Electricidad</span>
            </div>

            <div className="p-3 metallic-card rounded-xl">
              <span className="text-[11px] text-slate-400">Créditos de Carbono</span>
              <div className="font-mono text-lg font-bold text-emerald-400 mt-0.5">
                ${(simulatedMetrics.carbonCreditsValueUSD / 1000000).toFixed(1)}M USD
              </div>
              <span className="text-[10px] text-slate-400 font-mono">A $35/t</span>
            </div>
          </div>

          {/* Key territories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 metallic-card rounded-xl">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs mb-1 font-mono">
                <Building2 className="w-3.5 h-3.5" />
                <span>California</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Desvío orgánico mandatorio (SB 1383) y cogeneración en Puente Hills (50 MW) y Altamont.
              </p>
            </div>

            <div className="p-3 metallic-card rounded-xl">
              <div className="flex items-center gap-1.5 font-bold text-teal-400 text-xs mb-1 font-mono">
                <Building2 className="w-3.5 h-3.5" />
                <span>Nueva York</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Logística ferroviaria hacia Seneca Meadows y resolución del inminente cierre de Brookhaven.
              </p>
            </div>

            <div className="p-3 metallic-card rounded-xl">
              <div className="flex items-center gap-1.5 font-bold text-green-400 text-xs mb-1 font-mono">
                <Building2 className="w-3.5 h-3.5" />
                <span>Florida</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Contención de doble geomembrana sobre el acuífero de Biscayne en Monarch Hill (68 m) y Medley.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-[#0a0d14] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg text-xs font-semibold shadow-md"
          >
            Cerrar Informe
          </button>
        </div>
      </div>
    </div>
  );
};

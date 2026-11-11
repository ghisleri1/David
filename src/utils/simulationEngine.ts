import { LandfillFacility, SimulationParameters, SimulationResult } from '../types';

const BASE_YEAR = 2024;
const METHANE_GWP = 28; // Global Warming Potential of Methane over 100 years (EPA standard)
const CARBON_CREDIT_PRICE_USD = 35; // $35 per metric ton of CO2e avoided

export function calculateFacilitySimulation(
  facility: LandfillFacility,
  params: SimulationParameters
): SimulationResult {
  const yearsDelta = Math.max(0, params.targetYear - BASE_YEAR);

  // Baseline waste inflow rate adjustment
  // If diversion increases from 35% baseline to params.diversionRatePct, waste to landfill decreases
  const diversionFactor = Math.max(0.1, 1 - (params.diversionRatePct - 35) / 100);
  const consumptionFactor = 1 + params.consumptionPerCapitaDelta / 100;
  
  const annualIncomingTons = facility.status === 'converted_energy_park' 
    ? facility.annualIncomingTons * consumptionFactor
    : facility.annualIncomingTons * diversionFactor * consumptionFactor;

  // Plastic component
  const plasticFactor = Math.max(0.2, 1 + params.plasticReductionPct / 100);
  const effectivePlasticShare = (facility.plasticSharePct / 100) * plasticFactor;
  const projectedPlasticTons = annualIncomingTons * effectivePlasticShare;

  // Accumulated waste calculation
  const additionalAccumulatedMillionTons = (annualIncomingTons * yearsDelta) / 1_000_000;
  const projectedAccumulatedWasteTons = Math.min(
    facility.totalCapacityMillionTons * 1_000_000,
    (facility.currentAccumulatedMillionTons + additionalAccumulatedMillionTons) * 1_000_000
  );

  // Remaining capacity
  const remainingCapacityTons = Math.max(
    0,
    facility.totalCapacityMillionTons * 1_000_000 - projectedAccumulatedWasteTons
  );
  const remainingCapacityPct = Math.max(
    0,
    Math.min(100, (remainingCapacityTons / (facility.totalCapacityMillionTons * 1_000_000)) * 100)
  );

  // Saturation year
  let criticalSaturationYear = facility.expectedClosureYear;
  if (facility.status !== 'converted_energy_park' && annualIncomingTons > 0) {
    const yearsRemaining = remainingCapacityTons / annualIncomingTons;
    criticalSaturationYear = Math.round(BASE_YEAR + yearsRemaining);
  }

  // Methane emissions (kg/hr converted to metric tons/year: kg/hr * 24 * 365 / 1000)
  // Decay or accumulation factor: more waste accumulated = slightly higher methane potential
  const wasteScale = (projectedAccumulatedWasteTons / (facility.currentAccumulatedMillionTons * 1_000_000 || 1));
  const grossMethaneTonsPerYear = (facility.methaneGenerationKgPerHour * 24 * 365 / 1000) * Math.min(1.4, Math.max(0.7, wasteScale));
  const grossMethaneTonCO2e = grossMethaneTonsPerYear * METHANE_GWP;

  // Captured methane using interactive slider efficiency
  const captureEfficiency = params.biogasCaptureEfficiency / 100;
  const capturedMethaneTonCO2e = grossMethaneTonCO2e * captureEfficiency;
  const netEmissionsTonCO2e = grossMethaneTonCO2e - capturedMethaneTonCO2e;

  // Avoided emissions baseline (relative to 50% uncontrolled baseline)
  const baselineUncontrolledCO2e = grossMethaneTonCO2e * 0.50;
  const avoidedEmissionsTonCO2e = Math.max(0, capturedMethaneTonCO2e - baselineUncontrolledCO2e);

  // Clean energy generation: 1 ton CH4 ~ 14.5 MWh chemical energy -> ~35% generator electric efficiency = ~5.0 MWh electric
  const capturedMethaneTons = grossMethaneTonsPerYear * captureEfficiency;
  const energyGeneratedMWh = capturedMethaneTons * 5.07;

  // Leachate volume (m3/yr) - plastic reduction and better capping slightly decreases percolation
  const leachateM3Risk = facility.leachateM3PerYear * (1 + (params.consumptionPerCapitaDelta * 0.3) / 100) * (1 - (params.diversionRatePct - 35) * 0.003);

  // Carbon credits USD value
  const carbonCreditsValueUSD = avoidedEmissionsTonCO2e * CARBON_CREDIT_PRICE_USD;

  return {
    year: params.targetYear,
    projectedAnnualWasteTons: Math.round(annualIncomingTons),
    projectedAccumulatedWasteTons: Math.round(projectedAccumulatedWasteTons),
    projectedPlasticTons: Math.round(projectedPlasticTons),
    grossMethaneTonCO2e: Math.round(grossMethaneTonCO2e),
    capturedMethaneTonCO2e: Math.round(capturedMethaneTonCO2e),
    netEmissionsTonCO2e: Math.round(netEmissionsTonCO2e),
    avoidedEmissionsTonCO2e: Math.round(avoidedEmissionsTonCO2e),
    leachateM3Risk: Math.round(leachateM3Risk),
    energyGeneratedMWh: Math.round(energyGeneratedMWh),
    carbonCreditsValueUSD: Math.round(carbonCreditsValueUSD),
    remainingCapacityPct: Number(remainingCapacityPct.toFixed(1)),
    criticalSaturationYear,
  };
}

export function calculateAggregateSimulation(
  facilities: LandfillFacility[],
  params: SimulationParameters
): SimulationResult {
  const facilityResults = facilities.map(f => calculateFacilitySimulation(f, params));

  const totalAnnualWasteTons = facilityResults.reduce((acc, r) => acc + r.projectedAnnualWasteTons, 0);
  const totalAccumulatedTons = facilityResults.reduce((acc, r) => acc + r.projectedAccumulatedWasteTons, 0);
  const totalPlasticTons = facilityResults.reduce((acc, r) => acc + r.projectedPlasticTons, 0);
  const totalGrossCO2e = facilityResults.reduce((acc, r) => acc + r.grossMethaneTonCO2e, 0);
  const totalCapturedCO2e = facilityResults.reduce((acc, r) => acc + r.capturedMethaneTonCO2e, 0);
  const totalNetCO2e = facilityResults.reduce((acc, r) => acc + r.netEmissionsTonCO2e, 0);
  const totalAvoidedCO2e = facilityResults.reduce((acc, r) => acc + r.avoidedEmissionsTonCO2e, 0);
  const totalLeachateM3 = facilityResults.reduce((acc, r) => acc + r.leachateM3Risk, 0);
  const totalEnergyMWh = facilityResults.reduce((acc, r) => acc + r.energyGeneratedMWh, 0);
  const totalCarbonCreditsUSD = facilityResults.reduce((acc, r) => acc + r.carbonCreditsValueUSD, 0);
  
  // Weighted remaining capacity %
  const totalCapacityTons = facilities.reduce((acc, f) => acc + f.totalCapacityMillionTons * 1_000_000, 0);
  const remainingCapacityPct = totalCapacityTons > 0
    ? Math.max(0, Number((((totalCapacityTons - totalAccumulatedTons) / totalCapacityTons) * 100).toFixed(1)))
    : 0;

  // Earliest critical saturation year among active facilities
  const activeSaturationYears = facilityResults
    .filter((_, idx) => facilities[idx].status !== 'converted_energy_park')
    .map(r => r.criticalSaturationYear);
  const criticalSaturationYear = activeSaturationYears.length > 0
    ? Math.min(...activeSaturationYears)
    : 2045;

  return {
    year: params.targetYear,
    projectedAnnualWasteTons: totalAnnualWasteTons,
    projectedAccumulatedWasteTons: totalAccumulatedTons,
    projectedPlasticTons: totalPlasticTons,
    grossMethaneTonCO2e: totalGrossCO2e,
    capturedMethaneTonCO2e: totalCapturedCO2e,
    netEmissionsTonCO2e: totalNetCO2e,
    avoidedEmissionsTonCO2e: totalAvoidedCO2e,
    leachateM3Risk: totalLeachateM3,
    energyGeneratedMWh: totalEnergyMWh,
    carbonCreditsValueUSD: totalCarbonCreditsUSD,
    remainingCapacityPct,
    criticalSaturationYear,
  };
}

export interface YearTrendPoint {
  year: number;
  netEmissionsTonCO2e: number;
  avoidedEmissionsTonCO2e: number;
  plasticTons: number;
  energyGeneratedMWh: number;
}

export function generateTrajectorySeries(
  facilities: LandfillFacility[],
  params: SimulationParameters
): YearTrendPoint[] {
  const points: YearTrendPoint[] = [];
  const years = [2024, 2026, 2028, 2030, 2032, 2035, 2040, 2045];

  for (const yr of years) {
    const simulatedForYear = calculateAggregateSimulation(facilities, {
      ...params,
      targetYear: yr,
    });

    points.push({
      year: yr,
      netEmissionsTonCO2e: simulatedForYear.netEmissionsTonCO2e,
      avoidedEmissionsTonCO2e: simulatedForYear.avoidedEmissionsTonCO2e,
      plasticTons: simulatedForYear.projectedPlasticTons,
      energyGeneratedMWh: simulatedForYear.energyGeneratedMWh,
    });
  }

  return points;
}

export type StateId = 'CA' | 'NY' | 'FL';

export type SubRegionId = 
  | 'CA_NORTH' | 'CA_CENTRAL' | 'CA_SOUTH'
  | 'NY_METRO' | 'NY_UPSTATE' | 'NY_WEST'
  | 'FL_SOUTH' | 'FL_CENTRAL' | 'FL_NORTH';

export interface LandfillFacility {
  id: string;
  name: string;
  stateId: StateId;
  subRegionId: SubRegionId;
  county: string;
  nearestCity: string;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // relative SVG % coordinate for custom maps
    mapY: number;
  };
  openedYear: number;
  expectedClosureYear: number;
  totalCapacityMillionTons: number;
  currentAccumulatedMillionTons: number;
  annualIncomingTons: number;
  plasticSharePct: number; // e.g. 18.5%
  methaneGenerationKgPerHour: number;
  biogasCaptureEfficiency: number; // current baseline % (e.g. 65%)
  leachateM3PerYear: number;
  status: 'active' | 'nearing_capacity' | 'converted_energy_park';
  biogasToEnergyPlant: boolean;
  powerOutputMW?: number;
  description: string;
  keyIssues: string[];
}

export interface SubRegion {
  id: SubRegionId;
  stateId: StateId;
  name: string;
  shortName: string;
  description: string;
  centerCoordinates: { lat: number; lng: number };
  majorCities: string[];
  totalPopulation: number;
}

export interface FocusStateData {
  id: StateId;
  name: string;
  capital: string;
  largestCity: string;
  totalPopulation: number;
  totalAnnualWasteTons: number;
  recyclingRatePct: number;
  activeLandfillsCount: number;
  executiveSummary: string;
  subRegions: SubRegion[];
  svgPath: string; // SVG path representation for state outline
  viewBox: string;
  color: string;
  accentColor: string;
}

export interface SimulationParameters {
  targetYear: number; // 2024 - 2045
  biogasCaptureEfficiency: number; // 20% - 95%
  plasticReductionPct: number; // -30% to +50% (negative means reduction, positive means increase)
  diversionRatePct: number; // 10% - 75% diverted to recycling/compost
  consumptionPerCapitaDelta: number; // -15% to +25%
}

export interface SimulationResult {
  year: number;
  projectedAnnualWasteTons: number;
  projectedAccumulatedWasteTons: number;
  projectedPlasticTons: number;
  grossMethaneTonCO2e: number;
  capturedMethaneTonCO2e: number;
  netEmissionsTonCO2e: number;
  avoidedEmissionsTonCO2e: number;
  leachateM3Risk: number;
  energyGeneratedMWh: number;
  carbonCreditsValueUSD: number;
  remainingCapacityPct: number;
  criticalSaturationYear: number;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  badge: string;
  description: string;
  executiveTakeaway: string;
  params: SimulationParameters;
}

export type ViewLevel = 'usa' | 'state' | 'facility';

import React, { useState } from "react";
import { SimulationScenarioKey, AffectedPopulationData } from "../types";
import { getAffectedPopulation, SIMULATION_SCENARIOS, DistrictTelemetryData } from "../data/telemetryEngine";
import {
  Users,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Baby,
  Heart,
  Home,
  Tractor,
  Hospital,
  Droplet,
  Zap,
  ShieldCheck,
  Building2,
  TrendingUp,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2
} from "lucide-react";

interface AffectedPopulationPageProps {
  districtName: string;
  stateName: string;
  telemetry: DistrictTelemetryData;
  activeScenarioKey: SimulationScenarioKey;
  onChangeScenarioKey: (key: SimulationScenarioKey) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const AffectedPopulationPage: React.FC<AffectedPopulationPageProps> = ({
  districtName,
  stateName,
  telemetry,
  activeScenarioKey,
  onChangeScenarioKey,
  onPrevPage,
  onNextPage
}) => {
  // Ensure the page always opens from the very top
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const [selectedScenario, setSelectedScenario] = useState<SimulationScenarioKey>(activeScenarioKey);

  const handleScenarioChange = (key: SimulationScenarioKey) => {
    setSelectedScenario(key);
    onChangeScenarioKey(key);
  };

  // Compute demographic impact numbers
  const populationData: AffectedPopulationData = getAffectedPopulation(
    districtName,
    stateName,
    selectedScenario,
    telemetry
  );

  const scenario = SIMULATION_SCENARIOS[selectedScenario];

  return (
    <div className="space-y-6">
      {/* Step Header & Location Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-900/10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200/80 rounded-lg text-xs font-bold tracking-wider">
            STEP 3 OF 4: ESTIMATED AFFECTED POPULATION
          </span>
          <span className="text-xs font-semibold text-teal-800/80">
            {districtName}, {stateName}
          </span>
        </div>

        {/* Previous & Next quick buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevPage}
            id="pop-btn-prev-top"
            className="px-3 py-1.5 rounded-lg border border-teal-900/15 bg-white hover:bg-teal-50/70 text-xs font-semibold text-teal-950 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Simulations</span>
          </button>

          <button
            type="button"
            onClick={onNextPage}
            id="pop-btn-next-top"
            className="px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Safety Steps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Impact Hero Card */}
      <section className="mosaic-card rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold bg-teal-50/80 border border-teal-200/80 text-teal-800 shadow-2xs">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>Demographic Risk Assessment Model</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-950 tracking-tight font-['Outfit',sans-serif]">
              Estimated Affected Population:{" "}
              <span className="text-red-600">
                {populationData.estimatedAffected.toLocaleString("en-IN")} Citizens
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-teal-800/80 leading-relaxed">
              Based on official catchment density, floodplain topography, and low-lying ground level housing in{" "}
              <strong>{districtName}</strong> (Total Population:{" "}
              {populationData.totalDistrictPopulation.toLocaleString("en-IN")}).
            </p>
          </div>

          {/* Key Stat Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 rounded-xl bg-white border border-teal-900/10 text-center shadow-2xs min-w-[120px]">
              <div className="text-[10px] uppercase font-bold text-teal-700/80">District Impact</div>
              <div className="text-2xl sm:text-3xl font-black text-red-600 mt-0.5 font-['Outfit',sans-serif]">
                {populationData.percentageOfDistrict}%
              </div>
              <div className="text-[10px] text-teal-700/80 font-medium">of entire district</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-teal-900/10 text-center shadow-2xs min-w-[130px]">
              <div className="text-[10px] uppercase font-bold text-teal-700/80">Displaced Families</div>
              <div className="text-2xl sm:text-3xl font-black text-teal-950 mt-0.5 font-['Outfit',sans-serif]">
                {populationData.displacedHouseholds.toLocaleString("en-IN")}
              </div>
              <div className="text-[10px] text-teal-700/80 font-medium">households</div>
            </div>
          </div>
        </div>

        {/* Interactive Scenario Toggle inside Demographic view */}
        <div className="mt-6 pt-5 border-t border-teal-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-teal-700" />
            <span>Select Scenario to Compare Affected Residents:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-teal-50/80 p-1 rounded-xl border border-teal-900/10">
            <button
              type="button"
              onClick={() => handleScenarioChange("normal")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedScenario === "normal"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-teal-900 hover:bg-white/80"
              }`}
            >
              Normal Rain ({populationData.scenarioBreakdown.normalAffected.toLocaleString("en-IN")})
            </button>

            <button
              type="button"
              onClick={() => handleScenarioChange("heavy")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedScenario === "heavy"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-teal-900 hover:bg-white/80"
              }`}
            >
              Heavy Rain ({populationData.scenarioBreakdown.heavyAffected.toLocaleString("en-IN")})
            </button>

            <button
              type="button"
              onClick={() => handleScenarioChange("drainage_failure")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedScenario === "drainage_failure"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-red-700 hover:bg-red-50"
              }`}
            >
              Drainage Failure ({populationData.scenarioBreakdown.drainageFailureAffected.toLocaleString("en-IN")})
            </button>
          </div>
        </div>
      </section>

      {/* Vulnerable Demographic Cohorts Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-teal-950 flex items-center gap-2 font-['Outfit',sans-serif]">
            <Heart className="w-4 h-4 text-red-600" />
            <span>Vulnerable Citizen Groups Requiring Priority Evacuation</span>
          </h3>
          <span className="text-xs text-teal-700 font-semibold">Priority 1 NDRF Routing</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Children */}
          <div className="p-4 rounded-xl mosaic-card flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/70 flex items-center justify-center shrink-0">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-teal-700/80">Children (&lt;10 yrs)</div>
              <div className="text-lg font-black text-teal-950 font-['Outfit',sans-serif]">
                {populationData.childrenAtRisk.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-teal-700/80 mt-0.5">Need pediatric oral rehydration kits</p>
            </div>
          </div>

          {/* Card 2: Elderly */}
          <div className="p-4 rounded-xl mosaic-card flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-teal-700/80">Seniors (&gt;65 yrs)</div>
              <div className="text-lg font-black text-teal-950 font-['Outfit',sans-serif]">
                {populationData.seniorsAtRisk.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-teal-700/80 mt-0.5">Mobility assistance &amp; daily insulin</p>
            </div>
          </div>

          {/* Card 3: Pregnant Women & Infants */}
          <div className="p-4 rounded-xl mosaic-card flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 border border-red-200/70 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-teal-700/80">Mothers &amp; Infants</div>
              <div className="text-lg font-black text-teal-950 font-['Outfit',sans-serif]">
                {populationData.pregnantAndInfants.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-teal-700/80 mt-0.5">Immediate boat transport to maternal wards</p>
            </div>
          </div>

          {/* Card 4: Farmers & Livestock */}
          <div className="p-4 rounded-xl mosaic-card flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/70 flex items-center justify-center shrink-0">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-teal-700/80">Agricultural Families</div>
              <div className="text-lg font-black text-teal-950 font-['Outfit',sans-serif]">
                {populationData.farmersAndLivestockHolders.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-teal-700/80 mt-0.5">Livestock fodder &amp; elevated bunds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Critical District Infrastructure at Risk */}
      <section className="mosaic-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-teal-900/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4 text-teal-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-teal-950 font-['Outfit',sans-serif]">
                Critical Infrastructure Submergence &amp; Lifelines
              </h3>
              <p className="text-xs text-teal-800/80">
                Key civil assets affected in {districtName} under {scenario.title}.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 bg-white/95 rounded-xl border border-teal-900/10 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-teal-700/80">Submerged Roads</div>
            <div className="text-xl font-black text-red-600 mt-1 font-['Outfit',sans-serif]">
              {populationData.submergedRoadwaysKm} <span className="text-xs font-semibold text-teal-600">km</span>
            </div>
            <div className="text-[10px] text-teal-700/80 mt-0.5">Arterial roads blocked</div>
          </div>

          <div className="p-3.5 bg-white/95 rounded-xl border border-teal-900/10 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-teal-700/80">Clinics at Risk</div>
            <div className="text-xl font-black text-amber-600 mt-1 font-['Outfit',sans-serif]">
              {populationData.healthcareClinicsAtRisk}
            </div>
            <div className="text-[10px] text-teal-700/80 mt-0.5">Primary health centers</div>
          </div>

          <div className="p-3.5 bg-white/95 rounded-xl border border-teal-900/10 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-teal-700/80">Water Pumps at Risk</div>
            <div className="text-xl font-black text-cyan-700 mt-1 font-['Outfit',sans-serif]">
              {populationData.drinkingWaterPumpsRisk}
            </div>
            <div className="text-[10px] text-teal-700/80 mt-0.5">Contamination danger</div>
          </div>

          <div className="p-3.5 bg-white/95 rounded-xl border border-teal-900/10 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-teal-700/80">Power Stations Off</div>
            <div className="text-xl font-black text-red-600 mt-1 font-['Outfit',sans-serif]">
              {populationData.submergedElectricalGrids}
            </div>
            <div className="text-[10px] text-teal-700/80 mt-0.5">Substations disconnected</div>
          </div>

          <div className="p-3.5 bg-white/95 rounded-xl border border-teal-900/10 shadow-2xs col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-bold text-teal-700/80">Relief Shelters</div>
            <div className="text-xl font-black text-emerald-700 mt-1 font-['Outfit',sans-serif]">
              {populationData.designatedSheltersAvailable}
            </div>
            <div className="text-[10px] text-teal-700/80 mt-0.5">Schools &amp; community halls</div>
          </div>
        </div>
      </section>

      {/* Scenario Comparison Callout */}
      <div className="p-5 rounded-2xl mosaic-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs sm:text-sm font-bold text-teal-950 font-['Outfit',sans-serif]">
            Why does Drainage Failure affect 3x more people than Heavy Rainfall?
          </div>
          <p className="text-xs text-teal-800/80">
            When municipal drains are choked with plastic and silt, flood water cannot escape into river outfalls. It forces hydraulic backwater into densely populated residential colonies that would otherwise stay dry.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleScenarioChange("drainage_failure")}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer shadow-2xs"
        >
          View Drainage Failure Impact
        </button>
      </div>

      {/* Consistent Bottom Navigation Bar with Matching Previous & Next Clicking Buttons */}
      <div className="p-4 mosaic-card rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevPage}
          id="pop-btn-prev-bottom"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-teal-900/15 bg-white hover:bg-teal-50/70 text-xs font-semibold text-teal-950 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous: Realistic Simulations</span>
        </button>

        <div className="text-[11px] text-teal-700/80 font-medium text-center hidden md:block">
          Step 3 of 4 &bull; Next up: Government helplines &amp; actionable citizen guidelines
        </div>

        <button
          type="button"
          onClick={onNextPage}
          id="pop-btn-next-bottom"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-sm"
        >
          <span>Next: Safety Guidelines &amp; Helplines</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

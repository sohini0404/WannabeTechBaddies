import React from "react";
import { UserProfile, SeverityLevel } from "../types";
import { IndianState, DistrictInfo, SEVERITY_MEASURES } from "../data/floodData";
import { getDistrictTelemetry } from "../data/telemetryEngine";
import { SeverityGraphView } from "./SeverityGraphView";
import {
  ArrowLeft,
  Droplets,
  CloudRain,
  Percent,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  BarChart3,
  Layers,
  Sparkles
} from "lucide-react";

interface SeverityResultsPageProps {
  user: UserProfile;
  selectedState: IndianState;
  selectedDistrict: DistrictInfo;
  onBackToLocation: () => void;
  onNextToSimulations: () => void;
}

export const SeverityResultsPage: React.FC<SeverityResultsPageProps> = ({
  user,
  selectedState,
  selectedDistrict,
  onBackToLocation,
  onNextToSimulations
}) => {
  // Ensure the page always opens from the very top
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  // Compute live 5-metric hydrological telemetry
  const telemetry = getDistrictTelemetry(selectedDistrict);
  const severityData = SEVERITY_MEASURES[telemetry.severityLevel];

  return (
    <div className="space-y-6">
      {/* Step Header & Location Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-900/10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200/80 rounded-lg text-xs font-bold tracking-wider">
            STEP 1 OF 4: FLOOD SEVERITY &amp; 3D TELEMETRY
          </span>
          <span className="text-xs font-semibold text-teal-800/80">
            {selectedDistrict.name}, {selectedState.name}
          </span>
        </div>

        {/* Previous & Next quick buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToLocation}
            id="sev-btn-prev-top"
            className="px-3 py-1.5 rounded-lg border border-teal-900/15 bg-white hover:bg-teal-50/70 text-xs font-semibold text-teal-950 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Location</span>
          </button>

          <button
            type="button"
            onClick={onNextToSimulations}
            id="sev-btn-next-top"
            className="px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Realistic Simulations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. Flood Severity Card (Assessed Level & Hydrological Classification) */}
      <section
        id="section-severity-level"
        className="mosaic-card rounded-2xl p-6 sm:p-7 border transition-all"
        style={{
          borderColor: severityData.borderColor,
          backgroundColor: severityData.bgTone
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                id="current-severity-level-badge"
                className="text-xs uppercase font-bold px-3 py-1 rounded-lg tracking-wider text-white shadow-2xs"
                style={{ backgroundColor: severityData.color }}
              >
                {telemetry.severityLabel}
              </span>
              <span className="text-xs font-semibold text-teal-950">
                {selectedState.riverBasins} Basin
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-950 tracking-tight font-['Outfit',sans-serif]">
              {selectedDistrict.name}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-teal-800/90 mt-0.5">
              {selectedDistrict.status} &bull; Hydrological Risk Index: <strong>{telemetry.riskScore}/100</strong>
            </p>
          </div>

          <div
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl text-center border bg-white/95 backdrop-blur-xs shadow-2xs"
            style={{ borderColor: severityData.borderColor }}
          >
            <div className="text-[10px] uppercase font-bold text-teal-800/70 tracking-wider">
              Hydrological Classification
            </div>
            <div className="text-lg font-black tracking-tight font-['Outfit',sans-serif]" style={{ color: severityData.color }}>
              {telemetry.severityLevel === 3
                ? "LEVEL 3 CRITICAL"
                : telemetry.severityLevel === 2
                ? "LEVEL 2 WARNING"
                : "LEVEL 1 SAFE"}
            </div>
          </div>
        </div>

        {/* 5 Key Hydrological Telemetry Indicators Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5 pt-4 border-t border-teal-900/10">
          <div className="bg-white/95 rounded-xl p-3 border border-teal-900/10 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-teal-700/80">Rainfall</span>
              <CloudRain className="w-3.5 h-3.5 text-cyan-600" />
            </div>
            <div className="text-sm sm:text-base font-bold text-teal-950 mt-1">
              {telemetry.rainfallIntensity} <span className="text-[10px] font-normal text-teal-600">mm/hr</span>
            </div>
          </div>

          <div className="bg-white/95 rounded-xl p-3 border border-teal-900/10 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-teal-700/80">Water Depth</span>
              <Droplets className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <div className="text-sm sm:text-base font-bold text-teal-950 mt-1">
              {telemetry.initialWaterLevel} <span className="text-[10px] font-normal text-teal-600">meters</span>
            </div>
          </div>

          <div className="bg-white/95 rounded-xl p-3 border border-teal-900/10 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-teal-700/80">Drainage</span>
              <Percent className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-sm sm:text-base font-bold text-teal-950 mt-1">
              {telemetry.drainage}% <span className="text-[10px] font-normal text-teal-600">cap</span>
            </div>
          </div>

          <div className="bg-white/95 rounded-xl p-3 border border-teal-900/10 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-teal-700/80">Inflow</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-sm sm:text-base font-bold text-teal-950 mt-1">
              {telemetry.inflow} <span className="text-[10px] font-normal text-teal-600">m³/s</span>
            </div>
          </div>

          <div className="bg-white/95 rounded-xl p-3 border border-teal-900/10 shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-teal-700/80">Outflow</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-sm sm:text-base font-bold text-teal-950 mt-1">
              {telemetry.outflow} <span className="text-[10px] font-normal text-teal-600">m³/s</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive 3D Telemetry Graph & Numerical Parameters */}
      <SeverityGraphView
        districtName={selectedDistrict.name}
        stateName={selectedState.name}
        telemetry={telemetry}
        onBackToMeasures={onNextToSimulations}
      />

      {/* Consistent Bottom Navigation Bar with Matching Previous & Next Clicking Buttons */}
      <div className="p-4 mosaic-card rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToLocation}
          id="sev-btn-prev-bottom"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-teal-900/15 bg-white hover:bg-teal-50/70 text-xs font-semibold text-teal-950 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Location</span>
        </button>

        <div className="text-[11px] text-teal-700/80 font-medium text-center hidden md:block">
          Step 1 of 4 &bull; Next up: Realistic 3D simulations of normal rain, heavy rain &amp; blocked drainage
        </div>

        <button
          type="button"
          onClick={onNextToSimulations}
          id="sev-btn-next-bottom"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-sm"
        >
          <span>Next: Realistic Simulations &amp; Drainage Model</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

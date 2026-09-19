import React, { useState } from "react";
import { UserProfile } from "../types";
import { ALL_INDIAN_STATES, IndianState, DistrictInfo } from "../data/floodData";
import {
  MapPin,
  ArrowRight,
  User,
  Phone,
  Sparkles,
  Waves,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  Activity
} from "lucide-react";

interface CheckLocationPageProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onCheckSeverity: (state: IndianState, district: DistrictInfo) => void;
  onOpenSimulations: (state: IndianState, district: DistrictInfo) => void;
  onNavigateToDonations: () => void;
}

export const CheckLocationPage: React.FC<CheckLocationPageProps> = ({
  user,
  onUpdateUser,
  onCheckSeverity,
  onOpenSimulations,
  onNavigateToDonations
}) => {
  // Ensure the page always opens from the very top
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const [name, setName] = useState(user.name || "Sohini Pallapothu");
  const [phone, setPhone] = useState(user.phone || "+91 98765 43210");
  const [selectedStateId, setSelectedStateId] = useState<string>("");
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const selectedStateObj = ALL_INDIAN_STATES.find((s) => s.id === selectedStateId);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStateId(e.target.value);
    setSelectedDistrictName(""); // Reset district
    setValidationError(null);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrictName(e.target.value);
    setValidationError(null);
  };

  const handleTriggerAction = (targetAction: "severity" | "simulations") => {
    if (!selectedStateId) {
      setValidationError("Please select your Indian State or Union Territory.");
      return;
    }
    if (!selectedDistrictName) {
      setValidationError("Please select your District or Flood Area.");
      return;
    }

    if (!selectedStateObj) return;
    const foundDistrict = selectedStateObj.districts.find((d) => d.name === selectedDistrictName);
    if (!foundDistrict) {
      setValidationError("Please choose a valid district.");
      return;
    }

    onUpdateUser({
      name: name.trim() || "Citizen",
      phone: phone.trim() || "+91 98765 43210",
      location: `${foundDistrict.name}, ${selectedStateObj.name}`
    });

    if (targetAction === "simulations") {
      onOpenSimulations(selectedStateObj, foundDistrict);
    } else {
      onCheckSeverity(selectedStateObj, foundDistrict);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTriggerAction("severity");
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-2 sm:px-4">
      {/* Aquatic Header with Frosted Glass Badge & High-Contrast Typography */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-white/60 text-teal-950 text-xs font-semibold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-700" />
          <span>India Flood Monitoring &amp; Citizen Safety</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit',sans-serif] drop-shadow-[0_2px_8px_rgba(4,32,36,0.65)]">
          Check Flood Severity
        </h1>
        <p className="text-xs sm:text-sm text-teal-50 font-medium mt-1.5 max-w-md mx-auto leading-relaxed drop-shadow-[0_1px_4px_rgba(4,32,36,0.75)]">
          Select your Indian state and district to view hydrological telemetry, safe evacuation steps, and 3D simulation models.
        </p>
      </div>

      {/* Main Input Form Card with Crisp Mosaic Framing & Frosted Glass */}
      <div className="mosaic-card rounded-2xl p-6 sm:p-8 bg-white/95 backdrop-blur-md border border-white/80 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationError && (
            <div className="p-3 bg-red-50/90 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-teal-950 mb-1.5">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-teal-600/70 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sohini Pallapothu"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-teal-900/15 rounded-xl text-teal-950 font-medium focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 outline-hidden transition-all placeholder:text-teal-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-teal-950 mb-1.5">
                Mobile Number (for SOS alerts)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-teal-600/70 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-teal-900/15 rounded-xl text-teal-950 font-medium focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 outline-hidden transition-all placeholder:text-teal-400"
                />
              </div>
            </div>
          </div>

          {/* State Selection */}
          <div>
            <label className="block text-xs font-semibold text-teal-950 mb-1.5">
              Select an Indian State / Union Territory
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-teal-600/70 absolute left-3.5 top-3" />
              <select
                value={selectedStateId}
                onChange={handleStateChange}
                id="select-indian-state"
                className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-white border border-teal-900/15 rounded-xl text-teal-950 font-semibold focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 outline-hidden transition-all cursor-pointer"
              >
                <option value="">Select a state</option>
                <optgroup label="States of India (28)">
                  {ALL_INDIAN_STATES.filter((s) => s.type === "State").map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Union Territories (8)">
                  {ALL_INDIAN_STATES.filter((s) => s.type === "Union Territory").map((ut) => (
                    <option key={ut.id} value={ut.id}>
                      {ut.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* District Selection */}
          <div>
            <label className="block text-xs font-semibold text-teal-950 mb-1.5">
              Select a District / Flood Area
            </label>
            <select
              value={selectedDistrictName}
              onChange={handleDistrictChange}
              disabled={!selectedStateId}
              id="select-district"
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl font-semibold transition-all ${
                !selectedStateId
                  ? "border-teal-100 text-teal-400 cursor-not-allowed bg-teal-50/40"
                  : "border-teal-900/15 text-teal-950 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 cursor-pointer"
              }`}
            >
              <option value="">
                {selectedStateId ? "Select a district" : "First choose a state above"}
              </option>
              {selectedStateObj?.districts.map((dist, idx) => (
                <option key={idx} value={dist.name}>
                  {dist.name}
                </option>
              ))}
            </select>
            {selectedStateObj && (
              <p className="text-[11px] text-teal-700/80 mt-1.5 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                <span>River Basins: {selectedStateObj.riverBasins} ({selectedStateObj.floodZone})</span>
              </p>
            )}
          </div>

          {/* Action Buttons with high-contrast tactile design */}
          <div className="pt-3 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="submit"
                id="btn-submit-check-severity"
                className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-white text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-sm active:scale-[0.99]"
              >
                <span>Check Flood Severity</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="btn-submit-show-details-3d"
                onClick={() => handleTriggerAction("severity")}
                className="w-full py-3 bg-white hover:bg-teal-50/70 text-teal-950 border border-teal-900/15 text-sm font-semibold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-xs active:scale-[0.99]"
              >
                <BarChart3 className="w-4 h-4 text-teal-700" />
                <span>Show the details (3D Graph &amp; Stats)</span>
              </button>
            </div>

            {/* Prominent Third Button for Realistic Simulations & Drainage Failure Model */}
            <button
              type="button"
              id="btn-submit-realistic-simulations"
              onClick={() => handleTriggerAction("simulations")}
              className="w-full py-3 bg-gradient-to-r from-teal-50/90 via-emerald-50/90 to-cyan-50/90 hover:from-teal-100 hover:to-emerald-100 text-teal-950 border border-teal-300/80 text-sm font-semibold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-xs active:scale-[0.99]"
            >
              <Activity className="w-4 h-4 text-teal-700" />
              <span>Realistic Simulations (Normal, Heavy &amp; Blocked Drainage Channel)</span>
              <ArrowRight className="w-4 h-4 text-teal-700" />
            </button>
          </div>
        </form>
      </div>

      {/* Helpful shortcut to NGO Relief Fund */}
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={onNavigateToDonations}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white/70 text-xs font-semibold text-teal-950 shadow-md hover:bg-white hover:shadow-lg transition-all cursor-pointer"
        >
          <span>Looking to donate to verified flood relief funds or NGOs? Click here ➔</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { UserProfile, SeverityLevel, CommunityReport } from "../types";
import { 
  IndianState, 
  DistrictInfo, 
  SEVERITY_MEASURES, 
  GOVERNMENT_AUTHORITIES, 
  INITIAL_COMMUNITY_WARNINGS 
} from "../data/floodData";
import { DistrictTelemetryData } from "../data/telemetryEngine";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Radio,
  Copy,
  Check,
  Send,
  LifeBuoy,
  PlusCircle,
  X,
  HeartHandshake
} from "lucide-react";

interface SafetyGuidelinesPageProps {
  user: UserProfile;
  selectedState: IndianState;
  selectedDistrict: DistrictInfo;
  telemetry: DistrictTelemetryData;
  onPrevPage: () => void;
  onNavigateToDonations: () => void;
}

export const SafetyGuidelinesPage: React.FC<SafetyGuidelinesPageProps> = ({
  user,
  selectedState,
  selectedDistrict,
  telemetry,
  onPrevPage,
  onNavigateToDonations
}) => {
  // Ensure the page always opens from the very top
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const [completedMeasures, setCompletedMeasures] = useState<Record<string, boolean>>({});
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Community warnings state
  const [communityWarnings, setCommunityWarnings] = useState<CommunityReport[]>(INITIAL_COMMUNITY_WARNINGS as any);
  const [isWarningFormOpen, setIsWarningFormOpen] = useState<boolean>(false);
  const [hazardType, setHazardType] = useState<CommunityReport["hazardType"]>("Road Submerged");
  const [waterDepthCm, setWaterDepthCm] = useState<number>(Math.round(telemetry.initialWaterLevel * 100));
  const [streetLandmark, setStreetLandmark] = useState<string>("");
  const [warningDesc, setWarningDesc] = useState<string>("");
  const [urgentHelp, setUrgentHelp] = useState<boolean>(telemetry.severityLevel === 3);
  const [broadcastSuccess, setBroadcastSuccess] = useState<boolean>(false);

  const severityData = SEVERITY_MEASURES[telemetry.severityLevel];

  const toggleMeasure = (id: string) => {
    setCompletedMeasures((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  const handleVerifyWarning = (id: string) => {
    setCommunityWarnings((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            verifiedCount: w.verifiedCount + (w.hasUserVerified ? -1 : 1),
            hasUserVerified: !w.hasUserVerified
          };
        }
        return w;
      })
    );
  };

  const handlePostWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetLandmark.trim() || !warningDesc.trim()) return;

    const newReport: CommunityReport = {
      id: `rep-${Date.now()}`,
      authorName: user.name || "Citizen",
      authorRole: user.role || "Citizen",
      location: `${streetLandmark.trim()}, ${selectedDistrict.name}, ${selectedState.name}`,
      severityLevel: telemetry.severityLevel,
      waterDepthCm,
      hazardType,
      description: warningDesc.trim(),
      timestamp: "Just now",
      verifiedCount: 1,
      hasUserVerified: true,
      urgentHelpRequested: urgentHelp
    };

    setCommunityWarnings([newReport, ...communityWarnings]);
    setIsWarningFormOpen(false);
    setStreetLandmark("");
    setWarningDesc("");
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Step Header & Location Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-900/10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200/80 rounded-lg text-xs font-bold tracking-wider">
            STEP 4 OF 4: SAFETY GUIDELINES &amp; HELPLINES
          </span>
          <span className="text-xs font-semibold text-teal-800/80">
            {selectedDistrict.name}, {selectedState.name}
          </span>
        </div>

        {/* Previous & Next quick buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevPage}
            id="guide-btn-prev-top"
            className="px-3 py-1.5 rounded-lg border border-teal-900/15 bg-white hover:bg-teal-50/70 text-xs font-semibold text-teal-950 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Affected Population</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToDonations}
            id="guide-btn-next-top"
            className="px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Relief Donations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. What We Should Do (Safety Guidelines) */}
      <section className="mosaic-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-teal-900/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 border border-teal-200 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-teal-950 font-['Outfit',sans-serif]">
                What We Should Do Now
              </h3>
              <p className="text-xs text-teal-800/80">
                Actionable safety measures tailored for {telemetry.severityLabel} in {selectedDistrict.name}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200/80">
            Click to check off
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {severityData.measures.map((m) => {
            const isDone = !!completedMeasures[m.id];
            return (
              <div
                key={m.id}
                onClick={() => toggleMeasure(m.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 shadow-2xs ${
                  isDone
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                    : "bg-white/95 border-teal-900/10 hover:border-teal-400 text-teal-950"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    isDone
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-teal-300 bg-white"
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        m.priority === "Critical"
                          ? "bg-red-50 text-red-700 border border-red-200/70"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                      }`}
                    >
                      {m.priority}
                    </span>
                    <span className="text-xs font-bold text-teal-950 truncate font-['Outfit',sans-serif]">
                      {m.title}
                    </span>
                  </div>
                  <p className="text-xs text-teal-800/80 leading-relaxed">
                    {m.instruction}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Safety Government Helplines */}
      <section className="mosaic-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-teal-900/10">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 flex items-center justify-center font-bold">
            <PhoneCall className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-teal-950 font-['Outfit',sans-serif]">
              Safety Government Helplines
            </h3>
            <p className="text-xs text-teal-800/80">
              Official Indian flood rescue numbers, NDRF boat units &amp; state control rooms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {GOVERNMENT_AUTHORITIES.map((auth, idx) => (
            <div
              key={idx}
              className="bg-white/95 rounded-xl p-4 border border-teal-900/10 flex flex-col justify-between space-y-3 shadow-2xs"
            >
              <div>
                <div className="text-xs font-bold text-teal-950 font-['Outfit',sans-serif]">{auth.agencyName}</div>
                <div className="text-[11px] font-medium text-teal-700/80 mt-0.5">
                  {auth.jurisdiction}
                </div>
                <p className="text-xs text-teal-800/80 mt-2 leading-relaxed">
                  {auth.role}
                </p>
              </div>

              <div className="pt-2 border-t border-teal-900/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-teal-700/80">Hotline</div>
                  <div className="text-sm font-black text-red-600 font-['Outfit',sans-serif]">{auth.hotline}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(auth.hotline)}
                    className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors border border-amber-200/80 cursor-pointer shadow-2xs"
                    title="Copy hotline"
                  >
                    {copiedPhone === auth.hotline ? (
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={`tel:${auth.hotline.split(" ")[0].replace(/[^0-9+]/g, "")}`}
                    className="px-3 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Warn Nearby Regions (Community Flood Reports) */}
      <section className="mosaic-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-teal-900/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200/80 text-red-700 flex items-center justify-center font-bold">
              <Radio className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-teal-950 font-['Outfit',sans-serif]">
                Community Warning Reports
              </h3>
              <p className="text-xs text-teal-800/80">
                Alert neighbors in nearby wards about submerged streets or road blocks.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsWarningFormOpen(!isWarningFormOpen)}
            id="btn-open-warning-form"
            className="px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {isWarningFormOpen ? <X className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
            <span>{isWarningFormOpen ? "Close Form" : "Post a Warning"}</span>
          </button>
        </div>

        {/* Success Notification */}
        {broadcastSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Your community warning has been broadcasted to nearby citizens!</span>
          </div>
        )}

        {/* Warning Form */}
        {isWarningFormOpen && (
          <form onSubmit={handlePostWarning} className="p-4 bg-white/95 rounded-xl border border-teal-900/15 space-y-3 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-teal-950 mb-1 font-['Outfit',sans-serif]">
                  Street / Ward Landmark
                </label>
                <input
                  type="text"
                  value={streetLandmark}
                  onChange={(e) => setStreetLandmark(e.target.value)}
                  placeholder="e.g. Near Railway Gate / Market Chowk"
                  required
                  className="w-full px-3 py-2 text-xs bg-teal-50/50 border border-teal-900/15 rounded-lg text-teal-950 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-teal-950 mb-1 font-['Outfit',sans-serif]">
                  Hazard Category
                </label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-teal-50/50 border border-teal-900/15 rounded-lg text-teal-950 focus:outline-none focus:border-teal-600"
                >
                  <option value="Road Submerged">Road Submerged</option>
                  <option value="Bridge Under Water">Bridge Under Water</option>
                  <option value="Drainage Blocked">Drainage Blocked</option>
                  <option value="Power Line Down">Power Line Down</option>
                  <option value="Stranded Persons">Stranded Persons / Rescue Needed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-950 mb-1 font-['Outfit',sans-serif]">
                Warning Details
              </label>
              <textarea
                value={warningDesc}
                onChange={(e) => setWarningDesc(e.target.value)}
                placeholder="Describe water depth, vehicle access, and any stranded families..."
                rows={2}
                required
                className="w-full px-3 py-2 text-xs bg-teal-50/50 border border-teal-900/15 rounded-lg text-teal-950 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-red-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={urgentHelp}
                  onChange={(e) => setUrgentHelp(e.target.checked)}
                  className="rounded text-red-600 accent-red-600"
                />
                <span>Flag as Urgent (Rescue Boats Needed)</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Alert</span>
              </button>
            </div>
          </form>
        )}

        {/* List of Community Reports */}
        <div className="space-y-3">
          {communityWarnings.map((w) => (
            <div
              key={w.id}
              className="bg-white/95 rounded-xl p-4 border border-teal-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-red-50 border border-red-200/70 text-red-700">
                    {w.hazardType}
                  </span>
                  <span className="text-xs font-bold text-teal-950 font-['Outfit',sans-serif]">{w.location}</span>
                  <span className="text-[11px] text-teal-700/80">&bull; {w.timestamp}</span>
                </div>
                <p className="text-xs text-teal-800/80 leading-relaxed">
                  {w.description}
                </p>
                <div className="text-[11px] text-teal-700/80 mt-1">
                  Water depth: <strong>{w.waterDepthCm} cm</strong> &bull; Reported by {w.authorName}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleVerifyWarning(w.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                    w.hasUserVerified
                      ? "bg-teal-800 text-white border-teal-800"
                      : "bg-teal-50/50 text-teal-950 border-teal-900/15 hover:bg-teal-50"
                  }`}
                >
                  Verify ({w.verifiedCount})
                </button>

                {w.urgentHelpRequested && (
                  <a
                    href="tel:1078"
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-red-700 shadow-2xs"
                  >
                    <LifeBuoy className="w-3.5 h-3.5" />
                    <span>Rescue</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consistent Bottom Navigation Bar with Matching Previous & Next Clicking Buttons */}
      <div className="p-4 mosaic-card rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevPage}
          id="guide-btn-prev-bottom"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-teal-900/15 bg-white hover:bg-teal-50/70 text-xs font-semibold text-teal-950 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous: Affected Population</span>
        </button>

        <div className="text-[11px] text-teal-700/80 font-medium text-center hidden md:block">
          Step 4 of 4 &bull; Final Step: Support verified NGOs &amp; emergency relief funds
        </div>

        <button
          type="button"
          onClick={onNavigateToDonations}
          id="guide-btn-next-bottom"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-sm"
        >
          <HeartHandshake className="w-4 h-4 text-teal-300" />
          <span>Next: Relief Funds &amp; NGOs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

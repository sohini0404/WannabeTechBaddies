import React, { useState } from "react";
import { UserProfile, SimulationScenarioKey } from "./types";
import { ALL_INDIAN_STATES, IndianState, DistrictInfo } from "./data/floodData";
import { getDistrictTelemetry } from "./data/telemetryEngine";
import { Navbar, AppPage } from "./components/Navbar";
import { CheckLocationPage } from "./components/CheckLocationPage";
import { SeverityResultsPage } from "./components/SeverityResultsPage";
import { RealisticSimulationsPage } from "./components/RealisticSimulationsPage";
import { AffectedPopulationPage } from "./components/AffectedPopulationPage";
import { SafetyGuidelinesPage } from "./components/SafetyGuidelinesPage";
import { NgoReliefDonationsPage } from "./components/NgoReliefDonationsPage";
import { SignInModal } from "./components/SignInModal";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Waves, HeartHandshake, PhoneCall, ShieldCheck } from "lucide-react";
import waterBgUrl from "./assets/images/water_caustics_bg_1789844586208.jpg";

export default function App() {
  // User state with local persistence
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("flowshield_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      name: "Enter Your Name",
      email: "abc@gmail.com",
      phone: "+91 xxxxx xxxxx",
      role: "Citizen",
      location: "Select Your Location",
      smsAlertsEnabled: true,
      isSignedIn: true
    };
  });

  const [currentPage, setCurrentPage] = useState<AppPage>("check-location");
  const [selectedState, setSelectedState] = useState<IndianState | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo | null>(null);
  const [activeScenarioKey, setActiveScenarioKey] = useState<SimulationScenarioKey>("normal");
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);

  // Helper to ensure window & document scroll position resets to the very top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  const handleNavigate = (page: AppPage) => {
    scrollToTop();
    setCurrentPage(page);
  };

  // Whenever currentPage changes, ensure the newly opened page starts from the very top
  React.useEffect(() => {
    scrollToTop();
    const rafId = requestAnimationFrame(() => {
      scrollToTop();
    });
    const t1 = setTimeout(scrollToTop, 40);
    const t2 = setTimeout(scrollToTop, 120);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [currentPage]);

  // Persist user changes
  const handleSaveUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem("flowshield_user", JSON.stringify(updatedUser));
  };

  const handleUpdatePartialUser = (partial: Partial<UserProfile>) => {
    const updated = { ...user, ...partial };
    handleSaveUser(updated);
  };

  // Called from CheckLocationPage
  const handleCheckSeverity = (state: IndianState, district: DistrictInfo) => {
    setSelectedState(state);
    setSelectedDistrict(district);
    scrollToTop();
    setCurrentPage("severity-graph"); // Step 1
  };

  const handleOpenSimulations = (state: IndianState, district: DistrictInfo) => {
    setSelectedState(state);
    setSelectedDistrict(district);
    scrollToTop();
    setCurrentPage("simulations"); // Step 2
  };

  // Compute telemetry if district is active
  const telemetry = selectedDistrict ? getDistrictTelemetry(selectedDistrict) : null;

  return (
    <div
      className={`min-h-screen flex flex-col text-[#0C261F] selection:bg-teal-700 selection:text-white font-['Plus_Jakarta_Sans',sans-serif] relative ${
        currentPage === "check-location" ? "" : "bg-[#F6FAF9] bg-water-grid"
      }`}
    >
      {/* Front Page Water Caustics Background (User Uploaded Ripple Image) */}
      {currentPage === "check-location" && (
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{
            backgroundImage: `url(${waterBgUrl})`,
          }}
        >
          {/* Subtle aquatic ambient light vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-teal-950/20 via-transparent to-teal-950/30" />
        </div>
      )}

      {/* Header Navigation with aquatic mosaic & grid palette */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleNavigate}
        user={user}
        onOpenSignIn={() => setIsSignInOpen(true)}
        hasSeverityAssessed={!!(selectedState && selectedDistrict)}
        activeLocationLabel={
          selectedDistrict && selectedState
            ? `${selectedDistrict.name}, ${selectedState.name}`
            : undefined
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 relative z-10">
        {/* Page 0: Location Entry */}
        {currentPage === "check-location" && (
          <CheckLocationPage
            user={user}
            onUpdateUser={handleUpdatePartialUser}
            onCheckSeverity={handleCheckSeverity}
            onOpenSimulations={handleOpenSimulations}
            onNavigateToDonations={() => handleNavigate("donations")}
          />
        )}

        {/* Step 1: Flood Severity & 3D Telemetry Graph */}
        {currentPage === "severity-graph" && selectedState && selectedDistrict && (
          <ErrorBoundary
            fallbackTitle="Telemetry Visualizer Notice"
            fallbackMessage="An unexpected rendering issue occurred in the 3D graphics view. Click below to reload."
          >
            <SeverityResultsPage
              user={user}
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              onBackToLocation={() => handleNavigate("check-location")}
              onNextToSimulations={() => handleNavigate("simulations")}
            />
          </ErrorBoundary>
        )}

        {/* Step 2: Realistic Simulations (Normal, Heavy, Blocked Drainage Channel) */}
        {currentPage === "simulations" && selectedState && selectedDistrict && telemetry && (
          <ErrorBoundary
            fallbackTitle="Simulation Visualizer Notice"
            fallbackMessage="An unexpected rendering issue occurred in the simulation view. Click below to reload."
          >
            <RealisticSimulationsPage
              districtName={selectedDistrict.name}
              stateName={selectedState.name}
              telemetry={telemetry}
              activeScenarioKey={activeScenarioKey}
              onChangeScenarioKey={setActiveScenarioKey}
              onPrevPage={() => handleNavigate("severity-graph")}
              onNextPage={() => handleNavigate("affected-population")}
            />
          </ErrorBoundary>
        )}

        {/* Step 3: Estimated Affected Population & Demographic Vulnerability */}
        {currentPage === "affected-population" && selectedState && selectedDistrict && telemetry && (
          <AffectedPopulationPage
            districtName={selectedDistrict.name}
            stateName={selectedState.name}
            telemetry={telemetry}
            activeScenarioKey={activeScenarioKey}
            onChangeScenarioKey={setActiveScenarioKey}
            onPrevPage={() => handleNavigate("simulations")}
            onNextPage={() => handleNavigate("safety-measures")}
          />
        )}

        {/* Step 4: Safety Guidelines, Helplines & Neighbor Warnings */}
        {currentPage === "safety-measures" && selectedState && selectedDistrict && telemetry && (
          <SafetyGuidelinesPage
            user={user}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            telemetry={telemetry}
            onPrevPage={() => handleNavigate("affected-population")}
            onNavigateToDonations={() => handleNavigate("donations")}
          />
        )}

        {/* Step 5: Verified Relief Funds & NGO Donations */}
        {currentPage === "donations" && (
          <NgoReliefDonationsPage
            user={user}
            onBackToLocation={() =>
              handleNavigate(selectedDistrict ? "safety-measures" : "check-location")
            }
          />
        )}
      </main>

      {/* Fresh Aquatic Footer with Water Grid & Deep Spruce Accents */}
      <footer className="mt-auto border-t border-teal-900/10 bg-white/90 backdrop-blur-md text-teal-900 py-4 text-xs">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-800 flex items-center justify-center text-white">
              <Waves className="w-3.5 h-3.5 text-teal-200" />
            </div>
            <div>
              <span className="font-extrabold text-teal-950 font-['Outfit',sans-serif]">
                FlowShield India
              </span>
              <span className="ml-2 text-[11px] text-teal-700/80 font-medium">
                Covering all 28 Indian States &amp; 8 Union Territories
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-teal-900">
            <button
              onClick={() => handleNavigate("check-location")}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              Check Severity
            </button>
            <span className="text-teal-300">&bull;</span>
            <button
              onClick={() => handleNavigate("donations")}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              Relief Funds &amp; NGOs
            </button>
          </div>

          <div className="text-[11px] text-teal-700/90 font-medium flex items-center gap-2">
            <span>NDRF: <strong className="text-red-700 font-bold">1078</strong></span>
            <span className="text-teal-300">&bull;</span>
            <span>State: <strong className="text-red-700 font-bold">1070</strong></span>
            <span className="text-teal-300">&bull;</span>
            <span>Emergency: <strong className="text-red-700 font-bold">112</strong></span>
          </div>
        </div>
      </footer>

      {/* User Details & Profile Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        currentUser={user}
        onSaveUser={handleSaveUser}
      />
    </div>
  );
}

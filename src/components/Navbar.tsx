import React from "react";
import { UserProfile } from "../types";
import {
  Waves,
  MapPin,
  HeartHandshake,
  ShieldAlert,
  PhoneCall,
  User,
  Activity,
  Users,
  ShieldCheck,
  BarChart3
} from "lucide-react";

export type AppPage =
  | "check-location"
  | "severity-graph"
  | "simulations"
  | "affected-population"
  | "safety-measures"
  | "donations";

interface NavbarProps {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  user: UserProfile;
  onOpenSignIn: () => void;
  hasSeverityAssessed: boolean;
  activeLocationLabel?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  user,
  onOpenSignIn,
  hasSeverityAssessed,
  activeLocationLabel
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-teal-900/10 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Brand Logo & Name in Deep River Pine & Aqua Mosaic Tile */}
          <div
            onClick={() => setCurrentPage("check-location")}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-700 to-teal-950 flex items-center justify-center text-white shadow-xs border border-teal-600/30 group-hover:scale-105 transition-transform">
              <Waves className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-teal-950 font-['Outfit',sans-serif]">
                  FlowShield
                </span>
                <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/80">
                  India Live
                </span>
              </div>
              <p className="text-[11px] text-teal-700/80 font-medium hidden md:block">
                {activeLocationLabel ? activeLocationLabel : "Hydrological Telemetry, 3D Simulations & Relief"}
              </p>
            </div>
          </div>

          {/* Page Navigation Tabs with Mosaic Grid aesthetic */}
          <nav className="flex items-center gap-1 bg-teal-50/70 p-1 rounded-xl border border-teal-900/10 overflow-x-auto max-w-full">
            <button
              onClick={() => setCurrentPage("check-location")}
              id="nav-btn-check-location"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                currentPage === "check-location"
                  ? "bg-teal-800 text-white shadow-xs"
                  : "text-teal-900 hover:bg-teal-100/70"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Location</span>
            </button>

            {hasSeverityAssessed && (
              <>
                <button
                  onClick={() => setCurrentPage("severity-graph")}
                  id="nav-btn-severity-graph"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    currentPage === "severity-graph"
                      ? "bg-teal-800 text-white shadow-xs"
                      : "text-teal-900 hover:bg-teal-100/70"
                  }`}
                  title="Step 1: 3D Telemetry Graph"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">1. 3D Telemetry</span>
                  <span className="sm:hidden">1. Telemetry</span>
                </button>

                <button
                  onClick={() => setCurrentPage("simulations")}
                  id="nav-btn-simulations"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    currentPage === "simulations"
                      ? "bg-teal-800 text-white shadow-xs"
                      : "text-teal-900 hover:bg-teal-100/70"
                  }`}
                  title="Step 2: Realistic Simulations (Normal, Heavy & Blocked Drainage)"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">2. Simulations</span>
                  <span className="sm:hidden">2. Sims</span>
                </button>

                <button
                  onClick={() => setCurrentPage("affected-population")}
                  id="nav-btn-affected-population"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    currentPage === "affected-population"
                      ? "bg-teal-800 text-white shadow-xs"
                      : "text-teal-900 hover:bg-teal-100/70"
                  }`}
                  title="Step 3: Estimated Affected Population"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">3. Population</span>
                  <span className="sm:hidden">3. Pop</span>
                </button>

                <button
                  onClick={() => setCurrentPage("safety-measures")}
                  id="nav-btn-safety-measures"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    currentPage === "safety-measures"
                      ? "bg-teal-800 text-white shadow-xs"
                      : "text-teal-900 hover:bg-teal-100/70"
                  }`}
                  title="Step 4: Safety Steps & Helplines"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">4. Safety Steps</span>
                  <span className="sm:hidden">4. Safety</span>
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage("donations")}
              id="nav-btn-donations"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                currentPage === "donations"
                  ? "bg-teal-800 text-white shadow-xs"
                  : "text-teal-900 hover:bg-teal-100/70"
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Relief Funds</span>
              <span className="sm:hidden">Donate</span>
            </button>
          </nav>

          {/* Quick 1078 helpline & User profile badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href="tel:1078"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-100/70 transition-colors"
              title="NDRF Emergency Rescue Toll-Free Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>1078</span>
            </a>

            <button
              onClick={onOpenSignIn}
              id="nav-btn-user-profile"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-teal-50/70 border border-teal-900/15 rounded-xl text-xs font-semibold text-teal-950 transition-colors cursor-pointer shadow-2xs"
            >
              <div className="w-5 h-5 rounded-full bg-teal-800 text-white flex items-center justify-center text-[10px] font-bold">
                {user.name.charAt(0) || "U"}
              </div>
              <span className="hidden md:inline truncate max-w-[80px]">
                {user.name.split(" ")[0]}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

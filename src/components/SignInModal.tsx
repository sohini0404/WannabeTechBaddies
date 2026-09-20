import React, { useState } from "react";
import { UserProfile, UserRole } from "../types";
import { User, Mail, Phone, MapPin, Waves, X, CheckCircle2 } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveUser: (user: UserProfile) => void;
  onLogout?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
  onLogout
}) => {
  const [name, setName] = useState(currentUser.name || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [phone, setPhone] = useState(currentUser.phone || "+91 98765 43210");
  const [role, setRole] = useState<UserRole>(currentUser.role || "Citizen");
  const [location, setLocation] = useState(currentUser.location || "Silchar, Assam");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    onSaveUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "+91 98765 43210",
      role,
      location,
      smsAlertsEnabled: true,
      isSignedIn: true
    });
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3525]/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md bg-[#FFFDF0] border-2 border-[#EADFCB] rounded-3xl shadow-xl overflow-hidden text-[#4A3525]"
        id="sign-in-dialog"
      >
        {/* Header in Brown & Baby Green */}
        <div className="bg-[#5C4033] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Waves className="w-4 h-4 text-[#C8E6C9]" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight font-['Comfortaa','Fredoka',cursive]">
                Citizen Emergency Profile
              </h2>
              <p className="text-[11px] text-[#E5DAC6]">NDRF & SMS Flood Alerts Registration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#E5DAC6] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#5C4033] mb-1">
              Your Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-[#8B6E58]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sohini Pallapothu"
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#E2D5C3] rounded-xl text-xs text-[#4A3525] font-semibold focus:border-[#5C4033] outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C4033] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#8B6E58]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sohinipallapothu@gmail.com"
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#E2D5C3] rounded-xl text-xs text-[#4A3525] font-semibold focus:border-[#5C4033] outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C4033] mb-1">
              Mobile Number (India +91)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[#8B6E58]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#E2D5C3] rounded-xl text-xs text-[#4A3525] font-semibold focus:border-[#5C4033] outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C4033] mb-1">
              Role in Flood Response
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Citizen", "Volunteer", "Authority"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-2 rounded-xl border-2 text-xs font-bold text-center transition-all cursor-pointer ${
                    role === r
                      ? "bg-[#5C4033] text-white border-[#5C4033] shadow-xs"
                      : "bg-white text-[#5C4033] border-[#EADFCB] hover:bg-[#FFFBEA]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#5C4033] hover:bg-[#462F24] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Profile Details
            </button>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2.5 bg-white hover:bg-[#FEF2F2] border-2 border-[#E2D5C3] hover:border-[#FECACA] text-[#991B1B] text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

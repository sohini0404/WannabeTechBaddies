import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Lock, Waves, X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: () => void;
}

type Mode = "login" | "signup";

function friendlyError(code: unknown): string {
  const c = typeof code === "string" ? code : (code as { code?: string })?.code || "";
  switch (c) {
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account already exists with this email.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/invalid-api-key":
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
      return "Firebase is not configured. Add the VITE_FIREBASE_* environment variables.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticated }) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const done = () => {
    setError(null);
    setBusy(false);
    setPassword("");
    onAuthenticated?.();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(name.trim(), email.trim(), password);
      }
      done();
    } catch (err) {
      console.error("[v0] Email auth failed:", err);
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
      done();
    } catch (err) {
      console.error("[v0] Google sign-in failed:", err);
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3525]/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-[#FFFDF0] border-2 border-[#EADFCB] rounded-3xl shadow-xl overflow-hidden text-[#4A3525]"
        id="auth-dialog"
      >
        <div className="bg-[#5C4033] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Waves className="w-4 h-4 text-[#C8E6C9]" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight font-['Comfortaa','Fredoka',cursive]">
                {mode === "login" ? "Sign In to FlowShield" : "Create Your Account"}
              </h2>
              <p className="text-[11px] text-[#E5DAC6]">Secure flood alerts &amp; community reporting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#E5DAC6] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
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

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold text-[#5C4033] mb-1">Your Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-[#8B6E58]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sohini Pallapothu"
                  className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#E2D5C3] rounded-xl text-xs text-[#4A3525] font-semibold focus:border-[#5C4033] outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#5C4033] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#8B6E58]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#E2D5C3] rounded-xl text-xs text-[#4A3525] font-semibold focus:border-[#5C4033] outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C4033] mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#8B6E58]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#E2D5C3] rounded-xl text-xs text-[#4A3525] font-semibold focus:border-[#5C4033] outline-hidden"
              />
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 bg-[#5C4033] hover:bg-[#462F24] disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {busy ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-[#EADFCB]" />
            <span className="text-[10px] font-bold uppercase text-[#8B6E58]">or</span>
            <div className="flex-1 h-px bg-[#EADFCB]" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full py-2.5 bg-white hover:bg-[#FFFBEA] disabled:opacity-60 border-2 border-[#E2D5C3] text-[#4A3525] text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-[11px] text-[#8B6E58] pt-1">
            {mode === "login" ? "New to FlowShield?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
              }}
              className="font-bold text-[#5C4033] underline cursor-pointer"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

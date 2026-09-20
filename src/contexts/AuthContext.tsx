import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as fbUpdateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { UserProfile, UserRole } from "../types";

// A signed-out visitor still needs a UserProfile-shaped object so the
// existing UI (which reads user.name, user.role, etc.) keeps working.
const GUEST_PROFILE: UserProfile = {
  name: "Guest",
  email: "",
  phone: "",
  role: "Citizen",
  location: "",
  smsAlertsEnabled: false,
  isSignedIn: false,
};

interface AuthContextValue {
  firebaseUser: User | null;
  profile: UserProfile;
  isAuthenticated: boolean;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (partial: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>(GUEST_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // When Firebase env vars are not set, auth is null. Render the app as a
    // signed-out guest instead of hanging on the loading state forever.
    if (!auth || !db) {
      setLoading(false);
      return;
    }
    // Narrowed non-null references for use inside the async callback.
    const authInstance = auth;
    const dbInstance = db;

    const unsub = onAuthStateChanged(authInstance, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (!fbUser) {
        setProfile(GUEST_PROFILE);
        setLoading(false);
        return;
      }

      // Load (or lazily create) the user's document in the `users` collection.
      let data: Partial<UserProfile> = {};
      try {
        const ref = doc(db, "users", fbUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          data = snap.data() as Partial<UserProfile>;
        } else {
          const created: Partial<UserProfile> & { createdAt: unknown } = {
            name: fbUser.displayName || "Citizen",
            email: fbUser.email || "",
            phone: "",
            role: "Citizen",
            location: "",
            smsAlertsEnabled: true,
            createdAt: serverTimestamp(),
          };
          await setDoc(ref, created, { merge: true });
          data = created;
        }
      } catch (e) {
        console.error("[v0] Failed to load user profile from Firestore:", e);
      }

      setProfile({
        name: data.name || fbUser.displayName || "Citizen",
        email: data.email || fbUser.email || "",
        phone: data.phone || "",
        role: (data.role as UserRole) || "Citizen",
        location: data.location || "",
        smsAlertsEnabled: data.smsAlertsEnabled ?? true,
        isSignedIn: true,
      });
      setLoading(false);
    });

    return unsub;
  }, []);

  const requireFirebase = () => {
    if (!auth || !db) {
      throw new Error(
        "Firebase is not configured. Add the VITE_FIREBASE_* environment variables to enable authentication.",
      );
    }
    return { auth, db };
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { auth } = requireFirebase();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
    const { auth, db } = requireFirebase();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await fbUpdateProfile(cred.user, { displayName: name });
    }
    await setDoc(
      doc(db, "users", cred.user.uid),
      {
        name: name || "Citizen",
        email,
        phone: "",
        role: "Citizen",
        location: "",
        smsAlertsEnabled: true,
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    // Ensure a users doc exists for Google-authenticated accounts.
    await setDoc(
      doc(db, "users", cred.user.uid),
      {
        name: cred.user.displayName || "Citizen",
        email: cred.user.email || "",
        smsAlertsEnabled: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = async (partial: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
    const current = auth.currentUser;
    if (!current) return;
    try {
      await setDoc(
        doc(db, "users", current.uid),
        { ...partial, updatedAt: serverTimestamp() },
        { merge: true },
      );
      if (partial.name && partial.name !== current.displayName) {
        await fbUpdateProfile(current, { displayName: partial.name });
      }
    } catch (e) {
      console.error("[v0] Failed to persist profile update to Firestore:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        isAuthenticated: !!firebaseUser,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

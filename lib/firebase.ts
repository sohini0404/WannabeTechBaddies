import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// All Firebase configuration values come from environment variables.
// In a Vite app these MUST be prefixed with `VITE_` so they are exposed
// to the client bundle via `import.meta.env`.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Whether the required Firebase env vars are present. Until the user adds
// them (locally or in Vercel), Firebase must NOT be initialized — calling
// getAuth()/getFirestore() with an undefined apiKey throws synchronously
// (auth/invalid-api-key) and would crash the whole app on load.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  // Avoid re-initializing during HMR / repeated imports.
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} else if (import.meta.env.DEV) {
  console.warn(
    "[v0] Firebase env vars are not set — auth and Firestore are disabled. " +
      "Add the VITE_FIREBASE_* variables to enable them.",
  );
}

export { app, auth, db, googleProvider };

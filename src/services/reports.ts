import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CommunityReport, SeverityLevel, UserRole } from "../types";

const FLOOD_REPORTS = "flood_reports";

export interface NewFloodReport {
  authorName: string;
  authorRole: UserRole;
  location: string;
  state: string;
  district: string;
  severityLevel: SeverityLevel;
  waterDepthCm: number;
  hazardType: CommunityReport["hazardType"];
  description: string;
  urgentHelpRequested: boolean;
}

/**
 * Persist a submitted flood report into the `flood_reports` collection.
 * `uid` is the authoring Firebase user id (or null for guests).
 */
export async function addFloodReport(report: NewFloodReport, uid: string | null) {
  if (!db) {
    throw new Error(
      "Firebase is not configured. Add the VITE_FIREBASE_* environment variables to persist reports.",
    );
  }
  return addDoc(collection(db, FLOOD_REPORTS), {
    ...report,
    uid,
    verifiedCount: 1,
    createdAt: serverTimestamp(),
  });
}

function formatTimestamp(createdAt: unknown): string {
  if (createdAt instanceof Timestamp) {
    const date = createdAt.toDate();
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr ago`;
    return date.toLocaleDateString();
  }
  return "Just now";
}

/**
 * Live-subscribe to stored flood reports, newest first. Returns an
 * unsubscribe function. Reports are mapped into the existing CommunityReport
 * shape so the UI can render them without changes.
 */
export function subscribeToFloodReports(
  onData: (reports: CommunityReport[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  const q = query(collection(db, FLOOD_REPORTS), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const reports: CommunityReport[] = snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          authorName: (data.authorName as string) || "Citizen",
          authorRole: (data.authorRole as UserRole) || "Citizen",
          location: (data.location as string) || "",
          severityLevel: (data.severityLevel as SeverityLevel) || 1,
          waterDepthCm: (data.waterDepthCm as number) ?? 0,
          hazardType: (data.hazardType as CommunityReport["hazardType"]) || "General Warning",
          description: (data.description as string) || "",
          timestamp: formatTimestamp(data.createdAt),
          verifiedCount: (data.verifiedCount as number) ?? 1,
          hasUserVerified: false,
          urgentHelpRequested: !!data.urgentHelpRequested,
        };
      });
      onData(reports);
    },
    (error) => {
      console.error("[v0] Failed to subscribe to flood_reports:", error);
      onError?.(error);
    },
  );
}

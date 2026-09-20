import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI-driven actionable recommendations endpoint
  app.post("/api/ai-mitigation", async (req, res) => {
    try {
      const {
        location = "Metro River Basin",
        severityLevel = 2,
        rainfall = 65,
        drainageCapacity = 45,
        waterLevel = 1.4,
        elevation = 12,
        cloggedSectors = [],
        userRole = "Citizen",
      } = req.body;

      const ai = getGeminiClient();

      if (ai) {
        const prompt = `You are FLOWSHIELD, an expert municipal hydraulic emergency response coordinator.
Analyze the following flood telemetry and situation report:
- Region/Location: ${location}
- Severity Level: Level ${severityLevel} (1=Advisory/Minor, 2=Moderate/Warning, 3=Severe/Critical)
- Rainfall Intensity: ${rainfall} mm/hr
- Current Drainage Capacity: ${drainageCapacity}%
- Observed Water Depth: ${waterLevel} meters
- Terrain Elevation: ${elevation} meters above sea level
- Clogged/Overloaded Drainage Nodes: ${cloggedSectors.length > 0 ? cloggedSectors.join(", ") : "None"}
- Target Audience: ${userRole}

Return concise, high-impact tactical mitigations in JSON format:
{
  "summary": "Brief 1-2 sentence emergency hydraulic assessment",
  "tacticalActions": [
    "Specific engineering or defensive action 1 (e.g. Deploy temporary barrier at Sector B, divert 20% inflow to Reservoir C)",
    "Specific action 2",
    "Specific action 3"
  ],
  "citizenAdvisories": [
    "Actionable citizen advice 1",
    "Actionable citizen advice 2"
  ],
  "resourceDispatches": [
    {"unit": "Unit Name", "destination": "Location", "action": "Order"}
  ],
  "estimatedCrestTime": "e.g. In 45 to 90 minutes"
}
Output valid JSON only.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({ success: true, data: parsed, source: "gemini-3.8-flash" });
        }
      }

      // Rule-based fallback if no API key or offline
      const fallbackData = getRuleBasedMitigations(
        location,
        severityLevel,
        rainfall,
        drainageCapacity,
        waterLevel,
        cloggedSectors
      );

      return res.json({ success: true, data: fallbackData, source: "rule-engine" });
    } catch (error: any) {
      console.error("AI mitigation error:", error);
      const fallbackData = getRuleBasedMitigations(
        req.body?.location || "Area",
        req.body?.severityLevel || 2,
        req.body?.rainfall || 50,
        req.body?.drainageCapacity || 50,
        req.body?.waterLevel || 1.0,
        req.body?.cloggedSectors || []
      );
      return res.json({ success: true, data: fallbackData, source: "rule-engine-fallback" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FlowShield Server running on http://0.0.0.0:${PORT}`);
  });
}

function getRuleBasedMitigations(
  location: string,
  severityLevel: number,
  rainfall: number,
  drainageCapacity: number,
  waterLevel: number,
  cloggedSectors: string[]
) {
  if (severityLevel === 3 || waterLevel >= 1.5) {
    return {
      summary: `CRITICAL LEVEL 3: Rapid hydraulic surge detected in ${location}. Inundation threshold breached with water depths reaching ${waterLevel}m.`,
      tacticalActions: [
        `Trigger automated sluice gates on Main Drainage Canal to divert excess surge into Retention Basin West.`,
        `Mobilize high-volume trailer pumps (12,000 LPM) to primary arterial underpasses.`,
        cloggedSectors.length > 0
          ? `Deploy emergency desilt crew to unblock critical choke points in: ${cloggedSectors.join(", ")}.`
          : `Erect 1.2m quick-deploy demountable flood walls along low-lying riverbanks.`
      ],
      citizenAdvisories: [
        `Immediate vertical evacuation: move family, pets, and critical medical supplies to 2nd floor or above.`,
        `Turn off main electrical breaker and shut natural gas valve before water contacts conduits.`,
        `Never drive through standing floodwater ("Turn Around Don't Drown"). Undercurrents can displace vehicles in 30cm of water.`
      ],
      resourceDispatches: [
        { unit: "NDRF / Swift Water Rescue Squad 4", destination: `${location} Lowlands`, action: "Evacuation of stranded residents" },
        { unit: "Civil Defence Mobile Generator 2", destination: "Central Water Pumping Station", action: "Maintain uninterrupted sump power" }
      ],
      estimatedCrestTime: "Peak crest anticipated in 35 to 60 minutes"
    };
  } else if (severityLevel === 2 || waterLevel >= 0.6) {
    return {
      summary: `WARNING LEVEL 2: Moderate street ponding and storm drain saturation in ${location} driven by ${rainfall} mm/hr rainfall.`,
      tacticalActions: [
        `Pre-position sandbag depots at vulnerable commercial and residential thresholds.`,
        `Reroute stormwater runoff into auxiliary stormwater retention canals.`,
        `Engage secondary lift stations to maximize gravity discharge toward the coastal outfall.`
      ],
      citizenAdvisories: [
        `Install aluminum flood gate planks or double-stacked sandbags at home doorways.`,
        `Relocate ground-level electronics, documents, and vehicles to multi-story parking or higher topography.`,
        `Prepare an emergency go-bag with 72-hour drinking water, dry rations, flashlight, and first-aid kits.`
      ],
      resourceDispatches: [
        { unit: "Municipal Rapid Drainage Crew #9", destination: `${location} Main Grates`, action: "Debris clearing & trash rack flush" },
        { unit: "Traffic Management Patrol", destination: `${location} Arterial Blvd`, action: "Divert transit away from waterlogged lanes" }
      ],
      estimatedCrestTime: "Expected runoff peak in 2 hours"
    };
  } else {
    return {
      summary: `ADVISORY LEVEL 1: Localized gutter pooling and minor surface drainage delays observed in ${location}.`,
      tacticalActions: [
        `Inspect storm inlets and remove leaf litter and trash accumulation from street grates.`,
        `Check culvert intake screens to prevent debris dams.`,
        `Verify backup battery readiness for neighborhood telemetry water level sensors.`
      ],
      citizenAdvisories: [
        `Clear yard gutters, downspouts, and perimeter drains to allow free water passage.`,
        `Charge mobile phones, power banks, and ensure emergency contact numbers are saved.`,
        `Stay tuned to official weather radar broadcasts and local disaster cell updates.`
      ],
      resourceDispatches: [
        { unit: "Wards Inspection Team", destination: `${location} Catchment`, action: "Preventative culvert inspection" }
      ],
      estimatedCrestTime: "Runoff stable; minor absorption expected within 3 hours"
    };
  }
}
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, "users.json");

// Helper to read users list
const getUsersFromFile = (): any[] => {
  if (!fs.existsSync(DB_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8") || "[]");
  } catch (err) {
    return [];
  }
};

// 1. Endpoint to Save or Update User
app.post("/api/user", (req, res) => {
  const userData = req.body;

  if (!userData?.email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const users = getUsersFromFile();
  const existingIndex = users.findIndex((u) => u.email === userData.email);

  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...userData };
  } else {
    users.push(userData);
  }

  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf-8");
  return res.json({ success: true, user: userData });
});

// 2. Endpoint to Retrieve User by Email
app.get("/api/user/:email", (req, res) => {
  const users = getUsersFromFile();
  const user = users.find((u) => u.email === req.params.email);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json(user);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

startServer().catch((err) => {
  console.error("Failed to start FlowShield server:", err);
  process.exit(1);
});

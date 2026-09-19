import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { 
  BarChart3, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Layers, 
  SlidersHorizontal,
  CloudRain,
  Waves,
  Percent,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Minus,
  CheckCircle2,
  RefreshCw,
  Box
} from "lucide-react";
import { SeverityLevel, SeverityLevelLabel } from "../types";
import { calculateFloodSeverity, DistrictTelemetryData } from "../data/telemetryEngine";
import { createSafeWebGLRenderer, disposeWebGLRenderer } from "../utils/webglHelper";

interface SeverityGraphViewProps {
  districtName: string;
  stateName: string;
  telemetry: DistrictTelemetryData;
  onBackToMeasures?: () => void;
}

export const SeverityGraphView: React.FC<SeverityGraphViewProps> = ({
  districtName,
  stateName,
  telemetry,
  onBackToMeasures
}) => {
  // State for interactive simulation values (defaults to district values)
  const [rainfall, setRainfall] = useState<number>(telemetry.rainfallIntensity);
  const [waterLevel, setWaterLevel] = useState<number>(telemetry.initialWaterLevel);
  const [drainage, setDrainage] = useState<number>(telemetry.drainage);
  const [inflow, setInflow] = useState<number>(telemetry.inflow);
  const [outflow, setOutflow] = useState<number>(telemetry.outflow);

  const [selectedMetricIndex, setSelectedMetricIndex] = useState<number | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"columns" | "basin">("columns");
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);
  const [webGlError, setWebGlError] = useState<string | null>(null);
  const [renderMode, setRenderMode] = useState<"3d" | "2d">("3d");

  // Recalculate severity dynamically based on current values
  const severityResult = calculateFloodSeverity({
    rainfallIntensity: rainfall,
    initialWaterLevel: waterLevel,
    drainage,
    inflow,
    outflow
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const barsGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Orbit control interaction state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationTargetRef = useRef<{ x: number; y: number }>({ x: 0.35, y: -0.45 });
  const cameraDistanceRef = useRef<number>(14);

  // Define the 5 numerical metrics for rendering
  const metricsData = [
    {
      id: "rainfall",
      label: "Rainfall Intensity",
      shortName: "Rainfall",
      value: rainfall,
      unit: "mm/hr",
      normalizedHeight: Math.min(6, (rainfall / 180) * 5.5 + 0.5),
      color: 0x3b82f6, // Blue
      hexColor: "#3b82f6",
      icon: CloudRain,
      desc: "Measured precipitation rate over the catchment area.",
      safeRange: "< 75 mm/hr",
      status: rainfall >= 120 ? "Critical (Torrential)" : rainfall >= 75 ? "Warning (Heavy)" : "Safe (Moderate)"
    },
    {
      id: "waterLevel",
      label: "Initial Water Level",
      shortName: "Water Depth",
      value: waterLevel,
      unit: "meters",
      normalizedHeight: Math.min(6, (waterLevel / 2.5) * 5.5 + 0.5),
      color: 0x0ea5e9, // Sky Blue
      hexColor: "#0ea5e9",
      icon: Waves,
      desc: "Standing baseline river gauge depth above normal dry-season bed.",
      safeRange: "< 0.75 m",
      status: waterLevel >= 1.5 ? "Critical (> 1.5m)" : waterLevel >= 0.75 ? "Warning (0.75m - 1.5m)" : "Safe (< 0.75m)"
    },
    {
      id: "drainage",
      label: "Drainage Capacity",
      shortName: "Drainage",
      value: drainage,
      unit: "%",
      normalizedHeight: Math.min(6, (drainage / 100) * 5.5 + 0.5),
      color: 0x10b981, // Emerald Green
      hexColor: "#10b981",
      icon: Percent,
      desc: "Municipal storm-water discharge efficiency (100% = clear, 20% = silt-choked).",
      safeRange: "> 60 %",
      status: drainage < 30 ? "Critical Choke (< 30%)" : drainage < 60 ? "Strained (30% - 60%)" : "Adequate (> 60%)"
    },
    {
      id: "inflow",
      label: "Catchment Inflow",
      shortName: "Inflow",
      value: inflow,
      unit: "m³/s",
      normalizedHeight: Math.min(6, (inflow / 700) * 5.5 + 0.5),
      color: 0xf59e0b, // Amber
      hexColor: "#f59e0b",
      icon: ArrowDownRight,
      desc: "Volume of upstream river surges entering the local basin per second.",
      safeRange: "< 250 m³/s",
      status: inflow >= 450 ? "Severe Rush (> 450 m³/s)" : inflow >= 250 ? "Elevated (250 - 450 m³/s)" : "Normal (< 250 m³/s)"
    },
    {
      id: "outflow",
      label: "Discharge Outflow",
      shortName: "Outflow",
      value: outflow,
      unit: "m³/s",
      normalizedHeight: Math.min(6, (outflow / 400) * 5.5 + 0.5),
      color: 0x8b5cf6, // Purple
      hexColor: "#8b5cf6",
      icon: ArrowUpRight,
      desc: "Volume of water discharged through sluices, barrages, and coastal outlets per second.",
      safeRange: ">= Inflow",
      status: outflow < inflow ? "Deficit (Accumulating)" : "Equilibrium (Discharging)"
    }
  ];

  // Initialize Three.js 3D Scene safely
  useEffect(() => {
    if (renderMode === "2d") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle context loss gracefully
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setWebGlAvailable(false);
      setRenderMode("2d");
      setWebGlError("WebGL context was terminated by browser. Switched to high-performance 2D mode.");
    };
    canvas.addEventListener("webglcontextlost", handleContextLost, false);

    const { renderer, error } = createSafeWebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    if (error || !renderer) {
      setWebGlAvailable(false);
      setRenderMode("2d");
      setWebGlError(error?.message || "WebGL is not supported or blocked in this browser environment.");
      return () => {
        canvas.removeEventListener("webglcontextlost", handleContextLost);
      };
    }

    rendererRef.current = renderer;
    const width = canvas.clientWidth || 700;
    const height = canvas.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xfffdf0); // Butter warm canvas tone

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(9, 8, 12);
    camera.lookAt(0, 1.5, 0);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
    dirLight.position.set(12, 18, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xd9ecff, 0.6);
    fillLight.position.set(-10, 10, -10);
    scene.add(fillLight);

    // Main 3D Model Group
    const mainGroup = new THREE.Group();
    groupRef.current = mainGroup;
    scene.add(mainGroup);

    // Ground platform
    const platformGeo = new THREE.CylinderGeometry(7.2, 7.5, 0.4, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0xf3ede0,
      roughness: 0.7,
      metalness: 0.1
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.2;
    platform.receiveShadow = true;
    mainGroup.add(platform);

    // Circular grid ring
    const ringGeo = new THREE.RingGeometry(6.6, 6.75, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xded2be, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    mainGroup.add(ring);

    // Center pedestal / basin
    const centerBaseGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.3, 32);
    const centerBaseMat = new THREE.MeshStandardMaterial({
      color: 0xe6dbc8,
      roughness: 0.6
    });
    const centerBase = new THREE.Mesh(centerBaseGeo, centerBaseMat);
    centerBase.position.y = 0.15;
    centerBase.receiveShadow = true;
    mainGroup.add(centerBase);

    // Dynamic water pool in center
    const waterGeo = new THREE.CylinderGeometry(2.35, 2.35, 0.25, 32, 4);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: severityResult.level === 3 ? 0xef4444 : severityResult.level === 2 ? 0xf59e0b : 0x10b981,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.4,
      ior: 1.33
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = 0.3;
    waterMeshRef.current = waterMesh;
    mainGroup.add(waterMesh);

    // Group for 5 Metric 3D Pillars
    const barsGroup = new THREE.Group();
    barsGroupRef.current = barsGroup;
    mainGroup.add(barsGroup);

    // Handle resize
    const handleResize = () => {
      if (!canvas || !renderer || !camera) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation when user is not dragging
      if (isAutoRotate && !isDraggingRef.current && mainGroup) {
        rotationTargetRef.current.y += 0.005;
      }

      // Smooth interpolation for rotation
      if (mainGroup) {
        mainGroup.rotation.y += (rotationTargetRef.current.y - mainGroup.rotation.y) * 0.1;
        mainGroup.rotation.x += (rotationTargetRef.current.x - mainGroup.rotation.x) * 0.1;
      }

      // Water animation (breathing pulse & ripple)
      if (waterMeshRef.current) {
        const pulse = Math.sin(elapsedTime * 2.5) * 0.05;
        waterMeshRef.current.scale.set(1 + pulse * 0.03, 1 + pulse * 0.2, 1 + pulse * 0.03);
      }

      // Animate individual pillar heights and glow
      if (barsGroupRef.current) {
        barsGroupRef.current.children.forEach((child, idx) => {
          if (child instanceof THREE.Group) {
            const floatOffset = Math.sin(elapsedTime * 2 + idx) * 0.03;
            child.position.y = floatOffset;
          }
        });
      }

      // Camera position based on zoom distance
      if (cameraRef.current) {
        const dist = cameraDistanceRef.current;
        const targetPos = new THREE.Vector3(
          Math.sin(0.4) * dist,
          dist * 0.65,
          Math.cos(0.4) * dist
        );
        cameraRef.current.position.lerp(targetPos, 0.1);
        cameraRef.current.lookAt(0, 1.2, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      disposeWebGLRenderer(renderer);
    };
  }, [renderMode]);

  // Update 3D metric pillars whenever rainfall, waterLevel, drainage, inflow, outflow change
  useEffect(() => {
    if (!barsGroupRef.current) return;
    const group = barsGroupRef.current;

    // Clear old bars
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    // Radius for arranging 5 pillars in a circle around the center water pool
    const radius = 4.2;
    const totalBars = metricsData.length;

    metricsData.forEach((m, idx) => {
      const angle = (idx / totalBars) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const barHeight = Math.max(0.6, m.normalizedHeight);

      const barContainer = new THREE.Group();
      barContainer.position.set(x, 0, z);

      // Base ring
      const baseRingGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.15, 24);
      const baseRingMat = new THREE.MeshStandardMaterial({
        color: 0x3d312a,
        roughness: 0.5
      });
      const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
      baseRing.position.y = 0.08;
      barContainer.add(baseRing);

      // Main 3D Cylinder / Column
      const columnGeo = new THREE.CylinderGeometry(0.5, 0.5, barHeight, 24);
      const isSelected = selectedMetricIndex === idx;
      
      const columnMat = new THREE.MeshStandardMaterial({
        color: m.color,
        roughness: 0.3,
        metalness: 0.2,
        emissive: isSelected ? m.color : 0x000000,
        emissiveIntensity: isSelected ? 0.35 : 0.05,
        transparent: true,
        opacity: 0.92
      });

      const columnMesh = new THREE.Mesh(columnGeo, columnMat);
      columnMesh.position.y = barHeight / 2 + 0.15;
      columnMesh.castShadow = true;
      columnMesh.receiveShadow = true;
      barContainer.add(columnMesh);

      // Top glowing indicator cap
      const capGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.1, 24);
      const capMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffffff : m.color
      });
      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.y = barHeight + 0.2;
      barContainer.add(capMesh);

      // Floating halo ring if selected
      if (isSelected) {
        const haloGeo = new THREE.TorusGeometry(0.7, 0.05, 12, 32);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2;
        halo.position.y = barHeight + 0.5;
        barContainer.add(halo);
      }

      group.add(barContainer);
    });

    // Update center water color according to severity level
    if (waterMeshRef.current) {
      const mat = waterMeshRef.current.material as THREE.MeshPhysicalMaterial;
      const targetColor = 
        severityResult.level === 3 ? new THREE.Color(0xdc2626) : 
        severityResult.level === 2 ? new THREE.Color(0xd97706) : 
        new THREE.Color(0x16a34a);
      mat.color.copy(targetColor);
    }
  }, [rainfall, waterLevel, drainage, inflow, outflow, selectedMetricIndex, severityResult.level, renderMode]);

  // Pointer drag controls for 3D rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    rotationTargetRef.current.y += deltaX * 0.008;
    rotationTargetRef.current.x = Math.max(0.1, Math.min(1.2, rotationTargetRef.current.x + deltaY * 0.008));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleResetView = () => {
    rotationTargetRef.current = { x: 0.35, y: -0.45 };
    cameraDistanceRef.current = 14;
    setIsAutoRotate(true);
    setSelectedMetricIndex(null);
  };

  const handleZoom = (direction: "in" | "out") => {
    if (direction === "in") {
      cameraDistanceRef.current = Math.max(9, cameraDistanceRef.current - 2);
    } else {
      cameraDistanceRef.current = Math.min(22, cameraDistanceRef.current + 2);
    }
  };

  return (
    <div id="severity-graph-view" className="space-y-6">
      {/* Header Banner with Severity Badge */}
      <div 
        id="graph-header-banner"
        className="bg-[#FFFDF0] p-6 rounded-2xl border-2 shadow-sm transition-all"
        style={{ borderColor: severityResult.borderColor }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span 
                id="severity-level-pill"
                className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5"
                style={{ backgroundColor: severityResult.badgeBg, color: severityResult.color }}
              >
                {severityResult.level === 3 ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                {severityResult.levelLabel}
              </span>
              <span className="text-xs text-[#786C5E] font-medium">
                • {districtName}, {stateName}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3B2F2F]">
              Hydrological 3D Telemetry Graph
            </h2>
            <p className="text-sm text-[#5D4E37] mt-1 max-w-2xl">
              {severityResult.explanation}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onBackToMeasures && (
              <button
                id="btn-back-to-measures"
                type="button"
                onClick={onBackToMeasures}
                className="px-4 py-2.5 rounded-xl border border-[#D5C7AD] bg-white text-[#3B2F2F] text-sm font-semibold hover:bg-[#F7F2E7] transition-colors"
              >
                ← Back to Safety Actions
              </button>
            )}
            <button
              id="btn-toggle-simulator"
              type="button"
              onClick={() => setShowSimulator(!showSimulator)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 border transition-all ${
                showSimulator 
                  ? "bg-[#2E5C38] text-white border-[#2E5C38]" 
                  : "bg-[#EAF5EC] text-[#2E5C38] border-[#B7E4C7] hover:bg-[#D8EEDC]"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showSimulator ? "Hide Stress-Test" : "Adjust Numerical Values"}
            </button>
          </div>
        </div>

        {/* Dynamic Stress-Test Sliders (Optional interactive testing) */}
        {showSimulator && (
          <div 
            id="stress-test-panel"
            className="mt-6 pt-5 border-t border-[#E6DBCE] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-[#FDFCFA] p-4 rounded-xl"
          >
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#4A3E31]">
                <span>Rainfall Intensity</span>
                <span className="text-blue-600 font-bold">{rainfall} mm/hr</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-[#7A6E5E]">Safe: &lt;75 | Warn: 75-120</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#4A3E31]">
                <span>Water Level</span>
                <span className="text-sky-600 font-bold">{waterLevel.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.05"
                value={waterLevel}
                onChange={(e) => setWaterLevel(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <p className="text-[11px] text-[#7A6E5E]">Safe: &lt;0.75m | Danger: &gt;1.5m</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#4A3E31]">
                <span>Drainage Capacity</span>
                <span className="text-emerald-700 font-bold">{drainage}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={drainage}
                onChange={(e) => setDrainage(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[11px] text-[#7A6E5E]">Safe: &gt;60% | Choked: &lt;30%</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#4A3E31]">
                <span>Inflow Rate</span>
                <span className="text-amber-700 font-bold">{inflow} m³/s</span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="25"
                value={inflow}
                onChange={(e) => setInflow(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <p className="text-[11px] text-[#7A6E5E]">Catchment run-in</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#4A3E31]">
                <span>Outflow Rate</span>
                <span className="text-purple-700 font-bold">{outflow} m³/s</span>
              </div>
              <input
                type="range"
                min="30"
                max="500"
                step="20"
                value={outflow}
                onChange={(e) => setOutflow(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <p className="text-[11px] text-[#7A6E5E]">Sluice discharge capacity</p>
            </div>
          </div>
        )}
      </div>

      {/* 3D Visualizer Canvas & Live Overlay Controls / 2D High-Performance Fallback */}
      <div 
        id="three-canvas-container"
        className="relative w-full min-h-[460px] md:min-h-[520px] bg-[#FFFDF0] rounded-2xl border-2 border-[#E7DDCD] overflow-hidden shadow-inner flex flex-col justify-between"
      >
        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-[#D5C7AD] shadow-xs text-xs font-semibold text-[#4A3E31]">
            <BarChart3 className="w-4 h-4 text-[#8B5A2B]" />
            <span>
              {renderMode === "3d" ? "Interactive 3D Graph (Drag to Rotate)" : "Interactive 2D Vector Hydraulic View"}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* 2D / 3D Segmented Mode Switcher */}
            <div className="flex items-center bg-white/95 backdrop-blur-sm p-0.5 rounded-xl border border-[#D5C7AD] shadow-xs">
              <button
                id="btn-telemetry-mode-3d"
                type="button"
                onClick={() => {
                  setRenderMode("3d");
                  setWebGlAvailable(true);
                  setWebGlError(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  renderMode === "3d"
                    ? "bg-[#3B2F2F] text-white shadow-xs"
                    : "text-[#4A3E31] hover:text-[#1F1713] hover:bg-[#F2ECE1]"
                }`}
                title="Switch to Interactive 3D Perspective"
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Mode</span>
              </button>
              <button
                id="btn-telemetry-mode-2d"
                type="button"
                onClick={() => {
                  setRenderMode("2d");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  renderMode === "2d"
                    ? "bg-[#3B2F2F] text-white shadow-xs"
                    : "text-[#4A3E31] hover:text-[#1F1713] hover:bg-[#F2ECE1]"
                }`}
                title="Switch to Interactive 2D Vector Hydraulic View"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>2D Mode</span>
              </button>
            </div>

            {renderMode === "3d" ? (
              <>
                <button
                  id="btn-spin-toggle"
                  type="button"
                  onClick={() => setIsAutoRotate(!isAutoRotate)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border shadow-xs transition-colors backdrop-blur-sm cursor-pointer ${
                    isAutoRotate 
                      ? "bg-[#2E5C38] text-white border-[#2E5C38]" 
                      : "bg-white/90 text-[#4A3E31] border-[#D5C7AD] hover:bg-white"
                  }`}
                  title="Toggle Auto Rotation"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAutoRotate ? "Spinning" : "Paused"}
                </button>

                <button
                  id="btn-zoom-in"
                  type="button"
                  onClick={() => handleZoom("in")}
                  className="p-2 rounded-xl bg-white/90 border border-[#D5C7AD] text-[#4A3E31] hover:bg-white shadow-xs transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                <button
                  id="btn-zoom-out"
                  type="button"
                  onClick={() => handleZoom("out")}
                  className="p-2 rounded-xl bg-white/90 border border-[#D5C7AD] text-[#4A3E31] hover:bg-white shadow-xs transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <button
                  id="btn-reset-view"
                  type="button"
                  onClick={handleResetView}
                  className="p-2 rounded-xl bg-white/90 border border-[#D5C7AD] text-[#4A3E31] hover:bg-white shadow-xs transition-colors cursor-pointer"
                  title="Reset 3D Perspective"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setRainfall(telemetry.rainfallIntensity);
                  setWaterLevel(telemetry.initialWaterLevel);
                  setDrainage(telemetry.drainage);
                  setInflow(telemetry.inflow);
                  setOutflow(telemetry.outflow);
                }}
                className="p-2 rounded-xl bg-white/90 border border-[#D5C7AD] text-[#4A3E31] hover:bg-white shadow-xs transition-colors cursor-pointer"
                title="Reset scenario values"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Display Either 3D Canvas or 2D High-Performance Interactive View */}
        {renderMode === "3d" && webGlAvailable ? (
          <canvas
            ref={canvasRef}
            id="webgl-flood-graph"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center p-6 pt-16 pb-20">
            {/* Subtle Notification Banner if WebGL had an issue */}
            {webGlError && (
              <div className="mb-4 px-3.5 py-1.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs font-medium flex items-center gap-2 max-w-lg text-center shadow-2xs">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Running in High-Performance 2D Vector Mode (WebGL hardware acceleration unavailable or blocked in this browser).</span>
              </div>
            )}

            {/* Interactive 2D Hydraulic Multi-Metric Visualizer Stage */}
            <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xs rounded-2xl p-5 border border-[#E7DDCD] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Central Hydraulic Catchment Basin Cross-Section */}
              <div className="w-full md:w-5/12 flex flex-col items-center text-center">
                <div className="text-xs font-bold text-teal-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-teal-600" />
                  <span>Hydrological Catchment Basin</span>
                </div>

                {/* SVG Basin Visualization */}
                <div className="relative w-48 h-48 rounded-full border-4 border-[#ded2be] bg-[#F7F3E9] flex flex-col justify-end overflow-hidden shadow-inner p-2">
                  {/* Dynamic Water Level Fill */}
                  <div
                    className="w-full transition-all duration-500 rounded-b-full relative overflow-hidden flex flex-col justify-between items-center pb-2"
                    style={{
                      height: `${Math.min(95, Math.max(15, (waterLevel / 2.5) * 85))}%`,
                      backgroundColor:
                        severityResult.level === 3
                          ? "#ef4444"
                          : severityResult.level === 2
                          ? "#f59e0b"
                          : "#10b981",
                      opacity: 0.88
                    }}
                  >
                    {/* Ripple pattern */}
                    <div className="w-full h-2 bg-white/30 animate-pulse" />
                    <span className="text-[11px] font-extrabold text-white drop-shadow-xs">
                      {waterLevel.toFixed(2)}m Depth
                    </span>
                  </div>

                  {/* Basin Rim Inflow / Outflow Indicators */}
                  <div className="absolute top-2 left-2 text-[10px] font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded-md border border-amber-200">
                    ⬇ Inflow: {inflow}
                  </div>
                  <div className="absolute top-2 right-2 text-[10px] font-bold text-purple-800 bg-purple-100/90 px-1.5 py-0.5 rounded-md border border-purple-200">
                    ⬆ Outflow: {outflow}
                  </div>
                </div>

                <div className="mt-2 text-xs font-bold text-teal-950">
                  {severityResult.level === 3
                    ? "CRITICAL BASIN OVERLOAD"
                    : severityResult.level === 2
                    ? "WARNING: ELEVATED WATER TABLE"
                    : "NORMAL EQUILIBRIUM"}
                </div>
              </div>

              {/* 5 Vertical Metric Interactive Indicator Columns */}
              <div className="w-full md:w-7/12 flex items-end justify-between gap-2 pt-4 px-2">
                {metricsData.map((m, idx) => {
                  const isSelected = selectedMetricIndex === idx;
                  const barHeightPct = Math.min(100, Math.max(12, (m.normalizedHeight / 6) * 100));

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMetricIndex(isSelected ? null : idx)}
                      className={`flex-1 flex flex-col items-center text-center cursor-pointer transition-all p-1.5 rounded-xl ${
                        isSelected ? "bg-amber-100/80 ring-2 ring-amber-400" : "hover:bg-teal-50/60"
                      }`}
                    >
                      {/* Numeric Label */}
                      <span className="text-[10px] font-extrabold text-teal-950 mb-1">
                        {m.value}
                      </span>

                      {/* Bar Container */}
                      <div className="w-8 sm:w-10 h-36 bg-[#EBE4D8] rounded-xl relative overflow-hidden flex flex-col justify-end p-0.5 shadow-inner">
                        <div
                          className="w-full rounded-lg transition-all duration-500"
                          style={{
                            height: `${barHeightPct}%`,
                            backgroundColor: m.hexColor
                          }}
                        />
                      </div>

                      {/* Pillar Base and Label */}
                      <span className="text-[10px] font-bold text-teal-900 mt-1.5 truncate max-w-[55px]">
                        {m.shortName}
                      </span>
                      <span className="text-[9px] text-teal-700/80">
                        {m.unit}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-white/92 backdrop-blur-sm p-2 rounded-xl border border-[#D5C7AD] shadow-xs text-xs">
            {metricsData.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMetricIndex(selectedMetricIndex === idx ? null : idx)}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedMetricIndex === idx
                    ? "bg-[#3B2F2F] text-white shadow-xs"
                    : "hover:bg-[#F2ECE1] text-[#4A3E31]"
                }`}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full inline-block" 
                  style={{ backgroundColor: m.hexColor }} 
                />
                <span>{m.shortName}:</span>
                <span className="font-bold">{m.value} {m.unit}</span>
              </button>
            ))}
          </div>

          <div className="pointer-events-auto bg-white/92 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-[#D5C7AD] shadow-xs text-xs font-semibold text-[#4A3E31]">
            <span>Surplus Inflow: </span>
            <span className={severityResult.netAccumulation > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
              {severityResult.netAccumulation > 0 ? `+${severityResult.netAccumulation}` : severityResult.netAccumulation} m³/s
            </span>
          </div>
        </div>
      </div>

      {/* Numerical Stats Dashboard Grid */}
      <div id="numerical-stats-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#3B2F2F] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#8B5A2B]" />
            Complete Numerical Statistics &amp; Hydrological Parameters
          </h3>
          <span className="text-xs text-[#786C5E]">
            Values based on official catchment records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {metricsData.map((m, idx) => {
            const Icon = m.icon;
            const isSelected = selectedMetricIndex === idx;

            return (
              <div
                key={m.id}
                id={`stat-card-${m.id}`}
                onClick={() => setSelectedMetricIndex(isSelected ? null : idx)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                  isSelected 
                    ? "border-[#3B2F2F] shadow-md ring-2 ring-[#3B2F2F]/10 scale-[1.02]" 
                    : "border-[#E7DDCD] hover:border-[#C4B399] shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${m.hexColor}18`, color: m.hexColor }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${m.hexColor}18`, color: m.hexColor }}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#786C5E] uppercase tracking-wider">
                  {m.label}
                </div>
                
                <div className="text-2xl font-black text-[#3B2F2F] my-1">
                  {m.value}{" "}
                  <span className="text-xs font-medium text-[#786C5E]">
                    {m.unit}
                  </span>
                </div>

                <div className="text-[11px] text-[#5D4E37] pt-2 border-t border-[#F2ECE1] mt-2 flex justify-between">
                  <span>Safe Threshold:</span>
                  <span className="font-semibold text-[#3B2F2F]">{m.safeRange}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Severity Level Classification Legend & Analysis */}
      <div 
        id="severity-classification-guide"
        className="bg-white p-5 rounded-2xl border border-[#E7DDCD] shadow-xs space-y-4"
      >
        <h4 className="text-sm font-bold text-[#3B2F2F] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#8B5A2B]" />
          How Severity Levels Are Calculated
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border ${severityResult.level === 1 ? "bg-[#F2FBF4] border-[#B7E4C7] ring-2 ring-[#16A34A]/20" : "bg-[#FAF8F5] border-[#E8DFC9]"}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#16A34A] text-white">
                Level 1: Safe
              </span>
              {severityResult.level === 1 && (
                <span className="text-xs font-bold text-[#16A34A]">Current State</span>
              )}
            </div>
            <p className="text-xs font-medium text-[#2E5C38] mb-1">
              Equilibrium maintained
            </p>
            <ul className="text-[11px] text-[#5D4E37] space-y-0.5 list-disc list-inside">
              <li>Rainfall: &lt; 75 mm/hr</li>
              <li>Water level: &lt; 0.75 meters</li>
              <li>Drainage capacity: &gt; 60%</li>
              <li>Discharge outflow safely balances inflow</li>
            </ul>
          </div>

          <div className={`p-4 rounded-xl border ${severityResult.level === 2 ? "bg-[#FFFBEA] border-[#FDE68A] ring-2 ring-[#D97706]/20" : "bg-[#FAF8F5] border-[#E8DFC9]"}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#D97706] text-white">
                Level 2: Warning
              </span>
              {severityResult.level === 2 && (
                <span className="text-xs font-bold text-[#D97706]">Current State</span>
              )}
            </div>
            <p className="text-xs font-medium text-[#8B5A2B] mb-1">
              Elevated water accumulation
            </p>
            <ul className="text-[11px] text-[#5D4E37] space-y-0.5 list-disc list-inside">
              <li>Rainfall: 75 mm/hr - 120 mm/hr</li>
              <li>Water level: 0.75m - 1.5 meters</li>
              <li>Drainage capacity: 30% - 60%</li>
              <li>Net inflow surplus begins to fill lowlands</li>
            </ul>
          </div>

          <div className={`p-4 rounded-xl border ${severityResult.level === 3 ? "bg-[#FEF2F2] border-[#FECACA] ring-2 ring-[#DC2626]/20" : "bg-[#FAF8F5] border-[#E8DFC9]"}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#DC2626] text-white">
                Level 3: Critical
              </span>
              {severityResult.level === 3 && (
                <span className="text-xs font-bold text-[#DC2626]">Current State</span>
              )}
            </div>
            <p className="text-xs font-medium text-[#991B1B] mb-1">
              Severe hydrological surplus &amp; inundation
            </p>
            <ul className="text-[11px] text-[#5D4E37] space-y-0.5 list-disc list-inside">
              <li>Rainfall: &gt; 120 mm/hr (Torrential)</li>
              <li>Water level: &gt; 1.5 meters</li>
              <li>Drainage capacity: &lt; 30% (Choked)</li>
              <li>Inflow heavily exceeds outflow capacity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SimulationScenario, SimulationScenarioKey } from "../types";
import { SIMULATION_SCENARIOS, DistrictTelemetryData } from "../data/telemetryEngine";
import { createSafeWebGLRenderer, disposeWebGLRenderer } from "../utils/webglHelper";
import {
  CloudRain,
  Droplets,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  Layers,
  Percent,
  Sliders,
  CheckCircle2,
  Info,
  ShieldCheck,
  Flame,
  Activity,
  Waves,
  RefreshCw
} from "lucide-react";

interface RealisticSimulationsPageProps {
  districtName: string;
  stateName: string;
  telemetry: DistrictTelemetryData;
  activeScenarioKey: SimulationScenarioKey;
  onChangeScenarioKey: (key: SimulationScenarioKey) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const RealisticSimulationsPage: React.FC<RealisticSimulationsPageProps> = ({
  districtName,
  stateName,
  telemetry,
  activeScenarioKey,
  onChangeScenarioKey,
  onPrevPage,
  onNextPage
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Ensure the page always opens from the very top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  // Active scenario config
  const scenario = SIMULATION_SCENARIOS[activeScenarioKey];

  // Interactive adjustment overrides
  const [customBlockage, setCustomBlockage] = useState<number>(scenario.channelBlockagePercent);
  const [customRainfall, setCustomRainfall] = useState<number>(scenario.rainfallIntensity);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);
  const [webGlError, setWebGlError] = useState<string | null>(null);
  const [renderMode, setRenderMode] = useState<"3d" | "2d">("3d");

  // Sync state when active scenario tab changes
  useEffect(() => {
    setCustomBlockage(scenario.channelBlockagePercent);
    setCustomRainfall(scenario.rainfallIntensity);
  }, [activeScenarioKey, scenario]);

  // Derived physics
  const effectiveDrainage = Math.max(5, Math.min(98, 100 - customBlockage));
  const effectiveInflow = Math.round(customRainfall * 2.8 + (customBlockage > 50 ? 80 : 20));
  const effectiveOutflow = Math.round((effectiveInflow * (effectiveDrainage / 100)) * (1 - customBlockage / 115));
  const netSurplus = effectiveInflow - effectiveOutflow;
  
  // Water depth in meters (baseline 0.35, increases with rain & blockage)
  const simulatedWaterDepth = Number(
    (0.3 + (customRainfall / 160) * 0.9 + (customBlockage / 100) * 1.5).toFixed(2)
  );
  
  // Overflow state: true if water depth exceeds bank height (1.8m)
  const isOverflowingBank = simulatedWaterDepth >= 1.8;

  // Refs for 3D objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const streetFloodMeshRef = useRef<THREE.Mesh | null>(null);
  const debrisMeshRef = useRef<THREE.Group | null>(null);
  const rainSystemRef = useRef<THREE.Points | null>(null);
  const isAutoRotatingRef = useRef(isAutoRotating);
  isAutoRotatingRef.current = isAutoRotating;

  useEffect(() => {
    if (renderMode === "2d") return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = 440;

    // Safely attempt WebGL context creation
    const { renderer, error } = createSafeWebGLRenderer({
      antialias: true,
      alpha: false,
    });

    if (error || !renderer) {
      setWebGlAvailable(false);
      setRenderMode("2d");
      setWebGlError(error?.message || "WebGL context could not be created or was blocked.");
      return;
    }

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#F4EFE6"); // Warm light neutral

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(12, 10, 14);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer configuration
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const domElem = renderer.domElement;

    // Handle context loss gracefully
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebGlAvailable(false);
      setRenderMode("2d");
      setWebGlError("WebGL context was terminated by browser. Switched to interactive 2D simulation.");
    };
    domElem.addEventListener("webglcontextlost", handleContextLost, false);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Subtle blue fill light
    const fillLight = new THREE.DirectionalLight(0x90cdf4, 0.4);
    fillLight.position.set(-15, 10, -10);
    scene.add(fillLight);

    // 5. Environment & Canal Cross-Section
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Street / Ground Level (Right Bank)
    const rightBankGeo = new THREE.BoxGeometry(7, 2, 16);
    const streetMat = new THREE.MeshStandardMaterial({
      color: 0x4a4744, // Asphalt street
      roughness: 0.85
    });
    const rightBank = new THREE.Mesh(rightBankGeo, streetMat);
    rightBank.position.set(5.5, 0, 0);
    rightBank.receiveShadow = true;
    worldGroup.add(rightBank);

    // Road markings
    const lineGeo = new THREE.PlaneGeometry(0.2, 14);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfff066 });
    const lineMesh = new THREE.Mesh(lineGeo, lineMat);
    lineMesh.rotation.x = -Math.PI / 2;
    lineMesh.position.set(6.5, 1.01, 0);
    worldGroup.add(lineMesh);

    // Street pavement / walkway border
    const sidewalkGeo = new THREE.BoxGeometry(1.4, 0.25, 16);
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xd4cdc5, roughness: 0.7 });
    const sidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    sidewalk.position.set(2.7, 1.05, 0);
    sidewalk.receiveShadow = true;
    worldGroup.add(sidewalk);

    // Roadside houses / structures (miniature representation)
    for (let i = -5; i <= 5; i += 3.5) {
      const houseGeo = new THREE.BoxGeometry(1.8, 1.6, 2.2);
      const houseMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xd9c5b2 : 0xc0a080,
        roughness: 0.6
      });
      const house = new THREE.Mesh(houseGeo, houseMat);
      house.position.set(7.2, 1.8, i);
      house.castShadow = true;
      house.receiveShadow = true;
      worldGroup.add(house);

      // Roof
      const roofGeo = new THREE.ConeGeometry(1.6, 0.8, 4);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b3a2b, roughness: 0.5 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.rotation.y = Math.PI / 4;
      roof.position.set(7.2, 3.0, i);
      worldGroup.add(roof);
    }

    // Left Bank (Natural Embankment)
    const leftBankGeo = new THREE.BoxGeometry(7, 2, 16);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x6e8e59, // Earthy grass
      roughness: 0.9
    });
    const leftBank = new THREE.Mesh(leftBankGeo, grassMat);
    leftBank.position.set(-5.5, 0, 0);
    leftBank.receiveShadow = true;
    worldGroup.add(leftBank);

    // Concrete Canal Channel Base (Between banks from x = -2 to x = 2)
    const canalBedGeo = new THREE.BoxGeometry(4.2, 0.6, 16);
    const canalBedMat = new THREE.MeshStandardMaterial({
      color: 0x7c766f, // Concrete canal bed
      roughness: 0.95
    });
    const canalBed = new THREE.Mesh(canalBedGeo, canalBedMat);
    canalBed.position.set(0, -1.3, 0);
    canalBed.receiveShadow = true;
    worldGroup.add(canalBed);

    // Concrete Canal Retaining Walls
    const leftWallGeo = new THREE.BoxGeometry(0.3, 2.3, 16);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x9e9891, roughness: 0.8 });
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-2.0, -0.05, 0);
    worldGroup.add(leftWall);

    const rightWallGeo = new THREE.BoxGeometry(0.3, 2.3, 16);
    const rightWall = new THREE.Mesh(rightWallGeo, wallMat);
    rightWall.position.set(2.0, -0.05, 0);
    worldGroup.add(rightWall);

    // Large Culvert Drainage Tunnel Entrance (At z = 7)
    const culvertGroup = new THREE.Group();
    culvertGroup.position.set(0, -0.2, 7.8);

    // Culvert concrete headwall
    const headwallGeo = new THREE.BoxGeometry(4.3, 2.6, 0.8);
    const headwall = new THREE.Mesh(headwallGeo, wallMat);
    culvertGroup.add(headwall);

    // Circular culvert pipe barrel
    const pipeGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 24, 1, true);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x2b2927,
      side: THREE.BackSide,
      roughness: 0.9
    });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.x = Math.PI / 2;
    pipe.position.set(0, -0.3, 0.4);
    culvertGroup.add(pipe);

    // Trash rack steel bars across culvert mouth
    for (let barX = -0.9; barX <= 0.9; barX += 0.35) {
      const barGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.2, 8);
      const barMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(barX, -0.3, -0.4);
      culvertGroup.add(bar);
    }
    worldGroup.add(culvertGroup);

    // Debris Mesh (Silt, plastic bags, driftwood choking the culvert mouth)
    const debrisGroup = new THREE.Group();
    debrisGroup.position.set(0, -0.3, 7.2);
    
    // Multiple irregular clods of debris
    const debrisMats = [
      new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.95 }), // Silt/mud
      new THREE.MeshStandardMaterial({ color: 0x8c2d19, roughness: 0.8 }),  // Rusted trash/plastic
      new THREE.MeshStandardMaterial({ color: 0x3d3024, roughness: 0.9 }),  // Rotten wood
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 })   // Plastic choke
    ];

    for (let k = 0; k < 18; k++) {
      const sz = 0.2 + Math.random() * 0.35;
      const dGeo = new THREE.DodecahedronGeometry(sz, 0);
      const dMesh = new THREE.Mesh(dGeo, debrisMats[k % debrisMats.length]);
      dMesh.position.set(
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 1.4,
        (Math.random() - 0.5) * 0.6
      );
      dMesh.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      debrisGroup.add(dMesh);
    }
    worldGroup.add(debrisGroup);
    debrisMeshRef.current = debrisGroup;

    // 6. Canal Water Mesh
    const waterGeo = new THREE.PlaneGeometry(3.8, 15.6, 24, 24);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.82,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.333
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(0, -0.8, 0);
    worldGroup.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // 7. Street Flood Overflow Mesh (Rises when bank overflows!)
    const streetFloodGeo = new THREE.PlaneGeometry(6.6, 15.6, 16, 16);
    const streetFloodMat = new THREE.MeshPhysicalMaterial({
      color: 0x8b5a2b, // Muddy flood sheet
      transparent: true,
      opacity: 0.78,
      roughness: 0.2,
      transmission: 0.4
    });
    const streetFloodMesh = new THREE.Mesh(streetFloodGeo, streetFloodMat);
    streetFloodMesh.rotation.x = -Math.PI / 2;
    streetFloodMesh.position.set(5.5, 1.02, 0);
    streetFloodMesh.visible = false;
    worldGroup.add(streetFloodMesh);
    streetFloodMeshRef.current = streetFloodMesh;

    // 8. Rain Particle System
    const rainCount = 1200;
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 20;
      rainPositions[i * 3 + 1] = Math.random() * 15;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));

    const rainMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.08,
      transparent: true,
      opacity: 0.65
    });
    const rainSystem = new THREE.Points(rainGeo, rainMat);
    scene.add(rainSystem);
    rainSystemRef.current = rainSystem;

    // 9. Interactive Drag to Rotate Canvas
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      worldGroup.rotation.y += deltaX * 0.008;
      worldGroup.rotation.x = Math.max(-0.2, Math.min(0.6, worldGroup.rotation.x + deltaY * 0.005));

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch support
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;

      worldGroup.rotation.y += deltaX * 0.008;
      worldGroup.rotation.x = Math.max(-0.2, Math.min(0.6, worldGroup.rotation.x + deltaY * 0.005));

      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    domElem.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    domElem.addEventListener("touchstart", handleTouchStart);
    domElem.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Auto-rotation if enabled
      if (isAutoRotatingRef.current && !isDragging) {
        worldGroup.rotation.y += 0.003;
      }

      // Rain drop animation
      if (rainSystemRef.current) {
        const positions = rainSystemRef.current.geometry.attributes.position.array as Float32Array;
        const speed = 0.2 + (customRainfall / 150) * 0.35;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= speed;
          if (positions[i] < -2) {
            positions[i] = 14;
          }
        }
        rainSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Water surface wave animation
      if (waterMeshRef.current) {
        const geo = waterMeshRef.current.geometry;
        const pos = geo.attributes.position;
        const waveAmp = 0.04 + (customRainfall / 200) * 0.08;
        const waveFreq = 2.0 + (customBlockage / 100) * 3.0;

        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i);
          const v = pos.getY(i);
          const z = Math.sin(u * waveFreq + elapsed * 4) * Math.cos(v * waveFreq + elapsed * 3) * waveAmp;
          pos.setZ(i, z);
        }
        pos.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        if (newW > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, height);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domElem.removeEventListener("webglcontextlost", handleContextLost);
      domElem.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      domElem.removeEventListener("touchstart", handleTouchStart);
      domElem.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
      disposeWebGLRenderer(renderer);
      if (container && domElem.parentNode === container) {
        container.removeChild(domElem);
      }
    };
  }, [renderMode]);

  // Update dynamic properties when custom sliders change
  useEffect(() => {
    // 1. Water Height in canal
    if (waterMeshRef.current) {
      // canal bed is at y = -1.0; road bank is at y = 1.0 (span = 2.0m)
      const normalizedY = -1.0 + (simulatedWaterDepth / 2.5) * 1.85;
      waterMeshRef.current.position.y = Math.min(1.25, normalizedY);

      // Color shifts: Normal = Azure blue, Heavy = Deep ocean, Drainage Failure = Murky silt brown
      const mat = waterMeshRef.current.material as THREE.MeshPhysicalMaterial;
      if (activeScenarioKey === "drainage_failure" || customBlockage > 60) {
        mat.color.setHex(0x855428); // Murky brown silt water
        mat.opacity = 0.92;
      } else if (activeScenarioKey === "heavy" || customRainfall > 100) {
        mat.color.setHex(0x1e3a8a); // Deep churning blue
        mat.opacity = 0.85;
      } else {
        mat.color.setHex(0x0284c7); // Clear azure
        mat.opacity = 0.78;
      }
    }

    // 2. Street Overflow Mesh
    if (streetFloodMeshRef.current) {
      if (isOverflowingBank) {
        streetFloodMeshRef.current.visible = true;
        // Float slightly above asphalt
        const floodSheetThickness = Math.min(0.35, (simulatedWaterDepth - 1.8) * 0.4);
        streetFloodMeshRef.current.position.y = 1.02 + floodSheetThickness;
      } else {
        streetFloodMeshRef.current.visible = false;
      }
    }

    // 3. Debris Mesh Scale (proportional to blockage %)
    if (debrisMeshRef.current) {
      const scaleFactor = Math.max(0.05, customBlockage / 100);
      debrisMeshRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
      debrisMeshRef.current.visible = customBlockage > 5;
    }

    // 4. Rain density & color
    if (rainSystemRef.current) {
      const mat = rainSystemRef.current.material as THREE.PointsMaterial;
      mat.size = 0.05 + (customRainfall / 180) * 0.08;
      mat.opacity = 0.3 + (customRainfall / 200) * 0.6;
    }
  }, [simulatedWaterDepth, isOverflowingBank, customBlockage, customRainfall, activeScenarioKey]);

  return (
    <div className="space-y-6">
      {/* Step Header & Location Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-900/10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200/80 rounded-lg text-xs font-bold tracking-wider">
            STEP 2 OF 4: REALISTIC SIMULATIONS
          </span>
          <span className="text-xs font-semibold text-teal-800/80">
            {districtName}, {stateName}
          </span>
        </div>

        {/* Previous & Next quick buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevPage}
            id="sim-btn-prev-top"
            className="px-3 py-1.5 rounded-lg border border-teal-900/15 bg-white hover:bg-teal-50/70 text-xs font-semibold text-teal-950 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>3D Telemetry</span>
          </button>

          <button
            type="button"
            onClick={onNextPage}
            id="sim-btn-next-top"
            className="px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Affected Population</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scenario Selection Header Banner */}
      <div className="mosaic-card rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-teal-950 tracking-tight font-['Outfit',sans-serif]">
              Compare Flood Behavior Across Realistic Scenarios
            </h2>
            <p className="text-xs sm:text-sm text-teal-800/80 mt-0.5">
              Simulate how stormwater channels and culverts react under normal showers, torrential monsoons, and clogged drainage failure.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-teal-50/80 p-1.5 rounded-xl border border-teal-900/10 shrink-0">
            <button
              type="button"
              id="sim-tab-normal"
              onClick={() => onChangeScenarioKey("normal")}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeScenarioKey === "normal"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-teal-900 hover:bg-white/80"
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Normal Rain</span>
            </button>

            <button
              type="button"
              id="sim-tab-heavy"
              onClick={() => onChangeScenarioKey("heavy")}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeScenarioKey === "heavy"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-teal-900 hover:bg-white/80"
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Heavy Rain</span>
            </button>

            <button
              type="button"
              id="sim-tab-drainage-failure"
              onClick={() => onChangeScenarioKey("drainage_failure")}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeScenarioKey === "drainage_failure"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-red-700 bg-red-50/80 hover:bg-red-100/80"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Drainage Failure</span>
            </button>
          </div>
        </div>

        {/* Active Scenario Overview Pill */}
        <div className="mt-4 pt-3 border-t border-teal-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-md text-white tracking-wider"
              style={{ backgroundColor: scenario.colorHex }}
            >
              {scenario.inundationRisk}
            </span>
            <span className="text-xs font-bold text-teal-950">
              {scenario.title} — {scenario.tagline}
            </span>
          </div>

          <div className="text-[11px] text-teal-800/90 font-medium">
            {isOverflowingBank ? (
              <span className="text-red-700 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                DANGER: Canal overflowing onto roadway by +{(simulatedWaterDepth - 1.8).toFixed(2)}m!
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Water contained within canal walls ({simulatedWaterDepth}m / 1.8m bank height)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3D / 2D Physical Simulation Stage & Realtime Indicators */}
      <div className="mosaic-card rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        {/* Top Control Bar overlay */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold">
              <Waves className="w-4 h-4 text-teal-200" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-teal-950 font-['Outfit',sans-serif]">
                {renderMode === "3d" ? "3D Physical Canal, Culvert & Backwater Simulator" : "Interactive 2D Hydraulic Cross-Section Simulator"}
              </div>
              <div className="text-[11px] text-teal-700/80">
                {renderMode === "3d" 
                  ? "Drag with mouse/touch to inspect drainage pipe and street submergence"
                  : "Live cross-section view of canal water table, culvert choke, and street overtopping"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 2D / 3D Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                if (renderMode === "2d") {
                  setRenderMode("3d");
                  setWebGlAvailable(true);
                  setWebGlError(null);
                } else {
                  setRenderMode("2d");
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-teal-900/15 text-xs font-semibold text-teal-950 flex items-center gap-1.5 hover:bg-teal-50/70 cursor-pointer shadow-2xs"
              title="Toggle between 3D and 2D simulation views"
            >
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              <span>{renderMode === "3d" ? "Switch to 2D Mode" : "Try 3D Mode"}</span>
            </button>

            {renderMode === "3d" && (
              <button
                type="button"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className="px-2.5 py-1 rounded-lg bg-white border border-teal-900/15 text-xs font-semibold text-teal-950 flex items-center gap-1 hover:bg-teal-50/70 cursor-pointer shadow-2xs"
              >
                {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoRotating ? "Pause Spin" : "Auto Spin"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setCustomBlockage(scenario.channelBlockagePercent);
                setCustomRainfall(scenario.rainfallIntensity);
              }}
              className="p-1.5 rounded-lg bg-white border border-teal-900/15 text-teal-950 hover:bg-teal-50/70 cursor-pointer shadow-2xs"
              title="Reset scenario defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3D Canvas Container OR 2D Vector Simulator */}
        {renderMode === "3d" && webGlAvailable ? (
          <div
            ref={mountRef}
            className="w-full h-[440px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border border-teal-900/15 relative bg-[#EBF3F0]"
          >
            {/* In-canvas Legend overlay */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-teal-900/10 text-[11px] space-y-1 shadow-sm pointer-events-none max-w-[260px]">
              <div className="font-bold text-teal-950">Cross-Section Elements:</div>
              <div className="flex items-center gap-1.5 text-teal-900">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#4a4744]" />
                <span>Right Bank: Urban Street &amp; Residences</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-900">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#7c766f]" />
                <span>Center: Concrete Stormwater Canal</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-900">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#0f766e]" />
                <span>Culvert Pipe Intake: Trash Rack &amp; Debris Choke</span>
              </div>
            </div>

            {/* Realtime Water Depth Gauge Overlay */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-teal-900/15 shadow-sm text-right">
              <div className="text-[10px] uppercase font-bold text-teal-700/80">Simulated Water Depth</div>
              <div className={`text-xl sm:text-2xl font-black font-['Outfit',sans-serif] ${isOverflowingBank ? "text-red-600" : "text-teal-900"}`}>
                {simulatedWaterDepth} <span className="text-xs font-semibold text-teal-600">meters</span>
              </div>
              <div className="text-[10px] font-medium text-teal-700/80 mt-0.5">
                Bank Capacity: <strong>1.80m</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full min-h-[440px] rounded-xl overflow-hidden border border-teal-900/15 relative bg-[#EBF3F0] p-4 flex flex-col justify-between">
            {/* Notice banner if WebGL was blocked */}
            {webGlError && (
              <div className="mb-2 px-3.5 py-1.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>2D High-Performance Vector Mode Active (WebGL context unavailable or blocked by browser).</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRenderMode("3d");
                    setWebGlAvailable(true);
                    setWebGlError(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-[11px] font-bold text-amber-900 hover:bg-amber-100/70 transition-colors cursor-pointer"
                >
                  Retry 3D
                </button>
              </div>
            )}

            {/* Interactive 2D Vector Cross-Section Stage */}
            <div className="relative w-full h-[340px] bg-[#E8EDEA] rounded-xl overflow-hidden border border-teal-900/10 shadow-inner flex flex-col justify-end">
              {/* Rainfall animation simulation overlay */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-75">
                {Array.from({ length: Math.min(36, Math.floor(customRainfall / 4) + 6) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 bg-blue-400 rounded-full animate-pulse"
                    style={{
                      left: `${(i * 2.8) % 100}%`,
                      top: `${(i * 18) % 70}%`,
                      height: `${10 + (customRainfall / 15)}px`,
                      transform: "rotate(15deg)",
                      opacity: 0.65
                    }}
                  />
                ))}
              </div>

              {/* Cross-Section Elements Landscape */}
              <div className="relative w-full h-[260px] flex items-end">
                {/* 1. Left Bank (Natural Earth Embankment) */}
                <div className="w-[24%] h-[160px] bg-gradient-to-t from-[#5a7d45] to-[#719958] rounded-tr-3xl relative border-r-2 border-[#476337] flex flex-col justify-between p-2 shadow-sm">
                  <div className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Natural Bank
                  </div>
                  <div className="text-[9px] text-white/80">
                    Catchment Slope
                  </div>
                </div>

                {/* 2. Center Stormwater Canal Channel */}
                <div className="w-[46%] h-[200px] bg-[#736c64] relative border-b-8 border-[#544e47] flex flex-col justify-end overflow-hidden shadow-inner">
                  {/* Water Level Fill in Canal */}
                  <div
                    className="w-full transition-all duration-500 relative flex flex-col justify-between"
                    style={{
                      height: `${Math.min(98, Math.max(14, (simulatedWaterDepth / 2.2) * 88))}%`,
                      backgroundColor:
                        customBlockage > 60 || activeScenarioKey === "drainage_failure"
                          ? "#855428"
                          : customRainfall > 100 || activeScenarioKey === "heavy"
                          ? "#1e3a8a"
                          : "#0284c7",
                      opacity: 0.9
                    }}
                  >
                    {/* Animated water waves ripple */}
                    <div className="w-full h-2.5 bg-white/30 animate-pulse" />
                    
                    {/* Water depth marker */}
                    <div className="text-center pb-2">
                      <span className="px-2 py-0.5 rounded bg-black/40 text-[11px] font-extrabold text-white drop-shadow-xs">
                        Canal Depth: {simulatedWaterDepth}m
                      </span>
                    </div>
                  </div>

                  {/* Canal 1.8m Bank Top Limit Line */}
                  <div 
                    className="absolute left-0 right-0 border-b-2 border-dashed border-red-500 z-10 flex items-center justify-end pr-2"
                    style={{ bottom: "80%" }}
                  >
                    <span className="text-[9px] font-extrabold text-red-700 bg-white/90 px-1 rounded">
                      1.80m Bank Overflow Crest
                    </span>
                  </div>

                  {/* Culvert Drainage Intake Mouth on Right Wall */}
                  <div className="absolute right-0 bottom-0 w-16 h-20 bg-[#222222] border-l-4 border-t-4 border-[#3a3a3a] rounded-tl-xl flex items-center justify-center p-1 z-20">
                    {/* Steel trash rack bars */}
                    <div className="w-full h-full flex justify-between px-1">
                      <div className="w-1 h-full bg-[#555555]" />
                      <div className="w-1 h-full bg-[#555555]" />
                      <div className="w-1 h-full bg-[#555555]" />
                    </div>

                    {/* Silt & Trash Choke Heap proportional to customBlockage */}
                    {customBlockage > 10 && (
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-[#5c4028] border-t-2 border-[#805b38] rounded-t-lg transition-all duration-300"
                        style={{ height: `${Math.min(95, customBlockage * 0.9)}%` }}
                        title={`Culvert Choke: ${customBlockage}%`}
                      />
                    )}
                  </div>
                </div>

                {/* 3. Right Bank (Urban Pavement, Street & Residences) */}
                <div className="w-[30%] h-[160px] bg-[#3d3a37] relative flex flex-col justify-between p-2 shadow-sm">
                  {/* Sidewalk border */}
                  <div className="absolute -left-1 top-0 bottom-0 w-2 bg-[#d4cdc5]" />

                  {/* Street Overflow layer when bank is breached */}
                  {isOverflowingBank && (
                    <div
                      className="absolute inset-0 bg-red-600/35 border-t-4 border-red-500 animate-pulse flex items-center justify-center text-center p-1 z-20"
                    >
                      <span className="text-[10px] font-black text-white bg-red-800 px-2 py-1 rounded shadow-md">
                        ⚠️ STREET SUBMERGED: +{(simulatedWaterDepth - 1.8).toFixed(2)}m
                      </span>
                    </div>
                  )}

                  <div className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Urban Street &amp; Homes
                  </div>

                  {/* Roadway yellow divider markings */}
                  <div className="w-full border-t-2 border-dashed border-[#ffeb3b] my-auto" />

                  <div className="text-[9px] text-white/80">
                    Culvert Discharge Outlet
                  </div>
                </div>
              </div>
            </div>

            {/* In-canvas Legend overlay */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-teal-900/10 text-[11px] shadow-sm">
              <div className="flex flex-wrap items-center gap-3 text-teal-900 font-medium">
                <span className="font-bold text-teal-950">Cross-Section Legend:</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#5a7d45]" /> Left Bank</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#736c64]" /> Stormwater Canal</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#222222]" /> Culvert Trash Rack ({customBlockage}% Choked)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#3d3a37]" /> Urban Street</span>
              </div>

              {/* Water Depth readout */}
              <div className="font-bold text-xs">
                Water Depth: <span className={isOverflowingBank ? "text-red-600" : "text-teal-900"}>{simulatedWaterDepth}m</span> (Bank: 1.80m)
              </div>
            </div>
          </div>
        )}

        {/* Live Interactive Simulation Sliders */}
        <div className="mt-4 p-4 bg-white/95 rounded-xl border border-teal-900/10 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-800" />
              <span className="text-xs font-bold text-teal-950">
                Interactive Parameter Stress Controls
              </span>
            </div>
            <span className="text-[11px] text-teal-700/80 italic">
              Slide to observe dynamic 3D backwater &amp; culvert choking in real time
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slider 1: Channel Blockage (%) */}
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-900/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  Drainage Channel Blockage
                </span>
                <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                  customBlockage > 60
                    ? "bg-red-100 text-red-700"
                    : customBlockage > 20
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}>
                  {customBlockage}% Choked
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={customBlockage}
                onChange={(e) => setCustomBlockage(Number(e.target.value))}
                className="w-full h-2 bg-teal-200/60 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-[10px] font-medium text-teal-700/80">
                <span>0% (Clear Culvert)</span>
                <span>50% (Strained)</span>
                <span>100% (Fully Blocked)</span>
              </div>
            </div>

            {/* Slider 2: Rainfall Intensity */}
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-900/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-950 flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-600" />
                  Rainfall Intensity
                </span>
                <span className="font-bold px-2 py-0.5 rounded-md text-[11px] bg-cyan-100 text-cyan-800">
                  {customRainfall} mm/hr
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="2"
                value={customRainfall}
                onChange={(e) => setCustomRainfall(Number(e.target.value))}
                className="w-full h-2 bg-teal-200/60 rounded-lg appearance-none cursor-pointer accent-teal-700"
              />
              <div className="flex justify-between text-[10px] font-medium text-teal-700/80">
                <span>10 (Drizzle)</span>
                <span>90 (Heavy Shower)</span>
                <span>200 (Cloudburst)</span>
              </div>
            </div>
          </div>

          {/* Real-time Dynamic Math Readout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-teal-900/10">
            <div className="p-2.5 bg-teal-50/60 rounded-xl text-center border border-teal-900/5">
              <div className="text-[10px] uppercase font-bold text-teal-700/80">Active Inflow</div>
              <div className="text-sm font-extrabold text-teal-950">{effectiveInflow} m³/s</div>
            </div>

            <div className="p-2.5 bg-teal-50/60 rounded-xl text-center border border-teal-900/5">
              <div className="text-[10px] uppercase font-bold text-teal-700/80">Choked Outflow</div>
              <div className="text-sm font-extrabold text-teal-950">{effectiveOutflow} m³/s</div>
            </div>

            <div className="p-2.5 bg-teal-50/60 rounded-xl text-center border border-teal-900/5">
              <div className="text-[10px] uppercase font-bold text-teal-700/80">Net Surplus Rate</div>
              <div className={`text-sm font-extrabold ${netSurplus > 0 ? "text-red-700" : "text-emerald-700"}`}>
                {netSurplus > 0 ? `+${netSurplus}` : netSurplus} m³/s
              </div>
            </div>

            <div className="p-2.5 bg-teal-50/60 rounded-xl text-center border border-teal-900/5">
              <div className="text-[10px] uppercase font-bold text-teal-700/80">Drainage Clearance</div>
              <div className="text-sm font-extrabold text-teal-950">{effectiveDrainage}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Scenario Comparison Matrix */}
      <section className="mosaic-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-teal-900/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-teal-950 font-['Outfit',sans-serif]">
                Side-by-Side Flood Behavior Comparison Matrix
              </h3>
              <p className="text-xs text-teal-800/80">
                Detailed hydrological parameters contrasting normal precipitation against clogged drainage failure.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-teal-900/15 bg-teal-50/60 text-teal-950">
                <th className="p-3 font-bold">Hydrological Metric</th>
                <th className={`p-3 font-bold ${activeScenarioKey === "normal" ? "bg-emerald-50 text-emerald-800" : ""}`}>
                  1. Normal Rainfall
                </th>
                <th className={`p-3 font-bold ${activeScenarioKey === "heavy" ? "bg-amber-50 text-amber-800" : ""}`}>
                  2. Heavy Rainfall
                </th>
                <th className={`p-3 font-bold ${activeScenarioKey === "drainage_failure" ? "bg-red-50 text-red-800" : ""}`}>
                  3. Drainage Failure (Blocked)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-900/10 text-teal-950">
              <tr>
                <td className="p-3 font-semibold text-teal-900">Inundation Risk Classification</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Low / Negligible
                  </span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                    High / Severe
                  </span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-800">
                    Extreme / Catastrophic
                  </span>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-teal-900">Precipitation Rate</td>
                <td className="p-3 font-medium">28 mm/hr</td>
                <td className="p-3 font-medium">145 mm/hr</td>
                <td className="p-3 font-medium">85 mm/hr (Even moderate rain triggers flood!)</td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-teal-900">Culvert Channel Blockage</td>
                <td className="p-3 font-medium text-emerald-700">5% (Unobstructed)</td>
                <td className="p-3 font-medium text-amber-700">25% (Floating branches)</td>
                <td className="p-3 font-medium text-red-700 font-bold">88% (Silt &amp; Plastic Choke)</td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-teal-900">Peak Flood Water Depth</td>
                <td className="p-3 font-medium">0.38 meters</td>
                <td className="p-3 font-medium">1.85 meters</td>
                <td className="p-3 font-medium font-bold text-red-700">2.45 meters</td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-teal-900">Net Catchment Accumulation</td>
                <td className="p-3 font-medium text-emerald-700">-15 m³/s (Discharging efficiently)</td>
                <td className="p-3 font-medium text-amber-700">+220 m³/s (Surging)</td>
                <td className="p-3 font-medium text-red-700 font-bold">+358 m³/s (Rapid backwater)</td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-teal-900">Time to Street Submergence</td>
                <td className="p-3 font-medium text-emerald-700">No Submergence</td>
                <td className="p-3 font-medium">~45 minutes</td>
                <td className="p-3 font-medium font-bold text-red-700">~18 minutes (Flash Inundation)</td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-teal-900">Hydraulic Behavior &amp; Failure Mode</td>
                <td className="p-3 text-[11px] text-teal-800/80">Laminar smooth drain flow</td>
                <td className="p-3 text-[11px] text-teal-800/80">Embankment overflowing from high volume</td>
                <td className="p-3 text-[11px] text-red-700 font-medium">
                  Severe backwater head forces sewage &amp; stormwater out of city manholes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Physical Phenomena Bullet Points */}
      <div className="p-5 rounded-2xl mosaic-card space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-teal-950 flex items-center gap-2 font-['Outfit',sans-serif]">
          <Info className="w-4 h-4 text-teal-700" />
          <span>Observed Physical Phenomena in "{scenario.title}":</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {scenario.physicalPhenomena.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-teal-50/50 border border-teal-900/10 text-xs text-teal-950">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Consistent Bottom Navigation Bar with Matching Previous & Next Clicking Buttons */}
      <div className="p-4 mosaic-card rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevPage}
          id="sim-btn-prev-bottom"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-teal-900/15 bg-white hover:bg-teal-50/70 text-xs font-semibold text-teal-950 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous: 3D Telemetry Graph</span>
        </button>

        <div className="text-[11px] text-teal-700/80 font-medium text-center hidden md:block">
          Step 2 of 4 &bull; Next up: Demographic impact on local residents &amp; infrastructure
        </div>

        <button
          type="button"
          onClick={onNextPage}
          id="sim-btn-next-bottom"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-sm"
        >
          <span>Next: Estimated Affected Population</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

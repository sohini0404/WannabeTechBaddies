import * as THREE from "three";

/**
 * Safely checks if WebGL or WebGL2 context can actually be created in the current environment
 * without throwing unhandled exceptions.
 */
export function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    if (!gl) return false;

    // Clean up test context immediately
    const loseContext = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    if (loseContext) {
      loseContext.loseContext();
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely creates a Three.js WebGLRenderer wrapped in try-catch.
 * Returns null if WebGL is unavailable or blocked by the browser.
 */
export function createSafeWebGLRenderer(
  parameters: THREE.WebGLRendererParameters
): { renderer: THREE.WebGLRenderer | null; error: Error | null } {
  try {
    const isSupported = checkWebGLSupport();
    if (!isSupported) {
      return {
        renderer: null,
        error: new Error("WebGL context creation is not supported or blocked in this browser environment.")
      };
    }

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "default", // More reliable than 'high-performance' in sandboxed iframes
      failIfMajorPerformanceCaveat: false, // Allow software fallback if GPU is restricted
      ...parameters
    });

    return { renderer, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { renderer: null, error };
  }
}

/**
 * Explicitly releases WebGL context and resources to prevent browser context exhaustion
 * (which causes "Web page caused context loss and was blocked").
 */
export function disposeWebGLRenderer(renderer: THREE.WebGLRenderer | null | undefined): void {
  if (!renderer) return;

  try {
    renderer.dispose();
    renderer.forceContextLoss();

    const gl = renderer.getContext();
    if (gl) {
      const loseExt = gl.getExtension("WEBGL_lose_context");
      if (loseExt) {
        loseExt.loseContext();
      }
    }
  } catch {
    // Silently handle disposal issues
  }
}

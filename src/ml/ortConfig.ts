import * as ort from 'onnxruntime-web';

/**
 * Configure ONNX Runtime Web WASM paths and threading for browser compatibility.
 */
export function configureOrt(): void {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const wasmPath = baseUrl.endsWith('/') ? `${baseUrl}ort-wasm/` : `${baseUrl}/ort-wasm/`;
  ort.env.wasm.wasmPaths = wasmPath;
  // Use 1 thread by default to avoid requiring SharedArrayBuffer / COOP & COEP isolation headers in standard web hosting
  ort.env.wasm.numThreads = 1;
}

/**
 * Resolves a model asset path taking into account the Vite base URL (e.g. /PandoraShield/ on GitHub Pages).
 */
export function getModelAssetUrl(relativePath: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${cleanBase}${cleanPath}`;
}

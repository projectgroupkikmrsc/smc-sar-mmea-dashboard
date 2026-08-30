import * as h5wasm from 'h5wasm';

/**
 * Inisialisasi h5wasm WebAssembly environment
 */
let isH5WasmReady = false;
export async function initH5Wasm() {
  if (!isH5WasmReady) {
    await h5wasm.ready;
    isH5WasmReady = true;
  }
  return h5wasm;
}

/**
 * Membaca keseluruhan fail NetCDF-4/HDF5 (.nc) dan mengekstrak metadata serta dataset
 * @param {ArrayBuffer} arrayBuffer - Data fail .nc
 * @returns {Promise<Object>} Struktur data simulasi
 */
export async function readFullSARSimulation(arrayBuffer) {
  await initH5Wasm();

  const tempName = `sar_drift_${Date.now()}_${Math.floor(Math.random() * 1000)}.nc`;
  h5wasm.FS.writeFile(tempName, new Uint8Array(arrayBuffer));
  
  let file;
  try {
    file = new h5wasm.File(tempName, 'r');

    const latDs = file.get('lat');
    const lngDs = file.get('lng');
    const probDs = file.get('probability');
    const timeDs = file.get('time');
    const distressLatDs = file.get('distressLat');
    const distressLngDs = file.get('distressLng');

    if (!latDs || !lngDs) {
      throw new Error("Fail .nc tidak mengandungi dataset 'lat' atau 'lng' yang sah.");
    }

    const shape = latDs.shape; // [timesteps, scenario, particles] atau [timesteps, particles]
    let numTimeSteps = 1;
    let numParticles = 1;

    if (shape.length === 3) {
      numTimeSteps = shape[0];
      numParticles = shape[2];
    } else if (shape.length === 2) {
      numTimeSteps = shape[0];
      numParticles = shape[1];
    } else {
      numParticles = shape[0];
    }

    // Salin data ke memori biasa supaya boleh digunakan selepas fail ditutup
    const rawLats = new Float32Array(latDs.value);
    const rawLngs = new Float32Array(lngDs.value);
    const rawProbs = probDs ? new Float32Array(probDs.value) : null;
    const rawTimes = timeDs ? Array.from(timeDs.value) : [];

    let distressPos = null;
    if (distressLatDs && distressLngDs) {
      const dLat = distressLatDs.value[0];
      const dLng = distressLngDs.value[0];
      if (!isNaN(dLat) && !isNaN(dLng) && dLat !== 0 && dLng !== 0) {
        distressPos = { lat: dLat, lon: dLng };
      }
    }

    // Jika tiada distressPos dalam dataset, gunakan kedudukan min/max partikel pada langkah pertama
    if (!distressPos && numParticles > 0) {
      distressPos = {
        lat: rawLats[0],
        lon: rawLngs[0]
      };
    }

    return {
      numTimeSteps,
      numParticles,
      rawLats,
      rawLngs,
      rawProbs,
      rawTimes,
      distressPos
    };
  } finally {
    if (file) {
      try { file.close(); } catch (e) { console.warn("Error closing HDF5 file:", e); }
    }
    try { h5wasm.FS.unlink(tempName); } catch (e) { console.warn("Error unlinking temp HDF5:", e); }
  }
}

/**
 * Menjana Grid Kebarangkalian (POC) 2D untuk satu langkah masa tertentu menggunakan Gaussian KDE
 */
export function computeTimeStepPOC(simData, timeStepIndex = 0, rows = 64, cols = 64) {
  const { numTimeSteps, numParticles, rawLats, rawLngs, rawProbs, rawTimes, distressPos } = simData;
  const safeIndex = Math.max(0, Math.min(timeStepIndex, numTimeSteps - 1));

  const offset = safeIndex * numParticles;
  const typedLats = rawLats instanceof Float32Array ? rawLats : new Float32Array(rawLats || []);
  const typedLngs = rawLngs instanceof Float32Array ? rawLngs : new Float32Array(rawLngs || []);
  const lats = typedLats.subarray(offset, offset + numParticles);
  const lngs = typedLngs.subarray(offset, offset + numParticles);
  const typedProbs = rawProbs ? (rawProbs instanceof Float32Array ? rawProbs : new Float32Array(rawProbs)) : null;
  const probs = typedProbs ? typedProbs.subarray(offset, offset + numParticles) : null;

  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  let validCount = 0;

  for (let i = 0; i < numParticles; i++) {
    const lat = lats[i];
    const lng = lngs[i];
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      validCount++;
    }
  }

  // Jika tiada koordinat sah
  if (validCount === 0 || minLat === Infinity) {
    return {
      grid: Array.from({ length: rows }, () => new Float32Array(cols)),
      bounds: [[0, 0], [1, 1]],
      peakPOC: null,
      distressPos,
      timeValue: rawTimes[safeIndex] || null,
      validCount: 0
    };
  }

  // Padding 12% keliling zon zarah
  const latSpan = Math.max(maxLat - minLat, 0.04);
  const lngSpan = Math.max(maxLng - minLng, 0.04);
  const bMinLat = minLat - latSpan * 0.12;
  const bMaxLat = maxLat + latSpan * 0.12;
  const bMinLng = minLng - lngSpan * 0.12;
  const bMaxLng = maxLng + lngSpan * 0.12;

  const grid = Array.from({ length: rows }, () => new Float32Array(cols));
  let maxDensity = 0;
  let peakR = Math.floor(rows / 2);
  let peakC = Math.floor(cols / 2);

  const latRange = bMaxLat - bMinLat;
  const lngRange = bMaxLng - bMinLng;

  for (let i = 0; i < numParticles; i++) {
    const lat = lats[i];
    const lng = lngs[i];
    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) continue;

    const rFrac = (bMaxLat - lat) / latRange;
    const cFrac = (lng - bMinLng) / lngRange;
    const r = Math.floor(rFrac * rows);
    const c = Math.floor(cFrac * cols);
    const weight = probs ? (probs[i] || 1) : 1;

    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      // Gaussian splat 5x5 kernel (radius 2)
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const w = weight * Math.exp(-(dr * dr + dc * dc) / 2.0);
            grid[nr][nc] += w;
            if (grid[nr][nc] > maxDensity) {
              maxDensity = grid[nr][nc];
              peakR = nr;
              peakC = nc;
            }
          }
        }
      }
    }
  }

  // Hitung koordinat Peak POC
  const peakLat = bMaxLat - (peakR / rows) * latRange;
  const peakLng = bMinLng + (peakC / cols) * lngRange;

  return {
    grid,
    maxDensity: maxDensity || 1,
    bounds: [[bMinLat, bMinLng], [bMaxLat, bMaxLng]],
    peakPOC: { lat: peakLat, lon: peakLng, density: maxDensity },
    distressPos,
    timeValue: rawTimes[safeIndex] || null,
    validCount
  };
}

/**
 * Colormap Turbo / SAR Thermal Gradient
 * @param {number} val - Nilai normalisasi antara 0.0 dan 1.0
 * @returns {Array<number>} [r, g, b, a]
 */
function getSARColormapColor(val) {
  if (val <= 0.02) return [0, 0, 0, 0]; // Lutsinar penuh untuk kawasan luar zon

  // Skala kecerunan: Cyan/Biru Gelap -> Hijau Laut -> Kuning Terang -> Oren -> Merah Neon (Puncak)
  let r = 0, g = 0, b = 0, a = Math.min(240, Math.floor(val * 255 * 1.2 + 30));

  if (val < 0.25) {
    const t = val / 0.25;
    r = Math.floor(0 * (1 - t) + 0 * t);
    g = Math.floor(180 * (1 - t) + 230 * t);
    b = Math.floor(255 * (1 - t) + 200 * t);
  } else if (val < 0.5) {
    const t = (val - 0.25) / 0.25;
    r = Math.floor(0 * (1 - t) + 50 * t);
    g = Math.floor(230 * (1 - t) + 255 * t);
    b = Math.floor(200 * (1 - t) + 30 * t);
  } else if (val < 0.75) {
    const t = (val - 0.5) / 0.25;
    r = Math.floor(50 * (1 - t) + 255 * t);
    g = Math.floor(255 * (1 - t) + 165 * t);
    b = Math.floor(30 * (1 - t) + 0 * t);
  } else {
    const t = (val - 0.75) / 0.25;
    r = Math.floor(255 * (1 - t) + 255 * t);
    g = Math.floor(165 * (1 - t) + 20 * t);
    b = Math.floor(0 * (1 - t) + 40 * t);
    a = 250;
  }

  return [r, g, b, a];
}

/**
 * Menghasilkan Data URL imej PNG daripada matriks grid POC 2D
 * @param {Array<Float32Array>} grid 
 * @param {number} maxDensity 
 * @returns {string} Data URL (data:image/png;base64,...)
 */
export function renderPOCToCanvasDataURL(grid, maxDensity) {
  const rows = grid.length;
  const cols = grid[0].length;

  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(cols, rows);
  const data = imgData.data;

  const safeMax = maxDensity > 0 ? maxDensity : 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = (r * cols + c) * 4;
      const normalized = Math.min(1.0, grid[r][c] / safeMax);
      const [red, green, blue, alpha] = getSARColormapColor(normalized);

      data[idx] = red;
      data[idx + 1] = green;
      data[idx + 2] = blue;
      data[idx + 3] = alpha;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}


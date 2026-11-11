(() => {
  'use strict';

  const { UI_TEXT, ELEMENT_META, CELESTIAL_BODIES } = window.SOLAR_DATA;

  function setSrgbTexture(tex) {
    if ('colorSpace' in tex && THREE.SRGBColorSpace) {
      tex.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      tex.encoding = THREE.sRGBEncoding;
    }
  }

// ============================================================================
// Global State
// ============================================================================
const state = {
  lang: 'en',
  isPaused: false,
  speedMultiplier: 1.0,
  showOrbits: true,
  showLabels: true,
  selectedId: null,
  earthWeightKg: 50,
  compareA: 'earth',
  compareB: 'venus'
};

const bodyById = Object.fromEntries(CELESTIAL_BODIES.map((b) => [b.id, b]));

// ============================================================================
// Deterministic 3D Value Noise & FBM (Seamless Spherical Textures)
// ============================================================================
function hash3(ix, iy, iz, seed) {
  let n = (ix * 374761393 + iy * 668265263 + iz * 1274126177 + seed * 1597334677) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  n = n ^ (n >>> 16);
  return (n >>> 0) / 4294967295;
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

function smoothstep(e0, e1, x) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

function noise3(x, y, z, seed = 1) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = fade(x - ix);
  const fy = fade(y - iy);
  const fz = fade(z - iz);

  const c000 = hash3(ix, iy, iz, seed);
  const c100 = hash3(ix + 1, iy, iz, seed);
  const c010 = hash3(ix, iy + 1, iz, seed);
  const c110 = hash3(ix + 1, iy + 1, iz, seed);
  const c001 = hash3(ix, iy, iz + 1, seed);
  const c101 = hash3(ix + 1, iy, iz + 1, seed);
  const c011 = hash3(ix, iy + 1, iz + 1, seed);
  const c111 = hash3(ix + 1, iy + 1, iz + 1, seed);

  const x00 = lerp(c000, c100, fx);
  const x10 = lerp(c010, c110, fx);
  const x01 = lerp(c001, c101, fx);
  const x11 = lerp(c011, c111, fx);

  return lerp(lerp(x00, x10, fy), lerp(x01, x11, fy), fz);
}

function fbm3(x, y, z, octaves = 5, seed = 1) {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    value += amp * noise3(x * freq, y * freq, z * freq, seed + i * 31);
    norm += amp;
    amp *= 0.5;
    freq *= 2.04;
  }
  return value / norm;
}

function createSeededRandom(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateCraters(count, minR, maxR, seed) {
  const rand = createSeededRandom(seed);
  const list = [];
  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1;
    const theta = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    list.push({
      x: s * Math.cos(theta),
      y: u,
      z: s * Math.sin(theta),
      radius: lerp(minR, maxR, Math.pow(rand(), 1.6)),
      depth: lerp(0.55, 1.0, rand())
    });
  }
  return list;
}

// ============================================================================
// Procedural Planet Texture Synthesis (Equirectangular 512x256 Seamless Maps)
// ============================================================================
function buildPlanetMaps(id) {
  const width = 512;
  const height = 256;

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = width;
  colorCanvas.height = height;
  const cCtx = colorCanvas.getContext('2d');
  const cImg = cCtx.createImageData(width, height);
  const cData = cImg.data;

  let bumpCanvas = null;
  let bImg = null;
  let bData = null;
  let roughCanvas = null;
  let rImg = null;
  let rData = null;

  if (id === 'mercury' || id === 'mars' || id === 'moon') {
    bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = width;
    bumpCanvas.height = height;
    bImg = bumpCanvas.getContext('2d').createImageData(width, height);
    bData = bImg.data;
  }

  if (id === 'earth') {
    roughCanvas = document.createElement('canvas');
    roughCanvas.width = width;
    roughCanvas.height = height;
    rImg = roughCanvas.getContext('2d').createImageData(width, height);
    rData = rImg.data;
  }

  const craters =
    id === 'mercury'
      ? generateCraters(58, 0.04, 0.18, 101)
      : id === 'moon'
      ? generateCraters(50, 0.05, 0.19, 303)
      : id === 'mars'
      ? generateCraters(28, 0.035, 0.12, 202)
      : null;

  for (let py = 0; py < height; py++) {
    const v = py / (height - 1);
    const phi = v * Math.PI; // 0 (north pole) to PI (south pole)
    const sinPhi = Math.sin(phi);
    const ny = Math.cos(phi); // +1 north, -1 south

    for (let px = 0; px < width; px++) {
      const u = px / width;
      const theta = u * Math.PI * 2;
      const nx = sinPhi * Math.cos(theta);
      const nz = sinPhi * Math.sin(theta);

      const idx = (py * width + px) * 4;
      let r = 128;
      let g = 128;
      let b = 128;
      let bumpVal = 128;
      let roughVal = 200;

      if (id === 'mercury' || id === 'moon') {
        const seed = id === 'mercury' ? 11 : 77;
        const base = fbm3(nx * 3.4, ny * 3.4, nz * 3.4, 5, seed);
        const micro = fbm3(nx * 14, ny * 14, nz * 14, 3, seed + 9);
        let shade = lerp(0.32, 0.72, base) + (micro - 0.5) * 0.12;
        let elev = base * 0.6 + micro * 0.25;

        for (let c = 0; c < craters.length; c++) {
          const cr = craters[c];
          const dot = clamp(nx * cr.x + ny * cr.y + nz * cr.z, -1, 1);
          const dist = Math.acos(dot);
          if (dist < cr.radius * 1.45) {
            const t = dist / cr.radius;
            if (t < 0.8) {
              const bowl = 1 - (t / 0.8) * (t / 0.8);
              shade -= bowl * 0.18 * cr.depth;
              elev -= bowl * 0.45 * cr.depth;
            } else if (t < 1.15) {
              const rim = Math.sin(((t - 0.8) / 0.35) * Math.PI);
              shade += rim * 0.15 * cr.depth;
              elev += rim * 0.28 * cr.depth;
            } else {
              const ejecta = (1 - (t - 1.15) / 0.3) * 0.06;
              shade += ejecta;
            }
          }
        }

        shade = clamp(shade, 0.18, 0.92);
        if (id === 'mercury') {
          r = shade * 188;
          g = shade * 179;
          b = shade * 171;
        } else {
          r = shade * 205;
          g = shade * 205;
          b = shade * 210;
        }
        bumpVal = clamp((elev + 0.3) * 200, 0, 255);
      } else if (id === 'venus') {
        const warp = fbm3(nx * 2.2, ny * 2.2, nz * 2.2, 4, 21) * 0.65;
        const bands = Math.sin((ny * 6.5 + warp * 2.4) * Math.PI) * 0.5 + 0.5;
        const swirl = fbm3(nx * 4.5 + warp, ny * 2.0, nz * 4.5 - warp, 5, 29);
        const mixVal = clamp(bands * 0.48 + swirl * 0.52, 0, 1);
        r = lerp(186, 248, mixVal);
        g = lerp(128, 214, mixVal);
        b = lerp(52, 134, mixVal);
      } else if (id === 'earth') {
        const cont = fbm3(nx * 2.15 + 0.4, ny * 2.15 - 0.2, nz * 2.15 + 0.7, 6, 33);
        const detail = fbm3(nx * 9.0, ny * 9.0, nz * 9.0, 4, 41);
        const elev = cont * 0.82 + detail * 0.18;
        const polarLat = Math.abs(ny) + (detail - 0.5) * 0.08;

        if (polarLat > 0.87) {
          // Polar Ice Caps
          r = 240;
          g = 247;
          b = 255;
          roughVal = 170;
        } else if (elev < 0.51) {
          // Oceans
          const depthT = smoothstep(0.28, 0.51, elev);
          r = lerp(10, 26, depthT);
          g = lerp(38, 118, depthT);
          b = lerp(96, 178, depthT);
          roughVal = 55; // Glossy ocean specular reflection
        } else {
          // Continents
          const landT = smoothstep(0.51, 0.82, elev);
          const aridity = fbm3(nx * 3.8 + 4.1, ny * 3.8, nz * 3.8 - 2.3, 4, 45);
          const tropicBand = smoothstep(0.08, 0.42, Math.abs(ny)) * (1 - smoothstep(0.42, 0.75, Math.abs(ny)));
          const desert = smoothstep(0.50, 0.72, aridity) * tropicBand;

          let lr = lerp(42, 108, landT);
          let lg = lerp(112, 134, landT);
          let lb = lerp(48, 66, landT);

          // Blend desert ochre
          lr = lerp(lr, 198, desert * 0.85);
          lg = lerp(lg, 168, desert * 0.75);
          lb = lerp(lb, 104, desert * 0.65);

          // High snow/rocky peaks
          const mountain = smoothstep(0.68, 0.88, landT);
          lr = lerp(lr, 165, mountain);
          lg = lerp(lg, 165, mountain);
          lb = lerp(lb, 168, mountain);

          r = lr;
          g = lg;
          b = lb;
          roughVal = 228; // Matte continents
        }
      } else if (id === 'mars') {
        const terrain = fbm3(nx * 2.6, ny * 2.6, nz * 2.6, 5, 55);
        const dust = fbm3(nx * 8.5, ny * 8.5, nz * 8.5, 4, 61);
        const polarLat = Math.abs(ny) + (dust - 0.5) * 0.06;

        if (polarLat > 0.89) {
          r = 242;
          g = 236;
          b = 234;
          bumpVal = 175;
        } else {
          let tone = clamp(terrain * 0.7 + dust * 0.3, 0, 1);
          // Valles Marineris equatorial canyon scar
          const canyonMask =
            smoothstep(0.18, 0.0, Math.abs(ny + 0.12)) *
            smoothstep(0.32, 0.0, Math.abs(u - 0.42)) *
            (0.6 + 0.4 * dust);
          tone -= canyonMask * 0.32;

          let elev = terrain * 0.65 + dust * 0.25 - canyonMask * 0.4;
          for (let c = 0; c < craters.length; c++) {
            const cr = craters[c];
            const dot = clamp(nx * cr.x + ny * cr.y + nz * cr.z, -1, 1);
            const dist = Math.acos(dot);
            if (dist < cr.radius * 1.15) {
              const t = dist / cr.radius;
              if (t < 0.82) {
                elev -= (1 - (t / 0.82) ** 2) * 0.3 * cr.depth;
                tone -= 0.09 * cr.depth;
              } else {
                elev += Math.sin(((t - 0.82) / 0.33) * Math.PI) * 0.18 * cr.depth;
              }
            }
          }

          tone = clamp(tone, 0.1, 0.95);
          r = lerp(112, 224, tone);
          g = lerp(46, 114, tone);
          b = lerp(32, 68, tone);
          bumpVal = clamp((elev + 0.2) * 210, 0, 255);
        }
      } else if (id === 'jupiter') {
        const turb = fbm3(nx * 4.5, ny * 6.5, nz * 4.5, 5, 71);
        const fine = fbm3(nx * 14, ny * 18, nz * 14, 3, 79);
        const latWarp = ny + (turb - 0.5) * 0.11 + (fine - 0.5) * 0.03;

        const bandWave =
          Math.sin(latWarp * 24.0) * 0.45 +
          Math.cos(latWarp * 11.0 + 0.8) * 0.35 +
          (turb - 0.5) * 0.35;
        const t = clamp(bandWave * 0.5 + 0.5, 0, 1);

        // Cream zones vs rust-ochre belts
        r = lerp(158, 242, t);
        g = lerp(94, 222, t);
        b = lerp(62, 188, t);

        // Equatorial deeper brown belt accent
        const eqBelt = smoothstep(0.24, 0.08, Math.abs(ny - 0.12));
        r = lerp(r, 146, eqBelt * 0.45);
        g = lerp(g, 82, eqBelt * 0.45);
        b = lerp(b, 50, eqBelt * 0.45);

        // Great Red Spot at southern latitude ~22 deg (ny ~ -0.37)
        let du = Math.abs(u - 0.36);
        if (du > 0.5) du = 1 - du;
        const dv = (ny + 0.37) / 0.115;
        const spotDist = Math.sqrt((du / 0.068) ** 2 + dv ** 2);
        if (spotDist < 1.2) {
          const swirlRing = Math.sin(spotDist * 10.0 + turb * 3.5) * 0.5 + 0.5;
          const spotMix = 1 - smoothstep(0.6, 1.18, spotDist);
          r = lerp(r, lerp(194, 224, swirlRing), spotMix);
          g = lerp(g, lerp(72, 108, swirlRing), spotMix);
          b = lerp(b, lerp(48, 72, swirlRing), spotMix);
        }
      } else if (id === 'saturn') {
        const turb = fbm3(nx * 3.5, ny * 8.0, nz * 3.5, 4, 83);
        const lat = ny + (turb - 0.5) * 0.04;
        const bands = Math.sin(lat * 20.0) * 0.45 + Math.cos(lat * 9.0) * 0.35 + (turb - 0.5) * 0.2;
        const t = clamp(bands * 0.5 + 0.5, 0, 1);

        r = lerp(194, 245, t);
        g = lerp(168, 224, t);
        b = lerp(116, 174, t);

        // Subtle muted North Polar Hexagon tint
        if (ny > 0.84) {
          const polarMix = smoothstep(0.84, 0.96, ny);
          r = lerp(r, 142, polarMix * 0.55);
          g = lerp(g, 152, polarMix * 0.55);
          b = lerp(b, 148, polarMix * 0.55);
        }
      } else if (id === 'uranus') {
        const haze = fbm3(nx * 3.0, ny * 6.0, nz * 3.0, 4, 91);
        const bands = Math.sin((ny + (haze - 0.5) * 0.03) * 10.0) * 0.5 + 0.5;
        const polarHood = smoothstep(0.55, 0.95, Math.abs(ny));
        const t = clamp(bands * 0.4 + haze * 0.35 + polarHood * 0.25, 0, 1);
        r = lerp(104, 178, t);
        g = lerp(212, 244, t);
        b = lerp(224, 248, t);
      } else if (id === 'neptune') {
        const turb = fbm3(nx * 4.2, ny * 7.5, nz * 4.2, 5, 97);
        const bands = Math.sin((ny + (turb - 0.5) * 0.06) * 14.0) * 0.5 + 0.5;
        const t = clamp(bands * 0.45 + turb * 0.55, 0, 1);

        r = lerp(28, 72, t);
        g = lerp(66, 134, t);
        b = lerp(176, 242, t);

        // Bright white methane cirrus streaks
        const streakNoise = fbm3(nx * 2.5, ny * 18.0, nz * 2.5, 3, 105);
        if (streakNoise > 0.68 && Math.abs(ny) < 0.72) {
          const streak = smoothstep(0.68, 0.82, streakNoise);
          r = lerp(r, 215, streak * 0.85);
          g = lerp(g, 236, streak * 0.85);
          b = lerp(b, 255, streak * 0.85);
        }

        // Great Dark Spot
        let du = Math.abs(u - 0.62);
        if (du > 0.5) du = 1 - du;
        const dv = (ny + 0.32) / 0.11;
        const spot = Math.sqrt((du / 0.065) ** 2 + dv ** 2);
        if (spot < 1.15) {
          const darkMix = 1 - smoothstep(0.5, 1.12, spot);
          r = lerp(r, 16, darkMix * 0.75);
          g = lerp(g, 38, darkMix * 0.75);
          b = lerp(b, 122, darkMix * 0.75);
        }
      }

      cData[idx] = clamp(r, 0, 255);
      cData[idx + 1] = clamp(g, 0, 255);
      cData[idx + 2] = clamp(b, 0, 255);
      cData[idx + 3] = 255;

      if (bData) {
        bData[idx] = bumpVal;
        bData[idx + 1] = bumpVal;
        bData[idx + 2] = bumpVal;
        bData[idx + 3] = 255;
      }

      if (rData) {
        rData[idx] = roughVal;
        rData[idx + 1] = roughVal;
        rData[idx + 2] = roughVal;
        rData[idx + 3] = 255;
      }
    }
  }

  cCtx.putImageData(cImg, 0, 0);
  const map = new THREE.CanvasTexture(colorCanvas);
  setSrgbTexture(map);
  map.wrapS = THREE.RepeatWrapping;

  let bumpMap = null;
  if (bumpCanvas) {
    bumpCanvas.getContext('2d').putImageData(bImg, 0, 0);
    bumpMap = new THREE.CanvasTexture(bumpCanvas);
    bumpMap.wrapS = THREE.RepeatWrapping;
  }

  let roughnessMap = null;
  if (roughCanvas) {
    roughCanvas.getContext('2d').putImageData(rImg, 0, 0);
    roughnessMap = new THREE.CanvasTexture(roughCanvas);
    roughnessMap.wrapS = THREE.RepeatWrapping;
  }

  return { map, bumpMap, roughnessMap };
}

function buildEarthCloudTexture() {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(width, height);
  const data = img.data;

  for (let py = 0; py < height; py++) {
    const phi = (py / (height - 1)) * Math.PI;
    const sinPhi = Math.sin(phi);
    const ny = Math.cos(phi);
    for (let px = 0; px < width; px++) {
      const theta = (px / width) * Math.PI * 2;
      const nx = sinPhi * Math.cos(theta);
      const nz = sinPhi * Math.sin(theta);

      const swirl = fbm3(nx * 2.8, ny * 2.8, nz * 2.8, 4, 151);
      const clouds = fbm3(nx * 4.5 + swirl, ny * 4.5, nz * 4.5 - swirl, 5, 163);
      const alpha = smoothstep(0.49, 0.74, clouds) * 235;

      const idx = (py * width + px) * 4;
      data[idx] = 248;
      data[idx + 1] = 252;
      data[idx + 2] = 255;
      data[idx + 3] = clamp(alpha, 0, 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  setSrgbTexture(tex);
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

function buildRingTexture(type) {
  const width = 512;
  const height = 16;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const rand = createSeededRandom(type === 'saturn' ? 501 : 601);

  for (let x = 0; x < width; x++) {
    const t = x / (width - 1); // 0 = inner edge, 1 = outer edge
    let r = 220;
    let g = 205;
    let b = 175;
    let a = 0;

    if (type === 'saturn') {
      const fineRipple = Math.sin(t * 240) * 0.08 + Math.sin(t * 95) * 0.07 + (rand() - 0.5) * 0.06;
      if (t < 0.08) {
        // Faint D Ring
        a = smoothstep(0.0, 0.08, t) * 0.14;
        r = 165;
        g = 152;
        b = 132;
      } else if (t < 0.25) {
        // C Ring (dusky translucent crepe)
        a = 0.22 + fineRipple * 0.35;
        r = 178;
        g = 162;
        b = 138;
      } else if (t < 0.58) {
        // B Ring (bright dense icy bands)
        a = clamp(0.78 + fineRipple + Math.sin(t * 45) * 0.12, 0.45, 0.94);
        const warm = 0.5 + 0.5 * Math.sin(t * 60);
        r = lerp(225, 246, warm);
        g = lerp(202, 228, warm);
        b = lerp(164, 194, warm);
      } else if (t < 0.645) {
        // Cassini Division (distinct dark gap!)
        a = 0.04;
      } else if (t < 0.91) {
        // A Ring + Encke Gap around t=0.84
        if (t > 0.835 && t < 0.855) {
          a = 0.06;
        } else {
          a = clamp(0.56 + fineRipple * 0.65, 0.32, 0.75);
          r = 218;
          g = 205;
          b = 180;
        }
      } else if (t > 0.955 && t < 0.985) {
        // Narrow F Ring
        a = 0.42;
        r = 228;
        g = 216;
        b = 192;
      }
    } else {
      // Uranus subtle dark charcoal/icy narrow ringlets (Epsilon brightest outer)
      r = 148;
      g = 202;
      b = 216;
      const ringlets = [0.18, 0.32, 0.48, 0.64, 0.78];
      for (const pos of ringlets) {
        const d = Math.abs(t - pos);
        if (d < 0.028) {
          a = Math.max(a, (1 - d / 0.028) * 0.28);
        }
      }
      // Brighter Epsilon outer ring
      const dEps = Math.abs(t - 0.91);
      if (dEps < 0.042) {
        a = Math.max(a, (1 - dEps / 0.042) * 0.52);
      }
    }

    ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${clamp(a, 0, 1).toFixed(3)})`;
    ctx.fillRect(x, 0, 1, height);
  }

  const tex = new THREE.CanvasTexture(canvas);
  setSrgbTexture(tex);
  return tex;
}

function createRadialRingGeometry(innerRadius, outerRadius, segments = 128) {
  const geo = new THREE.RingGeometry(innerRadius, outerRadius, segments, 1);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    const radius = v3.length();
    const u = (radius - innerRadius) / (outerRadius - innerRadius);
    uv.setXY(i, clamp(u, 0, 1), 0.5);
  }
  return geo;
}

// ============================================================================
// Custom GLSL Shaders (Solar Photosphere, Corona & Sunlit Planet Atmospheres)
// ============================================================================
const SUN_SURFACE_VERT = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewDir;

  void main() {
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const SUN_SURFACE_FRAG = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewDir;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.07 + vec3(13.1, 7.7, 5.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 p = normalize(vPosition) * 3.6;
    float q = fbm(p + vec3(uTime * 0.14, -uTime * 0.09, uTime * 0.11));
    float gran = fbm(p * 2.3 + q * 2.1 - vec3(uTime * 0.22));
    float spots = smoothstep(0.66, 0.77, fbm(p * 0.85 + vec3(0.0, uTime * 0.03, 0.0)));

    vec3 deepRed = vec3(0.88, 0.22, 0.03);
    vec3 solarOrange = vec3(1.0, 0.55, 0.08);
    vec3 brightGold = vec3(1.0, 0.88, 0.42);
    vec3 hotWhite = vec3(1.0, 0.98, 0.86);

    vec3 col = mix(deepRed, solarOrange, smoothstep(0.22, 0.55, gran));
    col = mix(col, brightGold, smoothstep(0.52, 0.78, gran));
    col = mix(col, hotWhite, smoothstep(0.75, 0.92, gran));

    // Cooler magnetic sunspot regions
    col = mix(col, vec3(0.32, 0.07, 0.01), spots * 0.72);

    // Astrophysical solar limb darkening + subtle chromosphere rim tint
    float ndv = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
    float limb = pow(ndv, 0.42);
    col *= mix(0.62, 1.15, limb);
    col += vec3(1.0, 0.35, 0.05) * pow(1.0 - ndv, 3.0) * 0.55;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const SUN_CORONA_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SUN_CORONA_FRAG = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 centered = (vUv - 0.5) * 2.0;
    float r = length(centered);
    if (r > 1.0) discard;

    float angle = atan(centered.y, centered.x);
    float rays =
      0.5 +
      0.25 * sin(angle * 7.0 + uTime * 0.65) +
      0.15 * cos(angle * 13.0 - uTime * 0.9) +
      0.10 * sin(angle * 23.0 + uTime * 1.4);

    // Inner bright glow + outer radial coronal streamers (limb starts around r=0.44)
    float dr = max(r - 0.40, 0.0);
    float coreHalo = exp(-dr * 6.5) * 1.15;
    float outerStreamers = exp(-dr * 3.8) * (0.45 + 0.55 * rays) * (1.0 - smoothstep(0.70, 1.0, r));
    float intensity = (coreHalo + outerStreamers * 0.58) * (1.0 - smoothstep(0.84, 1.0, r));

    vec3 col = mix(vec3(1.0, 0.42, 0.05), vec3(1.0, 0.88, 0.52), clamp(coreHalo, 0.0, 1.0));
    gl_FragColor = vec4(col * intensity, clamp(intensity, 0.0, 1.0));
  }
`;

const ATMOSPHERE_VERT = `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const ATMOSPHERE_FRAG = `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  uniform float uFrontSide;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 normal = normalize(vWorldNormal);
    vec3 sunDir = normalize(-vWorldPos); // Sun is at world origin (0,0,0)

    float fresnel;
    if (uFrontSide > 0.5) {
      float ndv = clamp(dot(normal, viewDir), 0.0, 1.0);
      fresnel = pow(1.0 - ndv, uPower) * uIntensity;
    } else {
      // BackSide outer shell: dot(normal, viewDir) is 0 at outer edge and negative inward
      float edgeFade = clamp(-dot(normal, viewDir) * 2.65, 0.0, 1.0);
      fresnel = pow(edgeFade, uPower) * uIntensity;
    }

    // Brighten atmosphere on sunlit limb & twilight terminator
    float sunFactor = mix(0.16, 1.0, smoothstep(-0.35, 0.55, dot(normal, sunDir)));
    float alpha = clamp(fresnel * sunFactor, 0.0, 0.9);

    gl_FragColor = vec4(uColor * alpha * 1.25, alpha);
  }
`;

// ============================================================================
// Three.js Scene Setup
// ============================================================================
const container = document.getElementById('canvas-container');
const labelsLayer = document.getElementById('labels-layer');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030612);

const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 1400);
camera.position.set(0, 44, 92);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
} else if (THREE.sRGBEncoding) {
  renderer.outputEncoding = THREE.sRGBEncoding;
}
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.minDistance = 2.0;
controls.maxDistance = 320;

// Lighting: Primary Solar PointLight + Subtle Fill so night sides remain discernible
const sunLight = new THREE.PointLight(0xfff4de, 1.85, 0, 0);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x364a78, 0.34);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0x6c8cff, 0x10172a, 0.18);
scene.add(hemiLight);

// ============================================================================
// Starfield & Asteroid Belt
// ============================================================================
function createStarfield() {
  const starCount = 4600;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const rand = createSeededRandom(9001);

  const palette = [
    new THREE.Color(0xcbdcff), // O/B blue-white
    new THREE.Color(0xffffff), // A white
    new THREE.Color(0xfff4dd), // G yellow-white
    new THREE.Color(0xffd7a8)  // K orange tint
  ];

  for (let i = 0; i < starCount; i++) {
    const r = lerp(240, 560, rand());
    const u = rand() * 2 - 1;
    const theta = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);

    // Slight concentration along Milky Way galactic plane
    const galacticBias = rand() < 0.38 ? u * 0.28 : u;
    const gs = Math.sqrt(1 - galacticBias * galacticBias);

    positions[i * 3] = r * gs * Math.cos(theta);
    positions[i * 3 + 1] = r * galacticBias;
    positions[i * 3 + 2] = r * gs * Math.sin(theta);

    const c = palette[Math.floor(rand() * palette.length)];
    const brightness = lerp(0.45, 1.0, rand());
    colors[i * 3] = c.r * brightness;
    colors[i * 3 + 1] = c.g * brightness;
    colors[i * 3 + 2] = c.b * brightness;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
  });

  const stars = new THREE.Points(geo, mat);
  scene.add(stars);
}

let asteroidBelt = null;
function createAsteroidBelt() {
  const count = 1350;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const rand = createSeededRandom(4444);

  for (let i = 0; i < count; i++) {
    const r = lerp(31.8, 36.2, rand());
    const angle = rand() * Math.PI * 2;
    const y = (rand() - 0.5) * 1.6 * Math.sin(rand() * Math.PI);

    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(angle) * r;

    const shade = lerp(0.42, 0.78, rand());
    colors[i * 3] = shade * 1.0;
    colors[i * 3 + 1] = shade * 0.92;
    colors[i * 3 + 2] = shade * 0.82;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.24,
    vertexColors: true,
    transparent: true,
    opacity: 0.72
  });

  asteroidBelt = new THREE.Points(geo, mat);
  scene.add(asteroidBelt);
}

// ============================================================================
// Build Solar System Objects
// ============================================================================
const bodyObjects = {}; // id -> { data, orbitGroup, tiltGroup, mesh, cloudMesh, moonPivot, orbitLine, hitMesh, labelEl, orbitAngle }
const clickableMeshes = [];
const orbitLines = [];
let sunShaderMat = null;
let sunCoronaMat = null;
let sunCoronaPlane = null;

function buildSolarSystem() {
  createStarfield();
  createAsteroidBelt();

  const initialAngles = {
    sun: 0,
    mercury: 0.6,
    venus: 2.1,
    earth: 4.15,
    mars: 5.4,
    jupiter: 1.25,
    saturn: 3.55,
    uranus: 0.2,
    neptune: 2.85
  };

  for (const body of CELESTIAL_BODIES) {
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.z = THREE.MathUtils.degToRad(body.axialTiltDeg);
    orbitGroup.add(tiltGroup);

    let mesh;
    let cloudMesh = null;
    let moonPivot = null;

    if (body.isStar) {
      sunShaderMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: SUN_SURFACE_VERT,
        fragmentShader: SUN_SURFACE_FRAG
      });
      mesh = new THREE.Mesh(new THREE.SphereGeometry(body.visualRadius, 64, 64), sunShaderMat);
      tiltGroup.add(mesh);

      // Inner Chromosphere Fresnel Rim
      const innerCoronaMat = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(0xff9922) },
          uIntensity: { value: 1.35 },
          uPower: { value: 2.2 }
        },
        vertexShader: ATMOSPHERE_VERT,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uIntensity;
          uniform float uPower;
          varying vec3 vWorldNormal;
          varying vec3 vWorldPos;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float rim = clamp(-dot(normalize(vWorldNormal), viewDir) * 2.0, 0.0, 1.0);
            float alpha = pow(rim, uPower) * uIntensity;
            gl_FragColor = vec4(uColor * alpha, clamp(alpha, 0.0, 1.0));
          }
        `,
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const innerCorona = new THREE.Mesh(
        new THREE.SphereGeometry(body.visualRadius * 1.18, 48, 48),
        innerCoronaMat
      );
      orbitGroup.add(innerCorona);

      // Outer Volumetric Corona Billboard
      sunCoronaMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: SUN_CORONA_VERT,
        fragmentShader: SUN_CORONA_FRAG,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      sunCoronaPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(body.visualRadius * 4.5, body.visualRadius * 4.5),
        sunCoronaMat
      );
      orbitGroup.add(sunCoronaPlane);
    } else {
      const maps = buildPlanetMaps(body.id);
      const matParams = {
        map: maps.map,
        roughness: body.id === 'earth' ? 0.92 : body.id === 'venus' ? 0.72 : 0.85,
        metalness: 0.04
      };
      if (maps.bumpMap) {
        matParams.bumpMap = maps.bumpMap;
        matParams.bumpScale = body.id === 'mercury' ? 0.045 : 0.032;
      }
      if (maps.roughnessMap) {
        matParams.roughnessMap = maps.roughnessMap;
      }

      const planetMat = new THREE.MeshStandardMaterial(matParams);
      mesh = new THREE.Mesh(new THREE.SphereGeometry(body.visualRadius, 56, 56), planetMat);
      tiltGroup.add(mesh);

      // Earth Cloud Layer & Orbiting Moon
      if (body.id === 'earth') {
        const cloudTex = buildEarthCloudTexture();
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.82,
          depthWrite: false,
          roughness: 0.9
        });
        cloudMesh = new THREE.Mesh(
          new THREE.SphereGeometry(body.visualRadius * 1.018, 48, 48),
          cloudMat
        );
        tiltGroup.add(cloudMesh);

        // Orbiting Moon
        moonPivot = new THREE.Group();
        moonPivot.rotation.z = THREE.MathUtils.degToRad(5.14);
        orbitGroup.add(moonPivot);

        const moonMaps = buildPlanetMaps('moon');
        const moonMat = new THREE.MeshStandardMaterial({
          map: moonMaps.map,
          bumpMap: moonMaps.bumpMap,
          bumpScale: 0.025,
          roughness: 0.92
        });
        const moonMesh = new THREE.Mesh(
          new THREE.SphereGeometry(body.visualRadius * 0.27, 28, 28),
          moonMat
        );
        moonMesh.position.set(body.visualRadius * 2.55, 0, 0);
        moonPivot.add(moonMesh);
      }

      // Atmospheric Glow Shader (Earth, Venus, Mars, Gas/Ice Giants)
      if (body.atmosphere) {
        const atmoMat = new THREE.ShaderMaterial({
          uniforms: {
            uColor: { value: new THREE.Color(body.atmosphere.color) },
            uIntensity: { value: body.atmosphere.intensity },
            uPower: { value: body.atmosphere.power },
            uFrontSide: { value: 0.0 }
          },
          vertexShader: ATMOSPHERE_VERT,
          fragmentShader: ATMOSPHERE_FRAG,
          side: THREE.BackSide,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const atmoMesh = new THREE.Mesh(
          new THREE.SphereGeometry(body.visualRadius * body.atmosphere.scale, 48, 48),
          atmoMat
        );
        tiltGroup.add(atmoMesh);

        // Extra thick upper-cloud haze rim for Venus
        if (body.id === 'venus') {
          const hazeMat = new THREE.ShaderMaterial({
            uniforms: {
              uColor: { value: new THREE.Color('#ffe08c') },
              uIntensity: { value: 0.42 },
              uPower: { value: 3.4 },
              uFrontSide: { value: 1.0 }
            },
            vertexShader: ATMOSPHERE_VERT,
            fragmentShader: ATMOSPHERE_FRAG,
            side: THREE.FrontSide,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });
          const hazeMesh = new THREE.Mesh(
            new THREE.SphereGeometry(body.visualRadius * 1.022, 48, 48),
            hazeMat
          );
          tiltGroup.add(hazeMesh);
        }
      }

      // Planetary Rings (Saturn detailed multi-ring & Uranus tilted rings)
      if (body.rings) {
        const ringGeo = createRadialRingGeometry(body.rings.innerRadius, body.rings.outerRadius, 128);
        const ringTex = buildRingTexture(body.rings.type);
        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          transparent: true,
          side: THREE.DoubleSide,
          roughness: 0.78,
          metalness: 0.05,
          depthWrite: false
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        tiltGroup.add(ringMesh);
      }

      // Orbit Line Loop
      const segments = 192;
      const orbitPts = [];
      for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        orbitPts.push(
          new THREE.Vector3(Math.cos(a) * body.orbitRadius, 0, Math.sin(a) * body.orbitRadius)
        );
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
      const orbitMat = new THREE.LineBasicMaterial({
        color: body.accentColor,
        transparent: true,
        opacity: 0.28
      });
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
      scene.add(orbitLine);
      orbitLines.push({ id: body.id, line: orbitLine });
    }

    // Generous Invisible Hit Sphere so small planets (Mercury/Mars) click reliably
    const hitRadius = Math.max(body.visualRadius * 1.45, 2.0);
    const hitMesh = new THREE.Mesh(
      new THREE.SphereGeometry(hitRadius, 12, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitMesh.userData.bodyId = body.id;
    orbitGroup.add(hitMesh);
    clickableMeshes.push(hitMesh);

    // 2D Floating Projected Label
    const labelEl = document.createElement('button');
    labelEl.type = 'button';
    labelEl.className = 'planet-label-3d';
    labelEl.dataset.id = body.id;
    labelEl.innerHTML = `<span class="planet-label-dot" style="background:${body.accentColor}"></span><span class="label-name"></span>`;
    labelEl.addEventListener('click', (e) => {
      e.stopPropagation();
      selectBody(body.id);
    });
    labelsLayer.appendChild(labelEl);

    const startAngle = initialAngles[body.id] || 0;
    orbitGroup.position.set(
      Math.cos(startAngle) * body.orbitRadius,
      0,
      Math.sin(startAngle) * body.orbitRadius
    );

    bodyObjects[body.id] = {
      data: body,
      orbitGroup,
      tiltGroup,
      mesh,
      cloudMesh,
      moonPivot,
      hitMesh,
      labelEl,
      orbitAngle: startAngle
    };
  }
}

// ============================================================================
// Camera Fly-To & Moving-Planet Tracking
// ============================================================================
let flyToActive = false;
const flyGoalCamPos = new THREE.Vector3();
const flyGoalTarget = new THREE.Vector3();
const prevTrackedPos = new THREE.Vector3();
let hasPrevTrackedPos = false;

function getIdealDistance(body) {
  if (body.isStar) return body.visualRadius * 3.8;
  if (body.rings) return body.rings.outerRadius * 2.35;
  return Math.max(body.visualRadius * 4.4, 3.8);
}

function focusCameraOnBody(id) {
  const obj = bodyObjects[id];
  if (!obj) return;

  controls.minDistance = Math.max(obj.data.visualRadius * 1.45, 1.8);

  const worldPos = obj.orbitGroup.position.clone();
  const dist = getIdealDistance(obj.data);

  // Approach from a flattering 3/4 sunlit angle
  const dirFromCenter = worldPos.lengthSq() > 0.01 ? worldPos.clone().normalize() : new THREE.Vector3(0, 0, 1);
  const sideVec = new THREE.Vector3(-dirFromCenter.z, 0, dirFromCenter.x).normalize();

  const offset = new THREE.Vector3()
    .addScaledVector(dirFromCenter, dist * 0.58)
    .addScaledVector(sideVec, dist * 0.72)
    .add(new THREE.Vector3(0, dist * 0.36, 0));

  flyGoalTarget.copy(worldPos);
  flyGoalCamPos.copy(worldPos).add(offset);
  flyToActive = true;

  prevTrackedPos.copy(worldPos);
  hasPrevTrackedPos = true;
}

function resetCameraOverview() {
  state.selectedId = null;
  controls.minDistance = 2.0;
  flyGoalTarget.set(0, 0, 0);
  flyGoalCamPos.set(0, 44, 92);
  flyToActive = true;
  hasPrevTrackedPos = false;
  closePlanetLabUI();
  updateActiveIndicators();
}

// Stop fly-to immediately if user manually interacts with OrbitControls
controls.addEventListener('start', () => {
  flyToActive = false;
});

// ============================================================================
// Raycasting (Click vs Drag Discrimination)
// ============================================================================
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downX = 0;
let downY = 0;

renderer.domElement.addEventListener('pointerdown', (e) => {
  downX = e.clientX;
  downY = e.clientY;
});

renderer.domElement.addEventListener('pointerup', (e) => {
  const dx = e.clientX - downX;
  const dy = e.clientY - downY;
  if (Math.hypot(dx, dy) > 6) return; // Dragged camera, not a click

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(clickableMeshes, false);
  if (hits.length > 0) {
    const bodyId = hits[0].object.userData.bodyId;
    if (bodyId) {
      selectBody(bodyId);
    }
  }
});

// ============================================================================
// UI Logic, Bilingual Rendering & Planet Lab Dashboard
// ============================================================================
const els = {
  loadingOverlay: document.getElementById('loading-overlay'),
  loadingTitle: document.getElementById('loading-title'),
  loadingSub: document.getElementById('loading-sub'),
  appTitle: document.getElementById('app-title'),
  appSubtitle: document.getElementById('app-subtitle'),
  langToggleBtn: document.getElementById('lang-toggle-btn'),
  langBadge: document.getElementById('lang-badge'),
  langToggleLabel: document.getElementById('lang-toggle-label'),
  compareBtn: document.getElementById('compare-btn'),
  compareBtnText: document.getElementById('compare-btn-text'),
  resetViewBtn: document.getElementById('reset-view-btn'),
  resetBtnText: document.getElementById('reset-btn-text'),

  bottomDock: document.getElementById('bottom-dock'),
  planetPills: document.getElementById('planet-pills'),
  playPauseBtn: document.getElementById('play-pause-btn'),
  playPauseIcon: document.getElementById('play-pause-icon'),
  playPauseText: document.getElementById('play-pause-text'),
  speedLabel: document.getElementById('speed-label'),
  speedSlider: document.getElementById('speed-slider'),
  speedValue: document.getElementById('speed-value'),
  toggleOrbitsBtn: document.getElementById('toggle-orbits-btn'),
  orbitsBtnText: document.getElementById('orbits-btn-text'),
  toggleLabelsBtn: document.getElementById('toggle-labels-btn'),
  labelsBtnText: document.getElementById('labels-btn-text'),
  selectPrompt: document.getElementById('select-prompt'),

  planetLab: document.getElementById('planet-lab'),
  labPlanetOrb: document.getElementById('lab-planet-orb'),
  labPlanetName: document.getElementById('lab-planet-name'),
  labPlanetCategory: document.getElementById('lab-planet-category'),
  labFocusBtn: document.getElementById('lab-focus-btn'),
  labCloseBtn: document.getElementById('lab-close-btn'),
  labStatsGrid: document.getElementById('lab-stats-grid'),

  tempCardTitle: document.getElementById('temp-card-title'),
  tempStatusBadge: document.getElementById('temp-status-badge'),
  thermoRangeSpan: document.getElementById('thermo-range-span'),
  thermoMeanPin: document.getElementById('thermo-mean-pin'),
  tempDayLabel: document.getElementById('temp-day-label'),
  tempMeanLabel: document.getElementById('temp-mean-label'),
  tempNightLabel: document.getElementById('temp-night-label'),
  tempDayC: document.getElementById('temp-day-c'),
  tempDayF: document.getElementById('temp-day-f'),
  tempMeanC: document.getElementById('temp-mean-c'),
  tempMeanF: document.getElementById('temp-mean-f'),
  tempNightC: document.getElementById('temp-night-c'),
  tempNightF: document.getElementById('temp-night-f'),
  tempFact: document.getElementById('temp-fact'),

  elementsCardTitle: document.getElementById('elements-card-title'),
  atmoSubTitle: document.getElementById('atmo-sub-title'),
  interiorSubTitle: document.getElementById('interior-sub-title'),
  atmoBars: document.getElementById('atmo-bars'),
  interiorBars: document.getElementById('interior-bars'),
  compNote: document.getElementById('comp-note'),

  envCardTitle: document.getElementById('env-card-title'),
  envPressureLabel: document.getElementById('env-pressure-label'),
  envPressureVal: document.getElementById('env-pressure-val'),
  envWindLabel: document.getElementById('env-wind-label'),
  envWindVal: document.getElementById('env-wind-val'),
  windAnimTrack: document.getElementById('wind-anim-track'),
  windStreak: document.getElementById('wind-streak'),
  envGravityLabel: document.getElementById('env-gravity-label'),
  envGravityVal: document.getElementById('env-gravity-val'),
  envSurfaceLabel: document.getElementById('env-surface-label'),
  envSurfaceVal: document.getElementById('env-surface-val'),
  hazardsHeading: document.getElementById('hazards-heading'),
  hazardsTags: document.getElementById('hazards-tags'),
  envDesc: document.getElementById('env-desc'),

  calcCardTitle: document.getElementById('calc-card-title'),
  weightInputLabel: document.getElementById('weight-input-label'),
  weightInput: document.getElementById('weight-input'),
  yourWeightLabel: document.getElementById('your-weight-label'),
  calcWeightKg: document.getElementById('calc-weight-kg'),
  calcGravityMult: document.getElementById('calc-gravity-mult'),
  calcWeightNewtons: document.getElementById('calc-weight-newtons'),
  survivalBox: document.getElementById('survival-box'),
  survivalTimeLabel: document.getElementById('survival-time-label'),
  survivalTimeVal: document.getElementById('survival-time-val'),
  whyLabel: document.getElementById('why-label'),
  survivalReason: document.getElementById('survival-reason'),

  compareModal: document.getElementById('compare-modal'),
  compareTitle: document.getElementById('compare-title'),
  compareSubtitle: document.getElementById('compare-subtitle'),
  compareCloseBtn: document.getElementById('compare-close-btn'),
  compareLabelA: document.getElementById('compare-label-a'),
  compareLabelB: document.getElementById('compare-label-b'),
  compareSelectA: document.getElementById('compare-select-a'),
  compareSelectB: document.getElementById('compare-select-b'),
  comparePresetsLabel: document.getElementById('compare-presets-label'),
  compareBody: document.getElementById('compare-body')
};

function cToF(c) {
  return Math.round((c * 9) / 5 + 32);
}

function formatTempC(c) {
  const sign = c > 0 ? '+' : '';
  return `${sign}${c.toLocaleString()} °C`;
}

function formatTempF(c) {
  const f = cToF(c);
  const sign = f > 0 ? '+' : '';
  return `${sign}${f.toLocaleString()} °F`;
}

// Piecewise cosmic scale mapping matching tick positions:
// -230C -> 0%, 0C -> 28%, 100C -> 44%, 327C -> 63%, 5500C -> 94%, 1,000,000C -> 100%
function tempToPercent(c) {
  if (c <= -230) return 0;
  if (c <= 0) return ((c + 230) / 230) * 28;
  if (c <= 100) return 28 + (c / 100) * 16;
  if (c <= 327) return 44 + ((c - 100) / 227) * 19;
  if (c <= 600) return 63 + ((c - 327) / 273) * 14;
  if (c <= 6000) return 77 + ((c - 600) / 5400) * 17;
  return clamp(94 + (Math.log10(c / 6000) / 2.5) * 6, 94, 100);
}

function buildPlanetPills() {
  els.planetPills.innerHTML = '';
  for (const body of CELESTIAL_BODIES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'planet-pill';
    btn.dataset.id = body.id;
    btn.innerHTML = `<span class="pill-orb" style="background:${body.accentColor}; box-shadow:0 0 8px ${body.accentColor}"></span><span class="pill-name">${body.name[state.lang]}</span>`;
    btn.addEventListener('click', () => selectBody(body.id));
    els.planetPills.appendChild(btn);
  }
}

function populateCompareSelects() {
  const valA = state.compareA;
  const valB = state.compareB;
  els.compareSelectA.innerHTML = '';
  els.compareSelectB.innerHTML = '';

  for (const body of CELESTIAL_BODIES) {
    const optA = document.createElement('option');
    optA.value = body.id;
    optA.textContent = body.name[state.lang];
    els.compareSelectA.appendChild(optA);

    const optB = document.createElement('option');
    optB.value = body.id;
    optB.textContent = body.name[state.lang];
    els.compareSelectB.appendChild(optB);
  }
  els.compareSelectA.value = valA;
  els.compareSelectB.value = valB;
}

function renderCompositionBars(containerEl, list) {
  containerEl.innerHTML = '';
  for (const item of list) {
    const meta = ELEMENT_META[item.id];
    const row = document.createElement('div');
    row.className = 'elem-bar-item';
    const pctDisplay = item.pct < 0.1 ? `${item.pct.toFixed(2)}%` : `${item.pct}%`;
    const widthPct = Math.max(item.pct, item.pct > 0 ? 2 : 0);

    row.innerHTML = `
      <div class="elem-bar-top">
        <span class="elem-name-wrap">
          <span class="elem-formula" style="border-left: 3px solid ${meta.color}">${meta.formula}</span>
          <span>${meta[state.lang]}</span>
        </span>
        <span class="elem-pct">${pctDisplay}</span>
      </div>
      <div class="elem-track">
        <div class="elem-fill" style="width:${widthPct}%; background:linear-gradient(90deg, ${meta.color}bb, ${meta.color})"></div>
      </div>
    `;
    containerEl.appendChild(row);
  }
}

function updateWeightCalculator() {
  if (!state.selectedId) return;
  const body = bodyById[state.selectedId];
  const t = UI_TEXT[state.lang];
  const earthKg = Math.max(0, parseFloat(els.weightInput.value) || 0);
  state.earthWeightKg = earthKg;

  const planetWeight = earthKg * body.gravityEarth;
  const forceNewtons = earthKg * body.gravityMs2;

  els.calcWeightKg.textContent = `${planetWeight.toFixed(1)} ${t.units.kg}`;
  els.calcGravityMult.textContent = `${body.gravityEarth.toFixed(2)}${t.units.earthRatio}`;
  els.calcWeightNewtons.textContent = `${forceNewtons.toFixed(1)} ${t.units.N}`;

  document.querySelectorAll('.preset-chip').forEach((chip) => {
    chip.classList.toggle('active', Number(chip.dataset.weight) === earthKg);
  });
}

function renderPlanetLab() {
  if (!state.selectedId) return;
  const body = bodyById[state.selectedId];
  const lang = state.lang;
  const t = UI_TEXT[lang];

  els.labPlanetOrb.style.background = `radial-gradient(circle at 30% 30%, #ffffff99, ${body.accentColor} 58%, #020617)`;
  els.labPlanetName.textContent = body.name[lang];
  els.labPlanetCategory.textContent = body.category[lang];

  // 6-cell Quick Stats
  const s = body.stats;
  const statPairs = [
    [t.stats.distance, s.distance[lang]],
    [t.stats.diameter, s.diameter[lang]],
    [t.stats.dayLength, s.dayLength[lang]],
    [t.stats.yearLength, s.yearLength[lang]],
    [t.stats.axialTilt, s.axialTilt],
    [t.stats.moons, s.moons]
  ];
  els.labStatsGrid.innerHTML = statPairs
    .map(
      ([lbl, val]) => `
      <div class="stat-cell">
        <span class="stat-label">${lbl}</span>
        <strong class="stat-val">${val}</strong>
      </div>`
    )
    .join('');

  // Temperature Check Meter
  const temp = body.temperature;
  els.tempStatusBadge.textContent = temp.status[lang];
  els.tempStatusBadge.className = `status-pill ${temp.thermalCategory}`;

  els.tempDayLabel.textContent = temp.customLabels ? t.lab.sunDayLabel : t.lab.dayTemp;
  els.tempMeanLabel.textContent = temp.customLabels ? t.lab.sunMeanLabel : t.lab.meanTemp;
  els.tempNightLabel.textContent = temp.customLabels ? t.lab.sunNightLabel : t.lab.nightTemp;

  els.tempDayC.textContent = formatTempC(temp.dayC);
  els.tempDayF.textContent = formatTempF(temp.dayC);
  els.tempMeanC.textContent = formatTempC(temp.meanC);
  els.tempMeanF.textContent = formatTempF(temp.meanC);
  els.tempNightC.textContent = formatTempC(temp.nightC);
  els.tempNightF.textContent = formatTempF(temp.nightC);
  els.tempFact.textContent = temp.fact[lang];

  const minP = tempToPercent(Math.min(temp.nightC, temp.dayC, temp.meanC));
  const maxP = tempToPercent(Math.max(temp.nightC, temp.dayC, temp.meanC));
  const meanP = tempToPercent(temp.meanC);
  els.thermoRangeSpan.style.left = `${minP}%`;
  els.thermoRangeSpan.style.width = `${Math.max(maxP - minP, 1.5)}%`;
  els.thermoMeanPin.style.left = `${meanP}%`;

  // Elements & Chemical Composition
  renderCompositionBars(els.atmoBars, body.composition.atmosphere);
  renderCompositionBars(els.interiorBars, body.composition.interior);
  els.compNote.textContent = body.composition.note[lang];

  // Environment & Weather Simulator
  els.envPressureVal.textContent = body.pressureLabel[lang];
  els.envWindVal.textContent = body.windLabel[lang];
  els.envGravityVal.textContent = `${body.gravityMs2} ${t.units.ms2} (${body.gravityEarth.toFixed(2)}${t.units.earthRatio})`;
  els.envSurfaceVal.textContent = body.surfaceType[lang];

  if (body.windSpeedKmh <= 0) {
    els.windAnimTrack.style.opacity = '0.25';
    els.windStreak.style.animationPlayState = 'paused';
  } else {
    els.windAnimTrack.style.opacity = '1';
    els.windStreak.style.animationPlayState = 'running';
    const dur = clamp(2.8 - Math.log10(body.windSpeedKmh + 10) * 0.48, 0.35, 2.2);
    els.windStreak.style.animationDuration = `${dur.toFixed(2)}s`;
  }

  els.hazardsTags.innerHTML = body.environment.hazards[lang]
    .map((hz) => `<span class="hazard-pill">${hz}</span>`)
    .join('');
  els.envDesc.textContent = body.environment.description[lang];

  // Weight & Survival Check Calculator
  updateWeightCalculator();
  els.survivalBox.className = `calc-result-box survival-box ${body.survival.severity}`;
  els.survivalTimeVal.textContent = body.survival.time[lang];
  els.survivalReason.textContent = body.survival.reason[lang];
}

function openPlanetLabUI() {
  els.planetLab.classList.remove('hidden');
  els.bottomDock.classList.add('lab-open');
}

function closePlanetLabUI() {
  els.planetLab.classList.add('hidden');
  els.bottomDock.classList.remove('lab-open');
}

function updateActiveIndicators() {
  for (const id of Object.keys(bodyObjects)) {
    bodyObjects[id].labelEl.classList.toggle('active', id === state.selectedId);
  }
  document.querySelectorAll('.planet-pill').forEach((pill) => {
    pill.classList.toggle('active', pill.dataset.id === state.selectedId);
  });
  for (const item of orbitLines) {
    item.line.material.opacity = item.id === state.selectedId ? 0.8 : 0.26;
  }
}

function selectBody(id) {
  state.selectedId = id;
  updateActiveIndicators();
  renderPlanetLab();
  openPlanetLabUI();
  focusCameraOnBody(id);
}

// ============================================================================
// Compare Planets Side-by-Side Modal
// ============================================================================
function renderCompareModal() {
  const a = bodyById[state.compareA];
  const b = bodyById[state.compareB];
  const lang = state.lang;
  const t = UI_TEXT[lang];
  if (!a || !b) return;

  // Gather union of elements across both worlds (atmosphere + interior)
  const atmoIds = Array.from(
    new Set([...a.composition.atmosphere.map((x) => x.id), ...b.composition.atmosphere.map((x) => x.id)])
  );
  const intIds = Array.from(
    new Set([...a.composition.interior.map((x) => x.id), ...b.composition.interior.map((x) => x.id)])
  );

  const getPct = (arr, id) => {
    const found = arr.find((x) => x.id === id);
    return found ? found.pct : 0;
  };

  const wKg = state.earthWeightKg || 50;
  const weightA = (wKg * a.gravityEarth).toFixed(1);
  const weightB = (wKg * b.gravityEarth).toFixed(1);

  els.compareBody.innerHTML = `
    <div class="cmp-section">
      <h3>🌡️ ${t.compare.tempSection}</h3>
      <div class="cmp-temp-grid">
        ${[a, b]
          .map(
            (w) => `
          <div class="cmp-world-card">
            <div class="cmp-world-head">
              <div class="cmp-world-name">
                <span class="pill-orb" style="background:${w.accentColor}; box-shadow:0 0 8px ${w.accentColor}"></span>
                <span>${w.name[lang]}</span>
              </div>
              <span class="status-pill ${w.temperature.thermalCategory}">${w.temperature.status[lang]}</span>
            </div>
            <div class="thermometer-track">
              <div class="thermo-range-span" style="left:${tempToPercent(
                Math.min(w.temperature.nightC, w.temperature.dayC)
              )}%; width:${Math.max(
              tempToPercent(Math.max(w.temperature.nightC, w.temperature.dayC)) -
                tempToPercent(Math.min(w.temperature.nightC, w.temperature.dayC)),
              2
            )}%"></div>
              <div class="thermo-mean-pin" style="left:${tempToPercent(w.temperature.meanC)}%"></div>
            </div>
            <div class="temp-triplet">
              <div class="temp-box">
                <span class="temp-label">${w.temperature.customLabels ? t.lab.sunDayLabel : t.lab.dayTemp}</span>
                <strong class="temp-c">${formatTempC(w.temperature.dayC)}</strong>
                <span class="temp-f">${formatTempF(w.temperature.dayC)}</span>
              </div>
              <div class="temp-box temp-box-mean">
                <span class="temp-label">${w.temperature.customLabels ? t.lab.sunMeanLabel : t.lab.meanTemp}</span>
                <strong class="temp-c">${formatTempC(w.temperature.meanC)}</strong>
                <span class="temp-f">${formatTempF(w.temperature.meanC)}</span>
              </div>
              <div class="temp-box">
                <span class="temp-label">${w.temperature.customLabels ? t.lab.sunNightLabel : t.lab.nightTemp}</span>
                <strong class="temp-c">${formatTempC(w.temperature.nightC)}</strong>
                <span class="temp-f">${formatTempF(w.temperature.nightC)}</span>
              </div>
            </div>
          </div>`
          )
          .join('')}
      </div>
    </div>

    <div class="cmp-section">
      <h3>⚗️ ${t.compare.elementsSection}</h3>
      <span class="sub-heading">${t.lab.atmosphereSub}</span>
      ${atmoIds
        .map((id) => {
          const meta = ELEMENT_META[id];
          const pA = getPct(a.composition.atmosphere, id);
          const pB = getPct(b.composition.atmosphere, id);
          return `
          <div class="cmp-elem-row">
            <div class="cmp-elem-head">
              <span class="elem-name-wrap">
                <span class="elem-formula" style="border-left:3px solid ${meta.color}">${meta.formula}</span>
                <span>${meta[lang]}</span>
              </span>
            </div>
            <div class="cmp-dual-bars">
              <div class="cmp-bar-side">
                <span style="font-size:0.72rem;color:var(--text-secondary);min-width:56px">${a.name[lang]}</span>
                <div class="elem-track"><div class="elem-fill" style="width:${pA}%;background:${meta.color}"></div></div>
                <span class="cmp-bar-pct">${pA}%</span>
              </div>
              <div class="cmp-bar-side">
                <span style="font-size:0.72rem;color:var(--text-secondary);min-width:56px">${b.name[lang]}</span>
                <div class="elem-track"><div class="elem-fill" style="width:${pB}%;background:${meta.color}"></div></div>
                <span class="cmp-bar-pct">${pB}%</span>
              </div>
            </div>
          </div>`;
        })
        .join('')}

      <span class="sub-heading" style="margin-top:8px">${t.lab.interiorSub}</span>
      ${intIds
        .map((id) => {
          const meta = ELEMENT_META[id];
          const pA = getPct(a.composition.interior, id);
          const pB = getPct(b.composition.interior, id);
          return `
          <div class="cmp-elem-row">
            <div class="cmp-elem-head">
              <span class="elem-name-wrap">
                <span class="elem-formula" style="border-left:3px solid ${meta.color}">${meta.formula}</span>
                <span>${meta[lang]}</span>
              </span>
            </div>
            <div class="cmp-dual-bars">
              <div class="cmp-bar-side">
                <span style="font-size:0.72rem;color:var(--text-secondary);min-width:56px">${a.name[lang]}</span>
                <div class="elem-track"><div class="elem-fill" style="width:${pA}%;background:${meta.color}"></div></div>
                <span class="cmp-bar-pct">${pA}%</span>
              </div>
              <div class="cmp-bar-side">
                <span style="font-size:0.72rem;color:var(--text-secondary);min-width:56px">${b.name[lang]}</span>
                <div class="elem-track"><div class="elem-fill" style="width:${pB}%;background:${meta.color}"></div></div>
                <span class="cmp-bar-pct">${pB}%</span>
              </div>
            </div>
          </div>`;
        })
        .join('')}
    </div>

    <div class="cmp-section">
      <h3>🌪️ ${t.compare.envSection}</h3>
      <table class="cmp-matrix-table">
        <thead>
          <tr>
            <th>${t.compare.metricLabel}</th>
            <th>${a.name[lang]}</th>
            <th>${b.name[lang]}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${t.stats.diameter}</td>
            <td>${a.stats.diameter[lang]}</td>
            <td>${b.stats.diameter[lang]}</td>
          </tr>
          <tr>
            <td>${t.lab.gravity}</td>
            <td>${a.gravityMs2} ${t.units.ms2} (${a.gravityEarth.toFixed(2)}${t.units.earthRatio})</td>
            <td>${b.gravityMs2} ${t.units.ms2} (${b.gravityEarth.toFixed(2)}${t.units.earthRatio})</td>
          </tr>
          <tr>
            <td>${t.lab.pressure}</td>
            <td>${a.pressureLabel[lang]}</td>
            <td>${b.pressureLabel[lang]}</td>
          </tr>
          <tr>
            <td>${t.lab.windSpeed}</td>
            <td>${a.windLabel[lang]}</td>
            <td>${b.windLabel[lang]}</td>
          </tr>
          <tr>
            <td>${t.lab.surfaceType}</td>
            <td>${a.surfaceType[lang]}</td>
            <td>${b.surfaceType[lang]}</td>
          </tr>
          <tr>
            <td>${t.compare.weightFor} ${wKg} ${t.compare.kgPerson}</td>
            <td><strong>${weightA} ${t.units.kg}</strong></td>
            <td><strong>${weightB} ${t.units.kg}</strong></td>
          </tr>
          <tr>
            <td>${t.lab.survivalTime}</td>
            <td>${a.survival.time[lang]}</td>
            <td>${b.survival.time[lang]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

// ============================================================================
// Bilingual Language Application (English <-> ಕನ್ನಡ)
// ============================================================================
function applyLanguage() {
  const lang = state.lang;
  const t = UI_TEXT[lang];

  document.documentElement.lang = lang === 'kn' ? 'kn' : 'en';

  els.loadingTitle.textContent = t.loadingTitle;
  els.loadingSub.textContent = t.loadingSub;
  els.appTitle.textContent = t.appTitle;
  els.appSubtitle.textContent = t.appSubtitle;
  els.langBadge.textContent = t.langBadge;
  els.langToggleLabel.textContent = t.langToggleBtn;
  els.compareBtnText.textContent = t.compareBtn;
  els.resetBtnText.textContent = t.resetViewBtn;

  els.playPauseText.textContent = state.isPaused ? t.controls.play : t.controls.pause;
  els.speedLabel.textContent = t.controls.speed;
  els.orbitsBtnText.textContent = t.controls.orbits;
  els.labelsBtnText.textContent = t.controls.labels;
  els.selectPrompt.textContent = t.controls.selectPrompt;

  // Planet Lab static titles
  els.labFocusBtn.title = t.lab.focusCamera;
  els.labCloseBtn.title = t.lab.close;
  els.tempCardTitle.textContent = t.lab.tempTitle;
  els.elementsCardTitle.textContent = t.lab.elementsTitle;
  els.atmoSubTitle.textContent = t.lab.atmosphereSub;
  els.interiorSubTitle.textContent = t.lab.interiorSub;
  els.envCardTitle.textContent = t.lab.envTitle;
  els.envPressureLabel.textContent = t.lab.pressure;
  els.envWindLabel.textContent = t.lab.windSpeed;
  els.envGravityLabel.textContent = t.lab.gravity;
  els.envSurfaceLabel.textContent = t.lab.surfaceType;
  els.hazardsHeading.textContent = t.lab.hazardsLabel;
  els.calcCardTitle.textContent = t.lab.calcTitle;
  els.weightInputLabel.textContent = t.lab.enterWeight;
  els.yourWeightLabel.textContent = t.lab.yourWeight;
  els.survivalTimeLabel.textContent = t.lab.survivalTime;
  els.whyLabel.textContent = t.lab.whyLabel;

  // Compare Modal labels
  els.compareTitle.textContent = t.compare.title;
  els.compareSubtitle.textContent = t.compare.subtitle;
  els.compareLabelA.textContent = t.compare.bodyA;
  els.compareLabelB.textContent = t.compare.bodyB;
  els.comparePresetsLabel.textContent = t.compare.presets;
  document.getElementById('preset-earth-venus').textContent = t.compare.presetEarthVenus;
  document.getElementById('preset-earth-mars').textContent = t.compare.presetEarthMars;
  document.getElementById('preset-gas-giants').textContent = t.compare.presetGasGiants;
  document.getElementById('preset-ice-giants').textContent = t.compare.presetIceGiants;
  document.getElementById('preset-extremes').textContent = t.compare.presetExtremes;

  // Update 3D Labels & Bottom Selector Pills
  for (const body of CELESTIAL_BODIES) {
    const obj = bodyObjects[body.id];
    if (obj) {
      obj.labelEl.querySelector('.label-name').textContent = body.name[lang];
    }
  }
  document.querySelectorAll('.planet-pill').forEach((pill) => {
    const b = bodyById[pill.dataset.id];
    if (b) {
      pill.querySelector('.pill-name').textContent = b.name[lang];
    }
  });

  populateCompareSelects();
  if (state.selectedId) renderPlanetLab();
  if (!els.compareModal.classList.contains('hidden')) renderCompareModal();
}

// ============================================================================
// Event Listeners
// ============================================================================
els.langToggleBtn.addEventListener('click', () => {
  state.lang = state.lang === 'en' ? 'kn' : 'en';
  applyLanguage();
});

function deselectBody() {
  state.selectedId = null;
  controls.minDistance = 2.0;
  closePlanetLabUI();
  updateActiveIndicators();
}

els.resetViewBtn.addEventListener('click', resetCameraOverview);
els.labCloseBtn.addEventListener('click', deselectBody);
els.labFocusBtn.addEventListener('click', () => {
  if (state.selectedId) focusCameraOnBody(state.selectedId);
});

els.playPauseBtn.addEventListener('click', togglePlayPause);
function togglePlayPause() {
  state.isPaused = !state.isPaused;
  const t = UI_TEXT[state.lang];
  els.playPauseBtn.classList.toggle('active', !state.isPaused);
  els.playPauseIcon.textContent = state.isPaused ? '▶' : '❚❚';
  els.playPauseText.textContent = state.isPaused ? t.controls.play : t.controls.pause;
}

els.speedSlider.addEventListener('input', (e) => {
  state.speedMultiplier = parseFloat(e.target.value);
  els.speedValue.textContent = `${state.speedMultiplier.toFixed(1)}×`;
});

els.toggleOrbitsBtn.addEventListener('click', () => {
  state.showOrbits = !state.showOrbits;
  els.toggleOrbitsBtn.classList.toggle('active', state.showOrbits);
  for (const item of orbitLines) {
    item.line.visible = state.showOrbits;
  }
});

els.toggleLabelsBtn.addEventListener('click', () => {
  state.showLabels = !state.showLabels;
  els.toggleLabelsBtn.classList.toggle('active', state.showLabels);
  labelsLayer.style.display = state.showLabels ? 'block' : 'none';
});

els.weightInput.addEventListener('input', updateWeightCalculator);
document.querySelectorAll('.preset-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    els.weightInput.value = chip.dataset.weight;
    updateWeightCalculator();
  });
});

// Compare Modal Controls
els.compareBtn.addEventListener('click', () => {
  if (state.selectedId && state.selectedId !== 'sun') {
    state.compareA = state.selectedId;
    state.compareB = state.selectedId === 'earth' ? 'venus' : 'earth';
  }
  els.compareSelectA.value = state.compareA;
  els.compareSelectB.value = state.compareB;
  renderCompareModal();
  els.compareModal.classList.remove('hidden');
});

els.compareCloseBtn.addEventListener('click', () => {
  els.compareModal.classList.add('hidden');
});
els.compareModal.addEventListener('click', (e) => {
  if (e.target === els.compareModal) els.compareModal.classList.add('hidden');
});
els.compareSelectA.addEventListener('change', (e) => {
  state.compareA = e.target.value;
  renderCompareModal();
});
els.compareSelectB.addEventListener('change', (e) => {
  state.compareB = e.target.value;
  renderCompareModal();
});
document.querySelectorAll('.preset-pill').forEach((btn) => {
  btn.addEventListener('click', () => {
    const [pA, pB] = btn.dataset.pair.split(',');
    state.compareA = pA;
    state.compareB = pB;
    els.compareSelectA.value = pA;
    els.compareSelectB.value = pB;
    renderCompareModal();
  });
});

window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
  if (e.code === 'Space') {
    e.preventDefault();
    togglePlayPause();
  } else if (e.code === 'Escape') {
    if (!els.compareModal.classList.contains('hidden')) {
      els.compareModal.classList.add('hidden');
    } else if (state.selectedId) {
      deselectBody();
    }
  }
});

// ============================================================================
// 2D Projected 3D Labels Update
// ============================================================================
const projVec = new THREE.Vector3();
function updateLabelsProjection() {
  if (!state.showLabels) return;
  const w = window.innerWidth;
  const h = window.innerHeight;

  for (const body of CELESTIAL_BODIES) {
    const obj = bodyObjects[body.id];
    projVec.copy(obj.orbitGroup.position);
    projVec.y += body.visualRadius * 1.18 + 0.35;
    projVec.project(camera);

    // Hide if behind camera
    if (projVec.z > 1) {
      obj.labelEl.style.display = 'none';
      continue;
    }

    const sx = (projVec.x * 0.5 + 0.5) * w;
    const sy = (-projVec.y * 0.5 + 0.5) * h;

    if (sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) {
      obj.labelEl.style.display = 'none';
    } else {
      obj.labelEl.style.display = 'inline-flex';
      obj.labelEl.style.left = `${sx.toFixed(1)}px`;
      obj.labelEl.style.top = `${sy.toFixed(1)}px`;
    }
  }
}

// ============================================================================
// Main Animation Loop
// ============================================================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;

  if (sunShaderMat) sunShaderMat.uniforms.uTime.value = elapsed;
  if (sunCoronaMat) sunCoronaMat.uniforms.uTime.value = elapsed;
  if (sunCoronaPlane) sunCoronaPlane.quaternion.copy(camera.quaternion);

  // Orbital & Axial Motions
  if (!state.isPaused) {
    const orbitStep = dt * 0.24 * state.speedMultiplier;
    const spinStep = dt * 60 * 0.35 * Math.min(state.speedMultiplier, 2.5);

    if (asteroidBelt) {
      asteroidBelt.rotation.y += orbitStep * 0.14;
    }

    for (const body of CELESTIAL_BODIES) {
      const obj = bodyObjects[body.id];
      if (body.orbitRadius > 0) {
        obj.orbitAngle += body.orbitSpeed * orbitStep;
        obj.orbitGroup.position.set(
          Math.cos(obj.orbitAngle) * body.orbitRadius,
          0,
          Math.sin(obj.orbitAngle) * body.orbitRadius
        );
      }

      const dir = body.retrograde ? -1 : 1;
      obj.mesh.rotation.y += body.rotationSpeed * spinStep * dir;
      if (obj.cloudMesh) {
        obj.cloudMesh.rotation.y += body.rotationSpeed * spinStep * 1.28;
      }
      if (obj.moonPivot) {
        obj.moonPivot.rotation.y += orbitStep * 4.5;
      }
    }
  }

  // Track Selected Moving Planet Smoothly
  if (state.selectedId) {
    const trackedObj = bodyObjects[state.selectedId];
    const currentPos = trackedObj.orbitGroup.position;

    if (flyToActive) {
      const delta = currentPos.clone().sub(prevTrackedPos);
      flyGoalTarget.add(delta);
      flyGoalCamPos.add(delta);

      const lerpAlpha = 1 - Math.exp(-5.2 * dt);
      controls.target.lerp(flyGoalTarget, lerpAlpha);
      camera.position.lerp(flyGoalCamPos, lerpAlpha);

      if (camera.position.distanceTo(flyGoalCamPos) < 0.08) {
        flyToActive = false;
      }
    } else if (hasPrevTrackedPos) {
      const delta = currentPos.clone().sub(prevTrackedPos);
      controls.target.add(delta);
      camera.position.add(delta);
    }

    prevTrackedPos.copy(currentPos);
    hasPrevTrackedPos = true;
  } else if (flyToActive) {
    const lerpAlpha = 1 - Math.exp(-4.5 * dt);
    controls.target.lerp(flyGoalTarget, lerpAlpha);
    camera.position.lerp(flyGoalCamPos, lerpAlpha);
    if (camera.position.distanceTo(flyGoalCamPos) < 0.15) {
      flyToActive = false;
    }
  }

  controls.update();
  renderer.render(scene, camera);
  updateLabelsProjection();
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================================================
// Initialize Application
// ============================================================================
function init() {
  buildSolarSystem();
  buildPlanetPills();
  applyLanguage();

  // Start rendering loop, then gracefully fade out loading splash
  animate();
  requestAnimationFrame(() => {
    setTimeout(() => {
      els.loadingOverlay.classList.add('fade-out');
    }, 280);
  });
}

init();
})();

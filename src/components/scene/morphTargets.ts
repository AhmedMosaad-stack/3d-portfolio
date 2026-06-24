// Builds the 5 morph-state position buffers for the point cloud (spec 05).
// All buffers are length count*3, in a shared world space roughly
// x:[-9,9] y:[-5,5] z:[-3,3]. Built once on the client at init.

export type MorphStates = {
  states: Float32Array[]; // [name, sphere, nodes, lattice, funnel]
  random: Float32Array; // count*3, -1..1 per axis
  index: Float32Array; // count, 0..count-1
  node: Float32Array; // count, 0..4 for clustered points, -1 otherwise (R14)
};

const SPAN_X = 15;
const SPAN_Y = 4.2;

function randomSpherePoint(radius: number): [number, number, number] {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = radius * Math.cbrt(Math.random());
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ];
}

/** Sample filled pixels of rendered text into normalized [-0.5,0.5] coords. */
function sampleText(text: string): [number, number][] {
  if (typeof document === "undefined") return [];
  const w = 1100;
  const h = 320;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const words = text.split(" ");
  // Two lines if multi-word, else one.
  const lines = words.length > 1 ? [words[0], words.slice(1).join(" ")] : words;
  const fontSize = lines.length > 1 ? 150 : 200;
  ctx.font = `700 ${fontSize}px Georgia, serif`;
  const lineH = fontSize * 1.02;
  const startY = h / 2 - ((lines.length - 1) * lineH) / 2;
  lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineH));

  const data = ctx.getImageData(0, 0, w, h).data;
  const points: [number, number][] = [];
  const stride = 3; // sample density
  for (let y = 0; y < h; y += stride) {
    for (let x = 0; x < w; x += stride) {
      const alpha = data[(y * w + x) * 4 + 3];
      if (alpha > 128) {
        points.push([x / w - 0.5, y / h - 0.5]);
      }
    }
  }
  return points;
}

function buildName(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const pts = sampleText("AHMED MOSAAD");
  for (let i = 0; i < count; i++) {
    if (pts.length > 0) {
      const [nx, ny] = pts[i % pts.length];
      arr[i * 3] = nx * SPAN_X + (Math.random() - 0.5) * 0.08;
      arr[i * 3 + 1] = -ny * SPAN_Y + (Math.random() - 0.5) * 0.08;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    } else {
      const [x, y, z] = randomSpherePoint(6);
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
  }
  return arr;
}

function buildSphere(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const radius = 5;
  // Fibonacci sphere for even distribution.
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    arr[i * 3] = Math.cos(theta) * r * radius;
    arr[i * 3 + 1] = y * radius;
    arr[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return arr;
}

function buildNodes(
  count: number,
  centers: [number, number, number][]
): Float32Array {
  const arr = new Float32Array(count * 3);
  // ~70% of points cluster into the 5 nodes, rest form a faint lattice.
  const clustered = Math.floor(count * 0.7);
  for (let i = 0; i < count; i++) {
    if (i < clustered) {
      const c = centers[i % centers.length];
      const [dx, dy, dz] = randomSpherePoint(1.1);
      arr[i * 3] = c[0] + dx;
      arr[i * 3 + 1] = c[1] + dy;
      arr[i * 3 + 2] = c[2] + dz;
    } else {
      arr[i * 3] = (Math.random() - 0.5) * SPAN_X * 1.1;
      arr[i * 3 + 1] = (Math.random() - 0.5) * SPAN_Y * 2.2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
  }
  return arr;
}

function buildLattice(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const cols = Math.ceil(Math.sqrt(count * 2.2));
  const rows = Math.ceil(count / cols);
  const gx = SPAN_X * 1.3;
  const gy = SPAN_Y * 1.8;
  for (let i = 0; i < count; i++) {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    arr[i * 3] = (cx / (cols - 1) - 0.5) * gx;
    arr[i * 3 + 1] = (cy / (rows - 1) - 0.5) * gy;
    arr[i * 3 + 2] = Math.sin(cx * 0.5) * Math.cos(cy * 0.5) * 1.5;
  }
  return arr;
}

function buildFunnel(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * Math.PI * 30;
    const radius = (1 - t) * 7 + 0.05;
    arr[i * 3] = Math.cos(angle) * radius;
    arr[i * 3 + 1] = Math.sin(angle) * radius * 0.7;
    arr[i * 3 + 2] = -t * 10 + 2; // pull toward camera focal point
  }
  return arr;
}

export function buildMorphStates(count: number): MorphStates {
  const nodeCenters: [number, number, number][] = [
    [-6.5, 1.6, 0],
    [-3.2, -1.4, 0.5],
    [0, 1.8, -0.5],
    [3.2, -1.2, 0.5],
    [6.5, 1.4, 0],
  ];

  const states = [
    buildName(count),
    buildSphere(count),
    buildNodes(count, nodeCenters),
    buildLattice(count),
    buildFunnel(count),
  ];

  // Must match the clustered fraction used in buildNodes so card hover can
  // pulse the matching cluster (R14).
  const clustered = Math.floor(count * 0.7);

  const random = new Float32Array(count * 3);
  const index = new Float32Array(count);
  const node = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    random[i * 3] = Math.random() * 2 - 1;
    random[i * 3 + 1] = Math.random() * 2 - 1;
    random[i * 3 + 2] = Math.random() * 2 - 1;
    index[i] = i;
    node[i] = i < clustered ? i % nodeCenters.length : -1;
  }

  return { states, random, index, node };
}

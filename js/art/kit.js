/*
 * Copyright 2026 Julien Bombled
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Hand-drawn SVG toolkit: seeded jitter, irregular shapes, people and goats.
// Everything returns SVG markup strings.
(function () {
  const P = Object.freeze({
    ink: "#3b2f2a",
    inkSoft: "#5b4a40",
    paper: "#efe4cf",
    cream: "#f3e9d2",
    plaster: "#e6d6b8",
    plasterDark: "#cdb894",
    wood: "#8a6142",
    woodLight: "#b0835a",
    woodDark: "#5b3f2c",
    ochre: "#c99a4b",
    mustard: "#c9a03f",
    rust: "#a85a3a",
    clay: "#b0573a",
    olive: "#7d7f4a",
    moss: "#5f6b45",
    sage: "#9aa58a",
    meadow: "#8f9a6a",
    meadowFar: "#b3b79a",
    mist: "#e4e5dc",
    sky: "#d8dccf",
    stone: "#a39a8b",
    stoneLight: "#c4bbab",
    slate: "#5f7178",
    teal: "#4d6b68",
    straw: "#d9b766",
    hay: "#c8a85a",
    mud: "#6b5444",
    mudDark: "#4a3a30",
    warm: "#ffd9a0",
    white: "#f6f1e6",
    red: "#a8443a",
    plum: "#6d4b5a",
    pink: "#d98f8a",
    leafRed: "#b5562f",
    leafGold: "#d09a3a",
  });

  let seed = 1;
  function srand(s) {
    seed = (s >>> 0) || 1;
  }
  function rnd() {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const jit = (a) => (rnd() * 2 - 1) * a;
  const f = (n) => Math.round(n * 10) / 10;

  // Catmull-Rom spline through points, as cubic Beziers.
  function smooth(pts, closed) {
    const n = pts.length;
    if (n < 2) return "";
    const get = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
    }
    return closed ? d + "Z" : d;
  }

  function blob(cx, cy, rx, ry, amp = 0.06, n = 12) {
    const pts = [];
    const rot = rnd() * Math.PI;
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * Math.PI * 2;
      const k = 1 + jit(amp);
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return smooth(pts, true);
  }

  // Straight-edged polygon with subdivided, jittered edges.
  function poly(pts, amp = 2.5, closed = true, sub = 2) {
    const out = [];
    const n = pts.length;
    const edges = closed ? n : n - 1;
    for (let i = 0; i < edges; i++) {
      const a = pts[i], b = pts[(i + 1) % n];
      for (let k = 0; k < sub; k++) {
        const t = k / sub;
        out.push([a[0] + (b[0] - a[0]) * t + jit(amp), a[1] + (b[1] - a[1]) * t + jit(amp)]);
      }
    }
    if (!closed) out.push([pts[n - 1][0] + jit(amp), pts[n - 1][1] + jit(amp)]);
    return "M" + out.map((p) => `${f(p[0])},${f(p[1])}`).join("L") + (closed ? "Z" : "");
  }

  const rect = (x, y, w, h, amp = 2.5) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], amp);
  const soft = (pts, amp = 2) => smooth(pts.map((p) => [p[0] + jit(amp), p[1] + jit(amp)]), true);
  const curve = (pts, amp = 1.5) => smooth(pts.map((p) => [p[0] + jit(amp), p[1] + jit(amp)]), false);
  const line = (x1, y1, x2, y2, amp = 2) =>
    `M${f(x1)},${f(y1)}Q${f((x1 + x2) / 2 + jit(amp * 2))},${f((y1 + y2) / 2 + jit(amp * 2))} ${f(x2)},${f(y2)}`;

  function sh(d, fill, o = {}) {
    const sw = o.sw === undefined ? 3 : o.sw;
    const stroke = o.stroke === undefined ? P.ink : o.stroke;
    const attrs = [
      `d="${d}"`,
      `fill="${fill || "none"}"`,
      stroke ? `stroke="${stroke}" stroke-width="${sw}"` : "",
      'stroke-linejoin="round" stroke-linecap="round"',
      o.op !== undefined ? `opacity="${o.op}"` : "",
      o.cls ? `class="${o.cls}"` : "",
      o.extra || "",
    ];
    return `<path ${attrs.join(" ")}/>`;
  }
  const ink = (d, sw = 2.5, o = {}) => sh(d, "none", Object.assign({ sw }, o));
  const g = (content, attrs = "") => `<g ${attrs}>${content}</g>`;
  const tr = (x, y, s = 1, flip = false) => `transform="translate(${f(x)},${f(y)}) scale(${flip ? -s : s},${s})"`;
  const text = (x, y, str, o = {}) =>
    `<text x="${x}" y="${y}" font-family="${o.font || "Caveat, cursive"}" font-size="${o.size || 28}" fill="${o.fill || P.ink}" text-anchor="${o.anchor || "middle"}"${o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : ""}${o.weight ? ` font-weight="${o.weight}"` : ""}>${CH.i18n.escapeHtml(str)}</text>`;

  // Shared defs: filters, patterns, gradients. Injected once in the page.
  function defs() {
    return `
<filter id="f-rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="f-rough-s" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="f-fuzz" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="turbulence" baseFrequency="0.5" numOctaves="2" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="f-blur-s" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="f-blur-l" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="24"/></filter>
<pattern id="p-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="9" stroke="${P.ink}" stroke-width="1.6" opacity=".55"/></pattern>
<pattern id="p-hatch-l" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><line x1="0" y1="0" x2="0" y2="12" stroke="${P.ink}" stroke-width="1.2" opacity=".3"/></pattern>
<pattern id="p-flowers" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="4" fill="${P.rust}" opacity=".35"/><circle cx="45" cy="45" r="4" fill="${P.olive}" opacity=".35"/><path d="M15 21 q2 8 -2 14" stroke="${P.olive}" stroke-width="1.5" fill="none" opacity=".35"/></pattern>
<pattern id="p-tiles" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#e9e4d8"/><path d="M0 0H40V40" stroke="#b9b1a0" stroke-width="2" fill="none"/></pattern>
<pattern id="p-planks" width="160" height="46" patternUnits="userSpaceOnUse"><rect width="160" height="46" fill="${P.woodLight}"/><path d="M0 45H160M100 0V46" stroke="${P.woodDark}" stroke-width="2.5" opacity=".6"/><path d="M10 20q30 -4 60 2" stroke="${P.woodDark}" stroke-width="1.2" fill="none" opacity=".35"/></pattern>
<pattern id="p-fleece" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="#000" opacity=".12"/><circle cx="6" cy="6" r="1.4" fill="#fff" opacity=".12"/></pattern>
<radialGradient id="g-warm"><stop offset="0" stop-color="${P.warm}" stop-opacity=".75"/><stop offset="1" stop-color="${P.warm}" stop-opacity="0"/></radialGradient>
<radialGradient id="g-vignette" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#2a1d14" stop-opacity="0"/><stop offset="1" stop-color="#2a1d14" stop-opacity=".5"/></radialGradient>
<linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd3c6"/><stop offset="1" stop-color="#eee6d2"/></linearGradient>
<linearGradient id="g-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26303a"/><stop offset="1" stop-color="#3c3a3f"/></linearGradient>
<linearGradient id="g-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d2" stop-opacity=".55"/><stop offset="1" stop-color="#fff3d2" stop-opacity="0"/></linearGradient>
<linearGradient id="g-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1efe6" stop-opacity="0"/><stop offset=".5" stop-color="#f1efe6" stop-opacity=".85"/><stop offset="1" stop-color="#f1efe6" stop-opacity="0"/></linearGradient>`;
  }

  // ---------- Faces ----------

  function face(c) {
    let s = "";
    const ex = c.expr || "neutral";
    const look = ex === "skeptic" || ex === "amused" ? 4 : 0;
    // Eyes
    s += sh(blob(-16 + look, -362, 4.2, 5, 0.05, 8), P.ink, { sw: 0 });
    s += sh(blob(16 + look, -362, 4.2, 5, 0.05, 8), P.ink, { sw: 0 });
    // Brows
    const bl = ex === "focus" ? -373 : ex === "skeptic" ? -374 : -376;
    const br = ex === "skeptic" || ex === "amused" ? -384 : ex === "focus" ? -373 : -376;
    s += ink(line(-26, bl + (ex === "focus" ? -2 : 0), -8, bl + (ex === "focus" ? 3 : 0), 0.5), 2.6, { stroke: c.browColor || P.ink });
    s += ink(line(8, br + (ex === "focus" ? 3 : 0), 26, br + (ex === "focus" ? -2 : 0), 0.5), 2.6, { stroke: c.browColor || P.ink });
    // Nose
    s += ink(curve([[2, -356], [6, -344], [0, -341]], 0.5), 2.2, { stroke: P.inkSoft });
    // Mouth
    const mouths = {
      neutral: [[-10, -330], [0, -327], [10, -330]],
      smile: [[-15, -333], [0, -323], [15, -333]],
      amused: [[-12, -329], [2, -326], [14, -333]],
      focus: [[-7, -329], [0, -329], [7, -329]],
      skeptic: [[-11, -327], [2, -329], [12, -332]],
      sad: [[-10, -326], [0, -330], [10, -326]],
      open: [[-10, -332], [0, -322], [10, -332]],
    };
    s += ink(curve(mouths[ex] || mouths.neutral, 0.3), 2.6, { stroke: "#6b3b33" });
    if (ex === "smile") s += sh(soft([[-12, -331], [0, -324], [12, -331], [0, -328]], 0.3), "#f4ece4", { sw: 1.2 });
    // Cheeks
    s += sh(blob(-26, -343, 8, 5, 0.1, 8), c.blush || P.pink, { sw: 0, op: 0.45 });
    s += sh(blob(26, -343, 8, 5, 0.1, 8), c.blush || P.pink, { sw: 0, op: 0.45 });
    if (c.mole) s += `<circle cx="9" cy="-318" r="2" fill="${P.inkSoft}"/>`;
    if (c.freckles) {
      [[-30, -350], [-24, -346], [-34, -344], [-20, -351], [-28, -340], [30, -350], [24, -346], [34, -344], [20, -351], [28, -340], [-4, -350], [5, -349]].forEach(([x, y]) => (s += `<circle cx="${x}" cy="${y}" r="1.4" fill="#a8603e" opacity=".75"/>`));
    }
    return s;
  }

  function glasses(c) {
    const gl = c.glasses;
    if (!gl) return "";
    const col = gl.color || P.ink;
    const w = gl.thick ? 5.5 : 3;
    const tilt = gl.crooked ? `transform="rotate(-6 0 -362)"` : "";
    let s = "";
    s += sh(soft([[-36, -374], [-6, -375], [-6, -352], [-12, -347], [-32, -347], [-37, -356]], 1), "#ffffff", { stroke: col, sw: w, op: 0.95, extra: 'fill-opacity=".14"' });
    s += sh(soft([[6, -375], [36, -374], [37, -356], [32, -347], [12, -347], [6, -352]], 1), "#ffffff", { stroke: col, sw: w, op: 0.95, extra: 'fill-opacity=".14"' });
    s += ink(line(-6, -368, 6, -368, 0.3), w * 0.8, { stroke: col });
    s += ink(line(-37, -368, -44, -364, 0.3), w * 0.7, { stroke: col });
    s += ink(line(37, -368, 44, -364, 0.3), w * 0.7, { stroke: col });
    // Glint
    s += ink(line(-28, -369, -22, -372, 0.2), 2, { stroke: "#ffffff", op: 0.8 });
    if (gl.scratched) s += ink(curve([[12, -368], [22, -360], [30, -352]], 0.5), 1.2, { stroke: "#ffffff", op: 0.7 });
    if (gl.tape) s += sh(rect(-5, -372, 10, 8, 0.6), "#f1ecd0", { sw: 1.5 });
    return g(s, tilt);
  }

  // ---------- People ----------
  // Local coordinates: feet on y=0, about 420 units tall, facing viewer.

  function hairBack(c) {
    const h = c.hair;
    switch (c.hairStyle) {
      case "bob":
        return sh(soft([[-58, -392], [-64, -340], [-62, -300], [-38, -294], [38, -294], [62, -300], [64, -340], [58, -392], [0, -418]], 2), h);
      case "braid":
        return sh(soft([[-50, -392], [-54, -340], [-44, -330], [44, -330], [54, -340], [50, -392], [0, -414]], 2), h);
      case "bun":
        return sh(blob(0, -414, 26, 20, 0.06, 10), h);
      default:
        return "";
    }
  }

  function hairFront(c) {
    const h = c.hair;
    switch (c.hairStyle) {
      case "bob":
        return (
          sh(soft([[-50, -390], [-30, -414], [10, -418], [44, -406], [54, -382], [40, -380], [26, -372], [12, -378], [-4, -372], [-20, -378], [-36, -372], [-46, -360]], 1.5), h) +
          ink(curve([[-20, -406], [-26, -384]], 0.6), 1.6, { stroke: "#2f2018", op: 0.6 }) +
          ink(curve([[8, -410], [6, -386]], 0.6), 1.6, { stroke: "#2f2018", op: 0.6 }) +
          sh(soft([[-48, -384], [-60, -330], [-58, -300], [-48, -318], [-44, -360]], 1.2), h) +
          sh(soft([[48, -384], [60, -330], [58, -300], [48, -318], [44, -360]], 1.2), h)
        );
      case "bun":
        return sh(soft([[-44, -372], [-40, -398], [-14, -412], [16, -412], [40, -398], [44, -372], [30, -390], [0, -396], [-28, -390]], 1.5), h) + ink(curve([[-30, -396], [0, -404], [30, -396]], 0.5), 1.4, { stroke: "#ffffff", op: 0.5 });
      case "swept":
        return sh(soft([[-46, -370], [-44, -400], [-10, -418], [30, -414], [50, -392], [46, -372], [30, -396], [-6, -398], [-30, -388]], 1.5), h);
      case "short":
        return sh(soft([[-46, -368], [-44, -398], [-16, -414], [18, -414], [44, -398], [46, -368], [36, -386], [0, -394], [-36, -386]], 1.5), h);
      case "braid":
        return (
          sh(soft([[-46, -370], [-38, -404], [0, -416], [38, -404], [46, -370], [30, -392], [-4, -396], [-30, -388]], 1.5), h) +
          sh(soft([[48, -352], [64, -300], [60, -240], [50, -238], [48, -300], [40, -344]], 1.5), h) +
          ink(curve([[50, -320], [60, -316]], 0.3), 1.5) + ink(curve([[52, -294], [62, -290]], 0.3), 1.5) + ink(curve([[52, -268], [60, -264]], 0.3), 1.5)
        );
      case "tuft":
        // Short cut, sides trimmed, front lifted and swept to the side.
        return (
          sh(soft([[-46, -366], [-46, -392], [-30, -412], [0, -420], [26, -418], [46, -402], [48, -376], [40, -390], [30, -400], [10, -404], [-6, -398], [-22, -394], [-36, -384]], 1.2), h) +
          sh(soft([[-6, -400], [10, -428], [34, -426], [46, -408], [26, -406]], 1.2), h) +
          ink(curve([[2, -414], [18, -420], [34, -416]], 0.4), 1.4, { stroke: "#5a3a26", op: 0.6 })
        );
      case "fade":
        // Very short sides, darker lifted crest on top.
        return (
          sh(soft([[-46, -360], [-44, -384], [-36, -376], [-40, -356]], 0.8), h, { op: 0.55 }) +
          sh(soft([[46, -360], [44, -384], [36, -376], [40, -356]], 0.8), h, { op: 0.55 }) +
          sh(soft([[-34, -398], [-22, -414], [0, -424], [20, -428], [36, -416], [40, -400], [24, -404], [6, -408], [-14, -404]], 1.2), h) +
          ink(curve([[-6, -416], [6, -432], [16, -426]], 0.6), 2, { stroke: h }) + ink(curve([[10, -418], [24, -434], [30, -424]], 0.6), 2, { stroke: h })
        );
      case "bald":
        return sh(soft([[-46, -360], [-44, -380], [-38, -372]], 1), h) + sh(soft([[46, -360], [44, -380], [38, -372]], 1), h);
      default:
        return "";
    }
  }

  function arm(side, c) {
    const k = side === "L" ? -1 : 1;
    const pose = (side === "L" ? c.poseL : c.poseR) || "down";
    const sleeve = c.sleeve || c.top;
    let s = "";
    if (pose === "pocket") {
      s += sh(soft([[k * 52, -300], [k * 64, -286], [k * 62, -190], [k * 44, -186], [k * 42, -280]], 1.5), sleeve);
      return s;
    }
    if (pose === "up") {
      // Hand raised to the face (phone or chin).
      s += sh(soft([[k * 50, -300], [k * 66, -290], [k * 74, -240], [k * 54, -232], [k * 46, -262]], 1.5), sleeve);
      s += sh(soft([[k * 74, -248], [k * 62, -340], [k * 46, -336], [k * 56, -238]], 1.5), sleeve);
      s += sh(blob(k * 50, -350, 12, 14, 0.08, 9), c.skin);
      return s;
    }
    if (pose === "front") {
      s += sh(soft([[k * 50, -300], [k * 66, -290], [k * 56, -214], [k * 18, -206], [k * 18, -224], [k * 40, -230], [k * 44, -280]], 1.5), sleeve);
      s += sh(blob(k * 14, -214, 12, 12, 0.08, 9), c.skin);
      return s;
    }
    s += sh(soft([[k * 52, -300], [k * 68, -288], [k * 74, -184], [k * 56, -180], [k * 46, -276]], 1.5), sleeve);
    s += sh(blob(k * 65, -172, 12, 13, 0.08, 9), c.skin);
    return s;
  }

  function person(o) {
    const c = Object.assign(
      { skin: "#e8b99c", hair: "#5a3b2a", hairStyle: "short", top: "#7d7b78", pants: "#2a2626", shoes: "#2b2523", seed: 11 },
      o
    );
    srand(c.seed);
    let s = hairBack(c);
    // Legs
    if (c.skirt) {
      s += sh(soft([[-50, -170], [50, -170], [58, -40], [-58, -40]], 2), c.skirt);
      s += sh(rect(-30, -44, 18, 36, 1.5), c.legs || c.skin) + sh(rect(12, -44, 18, 36, 1.5), c.legs || c.skin);
    } else {
      s += sh(soft([[-40, -172], [-6, -172], [-8, -14], [-36, -14]], 1.5), c.pants);
      s += sh(soft([[6, -172], [40, -172], [36, -14], [8, -14]], 1.5), c.pants);
      if (c.cuffs) {
        s += sh(rect(-38, -34, 32, 14, 1), c.pants) + sh(rect(6, -34, 32, 14, 1), c.pants);
      }
    }
    // Feet
    if (c.sandals) {
      s += sh(blob(-22, -9, 20, 9, 0.05, 9), c.skin) + sh(blob(22, -9, 20, 9, 0.05, 9), c.skin);
      s += sh(rect(-40, -10, 36, 8, 1), P.ink) + sh(rect(4, -10, 36, 8, 1), P.ink);
      s += ink(line(-36, -18, -10, -18, 0.5), 5) + ink(line(8, -18, 34, -18, 0.5), 5);
    } else if (c.boots) {
      s += sh(soft([[-40, -48], [-8, -48], [-6, -2], [-44, -2]], 1.5), c.boots) + sh(soft([[8, -48], [40, -48], [44, -2], [6, -2]], 1.5), c.boots);
    } else {
      s += sh(blob(-24, -9, 22, 10, 0.05, 10), c.shoes) + sh(blob(24, -9, 22, 10, 0.05, 10), c.shoes);
    }
    // Torso
    if (c.coatLong) {
      s += sh(soft([[-58, -302], [58, -302], [62, -200], [64, -96], [-64, -96], [-62, -200]], 2), c.top);
    } else {
      s += sh(soft([[-56, -302], [56, -302], [54, -230], [50, -160], [-50, -160], [-54, -230]], 2), c.top);
    }
    if (c.vneck) s += sh(soft([[-16, -302], [0, -272], [16, -302]], 0.5), c.skin, { sw: 2 });
    if (c.sunPrint) {
      s += `<g stroke="#b9c3d6" stroke-width="2" fill="none" opacity=".8"><circle cx="-24" cy="-206" r="8"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = (a * Math.PI) / 180; return `<path d="M${(-24 + Math.cos(r) * 11).toFixed(1)} ${(-206 + Math.sin(r) * 11).toFixed(1)}L${(-24 + Math.cos(r) * 16).toFixed(1)} ${(-206 + Math.sin(r) * 16).toFixed(1)}"/>`; }).join("")}<path d="M-4 -196h34v26h-34zM6 -190l10 10l10 -12"/></g>`;
    }
    if (c.logo) s += sh(blob(0, -236, 22, 16, 0.08, 10), "#f2efe8", { sw: 2 }) + `<path d="M-12 -236a12 8 0 0 1 24 0" fill="none" stroke="#e98a4a" stroke-width="4"/><path d="M-8 -232a8 5 0 0 1 16 0" fill="none" stroke="#5aa0d8" stroke-width="3.5"/>`;
    if (c.pocket) s += sh(rect(16, -262, 24, 22, 1), c.top, { sw: 2 });
    if (c.gilet) s += sh(soft([[-56, -300], [-14, -300], [-10, -164], [-50, -162]], 1.5), c.gilet) + sh(soft([[14, -300], [56, -300], [50, -162], [10, -164]], 1.5), c.gilet) + ink(curve([[-40, -260], [-16, -258]], 0.5), 1.5, { op: 0.6 }) + ink(curve([[16, -258], [40, -260]], 0.5), 1.5, { op: 0.6 }) + ink(curve([[-42, -220], [-14, -218]], 0.5), 1.5, { op: 0.6 }) + ink(curve([[14, -218], [42, -220]], 0.5), 1.5, { op: 0.6 });
    if (c.cardigan) s += sh(soft([[-56, -300], [-18, -298], [-12, -166], [-50, -162]], 1.5), c.cardigan) + sh(soft([[18, -298], [56, -300], [50, -162], [12, -166]], 1.5), c.cardigan);
    if (c.apron) {
      s += sh(soft([[-36, -258], [36, -258], [46, -110], [-46, -110]], 2), c.apron);
      s += `<circle cx="-18" cy="-200" r="5" fill="${P.rust}" opacity=".6"/><circle cx="14" cy="-170" r="5" fill="${P.mustard}" opacity=".7"/><circle cx="20" cy="-224" r="4" fill="${P.olive}" opacity=".6"/><circle cx="-12" cy="-140" r="4" fill="${P.rust}" opacity=".6"/>`;
    }
    if (c.hoodie) s += sh(rect(-26, -214, 52, 34, 1.5), c.top, { sw: 2 }) + ink(line(-6, -300, -8, -268, 0.5), 2) + ink(line(6, -300, 8, -268, 0.5), 2);
    if (c.stetho) s += ink(curve([[-20, -300], [-24, -250], [0, -232], [24, -250], [20, -300]], 0.8), 3, { stroke: "#2f3a40" }) + `<circle cx="0" cy="-228" r="7" fill="#9aa3a8" stroke="${P.ink}" stroke-width="2"/>`;
    if (c.lanyard) s += ink(curve([[-18, -302], [0, -250], [18, -302]], 0.5), 2.5, { stroke: P.rust }) + sh(rect(-10, -252, 20, 26, 1), "#f3efe4", { sw: 2 });
    // Arms
    s += arm("L", c) + arm("R", c);
    if (c.watch) s += sh(rect(c.poseL === "pocket" ? -64 : -76, -196, 20, 12, 0.8), c.watch, { sw: 2 });
    if (c.phone && c.poseR === "up") s += sh(rect(40, -378, 14, 28, 0.8), "#2b2b30", { sw: 2 });
    if (c.mug) s += sh(rect(56, -196, 26, 30, 1.5), c.mug) + ink(curve([[82, -190], [92, -182], [82, -172]], 0.5), 3);
    if (c.towel) s += sh(soft([[30, -306], [58, -306], [62, -240], [44, -236]], 1.5), "#f2efe6") + ink(line(36, -280, 58, -280, 0.5), 2, { stroke: P.red });
    // Neck and head
    s += sh(rect(-12, -324, 24, 28, 1.5), c.skin, { sw: 2.5 });
    if (c.necklace) {
      const cols = ["#f2d36b", "#b9a0e0", "#84c98a", "#e98a7a", "#f2a6c8", "#8ec7e6"];
      for (let i = 0; i < 13; i++) {
        const a = Math.PI * (0.15 + (0.7 * i) / 12);
        s += `<circle cx="${f(Math.cos(a) * 20)}" cy="${f(-312 + Math.sin(a) * 14)}" r="3.6" fill="${cols[i % cols.length]}" stroke="${P.ink}" stroke-width="1"/>`;
      }
    }
    if (c.scarf) s += sh(soft([[-30, -318], [30, -318], [34, -298], [-34, -298]], 1.5), c.scarf) + sh(soft([[10, -300], [28, -300], [24, -240], [8, -246]], 1.5), c.scarf);
    s += sh(blob(-44, -358, 8, 11, 0.08, 8), c.skin, { sw: 2.5 }) + sh(blob(44, -358, 8, 11, 0.08, 8), c.skin, { sw: 2.5 });
    s += sh(soft([[-44, -372], [-40, -398], [-20, -412], [20, -412], [40, -398], [44, -372], [42, -340], [26, -316], [0, -310], [-26, -316], [-42, -340]], 1.2), c.skin);
    s += face(c);
    if (c.longBeard) {
      s += sh(soft([[-42, -352], [-40, -320], [-26, -290], [0, -272], [26, -290], [40, -320], [42, -352], [30, -336], [14, -324], [-14, -324], [-30, -336]], 1.6), c.longBeard);
      for (let i = 0; i < 9; i++) s += ink(curve([[-26 + i * 6.5, -332], [-28 + i * 7, -306], [-22 + i * 5.5, -286]], 0.8), 1.3, { stroke: "#f4f1ea", op: 0.55 });
      s += sh(soft([[-20, -338], [0, -344], [20, -338], [12, -333], [0, -337], [-12, -333]], 0.8), c.mustache || c.longBeard);
      s += ink(curve([[-8, -330], [0, -327], [8, -330]], 0.3), 2.4, { stroke: "#6b3b33" });
    }
    if (c.earbuds) s += `<circle cx="-46" cy="-356" r="5" fill="#2a2a2c" stroke="${P.ink}" stroke-width="1.5"/><circle cx="46" cy="-356" r="5" fill="#2a2a2c" stroke="${P.ink}" stroke-width="1.5"/>`;
    if (c.beard) s += sh(soft([[-42, -352], [-30, -320], [0, -306], [30, -320], [42, -352], [30, -336], [12, -322], [-12, -322], [-30, -336]], 1.2), c.beard) + ink(curve([[-8, -330], [0, -327], [8, -330]], 0.3), 2.4, { stroke: "#6b3b33" });
    if (c.mustache) s += sh(soft([[-20, -336], [0, -342], [20, -336], [12, -332], [0, -336], [-12, -332]], 0.8), c.mustache);
    s += hairFront(c);
    s += glasses(c);
    if (c.cap) s += sh(soft([[-46, -386], [-40, -416], [0, -426], [40, -416], [46, -386]], 1.5), c.cap) + sh(soft([[-10, -390], [60, -392], [64, -382], [-6, -380]], 1.5), c.cap);
    if (c.charlotte) s += sh(soft([[-50, -384], [-44, -420], [0, -432], [44, -420], [50, -384], [30, -392], [0, -396], [-30, -392]], 2.5), "#f6f3ec", { op: 0.95 }) + sh(rect(-48, -392, 96, 8, 1), "none", { sw: 1.5, op: 0.6 });
    if (c.hand === "chin") s += sh(soft([[60, -230], [30, -300], [14, -312], [6, -300], [26, -232]], 1.5), c.sleeve || c.top) + sh(blob(10, -312, 13, 12, 0.08, 9), c.skin);
    return s;
  }

  function figure(o, x, y, h, flip) {
    return g(person(o), tr(x, y, h / 430, flip));
  }

  // ---------- Goats ----------
  // Local coordinates: hooves on y=0, facing right.

  function goat(o) {
    const c = Object.assign(
      { coat: P.white, shade: null, horns: true, beard: true, ears: "up", pose: "stand", rx: 74, ry: 34, leg: 62, hs: 1.15, seed: 5 },
      o
    );
    srand(c.seed);
    const shade = c.shade || "#000";
    const legCol = c.legs || c.coat;
    const by = c.pose === "lie" ? -36 : -(c.leg + c.ry - 8);
    let s = "";
    const leg = (x, far) => {
      if (c.pose === "lie") return "";
      const top = by + c.ry * 0.35;
      let r = sh(soft([[x - 10, top], [x + 10, top], [x + 7, top + (0 - top) * 0.55], [x + 5, -10], [x - 5, -10], [x - 6, top + (0 - top) * 0.55]], 1), legCol);
      r += sh(rect(x - 6, -12, 12, 12, 1), c.hoof || P.inkSoft, { sw: 2 });
      if (far) r += sh(soft([[x - 10, top], [x + 10, top], [x + 5, -10], [x - 5, -10]], 0.5), shade, { sw: 0, op: 0.22 });
      return r;
    };
    s += leg(-c.rx * 0.55, true) + leg(c.rx * 0.62, true);
    // Tail
    s += g(sh(soft([[-c.rx + 6, by - c.ry * 0.5], [-c.rx - 10, by - c.ry - 14], [-c.rx - 2, by - c.ry - 16], [-c.rx + 14, by - c.ry * 0.6]], 1), c.tail || c.coat), 'class="g-tail"');
    // Body
    s += sh(blob(0, by, c.rx, c.ry, 0.05, 12), c.coat);
    s += sh(soft([[-c.rx * 0.7, by + c.ry * 0.4], [c.rx * 0.6, by + c.ry * 0.5], [c.rx * 0.3, by + c.ry * 0.95], [-c.rx * 0.5, by + c.ry * 0.9]], 1), shade, { sw: 0, op: 0.12 });
    if (c.patch) s += sh(blob(-c.rx * 0.2, by - 6, c.rx * 0.35, c.ry * 0.55, 0.12, 9), c.patch, { sw: 0, op: 0.9 });
    if (c.stripe) s += ink(curve([[-c.rx * 0.85, by - c.ry * 0.7], [0, by - c.ry - 2], [c.rx * 0.8, by - c.ry * 0.75]], 0.8), 7, { stroke: c.stripe });
    if (c.pose === "lie") {
      s += sh(blob(c.rx * 0.6, -10, 24, 9, 0.06, 8), legCol) + sh(blob(-c.rx * 0.4, -10, 26, 9, 0.06, 8), legCol);
    }
    s += leg(-c.rx * 0.38, false) + leg(c.rx * 0.8, false);
    // Neck
    const nx = c.rx * 0.72, ny = by - c.ry * 0.55;
    const graze = c.pose === "graze";
    const hx = graze ? c.rx + 22 : c.rx + 20;
    const hy = graze ? by + c.ry + 10 : by - c.ry - 40;
    s += sh(soft([[nx - 26, ny - 6], [nx + 6, ny - 22], [hx - 8, hy - 8], [hx + 6, hy + 10], [nx + 22, ny + 18]], 1.2), c.coat);
    if (c.collar) s += ink(line(nx - 4, ny - 18, nx + 16, ny + 4, 0.5), 7, { stroke: c.collar });
    s += g(head(c), `class="g-head" transform="translate(${f(hx)},${f(hy)}) scale(${c.hs}) rotate(${graze ? 50 : 0})"`);
    return s;
  }

  function head(c) {
    let s = "";
    const ears = c.ears === "droop"
      ? sh(soft([[-10, -8], [-34, 8], [-30, 18], [-6, 4]], 1), c.earCol || c.coat)
      : sh(soft([[-10, -10], [-36, -30], [-30, -20], [-14, -2]], 1), c.earCol || c.coat);
    s += g(ears, 'class="g-ear"');
    if (c.horns) s += ink(curve([[-4, -16], [-16, -34], [-34, -44]], 0.6), c.bigHorns ? 9 : 6, { stroke: "#8c7b62" }) + ink(curve([[-4, -16], [-16, -34], [-34, -44]], 0.6), 1.6, { op: 0.6 });
    s += sh(soft([[-18, -10], [0, -18], [16, -12], [30, 0], [32, 10], [24, 14], [6, 10], [-14, 8]], 0.8), c.face || c.coat);
    if (c.faceStripe) s += ink(curve([[-6, -12], [8, -6], [26, 4]], 0.5), 4, { stroke: c.faceStripe, op: 0.9 });
    s += sh(blob(2, -5, 5, 4, 0.05, 8), "#d8b04a", { sw: 1.8 }) + ink(line(-1, -5, 5, -5, 0.2), 2.2);
    s += `<circle cx="29" cy="4" r="2.2" fill="${P.ink}"/>`;
    s += ink(curve([[22, 11], [28, 12]], 0.3), 1.8);
    if (c.beard) s += sh(soft([[16, 10], [22, 30], [12, 14]], 0.8), c.beardCol || c.coat);
    return s;
  }

  function goatAt(o, x, y, scale, flip, extra = "") {
    return g(goat(o), `${tr(x, y, scale, flip)} ${extra}`);
  }

  // ---------- Named goats ----------
  const GOATS = {
    blanchette: { coat: "#f5f1e8", horns: false, beard: true, ears: "up", seed: 21, collar: P.rust },
    biscotte: { coat: "#d6aa72", patch: "#f2e8d6", horns: false, beard: false, ears: "droop", rx: 50, ry: 24, leg: 54, hs: 1.25, seed: 31, face: "#e2bc8a" },
    gerbera: { coat: "#a8703f", stripe: "#2e241e", legs: "#3a2c24", face: "#a8703f", faceStripe: "#2e241e", horns: true, beard: true, seed: 41 },
    tournesol: { coat: "#3b302b", face: "#3b302b", faceStripe: "#efe7d6", legs: "#efe7d6", ears: "droop", horns: false, beard: true, seed: 51, earCol: "#3b302b" },
    gaston: { coat: "#8f8170", horns: true, bigHorns: true, beard: true, beardCol: "#5d5246", rx: 86, ry: 40, leg: 66, seed: 61 },
    duchesse: { coat: "#efe2c6", horns: true, beard: true, seed: 71 },
    herd: { coat: "#ddd2c0", horns: true, beard: true, seed: 81 },
  };
  const namedGoat = (name, x, y, scale, flip, overrides = {}, extra = "") =>
    goatAt(Object.assign({}, GOATS[name], overrides), x, y, scale, flip, extra);

  // ---------- Characters ----------
  const PEOPLE = {
    veronique: { skin: "#ecbfa6", hair: "#5a3b2a", hairStyle: "bob", top: "#7f7c79", pants: "#232121", sandals: true, cuffs: true, vneck: true, pocket: true, necklace: true, watch: "#d9a5a0", mole: true, poseL: "pocket", poseR: "pocket", glasses: { color: "#22403c", thick: true }, seed: 101 },
    mireille: { skin: "#eabba0", hair: "#b9b4ab", hairStyle: "bun", top: "#e8dcc4", cardigan: "#c9a03f", skirt: "#6d5a4a", legs: "#c9b9a6", boots: null, apron: "#efe1c0", shoes: "#4a3a30", seed: 111 },
    thibault: { skin: "#e3b493", hair: "#4a3326", hairStyle: "swept", top: "#e7e2d8", gilet: "#2f3f5a", pants: "#5e6a7a", shoes: "#a8784a", beard: "#4a3326", poseR: "up", phone: true, seed: 121 },
    julien: { skin: "#e3b096", hair: "#3a2a22", hairStyle: "fade", top: "#2e3a5c", sunPrint: true, pants: "#3a3f48", shoes: "#d9d4c8", longBeard: "#b4b0aa", mustache: "#6e665e", earbuds: true, glasses: { color: "#1f2328" }, seed: 131 },
    capucine: { skin: "#f0c7aa", hair: "#b35a2e", hairStyle: "braid", top: "#f3efe6", pants: "#5b6470", apron: "#f6f3ec", shoes: "#3a6d6a", charlotte: true, seed: 141 },
    veto: { skin: "#dcae8e", hair: "#9a958c", hairStyle: "short", top: "#59603f", coatLong: true, pants: "#3a3a36", shoes: "#4a3a30", stetho: true, glasses: { color: "#5a5a5a", scratched: true }, seed: 151 },
    gerard: { skin: "#d9a184", hair: "#6c6258", hairStyle: "short", top: "#8a3d36", pants: "#4a4f44", shoes: "#3a2f28", cap: "#5b5a48", mustache: "#6c6258", glasses: { color: "#7d7d78", crooked: true, tape: true }, seed: 161 },
    benjamin: { skin: "#f2c6ad", hair: "#8a5a38", hairStyle: "tuft", top: "#23211f", logo: true, pants: "#4b5a6e", shoes: "#e8e2d6", freckles: true, blush: "#e78f80", seed: 181 },
    momo: { skin: "#d6a284", hair: "#5a4a3f", hairStyle: "bald", top: "#e9e3d6", apron: "#3b3330", pants: "#3b3330", mustache: "#4a3b32", towel: true, seed: 171 },
  };

  function character(id, x, y, h, flip, over = {}) {
    return figure(Object.assign({}, PEOPLE[id], over), x, y, h, flip);
  }

  const portraitCache = {};
  function portrait(id, expr) {
    const key = id + ":" + (expr || "");
    if (portraitCache[key]) return portraitCache[key];
    const over = { expr: expr || (id === "veronique" ? "smile" : "neutral") };
    if (id === "veronique" && expr === "focus") over.hand = "chin";
    if (id === "thibault") over.poseR = "down";
    const body = person(Object.assign({}, PEOPLE[id], over));
    const svg = `<svg viewBox="${CH.config.portrait.viewBox}" xmlns="http://www.w3.org/2000/svg"><g filter="url(#f-rough-s)">${body}</g></svg>`;
    portraitCache[key] = svg;
    return svg;
  }

  function goatPortrait(name) {
    const key = "goat:" + name;
    if (portraitCache[key]) return portraitCache[key];
    const svg = `<svg viewBox="-60 -190 230 200" xmlns="http://www.w3.org/2000/svg"><g filter="url(#f-rough-s)">${goat(GOATS[name])}</g></svg>`;
    portraitCache[key] = svg;
    return svg;
  }

  // ---------- Scene helpers ----------
  function leaves(n, x0, x1, y0, cls = "leaf") {
    let s = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + rnd() * (x1 - x0);
      const y = y0 + rnd() * 60;
      const col = [P.leafRed, P.leafGold, P.ochre, P.rust][i % 4];
      const delay = (rnd() * 9).toFixed(2);
      const dur = (8 + rnd() * 6).toFixed(2);
      s += `<g class="${cls}" style="animation-delay:-${delay}s;animation-duration:${dur}s"><path d="${soft([[x, y], [x + 9, y - 6], [x + 16, y], [x + 8, y + 6]], 0.6)}" fill="${col}" stroke="${P.ink}" stroke-width="1.4"/></g>`;
    }
    return s;
  }

  function mist(y, h, op = 0.8) {
    return `<g class="mist" opacity="${op}"><rect x="-200" y="${y}" width="2000" height="${h}" fill="url(#g-mist)" filter="url(#f-blur-s)"/></g>`;
  }

  function dust(n, x0, x1, y0, y1) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0);
      s += `<circle class="dust" cx="${f(x)}" cy="${f(y)}" r="${f(1.2 + rnd() * 1.6)}" fill="#fff6dd" style="animation-delay:-${(rnd() * 6).toFixed(2)}s"/>`;
    }
    return s;
  }

  function steam(x, y, n = 3) {
    let s = "";
    for (let i = 0; i < n; i++) {
      s += `<path class="steam" style="animation-delay:-${i * 1.1}s" d="${curve([[x + i * 12, y], [x + i * 12 - 8, y - 30], [x + i * 12 + 6, y - 60], [x + i * 12 - 4, y - 90]], 2)}" stroke="#ffffff" stroke-width="5" fill="none" opacity=".55" stroke-linecap="round"/>`;
    }
    return s;
  }

  function hills(y, col, amp, seedVal) {
    srand(seedVal);
    const pts = [[-40, 900]];
    for (let x = -40; x <= 1640; x += 160) pts.push([x, y + jit(amp)]);
    pts.push([1640, 900]);
    return sh(soft(pts, 4), col, { sw: 2.5 });
  }

  CH.art = {
    P, srand, rnd, jit, smooth, blob, poly, rect, soft, curve, line, sh, ink, g, tr, text,
    defs, person, figure, character, portrait, goat, goatAt, namedGoat, goatPortrait,
    leaves, mist, dust, steam, hills, PEOPLE, GOATS,
  };
})();

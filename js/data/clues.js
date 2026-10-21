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

// Clue catalogue. Text lives in clue.<id>.title / clue.<id>.text.
(function () {
  const A = CH.art, P = A.P;

  // The three contract fragments merge into one card once all are found.
  const CONTRACT_PARTS = ["contrat_1", "contrat_2", "contrat_3"];

  // Camera snapshots: timestamp as displayed by the camera, and a pictogram.
  const SNAPSHOTS = [
    { time: "22:31", pic: "carIn" },
    { time: "23:09", pic: "carOut" },
    { time: "23:32", pic: "spark" },
    { time: "23:49", pic: "leave" },
    { time: "00:21", pic: "glow" },
    { time: "00:52", pic: "glowGoat" },
    { time: "01:58", pic: "roof" },
    { time: "02:05", pic: "offline" },
    { time: "03:10", pic: "open" },
    { time: "07:31", pic: "arms" },
  ];

  function snapshot(pic) {
    A.srand(pic.length * 97);
    const sh = A.sh, soft = A.soft;
    let s = `<rect width="160" height="100" fill="#3b4744"/>`;
    s += `<rect y="70" width="160" height="30" fill="#2f3833"/>`;
    s += sh(A.rect(60, 34, 6, 40, 0.5), "#6d756f", { sw: 1 }) + sh(A.rect(100, 34, 6, 40, 0.5), "#6d756f", { sw: 1 }) + sh(A.rect(56, 44, 54, 4, 0.5), "#6d756f", { sw: 1 });
    const goat = `<ellipse cx="128" cy="62" rx="16" ry="8" fill="#e9e6dc"/>`;
    const car = (x) => sh(soft([[x, 74], [x, 62], [x + 10, 54], [x + 36, 54], [x + 44, 64], [x + 44, 74]], 1), "#d4762f", { sw: 1.5 }) + `<polygon points="${x + 44},64 ${x + 80},54 ${x + 80},76" fill="#fff4c0" opacity=".5"/>`;
    switch (pic) {
      case "carIn": s += car(8) + goat; break;
      case "carOut": s += car(14) + goat; break;
      case "spark": s += `<polygon points="40,40 46,50 38,52 48,64 42,52 50,50" fill="#fff38a"/>` + sh(soft([[24, 74], [24, 44], [32, 36], [40, 44], [40, 74]], 1), "#1d2321", { sw: 0 }) + goat; break;
      case "leave": s += sh(soft([[12, 74], [12, 44], [20, 36], [28, 44], [28, 74]], 1), "#1d2321", { sw: 0 }) + goat; break;
      case "glow": s += `<circle cx="40" cy="22" r="14" fill="#7fb6ff" opacity=".7"/>` + goat; break;
      case "glowGoat": s += `<circle cx="20" cy="22" r="10" fill="#7fb6ff" opacity=".6"/>` + goat; break;
      case "roof": s += `<circle cx="140" cy="10" r="9" fill="#ffffff" opacity=".85"/>` + goat; break;
      case "offline": s = `<rect width="160" height="100" fill="#111"/>`; break;
      case "open": s += `<rect x="54" y="34" width="56" height="40" fill="#2f3833"/>` + sh(A.poly([[60, 34], [30, 44], [30, 78], [60, 74]], 0.5), "none", { stroke: "#6d756f", sw: 3 }); break;
      case "arms": s += sh(soft([[120, 74], [120, 46], [128, 38], [136, 46], [136, 74]], 1), "#c9a03f", { sw: 0 }) + A.ink(A.line(118, 48, 108, 30, 0.5), 3, { stroke: "#c9a03f" }) + A.ink(A.line(138, 48, 148, 30, 0.5), 3, { stroke: "#c9a03f" }); break;
    }
    return s;
  }

  function photosVisual() {
    const offline = CH.t("clue.photos.offline");
    const cells = SNAPSHOTS.map((sn) => {
      const label = sn.pic === "offline" ? `<text x="80" y="56" font-size="14" fill="#c9c9c9" text-anchor="middle" font-family="monospace">${CH.i18n.escapeHtml(offline)}</text>` : "";
      return `<div class="snap"><svg viewBox="0 0 160 100">${snapshot(sn.pic)}${label}<text x="154" y="94" font-size="15" fill="#f4f1e8" text-anchor="end" font-family="monospace">${sn.time}</text></svg></div>`;
    });
    return `<div class="snaps">${cells.join("")}</div>`;
  }

  const LIST = [
    "crochet", "collier", "plaquette", "traces_gaston", "b_traces", "benjamin_nuit", "echarpe", "photos", "julien_toit",
    "cahier_gaston", "recette", "gerard_aveu", "belote", "mocassins", "appel",
    "contrat_1", "contrat_2", "contrat_3", "contrat", "liste", "lettre",
    "carnet_veto", "trousse", "certificat", "four", "calendrier",
    "mireille_nuit", "bottes", "violette", "plan", "tricot", "luzerne",
    "dispute", "pluie", "terre", "empreintes", "plaid", "eau", "page_veto",
  ];

  const VISUALS = { photos: photosVisual };

  CH.clues = {
    LIST,
    CONTRACT_PARTS,
    visual: (id) => (VISUALS[id] ? VISUALS[id]() : ""),
    hidden: (s, id) => CONTRACT_PARTS.includes(id) && !!s.clues.contrat,
  };
})();

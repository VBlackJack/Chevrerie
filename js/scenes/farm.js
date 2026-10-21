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

// Farm scenes: yard, pen, barn and cheese dairy.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g } = A;
  const { L, has, flag, item } = CH.S;

  function outdoorBase(seedVal, horizon = 520) {
    A.srand(seedVal);
    let s = `<rect x="0" y="0" width="1600" height="900" fill="url(#g-sky)"/>`;
    s += A.hills(horizon - 170, "#c3c6b2", 40, seedVal + 1);
    s += A.hills(horizon - 90, P.meadowFar, 50, seedVal + 2);
    s += A.hills(horizon, P.meadow, 30, seedVal + 3);
    return s;
  }

  // Trees on far hills as soft lollipops in autumn colours.
  function trees(list) {
    return list.map(([x, y, r, col]) => ink(line(x, y, x, y + r * 1.6, 1), 4, { stroke: P.woodDark }) + sh(blob(x, y, r, r * 1.1, 0.12, 10), col, { sw: 2.5 })).join("");
  }

  // ------------------------------------------------------------ Yard
  CH.scenes.register({
    id: "cour",
    nav: true,
    outdoor: true,
    unlock: (s) => s.act >= 1,
    draw(s) {
      let back = outdoorBase(3003, 560);
      back += trees([[880, 360, 34, P.leafGold], [960, 380, 26, P.rust], [1460, 350, 40, P.ochre]]);
      // Gravel ground
      back += sh(soft([[-20, 620], [1620, 600], [1620, 920], [-20, 920]], 4), "#b7a58a");
      for (let i = 0; i < 60; i++) back += `<circle cx="${Math.round(A.rnd() * 1600)}" cy="${Math.round(640 + A.rnd() * 260)}" r="${(1.5 + A.rnd() * 2).toFixed(1)}" fill="${P.inkSoft}" opacity=".35"/>`;
      back += sh(blob(800, 812, 130, 26, 0.1, 12), "#7a6656", { sw: 2.5 }) + sh(blob(790, 806, 70, 8, 0.2, 8), "#a9b0b0", { sw: 0, op: 0.6 });
      // Farmhouse
      back += sh(A.poly([[-30, 700], [-30, 240], [540, 240], [540, 700]], 3), P.stoneLight);
      for (let i = 0; i < 26; i++) back += sh(blob(A.rnd() * 540, 270 + A.rnd() * 410, 26, 14, 0.2, 7), P.stone, { sw: 1.5, op: 0.5 });
      back += sh(A.poly([[-60, 260], [250, 110], [580, 250]], 3), P.rust);
      for (let i = 0; i < 7; i++) back += ink(line(-20 + i * 40, 250 - i * 18, 560 - i * 30, 250 - i * 2, 1), 1.4, { op: 0.35 });
      back += sh(rect(240, 470, 120, 230, 2), P.woodDark);
      back += sh(rect(60, 330, 100, 110, 2), "#f2d79a") + sh(rect(20, 324, 40, 122, 2), P.sage) + sh(rect(160, 324, 40, 122, 2), P.sage);
      back += sh(rect(400, 330, 100, 110, 2), "#e8dcc0") + sh(rect(360, 324, 40, 122, 2), P.sage) + sh(rect(500, 324, 40, 122, 2), P.sage);
      // Geranium pots (half eaten)
      [[390, 690], [450, 700], [510, 694]].forEach(([x, y], i) => {
        back += sh(soft([[x - 26, y - 40], [x + 26, y - 40], [x + 20, y], [x - 20, y]], 1.5), P.clay);
        if (i !== 1) back += sh(blob(x, y - 52, 24, 16, 0.2, 9), P.moss, { sw: 2 }) + `<circle cx="${x - 6}" cy="${y - 60}" r="6" fill="${P.red}"/><circle cx="${x + 8}" cy="${y - 56}" r="5" fill="${P.red}"/>`;
      });
      // Well
      back += sh(soft([[600, 720], [600, 620], [760, 620], [760, 720]], 2), P.stone) + sh(blob(680, 620, 82, 18, 0.05, 10), P.stoneLight);
      back += sh(rect(608, 470, 14, 150, 1.5), P.wood) + sh(rect(740, 470, 14, 150, 1.5), P.wood) + sh(A.poly([[586, 480], [680, 420], [776, 480]], 2), P.woodDark);
      // Rain gauge
      back += sh(rect(918, 640, 8, 80, 1), P.wood) + sh(rect(908, 610, 28, 40, 1), "#cfe0e6", { sw: 2 }) + sh(rect(910, 636, 24, 12, 0.5), "#7aa7bb", { sw: 0 });
      // Tractor Agnetha
      back += sh(soft([[1010, 720], [1010, 600], [1100, 580], [1110, 520], [1200, 520], [1210, 600], [1300, 620], [1300, 720]], 3), "#a8443a");
      back += sh(rect(1120, 470, 70, 60, 2), "none", { sw: 4 }) + sh(rect(1124, 474, 62, 52, 1), "#cfd9d6", { sw: 0, op: 0.5 });
      back += A.text(1060, 668, CH.t("art.cour.tractor"), { size: 30, fill: P.cream, font: "Caveat, cursive", rot: -3, weight: 700 });
      back += sh(blob(1230, 730, 72, 72, 0.04, 14), "#2f2a27") + sh(blob(1230, 730, 30, 30, 0.05, 10), P.mustard);
      back += sh(blob(1040, 750, 42, 42, 0.04, 12), "#2f2a27") + sh(blob(1040, 750, 16, 16, 0.05, 8), P.mustard);
      back += ink(line(1050, 600, 1050, 540, 1), 8, { stroke: "#5a514b" });
      // Signpost
      back += sh(rect(1470, 470, 16, 260, 1.5), P.wood);
      [["art.cour.sign_enclos", 480, -4], ["art.cour.sign_grange", 530, 3], ["art.cour.sign_fromagerie", 580, -2]].forEach(([k, y, r]) => {
        back += g(sh(A.poly([[1400, y], [1570, y], [1594, y + 20], [1570, y + 40], [1400, y + 40]], 1.5), P.woodLight) + A.text(1490, y + 29, CH.t(k), { size: 22 }), `transform="rotate(${r} 1490 ${y + 20})"`);
      });
      // Vet's car from act II
      if (s.act >= 2) {
        back += sh(soft([[1300, 820], [1300, 740], [1340, 690], [1480, 686], [1530, 740], [1560, 760], [1560, 820]], 3), "#d4762f");
        back += sh(A.poly([[1352, 740], [1374, 702], [1420, 700], [1420, 740]], 1.5), "#cfd9d6") + sh(A.poly([[1430, 740], [1430, 700], [1474, 700], [1500, 740]], 1.5), "#cfd9d6");
        back += sh(blob(1360, 826, 30, 30, 0.04, 10), "#2f2a27") + sh(blob(1500, 826, 30, 30, 0.04, 10), "#2f2a27");
        back += sh(rect(1300, 780, 260, 12, 1), P.mud, { sw: 0, op: 0.6 });
      }
      // Gaston at the geraniums
      let anim = A.namedGoat("gaston", 560, 800, 0.95, true, {}, 'class="chew-wrap"');
      anim += A.leaves(10, 0, 1600, -40);
      anim += A.mist(380, 180, 0.7);
      return { back, front: "", anim };
    },
    hotspots: [
      { id: "tracteur", x: 1000, y: 460, w: 310, h: 330, look: [L("hs.cour.tracteur.look"), { egg: "agnetha" }], pro: { steps: [L("hs.cour.tracteur.pro")] } },
      { id: "gaston", x: 380, y: 600, w: 220, h: 210, look: [L("hs.cour.gaston.look")] },
      { id: "puits", x: 586, y: 420, w: 190, h: 300, look: [L("hs.cour.puits.look"), { egg: "puits" }] },
      { id: "pluviometre", x: 900, y: 600, w: 46, h: 120, look: [L("hs.cour.pluviometre.look")] },
      { id: "flaque", x: 670, y: 780, w: 260, h: 70, look: [L("hs.cour.flaque.look"), { egg: "boue" }] },
      { id: "voiture", x: 1300, y: 680, w: 270, h: 160, when: (s) => s.act >= 2, look: [L("hs.cour.voiture.look")], pro: { steps: [L("hs.cour.voiture.pro"), { clue: "trousse" }] } },
    ],
  });

  // ------------------------------------------------------------ Pen
  CH.scenes.register({
    id: "enclos",
    nav: true,
    outdoor: true,
    unlock: (s) => s.act >= 1,
    draw(s) {
      let back = outdoorBase(4004, 520);
      // Old barn far on the hill
      back += `<g opacity=".55">${sh(A.poly([[1340, 400], [1340, 300], [1450, 240], [1560, 300], [1560, 400]], 2), P.stone)}${sh(A.poly([[1320, 306], [1450, 230], [1580, 306]], 2), P.rust)}</g>`;
      // Shelter (bergerie)
      back += sh(A.poly([[-20, 560], [-20, 250], [540, 250], [540, 560]], 3), P.wood);
      for (let x = 10; x < 540; x += 46) back += ink(line(x, 256, x, 556, 1), 1.6, { op: 0.4 });
      back += sh(A.poly([[-40, 262], [260, 190], [570, 262]], 3), "#7c6a58");
      back += sh(rect(210, 280, 130, 50, 2), P.cream) + A.text(275, 304, CH.t("art.enclos.plaque_name"), { size: 22, weight: 700 }) + A.text(275, 324, CH.t("art.enclos.plaque_title"), { size: 15 });
      // Ground
      back += sh(soft([[-20, 600], [1620, 590], [1620, 920], [-20, 920]], 4), "#7d6a55");
      back += sh(soft([[-20, 680], [1620, 660], [1620, 920], [-20, 920]], 4), P.mud);
      for (let i = 0; i < 36; i++) {
        const x = 560 + A.rnd() * 420, y = 700 + A.rnd() * 130;
        back += sh(blob(x, y, 9, 6, 0.2, 6), P.mudDark, { sw: 0, op: 0.7 });
      }
      for (let i = 0; i < 6; i++) back += sh(blob(640 + i * 52, 760 + (i % 2) * 18, 14, 9, 0.2, 7), "#3a2c24", { sw: 0, op: 0.85 });
      // Troughs
      back += sh(A.poly([[110, 600], [320, 600], [306, 548], [124, 548]], 2), P.woodLight);
      back += sh(A.poly([[1170, 612], [1350, 612], [1336, 560], [1184, 560]], 2), P.woodLight);
      if (s.act >= 2 && !has(s, "contrat_1")) back += sh(blob(1250, 560, 22, 10, 0.2, 8), P.white, { sw: 2 });
      // Gerbera's stash
      if (flag(s, "stash")) {
        back += sh(blob(165, 586, 40, 14, 0.1, 9), P.straw, { sw: 2 });
        if (!has(s, "collier")) back += ink(curve([[140, 582], [160, 572], [186, 580]], 0.5), 6, { stroke: P.rust }) + sh(blob(164, 588, 10, 12, 0.1, 8), "#c9a24b", { sw: 2 });
        back += sh(rect(196, 576, 14, 8, 0.6), "#d7d0c2", { sw: 1.2 });
      }
      // Fence, gate open, electric wire
      const rail = (y) => sh(rect(-10, y, 640, 14, 2), P.woodLight, { sw: 2.5 }) + sh(rect(860, y, 760, 14, 2), P.woodLight, { sw: 2.5 });
      back += rail(470) + rail(540);
      for (let x = 20; x < 1600; x += 150) if (x < 620 || x > 860) back += sh(rect(x, 420, 18, 210, 1.5), P.wood);
      back += sh(rect(606, 400, 22, 240, 1.5), P.wood) + sh(rect(856, 400, 22, 240, 1.5), P.wood);
      back += sh(A.poly([[624, 430], [520, 470], [520, 650], [624, 630]], 2), "none", { stroke: P.woodLight, sw: 10 }) + sh(A.poly([[624, 430], [520, 470], [520, 650], [624, 630]], 2), "none", { sw: 2 });
      back += ink(line(624, 530, 520, 560, 1), 8, { stroke: P.woodLight });
      back += ink(curve([[868, 412], [880, 400], [890, 410]], 0.3), 3, { stroke: "#5a5a5a" });
      back += ink(curve([[0, 404], [300, 410], [604, 404]], 1), 1.6, { stroke: "#4a4a4a" });
      for (let x = 160; x < 620; x += 150) back += `<circle cx="${x + 9}" cy="408" r="4" fill="#e8c26a" stroke="${P.ink}" stroke-width="1.2"/>`;
      if (!flag(s, "scarfTaken")) back += sh(soft([[296, 406], [350, 404], [356, 420], [344, 500], [328, 498], [324, 424], [300, 420]], 1.5), "#5f7a4a");
      // Camera on its post
      back += sh(rect(984, 350, 12, 280, 1), P.woodDark) + sh(soft([[960, 330], [1020, 328], [1022, 356], [962, 360]], 1.5), "#ecebe6") + sh(blob(1022, 344, 7, 7, 0.1, 6), P.ink);
      // Goats
      back += A.namedGoat("gerbera", 320, 600, 0.8, true);
      back += A.namedGoat("herd", 1470, 600, 0.6, true);
      back += A.namedGoat("herd", 760, 520, 0.42, false, { seed: 82, coat: "#cfc3ae" });
      let anim = A.namedGoat("tournesol", 1250, 640, 0.85, true, {}, 'class="chew-wrap"');
      anim += `<circle class="blink" cx="1012" cy="342" r="4" fill="#d9443a"/>`;
      anim += A.leaves(8, 0, 1600, -40);
      anim += A.mist(300, 200, 0.75);
      return { back, front: "", anim };
    },
    hotspots: [
      { id: "porte", x: 600, y: 390, w: 290, h: 260, look: [L("hs.enclos.porte.look"), { clue: "crochet" }] },
      { id: "sol", x: 560, y: 680, w: 440, h: 160, look: [L("hs.enclos.sol.look")], pro: { steps: [L("hs.enclos.sol.pro"), { clue: "traces_gaston" }] } },
      {
        id: "cloture", x: 270, y: 380, w: 120, h: 140,
        look: (s) => (has(s, "echarpe") ? [L("hs.enclos.cloture.touch"), { egg: "statique" }] : [L("hs.enclos.cloture.look"), { clue: "echarpe" }, { flag: "scarfTaken" }]),
      },
      { id: "camera", x: 950, y: 300, w: 90, h: 80, look: [L("hs.enclos.camera.look")], pro: { steps: [L("hs.enclos.camera.pro")] } },
      {
        id: "gerbera", x: 180, y: 430, w: 170, h: 120,
        look: (s) => {
          if (flag(s, "stash")) return [L("hs.enclos.gerbera.after")];
          if (item(s, "cuillere")) return [L("hs.enclos.gerbera.distract"), { use: "cuillere" }, { flag: "stash" }];
          return [L("hs.enclos.gerbera.look")];
        },
      },
      {
        id: "tresor", x: 110, y: 556, w: 120, h: 50,
        when: (s) => flag(s, "stash"),
        look: [L("hs.enclos.tresor.look"), { clue: "collier" }],
        pro: { steps: [L("hs.enclos.tresor.pro"), { clue: "plaquette" }] },
      },
      {
        id: "tournesol", x: 1140, y: 470, w: 200, h: 90,
        look: (s) => {
          if (has(s, "page_veto")) return [L("hs.enclos.tournesol.done")];
          if (item(s, "carotte")) return [L("hs.enclos.tournesol.trade"), { use: "carotte" }, { clue: "page_veto" }];
          if (s.act >= 3) return [L("hs.enclos.tournesol.look"), L("hs.enclos.tournesol.idea")];
          return [L("hs.enclos.tournesol.look")];
        },
      },
      { id: "mangeoire", x: 1170, y: 560, w: 180, h: 60, when: (s) => s.act >= 2, look: (s) => (has(s, "contrat_1") ? [L("hs.enclos.mangeoire.empty")] : [L("hs.enclos.mangeoire.look"), { clue: "contrat_1" }]) },
      { id: "plaque", x: 200, y: 270, w: 150, h: 70, look: [L("hs.enclos.plaque.look")] },
      { id: "troupeau", x: 1380, y: 470, w: 200, h: 130, look: [L("hs.enclos.troupeau.look")] },
    ],
  });

  // ------------------------------------------------------------ Barn
  CH.scenes.register({
    id: "grange",
    nav: true,
    outdoor: false,
    unlock: (s) => s.act >= 2,
    draw(s) {
      A.srand(5005);
      let back = `<rect x="0" y="0" width="1600" height="900" fill="#5e4636"/>`;
      for (let x = 0; x < 1600; x += 64) back += sh(rect(x, -10, 64, 820, 2), x % 128 ? "#6a5040" : "#634a3b", { sw: 2 });
      // Doorway to the misty outside
      back += sh(rect(1250, 110, 300, 700, 2), "#e8e6dc") + sh(soft([[1250, 600], [1550, 560], [1550, 810], [1250, 810]], 3), P.meadowFar, { sw: 2 });
      back += sh(rect(1230, 90, 340, 30, 2), P.woodDark);
      // Floor and litter
      back += sh(soft([[-20, 760], [1620, 740], [1620, 920], [-20, 920]], 4), "#a88a52");
      for (let i = 0; i < 80; i++) {
        const x = A.rnd() * 1600, y = 760 + A.rnd() * 140;
        back += ink(line(x, y, x + 20 - A.rnd() * 40, y + 6 - A.rnd() * 12, 0.5), 2, { stroke: P.straw, op: 0.8 });
      }
      if (!has(s, "contrat_2")) back += sh(blob(830, 806, 22, 11, 0.2, 8), P.white, { sw: 2 });
      // Hay stacks
      back += sh(soft([[-20, 780], [-20, 420], [140, 380], [330, 400], [420, 470], [420, 780]], 4), P.hay);
      for (let i = 0; i < 40; i++) {
        const x = A.rnd() * 400, y = 420 + A.rnd() * 340;
        back += ink(line(x, y, x + 24, y + 4 - A.rnd() * 8, 0.5), 1.8, { stroke: "#9c7f3c", op: 0.7 });
      }
      // Alfalfa bale, half missing, cut string
      back += sh(A.poly([[440, 770], [440, 620], [560, 600], [680, 620], [680, 770]], 3), "#9fa45a");
      back += sh(A.poly([[560, 620], [680, 620], [680, 680], [560, 690]], 2), "#7f8547", { op: 0.8 });
      back += ink(curve([[600, 780], [640, 800], [700, 790]], 1), 2.5, { stroke: "#d8cfa8" });
      // Nails and one remaining bucket
      back += `<circle cx="600" cy="420" r="4" fill="#aaa"/>`;
      back += ink(line(690, 420, 690, 430, 0.5), 3, { stroke: "#aaa" }) + sh(A.poly([[660, 440], [720, 440], [712, 500], [668, 500]], 1.5), "#9aa3a8");
      // Blackboard with the recipe
      back += sh(rect(720, 180, 280, 200, 2), P.woodLight) + sh(rect(734, 194, 252, 172, 2), "#2f3a35");
      back += A.text(860, 228, CH.t("art.grange.board_title"), { size: 26, fill: "#eceae0" });
      back += A.text(860, 254, CH.t("art.grange.board_secret"), { size: 20, fill: "#e6b0a0" });
      for (let i = 0; i < 4; i++) back += ink(line(760, 280 + i * 22, 960 - (i % 2) * 40, 280 + i * 22, 1), 2, { stroke: "#cfcfc6", op: 0.8 });
      // Shelf with the breeding log
      back += sh(rect(1030, 330, 180, 14, 1.5), P.woodLight) + sh(rect(1060, 290, 70, 42, 1.5), P.rust) + sh(rect(1140, 300, 40, 32, 1.5), P.olive);
      // Personality cards pinned on a beam
      back += sh(rect(1020, 380, 200, 20, 1.5), P.woodDark);
      for (let i = 0; i < 5; i++) back += sh(rect(1030 + i * 38, 402 + (i % 2) * 8, 32, 44, 1), P.cream, { sw: 1.8 }) + `<circle cx="${1046 + i * 38}" cy="${406 + (i % 2) * 8}" r="3" fill="${P.red}"/>`;
      // Ladder to the roof hatch
      back += ink(line(340, 820, 400, 120, 1), 8, { stroke: P.woodLight }) + ink(line(410, 820, 470, 120, 1), 8, { stroke: P.woodLight });
      for (let i = 1; i < 12; i++) {
        const t = i / 12;
        back += ink(line(340 + 60 * t, 820 - 700 * t, 410 + 60 * t, 820 - 700 * t, 0.5), 6, { stroke: P.woodLight });
      }
      back += sh(rect(380, 70, 120, 50, 2), "#3b2d24");
      // Yoga poster
      back += sh(A.poly([[1100, 520], [1220, 516], [1222, 640], [1150, 646], [1130, 630], [1102, 640]], 1.5), "#e8d0b0");
      back += A.text(1160, 552, CH.t("art.grange.poster"), { size: 20 });
      back += A.goatAt(Object.assign({}, A.GOATS.herd, { coat: P.cream }), 1150, 624, 0.28, false);
      let anim = "";
      anim += `<polygon points="1250,140 1550,140 900,900 420,900" fill="url(#g-beam)" opacity=".5"/>`;
      anim += A.dust(40, 600, 1300, 200, 860);
      return { back, front: "", anim };
    },
    hotspots: [
      { id: "tableau", x: 720, y: 180, w: 280, h: 200, look: [L("hs.grange.tableau.look")], pro: { steps: [L("hs.grange.tableau.pro"), { clue: "recette" }] } },
      { id: "cahier", x: 1030, y: 280, w: 180, h: 66, look: [L("hs.grange.cahier.look"), { clue: "cahier_gaston" }] },
      { id: "fiches", x: 1020, y: 380, w: 200, h: 80, look: [L("hs.grange.fiches.look"), { egg: "fiches" }] },
      { id: "luzerne", x: 430, y: 580, w: 270, h: 220, look: [L("hs.grange.luzerne.look"), { clue: "luzerne" }] },
      { id: "litiere", x: 780, y: 780, w: 110, h: 60, look: (s) => (has(s, "contrat_2") ? [L("hs.grange.litiere.empty")] : [L("hs.grange.litiere.look"), { clue: "contrat_2" }]) },
      { id: "echelle", x: 330, y: 70, w: 160, h: 400, look: [L("hs.grange.echelle.look"), { egg: "ipv6" }], pro: { steps: [L("hs.grange.echelle.pro")] } },
      { id: "affiche", x: 1096, y: 510, w: 130, h: 140, look: [L("hs.grange.affiche.look"), { egg: "yoga" }] },
    ],
  });

  // ------------------------------------------------------------ Cheese dairy
  CH.scenes.register({
    id: "fromagerie",
    nav: true,
    outdoor: false,
    unlock: (s) => s.act >= 2,
    draw(s) {
      A.srand(6006);
      let back = `<rect x="0" y="0" width="1600" height="440" fill="#eeeadf"/>`;
      back += `<rect x="0" y="420" width="1600" height="230" fill="url(#p-tiles)"/>`;
      back += sh(rect(-10, 640, 1620, 270, 3), "#9b9286");
      // Window onto the pen
      back += CH.scenes.util.windowView("fr-win", 640, 150, 260, 230, sh(rect(630, 300, 300, 10, 1), P.woodLight, { sw: 2 }) + sh(rect(720, 270, 10, 70, 1), P.wood, { sw: 2 }) + sh(rect(800, 270, 10, 70, 1), P.wood, { sw: 2 }));
      back += CH.scenes.util.windowFrame(640, 150, 260, 230);
      // Cheese shelves
      for (let r = 0; r < 3; r++) {
        back += sh(rect(50, 250 + r * 140, 480, 16, 1.5), P.woodLight);
        for (let c = 0; c < 7; c++) back += sh(blob(86 + c * 66, 228 + r * 140, 30, 22, 0.05, 10), r === 1 && c === 5 ? "#e7c77a" : "#ecd9a6", { sw: 2.2 });
      }
      back += sh(rect(390, 334, 70, 20, 1), P.white, { sw: 1.5 }) + ink(line(400, 344, 450, 344, 0.5), 1.5);
      // Steel table, moulds, cat on the scale
      back += sh(rect(580, 560, 480, 26, 2), "#c4c8c8") + sh(rect(600, 586, 18, 160, 1), "#9aa0a0") + sh(rect(1020, 586, 18, 160, 1), "#9aa0a0");
      for (let i = 0; i < 4; i++) back += sh(A.poly([[620 + i * 70, 560], [670 + i * 70, 560], [664 + i * 70, 520], [626 + i * 70, 520]], 1), "#f3f0e8", { sw: 2 });
      back += sh(rect(960, 540, 90, 22, 1.5), "#d8dcdc");
      back += sh(blob(1004, 520, 40, 22, 0.08, 10), "#e2a35a") + sh(blob(1036, 506, 16, 14, 0.08, 8), "#e2a35a") + ink(curve([[970, 530], [952, 540], [960, 556]], 0.5), 4, { stroke: "#e2a35a" });
      // Vat
      back += sh(soft([[1090, 660], [1090, 480], [1260, 480], [1260, 660]], 2), "#c4c8c8") + sh(blob(1175, 480, 86, 14, 0.04, 10), "#f6f3ea");
      // Radio, cork board, drawer cabinet
      back += sh(rect(1290, 330, 170, 14, 1), P.woodLight);
      back += sh(rect(1306, 256, 140, 76, 3), "#8a5a3a") + sh(blob(1346, 294, 26, 26, 0.04, 10), "#d8c8a0") + sh(rect(1384, 270, 50, 30, 1.5), "#e9dcb0", { sw: 2 }) + `<circle cx="1420" cy="316" r="6" fill="${P.ink}"/>`;
      back += sh(rect(1300, 380, 220, 160, 2), "#c49a68") + sh(A.poly([[1340, 398], [1470, 392], [1476, 520], [1344, 526]], 1.5), P.cream, { sw: 2 }) + `<circle cx="1408" cy="396" r="5" fill="${P.red}"/>`;
      for (let i = 0; i < 5; i++) back += ink(line(1356, 424 + i * 20, 1460 - (i % 3) * 18, 422 + i * 20, 0.6), 1.8, { op: 0.75 });
      back += sh(rect(1300, 560, 220, 150, 2), P.wood) + sh(rect(1316, 576, 188, 50, 2), P.woodLight, { sw: 2 }) + `<circle cx="1410" cy="600" r="6" fill="${P.ochre}"/>`;
      let anim = A.steam(1140, 470, 4);
      anim += `<g class="waves">${ink(curve([[1460, 270], [1476, 290], [1460, 310]], 0.3), 3, { stroke: P.rust })}${ink(curve([[1478, 258], [1500, 290], [1478, 322]], 0.3), 3, { stroke: P.rust })}</g>`;
      anim += `<text class="note" x="1500" y="250" font-size="30" fill="${P.rust}">&#9835;</text>`;
      anim += `<polygon points="640,380 900,380 1000,900 520,900" fill="url(#g-beam)" opacity=".35"/>`;
      return { back, front: "", anim };
    },
    hotspots: [
      {
        id: "radio", x: 1300, y: 240, w: 160, h: 100,
        look: (s) => (flag(s, "radioSeen") ? [L("hs.fromagerie.radio.again"), { egg: "radioRetour" }] : [L("hs.fromagerie.radio.look"), { flag: "radioSeen" }, { egg: "radio" }]),
      },
      { id: "liste", x: 1300, y: 380, w: 220, h: 160, look: [L("hs.fromagerie.liste.look"), { clue: "liste" }] },
      { id: "tommes", x: 50, y: 190, w: 480, h: 360, look: [L("hs.fromagerie.tommes.look")] },
      { id: "tiroir", x: 1300, y: 560, w: 220, h: 150, look: (s) => (flag(s, "capucineConfessed") ? [L("hs.fromagerie.tiroir.look"), { clue: "lettre" }] : [L("hs.fromagerie.tiroir.closed")]) },
      { id: "chat", x: 950, y: 480, w: 110, h: 90, look: [L("hs.fromagerie.chat.look"), { egg: "chat" }] },
      { id: "fenetre", x: 640, y: 150, w: 260, h: 230, look: [L("hs.fromagerie.fenetre.look")] },
    ],
  });

  CH.scenes.util.outdoorBase = outdoorBase;
  CH.scenes.util.trees = trees;
})();

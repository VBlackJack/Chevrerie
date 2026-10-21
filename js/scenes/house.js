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

// Interior scenes of the farmhouse: bedroom and kitchen.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g } = A;
  const { L, has, flag, item } = CH.S;

  // Misty countryside seen through a window, clipped to the frame.
  function windowView(id, x, y, w, h, extra = "") {
    A.srand(300 + x);
    let s = `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`;
    let v = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#g-sky)"/>`;
    v += sh(soft([[x - 20, y + h * 0.55], [x + w * 0.3, y + h * 0.45], [x + w * 0.7, y + h * 0.5], [x + w + 20, y + h * 0.42], [x + w + 20, y + h + 20], [x - 20, y + h + 20]], 4), P.meadowFar, { sw: 2 });
    v += sh(soft([[x - 20, y + h * 0.72], [x + w * 0.4, y + h * 0.64], [x + w + 20, y + h * 0.7], [x + w + 20, y + h + 20], [x - 20, y + h + 20]], 4), P.meadow, { sw: 2 });
    v += extra;
    v += `<rect class="mist" x="${x - 60}" y="${y + h * 0.35}" width="${w + 120}" height="${h * 0.4}" fill="url(#g-mist)" filter="url(#f-blur-s)"/>`;
    s += `<g clip-path="url(#${id})">${v}</g>`;
    return s;
  }

  function windowFrame(x, y, w, h) {
    const b = 14;
    let s = sh(rect(x - b, y - b, w + 2 * b, b, 1.5), P.woodLight) + sh(rect(x - b, y + h, w + 2 * b, b, 1.5), P.woodLight);
    s += sh(rect(x - b, y - b, b, h + 2 * b, 1.5), P.woodLight) + sh(rect(x + w, y - b, b, h + 2 * b, 1.5), P.woodLight);
    s += sh(rect(x, y, w, h, 1.5), "none", { sw: 3 });
    s += ink(line(x + w / 2, y, x + w / 2, y + h, 1), 7, { stroke: P.woodLight }) + ink(line(x + w / 2, y, x + w / 2, y + h, 1), 2);
    s += ink(line(x, y + h / 2, x + w, y + h / 2, 1), 7, { stroke: P.woodLight }) + ink(line(x, y + h / 2, x + w, y + h / 2, 1), 2);
    s += sh(rect(x - 30, y + h + 10, w + 60, 20, 2), P.woodLight);
    return s;
  }

  // ------------------------------------------------------------ Bedroom
  CH.scenes.register({
    id: "chambre",
    nav: true,
    outdoor: false,
    unlock: (s) => s.act === 0,
    draw(s) {
      A.srand(1001);
      let back = "";
      back += `<rect x="0" y="0" width="1600" height="650" fill="#e9dcc0"/>`;
      back += `<rect x="0" y="0" width="1600" height="650" fill="url(#p-flowers)"/>`;
      back += `<rect x="0" y="640" width="1600" height="260" fill="url(#p-planks)"/>`;
      back += sh(rect(-10, 630, 1620, 22, 2), P.woodDark);
      // Window and outside
      back += windowView("cl-win", 1060, 140, 320, 340, sh(A.poly([[1240, 420], [1250, 370], [1300, 350], [1350, 370], [1360, 420]], 2), P.stone, { sw: 2 }));
      back += windowFrame(1060, 140, 320, 340);
      // Engraving
      back += sh(rect(220, 120, 180, 140, 2), P.woodDark) + sh(rect(234, 134, 152, 112, 1.5), P.cream);
      back += A.goatAt(Object.assign({}, A.GOATS.herd, { coat: P.cream }), 270, 236, 0.42, false);
      // Bed
      back += sh(soft([[60, 560], [60, 330], [120, 300], [470, 300], [520, 330], [520, 560]], 2), P.wood);
      back += ink(line(100, 340, 480, 340, 1), 2, { op: 0.5 });
      back += sh(soft([[40, 470], [600, 470], [612, 690], [30, 700]], 3), "#efe3cb");
      const quilt = [P.ochre, P.rust, P.sage, P.cream, P.plum, P.mustard];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 6; c++) {
          back += sh(rect(70 + c * 88, 520 + r * 56, 86, 54, 2), quilt[(r * 2 + c) % quilt.length], { sw: 2, op: 0.85 });
        }
      }
      back += sh(blob(170, 470, 90, 34, 0.08, 10), P.white);
      // Bedside table and lamp
      back += sh(rect(610, 530, 150, 170, 2), P.woodLight) + sh(rect(626, 590, 118, 40, 1.5), P.wood);
      back += `<circle cx="685" cy="610" r="5" fill="${P.ink}"/>`;
      back += sh(rect(670, 440, 14, 80, 1), P.ochre) + sh(soft([[630, 450], [720, 450], [700, 390], [650, 390]], 2), "#e8c98a");
      // Glasses on the table (only while not worn)
      if (!flag(s, "glasses")) {
        back += ink(A.poly([[636, 522], [656, 522], [656, 512], [636, 512]], 1), 4, { stroke: "#22403c" });
        back += ink(A.poly([[662, 522], [682, 522], [682, 512], [662, 512]], 1), 4, { stroke: "#22403c" });
        back += ink(line(656, 516, 662, 516, 0.3), 3, { stroke: "#22403c" });
      }
      if (!flag(s, "clothStolen")) {
        back += sh(soft([[702, 528], [746, 524], [748, 534], [704, 536]], 1), "#8fb1c8");
      }
      // Door
      back += sh(rect(800, 230, 160, 410, 2), P.wood);
      back += sh(rect(822, 260, 116, 150, 2), P.woodLight, { sw: 2 }) + sh(rect(822, 440, 116, 170, 2), P.woodLight, { sw: 2 });
      back += `<circle cx="940" cy="450" r="9" fill="${P.ochre}" stroke="${P.ink}" stroke-width="2"/>`;
      // Suitcase and sandals
      back += sh(rect(880, 700, 180, 100, 3), P.teal) + sh(rect(940, 682, 60, 22, 2), "none", { sw: 4 }) + ink(line(880, 750, 1060, 750, 1), 2, { op: 0.6 });
      back += sh(blob(290, 812, 30, 12, 0.06, 9), P.ink) + sh(blob(360, 820, 30, 12, 0.06, 9), P.ink);
      back += ink(line(272, 806, 308, 806, 0.5), 5, { stroke: "#1c1a19" }) + ink(line(342, 814, 378, 814, 0.5), 5, { stroke: "#1c1a19" });
      // Armchair with the fleece throw
      back += sh(soft([[1180, 760], [1170, 560], [1210, 520], [1400, 520], [1430, 560], [1420, 760]], 3), P.rust);
      back += sh(soft([[1200, 640], [1400, 640], [1410, 720], [1190, 720]], 2), "#b8684a");
      back += g(sh(soft([[1230, 540], [1360, 530], [1380, 620], [1340, 700], [1250, 710], [1220, 620]], 3), "#8a6a50") + `<path d="${soft([[1230, 540], [1360, 530], [1380, 620], [1340, 700], [1250, 710], [1220, 620]], 0)}" fill="url(#p-fleece)"/>`, 'filter="url(#f-fuzz)"');
      // Light beam
      back += `<polygon points="1060,480 1380,480 1200,900 700,900" fill="url(#g-beam)" opacity=".55"/>`;
      let anim = "";
      anim += `<circle cx="675" cy="430" r="90" fill="url(#g-warm)" class="flicker"/>`;
      anim += A.dust(26, 760, 1300, 480, 880);
      anim += `<g class="sway" style="transform-origin:1040px 120px">${sh(soft([[1030, 120], [1080, 120], [1070, 300], [1090, 520], [1030, 520]], 3), "#c98f6a")}</g>`;
      anim += `<g class="sway sway-2" style="transform-origin:1410px 120px">${sh(soft([[1360, 120], [1410, 120], [1410, 520], [1350, 520], [1372, 300]], 3), "#c98f6a")}</g>`;
      return { back, front: "", anim };
    },
    hotspots: [
      {
        id: "lunettes", x: 626, y: 500, w: 66, h: 34,
        when: (s) => !flag(s, "glasses"),
        look: [L("hs.chambre.lunettes.look"), { flag: "glasses" }],
      },
      { id: "chiffon", x: 698, y: 508, w: 56, h: 36, when: (s) => !flag(s, "clothStolen"), look: [L("hs.chambre.chiffon.look")] },
      { id: "fenetre", x: 1060, y: 140, w: 320, h: 340, look: [L("hs.chambre.fenetre.look")], pro: { steps: [L("hs.chambre.fenetre.pro")] } },
      { id: "fauteuil", x: 1180, y: 520, w: 250, h: 240, look: [L("hs.chambre.fauteuil.look"), { egg: "plaidChambre" }] },
      { id: "sandales", x: 250, y: 790, w: 160, h: 50, look: [L("hs.chambre.sandales.look"), { egg: "sandales" }] },
      { id: "valise", x: 880, y: 680, w: 180, h: 120, look: [L("hs.chambre.valise.look")] },
      { id: "gravure", x: 220, y: 120, w: 180, h: 140, look: [L("hs.chambre.gravure.look")], pro: { steps: [L("hs.chambre.gravure.pro")] } },
      {
        id: "porte", x: 800, y: 230, w: 160, h: 410,
        look: (s) => (flag(s, "glasses") ? [{ cut: "clothTheft" }] : [L("hs.chambre.porte.blind")]),
      },
    ],
  });

  // ------------------------------------------------------------ Kitchen
  function clockHand(cx, cy, angleDeg, len, w) {
    const a = (angleDeg * Math.PI) / 180;
    return ink(line(cx, cy, cx + Math.sin(a) * len, cy - Math.cos(a) * len, 0.3), w);
  }

  CH.scenes.register({
    id: "cuisine",
    nav: true,
    outdoor: false,
    unlock: (s) => s.act >= 1,
    draw(s) {
      A.srand(2002);
      let back = "";
      back += `<rect x="0" y="0" width="1600" height="630" fill="${P.plaster}"/>`;
      back += sh(rect(-10, 0, 1620, 40, 2), P.woodDark);
      for (let x = 120; x < 1600; x += 420) back += sh(rect(x, 0, 40, 630, 2), P.woodDark, { op: 0.9 });
      // Terracotta floor
      back += `<rect x="0" y="630" width="1600" height="270" fill="#b9714f"/>`;
      for (let r = 0; r < 4; r++) for (let c = 0; c < 17; c++) back += sh(rect(c * 100 - (r % 2) * 50, 630 + r * 70, 100, 70, 2), r % 2 ? "#c07a56" : "#b36c4a", { sw: 1.6, op: 0.95 });
      // Window with amber on the sill
      back += windowView("cu-win", 360, 140, 240, 260);
      back += windowFrame(360, 140, 240, 260);
      back += sh(blob(470, 404, 14, 9, 0.12, 8), "#e0952f", { sw: 2 }) + sh(blob(466, 401, 5, 3, 0.2, 6), "#ffd27a", { sw: 0 });
      // Calendar
      back += sh(rect(190, 170, 120, 150, 2), P.cream) + sh(rect(190, 170, 120, 40, 2), P.rust);
      back += A.text(250, 198, CH.t("art.cuisine.calendar"), { size: 18, fill: P.cream });
      for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) back += sh(rect(202 + c * 21, 222 + r * 22, 16, 16, 0.6), "none", { sw: 1.2, op: 0.6 });
      back += sh(blob(286, 288, 11, 9, 0.1, 8), "none", { stroke: P.red, sw: 2.5 });
      // Wall clock (6:52) and stove with oven clock (7:52)
      back += sh(blob(96, 250, 46, 46, 0.03, 12), P.cream) + clockHand(96, 250, 206, 24, 4) + clockHand(96, 250, 312, 35, 3);
      back += sh(rect(30, 380, 270, 260, 3), "#e9e1cf") + sh(rect(30, 380, 270, 30, 2), P.ink);
      back += sh(rect(60, 450, 210, 150, 3), "#d7cdb7") + sh(rect(90, 470, 150, 90, 2), "#2d2826");
      back += sh(rect(120, 416, 90, 26, 1.5), "#1f2422") + A.text(165, 437, CH.t("art.cuisine.oven_time"), { size: 22, fill: "#9fd39a", font: "monospace" });
      back += sh(rect(160, 330, 40, 50, 2), P.stone) + sh(soft([[90, 360], [150, 360], [146, 386], [94, 386]], 2), "#7d7a73");
      // Plan of 1952
      back += sh(rect(690, 150, 190, 150, 2), P.woodDark) + sh(rect(704, 164, 162, 122, 1.5), "#ede0c0");
      back += ink(A.poly([[724, 270], [724, 200], [790, 186], [846, 200], [846, 270]], 1.5), 1.6, { op: 0.7 });
      back += ink(A.rect(740, 220, 40, 40, 1), 1.4, { op: 0.6 }) + ink(A.rect(800, 210, 30, 50, 1), 1.4, { op: 0.6 }) + `<rect x="828" y="252" width="10" height="8" fill="none" stroke="${P.ink}" stroke-width="1" opacity=".6"/>`;
      // Dresser and plate rack
      back += sh(rect(1110, 220, 190, 160, 2), P.woodLight);
      for (let i = 0; i < 4; i++) back += sh(blob(1140 + i * 42, 300, 18, 34, 0.04, 10), i % 2 ? P.cream : "#d9e3e0", { sw: 2 });
      back += sh(rect(1100, 380, 210, 260, 3), P.wood) + sh(rect(1124, 450, 162, 44, 2), P.woodLight, { sw: 2 }) + `<circle cx="1205" cy="472" r="6" fill="${P.ochre}" stroke="${P.ink}" stroke-width="1.5"/>`;
      back += sh(rect(1124, 520, 72, 100, 2), P.woodLight, { sw: 2 }) + sh(rect(1214, 520, 72, 100, 2), P.woodLight, { sw: 2 });
      // Violet water bottle
      back += sh(soft([[1140, 376], [1136, 340], [1146, 328], [1160, 328], [1170, 340], [1166, 376]], 1), "#b7a0cf", { sw: 2 }) + sh(rect(1146, 316, 14, 14, 0.8), P.ochre, { sw: 1.5 });
      // Door to the yard, apron hook
      back += sh(rect(1340, 190, 170, 450, 2), P.woodDark) + sh(rect(1364, 220, 122, 170, 2), P.wood, { sw: 2 }) + `<circle cx="1360" cy="430" r="8" fill="${P.ochre}" stroke="${P.ink}" stroke-width="2"/>`;
      back += sh(soft([[1530, 250], [1580, 250], [1590, 420], [1520, 420]], 2), "#efe1c0") + `<circle cx="1548" cy="320" r="5" fill="${P.rust}" opacity=".6"/><circle cx="1566" cy="370" r="5" fill="${P.mustard}" opacity=".6"/>`;
      // Boots with sunflowers, loafers
      const boot = (x) => sh(soft([[x, 640], [x + 34, 640], [x + 36, 706], [x + 62, 708], [x + 62, 728], [x - 2, 728]], 1.5), "#3f5d4a") + `<circle cx="${x + 17}" cy="670" r="7" fill="${P.mustard}" stroke="${P.ink}" stroke-width="1.5"/><circle cx="${x + 17}" cy="670" r="2.5" fill="${P.woodDark}"/>`;
      back += boot(1300) + boot(1360);
      back += sh(soft([[1300, 724], [1424, 724], [1424, 732], [1300, 732]], 1), P.clay, { sw: 0, op: 0.8 });
      back += sh(soft([[1440, 742], [1500, 736], [1512, 756], [1444, 760]], 1.5), "#9a6a42") + sh(soft([[1500, 760], [1560, 754], [1572, 774], [1504, 778]], 1.5), "#9a6a42");
      back += sh(soft([[1444, 756], [1510, 752], [1512, 760], [1446, 762]], 1), P.mudDark, { sw: 0, op: 0.8 });
      // Knitting basket
      back += sh(soft([[220, 700], [340, 700], [330, 780], [230, 780]], 2), P.straw) + ink(line(224, 730, 336, 730, 1), 2, { op: 0.6 }) + ink(line(228, 756, 332, 756, 1), 2, { op: 0.6 });
      back += sh(soft([[250, 700], [262, 670], [300, 668], [312, 700]], 1.5), "#f1e6cf") + ink(curve([[300, 690], [330, 640], [350, 620]], 0.5), 2.5, { stroke: P.woodDark });
      // Bin
      back += sh(soft([[600, 720], [672, 720], [666, 800], [606, 800]], 2), "#8e9a8c");
      if (s.act >= 2 && !has(s, "contrat_3")) back += sh(blob(636, 716, 18, 10, 0.2, 8), P.white, { sw: 2 });
      // Characters stand behind the table: the table is the front layer.
      let front = "";
      front += sh(rect(560, 520, 560, 34, 3), P.woodLight) + sh(rect(590, 552, 26, 220, 2), P.wood) + sh(rect(1064, 552, 26, 220, 2), P.wood);
      // Bouquet: gerberas and sunflowers in a milk jug
      front += sh(soft([[680, 520], [674, 466], [690, 450], [722, 450], [736, 466], [730, 520]], 1.5), "#b8c2c4");
      const stems = [[650, 380], [680, 360], [710, 350], [740, 366], [770, 386], [700, 330]];
      stems.forEach(([x, y], i) => {
        front += ink(curve([[705, 452], [(705 + x) / 2, (452 + y) / 2 + 10], [x, y]], 1), 3, { stroke: P.moss });
        if (i % 2) {
          for (let k = 0; k < 10; k++) {
            const a = (k / 10) * Math.PI * 2;
            front += sh(blob(x + Math.cos(a) * 18, y + Math.sin(a) * 18, 9, 5, 0.1, 6), "#e9b43a", { sw: 1.5 });
          }
          front += sh(blob(x, y, 11, 11, 0.1, 8), P.woodDark, { sw: 1.5 });
        } else {
          for (let k = 0; k < 12; k++) {
            const a = (k / 12) * Math.PI * 2;
            front += sh(blob(x + Math.cos(a) * 15, y + Math.sin(a) * 15, 8, 3.6, 0.1, 6), i === 0 ? "#e2705a" : "#ee9cb0", { sw: 1.3 });
          }
          front += sh(blob(x, y, 7, 7, 0.1, 8), P.mustard, { sw: 1.3 });
        }
      });
      // Laptop and mug
      front += sh(A.poly([[900, 520], [1010, 520], [1020, 440], [910, 440]], 1.5), "#3d4247") + sh(rect(880, 514, 150, 12, 1), "#5a6066");
      front += sh(rect(1040, 486, 30, 34, 1.5), P.cream) + ink(curve([[1070, 494], [1080, 502], [1070, 512]], 0.4), 3);
      if (s.act >= 2) front += sh(A.poly([[800, 534], [870, 530], [874, 548], [804, 552]], 1), P.white, { sw: 2 });
      let anim = A.steam(110, 352, 3);
      anim += `<circle cx="470" cy="300" r="160" fill="url(#g-warm)" opacity=".35" class="flicker"/>`;
      anim += A.dust(16, 380, 900, 360, 640);
      return { back, front, anim };
    },
    hotspots: [
      {
        id: "bouquet", x: 630, y: 320, w: 160, h: 200,
        look: (s) => {
          const steps = [L("hs.cuisine.bouquet.look"), { egg: "bouquet" }];
          if (!flag(s, "cloth") && !item(s, "petale")) steps.push(L("hs.cuisine.bouquet.petal"), { item: "petale" });
          return steps;
        },
      },
      { id: "four", x: 30, y: 196, w: 280, h: 270, look: [L("hs.cuisine.four.look"), { clue: "four" }] },
      { id: "calendrier", x: 190, y: 170, w: 120, h: 150, look: [L("hs.cuisine.calendrier.look"), { clue: "calendrier" }] },
      { id: "ambre", x: 430, y: 380, w: 90, h: 50, look: [L("hs.cuisine.ambre.look"), { egg: "ambre" }] },
      { id: "plan", x: 690, y: 150, w: 190, h: 150, look: [L("hs.cuisine.plan.look")], pro: { steps: [L("hs.cuisine.plan.pro"), { clue: "plan" }] } },
      { id: "panier", x: 216, y: 640, w: 140, h: 145, look: [L("hs.cuisine.panier.look"), { clue: "tricot" }, { egg: "polaireTricot" }] },
      { id: "violette", x: 1126, y: 312, w: 56, h: 70, look: [L("hs.cuisine.violette.look"), { clue: "violette" }] },
      {
        id: "tiroir", x: 1124, y: 448, w: 162, h: 48,
        look: (s) => (item(s, "cuillere") || flag(s, "stash") ? [L("hs.cuisine.tiroir.empty")] : [L("hs.cuisine.tiroir.look"), { item: "cuillere" }]),
      },
      { id: "bottes", x: 1290, y: 630, w: 140, h: 104, look: [L("hs.cuisine.bottes.look"), { egg: "bottesFleurs" }], pro: { steps: [L("hs.cuisine.bottes.pro"), { clue: "bottes" }] } },
      { id: "mocassins", x: 1436, y: 730, w: 140, h: 54, look: [L("hs.cuisine.mocassins.look"), { clue: "mocassins" }] },
      { id: "poubelle", x: 596, y: 700, w: 82, h: 104, look: (s) => (s.act >= 2 && !has(s, "contrat_3") ? [L("hs.cuisine.poubelle.look"), { clue: "contrat_3" }] : [L("hs.cuisine.poubelle.empty")]) },
      { id: "certificat", x: 796, y: 524, w: 84, h: 34, when: (s) => s.act >= 2, look: [L("hs.cuisine.certificat.look"), { clue: "certificat" }] },
      { id: "tablier", x: 1520, y: 240, w: 76, h: 190, look: [L("hs.cuisine.tablier.look")] },
    ],
  });

  CH.scenes.util = { windowView, windowFrame };
})();

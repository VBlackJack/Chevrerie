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

// Village cafe, the old tile-works path, and non-playable illustrations.
(function () {
  const A = CH.art, P = A.P;
  const { sh, ink, soft, rect, blob, curve, line, g } = A;
  const { L, has, flag } = CH.S;

  // ------------------------------------------------------------ Cafe
  CH.scenes.register({
    id: "cafe",
    nav: true,
    outdoor: false,
    unlock: (s) => s.act >= 2 && flag(s, "villageOpen"),
    draw(s) {
      A.srand(7007);
      let back = `<rect x="0" y="0" width="1600" height="900" fill="#d7a75e"/>`;
      back += `<rect x="0" y="470" width="1600" height="200" fill="${P.woodDark}"/>`;
      for (let x = 0; x < 1600; x += 80) back += ink(line(x, 474, x, 666, 0.5), 2, { op: 0.4 });
      back += sh(soft([[-20, 660], [1620, 650], [1620, 920], [-20, 920]], 3), "#8a5a3a");
      for (let x = 0; x < 1600; x += 120) back += ink(line(x, 660, x - 60, 900, 1), 2, { op: 0.3 });
      // Window onto the village street with the church tower
      const view = sh(A.poly([[560, 420], [560, 300], [620, 260], [680, 300], [680, 420]], 2), P.stoneLight) + sh(A.poly([[700, 420], [700, 210], [730, 170], [760, 210], [760, 420]], 2), P.stone) + sh(blob(730, 240, 12, 12, 0.05, 8), P.cream, { sw: 2 }) + sh(A.poly([[540, 300], [620, 250], [700, 300]], 2), P.rust) + sh(A.poly([[770, 420], [770, 320], [830, 320], [830, 420]], 2), P.stoneLight);
      back += CH.scenes.util.windowView("ca-win", 520, 150, 280, 270, view);
      back += CH.scenes.util.windowFrame(520, 150, 280, 270);
      // Score slate
      back += sh(rect(110, 170, 220, 200, 2), P.woodLight) + sh(rect(124, 184, 192, 172, 2), "#2f3a35");
      back += A.text(220, 220, CH.t("art.cafe.slate_title"), { size: 24, fill: "#eceae0" });
      for (let i = 0; i < 4; i++) back += ink(line(144, 250 + i * 26, 296 - (i % 2) * 30, 250 + i * 26, 0.8), 2, { stroke: "#cfcfc6", op: 0.8 });
      // Contest poster
      back += sh(A.poly([[880, 190], [1010, 186], [1014, 386], [884, 390]], 1.5), P.cream);
      back += A.text(947, 226, CH.t("art.cafe.poster_title"), { size: 22, weight: 700 }) + A.text(947, 252, CH.t("art.cafe.poster_sub"), { size: 18 });
      back += A.goatAt(Object.assign({}, A.GOATS.blanchette, { collar: null }), 930, 360, 0.42, false);
      back += sh(blob(985, 300, 16, 16, 0.08, 9), P.mustard, { sw: 2 }) + ink(line(980, 314, 976, 340, 0.5), 4, { stroke: P.red }) + ink(line(990, 314, 994, 340, 0.5), 4, { stroke: P.red });
      // Bar shelves and bottles
      back += sh(rect(1040, 160, 540, 14, 1.5), P.woodLight) + sh(rect(1040, 300, 540, 14, 1.5), P.woodLight);
      const bottles = [P.olive, P.rust, "#7f9fa8", P.mustard, P.plum, P.moss, "#a8443a", "#c9c3a8"];
      for (let i = 0; i < 12; i++) back += sh(soft([[1060 + i * 42, 160], [1060 + i * 42, 112], [1068 + i * 42, 96], [1076 + i * 42, 96], [1084 + i * 42, 112], [1084 + i * 42, 160]], 1), bottles[i % bottles.length], { sw: 2 });
      for (let i = 0; i < 10; i++) back += sh(rect(1060 + i * 50, 262, 26, 38, 1), "#e8e2d2", { sw: 1.8 });
      // Mirror ball hanging
      back += ink(line(655, 0, 655, 92, 0.3), 2);
      back += sh(blob(655, 132, 40, 40, 0.02, 14), "#b9bec2") + `<g opacity=".7">${ink(line(620, 132, 690, 132, 0.3), 1.2)}${ink(line(655, 94, 655, 170, 0.3), 1.2)}${ink(curve([[626, 110], [655, 104], [684, 110]], 0.3), 1.2)}${ink(curve([[626, 154], [655, 160], [684, 154]], 0.3), 1.2)}</g>`;
      // Billiard table
      back += sh(A.poly([[430, 760], [450, 650], [880, 650], [900, 760]], 2), "#3f6b4a") + sh(A.poly([[420, 770], [430, 750], [900, 750], [910, 770]], 1.5), P.woodDark);
      back += `<circle cx="600" cy="700" r="9" fill="${P.cream}" stroke="${P.ink}" stroke-width="2"/><circle cx="680" cy="690" r="9" fill="${P.red}" stroke="${P.ink}" stroke-width="2"/>`;
      // Foreground furniture: table with cards, bar counter
      let front = "";
      front += sh(rect(90, 690, 360, 26, 2), P.woodLight) + sh(rect(250, 716, 26, 180, 2), P.wood);
      for (let i = 0; i < 5; i++) front += sh(A.poly([[150 + i * 26, 694], [178 + i * 26, 692], [180 + i * 26, 704], [152 + i * 26, 706]], 0.8), P.white, { sw: 1.5 });
      front += sh(rect(380, 656, 40, 34, 1.5), P.cream) + ink(curve([[420, 664], [430, 674], [420, 684]], 0.3), 3);
      front += sh(rect(1000, 540, 620, 40, 2), P.woodLight) + sh(rect(1020, 580, 600, 330, 3), P.wood);
      for (let x = 1060; x < 1600; x += 110) front += sh(rect(x, 610, 80, 250, 2), P.woodLight, { sw: 2, op: 0.7 });
      let anim = "";
      for (let i = 0; i < 9; i++) {
        const x = 520 + A.rnd() * 300, y = 180 + A.rnd() * 300;
        anim += `<circle class="sparkle" style="animation-delay:-${(A.rnd() * 3).toFixed(2)}s" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="4" fill="#fff6d8"/>`;
      }
      anim += `<circle cx="655" cy="132" r="120" fill="url(#g-warm)" opacity=".4" class="flicker"/>`;
      return { back, front, anim };
    },
    hotspots: [
      { id: "boule", x: 600, y: 80, w: 110, h: 110, look: [L("hs.cafe.boule.look"), { egg: "boule" }] },
      { id: "affiche", x: 876, y: 186, w: 140, h: 206, look: [L("hs.cafe.affiche.look")] },
      { id: "ardoise", x: 110, y: 170, w: 220, h: 200, look: [L("hs.cafe.ardoise.look")] },
      { id: "billard", x: 430, y: 650, w: 470, h: 120, look: [L("hs.cafe.billard.look")] },
    ],
  });

  // ------------------------------------------------------------ Tile-works path
  CH.scenes.register({
    id: "chemin",
    nav: true,
    outdoor: true,
    unlock: (s) => s.act >= 3,
    draw(s) {
      let back = CH.scenes.util.outdoorBase(8008, 500);
      // Ivy wall with a glimpse of an old tiled roof
      back += sh(A.poly([[1290, 230], [1420, 150], [1560, 230]], 2), P.rust, { op: 0.9 });
      for (let i = 0; i < 46; i++) {
        const x = 1150 + A.rnd() * 470, y = 200 + A.rnd() * 380;
        back += sh(blob(x, y, 40 + A.rnd() * 30, 30 + A.rnd() * 20, 0.15, 9), i % 3 ? P.moss : "#4f5a3a", { sw: 2 });
      }
      // Barn wall on the left
      back += sh(A.poly([[-30, 720], [-30, 80], [380, 120], [380, 720]], 3), P.stone);
      for (let i = 0; i < 20; i++) back += sh(blob(A.rnd() * 370, 140 + A.rnd() * 560, 26, 14, 0.2, 7), P.stoneLight, { sw: 1.5, op: 0.6 });
      back += sh(rect(80, 300, 120, 220, 2), P.woodDark);
      // Grass verges
      back += sh(soft([[-20, 600], [1620, 560], [1620, 920], [-20, 920]], 4), P.meadow);
      // Red clay path winding to the ivy
      back += sh(soft([[380, 920], [500, 760], [760, 620], [1050, 520], [1200, 500], [1240, 540], [1100, 600], [900, 700], [760, 820], [720, 920]], 3), P.clay);
      back += sh(soft([[560, 900], [640, 780], [860, 680], [1000, 600], [1060, 610], [900, 720], [760, 840], [700, 910]], 3), "#bf6a48", { sw: 0, op: 0.7 });
      // Footprints: flower soles and hooves
      [[700, 790], [760, 740], [830, 700], [900, 660], [970, 620]].forEach(([x, y], i) => {
        back += sh(blob(x, y, 11, 6, 0.15, 7), "#7a3624", { sw: 0, op: 0.85 });
        back += `<circle cx="${x - 3}" cy="${y}" r="2" fill="${P.cream}" opacity=".6"/><circle cx="${x + 4}" cy="${y - 1}" r="2" fill="${P.cream}" opacity=".6"/>`;
        back += sh(blob(x + 30, y + 14 - i, 5, 4, 0.2, 6), "#5a2a1c", { sw: 0 }) + sh(blob(x + 38, y + 12 - i, 5, 4, 0.2, 6), "#5a2a1c", { sw: 0 });
      });
      // Old tiles stacked in a low wall
      for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) back += sh(soft([[420 + c * 38 + (r % 2) * 18, 640 - r * 24], [456 + c * 38 + (r % 2) * 18, 640 - r * 24], [452 + c * 38 + (r % 2) * 18, 618 - r * 24], [424 + c * 38 + (r % 2) * 18, 618 - r * 24]], 1), r % 2 ? P.clay : "#c06a46", { sw: 1.8 });
      back += sh(soft([[540, 566], [580, 560], [600, 568], [570, 572]], 1), "#7d8a52", { sw: 1.5 });
      // Sign
      back += sh(rect(380, 470, 14, 180, 1.5), P.wood) + sh(A.poly([[300, 420], [470, 424], [468, 500], [302, 498]], 2), P.woodLight);
      back += A.text(386, 452, CH.t("art.chemin.sign_1"), { size: 20 }) + A.text(386, 480, CH.t("art.chemin.sign_2"), { size: 20 });
      // Brambles with the fleece throw
      for (let i = 0; i < 9; i++) back += sh(A.blob(1010 + i * 36, 560 + (i % 3) * 40, 60, 46, 0.2, 9), i % 2 ? "#4f5636" : "#5d5a3a", { sw: 2 });
      for (let i = 0; i < 22; i++) {
        const x0 = 990 + A.rnd() * 330;
        back += ink(curve([[x0, 700], [x0 + 30 - A.rnd() * 60, 600], [x0 + 50 - A.rnd() * 100, 500], [x0 + 70 - A.rnd() * 140, 470]], 3), 2.4, { stroke: "#3b2a22" });
        back += `<circle cx="${(x0 + 20 - A.rnd() * 40).toFixed(0)}" cy="${(520 + A.rnd() * 150).toFixed(0)}" r="4" fill="#5a2f45"/>`;
      }
      if (!flag(s, "plaidTaken")) {
        const throwPts = [[1070, 520], [1150, 506], [1226, 524], [1240, 600], [1222, 664], [1190, 640], [1160, 672], [1124, 644], [1092, 668], [1066, 600]];
        back += g(sh(soft(throwPts, 3), "#9a7356") + `<path d="${soft(throwPts, 0)}" fill="url(#p-fleece)"/>`, 'filter="url(#f-fuzz)"');
        back += ink(curve([[1110, 530], [1120, 600], [1112, 650]], 1), 2, { op: 0.5 }) + ink(curve([[1180, 524], [1190, 600], [1186, 646]], 1), 2, { op: 0.5 });
        for (let i = 0; i < 10; i++) back += ink(line(1090 + A.rnd() * 130, 540 + A.rnd() * 80, 1100 + A.rnd() * 130, 546 + A.rnd() * 80, 0.5), 2, { stroke: P.straw });
      }
      // Carrot tops
      if (!flag(s, "carrot")) {
        for (let i = 0; i < 5; i++) back += ink(curve([[810, 650], [796 + i * 8, 620], [790 + i * 10, 596]], 1), 3, { stroke: "#5f8a3a" });
        back += sh(soft([[800, 650], [822, 650], [814, 664]], 0.5), "#e07a2a", { sw: 1.5 });
      }
      let anim = A.leaves(10, 0, 1600, -40);
      anim += A.mist(260, 220, 0.85);
      anim += A.mist(520, 140, 0.45);
      return { back, front: "", anim };
    },
    hotspots: [
      { id: "panneau", x: 296, y: 416, w: 180, h: 90, look: [L("hs.chemin.panneau.look"), { clue: "terre" }, { egg: "sandalesBoue" }] },
      { id: "empreintes", x: 660, y: 600, w: 360, h: 220, look: [L("hs.chemin.empreintes.look")], pro: { steps: [L("hs.chemin.empreintes.pro"), { clue: "empreintes" }] } },
      {
        id: "plaid", x: 1060, y: 500, w: 190, h: 150,
        look: (s) => (has(s, "plaid") ? [L("hs.chemin.plaid.touch"), { egg: "statiquePlaid" }] : [L("hs.chemin.plaid.look"), { clue: "plaid" }, L("hs.chemin.plaid.sniff"), { egg: "plaidOdeur" }]),
      },
      { id: "carotte", x: 770, y: 584, w: 110, h: 86, when: (s) => !flag(s, "carrot"), look: [L("hs.chemin.carotte.look"), { item: "carotte" }, { flag: "carrot" }, { egg: "carotte" }] },
      { id: "lierre", x: 1260, y: 150, w: 340, h: 340, look: [L("hs.chemin.lierre.look")], pro: { steps: [L("hs.chemin.lierre.pro")] } },
      { id: "briques", x: 410, y: 540, w: 260, h: 110, look: [L("hs.chemin.briques.look")] },
    ],
  });

  // ------------------------------------------------------------ Illustrations
  CH.scenes.register({
    id: "loge",
    outdoor: false,
    draw() {
      A.srand(9009);
      let back = `<rect x="0" y="0" width="1600" height="900" fill="#4a3628"/>`;
      for (let x = 0; x < 1600; x += 90) back += sh(rect(x, -10, 90, 760, 2), x % 180 ? "#56402f" : "#4e3a2b", { sw: 2 });
      back += sh(A.poly([[0, 120], [800, 0], [1600, 120], [1600, -20], [0, -20]], 2), "#3a2a1f");
      back += sh(soft([[-20, 700], [1620, 680], [1620, 920], [-20, 920]], 3), P.straw);
      for (let i = 0; i < 120; i++) {
        const x = A.rnd() * 1600, y = 690 + A.rnd() * 210;
        back += ink(line(x, y, x + 24 - A.rnd() * 48, y + 6 - A.rnd() * 12, 0.5), 2, { stroke: "#b8963f", op: 0.8 });
      }
      // Bucket of water, hay, wool blanket
      back += sh(A.poly([[260, 760], [380, 760], [366, 640], [274, 640]], 2), "#9aa3a8") + sh(blob(320, 640, 46, 10, 0.05, 9), "#8fb7c4");
      back += sh(soft([[1180, 760], [1180, 620], [1300, 590], [1420, 610], [1420, 760]], 3), "#9fa45a");
      back += sh(soft([[560, 790], [1040, 780], [1080, 860], [520, 870]], 3), "#b9785a") + ink(line(560, 810, 1040, 800, 1), 2, { stroke: P.cream, op: 0.7 }) + ink(line(546, 840, 1060, 832, 1), 2, { stroke: P.cream, op: 0.7 });
      back += A.namedGoat("blanchette", 800, 820, 1.25, false, { pose: "lie", collar: null });
      back += A.namedGoat("biscotte", 1050, 830, 0.9, true, { pose: "lie" });
      let anim = "";
      [[300, 0], [700, 0], [1150, 0]].forEach(([x]) => {
        anim += `<polygon points="${x},0 ${x + 30},0 ${x + 200},900 ${x + 80},900" fill="url(#g-beam)" opacity=".45"/>`;
      });
      anim += A.dust(40, 200, 1400, 100, 860);
      anim += `<circle cx="800" cy="700" r="300" fill="url(#g-warm)" opacity=".35" class="flicker"/>`;
      return { back, front: "", anim };
    },
    hotspots: [],
  });

  CH.scenes.register({
    id: "concours",
    outdoor: true,
    draw() {
      let back = CH.scenes.util.outdoorBase(9100, 520);
      back += sh(A.poly([[600, 520], [600, 260], [650, 190], [700, 260], [700, 520]], 2), P.stone) + sh(blob(650, 300, 18, 18, 0.05, 8), P.cream, { sw: 2 });
      back += sh(soft([[-20, 600], [1620, 590], [1620, 920], [-20, 920]], 4), "#b7a58a");
      // Bunting
      back += ink(curve([[0, 120], [400, 200], [800, 150], [1200, 210], [1600, 130]], 2), 2);
      for (let i = 0; i < 18; i++) {
        const x = 40 + i * 88, y = 140 + Math.sin(i * 0.8) * 30 + 30;
        back += sh(A.poly([[x - 18, y], [x + 18, y], [x, y + 34]], 1), [P.rust, P.mustard, P.sage, P.plum][i % 4], { sw: 2 });
      }
      // Podium with Duchesse wearing the rosette, Gerbera stealing it
      back += sh(rect(620, 640, 360, 120, 3), P.woodLight) + A.text(800, 712, CH.t("art.concours.podium"), { size: 34, weight: 700 });
      back += A.namedGoat("duchesse", 800, 644, 0.9, false);
      back += A.namedGoat("gerbera", 1120, 820, 0.9, true);
      back += sh(blob(1020, 700, 22, 22, 0.08, 10), P.mustard, { sw: 2 }) + ink(line(1014, 718, 1008, 750, 0.5), 5, { stroke: P.red }) + ink(line(1026, 718, 1032, 750, 0.5), 5, { stroke: P.red });
      back += A.character("gerard", 420, 860, 360, false, { expr: "sad" });
      back += A.character("capucine", 1380, 860, 340, false, { expr: "smile" });
      let anim = A.leaves(14, 0, 1600, -40);
      return { back, front: "", anim };
    },
    hotspots: [],
  });

  CH.scenes.register({
    id: "teaser",
    outdoor: false,
    draw() {
      A.srand(9200);
      let back = `<rect x="0" y="0" width="1600" height="900" fill="#2a2320"/>`;
      back += sh(soft([[-20, 520], [1620, 500], [1620, 920], [-20, 920]], 3), P.woodDark);
      for (let i = 0; i < 6; i++) back += ink(line(-20, 560 + i * 60, 1620, 540 + i * 60, 2), 2, { op: 0.4 });
      // Envelope with an amber wax seal
      back += g(sh(A.poly([[540, 620], [1060, 600], [1080, 860], [560, 880]], 3), "#efe2c6") + ink(A.poly([[540, 620], [810, 760], [1060, 600]], 2, false), 3) + sh(blob(810, 752, 44, 40, 0.1, 12), "#d58a2a", { sw: 3 }) + sh(blob(810, 752, 26, 24, 0.1, 10), "#e6a443", { sw: 1.5 }) + ink(curve([[796, 752], [810, 738], [824, 752], [810, 766], [796, 752]], 0.5), 2, { stroke: "#8a4f14" }), 'transform="rotate(-4 810 740)"');
      back += sh(rect(960, 630, 70, 80, 1.5), "#c7d2c8", { sw: 2 }) + ink(A.rect(968, 638, 54, 64, 1), 1.5, { op: 0.6 }) + sh(blob(995, 670, 14, 16, 0.1, 8), P.mustard, { sw: 1.5, op: 0.8 });
      back += A.text(820, 838, CH.t("art.teaser.envelope"), { size: 30, fill: P.ink, rot: -4 });
      back += A.namedGoat("biscotte", 1320, 640, 0.8, true);
      let anim = `<circle cx="810" cy="400" r="520" fill="url(#g-warm)" opacity=".5" class="flicker"/>`;
      return { back, front: "", anim };
    },
    hotspots: [],
  });

  // Title illustration: Veronique and Biscotte in the misty yard.
  CH.scenes.register({
    id: "title",
    outdoor: true,
    draw() {
      let back = CH.scenes.util.outdoorBase(9300, 560);
      back += CH.scenes.util.trees([[300, 380, 40, P.leafGold], [380, 400, 30, P.rust], [1300, 370, 46, P.ochre], [1390, 396, 30, P.leafRed]]);
      back += `<g opacity=".7">${sh(A.poly([[860, 520], [860, 380], [980, 310], [1100, 380], [1100, 520]], 2), P.stone)}${sh(A.poly([[840, 386], [980, 296], [1120, 386]], 2), P.rust)}</g>`;
      back += sh(soft([[-20, 640], [1620, 620], [1620, 920], [-20, 920]], 4), "#a99377");
      for (let x = 0; x < 1600; x += 140) back += sh(rect(x, 560, 14, 110, 1.5), P.wood);
      back += sh(rect(-10, 590, 1620, 12, 2), P.woodLight, { sw: 2 });
      const top = A.character("veronique", 1180, 880, 560, false, { expr: "smile" }) + A.namedGoat("biscotte", 1430, 880, 1.15, true);
      let anim = A.leaves(16, 0, 1600, -40);
      anim += A.mist(420, 220, 0.8);
      return { back, front: "", anim, top };
    },
    hotspots: [],
  });
})();

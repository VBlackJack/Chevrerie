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

// Characters: where they stand, what they talk about, how they react to cards.
// Topic labels: chr.<id>.t.<topic>. Dialogue: dlg.<id>.<topic>, dlg.<id>.show.<clue>.
(function () {
  const { L, has, flag } = CH.S;
  const dedFound = (s, id) => !!s.deds[id];

  const T = (id, topic, extra = [], when) => ({ id: topic, when, steps: [L(`dlg.${id}.${topic}`), ...extra] });
  const SHOW = (id, clue, extra = []) => [L(`dlg.${id}.show.${clue}`), ...extra];

  const CHARS = {
    mireille: {
      presence: (s) => (s.act >= 1 && s.act <= 3 ? { scene: "cuisine", x: 430, y: 840, h: 400 } : null),
      expr: "neutral",
      topics: [
        T("mireille", "blanchette"),
        T("mireille", "nuit", [{ clue: "mireille_nuit" }]),
        T("mireille", "gaston"),
        T("mireille", "tricot", [], (s) => has(s, "tricot")),
        T("mireille", "thibault", [], (s) => s.act >= 3),
      ],
      show: {
        bottes: SHOW("mireille", "bottes"),
        four: SHOW("mireille", "four"),
        collier: SHOW("mireille", "collier"),
        echarpe: SHOW("mireille", "echarpe", [{ flag: "villageOpen" }]),
        violette: SHOW("mireille", "violette"),
        mocassins: SHOW("mireille", "mocassins"),
        plaid: SHOW("mireille", "plaid"),
        empreintes: SHOW("mireille", "empreintes"),
        page_veto: SHOW("mireille", "page_veto"),
        plan: SHOW("mireille", "plan"),
      },
    },
    thibault: {
      presence: (s) => {
        if (s.act === 1) return { scene: "cuisine", x: 1215, y: 860, h: 420 };
        if (s.act === 2 || s.act === 3) return { scene: "cour", x: 860, y: 870, h: 410 };
        return null;
      },
      topics: [
        T("thibault", "concours"),
        T("thibault", "nuit"),
        T("thibault", "capriglamp", [], (s) => s.act >= 2),
        T("thibault", "contrat", [], (s) => has(s, "contrat")),
      ],
      show: {
        mocassins: SHOW("thibault", "mocassins", [{ clue: "appel" }]),
        contrat: SHOW("thibault", "contrat"),
        photos: (s) => (dedFound(s, "heure") ? SHOW("thibault", "photos_after") : SHOW("thibault", "photos")),
        page_veto: SHOW("thibault", "page_veto"),
        certificat: SHOW("thibault", "certificat"),
        echarpe: SHOW("thibault", "echarpe"),
        dispute: SHOW("thibault", "dispute"),
      },
    },
    julien: {
      presence: (s) => (s.act >= 1 && s.act <= 3 ? { scene: "cuisine", x: 975, y: 790, h: 490 } : null),
      topics: [
        T("julien", "logs", [{ clue: "photos" }]),
        T("julien", "toit", [{ clue: "julien_toit" }], (s) => has(s, "photos")),
        T("julien", "wifi", [{ egg: "wifi" }]),
        T("julien", "diner", [{ clue: "dispute" }], (s) => s.act >= 3),
        T("julien", "pluie", [{ clue: "pluie" }], (s) => s.act >= 3),
      ],
      show: {
        four: SHOW("julien", "four"),
        calendrier: SHOW("julien", "calendrier"),
        photos: (s) => (dedFound(s, "heure") ? SHOW("julien", "photos_after") : SHOW("julien", "photos")),
        plaid: SHOW("julien", "plaid"),
      },
    },
    capucine: {
      presence: (s) => (s.act >= 2 && s.act <= 3 ? { scene: "fromagerie", x: 830, y: 860, h: 400 } : null),
      topics: [
        T("capucine", "nuit"),
        T("capucine", "echarpe", [{ flag: "villageOpen" }], (s) => has(s, "echarpe")),
        T("capucine", "luzerne", [], (s) => has(s, "luzerne")),
        T("capucine", "blanchette", [{ clue: "eau" }], (s) => s.act >= 3),
        T("capucine", "chemin", [], (s) => s.act >= 3),
      ],
      show: {
        liste: SHOW("capucine", "liste", [{ flag: "capucineConfessed" }]),
        lettre: SHOW("capucine", "lettre"),
        echarpe: SHOW("capucine", "echarpe", [{ flag: "villageOpen" }]),
        terre: SHOW("capucine", "terre"),
        tricot: SHOW("capucine", "tricot"),
      },
    },
    veto: {
      presence: (s) => (s.act >= 2 && s.act <= 3 ? { scene: "cour", x: 1390, y: 890, h: 430 } : null),
      topics: [T("veto", "visite", [{ clue: "carnet_veto" }]), T("veto", "blanchette")],
      show: {
        trousse: SHOW("veto", "trousse"),
        certificat: SHOW("veto", "certificat"),
        page_veto: SHOW("veto", "page_veto"),
        photos: (s) => (dedFound(s, "heure") ? SHOW("veto", "photos_after") : SHOW("veto", "photos")),
      },
      pro: [L("dlg.veto.pro"), { egg: "verresVeto" }],
    },
    gerard: {
      presence: (s) => (s.act >= 2 && s.act <= 3 ? { scene: "cafe", x: 270, y: 860, h: 440 } : null),
      topics: [
        T("gerard", "nuit"),
        T("gerard", "duchesse"),
        T("gerard", "blanchette"),
        T("gerard", "echarpe", [], (s) => has(s, "echarpe")),
        T("gerard", "lunettes", [{ egg: "lunettesGerard" }], (s) => flag(s, "gerardPro")),
      ],
      show: {
        plaquette: SHOW("gerard", "aveu", [{ clue: "gerard_aveu" }]),
        recette: SHOW("gerard", "aveu", [{ clue: "gerard_aveu" }]),
        photos: (s) => (dedFound(s, "heure") ? SHOW("gerard", "photos_after") : SHOW("gerard", "photos")),
        belote: SHOW("gerard", "belote"),
        lettre: SHOW("gerard", "lettre"),
        echarpe: SHOW("gerard", "echarpe"),
      },
      pro: [L("dlg.gerard.pro"), { flag: "gerardPro" }],
    },
    benjamin: {
      presence: (s) => {
        if (s.act === 1) return { scene: "cuisine", x: 830, y: 790, h: 370 };
        if (s.act === 2) return { scene: "enclos", x: 1470, y: 885, h: 360 };
        if (s.act === 3) return { scene: "chemin", x: 590, y: 890, h: 370 };
        return null;
      },
      topics: [
        T("benjamin", "gaston"),
        T("benjamin", "nuit", [{ clue: "benjamin_nuit" }, { clue: "pluie" }]),
        T("benjamin", "traces", [{ clue: "b_traces" }], (s) => s.act >= 2),
        T("benjamin", "interieur", [], (s) => s.act >= 2),
        T("benjamin", "lierre", [], (s) => s.act >= 3),
      ],
      show: {
        collier: SHOW("benjamin", "collier"),
        tricot: SHOW("benjamin", "tricot"),
        page_veto: SHOW("benjamin", "page_veto"),
        plaid: SHOW("benjamin", "plaid"),
        photos: SHOW("benjamin", "photos"),
        traces_gaston: SHOW("benjamin", "traces_gaston"),
        empreintes: SHOW("benjamin", "empreintes"),
      },
    },
    momo: {
      presence: (s) => (s.act >= 2 && s.act <= 3 ? { scene: "cafe", x: 1280, y: 800, h: 420 } : null),
      topics: [T("momo", "tournoi", [{ clue: "belote" }]), T("momo", "meteo", [{ clue: "pluie" }]), T("momo", "boule", [{ egg: "jeudiDisco" }])],
      show: { gerard_aveu: SHOW("momo", "gerard_aveu"), plaquette: SHOW("momo", "plaquette") },
    },
  };

  CH.chars = {
    all: CHARS,
    get: (id) => CHARS[id],
    inScene: (s, sceneId) =>
      Object.keys(CHARS)
        .map((id) => ({ id, p: CHARS[id].presence(s) }))
        .filter((c) => c.p && c.p.scene === sceneId),
  };
})();

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

// Ordered critical-path goals used by Biscotte's hints.
// Level 1 text: hint.<id>. Levels 2 and 3 use generic templates per target kind.
(function () {
  const { has, flag, item } = CH.S;
  const ded = (s, id) => !!s.deds[id];
  const hs = (scene, id, pro = false) => ({ kind: "hs", scene, id, pro });
  const chr = (id) => ({ kind: "char", id });
  const cards = (a, b) => ({ kind: "ded", a, b });

  const GOALS = [
    // Act I
    { id: "cloth", act: 1, done: (s) => flag(s, "cloth"), target: (s) => (item(s, "petale") ? { kind: "biscotte" } : hs("cuisine", "bouquet")) },
    { id: "crochet", act: 1, done: (s) => has(s, "crochet"), target: () => hs("enclos", "porte") },
    // Act II, towards Board I
    { id: "photos", act: 2, done: (s) => has(s, "photos"), target: () => chr("julien") },
    { id: "spoon", act: 2, done: (s) => item(s, "cuillere") || flag(s, "stash"), target: () => hs("cuisine", "tiroir") },
    { id: "stash", act: 2, done: (s) => flag(s, "stash"), target: () => hs("enclos", "gerbera") },
    { id: "collier", act: 2, done: (s) => has(s, "collier"), target: () => hs("enclos", "tresor") },
    { id: "cahier", act: 2, done: (s) => has(s, "cahier_gaston"), target: () => hs("grange", "cahier") },
    { id: "traces", act: 2, done: (s) => has(s, "traces_gaston"), target: () => hs("enclos", "sol", true) },
    { id: "dedGaston", act: 2, done: (s) => ded(s, "gaston"), target: () => cards("cahier_gaston", "traces_gaston") },
    { id: "dedEvasion", act: 2, done: (s) => ded(s, "evasion"), target: () => cards("crochet", "collier") },
    { id: "board1", act: 2, done: (s) => flag(s, "board1Done"), target: () => ({ kind: "board", id: "b1" }) },
    // Act III, towards Board II
    { id: "empreintes", act: 3, done: (s) => has(s, "empreintes"), target: () => hs("chemin", "empreintes", true) },
    { id: "plaid", act: 3, done: (s) => has(s, "plaid"), target: () => hs("chemin", "plaid") },
    { id: "pluie", act: 3, done: (s) => has(s, "pluie"), target: () => chr("julien") },
    { id: "dedNuit", act: 3, done: (s) => ded(s, "nuit"), target: () => cards("empreintes", "pluie") },
    { id: "bottes", act: 3, done: (s) => has(s, "bottes"), target: () => hs("cuisine", "bottes", true) },
    { id: "dedMireille", act: 3, done: (s) => ded(s, "mireille"), target: () => cards("empreintes", "bottes") },
    { id: "violette", act: 3, done: (s) => has(s, "violette"), target: () => hs("cuisine", "violette") },
    { id: "dedPlaid", act: 3, done: (s) => ded(s, "plaid"), target: () => cards("plaid", "violette") },
    { id: "plan", act: 3, done: (s) => has(s, "plan"), target: () => hs("cuisine", "plan", true) },
    { id: "dedLieu", act: 3, done: (s) => ded(s, "lieu"), target: () => cards("plaid", "plan") },
    { id: "carnetVeto", act: 3, done: (s) => has(s, "carnet_veto") || ded(s, "heure"), target: () => chr("veto") },
    { id: "dedHeure", act: 3, done: (s) => ded(s, "heure"), target: () => cards("photos", "carnet_veto") },
    { id: "village", act: 3, done: (s) => flag(s, "villageOpen"), target: (s) => (has(s, "echarpe") ? chr("capucine") : hs("enclos", "cloture")) },
    { id: "plaquette", act: 3, done: (s) => has(s, "plaquette") || has(s, "recette") || has(s, "gerard_aveu"), target: () => hs("enclos", "tresor", true) },
    { id: "aveu", act: 3, done: (s) => has(s, "gerard_aveu"), target: () => chr("gerard") },
    { id: "belote", act: 3, done: (s) => has(s, "belote"), target: () => chr("momo") },
    { id: "dedGerard", act: 3, done: (s) => ded(s, "gerard"), target: () => cards("gerard_aveu", "belote") },
    {
      id: "contrat", act: 3, done: (s) => has(s, "contrat"),
      target: (s) => (!has(s, "contrat_1") ? hs("enclos", "mangeoire") : !has(s, "contrat_2") ? hs("grange", "litiere") : hs("cuisine", "poubelle")),
    },
    { id: "dispute", act: 3, done: (s) => has(s, "dispute"), target: () => chr("julien") },
    { id: "dedThibault", act: 3, done: (s) => ded(s, "thibault"), target: () => cards("contrat", "dispute") },
    { id: "carotte", act: 3, done: (s) => item(s, "carotte") || has(s, "page_veto"), target: () => hs("chemin", "carotte") },
    { id: "page", act: 3, done: (s) => has(s, "page_veto"), target: () => hs("enclos", "tournesol") },
    { id: "tricot", act: 3, done: (s) => has(s, "tricot") || has(s, "eau"), target: () => hs("cuisine", "panier") },
    { id: "dedGestante", act: 3, done: (s) => ded(s, "gestante"), target: (s) => cards("page_veto", has(s, "tricot") ? "tricot" : "eau") },
    { id: "board2", act: 3, done: (s) => flag(s, "board2Done"), target: () => ({ kind: "board", id: "b2" }) },
  ];

  CH.goals = {
    LIST: GOALS,
    current: (s) => GOALS.find((g) => g.act <= s.act && !g.done(s)) || null,
  };
})();

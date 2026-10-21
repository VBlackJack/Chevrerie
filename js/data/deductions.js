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

// Deductions made by pairing two cards in the notebook.
// Text lives in ded.<id>.title / ded.<id>.text.
(function () {
  const DEDUCTIONS = [
    { id: "evasion", pairs: [["crochet", "collier"], ["crochet", "benjamin_nuit"]], board: "b1" },
    { id: "gaston", pairs: [["cahier_gaston", "traces_gaston"]], board: "b1" },
    { id: "heure", pairs: [["photos", "carnet_veto"], ["photos", "appel"]], board: "b2", cut: "clockReveal" },
    { id: "julien", pairs: [["photos", "julien_toit"]] },
    { id: "gerard", pairs: [["gerard_aveu", "belote"]], board: "b2", requires: ["heure"], failKey: "combo.need.heure_gerard" },
    { id: "capucine", pairs: [["liste", "lettre"]] },
    { id: "thibault", pairs: [["contrat", "dispute"]], board: "b2" },
    { id: "nuit", pairs: [["empreintes", "pluie"], ["empreintes", "benjamin_nuit"]], board: "b2" },
    { id: "mireille", pairs: [["empreintes", "bottes"], ["terre", "bottes"]], board: "b2" },
    { id: "plaid", pairs: [["plaid", "violette"]], board: "b2" },
    { id: "lieu", pairs: [["plaid", "plan"], ["luzerne", "plan"]], board: "b2" },
    { id: "gestante", pairs: [["page_veto", "tricot"], ["page_veto", "eau"]], board: "b2", cut: "pregnancyReveal" },
    { id: "veto", pairs: [["page_veto", "certificat"]] },
  ];

  // Wrong pairs with a dedicated line (order does not matter).
  const SPECIFIC = [
    ["empreintes", "plaid"], ["echarpe", "plaid"], ["mocassins", "bottes"], ["four", "photos"],
    ["calendrier", "photos"], ["belote", "photos"], ["tricot", "bottes"], ["crochet", "cahier_gaston"],
    ["recette", "luzerne"], ["violette", "bottes"], ["plaquette", "echarpe"], ["appel", "mocassins"],
    ["page_veto", "contrat"], ["trousse", "carnet_veto"], ["lettre", "echarpe"], ["julien_toit", "crochet"],
    ["four", "calendrier"], ["plaid", "luzerne"], ["benjamin_nuit", "photos"], ["b_traces", "cahier_gaston"], ["collier", "plaquette"], ["mireille_nuit", "bottes"],
  ];
  const GENERIC_COUNT = 10;

  const key = (a, b) => [a, b].sort().join("+");
  const byPair = {};
  DEDUCTIONS.forEach((d) => d.pairs.forEach(([a, b]) => (byPair[key(a, b)] = d)));
  const specific = {};
  SPECIFIC.forEach(([a, b]) => (specific[key(a, b)] = `combo.${[a, b].sort().join("__")}`));

  CH.deductions = {
    LIST: DEDUCTIONS,
    get: (id) => DEDUCTIONS.find((d) => d.id === id),
    match: (a, b) => byPair[key(a, b)] || null,
    specificKey: (a, b) => specific[key(a, b)] || null,
    GENERIC_COUNT,
    forBoard: (board) => DEDUCTIONS.filter((d) => d.board === board).map((d) => d.id),
  };
})();

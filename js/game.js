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

// Game state, script runner and rules (deductions, boards, hints, acts).
(function () {
  const C = CH.config;
  const SAVE_VERSION = 1;

  const EGGS = [
    "plaidChambre", "sandales", "bouquet", "ambre", "bottesFleurs", "polaireTricot", "agnetha", "puits",
    "boue", "statique", "fiches", "ipv6", "yoga", "radio", "radioRetour", "chat", "boule", "jeudiDisco",
    "sandalesBoue", "plaidOdeur", "statiquePlaid", "carotte", "wifi", "verresVeto", "lunettesGerard",
    "activeDirectory", "chiffon", "lego",
  ];

  // Answer index for each blank, in locale option order.
  const BOARDS = {
    b1: { answers: { q1: 1, q2: 0, q3: 0, q4: 2, q5: 1, q6: 2 }, done: "board1Done", cut: "rev1" },
    b2: { answers: { q1: 2, q2: 0, q3: 2, q4: 1, q5: 2, q6: 1, q7: 2 }, done: "board2Done", cut: "finale", suspect: "q3" },
  };

  const CUTS = {
    clothTheft: [{ l: "cut.clothTheft" }, { flag: "clothStolen" }, { act: 1 }, { go: "cuisine" }, { l: "cut.intro" }, { egg: "activeDirectory" }],
    act2: [{ l: "cut.act2" }, { act: 2 }],
    clockReveal: [{ l: "cut.clockReveal" }],
    pregnancyReveal: [
      { l: "cut.preg.start" },
      { if: (s) => s.clues.tricot, then: [{ l: "cut.preg.tricot" }] },
      { if: (s) => s.clues.dispute, then: [{ l: "cut.preg.dispute" }] },
      { if: (s) => s.clues.trousse, then: [{ l: "cut.preg.trousse" }] },
      { if: (s) => s.clues.certificat, then: [{ l: "cut.preg.certificat" }] },
      { if: (s) => s.clues.luzerne, then: [{ l: "cut.preg.luzerne" }] },
      { if: (s) => s.clues.eau, then: [{ l: "cut.preg.eau" }] },
      { l: "cut.preg.end" },
    ],
    rev1: [{ go: "cuisine" }, { l: "board.b1.ok" }, { l: "cut.rev1" }, { act: 3 }, { fn: () => CH.ui.toast(CH.t("ui.new_place", { name: CH.t("scene.chemin.name") })) }],
    finale: [
      { l: "board.b2.ok" },
      { go: "chemin" },
      { l: "cut.finale.intro" },
      { bg: "loge" },
      { l: "cut.finale.loge" },
      { l: "cut.finale.confession" },
      { l: "cut.finale.thibault" },
      { act: 4 },
      { bg: "concours" },
      { l: "cut.epilogue" },
      { screen: "message" },
      { flag: "finished" },
      { screen: "bilan" },
      { bg: "teaser" },
      { l: "cut.teaser" },
      { screen: "end" },
    ],
  };

  let s = null;
  let busy = false;

  function fresh() {
    return {
      v: SAVE_VERSION, act: C.acts.prologue, scene: "chambre",
      flags: {}, clues: {}, clueOrder: [], deds: {}, dedOrder: [], items: {}, eggs: {},
      fresh: {}, seen: {}, hintLevels: {}, biscuits: 0, tries: { b1: 0, b2: 0 }, playMs: 0, genericIdx: 0,
    };
  }

  function save() {
    try {
      localStorage.setItem(C.saveKey, JSON.stringify(s));
    } catch (e) {
      /* Storage unavailable: the game still runs, only without resume. */
    }
  }

  function loadSaved() {
    try {
      const raw = localStorage.getItem(C.saveKey);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data && data.v === SAVE_VERSION ? data : null;
    } catch (e) {
      return null;
    }
  }

  function clearSave() {
    try {
      localStorage.removeItem(C.saveKey);
    } catch (e) {
      /* ignore */
    }
  }

  // ---------------------------------------------------------------- Mutations
  function addClue(id) {
    if (s.clues[id]) return;
    s.clues[id] = true;
    s.clueOrder.push(id);
    s.fresh[id] = true;
    CH.ui.toast(CH.t("ui.new_clue", { title: CH.t(`clue.${id}.title`) }));
    const parts = CH.clues.CONTRACT_PARTS;
    if (parts.includes(id) && parts.every((p) => s.clues[p])) addClue("contrat");
  }

  function addDed(id) {
    if (s.deds[id]) return false;
    s.deds[id] = true;
    s.dedOrder.push(id);
    s.fresh["d:" + id] = true;
    CH.ui.toast(CH.t("ui.new_ded", { title: CH.t(`ded.${id}.title`) }), "ded");
    return true;
  }

  function addItem(id) {
    if (s.items[id]) return;
    s.items[id] = true;
    CH.ui.toast(CH.t("ui.new_item", { name: CH.t(`item.${id}.name`) }));
  }

  function useItem(id) {
    if (!s.items[id]) return;
    delete s.items[id];
    CH.ui.toast(CH.t("ui.lost_item", { name: CH.t(`item.${id}.name`) }), "muted");
  }

  function setFlag(id) {
    if (s.flags[id]) return;
    s.flags[id] = true;
    if (id === "villageOpen") CH.ui.toast(CH.t("ui.new_place", { name: CH.t("scene.cafe.name") }));
  }

  function setAct(n) {
    if (s.act === n) return;
    s.act = n;
    CH.ui.actCard(n);
  }

  function goScene(id) {
    s.scene = id;
    CH.ui.setBackdrop(null);
  }

  // ---------------------------------------------------------------- Runner
  async function run(steps) {
    if (!steps) return;
    if (typeof steps === "function") steps = steps(s);
    for (const st of steps) await exec(st);
  }

  async function exec(st) {
    if (Array.isArray(st)) return run(st);
    if (st.l) for (const [who, text] of CH.i18n.lines(st.l)) await CH.ui.say(who, text);
    if (st.clue) addClue(st.clue);
    if (st.item) addItem(st.item);
    if (st.use) useItem(st.use);
    if (st.flag) setFlag(st.flag);
    if (st.egg) s.eggs[st.egg] = true;
    if (st.act !== undefined) setAct(st.act);
    if (st.go) {
      goScene(st.go);
      CH.ui.renderScene();
    }
    if (st.cut) await run(CUTS[st.cut]);
    if (st.if) await run(st.if(s) ? st.then : st.else);
    if (st.fn) await st.fn(s);
    if (st.bg !== undefined) CH.ui.setBackdrop(st.bg);
    if (st.screen) await CH.ui.screen(st.screen);
    save();
  }

  // Wraps any player action: blocks input, runs, checks progression, refreshes.
  async function action(fn) {
    if (busy) return;
    busy = true;
    CH.ui.setBusy(true);
    try {
      await fn();
      await progress();
    } finally {
      busy = false;
      CH.ui.setBusy(false);
      CH.ui.closeDialog();
      save();
      CH.ui.refresh();
    }
  }

  async function progress() {
    if (s.act === C.acts.disappearance && s.flags.cloth && s.clues.crochet) {
      await run(CUTS.act2);
      CH.ui.renderScene();
    }
    ["b1", "b2"].forEach((b) => {
      const key = "ready_" + b;
      if (boardReady(b) && !s.flags[key]) {
        s.flags[key] = true;
        CH.ui.toast(CH.t("ui.board_ready", { name: CH.t("ui.board_btn_" + b) }), "ded");
      }
    });
  }

  // ---------------------------------------------------------------- Interactions
  function fogged() {
    const sc = CH.scenes.get(s.scene);
    return sc && sc.outdoor && !s.flags.cloth;
  }

  function onHotspot(hs, mode) {
    return action(async () => {
      if (mode === "pro") {
        if (fogged()) return run([{ l: "ui.fogged" }]);
        s.seen["pro:" + s.scene + ":" + hs.id] = true;
        return run(hs.pro.steps);
      }
      s.seen["hs:" + s.scene + ":" + hs.id] = true;
      return run(typeof hs.look === "function" ? hs.look(s) : hs.look);
    });
  }

  function talk(id) {
    return action(async () => {
      const ch = CH.chars.get(id);
      for (;;) {
        const topics = ch.topics.filter((t) => !t.when || t.when(s));
        const opts = topics.map((t) => ({ id: t.id, label: CH.t(`chr.${id}.t.${t.id}`), seen: !!s.seen[`t:${id}:${t.id}`] }));
        opts.push({ id: "__show", label: CH.t("ui.talk_show"), kind: "show" });
        if (ch.pro) opts.push({ id: "__pro", label: CH.t("ui.pro"), kind: "pro" });
        opts.push({ id: "__bye", label: CH.t("ui.talk_bye"), kind: "bye" });
        const choice = await CH.ui.menu(id, opts);
        if (!choice || choice === "__bye") break;
        if (choice === "__show") {
          const card = await CH.ui.openNotebook({ pick: true });
          if (!card) continue;
          let steps = ch.show[card];
          if (typeof steps === "function") steps = steps(s);
          await run(steps || [{ l: `dlg.${id}.show_default` }]);
        } else if (choice === "__pro") {
          await run(fogged() ? [{ l: "ui.fogged" }] : ch.pro);
        } else {
          s.seen[`t:${id}:${choice}`] = true;
          await run(topics.find((t) => t.id === choice).steps);
        }
        save();
        CH.ui.refresh();
      }
    });
  }

  function charPro(id) {
    return action(async () => {
      if (fogged()) return run([{ l: "ui.fogged" }]);
      s.seen["pro:char:" + id] = true;
      return run(CH.chars.get(id).pro);
    });
  }

  function combine(a, b) {
    return action(async () => {
      const d = CH.deductions.match(a, b);
      if (d) {
        if (s.deds[d.id]) return run([{ l: "combo.already" }]);
        if (d.requires && !d.requires.every((r) => s.deds[r])) return run([{ l: d.failKey }]);
        addDed(d.id);
        CH.ui.refreshNotebook();
        await CH.ui.say("v.focus", CH.t(`ded.${d.id}.text`));
        if (d.cut) await run(CUTS[d.cut]);
        return;
      }
      const specific = CH.deductions.specificKey(a, b);
      const key = specific || `combo.generic.${s.genericIdx++ % CH.deductions.GENERIC_COUNT}`;
      return run([{ l: key }]);
    });
  }

  function boardReady(id) {
    if (id === "b1") return s.act === C.acts.leads && !s.flags.board1Done && !!s.deds.evasion && !!s.deds.gaston && !!s.clues.photos;
    if (id === "b2") return s.act === C.acts.crossCheck && !s.flags.board2Done && CH.deductions.forBoard("b2").every((d) => s.deds[d]);
    return false;
  }

  // answers: { q1: index|null, ... }. Returns "incomplete" | "near" | "far" | "ok".
  async function submitBoard(id, answers) {
    const def = BOARDS[id];
    const keys = Object.keys(def.answers);
    if (keys.some((k) => answers[k] === null || answers[k] === undefined)) return "incomplete";
    s.tries[id]++;
    const wrong = keys.filter((k) => answers[k] !== def.answers[k]).length;
    save();
    if (wrong === 0) {
      CH.ui.closeBoard();
      await action(async () => {
        setFlag(def.done);
        await run(CUTS[def.cut]);
      });
      return "ok";
    }
    if (def.suspect && answers[def.suspect] !== def.answers[def.suspect]) {
      const key = `board.${id}.wrong.${answers[def.suspect]}`;
      if (CH.i18n.has(key)) await action(() => run([{ l: key }]));
    }
    return wrong <= C.board.nearMissMax ? "near" : "far";
  }

  // ---------------------------------------------------------------- Biscotte
  function sceneName(id) {
    return CH.t(`scene.${id}.name`);
  }

  function hintText(target, level) {
    switch (target.kind) {
      case "hs": {
        const p = { place: sceneName(target.scene), thing: CH.t(`hs.${target.scene}.${target.id}.label`) };
        if (level === 2) return CH.t("hint.find.2", p);
        return CH.t(target.pro ? "hint.pro.3" : "hint.find.3", p);
      }
      case "char": {
        const pres = CH.chars.get(target.id).presence(s);
        return CH.t(`hint.char.${level}`, { name: CH.t(`chr.${target.id}.name`), place: pres ? sceneName(pres.scene) : "" });
      }
      case "ded": {
        if (!s.clues[target.a] || !s.clues[target.b]) return CH.t("hint.missing");
        return CH.t(`hint.ded.${level}`, { a: CH.t(`clue.${target.a}.title`), b: CH.t(`clue.${target.b}.title`) });
      }
      case "board":
        return CH.t(`hint.board.${level}`);
      default:
        return CH.t(`hint.biscotte.${level}`);
    }
  }

  function biscotte() {
    return action(async () => {
      const opts = [];
      if (s.act >= C.acts.disappearance && !s.flags.cloth) opts.push({ id: "cloth", label: CH.t("ui.bis_cloth") });
      opts.push({ id: "hint", label: CH.t("ui.bis_hint"), kind: "hint" });
      opts.push({ id: "pet", label: CH.t("ui.bis_pet") });
      opts.push({ id: "close", label: CH.t("ui.bis_close"), kind: "bye" });
      const choice = await CH.ui.menu("biscotte", opts, CH.t("ui.bis_count", { n: s.biscuits }));
      if (choice === "cloth") {
        if (s.items.petale) {
          await run([{ l: "bis.cloth.trade" }, { use: "petale" }, { flag: "cloth" }, { egg: "chiffon" }]);
        } else {
          await run([{ l: "bis.cloth.nopetal" }]);
        }
      } else if (choice === "pet") {
        await run([{ l: `bis.pet.${Math.floor(Math.random() * 4)}` }]);
      } else if (choice === "hint") {
        await giveHint();
      }
    });
  }

  async function giveHint() {
    const goal = CH.goals.current(s);
    if (!goal) return run([{ l: "hint.none" }]);
    const level = s.hintLevels[goal.id] || 0;
    const target = goal.target(s);
    if (level >= C.hint.maxLevel) {
      CH.ui.highlight(target);
      return run([{ l: "hint.maxed" }]);
    }
    const next = level + 1;
    s.hintLevels[goal.id] = next;
    s.biscuits += C.hint.cost;
    await run([{ l: "bis.eat" }]);
    if (next === 1) {
      await run([{ l: `hint.${goal.id}` }]);
    } else {
      await CH.ui.say("b", hintText(target, next));
      CH.ui.highlight(target);
    }
  }

  // ---------------------------------------------------------------- Lifecycle
  function start(resume) {
    s = (resume && loadSaved()) || fresh();
    if (s.act === C.acts.ending && !s.flags.finished) {
      // A save made mid-ending resumes just before the final board.
      s.act = C.acts.crossCheck;
      delete s.flags.board2Done;
    }
    save();
    CH.ui.enterGame();
  }

  function tick(ms) {
    if (s && !s.flags.finished) s.playMs += ms;
  }

  CH.game = {
    get state() {
      return s;
    },
    get busy() {
      return busy;
    },
    EGGS,
    BOARDS,
    hasSave: () => !!loadSaved(),
    start,
    save,
    tick,
    run: (steps) => action(() => run(steps)),
    onHotspot,
    talk,
    charPro,
    combine,
    biscotte,
    boardReady,
    submitBoard,
  };
})();

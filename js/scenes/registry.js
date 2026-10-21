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

// Scene registry. A scene provides:
//   id, outdoor (fogged glasses without the cloth), unlock(state),
//   draw(state) -> { back, front, anim } SVG strings in a 1600x900 frame,
//   hotspots: [{ id, x, y, w, h, when?, look, pro? }]
// Hotspot text keys follow hs.<scene>.<hotspot>.label by default.
(function () {
  const scenes = {};
  const order = [];

  function register(def) {
    scenes[def.id] = def;
    if (def.nav) order.push(def.id);
  }

  // Script helpers shared by scene and character data.
  const L = (key) => ({ l: key });
  const has = (s, id) => !!s.clues[id];
  const flag = (s, id) => !!s.flags[id];
  const item = (s, id) => !!s.items[id];

  CH.scenes = { register, get: (id) => scenes[id], order, all: scenes };
  CH.S = { L, has, flag, item };
})();

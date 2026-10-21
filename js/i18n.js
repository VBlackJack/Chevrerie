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

// Minimal i18n: dotted keys resolved against CH.locales[CH.config.locale].
// A value can be a string or an array of [speaker, text] dialogue lines.
(function () {
  const missing = new Set();

  function dict() {
    return (CH.locales && CH.locales[CH.config.locale]) || {};
  }

  function raw(key) {
    const value = dict()[key];
    if (value === undefined && !missing.has(key)) {
      missing.add(key);
      console.warn("[i18n] missing key:", key);
    }
    return value;
  }

  function t(key, params) {
    const value = raw(key);
    if (typeof value !== "string") return key;
    if (!params) return value;
    return value.replace(/\{(\w+)\}/g, (m, name) => (name in params ? String(params[name]) : m));
  }

  function lines(key) {
    const value = raw(key);
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return [["n", value]];
    return [["n", key]];
  }

  function list(key) {
    const value = raw(key);
    return Array.isArray(value) ? value.map(String) : [];
  }

  function has(key) {
    return dict()[key] !== undefined;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Escapes, then renders *emphasis* and line breaks.
  function rich(text) {
    return escapeHtml(text)
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  CH.i18n = { t, lines, list, has, rich, escapeHtml };
  CH.t = t;
})();

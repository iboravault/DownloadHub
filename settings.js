/**
 * settings.js — gestion des paramètres utilisateur (persistés en LocalStorage)
 */
const Settings = (() => {
  const KEY = "gamevault.settings";
  const DEFAULTS = {
    theme: "dark",
    animations: true,
    cardSize: "medium",      // small | medium | large
    columns: "auto",         // auto | 3 | 4 | 5 | 6
    pinned: []
  };

  let state = load();

  function load() {
    try {
      return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(KEY)) || {}) };
    } catch {
      return { ...DEFAULTS };
    }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
    apply();
  }

  function get(key) {
    return state[key];
  }

  function set(key, value) {
    state[key] = value;
    save();
  }

  function togglePinned(category) {
    const idx = state.pinned.indexOf(category);
    if (idx >= 0) state.pinned.splice(idx, 1);
    else state.pinned.push(category);
    save();
  }

  function isPinned(category) {
    return state.pinned.includes(category);
  }

  function reset() {
    state = { ...DEFAULTS };
    save();
  }

  function apply() {
    const root = document.documentElement;
    root.dataset.theme = state.theme;
    root.dataset.animations = state.animations ? "on" : "off";
    root.dataset.cardSize = state.cardSize;
    root.dataset.columns = state.columns;
  }

  apply();

  return { get, set, save, reset, togglePinned, isPinned, DEFAULTS };
})();

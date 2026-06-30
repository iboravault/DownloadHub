/**
 * favorites.js — gestion des favoris en LocalStorage
 */
const Favorites = (() => {
  const KEY = "gamevault.favorites";

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  }

  function isFav(id) {
    return getAll().includes(id);
  }

  function toggle(id) {
    const list = getAll();
    const idx = list.indexOf(id);
    if (idx >= 0) {
      list.splice(idx, 1);
      localStorage.setItem(KEY, JSON.stringify(list));
      return false;
    } else {
      list.push(id);
      localStorage.setItem(KEY, JSON.stringify(list));
      return true;
    }
  }

  function count() {
    return getAll().length;
  }

  return { getAll, isFav, toggle, count };
})();

/**
 * history.js (intégré ici) — historique des jeux consultés
 */
const ViewHistory = (() => {
  const KEY = "gamevault.history";
  const MAX = 20;

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  }

  function push(id) {
    let list = getAll().filter(x => x !== id);
    list.unshift(id);
    if (list.length > MAX) list = list.slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  return { getAll, push, clear };
})();

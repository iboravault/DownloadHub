/**
 * router.js — routage SPA basé sur l'History API
 * Routes supportées :
 *   #/home
 *   #/solo
 *   #/solo/:categorie
 *   #/multi
 *   #/multi/:categorie
 *   #/new
 *   #/favorites
 *   #/credits
 *   #/settings
 *   #/game/:id
 */
const Router = (() => {
  let onChange = () => {};

  function parse() {
    const hash = location.hash.replace(/^#\/?/, "");
    const parts = hash.split("/").filter(Boolean);
    if (parts.length === 0) return { route: "home", params: [] };
    return { route: parts[0], params: parts.slice(1) };
  }

  function navigate(path, { replace = false } = {}) {
    const url = `#/${path}`;
    if (replace) history.replaceState({}, "", url);
    else history.pushState({}, "", url);
    handle();
  }

  function handle() {
    const parsed = parse();
    onChange(parsed);
  }

  function init(callback) {
    onChange = callback;
    window.addEventListener("hashchange", handle);
    handle();
  }

  return { init, navigate, parse };
})();

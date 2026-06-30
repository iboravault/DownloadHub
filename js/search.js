/**
 * search.js — moteur de recherche instantanée
 */
const Search = (() => {
  function run(query, source = GAMES) {
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter(g => {
      const haystack = [
        g.title, g.mode, g.category, ...(g.tags || [])
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }
  return { run };
})();

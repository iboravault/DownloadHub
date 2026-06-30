/**
 * filters.js — tri et filtrage des listes de jeux
 */
const Filters = (() => {

  function sortGames(list, mode) {
    const arr = [...list];
    switch (mode) {
      case "recent":
        return arr.sort((a, b) => new Date(b.added) - new Date(a.added));
      case "old":
        return arr.sort((a, b) => new Date(a.added) - new Date(b.added));
      case "az":
        return arr.sort((a, b) => a.title.localeCompare(b.title, "fr"));
      case "za":
        return arr.sort((a, b) => b.title.localeCompare(a.title, "fr"));
      default:
        return arr;
    }
  }

  function byMode(list, mode) {
    if (!mode || mode === "all") return list;
    return list.filter(g => g.mode === mode);
  }

  function byCategory(list, category) {
    if (!category) return list;
    return list.filter(g => g.category === category);
  }

  return { sortGames, byMode, byCategory };
})();

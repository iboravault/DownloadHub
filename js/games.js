/**
 * games.js
 * ---------------------------------------------------------------------------
 * Base de données du catalogue. Chaque jeu est un objet simple.
 *
 * Pour ajouter un jeu : copiez/collez un objet dans le tableau GAMES
 * ci-dessous et remplissez les champs. Aucune autre manipulation requise.
 *
 * Champs :
 *  id        : identifiant unique (string)
 *  title     : titre du jeu
 *  mode      : "solo" | "multi"
 *  category  : sous-catégorie principale (ex: "Horreur", "RPG", "PvP"…)
 *  tags      : tableau de tags additionnels (optionnel)
 *  image     : URL de la jaquette / capture
 *  added     : date ISO d'ajout "AAAA-MM-JJTHH:MM:SS"
 *  download  : URL du fichier ZIP de téléchargement
 *  fix       : URL du correctif (multijoueur uniquement, optionnel)
 *  fixType   : "download" | "url"
 *  pinned    : true pour épingler la catégorie (optionnel)
 * ---------------------------------------------------------------------------
 */

const GAMES = [
  {
    id: "phasmophobia",
    title: "Phasmophobia",
    mode: "multi",
    category: "Coop",
    tags: ["Survie", "Horreur"],
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/739630/c227a2855aba60f3657bc0c3a46515b8c41fb2b6/header.jpg?t=1782311537",
    added: "2026-06-30T20:22:00",
    download: "https://iboragit.github.io/DL/dl1/",
    fix: "https://gofile.io/d/Uv9Iyg",
    fixType: "url"
  },
  {
    id: "lethal-company",
    title: "Lethal Company",
    mode: "multi",
    category: "Extraction",
    tags: ["Coop", "Horreur"],
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1966720/header.jpg?t=1775380053",
    added: "2026-06-30T20:35:00",
    download: "https://iboragit.github.io/DL/dl2/",
    fix: "https://gofile.io/d/GbTlMp",
    fixType: "url"
  },
  {
    id: "labyrinthine",
    title: "Labyrinthine",
    mode: "multi",
    category: "Coop",
    tags: ["Horreur", "Puzzle"],
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1302240/header.jpg?t=1764093777",
    added: "2026-06-30T20:38:00",
    download: "https://iboragit.github.io/DL/dl3/",
    fix: "https://gofile.io/d/MzWiYD",
    fixType: "url"
  },
  {
    id: "hospital-666",
    title: "Hospital 666",
    mode: "multi",
    category: "Coop",
    tags: ["Horreur", "Survie", "Puzzle"],
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2774380/header.jpg?t=1744499333",
    added: "2026-06-30T20:40:00",
    download: "https://iboragit.github.io/DL/dl4/",
    fix: "https://drive.google.com/file/d/1jWaOIddJf0m7m3XyB5R9zaH2nu-WLRRd/view",
    fixType: "url"
  },
  {
    id: "escape-the-backrooms",
    title: "Escape the Backrooms",
    mode: "multi",
    category: "Coop",
    tags: ["Horreur", "Survie", "Puzzle"],
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1943950/f3dac53a5d3e68a4bb67786872b4693260049b26/header.jpg?t=1782122172",
    added: "2026-06-30T20:43:00",
    download: "https://iboragit.github.io/DL/dl5/",
    fix: "https://gofile.io/d/I9CL7Z",
    fixType: "url"
  }
];

/** Listes de référence des sous-catégories proposées (pour l'affichage des grilles). */
const SOLO_SUBCATEGORIES = [
  "Horreur","Survie","Aventure","Action","FPS","TPS","Plateforme","Puzzle","Gestion",
  "Simulation","Construction","Monde Ouvert","RPG","JRPG","Hack & Slash","RogueLike",
  "RogueLite","Metroidvania","Visual Novel","Narratif","Sandbox","Course","Sport",
  "Arcade","Combat","Stratégie","RTS","Tour par tour","Infiltration","Point & Click",
  "Escape Game","Relaxant","Indépendant","Coop locale"
];

const MULTI_SUBCATEGORIES = [
  "Coop","PvP","MMORPG","Extraction","Battle Royale","Party Game","Asymétrique",
  "Survie","Horreur","Monde Ouvert","FPS","TPS","Stratégie","RTS","Sport","Course",
  "Combat","Coop locale"
];

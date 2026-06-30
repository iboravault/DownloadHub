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
    fixType: "download"
  },
  {
    id: "ember-tactics",
    title: "Ember Tactics",
    mode: "solo",
    category: "Stratégie",
    tags: ["Tour par tour"],
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-29T18:05:00",
    download: "https://example.com/downloads/ember-tactics.zip",
    fixType: "download"
  },
  {
    id: "starforge-online",
    title: "Starforge Online",
    mode: "multi",
    category: "MMORPG",
    tags: ["Monde Ouvert", "PvP"],
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-29T09:15:00",
    download: "https://example.com/downloads/starforge-online.zip",
    fix: "https://example.com/fix/starforge-online",
    fixType: "url"
  },
  {
    id: "neon-drift",
    title: "Neon Drift",
    mode: "solo",
    category: "Course",
    tags: ["Arcade"],
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-28T22:00:00",
    download: "https://example.com/downloads/neon-drift.zip",
    fixType: "download"
  },
  {
    id: "verdant-ruins",
    title: "Verdant Ruins",
    mode: "solo",
    category: "Aventure",
    tags: ["Monde Ouvert", "Narratif"],
    image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-28T14:30:00",
    download: "https://example.com/downloads/verdant-ruins.zip",
    fixType: "download"
  },
  {
    id: "extraction-zero",
    title: "Extraction Zero",
    mode: "multi",
    category: "Extraction",
    tags: ["FPS", "PvP"],
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-27T20:10:00",
    download: "https://example.com/downloads/extraction-zero.zip",
    fix: "https://example.com/fix/extraction-zero.zip",
    fixType: "download"
  },
  {
    id: "pixel-dungeon-x",
    title: "Pixel Dungeon X",
    mode: "solo",
    category: "RogueLike",
    tags: ["Indépendant", "Difficile"],
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-26T11:00:00",
    download: "https://example.com/downloads/pixel-dungeon-x.zip",
    fixType: "download"
  },
  {
    id: "party-chaos",
    title: "Party Chaos",
    mode: "multi",
    category: "Party Game",
    tags: ["Coop locale", "Asymétrique"],
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-25T19:45:00",
    download: "https://example.com/downloads/party-chaos.zip",
    fix: "https://example.com/fix/party-chaos",
    fixType: "url"
  },
  {
    id: "ashen-vow",
    title: "Ashen Vow",
    mode: "solo",
    category: "RPG",
    tags: ["Hack & Slash", "Dark Fantasy"],
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-24T08:20:00",
    download: "https://example.com/downloads/ashen-vow.zip",
    fixType: "download"
  },
  {
    id: "battlegrounds-90",
    title: "Battlegrounds 90",
    mode: "multi",
    category: "Battle Royale",
    tags: ["FPS", "Survie"],
    image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-23T17:00:00",
    download: "https://example.com/downloads/battlegrounds-90.zip",
    fix: "https://example.com/fix/battlegrounds-90.zip",
    fixType: "download"
  },
  {
    id: "quietfield",
    title: "Quietfield",
    mode: "solo",
    category: "Relaxant",
    tags: ["Simulation", "Gestion"],
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-22T13:40:00",
    download: "https://example.com/downloads/quietfield.zip",
    fixType: "download"
  },
  {
    id: "metro-shade",
    title: "Metro Shade",
    mode: "solo",
    category: "Infiltration",
    tags: ["Narratif", "TPS"],
    image: "https://images.unsplash.com/photo-1547700055-b61cacebece9?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-20T22:30:00",
    download: "https://example.com/downloads/metro-shade.zip",
    fixType: "download"
  },
  {
    id: "coop-castaways",
    title: "Coop Castaways",
    mode: "multi",
    category: "Coop",
    tags: ["Survie", "Construction"],
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-18T10:15:00",
    download: "https://example.com/downloads/coop-castaways.zip",
    fix: "https://example.com/fix/coop-castaways",
    fixType: "url"
  },
  {
    id: "glass-spire",
    title: "Glass Spire",
    mode: "solo",
    category: "Metroidvania",
    tags: ["Plateforme", "Puzzle"],
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-15T19:00:00",
    download: "https://example.com/downloads/glass-spire.zip",
    fixType: "download"
  },
  {
    id: "harbor-siege",
    title: "Harbor Siege",
    mode: "multi",
    category: "RTS",
    tags: ["Stratégie", "PvP"],
    image: "https://images.unsplash.com/photo-1551817958-d9d86fb29431?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-10T16:25:00",
    download: "https://example.com/downloads/harbor-siege.zip",
    fix: "https://example.com/fix/harbor-siege.zip",
    fixType: "download"
  },
  {
    id: "wandering-ink",
    title: "Wandering Ink",
    mode: "solo",
    category: "Visual Novel",
    tags: ["Narratif", "Point & Click"],
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&auto=format&fit=crop",
    added: "2026-06-05T09:50:00",
    download: "https://example.com/downloads/wandering-ink.zip",
    fixType: "download"
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

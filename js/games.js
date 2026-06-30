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
    id: "verdant-ruins",
    title: "Verdant Ruins",
    mode: "solo",
    category: "Aventure",
    tags: ["Monde Ouvert", "Narratif"],
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1943950/f3dac53a5d3e68a4bb67786872b4693260049b26/header.jpg?t=1782122172",
    added: "2026-06-30T20:43:00",
    download: "https://iboragit.github.io/DL/dl5/",
    fix: "https://gofile.io/d/I9CL7Z",
    fixType: "url"
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

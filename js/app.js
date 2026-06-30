/**
 * app.js — point d'entrée de l'application, rendu des vues et interactions
 */
(() => {
  "use strict";

  const viewRoot = document.getElementById("viewRoot");
  const pageHeader = document.getElementById("pageHeader");
  const filterBar = document.getElementById("filterBar");
  const breadcrumb = document.getElementById("breadcrumb");
  const cardTemplate = document.getElementById("cardTemplate");
  const sentinel = document.getElementById("sentinel");

  const PAGE_SIZE = 12;
  let currentList = [];      // liste complète filtrée/triée pour la vue active
  let renderedCount = 0;
  let currentRoute = { route: "home", params: [] };
  let currentSort = "recent";
  let currentModeFilter = "all";
  let searchQuery = "";

  /* ---------------------------------------------------------- helpers UI */

  function setPageHeader(title, subtitle) {
    pageHeader.innerHTML = `
      <h1 class="page-title">${title}</h1>
      ${subtitle ? `<p class="page-subtitle">${subtitle}</p>` : ""}
    `;
  }

  function setBreadcrumb(items) {
    if (!items || !items.length) { breadcrumb.hidden = true; breadcrumb.innerHTML = ""; return; }
    breadcrumb.hidden = false;
    breadcrumb.innerHTML = items.map((it, i) => {
      const isLast = i === items.length - 1;
      return isLast
        ? `<span class="crumb crumb-current">${it.label}</span>`
        : `<a href="#/${it.path}" class="crumb">${it.label}</a><span class="crumb-sep">/</span>`;
    }).join("");
  }

  function showFilterBar(show) {
    filterBar.hidden = !show;
  }

  function renderFilterBar() {
    filterBar.innerHTML = `
      <div class="filter-group" role="group" aria-label="Trier">
        <button class="chip ${currentSort === "recent" ? "active" : ""}" data-sort="recent">Plus récent</button>
        <button class="chip ${currentSort === "old" ? "active" : ""}" data-sort="old">Plus ancien</button>
        <button class="chip ${currentSort === "az" ? "active" : ""}" data-sort="az">A → Z</button>
        <button class="chip ${currentSort === "za" ? "active" : ""}" data-sort="za">Z → A</button>
      </div>
      <div class="filter-group" role="group" aria-label="Mode">
        <button class="chip ${currentModeFilter === "all" ? "active" : ""}" data-mode="all">Tous</button>
        <button class="chip ${currentModeFilter === "solo" ? "active" : ""}" data-mode="solo">Solo</button>
        <button class="chip ${currentModeFilter === "multi" ? "active" : ""}" data-mode="multi">Multijoueur</button>
      </div>
    `;
    filterBar.querySelectorAll("[data-sort]").forEach(btn => {
      btn.addEventListener("click", () => { currentSort = btn.dataset.sort; refreshListing(); });
    });
    filterBar.querySelectorAll("[data-mode]").forEach(btn => {
      btn.addEventListener("click", () => { currentModeFilter = btn.dataset.mode; refreshListing(); });
    });
  }

  /* ---------------------------------------------------------- skeletons */

  function renderSkeletons(count = 8) {
    viewRoot.innerHTML = `<div class="game-grid">${
      Array.from({ length: count }).map(() => `
        <div class="game-card skeleton-card">
          <div class="game-card-media"><div class="game-card-skel"></div></div>
          <div class="game-card-body">
            <div class="skel-line w70"></div>
            <div class="skel-line w40"></div>
          </div>
        </div>`).join("")
    }</div>`;
  }

  /* ---------------------------------------------------------- card render */

  function buildCard(game) {
    const node = cardTemplate.content.firstElementChild.cloneNode(true);
    const img = node.querySelector(".game-card-img");
    img.src = game.image;
    img.alt = game.title;
    node.querySelector(".game-card-title").textContent = game.title;
    node.querySelector(".game-card-time").textContent = Utils.timeSince(game.added);
    const badgeMode = node.querySelector(".badge-mode");
    badgeMode.textContent = game.mode === "solo" ? "Solo" : "Multi";
    badgeMode.classList.add(game.mode === "solo" ? "mode-solo" : "mode-multi");

    if (Utils.isNew(game.added)) {
      node.querySelector(".badge-new").hidden = false;
    }

    const favBtn = node.querySelector(".fav-btn");
    if (Favorites.isFav(game.id)) favBtn.classList.add("active");
    favBtn.setAttribute("aria-pressed", Favorites.isFav(game.id) ? "true" : "false");
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const nowFav = Favorites.toggle(game.id);
      favBtn.classList.toggle("active", nowFav);
      favBtn.setAttribute("aria-pressed", nowFav ? "true" : "false");
      favBtn.classList.add("pop");
      setTimeout(() => favBtn.classList.remove("pop"), 300);
      Utils.toast(nowFav ? `${game.title} ajouté aux favoris` : `${game.title} retiré des favoris`, "success");
      const sidebarCount = document.getElementById("sidebarGameCount");
      if (currentRoute.route === "favorites") refreshListing();
    });

    img.addEventListener("load", () => node.querySelector(".game-card-skel").remove());
    node.addEventListener("click", () => openDetail(game));
    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetail(game); }
    });

    return node;
  }

  function appendCards(list) {
    const grid = viewRoot.querySelector(".game-grid") || (() => {
      const g = document.createElement("div");
      g.className = "game-grid";
      viewRoot.innerHTML = "";
      viewRoot.appendChild(g);
      return g;
    })();
    const frag = document.createDocumentFragment();
    list.forEach((game, i) => {
      const card = buildCard(game);
      card.style.setProperty("--stagger", `${(i % PAGE_SIZE) * 40}ms`);
      card.classList.add("card-enter");
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  function loadMore() {
    if (renderedCount >= currentList.length) return;
    const next = currentList.slice(renderedCount, renderedCount + PAGE_SIZE);
    appendCards(next);
    renderedCount += next.length;
  }

  function renderEmptyState(message, hint) {
    viewRoot.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" width="56" height="56"><path d="M4 7h16v12H4z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 7l8-4 8 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 12h6M9 15h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <h3>${message}</h3>
        <p>${hint || ""}</p>
      </div>`;
  }

  function setListing(list, { skeleton = true } = {}) {
    currentList = list;
    renderedCount = 0;
    if (!list.length) { renderEmptyState("Aucun jeu trouvé", "Essayez une autre recherche ou un autre filtre."); return; }
    if (skeleton) {
      renderSkeletons(Math.min(8, list.length));
      setTimeout(() => { viewRoot.innerHTML = ""; loadMore(); }, 260);
    } else {
      viewRoot.innerHTML = "";
      loadMore();
    }
  }

  function refreshListing() {
    renderFilterBar();
    let base = baseListForRoute();
    base = Filters.byMode(base, currentModeFilter);
    base = Filters.sortGames(base, currentSort);
    setListing(base, { skeleton: false });
  }

  function baseListForRoute() {
    const { route, params } = currentRoute;
    if (route === "home") return Filters.sortGames(GAMES, "recent");
    if (route === "new") return GAMES;
    if (route === "favorites") return GAMES.filter(g => Favorites.isFav(g.id));
    if (route === "solo") return params[0] ? GAMES.filter(g => g.mode === "solo" && g.category === decodeURIComponent(params[0])) : [];
    if (route === "multi") return params[0] ? GAMES.filter(g => g.mode === "multi" && g.category === decodeURIComponent(params[0])) : [];
    return GAMES;
  }

  /* ---------------------------------------------------------- subcategory grid */

  function categoryCount(mode, category) {
    return GAMES.filter(g => g.mode === mode && g.category === category).length;
  }

  function renderSubcategoryGrid(mode, list) {
    showFilterBar(false);
    const pinned = list.filter(c => Settings.isPinned(c));
    const rest = list.filter(c => !Settings.isPinned(c));
    const ordered = [...pinned, ...rest];

    viewRoot.innerHTML = `<div class="category-grid">
      ${ordered.map((cat, i) => {
        const count = categoryCount(mode, cat);
        const isPinned = Settings.isPinned(cat);
        return `
        <button class="category-card ${count === 0 ? "is-empty" : ""}" data-cat="${Utils.escapeHtml(cat)}" style="--stagger:${i * 25}ms">
          <span class="category-pin ${isPinned ? "active" : ""}" data-pin="${Utils.escapeHtml(cat)}" title="Épingler la catégorie" aria-label="Épingler ${Utils.escapeHtml(cat)}">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 2.5 14.5 8.5 21 9.3 16.2 13.5 17.6 20 12 16.6 6.4 20 7.8 13.5 3 9.3 9.5 8.5 12 2.5Z"/></svg>
          </span>
          <span class="category-name">${Utils.escapeHtml(cat)}</span>
          <span class="category-count">${count} jeu${count !== 1 ? "x" : ""}</span>
        </button>`;
      }).join("")}
    </div>`;

    viewRoot.querySelectorAll(".category-card").forEach(btn => {
      btn.addEventListener("click", (e) => {
        if (e.target.closest("[data-pin]")) return;
        Router.navigate(`${mode}/${encodeURIComponent(btn.dataset.cat)}`);
      });
    });
    viewRoot.querySelectorAll("[data-pin]").forEach(pin => {
      pin.addEventListener("click", (e) => {
        e.stopPropagation();
        Settings.togglePinned(pin.dataset.pin);
        renderSubcategoryGrid(mode, list);
      });
    });
  }

  /* ---------------------------------------------------------- credits */

  function renderCredits() {
    showFilterBar(false);
    viewRoot.innerHTML = `
      <div class="credits-card">
        <div class="credits-avatar">
          <img src="https://i.pinimg.com/736x/eb/32/c1/eb32c1c552248b1f61e51b71ddb12d41.jpg" alt="Photo de profil">
        </div>
        <h2 class="credits-name">ibora</h2>
        <p class="credits-desc">Créateur et mainteneur de GameVault. Passionné de jeux — ce catalogue rassemble mes crack et mes coups de cœur.</p>
        <div class="credits-links">
          <a class="social-btn" href="https://github.com/iboravault" target="_blank" rel="noopener" aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.4 9.4 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>
            GitHub
          </a>
          <a class="social-btn" href="https://discord.gg/neYnC4nayV" target="_blank" rel="noopener" aria-label="Discord">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M19.5 5.5A17 17 0 0 0 15.3 4l-.2.4a13 13 0 0 1 3.7 1.4 14.5 14.5 0 0 0-13.6 0A13 13 0 0 1 8.9 4.4L8.7 4a17 17 0 0 0-4.2 1.5C2 9 1.4 12.4 1.7 15.7a17 17 0 0 0 5.1 2.6l.6-1a10.7 10.7 0 0 1-1.7-.8l.4-.3a12.3 12.3 0 0 0 10 0l.4.3c-.5.3-1.1.6-1.7.8l.6 1a17 17 0 0 0 5.1-2.6c.4-3.6-.5-7-2.9-10.2ZM9.3 13.8c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8c.9 0 1.7.8 1.6 1.8 0 1-.7 1.8-1.6 1.8Zm5.4 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8c.9 0 1.6.8 1.6 1.8s-.7 1.8-1.6 1.8Z"/></svg>
            Discord
          </a>
          <a class="social-btn" href="https://www.youtube.com/channel/UCtQ143cfmdBKJgwSEtpxFtg" target="_blank" rel="noopener" aria-label="YouTube">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.8 4 12 4 12 4h0s-3.8 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.7v1.6c0 1.7.2 3.5.2 3.5s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.7.2 7.4.2 7.4.2s3.8 0 6.7-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.5v-1.6c0-1.7-.2-3.5-.2-3.5ZM9.9 14.6V8.9l5.4 2.9-5.4 2.8Z"/></svg>
            YouTube
          </a>
        </div>
      </div>`;
  }

  /* ---------------------------------------------------------- settings page */

  function renderSettings() {
    showFilterBar(false);
    const s = {
      theme: Settings.get("theme"),
      animations: Settings.get("animations"),
      cardSize: Settings.get("cardSize"),
      columns: Settings.get("columns")
    };
    viewRoot.innerHTML = `
      <div class="settings-grid">
        <section class="settings-card">
          <h3>Apparence</h3>
          <label class="settings-row">
            <span>Thème</span>
            <select id="setTheme">
              <option value="dark" ${s.theme === "dark" ? "selected" : ""}>Sombre</option>
              <option value="midnight" ${s.theme === "midnight" ? "selected" : ""}>Minuit</option>
              <option value="contrast" ${s.theme === "contrast" ? "selected" : ""}>Contraste élevé</option>
            </select>
          </label>
          <label class="settings-row">
            <span>Animations</span>
            <button class="toggle ${s.animations ? "on" : ""}" id="setAnim" role="switch" aria-checked="${s.animations}"></button>
          </label>
        </section>

        <section class="settings-card">
          <h3>Affichage des cartes</h3>
          <label class="settings-row">
            <span>Taille des cartes</span>
            <select id="setSize">
              <option value="small" ${s.cardSize === "small" ? "selected" : ""}>Petite</option>
              <option value="medium" ${s.cardSize === "medium" ? "selected" : ""}>Moyenne</option>
              <option value="large" ${s.cardSize === "large" ? "selected" : ""}>Grande</option>
            </select>
          </label>
          <label class="settings-row">
            <span>Cartes par ligne</span>
            <select id="setCols">
              <option value="auto" ${s.columns === "auto" ? "selected" : ""}>Automatique</option>
              <option value="3" ${s.columns === "3" ? "selected" : ""}>3</option>
              <option value="4" ${s.columns === "4" ? "selected" : ""}>4</option>
              <option value="5" ${s.columns === "5" ? "selected" : ""}>5</option>
              <option value="6" ${s.columns === "6" ? "selected" : ""}>6</option>
            </select>
          </label>
        </section>

        <section class="settings-card">
          <h3>Statistiques</h3>
          <div class="stat-row"><span>Total des jeux</span><strong>${GAMES.length}</strong></div>
          <div class="stat-row"><span>Jeux solo</span><strong>${GAMES.filter(g=>g.mode==="solo").length}</strong></div>
          <div class="stat-row"><span>Jeux multijoueur</span><strong>${GAMES.filter(g=>g.mode==="multi").length}</strong></div>
          <div class="stat-row"><span>Favoris</span><strong>${Favorites.count()}</strong></div>
        </section>

        <section class="settings-card">
          <h3>Réinitialisation</h3>
          <p class="settings-hint">Restaure le thème, les animations et l'affichage par défaut.</p>
          <button class="btn-danger" id="resetSettings">Réinitialiser les paramètres</button>
        </section>
      </div>`;

    document.getElementById("setTheme").addEventListener("change", (e) => Settings.set("theme", e.target.value));
    const animBtn = document.getElementById("setAnim");
    animBtn.addEventListener("click", () => {
      const v = !Settings.get("animations");
      Settings.set("animations", v);
      animBtn.classList.toggle("on", v);
      animBtn.setAttribute("aria-checked", v);
    });
    document.getElementById("setSize").addEventListener("change", (e) => Settings.set("cardSize", e.target.value));
    document.getElementById("setCols").addEventListener("change", (e) => Settings.set("columns", e.target.value));
    document.getElementById("resetSettings").addEventListener("click", () => {
      Settings.reset();
      Utils.toast("Paramètres réinitialisés", "success");
      renderSettings();
    });
  }

  /* ---------------------------------------------------------- detail panel */

  const detailOverlay = document.getElementById("detailOverlay");
  const detailPanel = document.getElementById("detailPanel");
  const detailContent = document.getElementById("detailContent");
  const detailClose = document.getElementById("detailClose");

  function openDetail(game) {
    ViewHistory.push(game.id);
    detailContent.innerHTML = `
      <div class="detail-media">
        <img src="${game.image}" alt="${Utils.escapeHtml(game.title)}" id="detailImg">
        <button class="detail-expand" id="detailExpand" aria-label="Agrandir l'image">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M9 3H3v6M21 9V3h-6M3 15v6h6M15 21h6v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="detail-body">
        <div class="detail-badges">
          <span class="badge badge-mode ${game.mode === "solo" ? "mode-solo" : "mode-multi"}">${game.mode === "solo" ? "Solo" : "Multijoueur"}</span>
          <span class="badge badge-cat">${Utils.escapeHtml(game.category)}</span>
        </div>
        <h2 class="detail-title">${Utils.escapeHtml(game.title)}</h2>
        <div class="detail-meta">
          <div><span>Ajouté le</span><strong>${Utils.formatFullDate(game.added)}</strong></div>
          <div><span>Il y a</span><strong>${Utils.timeSince(game.added)}</strong></div>
        </div>
        ${game.tags && game.tags.length ? `<div class="detail-tags">${game.tags.map(t => `<span class="tag">${Utils.escapeHtml(t)}</span>`).join("")}</div>` : ""}

        <div class="detail-actions">
          <button class="btn-primary" id="downloadBtn">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 3v12m0 0 4.5-4.5M12 15 7.5 10.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 18.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
            Télécharger
          </button>
          ${game.mode === "multi" && game.fix ? `
          <button class="btn-secondary" id="fixBtn">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
            Fix
          </button>` : ""}
          <button class="btn-icon-only" id="favDetailBtn" aria-pressed="${Favorites.isFav(game.id)}" aria-label="Ajouter aux favoris">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 20.2s-7.6-4.6-9.9-9C.6 7.9 2.2 4.5 5.4 4c2.1-.3 4 .8 5.1 2.6.4.7.5.7.9 0C12.5 4.8 14.4 3.7 16.5 4c3.2.5 4.8 3.9 3.3 7.2-2.3 4.4-9.9 9-9.9 9Z"/></svg>
          </button>
          <button class="btn-icon-only" id="copyLinkBtn" aria-label="Copier le lien">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M9.5 14.5 14.5 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M11 6.5l1-1a3.5 3.5 0 0 1 5 5l-1 1M13 17.5l-1 1a3.5 3.5 0 0 1-5-5l1-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
          ${navigator.share ? `<button class="btn-icon-only" id="shareBtn" aria-label="Partager"><svg viewBox="0 0 24 24" width="18" height="18"><circle cx="18" cy="5" r="2.3" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="6" cy="12" r="2.3" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="18" cy="19" r="2.3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 10.8 16 6.2M8 13.2l8 4.6" stroke="currentColor" stroke-width="1.6"/></svg></button>` : ""}
        </div>
      </div>`;

    detailOverlay.classList.add("show");
    detailPanel.classList.add("show");
    document.body.classList.add("no-scroll");

    document.getElementById("downloadBtn").addEventListener("click", () => {
      Utils.downloadFile(game.download);
      Utils.toast(`Téléchargement de « ${game.title} » démarré`, "success");
    });
    const fixBtn = document.getElementById("fixBtn");
    if (fixBtn) {
      fixBtn.addEventListener("click", () => {
        if (game.fixType === "url") window.open(game.fix, "_blank", "noopener");
        else Utils.downloadFile(game.fix);
        Utils.toast(`Fix de « ${game.title} » ouvert`, "info");
      });
    }
    const favDetailBtn = document.getElementById("favDetailBtn");
    favDetailBtn.classList.toggle("active", Favorites.isFav(game.id));
    favDetailBtn.addEventListener("click", () => {
      const nowFav = Favorites.toggle(game.id);
      favDetailBtn.classList.toggle("active", nowFav);
      favDetailBtn.setAttribute("aria-pressed", nowFav);
      Utils.toast(nowFav ? "Ajouté aux favoris" : "Retiré des favoris", "success");
    });
    document.getElementById("copyLinkBtn").addEventListener("click", async () => {
      const link = `${location.origin}${location.pathname}#/game/${game.id}`;
      const ok = await Utils.copyLink(link);
      Utils.toast(ok ? "Lien copié dans le presse-papiers" : "Impossible de copier le lien", ok ? "success" : "error");
    });
    const shareBtn = document.getElementById("shareBtn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        navigator.share({ title: game.title, text: `Découvre ${game.title} sur GameVault`, url: `${location.origin}${location.pathname}#/game/${game.id}` }).catch(() => {});
      });
    }
    document.getElementById("detailExpand").addEventListener("click", () => openLightbox(game.image, game.title));
  }

  function closeDetail() {
    detailOverlay.classList.remove("show");
    detailPanel.classList.remove("show");
    document.body.classList.remove("no-scroll");
  }
  detailClose.addEventListener("click", closeDetail);
  detailOverlay.addEventListener("click", closeDetail);

  /* ---------------------------------------------------------- lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add("show");
  }
  function closeLightbox() { lightbox.classList.remove("show"); }
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  /* ---------------------------------------------------------- history panel */
  const historyOverlay = document.getElementById("historyOverlay");
  const historyPanel = document.getElementById("historyPanel");
  const historyList = document.getElementById("historyList");
  function openHistory() {
    const ids = ViewHistory.getAll();
    const games = ids.map(id => GAMES.find(g => g.id === id)).filter(Boolean);
    historyList.innerHTML = games.length
      ? games.map(g => `
        <button class="history-item" data-id="${g.id}">
          <img src="${g.image}" alt="" loading="lazy">
          <div><strong>${Utils.escapeHtml(g.title)}</strong><span>${Utils.timeSince(g.added)}</span></div>
        </button>`).join("")
      : `<p class="settings-hint">Aucun jeu consulté pour le moment.</p>`;
    historyList.querySelectorAll(".history-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const g = GAMES.find(x => x.id === btn.dataset.id);
        closeHistory();
        if (g) openDetail(g);
      });
    });
    historyOverlay.classList.add("show");
    historyPanel.classList.add("show");
  }
  function closeHistory() {
    historyOverlay.classList.remove("show");
    historyPanel.classList.remove("show");
  }
  document.getElementById("historyBtn").addEventListener("click", openHistory);
  document.getElementById("historyClose").addEventListener("click", closeHistory);
  historyOverlay.addEventListener("click", closeHistory);

  /* ---------------------------------------------------------- routing/render */

  function updateActiveNav(route) {
    document.querySelectorAll(".nav-item").forEach(item => {
      const active = item.dataset.route === route;
      item.classList.toggle("active", active);
      if (active) item.setAttribute("aria-current", "page"); else item.removeAttribute("aria-current");
    });
  }

  function renderRoute({ route, params }) {
    currentRoute = { route, params };
    searchQuery = "";
    document.getElementById("searchInput").value = "";
    document.getElementById("searchClear").hidden = true;
    closeSidebarMobile();
    updateActiveNav(["home","solo","multi","new","favorites","credits","settings"].includes(route) ? route : "home");

    if (route === "game" && params[0]) {
      const g = GAMES.find(x => x.id === params[0]);
      if (g) openDetail(g);
    }

    switch (route) {
      case "home":
        setPageHeader("Bienvenue sur GameVault", "Les dernières sorties ajoutées à la bibliothèque.");
        setBreadcrumb(null);
        currentSort = "recent"; currentModeFilter = "all";
        showFilterBar(true); renderFilterBar();
        setListing(Filters.sortGames(GAMES, "recent"));
        break;

      case "new":
        setPageHeader("Nouveautés", "Tous les jeux, du plus récent au plus ancien.");
        setBreadcrumb(null);
        currentSort = "recent"; currentModeFilter = "all";
        showFilterBar(true); renderFilterBar();
        setListing(Filters.sortGames(GAMES, "recent"));
        break;

      case "favorites": {
        setPageHeader("Favoris", "Les jeux que vous avez mis de côté.");
        setBreadcrumb(null);
        const favs = GAMES.filter(g => Favorites.isFav(g.id));
        currentSort = "recent"; currentModeFilter = "all";
        showFilterBar(favs.length > 0); renderFilterBar();
        setListing(Filters.sortGames(favs, "recent"));
        break;
      }

      case "solo":
      case "multi": {
        const modeLabel = route === "solo" ? "Solo" : "Multijoueur";
        const list = route === "solo" ? SOLO_SUBCATEGORIES : MULTI_SUBCATEGORIES;
        if (params[0]) {
          const cat = decodeURIComponent(params[0]);
          setPageHeader(cat, `${modeLabel} · ${categoryCount(route, cat)} jeu(x)`);
          setBreadcrumb([{ label: modeLabel, path: route }, { label: cat }]);
          currentSort = "recent"; currentModeFilter = "all";
          showFilterBar(true); renderFilterBar();
          setListing(Filters.sortGames(GAMES.filter(g => g.mode === route && g.category === cat), "recent"));
        } else {
          setPageHeader(modeLabel, "Choisissez une sous-catégorie pour explorer le catalogue.");
          setBreadcrumb(null);
          renderSubcategoryGrid(route, list);
        }
        break;
      }

      case "credits":
        setPageHeader("Crédits", "À propos du créateur de GameVault.");
        setBreadcrumb(null);
        renderCredits();
        break;

      case "settings":
        setPageHeader("Paramètres", "Personnalisez votre expérience GameVault.");
        setBreadcrumb(null);
        renderSettings();
        break;

      default:
        if (route !== "game") {
          setPageHeader("Bienvenue sur GameVault", "Les dernières sorties ajoutées à la bibliothèque.");
          showFilterBar(true); renderFilterBar();
          setListing(Filters.sortGames(GAMES, "recent"));
        }
    }
    updateSidebarCount();
  }

  function updateSidebarCount() {
    document.getElementById("sidebarGameCount").textContent = `${GAMES.length} jeux au catalogue`;
  }

  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => Router.navigate(item.dataset.route));
  });

  /* ---------------------------------------------------------- search wiring */

  const searchInput = document.getElementById("searchInput");
  const searchClear = document.getElementById("searchClear");

  const doSearch = Utils.debounce((q) => {
    searchQuery = q;
    if (!q) { renderRoute(currentRoute); return; }
    const results = Search.run(q, GAMES);
    setPageHeader(`Résultats pour « ${Utils.escapeHtml(q)} »`, `${results.length} jeu(x) trouvé(s)`);
    setBreadcrumb(null);
    showFilterBar(results.length > 0); renderFilterBar();
    setListing(Filters.sortGames(results, currentSort), { skeleton: false });
  }, 220);

  searchInput.addEventListener("input", (e) => {
    searchClear.hidden = !e.target.value;
    doSearch(e.target.value);
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    searchClear.hidden = true;
    doSearch("");
    searchInput.focus();
  });

  /* ---------------------------------------------------------- infinite scroll */

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) loadMore(); });
  }, { rootMargin: "400px" });
  io.observe(sentinel);

  /* ---------------------------------------------------------- scroll progress + back to top */

  const main = document.querySelector(".main-content");
  const scrollProgress = document.getElementById("scrollProgress");
  const toTopBtn = document.getElementById("toTop");

  main.addEventListener("scroll", Utils.debounce(() => {
    const { scrollTop, scrollHeight, clientHeight } = main;
    const pct = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
    toTopBtn.hidden = scrollTop < 400;
  }, 30), { passive: true });

  toTopBtn.addEventListener("click", () => main.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------------------------------------------------------- mobile sidebar */

  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  function openSidebarMobile() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("show");
    sidebarToggle.setAttribute("aria-expanded", "true");
  }
  function closeSidebarMobile() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("show");
    sidebarToggle.setAttribute("aria-expanded", "false");
  }
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.contains("open") ? closeSidebarMobile() : openSidebarMobile();
  });
  sidebarOverlay.addEventListener("click", closeSidebarMobile);

  /* ---------------------------------------------------------- shortcuts */

  const shortcutsOverlay = document.getElementById("shortcutsOverlay");
  const shortcutsModal = document.getElementById("shortcutsModal");
  function openShortcuts() { shortcutsOverlay.classList.add("show"); shortcutsModal.classList.add("show"); }
  function closeShortcuts() { shortcutsOverlay.classList.remove("show"); shortcutsModal.classList.remove("show"); }
  document.getElementById("shortcutsCloseBtn").addEventListener("click", closeShortcuts);
  shortcutsOverlay.addEventListener("click", closeShortcuts);

  const ROUTE_KEYS = { "1": "home", "2": "solo", "3": "multi", "4": "new", "5": "favorites", "6": "credits", "7": "settings" };

  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement.tagName;
    const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

    if (e.key === "Escape") {
      closeDetail(); closeLightbox(); closeHistory(); closeShortcuts(); closeSidebarMobile();
      if (typing) searchInput.blur();
      return;
    }
    if (typing) return;

    if (e.key === "/") { e.preventDefault(); searchInput.focus(); return; }
    if (e.key === "?") { openShortcuts(); return; }
    if (e.key === "ArrowUp" && e.shiftKey) { main.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (ROUTE_KEYS[e.key]) { Router.navigate(ROUTE_KEYS[e.key]); }
  });

  /* ---------------------------------------------------------- init */

  Router.init(renderRoute);
  updateSidebarCount();
})();

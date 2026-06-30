/**
 * utils.js — fonctions utilitaires partagées
 */
const Utils = (() => {

  /** Convertit une date ISO en texte relatif court : "19 min", "2 h", "13 h", "2 j", "3 j 12 h" */
  function timeSince(dateStr) {
    const then = new Date(dateStr).getTime();
    const now = Date.now();
    let diff = Math.max(0, Math.floor((now - then) / 1000)); // secondes

    if (diff < 60) return "À l'instant";
    const min = Math.floor(diff / 60);
    if (min < 60) return `${min} min`;
    const hours = Math.floor(min / 60);
    if (hours < 24) return `${hours} h`;
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    if (days < 30) {
      return remHours > 0 ? `${days} j ${remHours} h` : `${days} j`;
    }
    const months = Math.floor(days / 30);
    return `${months} mois`;
  }

  function isNew(dateStr, windowDays = 30) {
    const then = new Date(dateStr).getTime();
    const diffDays = (Date.now() - then) / 86400000;
    return diffDays <= windowDays;
  }

  function formatFullDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) +
      " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }

  function slugify(str) {
    return str.toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function debounce(fn, delay = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  function toast(message, type = "info", duration = 3200) {
    const stack = document.getElementById("toastStack");
    if (!stack) return;
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span class="toast-dot"></span><span class="toast-msg">${message}</span>`;
    stack.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      el.classList.add("hide");
      setTimeout(() => el.remove(), 350);
    }, duration);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function downloadFile(url) {
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "");
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function copyLink(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  return { timeSince, isNew, formatFullDate, slugify, debounce, toast, escapeHtml, downloadFile, copyLink };
})();

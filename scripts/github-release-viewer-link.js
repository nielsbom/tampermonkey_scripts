// ==UserScript==
// @name         GitHub → Release Viewer Link
// @namespace    https://release-viewer.web-toolbox.dev/
// @version      1.0.0
// @description  Adds a link to release-viewer.web-toolbox.dev on GitHub repo home and releases pages
// @author       you
// @match        https://github.com/*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  const LINK_ID = "release-viewer-link";
  // GitHub top-level paths that are NOT owner/repo (avoid false positives on /org/repo shape)
  const RESERVED = new Set([
    "marketplace",
    "notifications",
    "settings",
    "sponsors",
    "topics",
    "trending",
    "collections",
    "orgs",
    "apps",
    "features",
    "pricing",
    "about",
    "contact",
    "support",
    "issues",
    "pulls",
    "explore",
    "codespaces",
    "new",
    "login",
    "signup",
    "search",
  ]);

  function getPathParts() {
    return location.pathname.split("/").filter(Boolean);
  }

  function getRepoInfo(parts) {
    if (parts.length < 2) return null;
    const [org, repo] = parts;
    if (RESERVED.has(org)) return null;
    return { org, repo };
  }

  function isHomePage(parts) {
    return parts.length === 2;
  }

  function isReleasesPage(parts) {
    return parts.length >= 3 && parts[2] === "releases";
  }

  function makeLink(org, repo) {
    const a = document.createElement("a");
    a.id = LINK_ID;
    a.href = `https://release-viewer.web-toolbox.dev/repo/${org}/${repo}`;
    a.textContent = "Open in Release Viewer ↗";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.style.cssText =
      "display:inline-block;margin:6px 0;font-size:12px;font-weight:600;" +
      "color:var(--fgColor-accent,#2f81f7);text-decoration:none;";
    a.addEventListener(
      "mouseenter",
      () => (a.style.textDecoration = "underline"),
    );
    a.addEventListener("mouseleave", () => (a.style.textDecoration = "none"));
    return a;
  }

  function removeExistingLink() {
    const existing = document.getElementById(LINK_ID);
    if (existing) existing.remove();
  }

  function insertHomeLink(org, repo) {
    // Search within the actual sidebar pane first — repos with a
    // "## Releases" section in their README also have a matching h2/h3
    // in the main content, and that one appears earlier in the DOM.
    const pane = document.querySelector(
      '[data-component="SplitPageLayout.Pane"]',
    );
    const headings = (pane || document).querySelectorAll("h2, h3");
    for (const h of headings) {
      // Safety net: never match a heading inside the README (always
      // rendered inside an <article>), even if the pane scope above
      // wasn't found and we fell back to searching the whole document.
      if (h.closest("article")) continue;
      const text = h.textContent.trim().replace(/\s+/g, " ");
      if (text === "Releases" || text.startsWith("Releases")) {
        h.insertAdjacentElement("afterend", makeLink(org, repo));
        return true;
      }
    }
    return false;
  }

  function insertReleasesPageLink(org, repo) {
    const h1 = document.querySelector("h1");
    if (!h1) return false;
    h1.insertAdjacentElement("afterend", makeLink(org, repo));
    return true;
  }

  // Returns the insert function for the current URL, or null if not a
  // page we care about. Recomputed on every check since the URL can
  // change via Turbo without a full script reload.
  function getInsertFnForCurrentUrl() {
    const parts = getPathParts();
    const info = getRepoInfo(parts);
    if (!info) return null;

    if (isReleasesPage(parts)) {
      return () => insertReleasesPageLink(info.org, info.repo);
    }
    if (isHomePage(parts)) {
      return () => insertHomeLink(info.org, info.repo);
    }
    return null;
  }

  // Idempotent: does nothing if the link is already present. Safe to call
  // as often as needed (e.g. from a MutationObserver) without recursing,
  // since inserting the link won't cause it to insert itself again.
  function ensureLinkPresent() {
    if (document.getElementById(LINK_ID)) return;

    const insertFn = getInsertFnForCurrentUrl();
    if (!insertFn) return;

    insertFn();
  }

  function onNavigate() {
    // URL changed (or first load) — drop any stale link (wrong repo, or
    // no longer on a relevant page) before re-checking.
    removeExistingLink();
    ensureLinkPresent();
  }

  onNavigate();

  // GitHub renders content async behind skeleton placeholders, and React
  // re-renders can wipe out our injected link even without a navigation.
  // Keep watching the whole document and re-insert whenever it's missing.
  let debounceTimer = null;
  const observer = new MutationObserver(() => {
    if (debounceTimer) return;
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      ensureLinkPresent();
    }, 100);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // GitHub navigates via Turbo without full page reloads
  document.addEventListener("turbo:load", onNavigate);
  document.addEventListener("turbo:render", onNavigate);
  document.addEventListener("pjax:end", onNavigate); // fallback for older GitHub UI

  // Extra safety net for any SPA URL changes not covered above
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      onNavigate();
    }
  }, 500);
})();

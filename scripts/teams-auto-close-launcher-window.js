// ==UserScript==
// @name        Auto close Teams launcher
// @namespace   Violentmonkey Scripts
// @match       https://teams.microsoft.com/dl/launcher/launcher.html*
// @grant       window.close
// @version     1.0
// @author      -
// @description 11/25/2025, 9:56:24 AM
// ==/UserScript==


(async () => {
  ("use strict");

  const log = (args) => {
    const PREFIX = "🐵 ";
    console.log(PREFIX + args);
  };

  const SECONDS_BEFORE_CLOSING = 1;


  log(`waiting ${SECONDS_BEFORE_CLOSING} before closing this window`);

  await new Promise(r => setTimeout(r, SECONDS_BEFORE_CLOSING * 1000));

  window.close();
})();

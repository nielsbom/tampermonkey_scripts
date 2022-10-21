// ==UserScript==
// @name         PostgreSQL docs - usability
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sets a max width of the text, all h3 and h4 headers are
//               deeplinks
// @author       Niels Bom
// @match        https://www.postgresql.org/docs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=postgresql.org
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  // Fix styling
  GM_addStyle(`
#pgContentWrap {
  max-width: 66ch;
}
`);

  // Make h3 and h4 links links
  const getClosestId = el => {
    const id = el.getAttribute("id");
    if (id) return id;
    return getClosestId(el.parentElement);
  };

  const getUrlWithoutId = () => String(window.location).split("#")[0];

  const replaceTextWithLink = (id, text) =>
    `<a href="${getUrlWithoutId()}#${id}">${text}</a>`;

  [...document.querySelectorAll("h3,h4")].forEach(header => {
    const id = getClosestId(header);
    header.innerHTML = replaceTextWithLink(id, header.innerText);
  });
})();

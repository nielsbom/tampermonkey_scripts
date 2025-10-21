// ==UserScript==
// @name        Swagger focus filter
// @namespace   Violentmonkey Scripts
// Very specifically only match on this URL
// @match       http://localhost:3000/docs/?filter=true&docExpansion=none
// @grant       none
// @version     1.0
// @author      -
// @description 10/21/2025, 11:19:22 AM
// ==/UserScript==
(async () => {
  ("use strict");

  const log = (args) => {
    const PREFIX = "🐵 ";
    console.log(PREFIX + args);
  };

  const waitForElementToExist = (selector, interval = 100) => {
    return new Promise((resolve) => {
      const checkIfExists = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else {
          setTimeout(checkIfExists, interval);
        }
      };
      checkIfExists();
    });
  };


  const filterInput = await waitForElementToExist('input.operation-filter-input');
  filterInput.focus();
})();

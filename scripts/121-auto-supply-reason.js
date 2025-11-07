// ==UserScript==
// @name         121 Platform - Automatically supply reason for reason form.
// @namespace    http://tampermonkey.net/
// @version      2025-10-20
// @description  try to take over the world!
// @author       You
// @match        http://localhost:8888/*
// @match        http://localhost:8088/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(async () => {
  ("use strict");

  const log = (args) => {
    const PREFIX = "🐵 ";
    console.log(PREFIX + args);
  };

  new MutationObserver(() => {
    document.querySelectorAll('input[formcontrolname="reason"]').forEach(input => {
      if (!input.value) {
        input.value = new Date().toLocaleString() + ' some reason';
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        //input.closest('form')?.querySelector('*:contains("Save")')?.click();
        // input.closest('form')[text()="Save"]?.click();
        /* const saveButton = document.evaluate(
          './/*[contains(text(), "Save")]',
          input.closest('form'),
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        saveButton?.click();
        */
      }
    });
  }).observe(document.body, { childList: true, subtree: true });

})();

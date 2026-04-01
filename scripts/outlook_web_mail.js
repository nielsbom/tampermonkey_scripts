// ==UserScript==
// @name        Outlook web mail
// @namespace   Violentmonkey Scripts
// @match       https://outlook.office.com/mail/*
// @match       https://outlook.cloud.microsoft/mail/*
// @grant       none
// @version     1.0
// @author      -
// @description 2/18/2026, 2:12:23 PM
// ==/UserScript==
(async () => {
  ("use strict");

  const log = (args) => {
    const PREFIX = "🐵 ";
    console.log(PREFIX + args);
  };

  const getElementWithAriaLabelStartingWith = (prefix) => {
    const element = document.querySelector(`[aria-label^="${prefix}"]`);
    if (element) return element;
  };

  const getElementWithAriaLabel = (label) => {
    const element = document.querySelector(`[aria-label="${label}"]`);
    if (element) return element;
  };

  function setInputValueAndSubmit(input, value) {
    input.focus();
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    ).set;
    nativeInputValueSetter.call(input, query);
    input.dispatchEvent(new Event("input", { bubbles: true }));

    // Press Enter
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        bubbles: true,
      }),
    );
  }

  function runOutlookSearch(query) {
    // Find the search input
    const searchInput = getElementWithAriaLabelStartingWith("Search for email");
    if (!searchInput) return false;
    setInputValueAndSubmit(searchInput, query);
    return true;
  }

  // Read ?search= from the URL
  const params = new URLSearchParams(window.location.search);
  const query = params.get("search");

  await new Promise((r) => setTimeout(r, 1000)); // ms

  log(query);

  if (query) {
    // Outlook loads dynamically, so wait for the search box to appear
    const interval = setInterval(() => {
      if (runOutlookSearch(query)) {
        clearInterval(interval);
      }
    }, 500);

    // Give up after 15 seconds
    setTimeout(() => clearInterval(interval), 15000);
  }
})();

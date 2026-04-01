// ==UserScript==
// @name        Outlook web calendar
// @namespace   Violentmonkey Scripts
// @match       https://outlook.office.com/calendar/*
// @match       https://outlook.cloud.microsoft/calendar/*
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

  const modifiersPressed = ({ altKey, ctrlKey, shiftKey, metaKey }) =>
    ctrlKey && shiftKey;

  const clickElementWithAriaLabelStartingWith = (prefix) => {
    const element = document.querySelector(`button[aria-label^="${prefix}"]`);
    if (element) {
      element.click();
    } else {
      console.warn(
        `No element found with aria-label starting with "${prefix}"`,
      );
    }
  };

  const clickElementWithAriaLabel = (label) => {
    const element = document.querySelector(`button[aria-label="${label}"]`);
    if (element) {
      element.click();
    } else {
      console.warn(`No element found with aria-label "${label}"`);
    }
  };

  document.addEventListener("keydown", (event) => {
    if (!modifiersPressed(event)) return;
    const characterPressed = event.key.toLowerCase();
    if (characterPressed === "j")
      clickElementWithAriaLabelStartingWith("Go to next week");

    if (characterPressed === "k")
      clickElementWithAriaLabelStartingWith("Go to previous week");

    if (characterPressed === "t")
      clickElementWithAriaLabelStartingWith("Go to today");

    if (characterPressed === "m") clickElementWithAriaLabel("Month");

    if (characterPressed === "w") clickElementWithAriaLabel("Work week");
    if (characterPressed === "d") clickElementWithAriaLabel("Day");
  });
})();

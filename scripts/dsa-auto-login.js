// ==UserScript==
// @name         Automatically login into DSA
// @namespace    http://tampermonkey.net/
// @version      2025-10-20
// @description  try to take over the world!
// @author       You
// @match        https://frontend.dsadonis.orb.local/#/login
// @icon         https://frontend.dsadonis.orb.local/favicon-96x96.png
// @grant        none
// ==/UserScript==

(() => {
  ("use strict");
  const DEBUG = false;

  const log = (...args) => {
    if (!DEBUG) return;
    const PREFIX = "🐵 ";
    console.log(PREFIX, ...args);
  };

  const error = (...args) => {
    if (!DEBUG) return;
    const PREFIX = "🐵 ❌";
    console.error(PREFIX, ...args);
  };

  // Function that takes: selector, a value to set or an event type to dispatch
  // and a boolean indicating whether it's a value or an event
  // It waits for the element to appear in the DOM before proceeding
  const interactWithElement = ({ selector, value, event }) => {
    if (value && event) {
      error("You can only provide either a value or an event, not both.");
      return;
    }

    const element = document.querySelector(selector);
    if (!element) {
      error(
        `Expecting element with selector "${selector}" to be present before interacting with it.`,
      );
      return;
    }

    if (value) {
      log(`Setting element "${selector}" to value "${value}"`, element);
      // Set the value
      element.value = value;
      // Dispatch the input/change event, this helps frameworks like
      // React/Vue/Angular to detect the change
      const eventType =
        element.tagName.toLowerCase() === "select" ? "change" : "input";
      element.dispatchEvent(new Event(eventType, { bubbles: true }));
    } else {
      // Dispatch the event
      // Something like PointerEvent, 'click'
      const { eventType, eventName } = event;
      log(`Dispatching event "${event}" on element "${selector}"`, element);
      element.dispatchEvent(new eventType(eventName, { bubbles: true }));
    }

    // Sleep for a short duration to allow any potential UI updates
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    return sleep(100); // Adjust the duration as needed
  };

  const runInteractions = (elementsToInteract) => {
    elementsToInteract.forEach(interactWithElement);
  };

  const runInteractionWhenAllAvailable = async ({
    elementsToInteract,
    runInteractions,
  }) => {
    const allElementsExist = () => {
      const foundElements = elementsToInteract.map(({ selector }) =>
        document.querySelector(selector),
      );
      return !foundElements.includes(null);
    };

    if (allElementsExist()) {
      log(
        "All elements already present, running interactions...",
        elementsToInteract,
      );
      runInteractions(elementsToInteract);
      return;
    }

    // We know here the elements don't exist yet, so we can start observing them.
    const observeFunction = () => {
      if (!allElementsExist()) {
        return;
      }

      // All elements are available.
      log("All elements found, running interactions...", elementsToInteract);

      runInteractions(elementsToInteract);

      log("All interactions executed, disconnecting observer.");
      observer.disconnect();
    };

    const observer = new MutationObserver(observeFunction);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  const elementsToInteract = [
    { selector: 'input[name="username"]', value: "niels@nielsbom.com" },
    { selector: 'input[name="password"]', value: "secret" },
    {
      selector: 'button[type="submit"]',
      event: { eventType: PointerEvent, eventName: "click" },
    },
  ];

  log(
    "Script started, waiting for elements to be available...",
    elementsToInteract,
  );
  runInteractionWhenAllAvailable({ elementsToInteract, runInteractions });
})();

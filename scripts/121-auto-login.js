// ==UserScript==
// @name         Automatically login into 121 Platform, normal and debug mode.
// @namespace    http://tampermonkey.net/
// @version      2025-10-20
// @description  try to take over the world!
// @author       You
// @match        http://localhost:8888/login
// @match        http://localhost:8088/
// @exclude        http://localhost:8888/login?
// @exclude        http://localhost:8088/?
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(async () => {
  ("use strict");

  const log = (args) => {
    const PREFIX = "🐵 ";
    console.log(PREFIX + args);
  };

  const waitForEmailInputPolling = (interval = 100) => {
    return new Promise((resolve) => {
      const checkForInput = () => {
        const emailInput = document.querySelector('input[type="email"]');
        if (emailInput) {
          resolve(emailInput);
        } else {
          setTimeout(checkForInput, interval);
        }
      };
      checkForInput();
    });
  };

  const fillOutLoginForm = async () => {
    // Step 1: Find email input field
    const emailField = document.querySelector('input[type="email"]');

    // Step 2: If email field doesn't exist, do nothing
    if (!emailField) {
      log("Email field not found");
      return;
    }

    // Step 3: Fill in email
    emailField.value = "admin@example.org";
    // Necessary for Angular to detect the change, otherwise the form might not register the input
    emailField.dispatchEvent(new Event("input", { bubbles: true }));
    emailField.dispatchEvent(new Event("change", { bubbles: true }));

    // Step 4: Find password field
    const passwordField = document.querySelector('input[type="password"]');

    // If password field doesn't exist, do nothing
    if (!passwordField) {
      log("Password field not found");
      return;
    }

    // Step 5: Fill in password
    passwordField.value = "password";
    // Necessary for Angular to detect the change, otherwise the form might not register the input
    passwordField.dispatchEvent(new Event("input", { bubbles: true }));
    passwordField.dispatchEvent(new Event("change", { bubbles: true }));

    // Wait a bit in case Angular needs to take a breath
    await new Promise((r) => setTimeout(r, 200)); // ms

    document.querySelector("button").click();
  };

  await waitForEmailInputPolling();
  await fillOutLoginForm();
})();

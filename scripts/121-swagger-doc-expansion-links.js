// ==UserScript==
// @name        121 Swagger - add links and keyboard shortcuts to different views
// @namespace   Violentmonkey Scripts
// @match       http://localhost:3000/docs/*
// @grant       GM_addStyle
// @version     1.0
// @author      -
// @description 10/21/2025, 12:09:47 PM
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

  const createLink = (urlObj, name) => {
    const link = document.createElement('a');
    link.href = urlObj.href;
    link.textContent = name
    return link;
  };

  const currentURL = new URL(window.location.href);
  const urlDocExpansionNone = new URL(currentURL);
  urlDocExpansionNone.searchParams.set('docExpansion', 'none');
  const linkNone = createLink(urlDocExpansionNone, 'collapse all');


  const urlDocExpansionList = new URL(currentURL);
  urlDocExpansionList.searchParams.set('docExpansion', 'list');
  const linkList = createLink(urlDocExpansionList, 'list');

  const urlDocExpansionFull = new URL(currentURL);
  urlDocExpansionFull.searchParams.set('docExpansion', 'full');
  const linkFull = createLink(urlDocExpansionFull, 'full');


  const header = await waitForElementToExist('.information-container');

  const linkContainer = document.createElement('div');
  linkContainer.classList.add('link-container');

  header.appendChild(linkContainer);

  linkContainer.appendChild(linkNone);
  linkContainer.appendChild(linkList);
  linkContainer.appendChild(linkFull);

  GM_addStyle(`
    .link-container a {
      margin: 1rem;
      padding: 0.5rem;
      font-weight: bold;
      font-size: 1.5rem;
      text-decoration: none;
    }

  `)
})();

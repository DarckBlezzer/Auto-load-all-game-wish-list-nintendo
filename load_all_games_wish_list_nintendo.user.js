// ==UserScript==
// @name         Show all games nintendo wish list
// @namespace    http://tampermonkey.net/
// @version      3
// @description  This userscript help you to load all games that you have in your wish-list
// @author       DarckBlezzer
// @match        https://www.nintendo.com/wish-list/*
// @match        https://www.nintendo.com/*/wish-list/
// @match        https://www.nintendo.com/*/wish-list/*
// @icon         https://www.google.com/s2/favicons?domain=nintendo.com
// @grant        none
// @updateURL    https://github.com/DarckBlezzer/Auto-load-all-game-wish-list-nintendo/raw/main/load_all_games_wish_list_nintendo.user.js
// ==/UserScript==

const get_element = () => document.querySelector("wishlist-manager");
const get_button = () => document.querySelector("styled-button.secondary-blue");
const get_select = () => document.querySelector("styled-select");
const get_items_container = () =>
  document.querySelector("ul.items.constrained");

const check_if_element_has_class = () => {
  const element = get_element();
  return (
    element.classList.contains("has-more") &&
    element.classList.contains("has-items")
  );
};

const check_if_element_has_items = () => {
  const element = get_element();
  return element.classList.contains("has-more");
};

const wait_until_has_class = function (fun = () => {}) {
  setTimeout(
    () =>
      check_if_element_has_class() ? fun() : wait_until_has_class(...arguments),
    500
  );
};

const put_all_sales_on_top = () => {
  const parent = get_items_container();
  if (parent) {
    const childs = Array.from(parent.children);
    childs.forEach((child) => {
      console.log(child.querySelector("div.prices.discounted"));
    });
  }
};

const run_until_not_has_more = function (fun = () => {}) {
  setTimeout(() => {
    if (check_if_element_has_items()) {
      fun();
      run_until_not_has_more(...arguments);
    } else {
      console.log("There isn't more games :(");
      put_all_sales_on_top();
    }
  }, 500);
};

const show_all = () => {
  run_until_not_has_more(() => {
    console.log("Click load more baby :3");
    const button = get_button();
    if (button) button.click();
  });
};

window.onload = function () {
  if (get_element()) {
    console.log("Yes, the element exist... :3");
    wait_until_has_class(() => {
      console.log("Good, we start to load more games, baby :3");
      get_select().onchange = show_all;
      show_all();
    });
  }
};

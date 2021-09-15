// ==UserScript==
// @name         Show all games nintendo wish list
// @namespace    http://tampermonkey.net/
// @version      1.5
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

const check_if_element_has_class = (classes) => {
  const element = get_element();
  return classes.every((c) => element.classList.contains(c));
};

let all_element_games = null;

const check_if_element_has_items = () => {
  const element = get_element();
  return check_if_element_has_class(["has-more"]);
};

const wait_until_has_class = function (fun = () => {}) {
  setTimeout(() => {
    if (check_if_element_has_class(["has-more", "has-items"])) {
      fun();
    } else {
      wait_until_has_class(...arguments);
    }
  }, 500);
};

const restore_games = () => {
  const games_container = get_items_container();
  if (games_container) {
    if (!all_element_games) {
      all_element_games = games_container.children();
    } else {
      games_container.replaceChildren(...all_element_games);
    }
  }
};

const put_all_sales_on_top = () => {
  const parent = get_items_container();
  if (parent) {
    console.log("put_all_sales_on_top");
    const childs = Array.from(parent.children);
    childs.forEach((child) => {
      const price = child.querySelector("product-price");
      if (price && price.hasAttribute("sale-price")) {
        parent.prepend(child);
        console.log("Offerta movida");
      }
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
      setTimeout(() => put_all_sales_on_top(), 300);
    }
  }, 500);
};

const show_all = () => {
  //   restore_games();
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
      all_element_games;
      get_select().onchange = show_all;
      show_all();
    });
  }
};

var open = window.XMLHttpRequest.prototype.open,
  send = window.XMLHttpRequest.prototype.send,
  onReadyStateChange;

function openReplacement(method, url, async, user, password) {
  var syncMode = async !== false ? "async" : "sync";
  console.warn(
    "Preparing " + syncMode + " HTTP request : " + method + " " + url
  );
  return open.apply(this, arguments);
}

function sendReplacement(data) {
  console.warn("Sending HTTP request data : ", data);

  if (this.onreadystatechange) {
    this._onreadystatechange = this.onreadystatechange;
  }
  this.onreadystatechange = onReadyStateChangeReplacement;

  return send.apply(this, arguments);
}

function onReadyStateChangeReplacement() {
  console.warn("HTTP request ready state changed : " + this.readyState);
  if (this._onreadystatechange) {
    return this._onreadystatechange.apply(this, arguments);
  }
}

window.XMLHttpRequest.prototype.open = openReplacement;
window.XMLHttpRequest.prototype.send = sendReplacement;

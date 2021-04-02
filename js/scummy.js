const { dialog } = require('electron').remote;
const path = require('path');
const fs = require('fs')
const { remote } = require('electron')
const { Menu, MenuItem } = remote
const electron = require('electron');

const electronScreen = require('electron').screen;
const Store = require('electron-store');
const store = new Store();
const customTitlebar = require('custom-electron-titlebar');

var devMode = true;
var installed = ["monkey", "sq4", "sq6", "urban", "ween", "lighthouse", "fw", "kq6", "lab", "lit", "myst", "elvira1", "sword1", "tentacle", "hhgttg"]
var favorites = ["monkey", "sq4", "lighthouse", "fw", "myst", "sword1"]

//Menu.setApplicationMenu(null);

let titlebar = new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex('#1B262C'),
  menu: null,
  overflow: "hidden"
});

drawCategories();
drawGames();

$(".sideBar").on("mouseenter", () => {
  $(".sideBar").addClass("hasScrollBar");
}).on("mouseleave", () => {
  $(".sideBar").removeClass("hasScrollBar");
});

$(".main").on("mouseenter", () => {
  $(".main").addClass("hasScrollBar");
}).on("mouseleave", () => {
  $(".main").removeClass("hasScrollBar");
});

function drawCategories() {
  $("#all").html(installed.length);
  $("#favorites").html(favorites.length);
  let installedCategories = {};
  Object.keys(categories).forEach(key => {
    installedCategories[key] = 0;
  });
  Object.keys(gameData).forEach(key => {
    if (installed.includes(gameData[key]['id'])) installedCategories[gameData[key]['category']] += 1;
  });
  Object.keys(categories).sort().forEach(key => {
    if (installedCategories[key] > 0) {
      let tmpIcon = $("<i></i>", {"class": "fas fa-bookmark fa-fw bookmark"});
      let tmpCount = $("<span></span>", {"class":"badge"}).text(installedCategories[key]);
      let tmpObject = $("<div></div>", {"class":"sideBarItem", "id":key}).text(categories[key]).prepend(tmpIcon).append(tmpCount);
      $("#sideBarCategories").append(tmpObject);
    }
  });
}

function drawGames() {
  if ($("#gallery-view").hasClass("active")) {

  }
}

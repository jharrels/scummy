const { dialog } = require('electron').remote;
const path = require('path');
const os = require('os');
const fs = require('fs')
const { remote } = require('electron')
const { Menu, MenuItem } = remote
const electron = require('electron');
const { spawn } = require('child_process');
const ini = require('ini');

const electronScreen = require('electron').screen;
const Store = require('electron-store');
const store = new Store();
const customTitlebar = require('custom-electron-titlebar');

var devMode = true;
var scummvmConfigPath = "";
var scummvmConfig = {};
var installed = {};
var favorites = [];

//Menu.setApplicationMenu(null);

let titlebar = new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex('#1B262C'),
  menu: null,
  overflow: "hidden"
});

getScummvmConfigPath();
loadScummvmConfig();
getInstalledGames();

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

$(".main").on("dblclick", ".game", function(e) {
  alert($(this).attr("id"));
});

/* ----------------------------------------------------------------------------
   FUNCTIONS
---------------------------------------------------------------------------- */
function drawCategories() {
  $("#all").html(installed.length);
  $("#favorites").html(favorites.length);
  let installedCategories = {};
  Object.keys(categories).forEach(key => {
    installedCategories[key] = 0;
  });
  Object.keys(installed).forEach(key => {
    installedCategories[gameData[key]['category']] += 1;
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
  let shortNames = Object.keys(installed);
  shortNames.sort(function(a, b) { return installed[a]['name'].toLowerCase() - installed[b]['name'].toLowerCase() });
  if ($("#gallery-view").hasClass("active")) {
    let grid = $("<div></div>", {"id": "grid"});
    $(".main").html("").append(grid);
    for (i=0; i<shortNames.length; i++) {
      let imagePath = `images/${gameData[shortNames[i]]['category']}/${shortNames[i]}.png`;
      let gameImageObj = $("<img></img", {"src": imagePath});
      let gameNameObj = $("<span></span>").text(installed[shortNames[i]]['name']);
      let rowObj = $("<div></div>", {"class": "game", "id": shortNames[i]}).append(gameImageObj).append(gameNameObj);
      $("#grid").append(rowObj);
    }
  }
}

function getInstalledGames() {
  let rawData = "";
  let scummvm = spawn('scummvm.exe', ['--list-targets'], {'cwd': 'c:\\Program Files\\scummvm', 'shell': true});

  scummvm.stdout.on('data', (data) => {
    rawData += data.toString();
  });

  scummvm.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  scummvm.on('exit', (code) => {
    rawDataList = rawData.split("\r\n");
    for (i=2; i<rawDataList.length-1; i++) {
      let parsedData = rawDataList[i].match(/(.+?)[ ]{2,}(.+)$/);
      let rawGameId = parsedData[1];
      let parsedGameName = parsedData[2].match(/^(.+?)\((.+?)\)$/);
      let rawGameIdList = rawGameId.split("-");
      let numPieces = rawGameIdList.length
      let found = false;
      while ((!found) && (numPieces > 0)) {
        let testId = rawGameIdList.slice(0,numPieces).join("-");
        if (testId in gameData) {
          found = true;
          installed[testId] = {"name": parsedGameName[1], "version": parsedGameName[2], "versionShortName": rawGameId};
        } else {
          numPieces--;
        }
      }
    }
    drawCategories();
    drawGames();
  });
}

function getScummvmConfigPath() {
  if (os.type() == 'Windows_NT') scummvmConfigPath = process.env.APPDATA+"\\ScummVM\\scummvm.ini";
  if (os.type() == 'Darwin') scummvmConfigPath = process.env.HOME+"/Library/Preferences/ScummVM Preferences";
}

function loadScummvmConfig() {
  let rawScummvmConfig = fs.readFileSync(scummvmConfigPath, 'utf-8');
  scummvmConfig = ini.parse(rawScummvmConfig);
}

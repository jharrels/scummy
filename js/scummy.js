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
var selectedGame = "";
var defaultVersions = {};

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

$(".main").on("click", ".game", function(e) {
  let gameId = $(this).attr("id");
  launchGame(gameId);
});

$(".main").on("contextmenu", ".game", function(e) {
  let gameId = $(this).attr("id");
  selectedGame = gameId;
  $(this).children("img").addClass("active");
  $("#context-menu").children(".launch-items").html("");
  for (i=0; i<installed[gameId]['versions'].length; i++) {
    if (installed[gameId]['versions'][i]['version'] == "Default") {
      let menuIconObj = $("<i></i>", {"class": "fas fa-play fa-fw"});
      let menuItemObj = $("<div></div>", {"class": "play menu-item"}).html(menuIconObj).append(" Play");
      $("#context-menu").children(".launch-items").append(menuItemObj);
    } else {
      let menuIconObj = $("<i></i>", {"class": "fas fa-play fa-fw"});
      let menuItemObj;
      if (installed[gameId]['versions'][i]['versionShortName'] == defaultVersions[gameId]) {
        menuItemObj = $("<div></div>", {"class": "play menu-item"}).html(menuIconObj).append("Play "+installed[gameId]['versions'][i]['version']+" <i class='fas fa-star'></i>");
      } else {
        menuItemObj = $("<div></div>", {"class": "play menu-item"}).html(menuIconObj).append("Play "+installed[gameId]['versions'][i]['version']);
      }
      $("#context-menu").children(".launch-items").append(menuItemObj);
    }
  }
  $("#context-menu").css({left: e.pageX-50, top: e.pageY-50}).fadeIn(250);
});

$("#context-menu").on("mouseleave", () => {
  $("#context-menu").fadeOut(250);
  $(`#${selectedGame}`).children("img").removeClass("active");
});

/* ----------------------------------------------------------------------------
   FUNCTIONS
---------------------------------------------------------------------------- */
function getGameShortName(gameId) {
  console.log(gameId);
  let gameShortName = "";
  for (i=0; i<installed[gameId]['versions'].length; i++) {
    gameShortName = installed[gameId]['versions'][i]['versionShortName'];
  }
  return gameShortName;
}

function launchGame(gameId) {
  let launchOptions = [];
  let shortName = getGameShortName(gameId);
  let installPath = scummvmConfig[shortName]['path'].split("\\").join("\\\\");
  let tempConfigPath = writeTempConfig(shortName);
  launchOptions.push(`--config="${tempConfigPath}"`);
  launchOptions.push(gameId);
  let rawData = "";
  let scummvm = spawn('scummvm.exe', launchOptions, {'cwd': 'c:\\Program Files\\scummvm', 'shell': true});
  showWaiting(installed[gameId]['name']);
  scummvm.stdout.on('data', (data) => {
  });

  scummvm.stderr.on('data', (data) => {
  });

  scummvm.on('exit', (code) => {
    hideWaiting();
  });
}

function drawCategories() {
  $("#all").html(Object.keys(installed).length);
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
  let longNames = {};
  Object.keys(installed).forEach(key => {
    longNames[installed[key]['name']] = key;
  });
  if ($("#gallery-view").hasClass("active")) {
    let grid = $("<div></div>", {"id": "grid"});
    $(".main").html("").append(grid);
    Object.keys(longNames).sort().forEach(key => {
      let category = gameData[longNames[key]]['category'];
      let imagePath = `images/${category}/${longNames[key]}.png`;
      try {
        fs.accessSync(imagePath, fs.constants.R_OK);
      } catch(err) {
         imagePath = "images/missing.png";
      }
      let gameImageObj = $("<img></img", {"src": imagePath});
      let gameNameObj = $("<span></span>").text(key);
      let rowObj = $("<div></div>", {"class": "game", "id": longNames[key]}).append(gameImageObj).append(gameNameObj);
      $("#grid").append(rowObj);
    });
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
      let parsedGameName;
      if (parsedData[2].includes("(")) {
        parsedGameName = parsedData[2].match(/^(.+?)\((.+?)\)$/);
      } else {
        parsedGameName = ["", parsedData[2], "Default"];
      }
      let rawGameIdList = rawGameId.split("-");
      let numPieces = rawGameIdList.length
      let found = false;
      while ((!found) && (numPieces > 0)) {
        let testId = rawGameIdList.slice(0,numPieces).join("-");
        if (testId in gameData) {
          found = true;
          if (testId in installed) {
            installed[testId]['versions'].push({"version": parsedGameName[2], "versionShortName": rawGameId});
          } else {
            installed[testId] = {"name": parsedGameName[1].trim(), "versions": []};
            installed[testId]['versions'].push({"version": parsedGameName[2], "versionShortName": rawGameId});
            defaultVersions[testId] = rawGameId;
          }
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

function showWaiting(gameName) {
  let textObj = $("<span></span>").html(`Playing <b>${gameName}</b>.`);
  let iconObj = $("<i></i>", {"class": "fas fa-circle-notch fa-spin"});
  let innerObj = $("<div></div>", {"class": "inner"}).html(iconObj).append(textObj);
  let wrapperObj = $("<div></div>", {"class": "waiting"}).append(innerObj);
  $(document.body).prepend(wrapperObj);
  $(".waiting").fadeIn(500);
}

function hideWaiting() {
  $(".waiting").fadeOut(500, () => {
    $(".waiting").remove();
  });
}

function writeTempConfig(shortName) {
    let tempConfig = [];

    let lineEnd;
    if (os.type() == 'Windows_NT') tempConfigPath = process.env.APPDATA+"\\Scummy\\temp.ini";
    if (os.type() == 'Darwin') tempConfigPath = process.env.HOME+"/Library/Preferences/Scummy";
    tempConfig.push("[scummvm]");
    Object.keys(scummvmConfig['scummvm']).forEach(key => {
      tempConfig.push(`${key}=${scummvmConfig['scummvm'][key]}`);
    });
    Object.keys(scummvmConfig[shortName]).forEach(key => {
      tempConfig.push(`${key}=${scummvmConfig[shortName][key]}`);
    });
    fs.writeFileSync(tempConfigPath, tempConfig.join("\n"), {encoding: "utf8"});
    return tempConfigPath;
}

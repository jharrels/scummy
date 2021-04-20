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
var tempConfig = {};
var installed;
var favorites = [];
var selectedGame = "";
var defaultVersions;
var importGamePath = "";

//Menu.setApplicationMenu(null);

let titlebar = new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex('#1B262C'),
  menu: null,
  overflow: "hidden"
});

/* ----------------------------------------------------------------------------
   LOAD PREFS AND SETUP THE GUI AT LAUNCH
---------------------------------------------------------------------------- */
var listMode = store.get('listMode');
if (listMode === undefined) listMode = "gallery";
$(`#${listMode}-view`).addClass("active");

getScummvmConfigPath();
loadScummvmConfig();
getInstalledGames();

/* ----------------------------------------------------------------------------
   HANDLE GUI EVENTS, SUCH AS CLICKING AND MOVING THE MOUSE
---------------------------------------------------------------------------- */
$("#add-game").on("click", () => {
  let addPath = dialog.showOpenDialogSync(remote.getCurrentWindow(), {
      "title": "Add Game",
      "message": "Choose the directory containing the game to add.",
      "properties": [
        'openDirectory'
      ]
  })
  if (addPath) {
    detectGame(addPath[0]);
  }
});

$("#gallery-view").on("click", () => {
  if (!$("gallery-view").hasClass("active")) {
    $("#list-view").removeClass("active");
    $("#gallery-view").addClass("active");
    listMode = "gallery";
    store.set('listMode', listMode);
    drawGames();
  }
});

$("#list-view").on("click", () => {
  if (!$("list-view").hasClass("active")) {
    $("#gallery-view").removeClass("active");
    $("#list-view").addClass("active");
    listMode = "list";
    store.set('listMode', listMode);
    drawGames();
  }
});

$(".launch-config").on("click", ".configure", function(e) {
  drawGameConfig();
});

$("#override-graphics").on("click", function() {
  enableDisableGraphicsOptionsGui();
});

$("#override-audio").on("click", function() {
  enableDisableAudioOptionsGui();
});

$("#override-volume").on("click", function() {
  enableDisableVolumeOptionsGui();
});

$(".sideBar").on("mouseenter", () => {
  $(".sideBar").addClass("hasScrollBar");
}).on("mouseleave", () => {
  $(".sideBar").removeClass("hasScrollBar");
});

$(".modal-body").on("mouseenter", () => {
  $(".modal-body").addClass("hasScrollBar");
}).on("mouseleave", () => {
  $(".modal-body").removeClass("hasScrollBar");
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

$("#context-menu").on("click", ".manage", function(e) {
  let gameId = $(this).attr("id");
  drawGameInfo(gameId);
});

$(".main").on("contextmenu", ".game", function(e) {
  let gameId = $(this).attr("id");
  selectedGame = gameId;
  if (listMode == "gallery") $(this).children("img").addClass("active");
  if (listMode == "list") $(this).addClass("active");
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
  $("#context-menu").children(".manage").attr("id", gameId);
  $("#context-menu").css({left: e.pageX-50, top: e.pageY-50}).fadeIn(250);
});

$("#context-menu").on("mouseleave", () => {
  $("#context-menu").fadeOut(250);
  if (listMode == "gallery") $(`#${selectedGame}`).children("img").removeClass("active");
  if (listMode == "list") $(`#${selectedGame}`).removeClass("active");
});

$("#game-configure-modal").on("click", ".engine-option", function(e) {
  let flag = $(this).attr("id");
  let shortName = getGameShortName(selectedGame);
  tempConfig[shortName][flag] = $(`#${flag}`).prop("checked");
});

$("#game-configure-modal").on("click", ".graphic-option", function(e) {
  let flag = $(this).attr("id");
  let shortName = getGameShortName(selectedGame);
  if  ($(`#${flag}`).prop("checked")) {
    tempConfig[shortName][flag] = $(`#${flag}`).prop("checked");
  } else {
    delete tempConfig[shortName][flag];
  }
});

$("#game-configure-modal").on("click", ".audio-option", function(e) {
  let flag = $(this).attr("id");
  let shortName = getGameShortName(selectedGame);
  if (flag == "speech_mute") {
    tempConfig[shortName][flag] = (!$(`#${flag}`).prop("checked"));
  } else {
    tempConfig[shortName][flag] = $(`#${flag}`).prop("checked");
  }
});

$("#game-configure-modal").on("change", "select", function(e) {
  let flag = $(this).attr("id");
  let shortName = getGameShortName(selectedGame);
  if ($(this).val() == "default") {
    delete tempConfig[shortName][flag]
  } else {
    tempConfig[shortName][flag] = $(this).val();
  }
});

$("#game-configure-modal").on("input", ".audio-option-slider", function(e) {
  let flag = $(this).attr("id");
  let shortName = getGameShortName(selectedGame);
  tempConfig[shortName][flag] = $(this).val();
  $(`#span-${flag}`).html($(this).val());
});

$("#game-configure-modal").on("input", ".volume-option-slider", function(e) {
  let flag = $(this).attr("id");
  let shortName = getGameShortName(selectedGame);
  tempConfig[shortName][flag] = $(this).val();
  $(`#span-${flag}`).html($(this).val());
});

$("#add-modal-no").on("click", () => {
  hideModal("#add-modal");
});

$("#add-modal-yes").on("click", () => {
  hideModal("#add-modal");
  importGame(importGamePath);
});

$("#exists-modal-close").on("click", () => {
  hideModal("#exists-modal");
});

$("#unknown-modal-close").on("click", () => {
  hideModal("#unknown-modal");
});

$("#game-info-close").on("click", () => {
  $("#game-info").fadeOut(250);
});

$("#game-configure-modal-cancel").on("click", () => {
  tempConfig = {};
  $("#game-configure-modal").fadeOut(250);
});

$("#game-configure-modal-save").on("click", () => {
  let shortName = getGameShortName(selectedGame);
  enableDisableGraphicsOptions(shortName);
  enableDisableAudioOptions(shortName);
  enableDisableVolumeOptions(shortName);
  scummvmConfig = JSON.parse(JSON.stringify(tempConfig));
  fs.writeFileSync(scummvmConfigPath, ini.stringify(scummvmConfig));
  $("#game-configure-modal").fadeOut(250);
});


/* ----------------------------------------------------------------------------
   FUNCTIONS
---------------------------------------------------------------------------- */
function enableDisableGraphicsOptions(gameShortName) {
  if ($("#override-graphics").prop("checked")) {
    tempConfig[gameShortName]['gfx_mode'] = $("#gfx_mode").val();
    tempConfig[gameShortName]['render_mode'] = $("#render_mode").val();
    tempConfig[gameShortName]['stretch_mode'] = $("#stretch_mode").val();
    tempConfig[gameShortName]['aspect_ratio'] = $("#aspect_ratio").prop("checked");
    tempConfig[gameShortName]['fullscreen'] = $("#fullscreen").prop("checked");
    tempConfig[gameShortName]['filtering'] = $("#filtering").prop("checked");
  } else {
    delete tempConfig[gameShortName]['gfx_mode'];
    delete tempConfig[gameShortName]['render_mode'];
    delete tempConfig[gameShortName]['stretch_mode'];
    delete tempConfig[gameShortName]['aspect_ratio'];
    delete tempConfig[gameShortName]['fullscreen'];
    delete tempConfig[gameShortName]['filtering'];
  }
}

function enableDisableAudioOptions(gameShortName) {
  if ($("#override-audio").prop("checked")) {
    tempConfig[gameShortName]['music_driver'] = $("#music_driver").val();
    tempConfig[gameShortName]['opl_driver'] = $("#opl_driver").val();
    tempConfig[gameShortName]['speech_mute'] = (!$("#speech_mute").prop("checked"));
    tempConfig[gameShortName]['subtitles'] = $("#subtitles").prop("checked");
    tempConfig[gameShortName]['talkspeed'] = $("#talkspeed").val();
  } else {
    delete tempConfig[gameShortName]['music_driver'];
    delete tempConfig[gameShortName]['opl_driver'];
    delete tempConfig[gameShortName]['speech_mute'];
    delete tempConfig[gameShortName]['subtitles'];
    delete tempConfig[gameShortName]['talkspeed'];
  }
}

function enableDisableVolumeOptions(gameShortName) {
  if ($("#override-volume").prop("checked")) {
    tempConfig[gameShortName]['music_volume'] = $("#music_volume").val();
    tempConfig[gameShortName]['sfx_volume'] = $("#sfx_volume").val();
    tempConfig[gameShortName]['speech_volume'] = $("#speech_volume").val();
  } else {
    delete tempConfig[gameShortName]['music_volume'];
    delete tempConfig[gameShortName]['sfx_volume'];
    delete tempConfig[gameShortName]['speech_volume'];
  }
}

function enableDisableGraphicsOptionsGui() {
  let gameShortName = getGameShortName(selectedGame);
  if ($("#override-graphics").prop("checked")) {
    $(".graphics-options-wrapper").removeClass("disabled-option");
  } else {
    $(".graphics-options-wrapper").addClass("disabled-option");
  }
}

function enableDisableAudioOptionsGui() {
  let gameShortName = getGameShortName(selectedGame);
  if ($("#override-audio").prop("checked")) {
    $(".audio-options-wrapper").removeClass("disabled-option");
  } else {
    $(".audio-options-wrapper").addClass("disabled-option");
  }
}

function enableDisableVolumeOptionsGui() {
  let gameShortName = getGameShortName(selectedGame);
  if ($("#override-volume").prop("checked")) {
    $(".volume-options-wrapper").removeClass("disabled-option");
  } else {
    $(".volume-options-wrapper").addClass("disabled-option");
  }
}

function graphicsOverridden(gameShortName) {
  let override = false;
  if ('gfx_mode' in scummvmConfig[gameShortName]) override = true;
  if ('render_mode' in scummvmConfig[gameShortName]) override = true;
  if ('stretch_mode' in scummvmConfig[gameShortName]) override = true;
  if ('aspect_ratio' in scummvmConfig[gameShortName]) override = true;
  if ('fullscreen' in scummvmConfig[gameShortName]) override = true;
  if ('filtering' in scummvmConfig[gameShortName]) override = true;
  return override;
}

function audioOverridden(gameShortName) {
  let override = false;
  if ('music_driver' in scummvmConfig[gameShortName]) override = true;
  if ('opl_driver' in scummvmConfig[gameShortName]) override = true;
  if ('speech_mute' in scummvmConfig[gameShortName]) override = true;
  if ('subtitles' in scummvmConfig[gameShortName]) override = true;
  if ('talkspeed' in scummvmConfig[gameShortName]) override = true;
  return override;
}

function volumeOverridden(gameShortName) {
  let override = false;
  if ('music_volume' in scummvmConfig[gameShortName]) override = true;
  if ('sfx_volume' in scummvmConfig[gameShortName]) override = true;
  if ('speech_volume' in scummvmConfig[gameShortName]) override = true;
  return override;
}

function getGameShortName(gameId) {
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

function drawGameConfig() {
  tempConfig = JSON.parse(JSON.stringify(scummvmConfig));
  $(".engine-options-wrapper").html("");
  $(".graphics-options-wrapper").html("");
  $(".audio-options-wrapper").html("");
  $(".volume-options-wrapper").html("");
  let engine = gameData[selectedGame]['engine'];
  if (engineOptions[engine].length == 0) {
    let optionObj = $("<div></div>", {"class": "modal-option"}).text("There are no configuration options for this engine.");
    $(".engine-options-wrapper").append(optionObj);
    $("#game-configure-modal-yes").hide();
    $("#game-configure-modal-cancel").html("OK");
  } else {
    let gameShortName = getGameShortName(selectedGame);
    for (i=0; i<engineOptions[engine].length; i++) {
      let option = engineOptions[engine][i];
      inputObj = $("<input>", {"type": "checkbox", "id": option['flag'], "class": "engine-option"});
      optionObj = $("<div></div>", {"class": "modal-option"}).html(inputObj).append(` ${option['shortDesc']}`);
      $(".engine-options-wrapper").append(optionObj);
      if (tempConfig[gameShortName][option['flag']]) {
        $(`#${option['flag']}`).prop("checked", true);
      }
    }
    for (i=0; i<generalGameOptions['graphics'].length; i++) {
      let option = generalGameOptions['graphics'][i];
      if (option['type'] == "bool") {
        inputObj = $("<input>", {"type": "checkbox", "id": option['flag'], "class": "graphic-option"});
        optionObj = $("<div></div>", {"class": "modal-option indent"}).html(inputObj).append(` ${option['label']}`);
        $(".graphics-options-wrapper").append(optionObj);
        if (tempConfig[gameShortName][option['flag']]) $(`#${option['flag']}`).prop("checked", true);
      }
      if (option['type'] == "list") {
        selectObj = $("<select></select>", {"id": option['flag']});
        for (o=0; o<option['values'].length; o++) {
          let selectOption = option['values'][o];
          optionObj = $("<option></option>", {"value": selectOption['value']}).text(selectOption['text']);
          $(selectObj).append(optionObj);
        }
        tdLabelObj = $("<td></td>").html(option['label']);
        tdSelectObj = $("<td></td>").html(selectObj);
        trObj = $("<tr></tr>").append(tdLabelObj).append(tdSelectObj);
        tableObj = $("<table></table>").html(trObj);
        optionObj = $("<div></div>", {"class": "modal-option indent"}).html(tableObj);
        $(".graphics-options-wrapper").append(optionObj);
        if (option['flag'] in tempConfig[gameShortName]) $(`#${option['flag']}`).val(tempConfig[gameShortName][option['flag']]);
      }
    }
    for (i=0; i<generalGameOptions['audio'].length; i++) {
      let option = generalGameOptions['audio'][i];
      if (option['type'] == "bool") {
        inputObj = $("<input>", {"type": "checkbox", "id": option['flag'], "class": "audio-option"});
        optionObj = $("<div></div>", {"class": "modal-option indent"}).html(inputObj).append(` ${option['label']}`);
        $(".audio-options-wrapper").append(optionObj);
        if (option['mode'] == "invert") {
          if (tempConfig[gameShortName][option['flag']]) {
            $(`#${option['flag']}`).prop("checked", false);
          } else {
            $(`#${option['flag']}`).prop("checked", true);
          }
        } else {
          if (tempConfig[gameShortName][option['flag']]) {
            $(`#${option['flag']}`).prop("checked", true);
          } else {
            $(`#${option['flag']}`).prop("checked", false);
          }
        }
      }
      if (option['type'] == "list") {
        selectObj = $("<select></select>", {"id": option['flag']});
        for (o=0; o<option['values'].length; o++) {
          let selectOption = option['values'][o];
          optionObj = $("<option></option>", {"value": selectOption['value']}).text(selectOption['text']);
          $(selectObj).append(optionObj);
        }
        tdLabelObj = $("<td></td>").html(option['label']);
        tdSelectObj = $("<td></td>").html(selectObj);
        trObj = $("<tr></tr>").append(tdLabelObj).append(tdSelectObj);
        tableObj = $("<table></table>").html(trObj);
        optionObj = $("<div></div>", {"class": "modal-option indent"}).html(tableObj);
        $(".audio-options-wrapper").append(optionObj);
        if (option['flag'] in tempConfig[gameShortName]) $(`#${option['flag']}`).val(tempConfig[gameShortName][option['flag']]);
      }
      if (option['type'] == "slid") {
        inputObj = $("<input>", {"type": "range", "id": option['flag'], "min": option['min'], "max": option['max'], "value": option['default'], "class": "audio-option-slider"});
        tdLabelObj = $("<td></td>").html(option['label']);
        valObj = $("<span></span>", {"id": `span-${option['flag']}`, "class": "audio-option-value"}).text(tempConfig[gameShortName][option['flag']]);
        tdInputObj = $("<td></td>").html(inputObj).append(valObj);
        trObj = $("<tr></tr>").append(tdLabelObj).append(tdInputObj);
        tableObj = $("<table></table>").html(trObj);
        optionObj = $("<div></div>", {"class": "modal-option indent"}).html(tableObj);
        $(".audio-options-wrapper").append(optionObj);
        if (option['flag'] in tempConfig[gameShortName]) $(`#${option['flag']}`).val(tempConfig[gameShortName][option['flag']]);
      }
    }
    for (i=0; i<generalGameOptions['volume'].length; i++) {
      let option = generalGameOptions['volume'][i];
      if (option['type'] == "slid") {
        inputObj = $("<input>", {"type": "range", "id": option['flag'], "min": option['min'], "max": option['max'], "value": option['default'], "class": "volume-option-slider"});
        tdLabelObj = $("<td></td>").html(option['label']);
        valObj = $("<span></span>", {"id": `span-${option['flag']}`, "class": "volume-option-value"}).text(tempConfig[gameShortName][option['flag']]);
        tdInputObj = $("<td></td>").html(inputObj).append(valObj);
        trObj = $("<tr></tr>").append(tdLabelObj).append(tdInputObj);
        tableObj = $("<table></table>").html(trObj);
        optionObj = $("<div></div>", {"class": "modal-option indent"}).html(tableObj);
        $(".volume-options-wrapper").append(optionObj);
        if (option['flag'] in tempConfig[gameShortName]) $(`#${option['flag']}`).val(tempConfig[gameShortName][option['flag']]);
      }
    }
    if (graphicsOverridden(gameShortName)) $("#override-graphics").prop("checked", true);
    if (audioOverridden(gameShortName)) $("#override-audio").prop("checked", true);
    if (volumeOverridden(gameShortName)) $("#override-volume").prop("checked", true);
    enableDisableGraphicsOptionsGui();
    enableDisableAudioOptionsGui();
    $("#game-configure-modal-yes").show();
    $("#game-configure-modal-cancel").html("Cancel");
  }
  showModal("#game-configure-modal");
}

function drawCategories() {
  $("#sideBarCategories").html("");
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

function drawGameInfo(gameId) {
  selectedGame = gameId;
  let category = gameData[gameId]['category'];
  let imagePath = `boxart/${category}/${gameId}.jpg`;
  try {
    fs.accessSync(imagePath, fs.constants.R_OK);
  } catch(err) {
     imagePath = "boxart/missing.jpg";
  }
  let gameImageObj = $("<img></img", {"src": imagePath});
  let favoriteTextObj = $("<i></i>", {"class": "far fa-heart"});
  let favoriteObj = $("<div></div>", {"class": "game-info-favorite"}).html(favoriteTextObj).append(" Favorite");
  let titleObj = $("<div></div>", {"class": "game-info-title"});
  $(".launch-config").html(titleObj);
  let longName = installed[gameId]['name'];
  if (longName.substr(-5, 5) == ", The") longName = "The "+longName.substr(0,longName.length - 5);
  $(".game-info-title").html(longName);
  $(".game-info-boxart").html(gameImageObj).append(favoriteObj);
  for (i=0; i<installed[gameId]['versions'].length; i++) {
    if (installed[gameId]['versions'][i]['version'] == "Default") {
      let menuIconObj = $("<i></i>", {"class": "fas fa-play fa-fw"});
      let menuItemObj = $("<div></div>", {"class": "menu-button"}).html(menuIconObj).append(" Play");
      let cfgIconObj = $("<i></i>", {"class": "fas fa-cog fa-fw"});
      let cfgItemObj = $("<div></div>", {"class": "game-info-configure"}).html(cfgIconObj);
      let defaultIconObj = $("<i></i>", {"class": "fas fa-star fa-fw"});
      let defaultItemObj = $("<div></div>", {"class": "game-info-default"}).html(defaultIconObj);
      let wrapperObj = $("<div></div>").html(menuItemObj).append(cfgItemObj).append(defaultItemObj);
      $(".launch-config").append(wrapperObj);
    } else {
      let versionObj = $("<span></span>", {"class":"game-info-version"}).text(installed[gameId]['versions'][i]['version']);
      let wrapperObj = $("<div></div>", {"class": "game-info-wrapper"}).html(versionObj);
      $(".launch-config").append(wrapperObj);
      let menuIconObj = $("<i></i>", {"class": "fas fa-play fa-fw"});
      let menuItemObj = $("<div></div>", {"class": "menuButton no-left-margin bright play"}).html(menuIconObj).append(" Play");
      let cfgIconObj = $("<i></i>", {"class": "fas fa-cog fa-fw"});
      let cfgItemObj = $("<div></div>", {"class": "menuButton bright configure"}).html(cfgIconObj).append(" Configure");
      let defaultIconObj = $("<i></i>", {"class": "fas fa-star fa-fw"});
      let defaultItemObj = $("<div></div>", {"class": "menuButton bright default"}).html(defaultIconObj).append(" Default");;
      wrapperObj = $("<div></div>", {"class": "game-info-wrapper", "id": i}).html(menuItemObj).append(cfgItemObj).append(defaultItemObj);
      $(".launch-config").append(wrapperObj);
      if (i < installed[gameId]['versions'].length - 1) {
        let hrObj = $("<hr>", {"class": "game-info-divider"});
        $(".launch-config").append(hrObj);
      }
    }
  }
  $("#context-menu").fadeOut(250);
  $("#game-info").fadeIn(250);
}

function drawGames() {
  $("#grid").remove();
  $("#list").remove();
  let longNames = {};
  Object.keys(installed).forEach(key => {
    longNames[installed[key]['name']] = key;
  });
  if (listMode == "gallery") {
    let grid = $("<div></div>", {"id": "grid"});
    $(".main").html("").append(grid);
    Object.keys(longNames).sort().forEach(key => {
      let category = gameData[longNames[key]]['category'];
      let imagePath = `boxart/${category}/${longNames[key]}.jpg`;
      try {
        fs.accessSync(imagePath, fs.constants.R_OK);
      } catch(err) {
         imagePath = "boxart/missing.jpg";
      }
      let gameImageObj = $("<img></img", {"src": imagePath});
      let gameNameObj = $("<span></span>").text(key);
      let rowObj = $("<div></div>", {"class": "game", "id": longNames[key]}).append(gameImageObj).append(gameNameObj);
      $("#grid").append(rowObj);
    });
  }
  if (listMode == "list") {
    let list = $("<div></div>", {"id": "list"});
    $(".main").html("").append(list);
    Object.keys(longNames).sort().forEach(key => {
      let category = gameData[longNames[key]]['category'];
      let imagePath = `boxart/${category}/${longNames[key]}.jpg`;
      try {
        fs.accessSync(imagePath, fs.constants.R_OK);
      } catch(err) {
         imagePath = "boxart/missing.jpg";
      }
      let gameImageObj = $("<img></img", {"src": imagePath});
      let gameNameObj = $("<span></span>").text(key);
      let rowObj = $("<div></div>", {"class": "game", "id": longNames[key]}).append(gameImageObj).append(gameNameObj);
      $("#list").append(rowObj);
    });
  }
}

function getInstalledGames() {
  installed = {};
  defaultVersions = {};
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
            let longName = parsedGameName[1].trim();
            let firstLetter = longName.charAt(0).toUpperCase();
            longName = firstLetter + longName.slice(1);
            if (longName.substr(0, 4) == "The ") longName = longName.substr(4) + ", The";
            installed[testId] = {"name": longName, "versions": []};
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

function detectGame(gamePath) {
  gamePath = gamePath.split("\\").join("\\\\");
  importGamePath = gamePath;
  let launchOptions = ['--detect', `--path="${gamePath}"`];
  let rawData = "";
  let scummvm = spawn('scummvm.exe', launchOptions, {'cwd': 'c:\\Program Files\\scummvm', 'shell': true});
  scummvm.stdout.on('data', (data) => {
    rawData += data.toString();
  });

  scummvm.stderr.on('data', (data) => {
  });

  scummvm.on('exit', (code) => {
    rawDataList = rawData.split("\r\n");
    let parsedData = rawDataList[2].match(/.+?:(.+?)[ ]{2,}(.+?)[ ]{2,}/);
    if (parsedData) {
      let shortName = parsedData[1].trim();
      let category = gameData[shortName]['category'];
      let imagePath = `boxart/${category}/${shortName}.jpg`;
      try {
        fs.accessSync(imagePath, fs.constants.R_OK);
      } catch(err) {
         imagePath = "boxart/missing.jpg";
      }
      if (parsedData[2].includes("(")) {
        parsedGameName = parsedData[2].match(/^(.+?)\((.+?)\)$/);
      } else {
        parsedGameName = ["", parsedData[2], "Default"];
      }
      let alreadyInstalled = false;
      if (shortName in installed) {
        for (i=0; i<installed[shortName]['versions'].length; i++) {
          if (installed[shortName]['versions'][i]['version'] == parsedGameName[2]) alreadyInstalled = true;
        }
      }
      if (alreadyInstalled) {
        let imageObj = $("<img></img", {"src": imagePath});
        $("#exists-modal").children(".modal-wrapper").children(".modal-body").children(".modal-boxart").html(imageObj);
        let versionObj = $("<small></small>").text(`(${parsedGameName[2]})`);
        let gameNameObj = $("<span></span>", {"class": "game-name"}).text(parsedGameName[1]).append(versionObj);
        $("#exists-modal").children(".modal-wrapper").children(".modal-body").children(".modal-message").html(gameNameObj).append("This version of this game has already been imported.");
        showModal("#exists-modal");
      }
      if ((!alreadyInstalled) && (shortName in installed)) {
        let imageObj = $("<img></img", {"src": imagePath});
        $("#add-modal").children(".modal-wrapper").children(".modal-body").children(".modal-boxart").html(imageObj);
        let versionObj = $("<small></small>").text(`(${parsedGameName[2]})`);
        let gameNameObj = $("<span></span>", {"class": "game-name"}).text(parsedGameName[1]).append(versionObj);
        $("#add-modal").children(".modal-wrapper").children(".modal-body").children(".modal-message").html(gameNameObj).append("A game has been detected. Would you like to import it?");
        showModal("#add-modal");
      }
      if ((!alreadyInstalled) && (!(shortName in installed))) {
        let imageObj = $("<img></img", {"src": imagePath});
        $("#add-modal").children(".modal-wrapper").children(".modal-body").children(".modal-boxart").html(imageObj);
        let versionObj = $("<small></small>").text(`(${parsedGameName[2]})`);
        let gameNameObj = $("<span></span>", {"class": "game-name"}).text(parsedGameName[1]).append(versionObj);
        $("#add-modal").children(".modal-wrapper").children(".modal-body").children(".modal-message").html(gameNameObj).append("A game has been detected. Would you like to import it?");
        showModal("#add-modal");
      }
    } else {
      alertObj = $("<i></i>", {"class": "fas fa-exclamation-triangle warning-color fa-3x"});
      $("#unknown-modal").children(".modal-wrapper").children(".modal-body").children(".modal-boxart").html(alertObj);
      $("#unknown-modal").children(".modal-wrapper").children(".modal-body").children(".modal-message").html("No game was detected.");
      showModal("#unknown-modal");
    }
  })
}

function importGame(gamePath) {
  let launchOptions = ['--add', `--path="${gamePath}"`];
  let rawData = "";
  let scummvm = spawn('scummvm.exe', launchOptions, {'cwd': 'c:\\Program Files\\scummvm', 'shell': true});
  scummvm.stdout.on('data', (data) => {
    rawData += data.toString();
  });

  scummvm.stderr.on('data', (data) => {
  });

  scummvm.on('exit', (code) => {
    loadScummvmConfig();
    getInstalledGames();
    drawGames();
  })
}

function showModal(modalId) {
  $(modalId).fadeIn(250);
}

function hideModal(modalId) {
  $(modalId).fadeOut(250);
}

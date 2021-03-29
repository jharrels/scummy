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

//Menu.setApplicationMenu(null);

let titlebar = new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex('#000'),
  menu: null,
  overflow: "hidden"
});

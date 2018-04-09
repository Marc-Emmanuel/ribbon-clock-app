const path = require('path');
const fs = require("fs");
const url = require('url');
const Electron = require('electron')

// Module to control application life.
const app = Electron.app

// Module to create native browser window.
const BrowserWindow = Electron.BrowserWindow;
const Menu = Electron.Menu;
const ipcMain = Electron.ipcMain;
const globalShortcut = Electron.globalShortcut;
const tray = Electron.nativeImage.createEmpty();

const DEBUG = true;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let appTray = null;

const userData = app.getPath('userData');
var storeData = null;
//Create store if does not exist
var storeExists = fs.existsSync(path.join(userData, "prefs.json"));
if (DEBUG) {
    console.log("Store exists ? " + storeExists);
}
if (!storeExists) {
    storeData = {
        fontcolor: 'wc'
    };
    fs.writeFileSync(path.join(userData, "prefs.json"), storeData, 'utf-8');
} else {
    storeData = JSON.parse(fs.readFileSync(path.join(userData, "prefs.json")), 'utf-8');
}
if (DEBUG) {
    console.log(storeData);
}

function createWindow() {
    //Disable devtools
    if (!DEBUG) {
        globalShortcut.register("CmdOrCtrl+Alt+I", () => {
            if (DEBUG) {
                console.log("devtools");
            }
        });
    }
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 140,
        height: 140,
        transparent: true,
        hasShadow: false,
        //backgroundColor: "#80FFFFFF",
        resizable: false,
        frame: false
    });
    mainWindow.setAlwaysOnTop(true);

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    appTray = new Electron.Tray(tray);

    var menuObj0 = {
        label: 'White font color',
        id: "wc",
        type: 'radio',
        click: function (item) {
            trayClickHandler(item);
        },
    };
    var menuObj1 = {
        label: 'Black font color',
        id: "bc",
        type: 'radio',
        click: function (item) {
            trayClickHandler(item);
        }
    };

    if (storeData.fontcolor === "wc") {
        menuObj0.checked = true;
    } else {
        menuObj1.checked = true;
    }
    const contextMenu = Menu.buildFromTemplate([
        menuObj0, menuObj1, {
            label: "Quit",
            id: "q",
            role: "quit"
        }
    ]);


    appTray.setToolTip("Ribbon clock app");
    // Call this again for Linux because we modified the context menu
    appTray.setContextMenu(contextMenu);

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
var trayClickHandler = function (trayItem) {
    if (DEBUG) {
        console.log("Place holder: " + trayItem.label + ", " + trayItem.id + ", " + trayItem.checked);
    }
    storeData.fontcolor = trayItem.id;
    fs.writeFileSync(path.join(userData, "prefs.json"), JSON.stringify(storeData), 'utf-8');
    mainWindow.webContents.send("timecolor", trayItem.id);
}

ipcMain.on("asynclog", (event, arg) => {
    console.log(arg);
});

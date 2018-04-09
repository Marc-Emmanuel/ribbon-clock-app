const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const app = electron.remote.app;
const fs = require("fs");
const path = require("path");

var colorPref = JSON.parse(fs.readFileSync(path.join(app.getPath("userData"), 'prefs.json'), 'utf-8'));

if(colorPref.fontcolor === "wc"){
    labelClass = "label text-white";
}
if(colorPref.fontcolor === "bc"){
    labelClass = "label text-black";
}

ipcRenderer.on("timecolor", (event, arg) => {
    console.log(arg);
    var c = "";
    if (arg === "wc") {
        c += "label text-white";
    }
    if (arg === "bc") {
        c += "label text-black";
    }
    labelClass = c;
    label.attr("class", c);
    ipcRenderer.send("asynclog", "received " + arg + " | changed label class to " + c);
});

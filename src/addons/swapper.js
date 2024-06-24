const { app, session, protocol, clipboard, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");
const url = require("url");
const Store = require('electron-store');


const initResourceSwapper = () => {
  protocol.registerFileProtocol("karimcustomclient", (request, callback) =>
    callback({ path: request.url.replace("karimcustomclient://", "") })
  );

  const SWAP_FOLDER = path.join(
    app.getPath("documents"),
    "KarimCustomClient",
    "swapper"
  );

  const assetsFolder = path.join(SWAP_FOLDER, "assets");
  const folders = ["css", "media", "img", "glb"];

  try {
    if (!fs.existsSync(assetsFolder))
      fs.mkdirSync(assetsFolder, { recursive: true });
    folders.forEach((folder) => {
      const folderPath = path.join(assetsFolder, folder);
      if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath, { recursive: true });
    });
  } catch (e) {
    console.error(e);
  }

  const swap = {
    filter: { urls: [] },
    files: {},
  };

  const allFilesSync = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) allFilesSync(filePath);
      else {
        const useAssets =
          /KarimCustomClient[\\/]swapper[\\/]assets[\\/](css|media|img|glb)[\\/].*\.(.{4})/.test(
            filePath
          );
        if (!useAssets) return;

        const kirk =
          "*://" +
          (useAssets ? "kirka.io" : "") +
          filePath.replace(SWAP_FOLDER, "").replace(/\\/g, "/") +
          "*";
        swap.filter.urls.push(kirk);
        swap.files[kirk.replace(/\*/g, "")] = url.format({
          pathname: filePath,
          protocol: "",
          slashes: false,
        });
      }
    });
  };

  allFilesSync(SWAP_FOLDER);

  if (swap.filter.urls.length) {
    session.defaultSession.webRequest.onBeforeRequest(
      swap.filter,
      (details, callback) => {
        const redirect =
          "karimcustomclient://" +
          (swap.files[details.url.replace(/https|http|(\?.*)|(#.*)/gi, "")] ||
            details.url);
        callback({ cancel: false, redirectURL: redirect });
      }
    );
  }
};

module.exports = { initResourceSwapper };

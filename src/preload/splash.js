const { ipcRenderer } = require("electron");
const version = require("../../package.json").version;

document.addEventListener("DOMContentLoaded", () => {
  const versionElement = document.querySelector(".ver");
  const statusElement = document.querySelector(".status");

  versionElement.textContent = `v${version}`;

  const updateStatus = (status) => {
    statusElement.textContent = status;
  };

  ipcRenderer.send("check-for-updates");
  updateStatus("Waiting...");

  ipcRenderer.on("update-available", () => {
    updateStatus("Downloading...");
  });

  ipcRenderer.on("update-not-available", () => {
    updateStatus("No updates available.");
  });

  ipcRenderer.on("update-downloaded", () => {
    updateStatus("Installing...");
    ipcRenderer.send("quit-and-install");
  });

  ipcRenderer.on("download-progress", (e, progress) => {
    updateStatus(`Downloading update... ${progress.percent}%`);
  });
});
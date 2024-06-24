const version = require("../../package.json").version;

const initRPC = () => {
  class RPC {
    constructor() {
      this.client = new (require("discord-rpc-revamp").Client)();
      this.client.connect({ clientId: "1190310085721858089" }).catch();
      this.client.on("ready", () => {
        this.client
          .setActivity({
            details: '🔵 Playing',
            startTimestamp: Date.now(),
            state:"In game",
            largeImageKey: "karimcustomclient",
            largeImageText: `Kitten Client v${version}`,
            buttons: [
              { label: "Download", url: "https://discord.gg/SCmj2sE5aW" },
              { label: "Discord", url: "https://discord.gg/SCmj2sE5aW" },
            ],
          })
          .catch();
      });
    }
  }
  new RPC();
};

module.exports = { initRPC };
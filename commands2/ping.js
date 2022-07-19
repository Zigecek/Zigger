
const { bot } = require("../bot");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "ping",
  cooldown: 1,
  aliases: [],
  category: "other",
  execute(int, serverQueue, Gres) {
    if (!int.channel.permissionsFor(int.guild.members.me).has("SEND_MESSAGES")) return;

    followReply(int, { content: LMessages.pingingMessage }).then(
      (resultMessage) => {
        const ping = resultMessage.createdTimestamp - int.createdTimestamp;

        resultMessage.edit(
          template(
            LMessages.pingMessage,
            { delay: ping, apiDelay: bot.ws.ping },
            { before: "%", after: "%" }
          )
        );
      }
    );
  },
};

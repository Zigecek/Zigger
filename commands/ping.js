
const { bot } = require("../bot");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);

module.exports = {
  name: "ping",
  cooldown: 1,
  aliases: [],
  category: "other",
  execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages))
      return;

    message.channel.send(LMessages.pingingMessage).then((resultMessage) => {
      const ping = resultMessage.createdTimestamp - message.createdTimestamp;

      resultMessage.edit(
        template(
          LMessages.pingMessage,
          { delay: ping, apiDelay: bot.ws.ping },
          { before: "%", after: "%" }
        )
      );
    });
  },
};

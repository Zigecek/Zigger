
const Guild = require("../models/guild.js");
const template = require("string-placeholder");
const error = require("../utils/error");
const LMessages = require(`../messages/`);

module.exports = {
  name: "prefix",
  cooldown: 2,
  aliases: [],
  category: "settings",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      if (args[0] == null) {
        message.channel.send(
          template(
            LMessages.prefix.info,
            { prefix: prefix },
            { before: "%", after: "%" }
          )
        );
      } else if (args[0] == "set") {
        if (args[1] == null) {
          message.channel.send(LMessages.prefix.use);
        } else {
          await Guild.updateOne(
            {
              guildID: message.guild.id,
            },
            {
              prefix: args[1],
            }
          );
          message.channel.send(
            template(
              LMessages.prefix.set,
              { guild: Gres.guildName, prefix: args[1] },
              { before: "%", after: "%" }
            )
          );
        }
      }
    } else {
      message.channel.send(LMessages.noPermission);
    }
  },
};

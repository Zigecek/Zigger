
const Config = require("../models/Config");
const botFile = require("../bot");
const error = require("../utils/error");
const LMessages = require(`../messages/`);

module.exports = {
  name: "calladmin",
  cooldown: 180,
  aliases: ["ca"],
  category: "settings",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    var Gres = await Config.findOne({
      number: 1,
    });

    let admin = message.guild.members.cache.get(Gres.botAdminDiscordID[0]);

    if (admin) {
      admin.send(
        "**Error:** " + message.url + " \nGuildID:" + message.guild.id
      );

      message.channel.send(LMessages.adminNotified);

      return;
    } else {
      message.channel.send(LMessages.error);
    }
  },
};

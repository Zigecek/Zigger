const Discord = require("discord.js");
const Config = require("../models/Config");
const botFile = require("../bot");
const error = require("../utils/error");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "calladmin",
  cooldown: 180,
  aliases: ["ca"],
  category: "settings",
  async execute(int, serverQueue, Gres) {
    var Gres = await Config.findOne({
      number: 1,
    });

    let admin = int.guild.members.cache.get(Gres.botAdminDiscordID[0]);

    if (admin) {
      admin.send("**Error:** " + int.url + " \nGuildID:" + int.guild.id);

      followReply(int, { content: LMessages.adminNotified });

      return;
    } else {
      followReply(int, { content: LMessages.error });
    }
  },
};

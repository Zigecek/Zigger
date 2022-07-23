const Discord = require("discord.js");
const Config = require("../models/Config");
const error = require("../utils/error");
const LMessages = require(`../messages/`);

module.exports = {
  name: "eval",
  cooldown: 1,
  aliases: [],
  category: "dev",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    var Cres = await Config.findOne({
      number: 1,
    });

    if (Cres.botAdminDiscordID.includes(message.author.id)) {
      var string = args.join(" ");

      let result = await eval(string);

      message.channel.send("**RESULT: ** \n```JS\n" + result + "\n```");
    } else {
      message.channel.send(LMessages.noPermission);
    }
  },
};

const Discord = require("discord.js");
const Guild = require("../models/guild.js");
const template = require("string-placeholder");
const error = require("../utils/error");
const { followReply } = require("../utils/functions");
const LMessages = require(`../messages/`);

module.exports = {
  name: "prefix",
  cooldown: 2,
  aliases: [],
  category: "settings",
  async execute(int, serverQueue, Gres) {
    if (int.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
      if (int.options.getSubcommand() == "info") {
        followReply(int, {
          content: template(
            LMessages.prefix.info,
            { prefix: Gres.prefix },
            { before: "%", after: "%" }
          ),
        });
      } else if (int.options.getSubcommand() == "set") {
        await Guild.updateOne(
          {
            guildID: int.guild.id,
          },
          {
            prefix: int.options.get("prefix").value,
          }
        );

        followReply(int, {
          content: template(
            LMessages.prefix.set,
            {
              guild: Gres.guildName,
              prefix: int.options.get("prefix").value,
            },
            { before: "%", after: "%" }
          ),
        });
      }
    } else {
      followReply(int, { content: LMessages.noPermission });
    }
  },
};

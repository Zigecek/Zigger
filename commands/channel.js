
const Guild = require("../models/guild");
const error = require("../utils/error");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);

module.exports = {
  name: "channel",
  cooldown: 2,
  aliases: [],
  category: "moderation",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
      return;
    if (
      message.member.permissions.has("ADMINISTRATOR") ||
      message.member.permissions.has("MANAGE_CHANNELS")
    ) {
      if (args[0] == "wel") {
        if (args[1] == null) {
          var Gres = await Guild.findOne({
            guildID: message.guild.id,
          });
          if (Gres.welChannelID == null) {
            message.channel.send(LMessages.channels.wel.notSet);
          } else {
            message.channel.send(
              template(
                LMessages.channels.wel.whatIs,
                { log: "<#" + Gres.welChannelID + ">" },
                { before: "%", after: "%" }
              )
            );
          }
        } else if (args[1] == "set") {
          if (args[2] != null) {
            if (!message.mentions.channels.first()) {
              message.channel.send(LMessages.channels.notFoundOrNoMention);

              return;
            }
            await Guild.updateOne(
              {
                guildID: message.guild.id,
              },
              {
                welChannelID: message.mentions.channels.first().id,
              }
            );
            message.channel.send(
              template(
                LMessages.channels.wel.set,
                { log: "<#" + message.mentions.channels.first().id + ">" },
                { before: "%", after: "%" }
              )
            );
          } else {
            message.channel.send(
              template(
                LMessages.channels.wel.use,
                { prefix: prefix },
                { before: "%", after: "%" }
              )
            );
          }
        }
      } else if (args[0] == "bye") {
        if (args[1] == null) {
          var Gres = await Guild.findOne({
            guildID: message.guild.id,
          });

          if (Gres.byeChannelID == null) {
            message.channel.send(LMessages.channels.bye.notSet);
          } else {
            message.channel.send(
              template(
                LMessages.channels.bye.whatIs,
                { bye: "<#" + Gres.byeChannelID + ">" },
                { before: "%", after: "%" }
              )
            );
          }
        } else if (args[1] == "set") {
          if (args[2] != null) {
            if (!message.mentions.channels.first()) {
              message.channel.send(LMessages.channels.notFoundOrNoMention);

              return;
            }
            await Guild.updateOne(
              {
                guildID: message.guild.id,
              },
              {
                byeChannelID: message.mentions.channels.first().id,
              }
            );
            message.channel.send(
              template(
                LMessages.channels.bye.set,
                { bye: "<#" + message.mentions.channels.first().id + ">" },
                { before: "%", after: "%" }
              )
            );
          }
        } else {
          message.channel.send(
            template(
              LMessages.channels.bye.use,
              { prefix: prefix },
              { before: "%", after: "%" }
            )
          );
        }
      } else {
      }
    } else {
      message.channel.send(LMessages.noPermission);
    }
  },
};

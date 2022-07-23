
const Guild = require("../models/guild.js");
const botFile = require("../bot");
const error = require("../utils/error");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);

module.exports = {
  name: "autorole",
  cooldown: 2,
  aliases: [],
  category: "moderation",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages))
      return;
    if (
      message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) ||
      message.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)
    ) {
      if (args[0] == "add") {
        if (args[1] != null) {
          if (message.mentions.roles.size >= 1) {
            var ar = [];
            message.mentions.roles.forEach(async (role) => {
              if (role.position == 0) return;
              await Guild.updateOne(
                {
                  guildID: message.guild.id,
                },
                {
                  $push: { autoRoleIDs: role.id },
                }
              );
              ar.push(role.id);
            });

            message.channel.send(
              template(
                LMessages.autoroleAdd,
                { roles: ar.map((x) => `\n <@&${x}>`) },
                { before: "%", after: "%" }
              )
            );
          } else {
            message.channel.send(LMessages.autoroleNotFoundOrNoMention);
          }
        } else {
          message.channel.send(LMessages.autoroleUse);
          return;
        }
      } else if (args[0] == "on") {
        await Guild.updateOne(
          {
            guildID: message.guild.id,
          },
          {
            autoroleEnabled: true,
          }
        );
        message.channel.send(LMessages.autorole.enabled);

        if (Gres.autoRoleIDs.length < 1) {
          message.channel.send(LMessages.autorole.enabledButNotSet);
        }
      } else if (args[0] == "off") {
        await Guild.updateOne(
          {
            guildID: message.guild.id,
          },
          {
            autoroleEnabled: false,
          }
        );
        message.channel.send(LMessages.autorole.disabled);
      } else {
        if (Gres.autoRoleIDs.length >= 1) {
          var roles = [];
          Gres.autoRoleIDs.forEach(async (id) => {
            var role = message.guild.roles.cache.get(id);
            if (role) {
              roles.push(role);
            } else {
              await Guild.updateOne(
                {
                  guildID: message.guild.id,
                },
                {
                  $pull: { autoRoleIDs: id },
                }
              );
            }
          });
          message.channel.send(
            template(
              LMessages.autoroleInfo,
              { role: roles.map((r) => `\n <@&${r.id}> `) },
              { before: "%", after: "%" }
            )
          );
        } else {
          message.channel.send(LMessages.autoroleNotSet);
        }
      }
    } else {
      message.channel.send(LMessages.noPermission);
    }
  },
};

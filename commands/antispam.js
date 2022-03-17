
const Discord = require("discord.js");
const Guild = require("../models/guild.js");
const botFile = require("../bot");
const config = require("../config.js");
const template = require("string-placeholder");
const error = require("../utils/error");
const LMessages = require(`../messages/`);

module.exports = {
  name: "antispam",
  cooldown: 3,
  aliases: ["as"],
  category: "moderation",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
      return;
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.channel.send(LMessages.noPermission);
    if (args[0] == null) {
      const embed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setTitle(LMessages.antispam.cmds.antispam)
        .setAuthor({
          name: config.name,
          iconURL: config.avatarUrl,
          url: config.webUrl,
        })
        .addFields(
          {
            name: LMessages.antispam.cmds.enabledLabel,
            value: Gres.spamEnabled,
            inline: true,
          },
          {
            name: LMessages.antispam.cmds.dela,
            value: Gres.spamDelay,
            inline: true,
          },
          {
            name: LMessages.antispam.cmds.tracking,
            value: Gres.spam.length + LMessages.antispam.cmds.users,
            inline: true,
          },
          {
            name: LMessages.antispam.cmds.ignor,
            value: Gres.spamIgnoreAdmins,
            inline: true,
          }
        );
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        if (message.guild.me.permissions.has("EMBED_LINKS")) {
          message.channel.send({ embeds: [embed] });
        } else {
          message.channel.send(
            LMessages.antispam.cmds.antispam +
              "\n" +
              LMessages.antispam.cmds.enabledLabel +
              " " +
              Gres.spamEnabled +
              "\n" +
              LMessages.antispam.cmds.dela +
              " " +
              Gres.spamDelay +
              "\n" +
              LMessages.antispam.cmds.tracking +
              " " +
              (Gres.spam.length + LMessages.antispam.cmds.users) +
              "\n" +
              LMessages.antispam.cmds.ignor +
              " " +
              Gres.spamIgnoreAdmins
          );
        }
      }
      return;
    } else if (args[0] == "enable") {
      if (Gres.spamEnabled) {
        message.channel.send(LMessages.antispam.cmds.alreadyEnabled);
        return;
      }
      if (Gres.spamMuteRoleID != null) {
        var role = await message.guild.roles.fetch(Gres.spamMuteRoleID);
        if (!role) {
          var roleZ = message.guild.me.roles.cache
            .filter((x) => x.managed == true)
            .first();
          if (message.guild.me.permissions.has("MANAGE_ROLES")) {
            role = await message.guild.roles.create({
              data: {
                name: "Muted",
                color: "WHITE",
                position: roleZ.position,
              },
            });

            message.guild.channels.cache
              .filter(
                (channel) =>
                  channel.type == "GUILD_TEXT" ||
                  channel.type == "GUILD_CATEGORY"
              )
              .forEach((channel) => {
                channel.createOverwrite(
                  role,
                  {
                    SEND_MESSAGES: false,
                  },
                  "Making Muted role to work here."
                );
              });
            await Guild.updateOne(
              {
                guildID: message.guild.id,
              },
              {
                spamEnabled: true,
                spamMuteRoleID: role.id,
              }
            );
          } else {
            message.channel.send(LMessages.botNoPermission);
            return;
          }
        } else {
          await Guild.updateOne(
            {
              guildID: message.guild.id,
            },
            {
              spamEnabled: true,
            }
          );
        }

        message.channel.send(
          template(
            LMessages.antispam.cmds.enabled,
            { role: `<@&${role.id}>` },
            { before: "%", after: "%" }
          )
        );
      } else {
        var roleZ = message.guild.me.roles.cache
          .filter((x) => x.managed == true)
          .first();
        if (message.guild.me.permissions.has("MANAGE_ROLES")) {
          role = await message.guild.roles.create({
            data: {
              name: "Muted",
              color: "WHITE",
              position: roleZ.position,
            },
          });

          message.guild.channels.cache
            .filter(
              (channel) =>
                channel.type == "GUILD_TEXT" || channel.type == "GUILD_CATEGORY"
            )
            .forEach((channel) => {
              channel.permissionOverwrites.create(
                role,
                {
                  SEND_MESSAGES: false,
                },
                {
                  reason: "Making Muted role to work here.",
                }
              );
            });
          await Guild.updateOne(
            {
              guildID: message.guild.id,
            },
            {
              spamEnabled: true,
              spamMuteRoleID: role.id,
            }
          );
        } else {
          message.channel.send(LMessages.botNoPermission);
          return;
        }

        message.channel.send(
          template(
            LMessages.antispam.cmds.enabled,
            { role: `<@&${role.id}>` },
            { before: "%", after: "%" }
          )
        );
      }
    } else if (args[0] == "disable") {
      if (!Gres.spamEnabled) {
        message.channel.send(LMessages.antispam.cmds.alreadyDisabled);

        return;
      }
      var role = await message.guild.roles.fetch(Gres.spamMuteRoleID);
      if (role) {
        if (message.guild.me.permissions.has("MANAGE_ROLES")) {
          role.delete("Antispam function disabling.");
        } else {
          message.channel.send(LMessages.botNoPermission);
          return;
        }
      }
      await Guild.updateOne(
        {
          guildID: message.guild.id,
        },
        {
          spamEnabled: false,
          spamMuteRoleID: null,
        }
      );

      message.channel.send(LMessages.antispam.cmds.disabled);
    } else if (args[0] == "reset") {
      if (message.mentions.members.size >= 1 || message.mentions.everyone) {
        if (message.mentions.everyone) {
          await Guild.updateOne(
            {
              guildID: message.guild.id,
            },
            {
              spam: [],
            }
          );

          message.channel.send(LMessages.antispam.cmds.allReset);
        } else {
          var c = 0;
          message.mentions.members.forEach(async (member) => {
            let spam = Gres.spam;
            var obj = spam.filter((e) => e.userID == member.user.id)[0];
            if (obj) {
              await Guild.updateOne(
                { guildID: message.guild.id },
                { $pull: { spam: obj } }
              );
            }
            c += 1;
          });

          message.channel.send(
            template(
              LMessages.antispam.cmds.reset,
              { count: c },
              { before: "%", after: "%" }
            )
          );
        }
      } else {
        message.channel.send(LMessages.antispam.cmds.resetUse);

        return;
      }
    } else if (args[0] == "delay") {
      if (args[1]) {
        if (isNaN(Number(args[1]))) {
          message.channel.send(LMessages.antispam.cmds.invalidNumber);
        } else {
          await Guild.updateOne(
            {
              guildID: message.guild.id,
            },
            {
              spamDelay: Number(args[1]),
            }
          );

          message.channel.send(
            template(
              LMessages.antispam.cmds.delaySet,
              { delay: Number(args[1]) },
              { before: "%", after: "%" }
            )
          );
        }
      } else {
        message.channel.send(
          template(
            LMessages.antispam.cmds.delay,
            { delay: Gres.spamDelay },
            { before: "%", after: "%" }
          )
        );
      }
    } else if (args[0] == "ignoreadmins") {
      if (args[1]) {
        if (args[1] == "true" || args[1] == "false") {
          await Guild.updateOne(
            {
              guildID: message.guild.id,
            },
            {
              spamIgnoreAdmins: args[1] == "true" ? true : false,
            }
          );

          message.channel.send(
            template(
              LMessages.antispam.cmds.ignoreAdminsSet,
              { boolean: args[1] },
              { before: "%", after: "%" }
            )
          );
        } else {
          message.channel.send(LMessages.antispam.cmds.useBoolean);

          return;
        }
      } else {
        message.channel.send(
          template(
            LMessages.antispam.cmds.ignoreAdmins,
            { boolean: Gres.spamIgnoreAdmins.toString() },
            { before: "%", after: "%" }
          )
        );
      }
    }
  },
};

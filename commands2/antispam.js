
const Discord = require("discord.js");
const Guild = require("../models/guild.js");
const botFile = require("../bot");
const config = require("../config.js");
const template = require("string-placeholder");
const error = require("../utils/error");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "antispam",
  cooldown: 3,
  aliases: ["as"],
  category: "moderation",
  async execute(int, serverQueue, Gres) {
    if (int.member.permissions.has("ADMINISTRATOR")) {
      if (!int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES"))
        return;
      if (int.options.getSubcommand() == "info") {
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
              value: Gres.spamEnabled ? "Enabled" : "Disabled",
              inline: true,
            },
            {
              name: LMessages.antispam.cmds.dela,
              value: Gres.spamDelay.toString(),
              inline: true,
            },
            {
              name: LMessages.antispam.cmds.tracking,
              value:
                Gres.spam.length.toString() + LMessages.antispam.cmds.users,
              inline: true,
            },
            {
              name: LMessages.antispam.cmds.ignor,
              value: Gres.spamIgnoreAdmins ? "Ignoring" : "Not ignoring",
              inline: true,
            }
          );
        if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
          if (int.guild.me.permissions.has("EMBED_LINKS")) {
            followReply(int, { embeds: [embed] });
          } else {
            followReply(int, {
              content:
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
                Gres.spamIgnoreAdmins,
            });
          }
        }
        return;
      } else if (int.options.getSubcommand() == "enable") {
        if (Gres.spamEnabled) {
          followReply(int, { content: LMessages.antispam.cmds.alreadyEnabled });
          return;
        }
        if (Gres.spamMuteRoleID != null) {
          var role = await int.guild.roles.fetch(Gres.spamMuteRoleID);
          if (!role) {
            var roleZ = int.guild.me.roles.cache
              .filter((x) => x.managed == true)
              .first();
            if (int.guild.me.permissions.has("MANAGE_ROLES")) {
              role = await int.guild.roles.create({
                data: {
                  name: "Muted",
                  color: "WHITE",
                  position: roleZ.position,
                },
              });

              int.guild.channels.cache
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
                  guildID: int.guild.id,
                },
                {
                  spamEnabled: true,
                  spamMuteRoleID: role.id,
                }
              );
            } else {
              followReply(int, { content: LMessages.botNoPermission });
              return;
            }
          } else {
            await Guild.updateOne(
              {
                guildID: int.guild.id,
              },
              {
                spamEnabled: true,
              }
            );
          }

          followReply(int, {
            content: template(
              LMessages.antispam.cmds.enabled,
              { role: `<@&${role.id}>` },
              { before: "%", after: "%" }
            ),
          });
        } else {
          var roleZ = int.guild.me.roles.cache
            .filter((x) => x.managed == true)
            .first();
          if (int.guild.me.permissions.has("MANAGE_ROLES")) {
            role = await int.guild.roles.create({
              data: {
                name: "Muted",
                color: "WHITE",
                position: roleZ.position,
              },
            });

            int.guild.channels.cache
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
                guildID: int.guild.id,
              },
              {
                spamEnabled: true,
                spamMuteRoleID: role.id,
              }
            );
          } else {
            followReply(int, { content: LMessages.botNoPermission });
            return;
          }

          followReply(int, {
            content: template(
              LMessages.antispam.cmds.enabled,
              { role: `<@&${role.id}>` },
              { before: "%", after: "%" }
            ),
          });
        }
      } else if (int.options.getSubcommand() == "disable") {
        if (!Gres.spamEnabled) {
          followReply(int, {
            content: LMessages.antispam.cmds.alreadyDisabled,
          });

          return;
        }
        var role = await int.guild.roles.fetch(Gres.spamMuteRoleID);
        if (role) {
          if (int.guild.me.permissions.has("MANAGE_ROLES")) {
            role.delete("Antispam function disabling.");
          } else {
            followReply(int, { content: LMessages.botNoPermission });
            return;
          }
        }
        await Guild.updateOne(
          {
            guildID: int.guild.id,
          },
          {
            spamEnabled: false,
            spamMuteRoleID: null,
          }
        );

        followReply(int, { content: LMessages.antispam.cmds.disabled });
      } else if (int.options.getSubcommand() == "reset") {
        var c = 0;
        for (var i = 1; i <= 9; i++) {
          var member = int.options.get(`member${i}`).user;
          if (!member) break;
          c += 1;
          let spam = Gres.spam;
          var obj = spam.filter((e) => e.userID == member.user.id)[0];
          if (obj) {
            await Guild.updateOne(
              { guildID: int.guild.id },
              { $pull: { spam: obj } }
            );
          }
        }
        if (c == 0) {
          followReply(int, {
            content: LMessages.antispam.cmds.notFoundOrNoMention,
          });
          return;
        }
        followReply(int, {
          content: template(
            LMessages.antispam.cmds.reset,
            { count: c },
            { before: "%", after: "%" }
          ),
        });
      } else if (int.options.getSubcommand() == "delay") {
        if (int.options.get("delay").value) {
          if (isNaN(Number(int.options.get("delay").value))) {
            followReply(int, {
              content: LMessages.antispam.cmds.invalidNumber,
            });
          } else {
            await Guild.updateOne(
              {
                guildID: int.guild.id,
              },
              {
                spamDelay: Number(int.options.get("delay").value),
              }
            );

            followReply(int, {
              content: template(
                LMessages.antispam.cmds.delaySet,
                { delay: Number(int.options.get("delay").value) },
                { before: "%", after: "%" }
              ),
            });
          }
        } else {
          followReply(int, {
            content: template(
              LMessages.antispam.cmds.delay,
              { delay: Gres.spamDelay },
              { before: "%", after: "%" }
            ),
          });
        }
      } else if (int.options.getSubcommand() == "ignoreadmins") {
        if (int.options.get("option").value) {
          await Guild.updateOne(
            {
              guildID: int.guild.id,
            },
            {
              spamIgnoreAdmins:
                int.options.get("option").value == 1 ? true : false,
            }
          );

          followReply(int, {
            content: template(
              LMessages.antispam.cmds.ignoreAdminsSet,
              {
                boolean:
                  int.options.get("option").value == 1
                    ? "Ignore"
                    : "Don't ignore",
              },
              { before: "%", after: "%" }
            ),
          });
        } else {
          followReply(int, {
            content: template(
              LMessages.antispam.cmds.ignoreAdmins,
              { boolean: Gres.spamIgnoreAdmins.toString() },
              { before: "%", after: "%" }
            ),
          });
        }
      }
    } else {
      followReply(int, { content: LMessages.noPermission });
    }
  },
};

const Discord = require("discord.js");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "clear",
  cooldown: 5,
  aliases: ["c"],
  category: "other",
  async execute(int, serverQueue, Gres) {
    if (
      int.member.permissions.has(Discord.PermissionFlagsBits.Administrator) ||
      int.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages) ||
      int.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)
    ) {
      if (!isNaN(Number(int.options.get("amount").value))) {
        if (
          Number(int.options.get("amount").value) > 100 ||
          Number(int.options.get("amount").value) < 1
        ) {
          followReply(int, { content: LMessages.clear.wrongNumber });

          return;
        } else {
          let msg = await followReply(int, {
            content: LMessages.clear.fetching,
          });

          const messages = await int.channel.messages.fetch({
            limit: Number(int.options.get("amount").value),
          });
          if (
            int.guild.members.me.permissions.has(
              Discord.PermissionFlagsBits.ManageMessages
            )
          ) {
            await msg.edit(LMessages.clear.deleting);
          } else {
            followReply(int, { content: LMessages.botNoPermission });
            return;
          }
          const secMessages = messages.filter(
            (v) =>
              Date.now() - v.createdTimestamp < 1209595000 &&
              v.deletable == true
          );
          if (
            int.guild.members.me.permissions.has(
              Discord.PermissionFlagsBits.ManageMessages
            )
          ) {
            int.channel.bulkDelete(secMessages).catch((err) => {
              if (err.code != 10008) {
                console.error(err);
              }
            });
          } else {
            followReply(int, { content: LMessages.botNoPermission });
            return;
          }
          if (msg) {
            if (msg.deletable) {
              if (
                int.guild.members.me.permissions.has(
                  Discord.PermissionFlagsBits.ManageMessages
                )
              ) {
                await msg.delete().catch((err) => {
                  if (err.code != 10008) {
                    console.error(err);
                  }
                });
              } else {
                followReply(int, { content: LMessages.botNoPermission });
                return;
              }
            }
          }
          if (messages.size != secMessages.size) {
            let msg2 = await followReply(int, {
              content: LMessages.clear.oldMessages,
            });
            if (msg2) {
              if (msg2.deletable) {
                if (
                  int.guild.members.me.permissions.has(
                    Discord.PermissionFlagsBits.ManageMessages
                  )
                ) {
                  await msg2.delete({ timeout: 5000 }).catch((err) => {
                    if (err.code != 10008) {
                      console.error(err);
                    }
                  });
                } else {
                  followReply(int, { content: LMessages.botNoPermission });
                  return;
                }
              }
            }
          }
        }
      } else {
        int.channel.send(LMessages.clear.wrongNumber);

        return;
      }
    } else {
      int.channel.send(LMessages.noPermission);

      return;
    }
  },
};

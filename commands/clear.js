const Discord = require("discord.js");
const LMessages = require(`../messages/`);

module.exports = {
  name: "clear",
  cooldown: 5,
  aliases: ["c"],
  category: "other",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (
      message.member.permissions.has(
        Discord.PermissionFlagsBits.Administrator
      ) ||
      message.member.permissions.has(
        Discord.PermissionFlagsBits.ManageMessages
      ) ||
      message.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)
    ) {
      if (args[0] != null) {
        if (!isNaN(Number(args[0]))) {
          if (Number(args[0]) > 100 || Number(args[0]) < 1) {
            message.channel.send(LMessages.clear.wrongNumber);

            return;
          } else {
            let msg = await message.channel.send(LMessages.clear.fetching);

            const messages = await message.channel.messages.fetch({
              limit: Number(args[0]),
            });
            if (
              message.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.ManageMessages
              )
            ) {
              await msg.edit(LMessages.clear.deleting);
            } else {
              message.channel.send(LMessages.botNoPermission);
              return;
            }
            const secMessages = messages.filter(
              (v) =>
                Date.now() - v.createdTimestamp < 1209595000 &&
                v.deletable == true
            );
            if (
              message.guild.members.me.permissions.has(
                Discord.PermissionFlagsBits.ManageMessages
              )
            ) {
              message.channel.bulkDelete(secMessages).catch((err) => {
                if (err.code != 10008) {
                  console.error(err);
                }
              });
            } else {
              message.channel.send(LMessages.botNoPermission);
              return;
            }
            if (msg) {
              if (msg.deletable) {
                if (
                  message.guild.members.me.permissions.has(
                    Discord.PermissionFlagsBits.ManageMessages
                  )
                ) {
                  await msg.delete().catch((err) => {
                    if (err.code != 10008) {
                      console.error(err);
                    }
                  });
                } else {
                  message.channel.send(LMessages.botNoPermission);
                  return;
                }
              }
            }
            if (messages.size != secMessages.size) {
              let msg2 = await message.channel.send(
                LMessages.clear.oldMessages
              );
              if (msg2) {
                if (msg2.deletable) {
                  if (
                    message.guild.members.me.permissions.has(
                      Discord.PermissionFlagsBits.ManageMessages
                    )
                  ) {
                    await msg2.delete({ timeout: 5000 }).catch((err) => {
                      if (err.code != 10008) {
                        console.error(err);
                      }
                    });
                  } else {
                    message.channel.send(LMessages.botNoPermission);
                    return;
                  }
                }
              }
            }
          }
        } else {
          message.channel.send(LMessages.clear.wrongNumber);

          return;
        }
      } else {
        message.channel.send(LMessages.clear.use);
      }
    } else {
      message.channel.send(LMessages.noPermission);

      return;
    }
  },
};

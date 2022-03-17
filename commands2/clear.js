
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "clear",
  cooldown: 5,
  aliases: ["c"],
  category: "other",
  async execute(int, serverQueue, Gres) {
    if (
      int.member.permissions.has("ADMINISTRATOR") ||
      int.member.permissions.has("MANAGE_MESSAGES") ||
      int.member.permissions.has("MANAGE_CHANNELS")
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
          if (int.guild.me.permissions.has("MANAGE_MESSAGES")) {
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
          if (int.guild.me.permissions.has("MANAGE_MESSAGES")) {
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
              if (int.guild.me.permissions.has("MANAGE_MESSAGES")) {
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
                if (int.guild.me.permissions.has("MANAGE_MESSAGES")) {
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

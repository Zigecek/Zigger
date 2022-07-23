const Discord = require("discord.js");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);
const { followReply } = require("../utils/functions");

module.exports = {
  name: "invite",
  cooldown: 3,
  aliases: [],
  category: "other",
  execute(int, serverQueue, Gres) {
    if (
      !int.channel
        .permissionsFor(int.guild.members.me)
        .has(Discord.PermissionFlagsBits.SendMessages)
    )
      return;
    if (
      !int.member.voice.channel
        ?.permissionsFor(int.guild.members.me)
        .has(Discord.PermissionFlagsBits.CreateInstantInvite) ||
      !int.guild.members.me.permissions.has(
        Discord.PermissionFlagsBits.CreateInstantInvite
      )
    ) {
      followReply(int, { content: LMessages.botNoPermission });

      return;
    }
    if (int.member.voice.channel) {
      int.member.voice.channel
        .createInvite({
          maxAge: 86400,
          maxUses: 10,
          unique: true,
          reason: "Created invite for request.",
        })
        .then((invite) => {
          followReply(int, {
            content: template(
              LMessages.newInvite,
              { url: invite.url },
              { before: "%", after: "%" }
            ),
          });
        });
    } else {
      int.channel
        .createInvite({
          maxAge: 86400,
          maxUses: 10,
          unique: true,
          reason: "Created invite for request.",
        })
        .then((invite) => {
          followReply(int, {
            content: template(
              LMessages.newInvite,
              { url: invite.url },
              { before: "%", after: "%" }
            ),
          });
        });
    }
  },
};

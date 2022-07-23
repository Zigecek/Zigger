const Discord = require("discord.js");
const template = require("string-placeholder");
const LMessages = require(`../messages/`);

module.exports = {
  name: "invite",
  cooldown: 3,
  aliases: [],
  category: "other",
  execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (
      !message.channel
        .permissionsFor(message.guild.members.me)
        .has(Discord.PermissionFlagsBits.SendMessages)
    )
      return;
    if (
      !message.member.voice.channel
        ?.permissionsFor(message.guild.members.me)
        .has(Discord.PermissionFlagsBits.CreateInstantInvite) ||
      !message.guild.members.me.permissions.has(
        Discord.PermissionFlagsBits.CreateInstantInvite
      )
    ) {
      message.channel.send(LMessages.botNoPermission);

      return;
    }
    if (message.member.voice.channel) {
      message.member.voice.channel
        .createInvite({
          maxAge: 86400,
          maxUses: 10,
          unique: true,
          reason: "Created invite for request.",
        })
        .then((invite) => {
          message.channel.send(
            template(
              LMessages.newInvite,
              { url: invite.url },
              { before: "%", after: "%" }
            )
          );
        });
    } else {
      message.channel
        .createInvite({
          maxAge: 86400,
          maxUses: 10,
          unique: true,
          reason: "Created invite for request.",
        })
        .then((invite) => {
          message.channel.send(
            template(
              LMessages.newInvite,
              { url: invite.url },
              { before: "%", after: "%" }
            )
          );
        });
    }
  },
};

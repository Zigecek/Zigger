
const music = require("../music");
const LMessages = require(`../../messages/`);
const voice = require('@discordjs/voice');

module.exports = {
  name: "disconnect",
  cooldown: 1,
  aliases: ["dis", "dc", "leave"],
  category: "music",
  execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (
      !message.member.voice.channel ||
      message.member.voice.channel != message.guild.members.me.voice.channel
    ) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)
      ) {
        message.channel.send(LMessages.music.need.toBeInVoiceWithBot);
      }
      return;
    }

    if (serverQueue) {
      if (serverQueue.connection) {
        if (
          serverQueue.connection.state.status !==
          voice.VoiceConnectionStatus.Destroyed
        ) {
          serverQueue.connection.destroy();
        }
      }
    }

    if (message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
      message.channel.send(LMessages.music.otherCmds.disconnect);
    }
  },
};

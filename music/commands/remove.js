
const template = require("string-placeholder");
const LMessages = require(`../../messages/`);

module.exports = {
  name: "remove",
  cooldown: 3,
  aliases: ["rm"],
  category: "music",
  execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (
      !message.member.voice.channel ||
      message.member.voice.channel != message.guild.members.me.voice.channel
    ) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.need.toBeInVoiceWithBot);
      }
      return;
    }

    if (!serverQueue) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.musicNothingPlaying);
      }
      return;
    }

    if (!isNaN(Number(args[0]))) {
      if (Number(args[0]) > 0) {
        if (serverQueue.songs[Number(args[0])]) {
          if (
            message.channel
              .permissionsFor(message.guild.members.me)
              .has("SEND_MESSAGES")
          ) {
            message.channel.send(
              template(
                LMessages.music.remove.removed,
                { title: serverQueue.songs[Number(args[0])].title },
                { before: "%", after: "%" }
              )
            );
          }
          serverQueue.songs.splice(Number(args[0]), 1);
        } else {
          if (
            message.channel
              .permissionsFor(message.guild.members.me)
              .has("SEND_MESSAGES")
          ) {
            message.channel.send(LMessages.music.remove.songNotExist);
          }
          return;
        }
      } else {
        if (
          message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")
        ) {
          message.channel.send(LMessages.music.remove.invalidNumber);
        }
        return;
      }
    } else {
      if (
        message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.remove.use);
      }
      return;
    }
  },
};

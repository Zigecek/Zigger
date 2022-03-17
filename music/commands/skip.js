
const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);
const template = require("string-placeholder");

module.exports = {
  name: "skip",
  cooldown: 3,
  aliases: ["fs", "forceskip"],
  category: "music",
  execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (
      !message.member.voice.channel ||
      message.member.voice.channel != message.guild.me.voice.channel
    ) {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.need.toBeInVoiceWithBot);
      }
      return;
    }

    if (!serverQueue) {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.musicNothingPlaying);
      }
      return;
    }

    if (args[0]) {
      var number = isNaN(Number(args[0])) ? false : Number(args[0]);
      if (number > 0) {
        if (number != 1) {
          let song1 = serverQueue.songs.shift();
          serverQueue.songs.splice(0, number - 1);
          serverQueue.songs = [song1].concat(serverQueue.songs);
        }
      } else {
        if (
          message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        ) {
          message.channel.send(LMessages.music.invalidNumber);
        }
        return;
      }
    }

    if (serverQueue) {
      if (serverQueue.audioPlayer) {
        serverQueue.audioPlayer.stop();
        serverQueue.audioPlayer.unpause();
      }
    }

    if (message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
      message.channel.send(LMessages.music.skip.FSkipped);
    }
  },
};


const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);

module.exports = {
  name: "stop",
  cooldown: 2,
  aliases: [],
  category: "music",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
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

    if (serverQueue.songs?.length > 0) {
      serverQueue.songs = [];
      if (serverQueue.audioPlayer) {
        serverQueue.audioPlayer.stop();
        serverQueue.audioPlayer.unpause();
      }
    } else {
      if (
        message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.musicNothingPlaying);
      }
    }
    await Guild.updateOne(
      {
        guildID: message.guild.id,
      },
      {
        musicBotPaused: false,
        musicBotPlaying: false,
      }
    );

    if (message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
      message.channel.send(LMessages.music.otherCmds.stopped);
    }
  },
};

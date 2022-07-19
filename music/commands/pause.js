
const error = require("../../utils/error");
const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);

module.exports = {
  name: "pause",
  cooldown: 1,
  aliases: [],
  category: "music",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (!message.member.voice.channel) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.need.toBeInVoice);
      }
      return;
    }
    if (serverQueue.songs?.length == 0) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.musicNothingPlaying);
      }
      return;
    }
    const elMsecs = Date.now() - Gres.musicBotPlayTime.getTime();
    await Guild.updateOne(
      {
        guildID: message.guild.id,
      },
      {
        musicBotPaused: true,
        musicBotPlaying: false,
        musicBotPauseElapsed: elMsecs,
      }
    );
    if (serverQueue) {
      if (serverQueue.audioPlayer) {
        serverQueue.audioPlayer.pause(true);
      }
    }
    if (message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")) {
      message.channel.send(LMessages.music.otherCmds.pause);
    }
  },
};

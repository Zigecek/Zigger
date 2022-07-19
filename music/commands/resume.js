
const error = require("../../utils/error");
const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);

module.exports = {
  name: "resume",
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
    if (!serverQueue) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.musicNothingPlaying);
      }
      return;
    }
    await Guild.updateOne(
      {
        guildID: message.guild.id,
      },
      {
        musicBotPaused: false,
        musicBotPlaying: true,
        musicBotPauseElapsed: 0,
        musicBotPlayTime: new Date(
          Date.now() - Gres.musicBotPauseElapsed
        ),
      }
    );
    if (serverQueue) {
      if (serverQueue.audioPlayer) {
        serverQueue.audioPlayer.unpause();
      }
    }

    if (message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")) {
      message.channel.send(LMessages.music.otherCmds.resume);
    }
  },
};

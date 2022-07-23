const Discord = require("discord.js");
const error = require("../../utils/error");
const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "pause",
  cooldown: 1,
  aliases: [],
  category: "music",
  async execute(int, serverQueue, Gres) {
    if (!int.member.voice.channel) {
      if (
        int.channel
          .permissionsFor(int.guild.members.me)
          .has(Discord.PermissionFlagsBits.SendMessages)
      ) {
        followReply(int, { content: LMessages.music.need.toBeInVoice });
      }
      return;
    }
    if (serverQueue.songs.length == 0) {
      if (
        int.channel
          .permissionsFor(int.guild.members.me)
          .has(Discord.PermissionFlagsBits.SendMessages)
      ) {
        followReply(int, { content: LMessages.musicNothingPlaying });
      }
      return;
    }
    const elMsecs = Date.now() - Gres.musicBotPlayTime.getTime();
    await Guild.updateOne(
      {
        guildID: int.guild.id,
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
    if (
      int.channel
        .permissionsFor(int.guild.members.me)
        .has(Discord.PermissionFlagsBits.SendMessages)
    ) {
      followReply(int, { content: LMessages.music.otherCmds.pause });
    }
  },
};

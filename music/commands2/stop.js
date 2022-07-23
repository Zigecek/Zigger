const Discord = require("discord.js");
const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "stop",
  cooldown: 2,
  aliases: [],
  category: "music",
  async execute(int, serverQueue, Gres) {
    if (
      !int.member.voice.channel ||
      int.member.voice.channel != int.guild.members.me.voice.channel
    ) {
      if (
        int.channel
          .permissionsFor(int.guild.members.me)
          .has(Discord.PermissionFlagsBits.SendMessages)
      ) {
        followReply(int, { content: LMessages.music.need.toBeInVoiceWithBot });
      }
      return;
    }

    if (serverQueue.songs.length != 0) {
      serverQueue.songs = [];
      if (serverQueue.audioPlayer) {
        serverQueue.audioPlayer.stop();
        serverQueue.audioPlayer.unpause();
      }
    } else {
      if (
        int.channel
          .permissionsFor(int.guild.members.me)
          .has(Discord.PermissionFlagsBits.SendMessages)
      ) {
        followReply(int, { content: LMessages.musicNothingPlaying });
      }
    }
    await Guild.updateOne(
      {
        guildID: int.guild.id,
      },
      {
        musicBotPaused: false,
        musicBotPlaying: false,
      }
    );

    if (
      int.channel
        .permissionsFor(int.guild.members.me)
        .has(Discord.PermissionFlagsBits.SendMessages)
    ) {
      followReply(int, { content: LMessages.music.otherCmds.stopped });
    }
  },
};

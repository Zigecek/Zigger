
const error = require("../../utils/error");
const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "loop",
  cooldown: 2,
  aliases: [],
  category: "music",
  async execute(int, serverQueue, Gres) {
    if (
      !int.member.voice.channel ||
      int.member.voice.channel != int.guild.members.me.voice.channel
    ) {
      if (int.channel.permissionsFor(int.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
        followReply(int, { content: LMessages.music.need.toBeInVoiceWithBot });
      }
      return;
    }
    if (!serverQueue) {
      if (int.channel.permissionsFor(int.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
        followReply(int, { content: LMessages.musicNothingPlaying });
      }
      return;
    }

    await Guild.updateOne(
      {
        guildID: int.guild.id,
      },
      {
        musicBotLoop: !Gres.musicBotLoop,
      }
    );

    if (Gres.musicBotLoop == true) {
      if (int.channel.permissionsFor(int.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
        followReply(int, { content: LMessages.music.loop.disabled });
      }
    } else if (Gres.musicBotLoop == false) {
      if (int.channel.permissionsFor(int.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
        followReply(int, { content: LMessages.music.loop.enabled });
      }
    }
  },
};

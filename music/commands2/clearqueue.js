
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "clearqueue",
  cooldown: 2,
  aliases: ["queueclear"],
  category: "music",
  execute(int, serverQueue, Gres) {
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

    serverQueue.songs.splice(1, serverQueue.songs.length - 1);

    if (int.channel.permissionsFor(int.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
      followReply(int, { content: LMessages.music.queue.cleared });
    }
  },
};

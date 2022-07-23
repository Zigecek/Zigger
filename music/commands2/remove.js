
const template = require("string-placeholder");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "remove",
  cooldown: 3,
  aliases: ["rm"],
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

    var pageNum = int.options.get("index") ? Number(int.options.get("index")?.value) : NaN;

    if (!isNaN(pageNum)) {
      if (pageNum > 0) {
        if (serverQueue.songs[pageNum]) {
          if (int.channel.permissionsFor(int.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
            followReply(int, {
              content: template(
                LMessages.music.remove.removed,
                {
                  title:
                    serverQueue.songs[pageNum]
                      .title,
                },
                { before: "%", after: "%" }
              ),
            });
          }
          serverQueue.songs.splice(pageNum, 1);
        } else {
          if (int.channel.permissionsFor(int.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
            followReply(int, { content: LMessages.music.remove.songNotExist });
          }
          return;
        }
      } else {
        if (int.channel.permissionsFor(int.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
          followReply(int, { content: LMessages.music.remove.invalidNumber });
        }
        return;
      }
    } else {
      if (int.channel.permissionsFor(int.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
        followReply(int, { content: LMessages.music.remove.use });
      }
      return;
    }
  },
};

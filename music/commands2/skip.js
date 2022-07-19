
const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "skip",
  cooldown: 3,
  aliases: ["fs", "forceskip"],
  category: "music",
  execute(int, serverQueue, Gres) {
    if (
      !int.member.voice.channel ||
      int.member.voice.channel != int.guild.members.me.voice.channel
    ) {
      if (int.channel.permissionsFor(int.guild.members.me).has("SEND_MESSAGES")) {
        followReply(int, { content: LMessages.music.need.toBeInVoiceWithBot });
      }
      return;
    }

    if (!serverQueue) {
      if (int.channel.permissionsFor(int.guild.members.me).has("SEND_MESSAGES")) {
        followReply(int, { content: LMessages.musicNothingPlaying });
      }
      return;
    }

    if (int.options.get("count")?.value) {
      var number = isNaN(Number(int.options.get("count").value))
        ? false
        : Number(int.options.get("count").value);
      if (number > 0) {
        if (number != 1) {
          let song1 = serverQueue.songs.shift();
          serverQueue.songs.splice(0, number - 1);
          serverQueue.songs = [song1].concat(serverQueue.songs);
        }
      } else {
        if (int.channel.permissionsFor(int.guild.members.me).has("SEND_MESSAGES")) {
          followReply(int, { content: LMessages.music.invalidNumber });
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

    if (int.channel.permissionsFor(int.guild.members.me).has("SEND_MESSAGES")) {
      followReply(int, { content: LMessages.music.skip.FSkipped });
    }
  },
};

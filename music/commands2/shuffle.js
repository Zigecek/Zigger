
const functions = require("../../utils/functions");
const LMessages = require(`../../messages/`);
const { followReply } = require("../../utils/functions");

module.exports = {
  name: "shuffle",
  cooldown: 2,
  aliases: [],
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

    let song1 = serverQueue.songs.shift();
    serverQueue.songs = [song1].concat(functions.shuffle(serverQueue.songs));
    if (int.channel.permissionsFor(int.guild.members.me).has("SEND_MESSAGES")) {
      followReply(int, { content: LMessages.music.queue.shuffled });
    }
  },
};

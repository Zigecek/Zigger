
const music = require("../music");
const LMessages = require(`../../messages`);
const { followReply } = require("../../utils/functions");
const voice = require('@discordjs/voice');

module.exports = {
  name: "leave",
  cooldown: 1,
  aliases: [],
  category: "music",
  execute(int, serverQueue, Gres) {
    if (
      !int.member.voice.channel ||
      int.member.voice.channel != int.guild.me.voice.channel
    ) {
      if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
        followReply(int, { content: LMessages.music.need.toBeInVoiceWithBot });
      }
      return;
    }

    if (serverQueue) {
      if (serverQueue.connection) {
        if (
          serverQueue.connection.state.status !==
          voice.VoiceConnectionStatus.Destroyed
        ) {
          serverQueue.connection.destroy();
        }
      }
    }

    if (int.channel.permissionsFor(int.guild.me).has("SEND_MESSAGES")) {
      followReply(int, { content: LMessages.music.otherCmds.disconnect });
    }
  },
};

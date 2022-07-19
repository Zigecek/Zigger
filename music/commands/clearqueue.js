
const LMessages = require(`../../messages/`);

module.exports = {
  name: "clearqueue",
  cooldown: 2,
  aliases: ["queueclear"],
  category: "music",
  execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (
      !message.member.voice.channel ||
      message.member.voice.channel != message.guild.members.me.voice.channel
    ) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.need.toBeInVoiceWithBot);
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

    serverQueue.songs.splice(1, serverQueue.songs.length - 1);

    if (message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")) {
      message.channel.send(LMessages.music.queue.cleared);
    }
  },
};

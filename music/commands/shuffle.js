
const functions = require("../../utils/functions");
const LMessages = require(`../../messages/`);

module.exports = {
  name: "shuffle",
  cooldown: 2,
  aliases: [],
  category: "music",
  execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (
      !message.member.voice.channel ||
      message.member.voice.channel != message.guild.members.me.voice.channel
    ) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)
      ) {
        message.channel.send(LMessages.music.need.toBeInVoiceWithBot);
      }
      return;
    }
    if (!serverQueue) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)
      ) {
        message.channel.send(LMessages.musicNothingPlaying);
      }
      return;
    }

    let song1 = serverQueue.songs.shift();
    serverQueue.songs = [song1].concat(functions.shuffle(serverQueue.songs));
    if (message.channel.permissionsFor(message.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
      message.channel.send(LMessages.music.queue.shuffled);
    }
  },
};

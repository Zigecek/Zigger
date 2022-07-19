
const error = require("../../utils/error");
const Guild = require("../../models/guild");
const LMessages = require(`../../messages/`);

module.exports = {
  name: "queueloop",
  cooldown: 2,
  aliases: ["loopqueue"],
  category: "music",
  async execute(message, serverQueue, args, Gres, prefix, command, isFS) {
    if (
      !message.member.voice.channel ||
      message.member.voice.channel != message.guild.members.me.voice.channel
    ) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.need.toBeInVoiceWithBot);
      }
    }

    if (!serverQueue) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.musicNothingPlaying);
      }
      return;
    }

    await Guild.updateOne(
      {
        guildID: message.guild.id,
      },
      {
        musicBotQueueLoop: !Gres.musicBotQueueLoop,
      }
    );

    if (Gres.musicBotQueueLoop == true) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.loop.queue.disabled);
      }
    } else if (Gres.musicBotQueueLoop == false) {
      if (
        message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")
      ) {
        message.channel.send(LMessages.music.loop.queue.enabled);
      }
    }
  },
};
